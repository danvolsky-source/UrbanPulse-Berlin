import { eq } from "drizzle-orm";
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

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

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
  
  const { districts } = await import("../drizzle/schema");
  const result = await db.selectDistinct({ city: districts.city }).from(districts);
  return result.map(r => r.city);
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

export async function getAllInfrastructure() {
  const db = await getDb();
  if (!db) return [];
  
  const { communityInfrastructure } = await import("../drizzle/schema");
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
