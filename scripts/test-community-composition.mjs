import { getCommunityComposition } from "../server/db.ts";
import dotenv from "dotenv";

dotenv.config();

console.log("Testing getCommunityComposition for Berlin...\n");

const result = await getCommunityComposition("Berlin");

console.log("Result:", JSON.stringify(result, null, 2));
console.log("\nNumber of communities:", result.length);

if (result.length > 0) {
  console.log("\nFirst community:");
  console.log("- Name:", result[0].name);
  console.log("- Latest Population:", result[0].latestPopulation);
  console.log("- Latest Percentage:", result[0].latestPercentage);
  console.log("- Progression length:", result[0].progression.length);
}

process.exit(0);
