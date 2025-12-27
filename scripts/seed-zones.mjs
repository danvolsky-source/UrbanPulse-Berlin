/**
 * Seed script for Berlin zones data
 * This script populates the zones table with the three Berlin zones from berlin_zones.geojson
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { zones } from "../drizzle/schema.js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seedZones() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(connection);

  // Read the berlin_zones.geojson file
  const geojsonPath = join(__dirname, "../client/src/data/berlin_zones.geojson");
  const geojsonContent = readFileSync(geojsonPath, "utf-8");
  const geojsonData = JSON.parse(geojsonContent);

  console.log("Seeding zones data...");

  // Insert each zone
  for (const feature of geojsonData.features) {
    const zoneData = {
      code: feature.properties.code,
      name: feature.properties.name,
      city: feature.properties.city,
      geojson: JSON.stringify(feature.geometry),
    };

    console.log(`  Inserting zone ${zoneData.code} - ${zoneData.name}`);
    
    try {
      await db.insert(zones).values(zoneData);
    } catch (error) {
      // If zone already exists (duplicate key), ignore and continue
      if (error.code === "ER_DUP_ENTRY") {
        console.log(`    Zone ${zoneData.code} already exists, skipping`);
      } else {
        throw error;
      }
    }
  }

  console.log("✓ Zones seeded successfully");
  await connection.end();
  process.exit(0);
}

seedZones().catch((error) => {
  console.error("Error seeding zones:", error);
  process.exit(1);
});
