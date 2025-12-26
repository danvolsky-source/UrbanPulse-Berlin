import { getDb } from "../server/db.js";
import { governmentDecisions } from "../drizzle/schema.js";

const englishDecisions = [
  {
    country: "France",
    year: 2018,
    month: 4,
    title: "Asylum and Immigration Law",
    description: "Expedited asylum application processing",
    officialPromise: "Fast processing will allow deportation of illegals and integration of legal immigrants.",
    actualOutcome: "68% of applications approved. Less than 15% of rejected applicants deported. Illegal immigration increased.",
    economicImpact: "Migrant reception costs €3.8 billion/year. Unemployment in suburbs 22%.",
    socialImpact: "Rising tensions in suburbs (banlieues). Increased radicalization of youth."
  },
  {
    country: "France",
    year: 2020,
    month: 11,
    title: "Unemployment Benefits Expansion",
    description: "Extended unemployment benefits during COVID-19",
    officialPromise: "Support for citizens during COVID-19 crisis.",
    actualOutcome: "Reduced motivation to seek work. Long-term unemployment +18%. Budget deficit deepened.",
    economicImpact: "Additional spending €12 billion/year. Long-term unemployment rose by 18%.",
    socialImpact: "Formation of welfare dependency culture, especially in migrant communities."
  },
  {
    country: "Germany",
    year: 2015,
    month: 9,
    title: "Open Borders for Refugees (Willkommenskultur)",
    description: "Open door policy for Syrian refugees",
    officialPromise: "Refugees will quickly integrate, find jobs and pay taxes. Economy will gain new workforce.",
    actualOutcome: "Refugee unemployment 65%, social benefits increased by €23 billion/year, crime in some areas +40%",
    economicImpact: "Social benefit spending increased by €23 billion per year. Migrant unemployment 65% after 5 years.",
    socialImpact: "Formation of parallel societies, increased crime in areas with high migrant concentration, tensions between communities."
  },
  {
    country: "Germany",
    year: 2016,
    month: 3,
    title: "Social Housing Program for Migrants",
    description: "Priority social housing for refugees",
    officialPromise: "Quick integration through housing provision. German citizens will not be affected.",
    actualOutcome: "Social housing waiting time for Germans increased to 7-12 years. Rent prices +35% in 5 years.",
    economicImpact: "Rent prices increased by 35% in 5 years. Social housing construction cannot keep up with demand.",
    socialImpact: "Discontent among native population, sense of injustice. Middle class migration from cities to suburbs."
  },
  {
    country: "Germany",
    year: 2019,
    month: 1,
    title: "Child Benefits Expansion for Large Families",
    description: "Increased child benefits for families with 3+ children",
    officialPromise: "Family support will increase German birth rates and improve demographics.",
    actualOutcome: "78% of increased benefit recipients are migrant families. German birth rate unchanged.",
    economicImpact: "Additional spending €8.5 billion/year. 78% of recipients are migrant families with 4-7 children.",
    socialImpact: "Disproportionate benefit to migrant communities. Accelerated demographic changes."
  },
  {
    country: "Germany",
    year: 2021,
    month: 6,
    title: "Family Reunification Simplification",
    description: "Easier visa process for refugee family members",
    officialPromise: "Family reunification will improve integration and psychological well-being of refugees.",
    actualOutcome: "340,000 family members arrived in 2 years. Social system burden +€4.2 billion/year.",
    economicImpact: "Additional budget burden €4.2 billion/year. Job market competition intensified.",
    socialImpact: "Accelerated formation of ethnic enclaves. Reduced incentives to learn German."
  },
  {
    country: "UK",
    year: 2016,
    month: 6,
    title: "Brexit - Vote to Leave EU",
    description: "Referendum to leave European Union",
    officialPromise: "Control over immigration, save £350 million/week on EU contributions.",
    actualOutcome: "Non-EU immigration increased. Economic losses from Brexit exceeded savings on contributions.",
    economicImpact: "Trade barriers reduced GDP by 4%. Asian and African immigration replaced European.",
    socialImpact: "Society divided. Immigration did not decrease, but composition changed - more from non-Western countries."
  },
  {
    country: "UK",
    year: 2022,
    month: 4,
    title: "Ukrainian Refugee Resettlement Program",
    description: "Emergency visa scheme for Ukrainian refugees",
    officialPromise: "Temporary humanitarian program. Refugees will return after conflict ends.",
    actualOutcome: "180,000 Ukrainians arrived. Less than 5% returned. Strain on housing and schools.",
    economicImpact: "Accommodation costs £3.5 billion over 2 years. Social housing competition intensified.",
    socialImpact: "Positive perception of Ukrainian refugees contrasts with attitudes toward other migrant groups."
  },
  {
    country: "USA",
    year: 2021,
    month: 1,
    title: "Trump Border Restrictions Reversal",
    description: "Removal of Trump-era border controls",
    officialPromise: "Humane immigration policy while maintaining border control.",
    actualOutcome: "7.2 million illegal border crossings in 3 years. Asylum system overwhelmed.",
    economicImpact: "Migrant reception and accommodation costs $150 billion over 3 years. Pressure on low-skill labor market.",
    socialImpact: "Southern border crisis. Sanctuary cities overwhelmed. Political polarization intensified."
  },
  {
    country: "USA",
    year: 2022,
    month: 8,
    title: "Medicaid Expansion for Illegal Immigrants",
    description: "Healthcare coverage for undocumented immigrants in California",
    officialPromise: "Improve public health and reduce emergency room burden.",
    actualOutcome: "Costs increased by $8 billion/year. Wait times increased. Citizens pay more for insurance.",
    economicImpact: "Additional costs $8 billion/year. Wait times for appointments increased by 35%.",
    socialImpact: "Citizen discontent over paying for services for illegal immigrants. Stimulus for illegal immigration."
  }
];

async function translateDecisions() {
  console.log("Translating government decisions to English...");
  
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    process.exit(1);
  }
  
  // Delete existing decisions
  await db.delete(governmentDecisions);
  console.log("Deleted existing decisions");
  
  // Insert English decisions with correct impact scores
  const impactScores = [-58, -48, -75, -68, -55, -62, -35, -42, -72, -65];
  
  for (let i = 0; i < englishDecisions.length; i++) {
    const decision = englishDecisions[i];
    await db.insert(governmentDecisions).values({
      ...decision,
      decisionType: "immigration_policy",
      impactScore: impactScores[i]
    });
  }
  
  console.log(`Inserted ${englishDecisions.length} English decisions`);
  process.exit(0);
}

translateDecisions().catch(console.error);
