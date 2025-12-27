/**
 * Seed script for Berlin zones data
 * This script populates the zones table with the three Berlin zones from berlin_zones.geojson
 */

import { drizzle } from "drizzle-orm/mysql2";
import { zones } from "../drizzle/schema";
import { readFileSync } from "fs";
import { join } from "path";

async function seedZones() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const db = drizzle(DATABASE_URL);

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
    } catch (error: any) {
      // If zone already exists (duplicate key), ignore and continue
      if (error.code === "ER_DUP_ENTRY") {
        console.log(`    Zone ${zoneData.code} already exists, skipping`);
      } else {
        throw error;
      }
    }
  }

  console.log("✓ Zones seeded successfully");
  process.exit(0);
}

seedZones().catch((error) => {
  console.error("Error seeding zones:", error);
  process.exit(1);
});
