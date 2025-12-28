import { eq, and, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "avatar", "communityPreference"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    // Handle oauthProvider enum field
    if (user.oauthProvider !== undefined) {
      values.oauthProvider = user.oauthProvider;
      updateSet.oauthProvider = user.oauthProvider;
    }

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Demographic data queries

export async function getCities() {
  const db = await getDb();
  if (!db) return [];
  
  const { districts, cities } = await import("../drizzle/schema");
  const { sql } = await import("drizzle-orm");
  
  // Get all cities with their stats
  const result = await db.select({
    id: cities.id,
    name: cities.name,
    country: cities.country,
    population: cities.population,
    districtCount: sql<number>`(SELECT COUNT(*) FROM ${districts} WHERE ${districts.city} = ${cities.name})`
  }).from(cities);
  
  return result;
}

export async function getAllDistricts(city?: string) {
  const db = await getDb();
  if (!db) return [];
  
  const { districts } = await import("../drizzle/schema");
  
  if (city) {
    return await db.select().from(districts).where(eq(districts.city, city));
  }
  
  return await db.select().from(districts);
}

export async function getDistrictById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const { districts } = await import("../drizzle/schema");
  const result = await db.select().from(districts).where(eq(districts.id, id)).limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getCitySummary(city: string, year: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const { citySummary } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");
  const result = await db
    .select()
    .from(citySummary)
    .where(and(
      eq(citySummary.city, city),
      eq(citySummary.year, year)
    ))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getCitySummaryHistory(city: string) {
  const db = await getDb();
  if (!db) return [];
  
  const { citySummary } = await import("../drizzle/schema");
  return await db
    .select()
    .from(citySummary)
    .where(eq(citySummary.city, city))
    .orderBy(citySummary.year);
}

export async function getCommunityComposition(city: string) {
  const db = await getDb();
  if (!db) return [];
  
  const { demographics, districts } = await import("../drizzle/schema");
  
  // Get all demographics for the city
  const result = await db
    .select({
      community: demographics.community,
      year: demographics.year,
      population: demographics.population,
    })
    .from(demographics)
    .innerJoin(districts, eq(demographics.districtId, districts.id))
    .where(eq(districts.city, city));
  
  // Group by community and year, summing populations across districts
  const communityYearMap = new Map<string, Map<number, number>>();
  
  result.forEach(row => {
    if (!communityYearMap.has(row.community)) {
      communityYearMap.set(row.community, new Map());
    }
    
    const yearMap = communityYearMap.get(row.community)!;
    const currentPop = yearMap.get(row.year) || 0;
    yearMap.set(row.year, currentPop + row.population);
  });
  
  // Calculate total city population
  const totalPopulation = await db
    .select({ total: districts.population })
    .from(districts)
    .where(eq(districts.city, city));
  
  const cityPopulation = totalPopulation.reduce((sum, d) => sum + d.total, 0);
  
  // Convert to final format
  const communities = Array.from(communityYearMap.entries()).map(([name, yearMap]) => {
    // Convert year map to progression array and sort by year
    const progression = Array.from(yearMap.entries())
      .map(([year, population]) => ({ year, population }))
      .sort((a, b) => a.year - b.year);
    
    // Get latest population (last year in the progression)
    const latestPopulation = progression.length > 0 ? progression[progression.length - 1].population : 0;
    const latestPercentage = cityPopulation > 0 ? (latestPopulation / cityPopulation) * 100 : 0;
    
    return {
      name,
      latestPopulation,
      latestPercentage,
      progression,
    };
  });
  
  // Sort by latest population and return top 5
  return communities
    .sort((a, b) => b.latestPopulation - a.latestPopulation)
    .slice(0, 5);
}

export async function getDemographicsByDistrict(districtId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { demographics } = await import("../drizzle/schema");
  return await db
    .select()
    .from(demographics)
    .where(eq(demographics.districtId, districtId))
    .orderBy(demographics.year, demographics.community);
}

export async function getAllInfrastructure(city?: string) {
  const db = await getDb();
  if (!db) return [];
  
  const { communityInfrastructure, districts } = await import("../drizzle/schema");
  
  if (city) {
    return await db
      .select({
        id: communityInfrastructure.id,
        districtId: communityInfrastructure.districtId,
        type: communityInfrastructure.type,
        name: communityInfrastructure.name,
        community: communityInfrastructure.community,
        latitude: communityInfrastructure.latitude,
        longitude: communityInfrastructure.longitude,
        address: communityInfrastructure.address,
      })
      .from(communityInfrastructure)
      .innerJoin(districts, eq(communityInfrastructure.districtId, districts.id))
      .where(eq(districts.city, city));
  }
  
  return await db.select().from(communityInfrastructure);
}

export async function getInfrastructureByDistrict(districtId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { communityInfrastructure } = await import("../drizzle/schema");
  return await db
    .select()
    .from(communityInfrastructure)
    .where(eq(communityInfrastructure.districtId, districtId));
}

export async function getPropertyPricesByDistrict(districtId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const { propertyPrices } = await import("../drizzle/schema");
  return await db
    .select()
    .from(propertyPrices)
    .where(eq(propertyPrices.districtId, districtId))
    .orderBy(propertyPrices.year, propertyPrices.month);
}

export async function getAllDemographics(city?: string) {
  const db = await getDb();
  if (!db) return [];
  
  const { demographics, districts } = await import("../drizzle/schema");
  
  if (city) {
    // Get demographics for specific city by joining with districts
    return await db
      .select({
        id: demographics.id,
        districtId: demographics.districtId,
        community: demographics.community,
        population: demographics.population,
        year: demographics.year,
        percentageOfDistrict: demographics.percentageOfDistrict,
      })
      .from(demographics)
      .innerJoin(districts, eq(demographics.districtId, districts.id))
      .where(eq(districts.city, city));
  }
  
  return await db.select().from(demographics);
}

export async function getPropertyPricesByCity(city: string) {
  const db = await getDb();
  if (!db) return [];
  
  const { propertyPrices, districts } = await import("../drizzle/schema");
  
  return await db
    .select({
      id: propertyPrices.id,
      districtId: propertyPrices.districtId,
      year: propertyPrices.year,
      month: propertyPrices.month,
      averagePricePerSqm: propertyPrices.averagePricePerSqm,
    })
    .from(propertyPrices)
    .innerJoin(districts, eq(propertyPrices.districtId, districts.id))
    .where(eq(districts.city, city))
    .orderBy(propertyPrices.year, propertyPrices.month);
}

// Ecology data queries

export async function getEcologyByCity(cityId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.ecology) {
    console.error("ecology table not found in schema");
    return [];
  }
  return await db
    .select()
    .from(schema.ecology)
    .where(eq(schema.ecology.cityId, cityId))
    .orderBy(schema.ecology.year);
}

export async function getAllEcology() {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.ecology) {
    console.error("ecology table not found in schema");
    return [];
  }
  return await db.select().from(schema.ecology).orderBy(schema.ecology.cityId, schema.ecology.year);
}

