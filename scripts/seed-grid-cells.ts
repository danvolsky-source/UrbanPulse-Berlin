/**
 * Seed script for generating grid cells for Berlin heatmap visualization
 * 
 * This script generates a fine-grained grid overlay for Berlin districts.
 * Each cell contains:
 * - Geographic coordinates (cellX, cellY) 
 * - GeoJSON bbox for boundaries
 * - Aggregated population and infrastructure data
 * 
 * Run: npx tsx scripts/seed-grid-cells.ts
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema';

// Berlin bounding box (approximate)
const BERLIN_BOUNDS = {
  minLat: 52.3382,
  maxLat: 52.6755,
  minLon: 13.0883,
  maxLon: 13.7611,
};

// Grid configuration
const ZOOM_LEVELS = [12, 13, 14];
const CELL_SIZE_KM = {
  12: 2.0,  // ~2km cells
  13: 1.0,  // ~1km cells  
  14: 0.5,  // ~500m cells
};

// Approximate conversion: 1 degree lat ≈ 111km, 1 degree lon ≈ 70km (at Berlin's latitude)
const LAT_TO_KM = 111;
const LON_TO_KM = 70;

function latLonToCell(lat: number, lon: number, cellSizeKm: number): { cellX: number; cellY: number } {
  const cellSizeLat = cellSizeKm / LAT_TO_KM;
  const cellSizeLon = cellSizeKm / LON_TO_KM;
  
  return {
    cellX: Math.floor((lon - BERLIN_BOUNDS.minLon) / cellSizeLon),
    cellY: Math.floor((lat - BERLIN_BOUNDS.minLat) / cellSizeLat),
  };
}

function cellToLatLonBbox(cellX: number, cellY: number, cellSizeKm: number) {
  const cellSizeLat = cellSizeKm / LAT_TO_KM;
  const cellSizeLon = cellSizeKm / LON_TO_KM;
  
  const minLat = BERLIN_BOUNDS.minLat + cellY * cellSizeLat;
  const maxLat = minLat + cellSizeLat;
  const minLon = BERLIN_BOUNDS.minLon + cellX * cellSizeLon;
  const maxLon = minLon + cellSizeLon;
  
  return { minLat, maxLat, minLon, maxLon };
}

function generateBboxGeoJson(bbox: { minLat: number; maxLat: number; minLon: number; maxLon: number }) {
  return JSON.stringify({
    type: 'Polygon',
    coordinates: [[
      [bbox.minLon, bbox.minLat],
      [bbox.maxLon, bbox.minLat],
      [bbox.maxLon, bbox.maxLat],
      [bbox.minLon, bbox.maxLat],
      [bbox.minLon, bbox.minLat],
    ]],
  });
}

// Mock data generators
function generatePopulation(cellX: number, cellY: number): number {
  // Simple hash-based mock data
  const seed = cellX * 31 + cellY * 17;
  return Math.floor(500 + (seed % 2000));
}

function generateDensity(population: number, cellSizeKm: number): number {
  const areaSqKm = cellSizeKm * cellSizeKm;
  return Math.floor((population / areaSqKm) * 100); // * 100 for int storage
}

function generateInfrastructure(cellX: number, cellY: number) {
  const seed = cellX * 13 + cellY * 29;
  return {
    mosquesCount: seed % 3 === 0 ? 1 : 0,
    churchesCount: seed % 4 === 0 ? 1 : 0,
    synagoguesCount: seed % 15 === 0 ? 1 : 0,
  };
}

function generateDemographics(population: number, cellX: number, cellY: number) {
  const seed = cellX * 7 + cellY * 11;
  return {
    turkishPop: Math.floor(population * (0.05 + (seed % 20) / 100)),
    syrianPop: Math.floor(population * (0.02 + (seed % 10) / 200)),
    polishPop: Math.floor(population * (0.03 + (seed % 15) / 150)),
    italianPop: Math.floor(population * (0.02 + (seed % 12) / 180)),
    russianPop: Math.floor(population * (0.04 + (seed % 18) / 120)),
  };
}

async function main() {
  console.log('🌍 Starting grid cells generation for Berlin...');
  
  // Database connection
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME || 'galor',
  });
  
  const db = drizzle(connection, { schema, mode: 'default' });
  
  console.log('📊 Connected to database');
  
  for (const zoomLevel of ZOOM_LEVELS) {
    const cellSizeKm = CELL_SIZE_KM[zoomLevel as keyof typeof CELL_SIZE_KM];
    console.log(`\n📍 Generating cells for zoom level ${zoomLevel} (cell size: ${cellSizeKm}km)...`);
    
    const { cellX: maxCellX } = latLonToCell(BERLIN_BOUNDS.maxLat, BERLIN_BOUNDS.maxLon, cellSizeKm);
    const { cellY: maxCellY } = latLonToCell(BERLIN_BOUNDS.maxLat, BERLIN_BOUNDS.maxLon, cellSizeKm);
    
    const cells: typeof schema.gridCells.$inferInsert[] = [];
    
    for (let cellX = 0; cellX <= maxCellX; cellX++) {
      for (let cellY = 0; cellY <= maxCellY; cellY++) {
        const bbox = cellToLatLonBbox(cellX, cellY, cellSizeKm);
        const population = generatePopulation(cellX, cellY);
        const infrastructure = generateInfrastructure(cellX, cellY);
        const demographics = generateDemographics(population, cellX, cellY);
        
        cells.push({
          city: 'Berlin',
          zoomLevel,
          cellX,
          cellY,
          bboxGeojson: generateBboxGeoJson(bbox),
          population,
          populationDensity: generateDensity(population, cellSizeKm),
          ...infrastructure,
          ...demographics,
        });
      }
    }
    
    console.log(`  Generated ${cells.length} cells`);
    console.log(`  Inserting into database...`);
    
    // Batch insert (500 at a time)
    const batchSize = 500;
    for (let i = 0; i < cells.length; i += batchSize) {
      const batch = cells.slice(i, i + batchSize);
      await db.insert(schema.gridCells).values(batch);
      console.log(`  Progress: ${Math.min(i + batchSize, cells.length)}/${cells.length}`);
    }
    
    console.log(`  ✅ Completed zoom level ${zoomLevel}`);
  }
  
  await connection.end();
  console.log('\n✨ Grid cells generation completed successfully!');
  console.log('Run migration: npx drizzle-kit push:mysql');
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
