import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { districts, demographics, communityInfrastructure, citySummary, propertyPrices } from "../drizzle/schema";
import * as dotenv from "dotenv";

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
const db = drizzle(connection);

console.log("Starting database seed...");

// Munich (München) districts data
const munichDistricts = [
  { name: "Altstadt-Lehel", nameEn: "Old Town-Lehel", population: 21233, area: 3, foreignerPercentage: 28, dominantCommunity: "Turkish" },
  { name: "Ludwigsvorstadt-Isarvorstadt", nameEn: "Ludwigsvorstadt-Isarvorstadt", population: 56713, area: 4, foreignerPercentage: 35, dominantCommunity: "Turkish" },
  { name: "Maxvorstadt", nameEn: "Maxvorstadt", population: 53748, area: 4, foreignerPercentage: 30, dominantCommunity: "Italian" },
  { name: "Schwabing-West", nameEn: "Schwabing-West", population: 68870, area: 4, foreignerPercentage: 25, dominantCommunity: "Italian" },
  { name: "Au-Haidhausen", nameEn: "Au-Haidhausen", population: 62504, area: 4, foreignerPercentage: 27, dominantCommunity: "Turkish" },
  { name: "Sendling", nameEn: "Sendling", population: 41887, area: 4, foreignerPercentage: 32, dominantCommunity: "Turkish" },
  { name: "Neuhausen-Nymphenburg", nameEn: "Neuhausen-Nymphenburg", population: 103101, area: 13, foreignerPercentage: 22, dominantCommunity: "Italian" },
  { name: "Pasing-Obermenzing", nameEn: "Pasing-Obermenzing", population: 77059, area: 16, foreignerPercentage: 20, dominantCommunity: "Italian" },
];

// Hamburg districts data
const hamburgDistricts = [
  { name: "Hamburg-Mitte", nameEn: "Hamburg-Mitte", population: 301231, area: 107, foreignerPercentage: 32, dominantCommunity: "Turkish" },
  { name: "Altona", nameEn: "Altona", population: 274702, area: 78, foreignerPercentage: 25, dominantCommunity: "Turkish" },
  { name: "Eimsbüttel", nameEn: "Eimsbuettel", population: 267949, area: 50, foreignerPercentage: 22, dominantCommunity: "Polish" },
  { name: "Hamburg-Nord", nameEn: "Hamburg-Nord", population: 313458, area: 57, foreignerPercentage: 24, dominantCommunity: "Turkish" },
  { name: "Wandsbek", nameEn: "Wandsbek", population: 442702, area: 147, foreignerPercentage: 20, dominantCommunity: "Polish" },
  { name: "Bergedorf", nameEn: "Bergedorf", population: 131347, area: 155, foreignerPercentage: 18, dominantCommunity: "Polish" },
  { name: "Harburg", nameEn: "Harburg", population: 172054, area: 125, foreignerPercentage: 28, dominantCommunity: "Turkish" },
];

// Cologne (Köln) districts data
const cologneDistricts = [
  { name: "Innenstadt", nameEn: "City Center", population: 129904, area: 16, foreignerPercentage: 38, dominantCommunity: "Turkish" },
  { name: "Rodenkirchen", nameEn: "Rodenkirchen", population: 110357, area: 54, foreignerPercentage: 22, dominantCommunity: "Italian" },
  { name: "Lindenthal", nameEn: "Lindenthal", population: 145769, area: 40, foreignerPercentage: 25, dominantCommunity: "Italian" },
  { name: "Ehrenfeld", nameEn: "Ehrenfeld", population: 111381, area: 19, foreignerPercentage: 35, dominantCommunity: "Turkish" },
  { name: "Nippes", nameEn: "Nippes", population: 120802, area: 30, foreignerPercentage: 30, dominantCommunity: "Turkish" },
  { name: "Chorweiler", nameEn: "Chorweiler", population: 84352, area: 57, foreignerPercentage: 32, dominantCommunity: "Turkish" },
  { name: "Porz", nameEn: "Porz", population: 115038, area: 78, foreignerPercentage: 28, dominantCommunity: "Turkish" },
  { name: "Kalk", nameEn: "Kalk", population: 108309, area: 22, foreignerPercentage: 40, dominantCommunity: "Turkish" },
];

