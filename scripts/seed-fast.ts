import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { districts, demographics, communityInfrastructure, citySummary, propertyPrices } from "../drizzle/schema";
import * as dotenv from "dotenv";

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
const db = drizzle(connection);

console.log("Starting fast database seed with batch inserts...");

// Munich (München) districts data
const munichDistricts = [
  { name: "Altstadt-Lehel", nameEn: "Old Town-Lehel", population: 21233, area: 3, foreignerPercentage: 28, dominantCommunity: "Turkish", city: "Munich" },
  { name: "Ludwigsvorstadt-Isarvorstadt", nameEn: "Ludwigsvorstadt-Isarvorstadt", population: 56713, area: 4, foreignerPercentage: 35, dominantCommunity: "Turkish", city: "Munich" },
  { name: "Maxvorstadt", nameEn: "Maxvorstadt", population: 53748, area: 4, foreignerPercentage: 30, dominantCommunity: "Italian", city: "Munich" },
  { name: "Schwabing-West", nameEn: "Schwabing-West", population: 68870, area: 4, foreignerPercentage: 25, dominantCommunity: "Italian", city: "Munich" },
  { name: "Au-Haidhausen", nameEn: "Au-Haidhausen", population: 62504, area: 4, foreignerPercentage: 27, dominantCommunity: "Turkish", city: "Munich" },
  { name: "Sendling", nameEn: "Sendling", population: 41887, area: 4, foreignerPercentage: 32, dominantCommunity: "Turkish", city: "Munich" },
  { name: "Neuhausen-Nymphenburg", nameEn: "Neuhausen-Nymphenburg", population: 103101, area: 13, foreignerPercentage: 22, dominantCommunity: "Italian", city: "Munich" },
  { name: "Pasing-Obermenzing", nameEn: "Pasing-Obermenzing", population: 77059, area: 16, foreignerPercentage: 20, dominantCommunity: "Italian", city: "Munich" },
];

// Hamburg districts data
const hamburgDistricts = [
  { name: "Hamburg-Mitte", nameEn: "Hamburg-Mitte", population: 301231, area: 107, foreignerPercentage: 32, dominantCommunity: "Turkish", city: "Hamburg" },
  { name: "Altona", nameEn: "Altona", population: 274702, area: 78, foreignerPercentage: 25, dominantCommunity: "Turkish", city: "Hamburg" },
  { name: "Eimsbüttel", nameEn: "Eimsbuettel", population: 267949, area: 50, foreignerPercentage: 22, dominantCommunity: "Polish", city: "Hamburg" },
  { name: "Hamburg-Nord", nameEn: "Hamburg-Nord", population: 313458, area: 57, foreignerPercentage: 24, dominantCommunity: "Turkish", city: "Hamburg" },
  { name: "Wandsbek", nameEn: "Wandsbek", population: 442702, area: 147, foreignerPercentage: 20, dominantCommunity: "Polish", city: "Hamburg" },
  { name: "Bergedorf", nameEn: "Bergedorf", population: 131347, area: 155, foreignerPercentage: 18, dominantCommunity: "Polish", city: "Hamburg" },
  { name: "Harburg", nameEn: "Harburg", population: 172054, area: 125, foreignerPercentage: 28, dominantCommunity: "Turkish", city: "Hamburg" },
];

// Cologne (Köln) districts data
const cologneDistricts = [
  { name: "Innenstadt", nameEn: "City Center", population: 129904, area: 16, foreignerPercentage: 38, dominantCommunity: "Turkish", city: "Cologne" },
  { name: "Rodenkirchen", nameEn: "Rodenkirchen", population: 110357, area: 54, foreignerPercentage: 22, dominantCommunity: "Italian", city: "Cologne" },
  { name: "Lindenthal", nameEn: "Lindenthal", population: 145769, area: 40, foreignerPercentage: 25, dominantCommunity: "Italian", city: "Cologne" },
  { name: "Ehrenfeld", nameEn: "Ehrenfeld", population: 111381, area: 19, foreignerPercentage: 35, dominantCommunity: "Turkish", city: "Cologne" },
  { name: "Nippes", nameEn: "Nippes", population: 120802, area: 30, foreignerPercentage: 30, dominantCommunity: "Turkish", city: "Cologne" },
  { name: "Chorweiler", nameEn: "Chorweiler", population: 84352, area: 57, foreignerPercentage: 32, dominantCommunity: "Turkish", city: "Cologne" },
  { name: "Porz", nameEn: "Porz", population: 115038, area: 78, foreignerPercentage: 28, dominantCommunity: "Turkish", city: "Cologne" },
  { name: "Kalk", nameEn: "Kalk", population: 108309, area: 22, foreignerPercentage: 40, dominantCommunity: "Turkish", city: "Cologne" },
];