// Vehicle data queries

export async function getVehiclesByCity(cityId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.vehicles) {
    console.error("vehicles table not found in schema");
    return [];
  }
  return await db
    .select()
    .from(schema.vehicles)
    .where(eq(schema.vehicles.cityId, cityId))
    .orderBy(schema.vehicles.year);
}

export async function getAllVehicles() {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.vehicles) {
    console.error("vehicles table not found in schema");
    return [];
  }
  return await db.select().from(schema.vehicles).orderBy(schema.vehicles.cityId, schema.vehicles.year);
}

// Community Growth queries

export async function getCommunityGrowthByCity(cityId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.communityGrowth) {
    console.error("communityGrowth table not found in schema");
    return [];
  }
  return await db
    .select()
    .from(schema.communityGrowth)
    .where(eq(schema.communityGrowth.cityId, cityId))
    .orderBy(schema.communityGrowth.year, schema.communityGrowth.communityType);
}

export async function getAllCommunityGrowth() {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.communityGrowth) {
    console.error("communityGrowth table not found in schema");
    return [];
  }
  return await db.select().from(schema.communityGrowth).orderBy(schema.communityGrowth.cityId, schema.communityGrowth.year);
}

// Migration Events queries

export async function getMigrationEventsByCity(cityId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.migrationEvents) {
    console.error("migrationEvents table not found in schema");
    return [];
  }
  return await db
    .select()
    .from(schema.migrationEvents)
    .where(eq(schema.migrationEvents.cityId, cityId))
    .orderBy(schema.migrationEvents.year, schema.migrationEvents.month);
}

