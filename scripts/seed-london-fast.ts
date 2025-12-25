import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { districts, demographics, citySummary, communityInfrastructure, propertyPrices } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
const db = drizzle(connection);

const CITY = "London";

// London's 33 boroughs with realistic data
const londonBoroughs = [
  { name: "Westminster", nameEn: "Westminster", population: 255324, area: 21.48, foreignerPercentage: 42.5, dominantCommunity: "Middle Eastern" },
  { name: "Tower Hamlets", nameEn: "Tower Hamlets", population: 324745, area: 19.77, foreignerPercentage: 55.8, dominantCommunity: "Bangladeshi" },
  { name: "Newham", nameEn: "Newham", population: 353134, area: 36.22, foreignerPercentage: 62.3, dominantCommunity: "Pakistani" },
  { name: "Brent", nameEn: "Brent", population: 339800, area: 43.24, foreignerPercentage: 58.7, dominantCommunity: "Indian" },
  { name: "Ealing", nameEn: "Ealing", population: 341982, area: 55.53, foreignerPercentage: 52.4, dominantCommunity: "Polish" },
  { name: "Haringey", nameEn: "Haringey", population: 285900, area: 29.59, foreignerPercentage: 48.9, dominantCommunity: "Turkish" },
  { name: "Hackney", nameEn: "Hackney", population: 281120, area: 19.06, foreignerPercentage: 44.2, dominantCommunity: "Caribbean" },
  { name: "Lambeth", nameEn: "Lambeth", population: 327136, area: 26.82, foreignerPercentage: 45.6, dominantCommunity: "Caribbean" },
  { name: "Southwark", nameEn: "Southwark", population: 318830, area: 28.85, foreignerPercentage: 47.3, dominantCommunity: "Caribbean" },
  { name: "Camden", nameEn: "Camden", population: 270029, area: 21.80, foreignerPercentage: 41.8, dominantCommunity: "Middle Eastern" },
  { name: "Islington", nameEn: "Islington", population: 239142, area: 14.86, foreignerPercentage: 38.5, dominantCommunity: "Turkish" },
  { name: "Kensington and Chelsea", nameEn: "Kensington and Chelsea", population: 156197, area: 12.13, foreignerPercentage: 52.1, dominantCommunity: "Middle Eastern" },
  { name: "Hammersmith and Fulham", nameEn: "Hammersmith and Fulham", population: 185426, area: 16.40, foreignerPercentage: 44.7, dominantCommunity: "Polish" },
  { name: "Wandsworth", nameEn: "Wandsworth", population: 329677, area: 34.26, foreignerPercentage: 38.2, dominantCommunity: "Polish" },
  { name: "Greenwich", nameEn: "Greenwich", population: 287942, area: 47.35, foreignerPercentage: 42.1, dominantCommunity: "Caribbean" },
  { name: "Lewisham", nameEn: "Lewisham", population: 305309, area: 35.15, foreignerPercentage: 46.8, dominantCommunity: "Caribbean" },
  { name: "Barking and Dagenham", nameEn: "Barking and Dagenham", population: 214107, area: 36.09, foreignerPercentage: 51.2, dominantCommunity: "Pakistani" },
  { name: "Redbridge", nameEn: "Redbridge", population: 305222, area: 56.41, foreignerPercentage: 54.3, dominantCommunity: "Indian" },
  { name: "Waltham Forest", nameEn: "Waltham Forest", population: 278428, area: 38.82, foreignerPercentage: 49.7, dominantCommunity: "Pakistani" },
  { name: "Enfield", nameEn: "Enfield", population: 333794, area: 82.20, foreignerPercentage: 47.5, dominantCommunity: "Turkish" },
  { name: "Barnet", nameEn: "Barnet", population: 395869, area: 86.74, foreignerPercentage: 42.9, dominantCommunity: "Indian" },
  { name: "Harrow", nameEn: "Harrow", population: 252338, area: 50.47, foreignerPercentage: 58.5, dominantCommunity: "Indian" },
  { name: "Hillingdon", nameEn: "Hillingdon", population: 306870, area: 115.70, foreignerPercentage: 45.8, dominantCommunity: "Indian" },
  { name: "Hounslow", nameEn: "Hounslow", population: 287940, area: 55.98, foreignerPercentage: 55.3, dominantCommunity: "Indian" },
  { name: "Richmond upon Thames", nameEn: "Richmond upon Thames", population: 198019, area: 57.41, foreignerPercentage: 28.4, dominantCommunity: "Polish" },
  { name: "Kingston upon Thames", nameEn: "Kingston upon Thames", population: 177507, area: 37.25, foreignerPercentage: 32.1, dominantCommunity: "Indian" },
  { name: "Merton", nameEn: "Merton", population: 206548, area: 37.61, foreignerPercentage: 41.3, dominantCommunity: "Polish" },
  { name: "Sutton", nameEn: "Sutton", population: 206349, area: 43.85, foreignerPercentage: 33.7, dominantCommunity: "Indian" },
  { name: "Croydon", nameEn: "Croydon", population: 390719, area: 86.52, foreignerPercentage: 48.2, dominantCommunity: "Caribbean" },
  { name: "Bromley", nameEn: "Bromley", population: 331096, area: 150.12, foreignerPercentage: 28.9, dominantCommunity: "Indian" },
  { name: "Bexley", nameEn: "Bexley", population: 247258, area: 60.56, foreignerPercentage: 24.6, dominantCommunity: "Indian" },
  { name: "Havering", nameEn: "Havering", population: 259552, area: 112.98, foreignerPercentage: 19.8, dominantCommunity: "Indian" },
  { name: "City of London", nameEn: "City of London", population: 9401, area: 2.90, foreignerPercentage: 35.2, dominantCommunity: "Middle Eastern" },
];

