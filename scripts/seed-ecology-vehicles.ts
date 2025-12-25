import { drizzle } from "drizzle-orm/mysql2";
import { ecology, vehicles, cities } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

// Ecology data for all 15 cities (2020-2024)
const ecologyData = [
  // Berlin
  { city: "Berlin", year: 2020, aqi: 45, co2Emissions: 58, greenSpaceArea: 165, ecoRating: 72 },
  { city: "Berlin", year: 2021, aqi: 42, co2Emissions: 56, greenSpaceArea: 168, ecoRating: 74 },
  { city: "Berlin", year: 2022, aqi: 40, co2Emissions: 54, greenSpaceArea: 170, ecoRating: 76 },
  { city: "Berlin", year: 2023, aqi: 38, co2Emissions: 52, greenSpaceArea: 172, ecoRating: 78 },
  { city: "Berlin", year: 2024, aqi: 35, co2Emissions: 50, greenSpaceArea: 175, ecoRating: 80 },
  
  // Munich
  { city: "Munich", year: 2020, aqi: 38, co2Emissions: 52, greenSpaceArea: 95, ecoRating: 78 },
  { city: "Munich", year: 2021, aqi: 36, co2Emissions: 50, greenSpaceArea: 97, ecoRating: 80 },
  { city: "Munich", year: 2022, aqi: 34, co2Emissions: 48, greenSpaceArea: 99, ecoRating: 82 },
  { city: "Munich", year: 2023, aqi: 32, co2Emissions: 46, greenSpaceArea: 101, ecoRating: 84 },
  { city: "Munich", year: 2024, aqi: 30, co2Emissions: 44, greenSpaceArea: 103, ecoRating: 86 },
  
  // Hamburg
  { city: "Hamburg", year: 2020, aqi: 42, co2Emissions: 55, greenSpaceArea: 120, ecoRating: 74 },
  { city: "Hamburg", year: 2021, aqi: 40, co2Emissions: 53, greenSpaceArea: 122, ecoRating: 76 },
  { city: "Hamburg", year: 2022, aqi: 38, co2Emissions: 51, greenSpaceArea: 124, ecoRating: 78 },
  { city: "Hamburg", year: 2023, aqi: 36, co2Emissions: 49, greenSpaceArea: 126, ecoRating: 80 },
  { city: "Hamburg", year: 2024, aqi: 34, co2Emissions: 47, greenSpaceArea: 128, ecoRating: 82 },
  
  // Cologne
  { city: "Cologne", year: 2020, aqi: 48, co2Emissions: 60, greenSpaceArea: 85, ecoRating: 70 },
  { city: "Cologne", year: 2021, aqi: 46, co2Emissions: 58, greenSpaceArea: 87, ecoRating: 72 },
  { city: "Cologne", year: 2022, aqi: 44, co2Emissions: 56, greenSpaceArea: 89, ecoRating: 74 },
  { city: "Cologne", year: 2023, aqi: 42, co2Emissions: 54, greenSpaceArea: 91, ecoRating: 76 },
  { city: "Cologne", year: 2024, aqi: 40, co2Emissions: 52, greenSpaceArea: 93, ecoRating: 78 },
  
  // Paris
  { city: "Paris", year: 2020, aqi: 52, co2Emissions: 65, greenSpaceArea: 105, ecoRating: 68 },
  { city: "Paris", year: 2021, aqi: 50, co2Emissions: 63, greenSpaceArea: 108, ecoRating: 70 },
  { city: "Paris", year: 2022, aqi: 48, co2Emissions: 61, greenSpaceArea: 111, ecoRating: 72 },
  { city: "Paris", year: 2023, aqi: 46, co2Emissions: 59, greenSpaceArea: 114, ecoRating: 74 },
  { city: "Paris", year: 2024, aqi: 44, co2Emissions: 57, greenSpaceArea: 117, ecoRating: 76 },
  
  // Vienna
  { city: "Vienna", year: 2020, aqi: 35, co2Emissions: 48, greenSpaceArea: 140, ecoRating: 82 },
  { city: "Vienna", year: 2021, aqi: 33, co2Emissions: 46, greenSpaceArea: 142, ecoRating: 84 },
  { city: "Vienna", year: 2022, aqi: 31, co2Emissions: 44, greenSpaceArea: 144, ecoRating: 86 },
  { city: "Vienna", year: 2023, aqi: 29, co2Emissions: 42, greenSpaceArea: 146, ecoRating: 88 },
  { city: "Vienna", year: 2024, aqi: 27, co2Emissions: 40, greenSpaceArea: 148, ecoRating: 90 },
  
  // Rome
  { city: "Rome", year: 2020, aqi: 58, co2Emissions: 70, greenSpaceArea: 95, ecoRating: 62 },
  { city: "Rome", year: 2021, aqi: 56, co2Emissions: 68, greenSpaceArea: 97, ecoRating: 64 },
  { city: "Rome", year: 2022, aqi: 54, co2Emissions: 66, greenSpaceArea: 99, ecoRating: 66 },
  { city: "Rome", year: 2023, aqi: 52, co2Emissions: 64, greenSpaceArea: 101, ecoRating: 68 },
  { city: "Rome", year: 2024, aqi: 50, co2Emissions: 62, greenSpaceArea: 103, ecoRating: 70 },
  
  // Amsterdam
  { city: "Amsterdam", year: 2020, aqi: 32, co2Emissions: 45, greenSpaceArea: 75, ecoRating: 85 },
  { city: "Amsterdam", year: 2021, aqi: 30, co2Emissions: 43, greenSpaceArea: 77, ecoRating: 87 },
  { city: "Amsterdam", year: 2022, aqi: 28, co2Emissions: 41, greenSpaceArea: 79, ecoRating: 89 },
  { city: "Amsterdam", year: 2023, aqi: 26, co2Emissions: 39, greenSpaceArea: 81, ecoRating: 91 },
  { city: "Amsterdam", year: 2024, aqi: 24, co2Emissions: 37, greenSpaceArea: 83, ecoRating: 93 },
  
  // Brussels
  { city: "Brussels", year: 2020, aqi: 46, co2Emissions: 58, greenSpaceArea: 65, ecoRating: 72 },
  { city: "Brussels", year: 2021, aqi: 44, co2Emissions: 56, greenSpaceArea: 67, ecoRating: 74 },
  { city: "Brussels", year: 2022, aqi: 42, co2Emissions: 54, greenSpaceArea: 69, ecoRating: 76 },
  { city: "Brussels", year: 2023, aqi: 40, co2Emissions: 52, greenSpaceArea: 71, ecoRating: 78 },
  { city: "Brussels", year: 2024, aqi: 38, co2Emissions: 50, greenSpaceArea: 73, ecoRating: 80 },
  
  // London
  { city: "London", year: 2020, aqi: 55, co2Emissions: 68, greenSpaceArea: 350, ecoRating: 65 },
  { city: "London", year: 2021, aqi: 53, co2Emissions: 66, greenSpaceArea: 355, ecoRating: 67 },
  { city: "London", year: 2022, aqi: 51, co2Emissions: 64, greenSpaceArea: 360, ecoRating: 69 },
  { city: "London", year: 2023, aqi: 49, co2Emissions: 62, greenSpaceArea: 365, ecoRating: 71 },
  { city: "London", year: 2024, aqi: 47, co2Emissions: 60, greenSpaceArea: 370, ecoRating: 73 },
  
  // Washington D.C.
  { city: "Washington D.C.", year: 2020, aqi: 50, co2Emissions: 72, greenSpaceArea: 45, ecoRating: 68 },
  { city: "Washington D.C.", year: 2021, aqi: 48, co2Emissions: 70, greenSpaceArea: 46, ecoRating: 70 },
  { city: "Washington D.C.", year: 2022, aqi: 46, co2Emissions: 68, greenSpaceArea: 47, ecoRating: 72 },
  { city: "Washington D.C.", year: 2023, aqi: 44, co2Emissions: 66, greenSpaceArea: 48, ecoRating: 74 },
  { city: "Washington D.C.", year: 2024, aqi: 42, co2Emissions: 64, greenSpaceArea: 49, ecoRating: 76 },
  
  // New York
  { city: "New York", year: 2020, aqi: 58, co2Emissions: 78, greenSpaceArea: 115, ecoRating: 62 },
  { city: "New York", year: 2021, aqi: 56, co2Emissions: 76, greenSpaceArea: 117, ecoRating: 64 },
  { city: "New York", year: 2022, aqi: 54, co2Emissions: 74, greenSpaceArea: 119, ecoRating: 66 },
  { city: "New York", year: 2023, aqi: 52, co2Emissions: 72, greenSpaceArea: 121, ecoRating: 68 },
  { city: "New York", year: 2024, aqi: 50, co2Emissions: 70, greenSpaceArea: 123, ecoRating: 70 },
  
  // Toronto
  { city: "Toronto", year: 2020, aqi: 40, co2Emissions: 62, greenSpaceArea: 180, ecoRating: 76 },
  { city: "Toronto", year: 2021, aqi: 38, co2Emissions: 60, greenSpaceArea: 183, ecoRating: 78 },
  { city: "Toronto", year: 2022, aqi: 36, co2Emissions: 58, greenSpaceArea: 186, ecoRating: 80 },
  { city: "Toronto", year: 2023, aqi: 34, co2Emissions: 56, greenSpaceArea: 189, ecoRating: 82 },
  { city: "Toronto", year: 2024, aqi: 32, co2Emissions: 54, greenSpaceArea: 192, ecoRating: 84 },
  
  // Los Angeles
  { city: "Los Angeles", year: 2020, aqi: 85, co2Emissions: 95, greenSpaceArea: 160, ecoRating: 48 },
  { city: "Los Angeles", year: 2021, aqi: 82, co2Emissions: 92, greenSpaceArea: 162, ecoRating: 50 },
  { city: "Los Angeles", year: 2022, aqi: 79, co2Emissions: 89, greenSpaceArea: 164, ecoRating: 52 },
  { city: "Los Angeles", year: 2023, aqi: 76, co2Emissions: 86, greenSpaceArea: 166, ecoRating: 54 },
  { city: "Los Angeles", year: 2024, aqi: 73, co2Emissions: 83, greenSpaceArea: 168, ecoRating: 56 },
  
  // Chicago
  { city: "Chicago", year: 2020, aqi: 52, co2Emissions: 70, greenSpaceArea: 145, ecoRating: 66 },
  { city: "Chicago", year: 2021, aqi: 50, co2Emissions: 68, greenSpaceArea: 147, ecoRating: 68 },
  { city: "Chicago", year: 2022, aqi: 48, co2Emissions: 66, greenSpaceArea: 149, ecoRating: 70 },
  { city: "Chicago", year: 2023, aqi: 46, co2Emissions: 64, greenSpaceArea: 151, ecoRating: 72 },
  { city: "Chicago", year: 2024, aqi: 44, co2Emissions: 62, greenSpaceArea: 153, ecoRating: 74 },
];

