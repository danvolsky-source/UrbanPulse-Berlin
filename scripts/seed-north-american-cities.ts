import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from "drizzle-orm";
import * as schema from "../drizzle/schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection, { schema, mode: "default" });

// North American cities data
const cities = [
  {
    name: "Washington D.C.",
    population: 712000,
    mosques: 45,
    churches: 520,
    synagogues: 28,
    districts: [
      { name: "Capitol Hill", nameEn: "Capitol Hill", lat: 38.8893, lng: -76.9942 },
      { name: "Georgetown", nameEn: "Georgetown", lat: 38.9076, lng: -77.0723 },
      { name: "Dupont Circle", nameEn: "Dupont Circle", lat: 38.9097, lng: -77.0436 },
      { name: "Adams Morgan", nameEn: "Adams Morgan", lat: 38.9206, lng: -77.0428 },
      { name: "Shaw", nameEn: "Shaw", lat: 38.9122, lng: -77.0214 },
      { name: "Columbia Heights", nameEn: "Columbia Heights", lat: 38.9289, lng: -77.0325 },
      { name: "U Street", nameEn: "U Street", lat: 38.9169, lng: -77.0286 },
      { name: "Foggy Bottom", nameEn: "Foggy Bottom", lat: 38.9006, lng: -77.0497 },
      { name: "Navy Yard", nameEn: "Navy Yard", lat: 38.8764, lng: -77.0047 },
      { name: "Anacostia", nameEn: "Anacostia", lat: 38.8628, lng: -76.9953 },
      { name: "Petworth", nameEn: "Petworth", lat: 38.9364, lng: -77.0253 },
      { name: "Brookland", nameEn: "Brookland", lat: 38.9333, lng: -76.9953 },
      { name: "H Street NE", nameEn: "H Street NE", lat: 38.9003, lng: -76.9936 },
      { name: "Logan Circle", nameEn: "Logan Circle", lat: 38.9097, lng: -77.0303 },
      { name: "Penn Quarter", nameEn: "Penn Quarter", lat: 38.8964, lng: -77.0228 },
    ],
    communities: ["Hispanic", "African American", "Asian", "Middle Eastern", "European"],
  },
  {
    name: "New York",
    population: 8336000,
    mosques: 275,
    churches: 2800,
    synagogues: 350,
    districts: [
      { name: "Manhattan", nameEn: "Manhattan", lat: 40.7831, lng: -73.9712 },
      { name: "Brooklyn", nameEn: "Brooklyn", lat: 40.6782, lng: -73.9442 },
      { name: "Queens", nameEn: "Queens", lat: 40.7282, lng: -73.7949 },
      { name: "Bronx", nameEn: "Bronx", lat: 40.8448, lng: -73.8648 },
      { name: "Staten Island", nameEn: "Staten Island", lat: 40.5795, lng: -74.1502 },
      { name: "Harlem", nameEn: "Harlem", lat: 40.8116, lng: -73.9465 },
      { name: "Upper East Side", nameEn: "Upper East Side", lat: 40.7736, lng: -73.9566 },
      { name: "Upper West Side", nameEn: "Upper West Side", lat: 40.7870, lng: -73.9754 },
      { name: "Greenwich Village", nameEn: "Greenwich Village", lat: 40.7336, lng: -74.0027 },
      { name: "SoHo", nameEn: "SoHo", lat: 40.7233, lng: -74.0030 },
      { name: "Tribeca", nameEn: "Tribeca", lat: 40.7163, lng: -74.0086 },
      { name: "Chelsea", nameEn: "Chelsea", lat: 40.7465, lng: -74.0014 },
      { name: "Williamsburg", nameEn: "Williamsburg", lat: 40.7081, lng: -73.9571 },
      { name: "Astoria", nameEn: "Astoria", lat: 40.7722, lng: -73.9300 },
      { name: "Flushing", nameEn: "Flushing", lat: 40.7674, lng: -73.8330 },
      { name: "Jamaica", nameEn: "Jamaica", lat: 40.6916, lng: -73.8062 },
      { name: "Bay Ridge", nameEn: "Bay Ridge", lat: 40.6260, lng: -74.0307 },
      { name: "Park Slope", nameEn: "Park Slope", lat: 40.6710, lng: -73.9778 },
      { name: "Bedford-Stuyvesant", nameEn: "Bedford-Stuyvesant", lat: 40.6872, lng: -73.9418 },
      { name: "Coney Island", nameEn: "Coney Island", lat: 40.5755, lng: -73.9707 },
    ],
    communities: ["Hispanic", "Asian", "African American", "European", "Middle Eastern"],
  },
  {
    name: "Toronto",
    population: 2930000,
    mosques: 180,
    churches: 1200,
    synagogues: 45,
    districts: [
      { name: "Downtown", nameEn: "Downtown", lat: 43.6532, lng: -79.3832 },
      { name: "North York", nameEn: "North York", lat: 43.7615, lng: -79.4111 },
      { name: "Scarborough", nameEn: "Scarborough", lat: 43.7731, lng: -79.2578 },
      { name: "Etobicoke", nameEn: "Etobicoke", lat: 43.6205, lng: -79.5132 },
      { name: "East York", nameEn: "East York", lat: 43.6890, lng: -79.3289 },
      { name: "York", nameEn: "York", lat: 43.6890, lng: -79.4872 },
      { name: "The Annex", nameEn: "The Annex", lat: 43.6697, lng: -79.4040 },
      { name: "Yorkville", nameEn: "Yorkville", lat: 43.6708, lng: -79.3933 },
      { name: "The Beaches", nameEn: "The Beaches", lat: 43.6677, lng: -79.2972 },
      { name: "High Park", nameEn: "High Park", lat: 43.6465, lng: -79.4637 },
      { name: "Rosedale", nameEn: "Rosedale", lat: 43.6797, lng: -79.3789 },
      { name: "Leslieville", nameEn: "Leslieville", lat: 43.6648, lng: -79.3289 },
      { name: "Liberty Village", nameEn: "Liberty Village", lat: 43.6384, lng: -79.4197 },
      { name: "Distillery District", nameEn: "Distillery District", lat: 43.6503, lng: -79.3597 },
      { name: "Kensington Market", nameEn: "Kensington Market", lat: 43.6544, lng: -79.4006 },
    ],
    communities: ["Asian", "South Asian", "European", "African", "Middle Eastern"],
  },
  {
    name: "Los Angeles",
    population: 3979000,
    mosques: 95,
    churches: 2400,
    synagogues: 120,
    districts: [
      { name: "Downtown LA", nameEn: "Downtown LA", lat: 34.0407, lng: -118.2468 },
      { name: "Hollywood", nameEn: "Hollywood", lat: 34.0928, lng: -118.3287 },
      { name: "Beverly Hills", nameEn: "Beverly Hills", lat: 34.0736, lng: -118.4004 },
      { name: "Santa Monica", nameEn: "Santa Monica", lat: 34.0195, lng: -118.4912 },
      { name: "Venice", nameEn: "Venice", lat: 33.9850, lng: -118.4695 },
      { name: "Westwood", nameEn: "Westwood", lat: 34.0633, lng: -118.4456 },
      { name: "Koreatown", nameEn: "Koreatown", lat: 34.0579, lng: -118.3009 },
      { name: "Silver Lake", nameEn: "Silver Lake", lat: 34.0870, lng: -118.2704 },
      { name: "Echo Park", nameEn: "Echo Park", lat: 34.0778, lng: -118.2607 },
      { name: "Pasadena", nameEn: "Pasadena", lat: 34.1478, lng: -118.1445 },
      { name: "Long Beach", nameEn: "Long Beach", lat: 33.7701, lng: -118.1937 },
      { name: "Glendale", nameEn: "Glendale", lat: 34.1425, lng: -118.2551 },
      { name: "Burbank", nameEn: "Burbank", lat: 34.1808, lng: -118.3090 },
      { name: "West Hollywood", nameEn: "West Hollywood", lat: 34.0900, lng: -118.3617 },
      { name: "Culver City", nameEn: "Culver City", lat: 34.0211, lng: -118.3965 },
      { name: "Manhattan Beach", nameEn: "Manhattan Beach", lat: 33.8847, lng: -118.4109 },
      { name: "Inglewood", nameEn: "Inglewood", lat: 33.9617, lng: -118.3531 },
      { name: "Compton", nameEn: "Compton", lat: 33.8958, lng: -118.2201 },
    ],
    communities: ["Hispanic", "Asian", "African American", "European", "Middle Eastern"],
  },
  {
    name: "Chicago",
    population: 2746000,
    mosques: 85,
    churches: 1800,
    synagogues: 75,
    districts: [
      { name: "The Loop", nameEn: "The Loop", lat: 41.8781, lng: -87.6298 },
      { name: "Lincoln Park", nameEn: "Lincoln Park", lat: 41.9217, lng: -87.6489 },
      { name: "Wicker Park", nameEn: "Wicker Park", lat: 41.9097, lng: -87.6773 },
      { name: "Logan Square", nameEn: "Logan Square", lat: 41.9297, lng: -87.7006 },
      { name: "Lakeview", nameEn: "Lakeview", lat: 41.9397, lng: -87.6539 },
      { name: "Hyde Park", nameEn: "Hyde Park", lat: 41.7944, lng: -87.5914 },
      { name: "Pilsen", nameEn: "Pilsen", lat: 41.8558, lng: -87.6597 },
      { name: "Chinatown", nameEn: "Chinatown", lat: 41.8528, lng: -87.6319 },
      { name: "Bronzeville", nameEn: "Bronzeville", lat: 41.8208, lng: -87.6153 },
      { name: "River North", nameEn: "River North", lat: 41.8919, lng: -87.6328 },
      { name: "Gold Coast", nameEn: "Gold Coast", lat: 41.9031, lng: -87.6281 },
      { name: "Bucktown", nameEn: "Bucktown", lat: 41.9178, lng: -87.6806 },
      { name: "Andersonville", nameEn: "Andersonville", lat: 41.9797, lng: -87.6686 },
      { name: "West Loop", nameEn: "West Loop", lat: 41.8819, lng: -87.6472 },
      { name: "South Loop", nameEn: "South Loop", lat: 41.8719, lng: -87.6278 },
      { name: "Uptown", nameEn: "Uptown", lat: 41.9658, lng: -87.6539 },
    ],
    communities: ["Hispanic", "African American", "Asian", "European", "Middle Eastern"],
  },
];

