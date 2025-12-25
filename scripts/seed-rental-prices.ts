import { getDb } from "../server/db";
import { rentalPrices } from "../drizzle/schema";

async function seedRentalPrices() {
  const db = await getDb();
  if (!db) {
    console.error("Database connection failed");
    process.exit(1);
  }

  console.log("Seeding rental prices data...");

  // Apartment types
  const apartmentTypes = ["1-bedroom", "2-bedroom", "3-bedroom", "house"];
  
  // City IDs and base rental prices (monthly in EUR/USD)
  const cityRentalBases: Record<number, { name: string; base: number }> = {
    1: { name: "Berlin", base: 900 },
    2: { name: "Munich", base: 1400 },
    3: { name: "Hamburg", base: 1100 },
    4: { name: "Cologne", base: 950 },
    5: { name: "Paris", base: 1300 },
    6: { name: "Vienna", base: 1000 },
    7: { name: "Rome", base: 1100 },
    8: { name: "Amsterdam", base: 1600 },
    9: { name: "Brussels", base: 1050 },
    10: { name: "London", base: 1800 },
    11: { name: "Washington D.C.", base: 2200 },
    12: { name: "New York", base: 3000 },
    13: { name: "Toronto", base: 1900 },
    14: { name: "Los Angeles", base: 2400 },
    15: { name: "Chicago", base: 1700 },
  };
  
  const rentalPricesData = [];
  
  for (const [cityIdStr, cityData] of Object.entries(cityRentalBases)) {
    const cityId = parseInt(cityIdStr);
    
    for (const apartmentType of apartmentTypes) {
      // Multiplier for apartment type
      let typeMultiplier = 1.0;
      if (apartmentType === "1-bedroom") typeMultiplier = 0.7;
      else if (apartmentType === "2-bedroom") typeMultiplier = 1.0;
      else if (apartmentType === "3-bedroom") typeMultiplier = 1.4;
      else if (apartmentType === "house") typeMultiplier = 1.8;
      
      const baseRent = Math.floor(cityData.base * typeMultiplier);
      
      // Generate data for 2020-2024 with yearly growth
      for (let year = 2020; year <= 2024; year++) {
        // 3-8% yearly growth
        const yearsSince2020 = year - 2020;
        const yearlyGrowth = 0.05 + (Math.random() * 0.03); // 5-8%
        const monthlyRent = Math.floor(baseRent * Math.pow(1 + yearlyGrowth, yearsSince2020));
        
        rentalPricesData.push({
          cityId,
          districtId: null, // City-level average
          year,
          apartmentType,
          monthlyRent,
        });
      }
    }
  }

  // Insert rental prices data in batches
  console.log(`Inserting ${rentalPricesData.length} rental price records...`);
  for (let i = 0; i < rentalPricesData.length; i += 100) {
    const batch = rentalPricesData.slice(i, i + 100);
    await db.insert(rentalPrices).values(batch);
  }

  console.log("✅ Rental prices data seeded successfully!");
  console.log(`   - ${rentalPricesData.length} rental price records`);
  console.log(`   - 15 cities × 4 apartment types × 5 years = ${15 * 4 * 5} records`);
  
  process.exit(0);
}

seedRentalPrices().catch((error) => {
  console.error("Error seeding rental prices data:", error);
  process.exit(1);
});