console.log("Inserting districts...");

// Insert Munich districts
for (const district of munichDistricts) {
  await db.insert(districts).values({ ...district, city: "Munich" });
}
console.log(`✓ Inserted ${munichDistricts.length} Munich districts`);

// Insert Hamburg districts
for (const district of hamburgDistricts) {
  await db.insert(districts).values({ ...district, city: "Hamburg" });
}
console.log(`✓ Inserted ${hamburgDistricts.length} Hamburg districts`);

// Insert Cologne districts
for (const district of cologneDistricts) {
  await db.insert(districts).values({ ...district, city: "Cologne" });
}
console.log(`✓ Inserted ${cologneDistricts.length} Cologne districts`);

// Get district IDs for seeding other tables
const allDistricts = await db.select().from(districts);
const munichDistrictIds = allDistricts.filter(d => d.city === "Munich").map(d => d.id);
const hamburgDistrictIds = allDistricts.filter(d => d.city === "Hamburg").map(d => d.id);
const cologneDistrictIds = allDistricts.filter(d => d.city === "Cologne").map(d => d.id);

console.log("Inserting demographics data...");

// Insert demographics for Munich
const munichCommunities = ["Turkish", "Italian", "Greek", "Croatian", "Polish"];
for (const districtId of munichDistrictIds) {
  for (const year of [2020, 2021, 2022, 2023, 2024]) {
    for (let i = 0; i < munichCommunities.length; i++) {
      const community = munichCommunities[i];
      const basePopulation = 5000 - i * 800;
      const yearGrowth = (year - 2020) * 50;
      const population = basePopulation + yearGrowth + Math.floor(Math.random() * 200);
      const percentageOfDistrict = Math.floor((population / 50000) * 1000); // stored as integer (e.g., 48 for 4.8%)
      
      await db.insert(demographics).values({
        districtId,
        year,
        community,
        population,
        percentageOfDistrict,
      });
    }
  }
}
console.log("✓ Inserted Munich demographics");

// Insert demographics for Hamburg
const hamburgCommunities = ["Turkish", "Polish", "Afghan", "Syrian", "Russian"];
for (const districtId of hamburgDistrictIds) {
  for (const year of [2020, 2021, 2022, 2023, 2024]) {
    for (let i = 0; i < hamburgCommunities.length; i++) {
      const community = hamburgCommunities[i];
      const basePopulation = 6000 - i * 900;
      const yearGrowth = (year - 2020) * 60;
      const population = basePopulation + yearGrowth + Math.floor(Math.random() * 250);
      const percentageOfDistrict = Math.floor((population / 60000) * 1000);
      
      await db.insert(demographics).values({
        districtId,
        year,
        community,
        population,
        percentageOfDistrict,
      });
    }
  }
}
console.log("✓ Inserted Hamburg demographics");

// Insert demographics for Cologne
const cologneCommunities = ["Turkish", "Italian", "Polish", "Syrian", "Greek"];
for (const districtId of cologneDistrictIds) {
  for (const year of [2020, 2021, 2022, 2023, 2024]) {
    for (let i = 0; i < cologneCommunities.length; i++) {
      const community = cologneCommunities[i];
      const basePopulation = 4500 - i * 700;
      const yearGrowth = (year - 2020) * 45;
      const population = basePopulation + yearGrowth + Math.floor(Math.random() * 180);
      const percentageOfDistrict = Math.floor((population / 45000) * 1000);
      
      await db.insert(demographics).values({
        districtId,
        year,
        community,
        population,
        percentageOfDistrict,
      });
    }
  }
}
console.log("✓ Inserted Cologne demographics");