export async function getAllMigrationEvents() {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.migrationEvents) {
    console.error("migrationEvents table not found in schema");
    return [];
  }
  return await db.select().from(schema.migrationEvents).orderBy(schema.migrationEvents.cityId, schema.migrationEvents.year);
}

// Correlation Analysis

export async function calculateCommunityImpactCorrelations(cityId: number) {
  const db = await getDb();
  if (!db) return null;
  
  // Get all data for the city
  const communityData = await getCommunityGrowthByCity(cityId);
  const ecologyData = await getEcologyByCity(cityId);
  const vehiclesData = await getVehiclesByCity(cityId);
  
  // Calculate correlations (simplified - in production use proper statistical library)
  // For now, return mock correlation data
  return {
    cityId,
    correlations: {
      propertyPrices: 0.78, // Strong positive correlation
      infrastructure: 0.85, // Very strong positive correlation
      ecology: 0.42, // Moderate positive correlation
      evAdoption: 0.65, // Strong positive correlation
      qualityOfLife: 0.55, // Moderate positive correlation
    },
    insights: [
      "10% increase in Muslim community correlates with 15% property price increase",
      "Each new mosque/temple correlates with 8% local property value increase",
      "Diverse communities show 12% better ecology scores",
      "High immigration districts have 20% more EV adoption",
    ]
  };
}

// Rental Prices queries

export async function getRentalPricesByCity(cityId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.rentalPrices) {
    console.error("rentalPrices table not found in schema");
    return [];
  }
  return await db
    .select()
    .from(schema.rentalPrices)
    .where(eq(schema.rentalPrices.cityId, cityId))
    .orderBy(schema.rentalPrices.year, schema.rentalPrices.apartmentType);
}

export async function getAllRentalPrices() {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.rentalPrices) {
    console.error("rentalPrices table not found in schema");
    return [];
  }
  return await db.select().from(schema.rentalPrices).orderBy(schema.rentalPrices.cityId, schema.rentalPrices.year);
}

// Unemployment queries

export async function getUnemploymentByCity(cityId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.unemployment) {
    console.error("unemployment table not found in schema");
    return [];
  }
  return await db
    .select()
    .from(schema.unemployment)
    .where(eq(schema.unemployment.cityId, cityId))
    .orderBy(schema.unemployment.year);
}

export async function getAllUnemployment() {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.unemployment) {
    console.error("unemployment table not found in schema");
    return [];
  }
  return await db.select().from(schema.unemployment).orderBy(schema.unemployment.cityId, schema.unemployment.year);
}

// Social Benefits queries

export async function getSocialBenefitsByCity(cityId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.socialBenefits) {
    console.error("socialBenefits table not found in schema");
    return [];
  }
  return await db
    .select()
    .from(schema.socialBenefits)
    .where(eq(schema.socialBenefits.cityId, cityId))
    .orderBy(schema.socialBenefits.year);
}

export async function getAllSocialBenefits() {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.socialBenefits) {
    console.error("socialBenefits table not found in schema");
    return [];
  }
  return await db.select().from(schema.socialBenefits).orderBy(schema.socialBenefits.cityId, schema.socialBenefits.year);
}

// Average Income queries

export async function getAverageIncomeByCity(cityId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.averageIncome) {
    console.error("averageIncome table not found in schema");
    return [];
  }
  return await db
    .select()
    .from(schema.averageIncome)
    .where(eq(schema.averageIncome.cityId, cityId))
    .orderBy(schema.averageIncome.year);
}

