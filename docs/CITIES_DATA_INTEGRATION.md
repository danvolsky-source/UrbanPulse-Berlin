# GALOR: Integration of 15 Major German Cities

## Executive Summary

This document outlines the strategy for connecting 15 major German cities to real data sources, including demographics, housing prices, government policies, and infrastructure data.

## Target Cities (15)

### Tier 1: Major Metropolises (Population > 1M)
1. **Berlin** - Capital, 3.7M population
2. **Hamburg** - Port city, 1.9M population
3. **Munich (München)** - Bavaria capital, 1.5M population
4. **Cologne (Köln)** - Rhine-Westphalia, 1.1M population

### Tier 2: Large Cities (Population 500K-1M)
5. **Frankfurt am Main** - Financial center, 760K
6. **Stuttgart** - Auto industry hub, 630K
7. **Düsseldorf** - Rhine-Westphalia, 620K
8. **Dortmund** - Ruhr area, 590K
9. **Essen** - Ruhr area, 580K
10. **Leipzig** - Saxony, 600K

### Tier 3: Mid-Size Cities (Population 300K-500K)
11. **Bremen** - Port city, 570K
12. **Dresden** - Saxony capital, 560K
13. **Hanover (Hannover)** - Lower Saxony, 540K
14. **Nuremberg (Nürnberg)** - Bavaria, 520K
15. **Duisburg** - Ruhr area, 500K

---

## Data Sources & APIs

### 1. Government & Policy Data

**Destatis (Federal Statistical Office)**
- API: https://www-genesis.destatis.de/
- Data: Demographics, employment, education
- Update frequency: Quarterly

**Municipal Open Data Portals:**
- Berlin: https://daten.berlin.de/
- Hamburg: https://transparenz.hamburg.de/
- Munich: https://www.opengov-muenchen.de/
- Cologne: https://offenedaten-koeln.de/

### 2. Housing & Real Estate

**ImmoScout24 API**
- Endpoint: https://api.immobilienscout24.de/
- Data: Property prices, rental rates
- Coverage: All 15 cities
- Update: Real-time

**Wohnungsboerse API**
- Government housing platform
- Data: Social housing, subsidies

### 3. Geographic Data

**OpenStreetMap (Overpass API)**
- Endpoint: https://overpass-api.de/
- Data: District boundaries, infrastructure
- Format: GeoJSON

**BKG (Federal Agency for Cartography)**
- High-resolution administrative boundaries
- Official district (Stadtteile) definitions

### 4. Infrastructure & Development

**Project Database per City:**
- Construction permits
- Public transport expansions
- School/hospital developments

---

## Database Schema

### Cities Table

```sql
CREATE TABLE cities (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  state VARCHAR(100), -- Bundesland
  population INT,
  area_km2 DECIMAL(10,2),
  tier INT, -- 1, 2, or 3
  coordinates POINT, -- Center coordinates
  bounds POLYGON, -- City boundaries
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Districts Table

```sql
CREATE TABLE districts (
  id VARCHAR(36) PRIMARY KEY,
  city_id VARCHAR(36) REFERENCES cities(id),
  name VARCHAR(200) NOT NULL,
  geometry GEOMETRY NOT NULL, -- Full geometry
  geometry_l0 GEOMETRY, -- Simplified for zoom 0-8
  geometry_l1 GEOMETRY, -- Simplified for zoom 9-11
  geometry_l2 GEOMETRY, -- Full detail for zoom 12+
  population INT,
  area_km2 DECIMAL(10,2),
  avg_price_sqm DECIMAL(10,2), -- €/m²
  avg_rent_sqm DECIMAL(8,2), -- €/m²/month
  INDEX idx_city (city_id),
  SPATIAL INDEX idx_geom (geometry)
);
```

### Policies Table

```sql
CREATE TABLE policies (
  id VARCHAR(36) PRIMARY KEY,
  city_id VARCHAR(36) REFERENCES cities(id),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  policy_type VARCHAR(100), -- housing, transport, education, etc.
  enacted_date DATE,
  affected_districts JSON, -- Array of district IDs
  impact_metrics JSON, -- KPIs
  source_url VARCHAR(500),
  INDEX idx_city_date (city_id, enacted_date)
);
```

### Grid Cells Table

```sql
CREATE TABLE grid_cells (
  id VARCHAR(36) PRIMARY KEY,
  city_id VARCHAR(36) REFERENCES cities(id),
  district_id VARCHAR(36) REFERENCES districts(id),
  zoom_level INT NOT NULL, -- 10, 11, or 12
  geom GEOMETRY NOT NULL,
  bounds JSON, -- minX, minY, maxX, maxY
  metrics JSON, -- population_density, avg_price, air_quality, etc.
  INDEX idx_city_zoom (city_id, zoom_level),
  SPATIAL INDEX idx_geom (geom)
);
```

---

## ETL Pipeline

### Phase 1: City & District Data (Week 1-2)

```typescript
// scripts/etl/fetch-cities.ts
import { db } from '../server/db';
import axios from 'axios';