// Vehicle data for all 15 cities (2020-2024)
const vehicleData = [
  // Berlin
  { city: "Berlin", year: 2020, totalVehicles: 1450000, electricVehicles: 29000, gasolineVehicles: 1421000, chargingStations: 850 },
  { city: "Berlin", year: 2021, totalVehicles: 1465000, electricVehicles: 44000, gasolineVehicles: 1421000, chargingStations: 1100 },
  { city: "Berlin", year: 2022, totalVehicles: 1480000, electricVehicles: 74000, gasolineVehicles: 1406000, chargingStations: 1500 },
  { city: "Berlin", year: 2023, totalVehicles: 1495000, electricVehicles: 120000, gasolineVehicles: 1375000, chargingStations: 2100 },
  { city: "Berlin", year: 2024, totalVehicles: 1510000, electricVehicles: 181000, gasolineVehicles: 1329000, chargingStations: 2800 },
  
  // Munich
  { city: "Munich", year: 2020, totalVehicles: 780000, electricVehicles: 19500, gasolineVehicles: 760500, chargingStations: 650 },
  { city: "Munich", year: 2021, totalVehicles: 790000, electricVehicles: 31600, gasolineVehicles: 758400, chargingStations: 900 },
  { city: "Munich", year: 2022, totalVehicles: 800000, electricVehicles: 56000, gasolineVehicles: 744000, chargingStations: 1250 },
  { city: "Munich", year: 2023, totalVehicles: 810000, electricVehicles: 97200, gasolineVehicles: 712800, chargingStations: 1750 },
  { city: "Munich", year: 2024, totalVehicles: 820000, electricVehicles: 148000, gasolineVehicles: 672000, chargingStations: 2400 },
  
  // Hamburg
  { city: "Hamburg", year: 2020, totalVehicles: 920000, electricVehicles: 18400, gasolineVehicles: 901600, chargingStations: 720 },
  { city: "Hamburg", year: 2021, totalVehicles: 935000, electricVehicles: 28050, gasolineVehicles: 906950, chargingStations: 950 },
  { city: "Hamburg", year: 2022, totalVehicles: 950000, electricVehicles: 47500, gasolineVehicles: 902500, chargingStations: 1300 },
  { city: "Hamburg", year: 2023, totalVehicles: 965000, electricVehicles: 77200, gasolineVehicles: 887800, chargingStations: 1800 },
  { city: "Hamburg", year: 2024, totalVehicles: 980000, electricVehicles: 117600, gasolineVehicles: 862400, chargingStations: 2500 },
  
  // Cologne
  { city: "Cologne", year: 2020, totalVehicles: 580000, electricVehicles: 11600, gasolineVehicles: 568400, chargingStations: 480 },
  { city: "Cologne", year: 2021, totalVehicles: 590000, electricVehicles: 17700, gasolineVehicles: 572300, chargingStations: 650 },
  { city: "Cologne", year: 2022, totalVehicles: 600000, electricVehicles: 30000, gasolineVehicles: 570000, chargingStations: 900 },
  { city: "Cologne", year: 2023, totalVehicles: 610000, electricVehicles: 48800, gasolineVehicles: 561200, chargingStations: 1250 },
  { city: "Cologne", year: 2024, totalVehicles: 620000, electricVehicles: 74400, gasolineVehicles: 545600, chargingStations: 1700 },
  
  // Paris
  { city: "Paris", year: 2020, totalVehicles: 1250000, electricVehicles: 25000, gasolineVehicles: 1225000, chargingStations: 1100 },
  { city: "Paris", year: 2021, totalVehicles: 1265000, electricVehicles: 38000, gasolineVehicles: 1227000, chargingStations: 1500 },
  { city: "Paris", year: 2022, totalVehicles: 1280000, electricVehicles: 64000, gasolineVehicles: 1216000, chargingStations: 2100 },
  { city: "Paris", year: 2023, totalVehicles: 1295000, electricVehicles: 103600, gasolineVehicles: 1191400, chargingStations: 2900 },
  { city: "Paris", year: 2024, totalVehicles: 1310000, electricVehicles: 157200, gasolineVehicles: 1152800, chargingStations: 3900 },
  
  // Vienna
  { city: "Vienna", year: 2020, totalVehicles: 720000, electricVehicles: 21600, gasolineVehicles: 698400, chargingStations: 850 },
  { city: "Vienna", year: 2021, totalVehicles: 730000, electricVehicles: 36500, gasolineVehicles: 693500, chargingStations: 1150 },
  { city: "Vienna", year: 2022, totalVehicles: 740000, electricVehicles: 59200, gasolineVehicles: 680800, chargingStations: 1600 },
  { city: "Vienna", year: 2023, totalVehicles: 750000, electricVehicles: 97500, gasolineVehicles: 652500, chargingStations: 2200 },
  { city: "Vienna", year: 2024, totalVehicles: 760000, electricVehicles: 144400, gasolineVehicles: 615600, chargingStations: 3000 },
  
  // Rome
  { city: "Rome", year: 2020, totalVehicles: 1650000, electricVehicles: 16500, gasolineVehicles: 1633500, chargingStations: 620 },
  { city: "Rome", year: 2021, totalVehicles: 1670000, electricVehicles: 25050, gasolineVehicles: 1644950, chargingStations: 850 },
  { city: "Rome", year: 2022, totalVehicles: 1690000, electricVehicles: 42250, gasolineVehicles: 1647750, chargingStations: 1200 },
  { city: "Rome", year: 2023, totalVehicles: 1710000, electricVehicles: 68400, gasolineVehicles: 1641600, chargingStations: 1700 },
  { city: "Rome", year: 2024, totalVehicles: 1730000, electricVehicles: 103800, gasolineVehicles: 1626200, chargingStations: 2400 },
  
  // Amsterdam
  { city: "Amsterdam", year: 2020, totalVehicles: 480000, electricVehicles: 24000, gasolineVehicles: 456000, chargingStations: 1200 },
  { city: "Amsterdam", year: 2021, totalVehicles: 485000, electricVehicles: 38800, gasolineVehicles: 446200, chargingStations: 1650 },
  { city: "Amsterdam", year: 2022, totalVehicles: 490000, electricVehicles: 63700, gasolineVehicles: 426300, chargingStations: 2300 },
  { city: "Amsterdam", year: 2023, totalVehicles: 495000, electricVehicles: 99000, gasolineVehicles: 396000, chargingStations: 3200 },
  { city: "Amsterdam", year: 2024, totalVehicles: 500000, electricVehicles: 145000, gasolineVehicles: 355000, chargingStations: 4400 },
  
  // Brussels
  { city: "Brussels", year: 2020, totalVehicles: 620000, electricVehicles: 12400, gasolineVehicles: 607600, chargingStations: 550 },
  { city: "Brussels", year: 2021, totalVehicles: 630000, electricVehicles: 18900, gasolineVehicles: 611100, chargingStations: 750 },
  { city: "Brussels", year: 2022, totalVehicles: 640000, electricVehicles: 32000, gasolineVehicles: 608000, chargingStations: 1050 },
  { city: "Brussels", year: 2023, totalVehicles: 650000, electricVehicles: 52000, gasolineVehicles: 598000, chargingStations: 1450 },
  { city: "Brussels", year: 2024, totalVehicles: 660000, electricVehicles: 79200, gasolineVehicles: 580800, chargingStations: 2000 },
  
  // London
  { city: "London", year: 2020, totalVehicles: 2850000, electricVehicles: 57000, gasolineVehicles: 2793000, chargingStations: 2800 },
  { city: "London", year: 2021, totalVehicles: 2880000, electricVehicles: 86400, gasolineVehicles: 2793600, chargingStations: 3800 },
  { city: "London", year: 2022, totalVehicles: 2910000, electricVehicles: 145500, gasolineVehicles: 2764500, chargingStations: 5300 },
  { city: "London", year: 2023, totalVehicles: 2940000, electricVehicles: 235200, gasolineVehicles: 2704800, chargingStations: 7400 },
  { city: "London", year: 2024, totalVehicles: 2970000, electricVehicles: 356400, gasolineVehicles: 2613600, chargingStations: 10200 },
  
  // Washington D.C.
  { city: "Washington D.C.", year: 2020, totalVehicles: 320000, electricVehicles: 9600, gasolineVehicles: 310400, chargingStations: 480 },
  { city: "Washington D.C.", year: 2021, totalVehicles: 325000, electricVehicles: 13000, gasolineVehicles: 312000, chargingStations: 650 },
  { city: "Washington D.C.", year: 2022, totalVehicles: 330000, electricVehicles: 19800, gasolineVehicles: 310200, chargingStations: 900 },
  { city: "Washington D.C.", year: 2023, totalVehicles: 335000, electricVehicles: 30150, gasolineVehicles: 304850, chargingStations: 1250 },
  { city: "Washington D.C.", year: 2024, totalVehicles: 340000, electricVehicles: 44200, gasolineVehicles: 295800, chargingStations: 1700 },
  
  // New York
  { city: "New York", year: 2020, totalVehicles: 2100000, electricVehicles: 42000, gasolineVehicles: 2058000, chargingStations: 1800 },
  { city: "New York", year: 2021, totalVehicles: 2120000, electricVehicles: 63600, gasolineVehicles: 2056400, chargingStations: 2500 },
  { city: "New York", year: 2022, totalVehicles: 2140000, electricVehicles: 107000, gasolineVehicles: 2033000, chargingStations: 3500 },
  { city: "New York", year: 2023, totalVehicles: 2160000, electricVehicles: 172800, gasolineVehicles: 1987200, chargingStations: 4900 },
  { city: "New York", year: 2024, totalVehicles: 2180000, electricVehicles: 261600, gasolineVehicles: 1918400, chargingStations: 6800 },
  
  // Toronto
  { city: "Toronto", year: 2020, totalVehicles: 1450000, electricVehicles: 43500, gasolineVehicles: 1406500, chargingStations: 1650 },
  { city: "Toronto", year: 2021, totalVehicles: 1470000, electricVehicles: 73500, gasolineVehicles: 1396500, chargingStations: 2300 },
  { city: "Toronto", year: 2022, totalVehicles: 1490000, electricVehicles: 119200, gasolineVehicles: 1370800, chargingStations: 3200 },
  { city: "Toronto", year: 2023, totalVehicles: 1510000, electricVehicles: 181500, gasolineVehicles: 1328500, chargingStations: 4500 },
  { city: "Toronto", year: 2024, totalVehicles: 1530000, electricVehicles: 260100, gasolineVehicles: 1269900, chargingStations: 6200 },
  
  // Los Angeles
  { city: "Los Angeles", year: 2020, totalVehicles: 3200000, electricVehicles: 96000, gasolineVehicles: 3104000, chargingStations: 3800 },
  { city: "Los Angeles", year: 2021, totalVehicles: 3240000, electricVehicles: 162000, gasolineVehicles: 3078000, chargingStations: 5200 },
  { city: "Los Angeles", year: 2022, totalVehicles: 3280000, electricVehicles: 262400, gasolineVehicles: 3017600, chargingStations: 7200 },
  { city: "Los Angeles", year: 2023, totalVehicles: 3320000, electricVehicles: 398400, gasolineVehicles: 2921600, chargingStations: 10000 },
  { city: "Los Angeles", year: 2024, totalVehicles: 3360000, electricVehicles: 571200, gasolineVehicles: 2788800, chargingStations: 13800 },
  
  // Chicago
  { city: "Chicago", year: 2020, totalVehicles: 1680000, electricVehicles: 33600, gasolineVehicles: 1646400, chargingStations: 1400 },
  { city: "Chicago", year: 2021, totalVehicles: 1700000, electricVehicles: 51000, gasolineVehicles: 1649000, chargingStations: 1900 },
  { city: "Chicago", year: 2022, totalVehicles: 1720000, electricVehicles: 86000, gasolineVehicles: 1634000, chargingStations: 2700 },
  { city: "Chicago", year: 2023, totalVehicles: 1740000, electricVehicles: 139200, gasolineVehicles: 1600800, chargingStations: 3800 },
  { city: "Chicago", year: 2024, totalVehicles: 1760000, electricVehicles: 211200, gasolineVehicles: 1548800, chargingStations: 5300 },
];