async function main() {
  console.log("🌍 Seeding North American cities data...");

  const years = [2020, 2021, 2022, 2023, 2024];

  for (const city of cities) {
    console.log(`📍 Processing ${city.name}...`);

    // Insert districts
    const districtRecords = city.districts.map((d) => {
      const population = Math.floor(Math.random() * 100000) + 30000; // 30k-130k per district
      const area = Math.floor(Math.random() * 50) + 10; // 10-60 sq km
      return {
        city: city.name,
        name: d.name,
        nameEn: d.nameEn,
        population,
        area,
        foreignerPercentage: Math.floor(Math.random() * 30 + 10), // 10-40% foreigners
        dominantCommunity: city.communities[Math.floor(Math.random() * city.communities.length)],
      };
    });

    await db.insert(schema.districts).values(districtRecords);
    console.log(`  ✅ Inserted ${districtRecords.length} districts`);

    // Get inserted district IDs
    const insertedDistricts = await db
      .select()
      .from(schema.districts)
      .where(eq(schema.districts.city, city.name));

    // Insert demographics for each district, community, and year
    const demographicRecords = [];
    for (const district of insertedDistricts) {
      for (const community of city.communities) {
        const basePopulation = Math.floor(Math.random() * 5000) + 1000; // 1000-6000 base
        for (let yearIndex = 0; yearIndex < years.length; yearIndex++) {
          const year = years[yearIndex];
          const growth = 1 + (Math.random() * 0.2 - 0.05) * yearIndex; // -5% to +15% per year
          const population = Math.round(basePopulation * growth);

          const percentageOfDistrict = Math.floor((population / district.population) * 1000); // stored as integer (e.g., 48 for 4.8%)
          demographicRecords.push({
            districtId: district.id,
            community,
            year,
            population,
            percentageOfDistrict,
          });
        }
      }
    }

    // Insert in batches of 100
    for (let i = 0; i < demographicRecords.length; i += 100) {
      const batch = demographicRecords.slice(i, i + 100);
      await db.insert(schema.demographics).values(batch);
    }
    console.log(`  ✅ Inserted ${demographicRecords.length} demographic records`);

    // Insert infrastructure
    const infrastructureRecords = [];
    for (const district of insertedDistricts) {
      const mosquesCount = Math.floor(Math.random() * 8) + 1; // 1-8 mosques per district
      const churchesCount = Math.floor(Math.random() * 30) + 10; // 10-40 churches
      const synagoguesCount = Math.floor(Math.random() * 5); // 0-5 synagogues

      for (let i = 0; i < mosquesCount; i++) {
        const community = city.communities[Math.floor(Math.random() * city.communities.length)];
        infrastructureRecords.push({
          districtId: district.id,
          type: "mosque" as const,
          name: `Mosque ${i + 1}`,
          address: `${district.name}, ${city.name}`,
          community,
          latitude: String(district.lat + (Math.random() - 0.5) * 0.02),
          longitude: String(district.lng + (Math.random() - 0.5) * 0.02),
        });
      }

      for (let i = 0; i < churchesCount; i++) {
        const community = city.communities[Math.floor(Math.random() * city.communities.length)];
        infrastructureRecords.push({
          districtId: district.id,
          type: "church" as const,
          name: `Church ${i + 1}`,
          address: `${district.name}, ${city.name}`,
          community,
          latitude: String(district.lat + (Math.random() - 0.5) * 0.02),
          longitude: String(district.lng + (Math.random() - 0.5) * 0.02),
        });
      }

      for (let i = 0; i < synagoguesCount; i++) {
        const community = city.communities[Math.floor(Math.random() * city.communities.length)];
        infrastructureRecords.push({
          districtId: district.id,
          type: "synagogue" as const,
          name: `Synagogue ${i + 1}`,
          address: `${district.name}, ${city.name}`,
          community,
          latitude: String(district.lat + (Math.random() - 0.5) * 0.02),
          longitude: String(district.lng + (Math.random() - 0.5) * 0.02),
        });
      }
    }

    await db.insert(schema.communityInfrastructure).values(infrastructureRecords);
    console.log(`  ✅ Inserted ${infrastructureRecords.length} infrastructure records`);

    // Insert city summary for each year
    const citySummaryRecords = [];
    for (let yearIndex = 0; yearIndex < years.length; yearIndex++) {
      const year = years[yearIndex];
      const mosqueGrowth = 1 + (Math.random() * 0.08 - 0.02) * yearIndex;
      const churchGrowth = 1 + (Math.random() * 0.04 - 0.01) * yearIndex;
      const synagogueGrowth = 1 + (Math.random() * 0.03 - 0.01) * yearIndex;

      const foreignerPopulation = Math.round(city.population * (Math.random() * 0.15 + 0.20)); // 20-35% foreigners

      citySummaryRecords.push({
        city: city.name,
        year,
        totalPopulation: city.population,
        foreignerPopulation,
        mosquesCount: Math.round(city.mosques * mosqueGrowth),
        churchesCount: Math.round(city.churches * churchGrowth),
        synagoguesCount: Math.round(city.synagogues * synagogueGrowth),
      });
    }

    await db.insert(schema.citySummary).values(citySummaryRecords);
    console.log(`  ✅ Inserted ${citySummaryRecords.length} city summary records`);

    // Insert property prices
    const propertyPriceRecords = [];
    for (const district of insertedDistricts) {
      const basePrice = Math.floor(Math.random() * 4000) + 3000; // $3000-7000 per sqm base

      for (const year of years) {
        const month = 6; // Mid-year data
        const yearIndex = years.indexOf(year);
        const appreciation = 1 + (Math.random() * 0.15 + 0.05) * yearIndex; // 5-20% appreciation per year
        const pricePerSqm = basePrice * appreciation;

        propertyPriceRecords.push({
          districtId: district.id,
          year,
          month,
          averagePricePerSqm: Math.round(pricePerSqm),
        });
      }
    }

    // Insert in batches of 100
    for (let i = 0; i < propertyPriceRecords.length; i += 100) {
      const batch = propertyPriceRecords.slice(i, i + 100);
      await db.insert(schema.propertyPrices).values(batch);
    }
    console.log(`  ✅ Inserted ${propertyPriceRecords.length} property price records`);
  }

  console.log("✨ North American cities seeding completed!");
  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
