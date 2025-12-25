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
  const database = db;

  console.log(`Starting seed for ${CITY}...`);

  // Insert districts
  console.log(`Inserting ${londonBoroughs.length} boroughs...`);
  const districtRecords = [];
  for (const borough of londonBoroughs) {
    const [inserted] = await database.insert(districts).values({
      city: CITY,
      name: borough.name,
      nameEn: borough.nameEn,
      population: borough.population,
      area: borough.area,
      foreignerPercentage: borough.foreignerPercentage,
      dominantCommunity: borough.dominantCommunity,
    });
    
    // Get the inserted district ID
    const [district] = await database
      .select()
      .from(districts)
      .where(eq(districts.city, CITY))
      .where(eq(districts.name, borough.name))
      .limit(1);
    
    if (district) {
      districtRecords.push(district);
    }
  }
  console.log(`✓ Inserted ${districtRecords.length} boroughs`);

  // Insert demographics (5 communities × 5 years × 33 boroughs = 825 records)
  console.log("Inserting demographics data...");
  const years = [2020, 2021, 2022, 2023, 2024];
  let demoCount = 0;
  
  for (const district of districtRecords) {
    for (const year of years) {
      for (const community of communities) {
        const basePopulation = Math.floor(district.population * (Math.random() * 0.15 + 0.05)); // 5-20% of district
        const yearGrowth = (year - 2020) * 0.03; // 3% annual growth
        const population = Math.floor(basePopulation * (1 + yearGrowth));
        const percentageOfDistrict = (population / district.population) * 100;

        await database.insert(demographics).values({
          districtId: district.id,
          year,
          community,
          population,
          percentageOfDistrict,
        });
        demoCount++;
      }
    }
  }
  console.log(`✓ Inserted ${demoCount} demographic records`);

  // Insert city summary (5 years)
  console.log("Inserting city summary...");
  for (const year of years) {
    const yearGrowth = (year - 2020) * 0.02;
    await database.insert(citySummary).values({
      city: CITY,
      year,
      mosquesCount: Math.floor(285 * (1 + yearGrowth)),
      churchesCount: Math.floor(1150 * (1 + yearGrowth)),
      synagoguesCount: Math.floor(42 * (1 + yearGrowth)),
    });
  }
  console.log("✓ Inserted city summary");

  // Insert infrastructure
  console.log("Inserting infrastructure...");
  let infraCount = 0;
  
  for (const district of districtRecords) {
    const mosquesCount = Math.floor(Math.random() * 15) + 3; // 3-17 mosques
    const churchesCount = Math.floor(Math.random() * 40) + 10; // 10-49 churches
    const synagoguesCount = Math.floor(Math.random() * 3) + 0; // 0-2 synagogues
    
    // Mosques
    for (let i = 0; i < mosquesCount; i++) {
      await database.insert(communityInfrastructure).values({
        districtId: district.id,
        type: "mosque",
        name: `${district.nameEn} Mosque ${i + 1}`,
        community: communities[Math.floor(Math.random() * 3)], // Pakistani, Indian, or Bangladeshi
        latitude: (51.3 + Math.random() * 0.5).toFixed(6),
        longitude: (-0.5 + Math.random() * 0.6).toFixed(6),
        address: `${Math.floor(Math.random() * 500) + 1} ${district.nameEn} Road, London`,
      });
      infraCount++;
    }
    
    // Churches
    for (let i = 0; i < churchesCount; i++) {
      await database.insert(communityInfrastructure).values({
        districtId: district.id,
        type: "church",
        name: `${district.nameEn} Church ${i + 1}`,
        community: "Caribbean",
        latitude: (51.3 + Math.random() * 0.5).toFixed(6),
        longitude: (-0.5 + Math.random() * 0.6).toFixed(6),
        address: `${Math.floor(Math.random() * 500) + 1} ${district.nameEn} Street, London`,
      });
      infraCount++;
    }
    
    // Synagogues
    for (let i = 0; i < synagoguesCount; i++) {
      await database.insert(communityInfrastructure).values({
        districtId: district.id,
        type: "synagogue",
        name: `${district.nameEn} Synagogue ${i + 1}`,
        community: "Middle Eastern",
        latitude: (51.3 + Math.random() * 0.5).toFixed(6),
        longitude: (-0.5 + Math.random() * 0.6).toFixed(6),
        address: `${Math.floor(Math.random() * 500) + 1} ${district.nameEn} Avenue, London`,
      });
      infraCount++;
    }
  }
  console.log(`✓ Inserted ${infraCount} infrastructure records`);

  // Insert property prices (5 years × 12 months × 33 boroughs = 1,980 records)
  console.log("Inserting property prices...");
  let priceCount = 0;
  
  for (const district of districtRecords) {
    const basePrice = Math.floor(Math.random() * 8000) + 7000; // £7,000-15,000 per sqm
    
    for (const year of years) {
      for (let month = 1; month <= 12; month++) {
        const yearGrowth = (year - 2020) * 0.05; // 5% annual growth
        const monthVariation = (Math.random() - 0.5) * 0.02; // ±1% monthly variation
        const price = Math.floor(basePrice * (1 + yearGrowth + monthVariation));
        
        await database.insert(propertyPrices).values({
          districtId: district.id,
          year,
          month,
          averagePricePerSqm: price,
        });
        priceCount++;
      }
    }
  }
  console.log(`✓ Inserted ${priceCount} property price records`);

  console.log(`\n✅ Successfully seeded ${CITY}!`);
  console.log(`Summary:`);
  console.log(`- ${districtRecords.length} boroughs`);
  console.log(`- ${demoCount} demographic records`);
  console.log(`- ${infraCount} infrastructure items`);
  console.log(`- ${priceCount} property price records`);
}

seedLondon()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding London:", error);
    process.exit(1);
  });
