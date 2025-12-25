import { getDb } from "../server/db";
import { communityGrowth, migrationEvents } from "../drizzle/schema";

async function seedCommunityImpact() {
  const db = await getDb();
  if (!db) {
    console.error("Database connection failed");
    process.exit(1);
  }

  console.log("Seeding community growth and migration events data...");

  // Community types
  const communities = ["Muslim", "Hindu", "Buddhist", "Sikh", "Jewish"];
  
  // City IDs (1-15 for our 15 cities)
  const cityIds = Array.from({ length: 15 }, (_, i) => i + 1);
  
  // Generate community growth data (2020-2024) for each city
  const communityGrowthData = [];
  
  for (const cityId of cityIds) {
    for (const community of communities) {
      // Base percentage for this community in this city (random 5-30%)
      const basePercentage = Math.floor(Math.random() * 25) + 5;
      
      for (let year = 2020; year <= 2024; year++) {
        // Growth rate: 0.5% to 3% per year
        const yearsSince2020 = year - 2020;
        const growthRate = Math.floor(Math.random() * 25) + 5; // 0.5-3% (stored as 5-30 for integer)
        const percentage = Math.min(100, basePercentage + (yearsSince2020 * growthRate / 10));
        
        communityGrowthData.push({
          cityId,
          districtId: null, // City-level data
          year,
          communityType: community,
          percentage: Math.floor(percentage),
          growthRate,
        });
      }
    }
  }

  // Insert community growth data in batches
  console.log(`Inserting ${communityGrowthData.length} community growth records...`);
  for (let i = 0; i < communityGrowthData.length; i += 100) {
    const batch = communityGrowthData.slice(i, i + 100);
    await db.insert(communityGrowth).values(batch);
  }

  // Migration events data
  const migrationEventsData = [
    // Berlin events
    {
      cityId: 1,
      year: 2020,
      month: 3,
      eventType: "policy_change",
      title: "COVID-19 Border Restrictions",
      description: "Germany implements strict border controls affecting migration patterns",
      impactScore: 75,
      affectedCommunity: "All",
    },
    {
      cityId: 1,
      year: 2021,
      month: 8,
      eventType: "refugee_wave",
      title: "Afghan Refugee Crisis",
      description: "Berlin receives significant number of Afghan refugees following Taliban takeover",
      impactScore: 85,
      affectedCommunity: "Muslim",
    },
    {
      cityId: 1,
      year: 2022,
      month: 2,
      eventType: "refugee_wave",
      title: "Ukrainian Refugee Wave",
      description: "Large influx of Ukrainian refugees to Berlin",
      impactScore: 90,
      affectedCommunity: "All",
    },
    {
      cityId: 1,
      year: 2023,
      month: 6,
      eventType: "economic_migration",
      title: "Tech Worker Immigration Increase",
      description: "Berlin attracts increased tech talent from South Asia",
      impactScore: 65,
      affectedCommunity: "Hindu",
    },
    {
      cityId: 1,
      year: 2024,
      month: 1,
      eventType: "policy_change",
      title: "Skilled Worker Immigration Act",
      description: "New legislation eases immigration for skilled workers",
      impactScore: 70,
      affectedCommunity: "All",
    },
    
    // Munich events
    {
      cityId: 2,
      year: 2021,
      month: 9,
      eventType: "economic_migration",
      title: "Corporate Expansion",
      description: "Major tech companies expand Munich offices, attracting international talent",
      impactScore: 72,
      affectedCommunity: "All",
    },
    {
      cityId: 2,
      year: 2022,
      month: 3,
      eventType: "refugee_wave",
      title: "Ukrainian Refugee Integration",
      description: "Munich implements comprehensive refugee integration programs",
      impactScore: 88,
      affectedCommunity: "All",
    },
    
    // Paris events
    {
      cityId: 5,
      year: 2020,
      month: 11,
      eventType: "policy_change",
      title: "Immigration Policy Reform",
      description: "France updates immigration policies affecting family reunification",
      impactScore: 68,
      affectedCommunity: "Muslim",
    },
    {
      cityId: 5,
      year: 2022,
      month: 6,
      eventType: "economic_migration",
      title: "Post-Brexit Talent Attraction",
      description: "Paris attracts financial sector workers from London",
      impactScore: 75,
      affectedCommunity: "All",
    },
    {
      cityId: 5,
      year: 2023,
      month: 9,
      eventType: "refugee_wave",
      title: "North African Migration Increase",
      description: "Increased migration from North Africa due to economic factors",
      impactScore: 80,
      affectedCommunity: "Muslim",
    },
    
    // London events
    {
      cityId: 10,
      year: 2021,
      month: 1,
      eventType: "policy_change",
      title: "Post-Brexit Immigration System",
      description: "New points-based immigration system implemented",
      impactScore: 85,
      affectedCommunity: "All",
    },
    {
      cityId: 10,
      year: 2022,
      month: 4,
      eventType: "refugee_wave",
      title: "Hong Kong BNO Visa Scheme",
      description: "Large influx of Hong Kong residents under BNO visa program",
      impactScore: 78,
      affectedCommunity: "Buddhist",
    },
    {
      cityId: 10,
      year: 2023,
      month: 7,
      eventType: "economic_migration",
      title: "Healthcare Worker Recruitment",
      description: "NHS recruits healthcare workers from South Asia",
      impactScore: 70,
      affectedCommunity: "Hindu",
    },
    
    // New York events
    {
      cityId: 12,
      year: 2021,
      month: 5,
      eventType: "policy_change",
      title: "Immigration Policy Shift",
      description: "Biden administration reverses restrictive immigration policies",
      impactScore: 82,
      affectedCommunity: "All",
    },
    {
      cityId: 12,
      year: 2022,
      month: 9,
      eventType: "refugee_wave",
      title: "Venezuelan Migration Wave",
      description: "Increased migration from Venezuela to New York",
      impactScore: 76,
      affectedCommunity: "All",
    },
    {
      cityId: 12,
      year: 2023,
      month: 11,
      eventType: "economic_migration",
      title: "Tech Industry Recovery",
      description: "Tech sector recovery attracts international talent",
      impactScore: 73,
      affectedCommunity: "All",
    },
  ];

  console.log(`Inserting ${migrationEventsData.length} migration events...`);
  await db.insert(migrationEvents).values(migrationEventsData);

  console.log("✅ Community impact data seeded successfully!");
  console.log(`   - ${communityGrowthData.length} community growth records`);
  console.log(`   - ${migrationEventsData.length} migration events`);
  
  process.exit(0);
}

seedCommunityImpact().catch((error) => {
  console.error("Error seeding community impact data:", error);
  process.exit(1);
});
