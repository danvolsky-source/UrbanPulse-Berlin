/**
 * Extend historical data from 2015-2019 for all cities
 * This adds 5 more years of data to existing 2020-2024 range
 */

import { getDb } from "../server/db";
import { cities, ecology, vehicles, unemployment, socialBenefits, taxBurden, averageIncome, communityGrowth, propertyPrices, districts } from "../drizzle/schema";

async function extendHistoricalData() {
  console.log("🚀 Starting historical data extension (2015-2019)...");

  const db = await getDb();
  if (!db) {
    throw new Error("Database connection failed");
  }

  // Get all cities
  const allCities = await db.select().from(cities);
  console.log(`Found ${allCities.length} cities`);

  // Get all districts for property prices
  const allDistricts = await db.select().from(districts);
  console.log(`Found ${allDistricts.length} districts`);

  const years = [2015, 2016, 2017, 2018, 2019];

  for (const city of allCities) {
    console.log(`\n📍 Processing ${city.name}...`);

    for (const year of years) {
      // 1. Ecology data (air quality improving over time)
      const baseAQI = 85 + (year - 2015) * -3; // Improving from 85 to 73
      const baseCO2 = 8 + (year - 2015) * -0.3; // Reducing from 8 to 6.8
      const baseGreenSpace = 45 + (year - 2015) * 2; // Increasing from 45 to 53
      const baseEcoRating = 65 + (year - 2015) * 3; // Improving from 65 to 77

      await db.insert(ecology).values({
        cityId: city.id,
        year,
        aqi: Math.floor(baseAQI + Math.random() * 10 - 5),
        co2Emissions: Math.floor(baseCO2 + Math.random() * 2 - 1),
        greenSpaceArea: Math.floor(baseGreenSpace + Math.random() * 5),
        ecoRating: Math.floor(baseEcoRating + Math.random() * 5),
      });

      // 2. Vehicles data (EV adoption growing)
      const baseTotalVehicles = 500000 + Math.floor(Math.random() * 200000);
      const baseEvPercent = 8 + (year - 2015) * 2; // Increasing from 8% to 16%
      const baseElectricVehicles = Math.floor(baseTotalVehicles * baseEvPercent / 100);
      const baseGasolineVehicles = baseTotalVehicles - baseElectricVehicles;
      const baseChargingStations = Math.floor(baseElectricVehicles / 10); // 1 station per 10 EVs

      await db.insert(vehicles).values({
        cityId: city.id,
        year,
        totalVehicles: baseTotalVehicles,
        electricVehicles: baseElectricVehicles,
        gasolineVehicles: baseGasolineVehicles,
        chargingStations: baseChargingStations,
      });

      // 3. Unemployment (all required fields)
      const baseUnemploymentRate = 65 + Math.floor(Math.sin((year - 2015) * 0.8) * 15); // 50-80 (5.0%-8.0%)
      const youthRate = baseUnemploymentRate + 20; // Youth unemployment higher
      const longTermRate = Math.floor(baseUnemploymentRate * 0.4); // 40% are long-term
      const foreignerRate = baseUnemploymentRate + 15; // Foreigner rate higher

      await db.insert(unemployment).values({
        cityId: city.id,
        year,
        unemploymentRate: baseUnemploymentRate,
        youthUnemploymentRate: youthRate,
        longTermUnemployed: longTermRate,
        foreignerUnemploymentRate: foreignerRate,
      });

      // 4. Social Benefits (all required fields)
      const baseTotalSpending = 800 + (year - 2015) * 120; // Growing from €800M to €1,280M
      const unemploymentBenefits = Math.floor(baseTotalSpending * 0.25);
      const housingBenefits = Math.floor(baseTotalSpending * 0.30);
      const childBenefits = Math.floor(baseTotalSpending * 0.25);
      const refugeeBenefits = Math.floor(baseTotalSpending * 0.20);
      const beneficiariesCount = Math.floor(city.population * 0.15); // 15% receive benefits
      const foreignerBeneficiariesPercent = 35 + Math.floor(Math.random() * 10); // 35-45%

      await db.insert(socialBenefits).values({
        cityId: city.id,
        year,
        totalBenefitsSpending: baseTotalSpending,
        unemploymentBenefits,
        housingBenefits,
        childBenefits,
        refugeeBenefits,
        beneficiariesCount,
        foreignerBeneficiariesPercent,
      });

      // 5. Tax Burden (all required fields)
      const averageTaxRate = 420 + Math.floor((year - 2015) * 8); // 42.0% to 45.2%
      const socialSecurityRate = 195 + Math.floor((year - 2015) * 2); // 19.5% to 20.3%
      const totalTaxRevenue = Math.floor(city.population * 12000 / 1000000); // €12k per capita in millions
      const taxRevenuePerCapita = 12000 + (year - 2015) * 500; // Growing with inflation

      await db.insert(taxBurden).values({
        cityId: city.id,
        year,
        averageTaxRate,
        socialSecurityRate,
        totalTaxRevenue,
        taxRevenuePerCapita,
        socialSpendingPercent: 45 + Math.floor(Math.random() * 10), // 45-55%
      });

      // 6. Average Income (all required fields)
      const averageMonthlyIncome = 3800 + (year - 2015) * 150; // Growing from €3,800 to €4,550
      const medianMonthlyIncome = Math.floor(averageMonthlyIncome * 0.85); // Median is 85% of average
      const foreignerAverageIncome = Math.floor(averageMonthlyIncome * 0.75); // Foreigners earn 75% of average
      const incomeGrowthRate = 25 + Math.floor(Math.random() * 15); // 2.5% to 4.0% growth

      await db.insert(averageIncome).values({
        cityId: city.id,
        year,
        averageMonthlyIncome,
        medianMonthlyIncome,
        foreignerAverageIncome,
        incomeGrowthRate,
      });

      // 7. Community Growth (5 communities)
      const communities = ["Muslim", "Hindu", "Buddhist", "Sikh", "Jewish"];
      for (const community of communities) {
        const baseGrowth = 25 + Math.floor(Math.random() * 30); // 2.5% to 5.5% growth (stored as 25-55)
        const percentage = 50 + Math.floor(Math.random() * 100); // 5.0% to 15.0% of population (stored as 50-150)

        await db.insert(communityGrowth).values({
          cityId: city.id,
          year,
          communityType: community,
          percentage,
          growthRate: baseGrowth,
        });
      }

      console.log(`  ✅ ${year} data added`);
    }

    // 8. Property Prices (only for cities with districts)
    const cityDistricts = allDistricts.filter(d => d.city === city.name);
    if (cityDistricts.length > 0) {
      console.log(`  📊 Adding property prices for ${cityDistricts.length} districts...`);
      
      for (const district of cityDistricts) {
        for (const year of years) {
          // Property prices growing 3-5% per year
          const basePrice = 3200 + (year - 2015) * 180; // Growing from €3,200 to €4,120
          const districtMultiplier = 0.8 + Math.random() * 0.4; // 0.8x to 1.2x

          for (let month = 1; month <= 12; month++) {
            const monthlyVariation = Math.sin(month * 0.5) * 100; // Seasonal variation
            const price = Math.floor((basePrice + monthlyVariation) * districtMultiplier);

            await db.insert(propertyPrices).values({
              districtId: district.id,
              year,
              month,
              averagePricePerSqm: price,
            });
          }
        }
      }
      console.log(`  ✅ Property prices added for all districts`);
    }
  }

  console.log("\n✅ Historical data extension complete!");
  console.log("📊 Added data for years: 2015, 2016, 2017, 2018, 2019");
  console.log("📈 Total new records: ~" + (allCities.length * years.length * 7 + allDistricts.length * years.length * 12));
}

extendHistoricalData()
  .then(() => {
    console.log("\n🎉 Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
