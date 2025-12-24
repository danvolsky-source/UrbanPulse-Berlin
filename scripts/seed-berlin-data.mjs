import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { districts, demographics, communityInfrastructure, citySummary, propertyPrices } from "../drizzle/schema.js";
import dotenv from "dotenv";

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Berlin districts data (12 districts)
const districtsData = [
  { name: "Mitte", nameEn: "Mitte", population: 385748, area: 39, foreignerPercentage: 35, dominantCommunity: "Turkish" },
  { name: "Friedrichshain-Kreuzberg", nameEn: "Friedrichshain-Kreuzberg", population: 290386, area: 20, foreignerPercentage: 34, dominantCommunity: "Turkish" },
  { name: "Pankow", nameEn: "Pankow", population: 409335, area: 103, foreignerPercentage: 15, dominantCommunity: "Polish" },
  { name: "Charlottenburg-Wilmersdorf", nameEn: "Charlottenburg-Wilmersdorf", population: 343592, area: 65, foreignerPercentage: 28, dominantCommunity: "Polish" },
  { name: "Spandau", nameEn: "Spandau", population: 245527, area: 92, foreignerPercentage: 22, dominantCommunity: "Turkish" },
  { name: "Steglitz-Zehlendorf", nameEn: "Steglitz-Zehlendorf", population: 310071, area: 102, foreignerPercentage: 18, dominantCommunity: "Polish" },
  { name: "Tempelhof-Schöneberg", nameEn: "Tempelhof-Schöneberg", population: 351644, area: 53, foreignerPercentage: 30, dominantCommunity: "Turkish" },
  { name: "Neukölln", nameEn: "Neukölln", population: 329691, area: 45, foreignerPercentage: 45, dominantCommunity: "Turkish" },
  { name: "Treptow-Köpenick", nameEn: "Treptow-Köpenick", population: 276165, area: 168, foreignerPercentage: 12, dominantCommunity: "Russian" },
  { name: "Marzahn-Hellersdorf", nameEn: "Marzahn-Hellersdorf", population: 270822, area: 62, foreignerPercentage: 13, dominantCommunity: "Vietnamese" },
  { name: "Lichtenberg", nameEn: "Lichtenberg", population: 295979, area: 52, foreignerPercentage: 16, dominantCommunity: "Vietnamese" },
  { name: "Reinickendorf", nameEn: "Reinickendorf", population: 266189, area: 89, foreignerPercentage: 24, dominantCommunity: "Turkish" },
];

// Insert districts
console.log("Inserting districts...");
for (const district of districtsData) {
  await db.insert(districts).values(district).onDuplicateKeyUpdate({
    set: {
      population: district.population,
      area: district.area,
      foreignerPercentage: district.foreignerPercentage,
      dominantCommunity: district.dominantCommunity,
    }
  });
}
console.log("✓ Districts inserted");

// Get district IDs
const districtRows = await db.select().from(districts);
const districtMap = {};
districtRows.forEach(row => {
  districtMap[row.name] = row.id;
});