async function main() {
  console.log("Seeding ecology and vehicle data...\n");
  
  // Get all cities
  const allCities = await db.select().from(cities);
  const cityMap = new Map(allCities.map(c => [c.name, c.id]));
  
  // Insert ecology data
  console.log("Inserting ecology data...");
  for (const eco of ecologyData) {
    const cityId = cityMap.get(eco.city);
    if (!cityId) {
      console.log(`⚠️  City not found: ${eco.city}`);
      continue;
    }
    
    await db.insert(ecology).values({
      cityId,
      year: eco.year,
      aqi: eco.aqi,
      co2Emissions: eco.co2Emissions,
      greenSpaceArea: eco.greenSpaceArea,
      ecoRating: eco.ecoRating,
    });
  }
  console.log(`✓ Inserted ${ecologyData.length} ecology records\n`);
  
  // Insert vehicle data
  console.log("Inserting vehicle data...");
  for (const veh of vehicleData) {
    const cityId = cityMap.get(veh.city);
    if (!cityId) {
      console.log(`⚠️  City not found: ${veh.city}`);
      continue;
    }
    
    await db.insert(vehicles).values({
      cityId,
      year: veh.year,
      totalVehicles: veh.totalVehicles,
      electricVehicles: veh.electricVehicles,
      gasolineVehicles: veh.gasolineVehicles,
      chargingStations: veh.chargingStations,
    });
  }
  console.log(`✓ Inserted ${vehicleData.length} vehicle records\n`);
  
  console.log("✅ Ecology and vehicle data seeding complete!");
  process.exit(0);
}

main().catch((error) => {
  console.error("Error seeding data:", error);
  process.exit(1);
});