console.log("Inserting city summaries...");

// Insert city summaries
const cities = [
  { name: "Munich", totalPop: 1488202, foreignPop: 450000, mosques: 45, churches: 380, synagogues: 9 },
  { name: "Hamburg", totalPop: 1906411, foreignPop: 340000, mosques: 55, churches: 420, synagogues: 5 },
  { name: "Cologne", totalPop: 1087863, foreignPop: 380000, mosques: 38, churches: 350, synagogues: 4 },
];

for (const city of cities) {
  for (const year of [2023, 2024]) {
    const yearMultiplier = year === 2024 ? 1.02 : 1.0;
    await db.insert(citySummary).values({
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
console.log("✓ Inserted city summaries");

console.log("Inserting community infrastructure...");

// Insert some sample infrastructure for Munich
const munichInfra = [
  { type: "mosque", name: "Freimann Mosque", address: "Schleißheimer Str. 256", community: "Turkish", lat: "48.1896", lng: "11.6122" },
  { type: "mosque", name: "Islamic Center Munich", address: "Wallnerstraße 1-5", community: "Turkish", lat: "48.1351", lng: "11.5820" },
  { type: "church", name: "Frauenkirche", address: "Frauenplatz 12", community: "German", lat: "48.1385", lng: "11.5732" },
  { type: "synagogue", name: "Ohel Jakob Synagogue", address: "St.-Jakobs-Platz 18", community: "Jewish", lat: "48.1351", lng: "11.5756" },
];

for (const infra of munichInfra) {
  await db.insert(communityInfrastructure).values({
    districtId: munichDistrictIds[0],
    type: infra.type as any,
    name: infra.name,
    address: infra.address,
    community: infra.community,
    latitude: infra.lat,
    longitude: infra.lng,
  });
}

// Insert some sample infrastructure for Hamburg
const hamburgInfra = [
  { type: "mosque", name: "Centrum Mosque", address: "Böckmannstraße 40", community: "Turkish", lat: "53.5511", lng: "9.9937" },
  { type: "church", name: "St. Michael's Church", address: "Englische Planke 1", community: "German", lat: "53.5483", lng: "9.9780" },
  { type: "synagogue", name: "Talmud-Tora School", address: "Grindelhof 30", community: "Jewish", lat: "53.5676", lng: "9.9848" },
];

for (const infra of hamburgInfra) {
  await db.insert(communityInfrastructure).values({
    districtId: hamburgDistrictIds[0],
    type: infra.type as any,
    name: infra.name,
    address: infra.address,
    community: infra.community,
    latitude: infra.lat,
    longitude: infra.lng,
  });
}

// Insert some sample infrastructure for Cologne
const cologneInfra = [
  { type: "mosque", name: "Cologne Central Mosque", address: "Venloer Str. 160", community: "Turkish", lat: "50.9467", lng: "6.9344" },
  { type: "church", name: "Cologne Cathedral", address: "Domkloster 4", community: "German", lat: "50.9413", lng: "6.9583" },
  { type: "synagogue", name: "Cologne Synagogue", address: "Roonstraße 50", community: "Jewish", lat: "50.9290", lng: "6.9478" },
];

for (const infra of cologneInfra) {
  await db.insert(communityInfrastructure).values({
    districtId: cologneDistrictIds[0],
    type: infra.type as any,
    name: infra.name,
    address: infra.address,
    community: infra.community,
    latitude: infra.lat,
    longitude: infra.lng,
  });
}
console.log("✓ Inserted community infrastructure");

console.log("Inserting property prices...");

// Insert property prices for all cities
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
      
      await db.insert(propertyPrices).values({
        districtId,
        year,
        month: 12, // December of each year
        averagePricePerSqm: avgPrice,
      });
    }
  }
}
console.log("✓ Inserted property prices");

await connection.end();
console.log("\n✅ Database seeding completed successfully!");