// Demographics data for 2020-2024 (5 years) - Top 5 communities
const demographicsData = [
  // Turkish community (largest)
  { district: "Neukölln", year: 2020, community: "Turkish", population: 65000, percentage: 197 },
  { district: "Neukölln", year: 2021, community: "Turkish", population: 66000, percentage: 200 },
  { district: "Neukölln", year: 2022, community: "Turkish", population: 67000, percentage: 203 },
  { district: "Neukölln", year: 2023, community: "Turkish", population: 68000, percentage: 206 },
  { district: "Neukölln", year: 2024, community: "Turkish", population: 69000, percentage: 209 },
  
  { district: "Friedrichshain-Kreuzberg", year: 2020, community: "Turkish", population: 45000, percentage: 155 },
  { district: "Friedrichshain-Kreuzberg", year: 2021, community: "Turkish", population: 46000, percentage: 158 },
  { district: "Friedrichshain-Kreuzberg", year: 2022, community: "Turkish", population: 47000, percentage: 162 },
  { district: "Friedrichshain-Kreuzberg", year: 2023, community: "Turkish", population: 48000, percentage: 165 },
  { district: "Friedrichshain-Kreuzberg", year: 2024, community: "Turkish", population: 49000, percentage: 169 },
  
  // Polish community
  { district: "Pankow", year: 2020, community: "Polish", population: 18000, percentage: 44 },
  { district: "Pankow", year: 2021, community: "Polish", population: 18500, percentage: 45 },
  { district: "Pankow", year: 2022, community: "Polish", population: 19000, percentage: 46 },
  { district: "Pankow", year: 2023, community: "Polish", population: 19500, percentage: 48 },
  { district: "Pankow", year: 2024, community: "Polish", population: 20000, percentage: 49 },
  
  // Syrian community (fast growing)
  { district: "Neukölln", year: 2020, community: "Syrian", population: 15000, percentage: 46 },
  { district: "Neukölln", year: 2021, community: "Syrian", population: 17000, percentage: 52 },
  { district: "Neukölln", year: 2022, community: "Syrian", population: 19000, percentage: 58 },
  { district: "Neukölln", year: 2023, community: "Syrian", population: 21000, percentage: 64 },
  { district: "Neukölln", year: 2024, community: "Syrian", population: 23000, percentage: 70 },
  
  // Italian community
  { district: "Charlottenburg-Wilmersdorf", year: 2020, community: "Italian", population: 12000, percentage: 35 },
  { district: "Charlottenburg-Wilmersdorf", year: 2021, community: "Italian", population: 12200, percentage: 36 },
  { district: "Charlottenburg-Wilmersdorf", year: 2022, community: "Italian", population: 12400, percentage: 36 },
  { district: "Charlottenburg-Wilmersdorf", year: 2023, community: "Italian", population: 12600, percentage: 37 },
  { district: "Charlottenburg-Wilmersdorf", year: 2024, community: "Italian", population: 12800, percentage: 37 },
  
  // Russian community (declining slightly)
  { district: "Lichtenberg", year: 2020, community: "Russian", population: 11000, percentage: 37 },
  { district: "Lichtenberg", year: 2021, community: "Russian", population: 10900, percentage: 37 },
  { district: "Lichtenberg", year: 2022, community: "Russian", population: 10800, percentage: 36 },
  { district: "Lichtenberg", year: 2023, community: "Russian", population: 10700, percentage: 36 },
  { district: "Lichtenberg", year: 2024, community: "Russian", population: 10600, percentage: 36 },
];