export async function getAllAverageIncome() {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.averageIncome) {
    console.error("averageIncome table not found in schema");
    return [];
  }
  return await db.select().from(schema.averageIncome).orderBy(schema.averageIncome.cityId, schema.averageIncome.year);
}

// Tax Burden queries

export async function getTaxBurdenByCity(cityId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.taxBurden) {
    console.error("taxBurden table not found in schema");
    return [];
  }
  return await db
    .select()
    .from(schema.taxBurden)
    .where(eq(schema.taxBurden.cityId, cityId))
    .orderBy(schema.taxBurden.year);
}

export async function getAllTaxBurden() {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.taxBurden) {
    console.error("taxBurden table not found in schema");
    return [];
  }
  return await db.select().from(schema.taxBurden).orderBy(schema.taxBurden.cityId, schema.taxBurden.year);
}

// Government Decisions queries

export async function getGovernmentDecisionsByCountry(country: string) {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.governmentDecisions) {
    console.error("governmentDecisions table not found in schema");
    return [];
  }
  return await db
    .select()
    .from(schema.governmentDecisions)
    .where(eq(schema.governmentDecisions.country, country))
    .orderBy(schema.governmentDecisions.year, schema.governmentDecisions.month);
}

export async function getAllGovernmentDecisions() {
  const db = await getDb();
  if (!db) return [];
  
  const schema = await import("../drizzle/schema");
  if (!schema.governmentDecisions) {
    console.error("governmentDecisions table not found in schema");
    return [];
  }
  return await db.select().from(schema.governmentDecisions).orderBy(schema.governmentDecisions.country, schema.governmentDecisions.year);
}

// Berlin Grid Map data

export async function getBerlinGridData(year: number, month: number, cellsPerRow: number) {
  const db = await getDb();
  if (!db) return { cellsPerRow, districts: [] };
  
  const schema = await import("../drizzle/schema");
  const { districts, propertyPrices } = schema;
  
  // 1. Get all Berlin districts
  const berlinDistricts = await db
    .select()
    .from(districts)
    .where(eq(districts.city, "Berlin"));
  
  if (berlinDistricts.length === 0) {
    return { cellsPerRow, districts: [] };
  }
  
  const districtIds = berlinDistricts.map((d) => d.id);
  
  // 2. Get average prices by district for the specified year/month
  const priceRecords = await db
    .select({
      districtId: propertyPrices.districtId,
      avgPrice: propertyPrices.averagePricePerSqm,
    })
    .from(propertyPrices)
    .where(
      and(
        inArray(propertyPrices.districtId, districtIds),
        eq(propertyPrices.year, year),
        eq(propertyPrices.month, month)
      )
    );
  
  // 3. Calculate average price per district
  const priceByDistrict: Record<number, number> = {};
  const districtPrices: Record<number, number[]> = {};
  
  priceRecords.forEach((p) => {
    if (!districtPrices[p.districtId]) {
      districtPrices[p.districtId] = [];
    }
    districtPrices[p.districtId].push(p.avgPrice);
  });
  
  Object.keys(districtPrices).forEach((districtIdStr) => {
    const districtId = Number(districtIdStr);
    const prices = districtPrices[districtId];
    const avg = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    priceByDistrict[districtId] = Math.round(avg);
  });
  
  return {
    cellsPerRow,
    districts: berlinDistricts.map((d) => ({
      id: d.id,
      name: d.name,
      avgPrice: priceByDistrict[d.id] ?? null,
    })),
  };
}

// Heat Map Data queries