console.log("Inserting districts in batch...");
await db.insert(districts).values([...munichDistricts, ...hamburgDistricts, ...cologneDistricts]);
console.log(`✓ Inserted ${munichDistricts.length + hamburgDistricts.length + cologneDistricts.length} districts`);

// Get district IDs
const allDistricts = await db.select().from(districts);
const munichDistrictIds = allDistricts.filter(d => d.city === "Munich").map(d => d.id);
const hamburgDistrictIds = allDistricts.filter(d => d.city === "Hamburg").map(d => d.id);
const cologneDistrictIds = allDistricts.filter(d => d.city === "Cologne").map(d => d.id);

console.log("Preparing demographics data in batches...");

// Prepare all demographics data at once
const allDemographics = [];
const munichCommunities = ["Turkish", "Italian", "Greek", "Croatian", "Polish"];
const hamburgCommunities = ["Turkish", "Polish", "Afghan", "Syrian", "Russian"];
const cologneCommunities = ["Turkish", "Italian", "Polish", "Syrian", "Greek"];

for (const districtId of munichDistrictIds) {
  for (const year of [2020, 2021, 2022, 2023, 2024]) {
    for (let i = 0; i < munichCommunities.length; i++) {
      const community = munichCommunities[i];
      const basePopulation = 5000 - i * 800;
      const yearGrowth = (year - 2020) * 50;
      const population = basePopulation + yearGrowth + Math.floor(Math.random() * 200);
      const percentageOfDistrict = Math.floor((population / 50000) * 1000);
      
      allDemographics.push({
        districtId,
        year,
        community,
        population,
        percentageOfDistrict,
      });
    }
  }
}

for (const districtId of hamburgDistrictIds) {
  for (const year of [2020, 2021, 2022, 2023, 2024]) {
    for (let i = 0; i < hamburgCommunities.length; i++) {
      const community = hamburgCommunities[i];
      const basePopulation = 6000 - i * 900;
      const yearGrowth = (year - 2020) * 60;
      const population = basePopulation + yearGrowth + Math.floor(Math.random() * 250);
      const percentageOfDistrict = Math.floor((population / 60000) * 1000);
      
      allDemographics.push({
        districtId,
        year,
        community,
        population,
        percentageOfDistrict,
      });
    }
  }
}

for (const districtId of cologneDistrictIds) {
  for (const year of [2020, 2021, 2022, 2023, 2024]) {
    for (let i = 0; i < cologneCommunities.length; i++) {
      const community = cologneCommunities[i];
      const basePopulation = 4500 - i * 700;
      const yearGrowth = (year - 2020) * 45;
      const population = basePopulation + yearGrowth + Math.floor(Math.random() * 180);
      const percentageOfDistrict = Math.floor((population / 45000) * 1000);
      
      allDemographics.push({
        districtId,
        year,
        community,
        population,
        percentageOfDistrict,
      });
    }
  }
}

console.log(`Inserting ${allDemographics.length} demographics records in batches...`);
// Insert in batches of 100 to avoid query size limits
const batchSize = 100;
for (let i = 0; i < allDemographics.length; i += batchSize) {
  const batch = allDemographics.slice(i, i + batchSize);
  await db.insert(demographics).values(batch);
  console.log(`  Progress: ${Math.min(i + batchSize, allDemographics.length)}/${allDemographics.length}`);
}
console.log("✓ Inserted all demographics");

console.log("Inserting city summaries...");
const cities = [
  { name: "Munich", totalPop: 1488202, foreignPop: 450000, mosques: 45, churches: 380, synagogues: 9 },
  { name: "Hamburg", totalPop: 1906411, foreignPop: 340000, mosques: 55, churches: 420, synagogues: 5 },
  { name: "Cologne", totalPop: 1087863, foreignPop: 380000, mosques: 38, churches: 350, synagogues: 4 },
];

