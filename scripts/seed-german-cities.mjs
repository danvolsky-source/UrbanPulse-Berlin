import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { districts, demographics, communityInfrastructure, citySummary, propertyPrices } from "../drizzle/schema.js";
import dotenv from "dotenv";

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

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

console.log("Inserting districts for Munich, Hamburg, and Cologne...");

// Insert Munich districts
for (const district of munichDistricts) {
  await db.insert(districts).values({ ...district, city: "Munich" }).onDuplicateKeyUpdate({
    set: {
      population: district.population,
      area: district.area,
      foreignerPercentage: district.foreignerPercentage,
      dominantCommunity: district.dominantCommunity,
    }
  });
}
console.log("✓ Munich districts inserted");

// Insert Hamburg districts
for (const district of hamburgDistricts) {
  await db.insert(districts).values({ ...district, city: "Hamburg" }).onDuplicateKeyUpdate({
    set: {
      population: district.population,
      area: district.area,
      foreignerPercentage: district.foreignerPercentage,
      dominantCommunity: district.dominantCommunity,
    }
  });
}
console.log("✓ Hamburg districts inserted");

// Insert Cologne districts
for (const district of cologneDistricts) {
  await db.insert(districts).values({ ...district, city: "Cologne" }).onDuplicateKeyUpdate({
    set: {
      population: district.population,
      area: district.area,
      foreignerPercentage: district.foreignerPercentage,
      dominantCommunity: district.dominantCommunity,
    }
  });
}
console.log("✓ Cologne districts inserted");

// Get district IDs for all cities
const allDistricts = await db.select().from(districts);
const districtMap = {};
allDistricts.forEach(row => {
  const key = `${row.city}-${row.name}`;
  districtMap[key] = row.id;
});

// City summary data
const citySummaries = [
  // Munich
  { city: "Munich", year: 2023, mosquesCount: 45, churchesCount: 312, synagoguesCount: 5, totalPopulation: 1512491, foreignerPopulation: 420000 },
  { city: "Munich", year: 2024, mosquesCount: 47, churchesCount: 315, synagoguesCount: 5, totalPopulation: 1560000, foreignerPopulation: 435000 },
  
  // Hamburg
  { city: "Hamburg", year: 2023, mosquesCount: 52, churchesCount: 278, synagoguesCount: 3, totalPopulation: 1906411, foreignerPopulation: 380000 },
  { city: "Hamburg", year: 2024, mosquesCount: 54, churchesCount: 280, synagoguesCount: 3, totalPopulation: 1950000, foreignerPopulation: 395000 },
  
  // Cologne
  { city: "Cologne", year: 2023, mosquesCount: 38, churchesCount: 245, synagoguesCount: 2, totalPopulation: 1087863, foreignerPopulation: 350000 },
  { city: "Cologne", year: 2024, mosquesCount: 40, churchesCount: 248, synagoguesCount: 2, totalPopulation: 1100000, foreignerPopulation: 365000 },
];

console.log("Inserting city summary data...");
for (const summary of citySummaries) {
  await db.insert(citySummary).values(summary);
}
console.log("✓ City summary data inserted");

// Sample demographics data for Munich
const munichDemographics = [
  // Turkish community
  { city: "Munich", district: "Ludwigsvorstadt-Isarvorstadt", year: 2020, community: "Turkish", population: 8500, percentage: 15 },
  { city: "Munich", district: "Ludwigsvorstadt-Isarvorstadt", year: 2021, community: "Turkish", population: 8700, percentage: 15.3 },
  { city: "Munich", district: "Ludwigsvorstadt-Isarvorstadt", year: 2022, community: "Turkish", population: 8900, percentage: 15.7 },
  { city: "Munich", district: "Ludwigsvorstadt-Isarvorstadt", year: 2023, community: "Turkish", population: 9100, percentage: 16 },
  { city: "Munich", district: "Ludwigsvorstadt-Isarvorstadt", year: 2024, community: "Turkish", population: 9300, percentage: 16.4 },
  
  // Italian community
  { city: "Munich", district: "Maxvorstadt", year: 2020, community: "Italian", population: 7200, percentage: 13.4 },
  { city: "Munich", district: "Maxvorstadt", year: 2021, community: "Italian", population: 7400, percentage: 13.8 },
  { city: "Munich", district: "Maxvorstadt", year: 2022, community: "Italian", population: 7600, percentage: 14.1 },
  { city: "Munich", district: "Maxvorstadt", year: 2023, community: "Italian", population: 7800, percentage: 14.5 },
  { city: "Munich", district: "Maxvorstadt", year: 2024, community: "Italian", population: 8000, percentage: 14.9 },
];

console.log("Inserting demographics data for new cities...");
for (const demo of munichDemographics) {
  const districtId = districtMap[`${demo.city}-${demo.district}`];
  if (districtId) {
    await db.insert(demographics).values({
      districtId,
      year: demo.year,
      community: demo.community,
      population: demo.population,
      percentageOfDistrict: demo.percentage,
    });
  }
}
console.log("✓ Demographics data inserted");

// Sample infrastructure for Munich
const munichInfrastructure = [
  { city: "Munich", district: "Ludwigsvorstadt-Isarvorstadt", type: "mosque", name: "Islamic Center Munich", community: "Turkish", address: "Wallnerstraße 1-5, 80939 München", lat: "48.1756", lng: "11.5622" },
  { city: "Munich", district: "Maxvorstadt", type: "church", name: "St. Ludwig Church", community: "Catholic", address: "Ludwigstraße 20, 80539 München", lat: "48.1486", lng: "11.5806" },
  { city: "Munich", district: "Altstadt-Lehel", type: "synagogue", name: "Ohel Jakob Synagogue", community: "Jewish", address: "St.-Jakobs-Platz 18, 80331 München", lat: "48.1351", lng: "11.5762" },
];

console.log("Inserting infrastructure data...");
for (const infra of munichInfrastructure) {
  const districtId = districtMap[`${infra.city}-${infra.district}`];
  if (districtId) {
    await db.insert(communityInfrastructure).values({
      districtId,
      type: infra.type,
      name: infra.name,
      community: infra.community,
      address: infra.address,
      latitude: infra.lat,
      longitude: infra.lng,
    });
  }
}
console.log("✓ Infrastructure data inserted");

// Sample property prices for Munich
const munichPrices = [
  { city: "Munich", district: "Maxvorstadt", year: 2023, month: 1, price: 9500 },
  { city: "Munich", district: "Maxvorstadt", year: 2023, month: 6, price: 9700 },
  { city: "Munich", district: "Maxvorstadt", year: 2024, month: 1, price: 9900 },
];

console.log("Inserting property prices data...");
for (const price of munichPrices) {
  const districtId = districtMap[`${price.city}-${price.district}`];
  if (districtId) {
    await db.insert(propertyPrices).values({
      districtId,
      year: price.year,
      month: price.month,
      averagePricePerSqm: price.price,
    });
  }
}
console.log("✓ Property prices data inserted");

await connection.end();
console.log("✅ All German cities data seeded successfully!");