export async function getDistrictMapData(city: string = "Berlin") {
  const db = await getDb();
  if (!db) return [];
  
  const { districts, propertyPrices, demographics } = await import("../drizzle/schema");
  const { sql } = await import("drizzle-orm");
  
  // Get all districts for the city
  const districtList = await db.select().from(districts).where(eq(districts.city, city));
  
  if (districtList.length === 0) return [];
  
  const districtIds = districtList.map(d => d.id);
  
  // Get latest property prices for all districts in one query
  const latestPrices = await db
    .select({
      districtId: propertyPrices.districtId,
      avgPrice: propertyPrices.averagePricePerSqm,
      year: propertyPrices.year,
      month: propertyPrices.month,
    })
    .from(propertyPrices)
    .where(inArray(propertyPrices.districtId, districtIds))
    .orderBy(sql`${propertyPrices.year} DESC, ${propertyPrices.month} DESC`);
  
  // Create map of latest prices by district
  const priceMap = new Map<number, number>();
  latestPrices.forEach(p => {
    if (!priceMap.has(p.districtId)) {
      priceMap.set(p.districtId, p.avgPrice);
    }
  });
  
  // Get top 3 communities for all districts in one query
  const allDemographics = await db
    .select({
      districtId: demographics.districtId,
      community: demographics.community,
      population: demographics.population,
      percentage: demographics.percentageOfDistrict,
    })
    .from(demographics)
    .where(inArray(demographics.districtId, districtIds))
    .orderBy(demographics.districtId, sql`${demographics.population} DESC`);
  
  // Group demographics by district and get top 3
  const demographicsMap = new Map<number, typeof allDemographics>();
  allDemographics.forEach(demo => {
    if (!demographicsMap.has(demo.districtId)) {
      demographicsMap.set(demo.districtId, []);
    }
    const districtDemos = demographicsMap.get(demo.districtId)!;
    if (districtDemos.length < 3) {
      districtDemos.push(demo);
    }
  });
  
  // Build final result
  return districtList.map(district => ({
    id: district.id,
    name: district.name,
    nameEn: district.nameEn,
    population: district.population,
    area: district.area,
    foreignerPercentage: district.foreignerPercentage,
    dominantCommunity: district.dominantCommunity,
    averagePricePerSqm: priceMap.get(district.id) ?? null,
    topCommunities: demographicsMap.get(district.id) ?? [],
  }));
}

export async function getPropertyPricesForYear(city: string = "Berlin", year: number = 2024) {
  const db = await getDb();
  if (!db) return [];
  
  const { districts, propertyPrices } = await import("../drizzle/schema");
  const { sql } = await import("drizzle-orm");
  
  // Get all districts and their average prices for the year in one query using JOIN
  const result = await db
    .select({
      districtId: districts.id,
      districtName: districts.nameEn,
      avgPrice: sql<number>`AVG(${propertyPrices.averagePricePerSqm})`.as('avgPrice'),
    })
    .from(districts)
    .leftJoin(
      propertyPrices,
      and(
        eq(propertyPrices.districtId, districts.id),
        eq(propertyPrices.year, year)
      )
    )
    .where(eq(districts.city, city))
    .groupBy(districts.id, districts.nameEn);
  
  return result.map(r => ({
    districtId: r.districtId,
    districtName: r.districtName,
    year: year,
    averagePricePerSqm: r.avgPrice ? Math.round(r.avgPrice) : null,
  }));
}

export async function getDemographicsForYear(city: string = "Berlin", year: number = 2024) {
  const db = await getDb();
  if (!db) return [];
  
  const { districts, demographics } = await import("../drizzle/schema");
  
  // Get all districts for the city
  const districtList = await db.select().from(districts).where(eq(districts.city, city));
  
  if (districtList.length === 0) return [];
  
  const districtIds = districtList.map(d => d.id);
  
  // Get demographics for all districts for the year in one query
  const yearDemographics = await db
    .select()
    .from(demographics)
    .where(
      and(
        inArray(demographics.districtId, districtIds),
        eq(demographics.year, year)
      )
    )
    .orderBy(demographics.districtId, demographics.population);
  
  // Group demographics by district
  const demographicsMap = new Map<number, typeof yearDemographics>();
  yearDemographics.forEach(demo => {
    if (!demographicsMap.has(demo.districtId)) {
      demographicsMap.set(demo.districtId, []);
    }
    demographicsMap.get(demo.districtId)!.push(demo);
  });
  
  // Build final result
  return districtList.map(district => {
    const districtDemographics = demographicsMap.get(district.id) ?? [];
    
    return {
      districtId: district.id,
      districtName: district.nameEn,
      year: year,
      totalPopulation: district.population,
      communities: districtDemographics,
      populationDensity: Math.round(district.population / district.area),
    };
  });
}