const citySummaries = [];
for (const city of cities) {
  for (const year of [2023, 2024]) {
    const yearMultiplier = year === 2024 ? 1.02 : 1.0;
    citySummaries.push({
      city: city.name,
      year,
      mosquesCount: Math.floor(city.mosques * yearMultiplier),
      churchesCount: Math.floor(city.churches * yearMultiplier),
      synagoguesCount: city.synagogues,
      totalPopulation: Math.floor(city.totalPop * yearMultiplier),
      foreignerPopulation: Math.floor(city.foreignPop * yearMultiplier),
    });
  }
}

await db.insert(citySummary).values(citySummaries);
console.log("✓ Inserted city summaries");

console.log("Inserting community infrastructure...");
const allInfrastructure = [
  // Munich
  { districtId: munichDistrictIds[0], type: "mosque", name: "Freimann Mosque", address: "Schleißheimer Str. 256", community: "Turkish", latitude: "48.1896", longitude: "11.6122" },
  { districtId: munichDistrictIds[0], type: "mosque", name: "Islamic Center Munich", address: "Wallnerstraße 1-5", community: "Turkish", latitude: "48.1351", longitude: "11.5820" },
  { districtId: munichDistrictIds[0], type: "church", name: "Frauenkirche", address: "Frauenplatz 12", community: "German", latitude: "48.1385", longitude: "11.5732" },
  { districtId: munichDistrictIds[0], type: "synagogue", name: "Ohel Jakob Synagogue", address: "St.-Jakobs-Platz 18", community: "Jewish", latitude: "48.1351", longitude: "11.5756" },
  // Hamburg
  { districtId: hamburgDistrictIds[0], type: "mosque", name: "Centrum Mosque", address: "Böckmannstraße 40", community: "Turkish", latitude: "53.5511", longitude: "9.9937" },
  { districtId: hamburgDistrictIds[0], type: "church", name: "St. Michael's Church", address: "Englische Planke 1", community: "German", latitude: "53.5483", longitude: "9.9780" },
  { districtId: hamburgDistrictIds[0], type: "synagogue", name: "Talmud-Tora School", address: "Grindelhof 30", community: "Jewish", latitude: "53.5676", longitude: "9.9848" },
  // Cologne
  { districtId: cologneDistrictIds[0], type: "mosque", name: "Cologne Central Mosque", address: "Venloer Str. 160", community: "Turkish", latitude: "50.9467", longitude: "6.9344" },
  { districtId: cologneDistrictIds[0], type: "church", name: "Cologne Cathedral", address: "Domkloster 4", community: "German", latitude: "50.9413", longitude: "6.9583" },
  { districtId: cologneDistrictIds[0], type: "synagogue", name: "Cologne Synagogue", address: "Roonstraße 50", community: "Jewish", latitude: "50.9290", longitude: "6.9478" },
] as any[];

await db.insert(communityInfrastructure).values(allInfrastructure);
console.log("✓ Inserted community infrastructure");

console.log("Preparing property prices...");
const allPropertyPrices = [];
const allCityDistricts = [
  { ids: munichDistrictIds, basePrice: 8500 },
  { ids: hamburgDistrictIds, basePrice: 6500 },
  { ids: cologneDistrictIds, basePrice: 5500 },
];

for (const cityData of allCityDistricts) {
  for (const districtId of cityData.ids) {
    for (const year of [2020, 2021, 2022, 2023, 2024]) {
      const yearGrowth = (year - 2020) * 300;
      const avgPrice = cityData.basePrice + yearGrowth + Math.floor(Math.random() * 500);
      
      allPropertyPrices.push({
        districtId,
        year,
        month: 12,
        averagePricePerSqm: avgPrice,
      });
    }
  }
}

console.log(`Inserting ${allPropertyPrices.length} property prices in batches...`);
for (let i = 0; i < allPropertyPrices.length; i += batchSize) {
  const batch = allPropertyPrices.slice(i, i + batchSize);
  await db.insert(propertyPrices).values(batch);
  console.log(`  Progress: ${Math.min(i + batchSize, allPropertyPrices.length)}/${allPropertyPrices.length}`);
}
console.log("✓ Inserted property prices");

await connection.end();
console.log("\n✅ Database seeding completed successfully!");
