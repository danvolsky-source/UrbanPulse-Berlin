import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { districts, demographics } from "../drizzle/schema.ts";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

// Check Berlin districts
const berlinDistricts = await db.select().from(districts).where(eq(districts.city, "Berlin"));
console.log("Berlin districts:", berlinDistricts.length);
console.log("District IDs:", berlinDistricts.map(d => ({ id: d.id, name: d.name })));

// Check demographics data
const allDemographics = await db.select().from(demographics).limit(10);
console.log("\nSample demographics data:");
console.log(allDemographics);

// Check demographics for Berlin districts
if (berlinDistricts.length > 0) {
  const firstDistrictId = berlinDistricts[0].id;
  const districtDemographics = await db.select().from(demographics).where(eq(demographics.districtId, firstDistrictId));
  console.log(`\nDemographics for district ${firstDistrictId}:`, districtDemographics.length);
  console.log(districtDemographics);
}

process.exit(0);