const CITIES_CONFIG = [
  { name: 'Berlin', state: 'Berlin', tier: 1, osmId: 62422 },
  { name: 'Hamburg', state: 'Hamburg', tier: 1, osmId: 62782 },
  { name: 'München', state: 'Bayern', tier: 1, osmId: 62428 },
  // ... 12 more cities
];

async function fetchCityBoundaries(osmId: number) {
  const query = `
    [out:json];
    relation(${osmId});
    out geom;
  `;
  
  const response = await axios.post(
    'https://overpass-api.de/api/interpreter',
    query
  );
  
  return response.data;
}

async function importCities() {
  for (const config of CITIES_CONFIG) {
    console.log(`Importing ${config.name}...`);
    
    const boundaries = await fetchCityBoundaries(config.osmId);
    
    await db.insert(cities).values({
      id: generateId(),
      name: config.name,
      state: config.state,
      tier: config.tier,
      geometry: boundaries.elements[0].members,
      // ... other fields
    });
  }
}

export { importCities };
```

### Phase 2: Housing Data (Week 3)

```typescript
// scripts/etl/fetch-housing-data.ts
import ImmoScout24API from 'immoscout24-api';

const client = new ImmoScout24API({
  clientId: process.env.IMMOSCOUT_CLIENT_ID,
  clientSecret: process.env.IMMOSCOUT_CLIENT_SECRET
});

async function fetchHousingPrices(cityName: string) {
  const listings = await client.search({
    realestatetype: 'apartmentrent',
    geocodes: cityName,
    pageSize: 1000
  });
  
  // Aggregate by district
  const districtPrices = {};
  
  for (const listing of listings) {
    const district = listing.address.quarter;
    if (!districtPrices[district]) {
      districtPrices[district] = [];
    }
    districtPrices[district].push(listing.price.value);
  }
  
  return districtPrices;
}
```

### Phase 3: Policy Data (Week 4)

```typescript
// scripts/etl/scrape-policies.ts
import puppeteer from 'puppeteer';

const POLICY_SOURCES = {
  Berlin: 'https://www.berlin.de/politikportal/',
  Hamburg: 'https://www.hamburg.de/politik/',
  // ... other cities
};

async function scrapeCityPolicies(city: string, url: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(url);
  
  const policies = await page.evaluate(() => {
    // Extract policy data from page
    return Array.from(document.querySelectorAll('.policy-item')).map(item => ({
      title: item.querySelector('h3')?.textContent,
      date: item.querySelector('.date')?.textContent,
      // ...
    }));
  });
  
  await browser.close();
  return policies;
}
```

---

## Implementation Roadmap

### Week 1-2: Foundation
- [ ] Set up database tables
- [ ] Import 15 cities with boundaries
- [ ] Fetch district geometries from OSM
- [ ] Generate simplified geometries (L0, L1, L2)

### Week 3-4: Housing Data
- [ ] Integrate ImmoScout24 API
- [ ] Scrape municipal housing portals
- [ ] Calculate avg prices per district
- [ ] Set up daily update cron jobs

### Week 5-6: Policy Data
- [ ] Scrape government portals
- [ ] Parse policy documents
- [ ] Link policies to affected districts
- [ ] Create timeline visualizations

### Week 7-8: Grid Cells
- [ ] Generate grid cells for all 15 cities
- [ ] Populate metrics (population, prices, etc.)
- [ ] Test Grid Cells API performance
- [ ] Deploy to production

---

## Data Update Strategy

### Real-time Updates
- Housing prices: Daily via ImmoScout24 API
- New listings: Webhook integration

### Weekly Updates
- Infrastructure projects
- Construction permits
- Transport changes

### Quarterly Updates
- Demographics (Destatis)
- Employment statistics
- Education metrics

---

## API Endpoints

### Cities
```
GET /api/cities - List all cities
GET /api/cities/:id - Get city details
GET /api/cities/:id/districts - Get city districts
GET /api/cities/:id/policies - Get city policies
```

### Districts
```
GET /api/districts/:id - Get district details
GET /api/districts/:id/metrics - Get metrics timeline
GET /api/districts/:id/geometry?lod=L1 - Get geometry
```

### Grid Cells
```
GET /api/grid-cells?city=Berlin&zoom=12&bounds=... - Get grid cells
GET /api/grid-cells/:id/metrics - Get cell metrics
```

---

## Security & Privacy

- No personal data storage
- Aggregate statistics only
- GDPR compliant data sources
- Anonymous usage tracking

---

## Costs Estimation

### Data APIs
- ImmoScout24: €500/month
- Destatis: Free (public API)
- OSM: Free

### Infrastructure
- TiDB Cloud: €200/month (15 cities)
- Martin Tile Server: €50/month
- Storage (GeoJSON): €30/month

**Total: ~€780/month**

---

**Document Version:** 1.0  
**Created:** December 31, 2025  
**Status:** Ready for Implementation