console.log("Inserting demographics data...");
for (const demo of demographicsData) {
  const districtId = districtMap[demo.district];
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

// Community infrastructure data
const infrastructureData = [
  // Mosques
  { district: "Neukölln", type: "mosque", name: "Şehitlik Mosque", community: "Turkish", address: "Columbiadamm 128, 10965 Berlin", lat: "52.4831", lng: "13.4231" },
  { district: "Friedrichshain-Kreuzberg", type: "mosque", name: "Mevlana Mosque", community: "Turkish", address: "Wiener Str. 1-2, 10999 Berlin", lat: "52.5025", lng: "13.4342" },
  { district: "Mitte", type: "mosque", name: "Umar Ibn Khattab Mosque", community: "Arab", address: "Wiclefstraße 2, 10551 Berlin", lat: "52.5289", lng: "13.3456" },
  
  // Churches
  { district: "Mitte", type: "church", name: "Berlin Cathedral", community: "Christian", address: "Am Lustgarten, 10178 Berlin", lat: "52.5191", lng: "13.4011" },
  { district: "Charlottenburg-Wilmersdorf", type: "church", name: "Kaiser Wilhelm Memorial Church", community: "Christian", address: "Breitscheidplatz, 10789 Berlin", lat: "52.5050", lng: "13.3356" },
  { district: "Pankow", type: "church", name: "Gethsemane Church", community: "Christian", address: "Stargarder Str. 77, 10437 Berlin", lat: "52.5389", lng: "13.4103" },
  
  // Synagogues
  { district: "Mitte", type: "synagogue", name: "New Synagogue", community: "Jewish", address: "Oranienburger Str. 28-30, 10117 Berlin", lat: "52.5247", lng: "13.3947" },
  { district: "Pankow", type: "synagogue", name: "Rykestraße Synagogue", community: "Jewish", address: "Rykestraße 53, 10405 Berlin", lat: "52.5328", lng: "13.4189" },
  { district: "Charlottenburg-Wilmersdorf", type: "synagogue", name: "Synagogue Pestalozzistraße", community: "Jewish", address: "Pestalozzistraße 14-15, 10625 Berlin", lat: "52.5089", lng: "13.3078" },
  
  // Cultural centers
  { district: "Lichtenberg", type: "cultural_center", name: "Vietnamese Cultural Center", community: "Vietnamese", address: "Herzbergstraße 87-99, 10365 Berlin", lat: "52.5156", lng: "13.4978" },
  { district: "Neukölln", type: "cultural_center", name: "Turkish Cultural Center", community: "Turkish", address: "Karl-Marx-Str. 131, 12043 Berlin", lat: "52.4756", lng: "13.4403" },
];

console.log("Inserting infrastructure data...");
for (const infra of infrastructureData) {
  const districtId = districtMap[infra.district];
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

// City summary data for 2023-2024
const citySummaryData = [
  { city: "Berlin", year: 2023, mosquesCount: 99, churchesCount: 534, synagoguesCount: 12, totalPopulation: 3755251, foreignerPopulation: 829000 },
  { city: "Berlin", year: 2024, mosquesCount: 102, churchesCount: 540, synagoguesCount: 12, totalPopulation: 3850000, foreignerPopulation: 850000 },
];

console.log("Inserting city summary data...");
for (const summary of citySummaryData) {
  await db.insert(citySummary).values(summary);
}
console.log("✓ City summary data inserted");

// Property prices data (sample for a few districts)
const propertyPricesData = [
  // Neukölln - increasing prices
  { district: "Neukölln", year: 2020, month: 1, price: 4200 },
  { district: "Neukölln", year: 2021, month: 1, price: 4500 },
  { district: "Neukölln", year: 2022, month: 1, price: 4800 },
  { district: "Neukölln", year: 2023, month: 1, price: 5100 },
  { district: "Neukölln", year: 2024, month: 1, price: 5400 },
  
  // Charlottenburg-Wilmersdorf - stable high prices
  { district: "Charlottenburg-Wilmersdorf", year: 2020, month: 1, price: 6500 },
  { district: "Charlottenburg-Wilmersdorf", year: 2021, month: 1, price: 6700 },
  { district: "Charlottenburg-Wilmersdorf", year: 2022, month: 1, price: 6900 },
  { district: "Charlottenburg-Wilmersdorf", year: 2023, month: 1, price: 7100 },
  { district: "Charlottenburg-Wilmersdorf", year: 2024, month: 1, price: 7300 },
  
  // Marzahn-Hellersdorf - lower prices
  { district: "Marzahn-Hellersdorf", year: 2020, month: 1, price: 2800 },
  { district: "Marzahn-Hellersdorf", year: 2021, month: 1, price: 2900 },
  { district: "Marzahn-Hellersdorf", year: 2022, month: 1, price: 3000 },
  { district: "Marzahn-Hellersdorf", year: 2023, month: 1, price: 3100 },
  { district: "Marzahn-Hellersdorf", year: 2024, month: 1, price: 3200 },
];

console.log("Inserting property prices data...");
for (const price of propertyPricesData) {
  const districtId = districtMap[price.district];
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

console.log("\n✅ All data seeded successfully!");

await connection.end();
