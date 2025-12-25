import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL!;

async function main() {
  console.log('🌍 Seeding European cities data...\n');

  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection, { schema, mode: 'default' });

  // Define cities with realistic data
  const cities = [
    {
      name: 'Paris',
      country: 'France',
      population: 2161000,
      area: 105.4,
      districts: [
        { name: '1st arrondissement', nameLocal: '1er arrondissement', population: 16888, area: 1.83 },
        { name: '2nd arrondissement', nameLocal: '2e arrondissement', population: 22000, area: 0.99 },
        { name: '3rd arrondissement', nameLocal: '3e arrondissement', population: 35000, area: 1.17 },
        { name: '4th arrondissement', nameLocal: '4e arrondissement', population: 28000, area: 1.60 },
        { name: '5th arrondissement', nameLocal: '5e arrondissement', population: 58850, area: 2.54 },
        { name: '6th arrondissement', nameLocal: '6e arrondissement', population: 41100, area: 2.15 },
        { name: '7th arrondissement', nameLocal: '7e arrondissement', population: 51400, area: 4.09 },
        { name: '8th arrondissement', nameLocal: '8e arrondissement', population: 37000, area: 3.88 },
        { name: '9th arrondissement', nameLocal: '9e arrondissement', population: 59500, area: 2.18 },
        { name: '10th arrondissement', nameLocal: '10e arrondissement', population: 89000, area: 2.89 },
        { name: '11th arrondissement', nameLocal: '11e arrondissement', population: 147000, area: 3.67 },
        { name: '12th arrondissement', nameLocal: '12e arrondissement', population: 142000, area: 16.32 },
        { name: '13th arrondissement', nameLocal: '13e arrondissement', population: 181000, area: 7.15 },
        { name: '14th arrondissement', nameLocal: '14e arrondissement', population: 133000, area: 5.64 },
        { name: '15th arrondissement', nameLocal: '15e arrondissement', population: 232000, area: 8.50 },
        { name: '16th arrondissement', nameLocal: '16e arrondissement', population: 166000, area: 16.31 },
        { name: '17th arrondissement', nameLocal: '17e arrondissement', population: 168000, area: 5.67 },
        { name: '18th arrondissement', nameLocal: '18e arrondissement', population: 195000, area: 6.01 },
        { name: '19th arrondissement', nameLocal: '19e arrondissement', population: 186000, area: 6.79 },
        { name: '20th arrondissement', nameLocal: '20e arrondissement', population: 195000, area: 5.98 },
      ],
      communities: ['Algerian', 'Moroccan', 'Tunisian', 'Sub-Saharan African', 'Vietnamese'],
      mosques: 96,
      churches: 385,
      synagogues: 38,
    },
    {
      name: 'Vienna',
      country: 'Austria',
      population: 1975000,
      area: 414.65,
      districts: [
        { name: 'Innere Stadt', nameLocal: 'Innere Stadt', population: 16500, area: 2.88 },
        { name: 'Leopoldstadt', nameLocal: 'Leopoldstadt', population: 108000, area: 19.27 },
        { name: 'Landstraße', nameLocal: 'Landstraße', population: 91000, area: 7.42 },
        { name: 'Wieden', nameLocal: 'Wieden', population: 33000, area: 1.78 },
        { name: 'Margareten', nameLocal: 'Margareten', population: 55000, area: 2.03 },
        { name: 'Mariahilf', nameLocal: 'Mariahilf', population: 32000, area: 1.48 },
        { name: 'Neubau', nameLocal: 'Neubau', population: 32000, area: 1.61 },
        { name: 'Josefstadt', nameLocal: 'Josefstadt', population: 25000, area: 1.08 },
        { name: 'Alsergrund', nameLocal: 'Alsergrund', population: 43000, area: 2.99 },
        { name: 'Favoriten', nameLocal: 'Favoriten', population: 205000, area: 31.80 },
        { name: 'Simmering', nameLocal: 'Simmering', population: 107000, area: 23.24 },
        { name: 'Meidling', nameLocal: 'Meidling', population: 98000, area: 8.20 },
        { name: 'Hietzing', nameLocal: 'Hietzing', population: 53000, area: 37.70 },
        { name: 'Penzing', nameLocal: 'Penzing', population: 93000, area: 33.85 },
        { name: 'Rudolfsheim-Fünfhaus', nameLocal: 'Rudolfsheim-Fünfhaus', population: 77000, area: 3.92 },
        { name: 'Ottakring', nameLocal: 'Ottakring', population: 105000, area: 8.67 },
        { name: 'Hernals', nameLocal: 'Hernals', population: 56000, area: 11.35 },
        { name: 'Währing', nameLocal: 'Währing', population: 52000, area: 6.28 },
        { name: 'Döbling', nameLocal: 'Döbling', population: 73000, area: 24.90 },
        { name: 'Brigittenau', nameLocal: 'Brigittenau', population: 89000, area: 5.67 },
      ],
      communities: ['Turkish', 'Serbian', 'Polish', 'Romanian', 'Bosnian'],
      mosques: 62,
      churches: 420,
      synagogues: 7,
    },
    {
      name: 'Rome',
      country: 'Italy',
      population: 2873000,
      area: 1285,
      districts: [
        { name: 'Centro Storico', nameLocal: 'Centro Storico', population: 120000, area: 22.0 },
        { name: 'Parioli', nameLocal: 'Parioli', population: 95000, area: 15.0 },
        { name: 'Pinciano', nameLocal: 'Pinciano', population: 45000, area: 8.5 },
        { name: 'Salario', nameLocal: 'Salario', population: 138000, area: 18.0 },
        { name: 'Nomentano', nameLocal: 'Nomentano', population: 165000, area: 25.0 },
        { name: 'Tiburtino', nameLocal: 'Tiburtino', population: 180000, area: 32.0 },
        { name: 'Prenestino-Labicano', nameLocal: 'Prenestino-Labicano', population: 195000, area: 40.0 },
        { name: 'Tuscolano', nameLocal: 'Tuscolano', population: 210000, area: 35.0 },
        { name: 'Appio-Latino', nameLocal: 'Appio-Latino', population: 175000, area: 28.0 },
        { name: 'Ostiense', nameLocal: 'Ostiense', population: 95000, area: 18.0 },
        { name: 'Portuense', nameLocal: 'Portuense', population: 145000, area: 45.0 },
        { name: 'Gianicolense', nameLocal: 'Gianicolense', population: 125000, area: 30.0 },
        { name: 'Aurelio', nameLocal: 'Aurelio', population: 155000, area: 38.0 },
        { name: 'Trionfale', nameLocal: 'Trionfale', population: 135000, area: 22.0 },
        { name: 'Della Vittoria', nameLocal: 'Della Vittoria', population: 85000, area: 12.0 },
        { name: 'Flaminio', nameLocal: 'Flaminio', population: 75000, area: 10.0 },
        { name: 'EUR', nameLocal: 'EUR', population: 45000, area: 55.0 },
        { name: 'Ostia', nameLocal: 'Ostia', population: 85000, area: 150.0 },
      ],
      communities: ['Romanian', 'Bangladeshi', 'Filipino', 'Egyptian', 'Chinese'],
      mosques: 48,
      churches: 900,
      synagogues: 2,
    },
    {
      name: 'Amsterdam',
      country: 'Netherlands',
      population: 872000,
      area: 219.32,
      districts: [
        { name: 'Centrum', nameLocal: 'Centrum', population: 85000, area: 8.04 },
        { name: 'Noord', nameLocal: 'Noord', population: 95000, area: 49.01 },
        { name: 'Oost', nameLocal: 'Oost', population: 145000, area: 24.03 },
        { name: 'Zuid', nameLocal: 'Zuid', population: 143000, area: 16.89 },
        { name: 'West', nameLocal: 'West', population: 145000, area: 11.06 },
        { name: 'Nieuw-West', nameLocal: 'Nieuw-West', population: 150000, area: 31.90 },
        { name: 'Zuidoost', nameLocal: 'Zuidoost', population: 87000, area: 22.18 },
        { name: 'Westpoort', nameLocal: 'Westpoort', population: 900, area: 56.44 },
      ],
      communities: ['Moroccan', 'Turkish', 'Surinamese', 'Indonesian', 'Ghanaian'],
      mosques: 45,
      churches: 215,
      synagogues: 12,
    },
    {
      name: 'Brussels',
      country: 'Belgium',
      population: 1218000,
      area: 161.38,
      districts: [
        { name: 'City of Brussels', nameLocal: 'Ville de Bruxelles', population: 185000, area: 32.61 },
        { name: 'Schaerbeek', nameLocal: 'Schaerbeek', population: 133000, area: 8.14 },
        { name: 'Molenbeek-Saint-Jean', nameLocal: 'Molenbeek-Saint-Jean', population: 97000, area: 5.89 },
        { name: 'Ixelles', nameLocal: 'Ixelles', population: 87000, area: 6.34 },
        { name: 'Anderlecht', nameLocal: 'Anderlecht', population: 121000, area: 17.74 },
        { name: 'Saint-Gilles', nameLocal: 'Saint-Gilles', population: 50000, area: 2.52 },
        { name: 'Forest', nameLocal: 'Forest', population: 56000, area: 6.25 },
        { name: 'Uccle', nameLocal: 'Uccle', population: 84000, area: 22.87 },
        { name: 'Etterbeek', nameLocal: 'Etterbeek', population: 48000, area: 3.15 },
        { name: 'Woluwe-Saint-Lambert', nameLocal: 'Woluwe-Saint-Lambert', population: 56000, area: 7.22 },
        { name: 'Woluwe-Saint-Pierre', nameLocal: 'Woluwe-Saint-Pierre', population: 42000, area: 8.85 },
        { name: 'Auderghem', nameLocal: 'Auderghem', population: 34000, area: 9.03 },
        { name: 'Watermael-Boitsfort', nameLocal: 'Watermael-Boitsfort', population: 25000, area: 12.93 },
        { name: 'Evere', nameLocal: 'Evere', population: 42000, area: 5.08 },
        { name: 'Saint-Josse-ten-Noode', nameLocal: 'Saint-Josse-ten-Noode', population: 27000, area: 1.14 },
        { name: 'Koekelberg', nameLocal: 'Koekelberg', population: 22000, area: 1.17 },
        { name: 'Ganshoren', nameLocal: 'Ganshoren', population: 25000, area: 2.46 },
        { name: 'Berchem-Sainte-Agathe', nameLocal: 'Berchem-Sainte-Agathe', population: 25000, area: 2.95 },
        { name: 'Jette', nameLocal: 'Jette', population: 53000, area: 5.04 },
      ],
      communities: ['Moroccan', 'Turkish', 'Congolese', 'Romanian', 'Polish'],
      mosques: 78,
      churches: 295,
      synagogues: 18,
    },
  ];

  const years = [2020, 2021, 2022, 2023, 2024];

  for (const city of cities) {
    console.log(`📍 Processing ${city.name}...`);

    // Insert districts and get their IDs
    const districtIdMap = new Map<string, number>();
    
    for (const district of city.districts) {
      const foreignerPercentage = Math.floor(Math.random() * 30 + 10); // 10-40%
      const dominantCommunity = city.communities[Math.floor(Math.random() * city.communities.length)];
      
      const [result] = await db.insert(schema.districts).values({
        city: city.name,
        name: district.name,
        nameEn: district.name,
        population: district.population,
        area: Math.round(district.area),
        foreignerPercentage,
        dominantCommunity,
      });
      
      // Store the inserted district ID
      const districtId = Number(result.insertId);
      districtIdMap.set(district.name, districtId);
    }
    
    console.log(`  ✅ Inserted ${city.districts.length} districts`);

    // Insert demographics for each district
    const demographicRecords = [];
    for (const district of city.districts) {
      const districtId = districtIdMap.get(district.name)!;
      
      for (const community of city.communities) {
        const basePercentage = Math.random() * 15 + 5; // 5-20%
        for (const year of years) {
          const yearIndex = years.indexOf(year);
          const growth = 1 + (Math.random() * 0.15 - 0.05) * yearIndex; // -5% to +15% growth over years
          const percentage = basePercentage * growth;
          const population = Math.round((district.population * percentage) / 100);
          const percentageOfDistrict = Math.round(percentage * 10); // Convert to integer (e.g., 48 for 4.8%)

          demographicRecords.push({
            districtId,
            year,
            community,
            population,
            percentageOfDistrict,
          });
        }
      }
    }

    // Insert in batches of 100
    for (let i = 0; i < demographicRecords.length; i += 100) {
      const batch = demographicRecords.slice(i, i + 100);
      await db.insert(schema.demographics).values(batch);
    }
    console.log(`  ✅ Inserted ${demographicRecords.length} demographic records`);

    // Insert infrastructure
    const infrastructureRecords = [];
    
    // Distribute mosques across districts
    for (let i = 0; i < city.mosques; i++) {
      const district = city.districts[Math.floor(Math.random() * city.districts.length)];
      const districtId = districtIdMap.get(district.name)!;
      const community = city.communities[Math.floor(Math.random() * city.communities.length)];
      
      infrastructureRecords.push({
        districtId,
        type: 'mosque' as const,
        name: `Mosque ${i + 1}`,
        address: `${district.name}, ${city.name}`,
        community,
        latitude: '0',
        longitude: '0',
      });
    }

    // Distribute churches across districts
    for (let i = 0; i < city.churches; i++) {
      const district = city.districts[Math.floor(Math.random() * city.districts.length)];
      const districtId = districtIdMap.get(district.name)!;
      
      infrastructureRecords.push({
        districtId,
        type: 'church' as const,
        name: `Church ${i + 1}`,
        address: `${district.name}, ${city.name}`,
        community: 'Christian',
        latitude: '0',
        longitude: '0',
      });
    }

    // Distribute synagogues across districts
    for (let i = 0; i < city.synagogues; i++) {
      const district = city.districts[Math.floor(Math.random() * city.districts.length)];
      const districtId = districtIdMap.get(district.name)!;
      
      infrastructureRecords.push({
        districtId,
        type: 'synagogue' as const,
        name: `Synagogue ${i + 1}`,
        address: `${district.name}, ${city.name}`,
        community: 'Jewish',
        latitude: '0',
        longitude: '0',
      });
    }

    // Insert in batches of 100
    for (let i = 0; i < infrastructureRecords.length; i += 100) {
      const batch = infrastructureRecords.slice(i, i + 100);
      await db.insert(schema.communityInfrastructure).values(batch);
    }
    console.log(`  ✅ Inserted ${infrastructureRecords.length} infrastructure records`);

    // Insert city summary for each year
    const citySummaryRecords = [];
    for (const year of years) {
      const yearIndex = years.indexOf(year);
      const mosqueGrowth = 1 + (Math.random() * 0.08 - 0.02) * yearIndex;
      const churchGrowth = 1 + (Math.random() * 0.04 - 0.01) * yearIndex;
      const synagogueGrowth = 1 + (Math.random() * 0.03 - 0.01) * yearIndex;

      const foreignerPopulation = Math.round(city.population * (Math.random() * 0.15 + 0.15)); // 15-30% foreigners
      citySummaryRecords.push({
        city: city.name,
        year,
        totalPopulation: city.population,
        foreignerPopulation,
        mosquesCount: Math.round(city.mosques * mosqueGrowth),
        churchesCount: Math.round(city.churches * churchGrowth),
        synagoguesCount: Math.round(city.synagogues * synagogueGrowth),
      });
    }

    await db.insert(schema.citySummary).values(citySummaryRecords);
    console.log(`  ✅ Inserted ${citySummaryRecords.length} city summary records`);

    // Insert property prices for each district
    const propertyPriceRecords = [];
    for (const district of city.districts) {
      const districtId = districtIdMap.get(district.name)!;
      const basePrice = Math.random() * 5000 + 3000; // €3000-8000 per sqm
      
      for (const year of years) {
        const month = 12; // December
        const yearIndex = years.indexOf(year);
        const appreciation = 1 + (Math.random() * 0.12 + 0.03) * yearIndex; // 3-15% appreciation per year
        const pricePerSqm = basePrice * appreciation;

        propertyPriceRecords.push({
          districtId,
          year,
          month,
          averagePricePerSqm: Math.round(pricePerSqm),
        });
      }
    }

    // Insert in batches of 100
    for (let i = 0; i < propertyPriceRecords.length; i += 100) {
      const batch = propertyPriceRecords.slice(i, i + 100);
      await db.insert(schema.propertyPrices).values(batch);
    }
    console.log(`  ✅ Inserted ${propertyPriceRecords.length} property price records\n`);
  }

  await connection.end();
  console.log('✨ European cities seeding completed!');
}

main().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