// UK-specific communities
const communities = ["Pakistani", "Indian", "Bangladeshi", "Caribbean", "Polish"];

async function seedLondon() {
  console.log(`Starting seed for ${CITY}...`);

  // Insert districts in batch
  console.log(`Inserting ${londonBoroughs.length} boroughs...`);
  await db.insert(districts).values(
    londonBoroughs.map((borough) => ({
      city: CITY,
      name: borough.name,
      nameEn: borough.nameEn,
      population: borough.population,
      area: borough.area,
      foreignerPercentage: borough.foreignerPercentage,
      dominantCommunity: borough.dominantCommunity,
    }))
  );

  // Get inserted districts
  const districtRecords = await db
    .select()
    .from(districts)
    .where(eq(districts.city, CITY));
  console.log(`✓ Inserted ${districtRecords.length} boroughs`);

  // Insert demographics in batches
  console.log("Inserting demographics data...");
  const years = [2020, 2021, 2022, 2023, 2024];
  const demographicsData = [];
  
  for (const district of districtRecords) {
    for (const year of years) {
      for (const community of communities) {
        const basePopulation = Math.floor(district.population * (Math.random() * 0.15 + 0.05));
        const yearGrowth = (year - 2020) * 0.03;
        const population = Math.floor(basePopulation * (1 + yearGrowth));
        const percentageOfDistrict = (population / district.population) * 100;

        demographicsData.push({
          districtId: district.id,
          year,
          community,
          population,
          percentageOfDistrict,
        });
      }
    }
  }

  // Insert in batches of 100
  for (let i = 0; i < demographicsData.length; i += 100) {
    const batch = demographicsData.slice(i, i + 100);
    await db.insert(demographics).values(batch);
  }
  console.log(`✓ Inserted ${demographicsData.length} demographic records`);

  // Insert city summary
  console.log("Inserting city summary...");
  const citySummaryData = [];
  const totalPopulation = londonBoroughs.reduce((sum, b) => sum + b.population, 0);
  for (const year of years) {
    const yearGrowth = (year - 2020) * 0.02;
    const foreignerPopulation = Math.floor(totalPopulation * 0.42 * (1 + yearGrowth)); // ~42% foreign-born
    citySummaryData.push({
      city: CITY,
      year,
      mosquesCount: Math.floor(285 * (1 + yearGrowth)),
      churchesCount: Math.floor(1150 * (1 + yearGrowth)),
      synagoguesCount: Math.floor(42 * (1 + yearGrowth)),
      totalPopulation: Math.floor(totalPopulation * (1 + yearGrowth)),
      foreignerPopulation,
    });
  }
  await db.insert(citySummary).values(citySummaryData);
  console.log("✓ Inserted city summary");

  // Insert infrastructure in batches
  console.log("Inserting infrastructure...");
  const infrastructureData = [];
  
  for (const district of districtRecords) {
    const mosquesCount = Math.floor(Math.random() * 15) + 3;
    const churchesCount = Math.floor(Math.random() * 40) + 10;
    const synagoguesCount = Math.floor(Math.random() * 3) + 0;
    
    // Mosques
    for (let i = 0; i < mosquesCount; i++) {
      infrastructureData.push({
        districtId: district.id,
        type: "mosque" as const,
        name: `${district.nameEn} Mosque ${i + 1}`,
        community: communities[Math.floor(Math.random() * 3)],
        latitude: (51.3 + Math.random() * 0.5).toFixed(6),
        longitude: (-0.5 + Math.random() * 0.6).toFixed(6),
        address: `${Math.floor(Math.random() * 500) + 1} ${district.nameEn} Road, London`,
      });
    }
    
    // Churches
    for (let i = 0; i < churchesCount; i++) {
      infrastructureData.push({
        districtId: district.id,
        type: "church" as const,
        name: `${district.nameEn} Church ${i + 1}`,
        community: "Caribbean",
        latitude: (51.3 + Math.random() * 0.5).toFixed(6),
        longitude: (-0.5 + Math.random() * 0.6).toFixed(6),
        address: `${Math.floor(Math.random() * 500) + 1} ${district.nameEn} Street, London`,
      });
    }
    
    // Synagogues
    for (let i = 0; i < synagoguesCount; i++) {
      infrastructureData.push({
        districtId: district.id,
        type: "synagogue" as const,
        name: `${district.nameEn} Synagogue ${i + 1}`,
        community: "Middle Eastern",
        latitude: (51.3 + Math.random() * 0.5).toFixed(6),
        longitude: (-0.5 + Math.random() * 0.6).toFixed(6),
        address: `${Math.floor(Math.random() * 500) + 1} ${district.nameEn} Avenue, London`,
      });
    }
  }

  // Insert in batches of 100
  for (let i = 0; i < infrastructureData.length; i += 100) {
    const batch = infrastructureData.slice(i, i + 100);
    await db.insert(communityInfrastructure).values(batch);
  }
  console.log(`✓ Inserted ${infrastructureData.length} infrastructure records`);

  // Insert property prices in batches
  console.log("Inserting property prices...");
  const propertyPricesData = [];
  
  for (const district of districtRecords) {
    const basePrice = Math.floor(Math.random() * 8000) + 7000;
    
    for (const year of years) {
      for (let month = 1; month <= 12; month++) {
        const yearGrowth = (year - 2020) * 0.05;
        const monthVariation = (Math.random() - 0.5) * 0.02;
        const price = Math.floor(basePrice * (1 + yearGrowth + monthVariation));
        
        propertyPricesData.push({
          districtId: district.id,
          year,
          month,
          averagePricePerSqm: price,
        });
      }
    }
  }

  // Insert in batches of 100
  for (let i = 0; i < propertyPricesData.length; i += 100) {
    const batch = propertyPricesData.slice(i, i + 100);
    await db.insert(propertyPrices).values(batch);
  }
  console.log(`✓ Inserted ${propertyPricesData.length} property price records`);

  console.log(`\n✅ Successfully seeded ${CITY}!`);
  console.log(`Summary:`);
  console.log(`- ${districtRecords.length} boroughs`);
  console.log(`- ${demographicsData.length} demographic records`);
  console.log(`- ${infrastructureData.length} infrastructure items`);
  console.log(`- ${propertyPricesData.length} property price records`);
  
  await connection.end();
}

seedLondon()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding London:", error);
    process.exit(1);
  });
