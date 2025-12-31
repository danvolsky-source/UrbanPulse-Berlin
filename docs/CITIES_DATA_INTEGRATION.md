# GALOR: Integration of 15 Major European Cities

## Executive Summary

This document outlines the strategy for connecting 15 major European cities to real data sources, including demographics, housing prices, government policies, and infrastructure data. The project covers Germany, Austria, France, and other European countries.

## Target Cities (15)

### Tier 1: Major Metropolises (Population > 1M)

1. **Berlin** - Germany's capital, 3.7M population
2. **Hamburg** - German port city, 1.9M population
3. **Munich (München)** - Bavaria capital, 1.5M population
4. **Cologne (Köln)** - Rhine-Westphalia, 1.1M population
5. **Vienna (Wien)** - Austria's capital, 1.9M population
6. **Paris** - France's capital, 2.2M population

### Tier 2: Large Cities (Population 500K-1M)

7. **Frankfurt am Main** - Financial center, 760K
8. **Stuttgart** - Auto industry hub, 630K
9. **Düsseldorf** - Rhine-Westphalia, 620K
10. **Dortmund** - Ruhr area, 590K
11. **Essen** - Ruhr area, 580K
12. **Leipzig** - East Germany cultural hub, 600K

### Tier 3: Important Regional Centers (Population 400K-500K)

13. **Bremen** - Hanseatic city-state, 570K
14. **Dresden** - Saxony capital, 560K
15. **Hanover (Hannover)** - Lower Saxony capital, 540K

## Data Categories Per City

### 1. Demographics Data
```typescript
interface CityDemographics {
  cityId: number;
  cityName: string;
  country: string;
  population: number;
  populationGrowthRate: number; // Annual %
  ageDistribution: {
    under18: number;
    age18to35: number;
    age36to65: number;
    over65: number;
  };
  ethnicComposition: Record<string, number>; // Percentage by ethnicity
  educationLevel: {
    noQualification: number;
    secondary: number;
    vocational: number;
    university: number;
  };
}
```

### 2. Housing & Real Estate
```typescript
interface HousingData {
  cityId: number;
  averagePropertyPrice: number; // EUR per sqm
  averageRentPrice: number; // EUR per sqm/month
  priceGrowthYoY: number; // Year over year %
  housingStock: number;
  newConstructionRate: number; // Units per year
  vacancyRate: number; // Percentage
  socialHousingPercentage: number;
  districtPrices: Array<{
    districtId: number;
    districtName: string;
    avgPrice: number;
    avgRent: number;
  }>;
}
```

### 3. Economic Indicators
```typescript
interface EconomicData {
  cityId: number;
  gdpPerCapita: number; // EUR
  averageIncome: number; // EUR/year
  medianIncome: number; // EUR/year
  unemploymentRate: number; // Percentage
  majorIndustries: string[];
  employmentBySector: {
    agriculture: number;
    manufacturing: number;
    services: number;
    technology: number;
  };
}
```

### 4. Infrastructure & Transportation
```typescript
interface InfrastructureData {
  cityId: number;
  publicTransport: {
    metroLines: number;
    busLines: number;
    tramLines: number;
    bikeSharing: boolean;
  };
  airports: string[];
  majorRailStations: string[];
  internetSpeed: number; // Average Mbps
  greenSpaces: number; // sqm per capita
}
```

### 5. Government Policies & Social Data
```typescript
interface PolicyData {
  cityId: number;
  country: string;
  housingPolicies: string[];
  taxRate: number; // Average %
  socialBenefitRecipients: number;
  migrationPolicies: string[];
  refugeeProgramInfo: string;
}
```

## Real Data Sources by Country

### Germany (Berlin, Hamburg, Munich, Cologne, etc.)

**Primary Sources:**
- **Destatis (Federal Statistical Office)**: https://www.destatis.de/
  - Demographics, housing statistics
  - API: Regional Database (GENESIS-Online)
- **Bundesagentur für Arbeit**: Employment data
- **OpenStreetMap**: Geographic data
- **Local City Open Data Portals**:
  - Berlin: https://daten.berlin.de/
  - Hamburg: https://transparenz.hamburg.de/
  - Munich: https://opendata.muenchen.de/

**Secondary Sources:**
- **Empirica AG**: Real estate market research
- **ImmobilienScout24 API**: Property prices
- **City government statistics offices**

### Austria (Vienna)

**Primary Sources:**
- **Statistik Austria**: https://www.statistik.at/
  - National statistics office
- **Stadt Wien Open Data**: https://data.wien.gv.at/
  - 600+ datasets on all aspects of city
- **Vienna City Administration**: Demographics, housing

### France (Paris)

**Primary Sources:**
- **INSEE (Institut National de la Statistique)**: https://www.insee.fr/
  - National statistics
- **Paris Open Data**: https://opendata.paris.fr/
  - 250+ datasets
- **APUR (Atelier Parisien d'Urbanisme)**: Urban planning data

## Database Schema Updates

### Cities Table Enhancement
```sql
CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(50) NOT NULL,
  country_code CHAR(2) NOT NULL, -- DE, AT, FR
  population INTEGER,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  timezone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cities_country ON cities(country);
```

### Multilingual Support
```sql
CREATE TABLE city_translations (
  id SERIAL PRIMARY KEY,
  city_id INTEGER REFERENCES cities(id),
  language_code CHAR(2), -- de, en, fr
  name VARCHAR(100),
  description TEXT
);
```

## API Integration Architecture

### Data Fetching Strategy

```typescript
// server/integrations/dataSources.ts
export const DATA_SOURCES = {
  DE: {
    demographics: 'https://www-genesis.destatis.de/genesisWS/rest/2020/',
    housing: 'https://api.immobilienscout24.de/',
    openData: {
      berlin: 'https://daten.berlin.de/api/3/action/',
      hamburg: 'https://transparenz.hamburg.de/api/3/action/',
      munich: 'https://opendata.muenchen.de/api/3/action/',
    }
  },
  AT: {
    demographics: 'https://data.statistik.gv.at/web/meta.do',
    openData: 'https://data.wien.gv.at/daten/OGDAddressService.svc/'
  },
  FR: {
    demographics: 'https://api.insee.fr/donnees/',
    openData: 'https://opendata.paris.fr/api/v2/'
  }
};
```

### Data Update Scheduler
```typescript
// Automated data refresh
import { CronJob } from 'cron';

// Daily update at 3 AM
const dailyUpdate = new CronJob('0 3 * * *', async () => {
  for (const city of ALL_CITIES) {
    await updateCityData(city.id, {
      demographics: true,
      housing: true,
      economy: false, // Weekly only
    });
  }
});

// Weekly comprehensive update (Sundays at 2 AM)
const weeklyUpdate = new CronJob('0 2 * * 0', async () => {
  for (const city of ALL_CITIES) {
    await updateCityData(city.id, {
      demographics: true,
      housing: true,
      economy: true,
      infrastructure: true,
      policies: true,
    });
  }
});
```

## Implementation Phases

### Phase 1: Core German Cities (Weeks 1-2)
- Berlin, Hamburg, Munich, Cologne
- Basic demographics and housing data
- Existing database schema

### Phase 2: Additional German Cities (Week 3)
- Frankfurt, Stuttgart, Düsseldorf, Dortmund, Essen
- Leipzig, Bremen, Dresden, Hanover
- Full data integration

### Phase 3: International Expansion (Week 4)
- Vienna (Austria)
- Paris (France)
- Multi-language support
- Currency conversion (if needed)

### Phase 4: Data Quality & Testing (Week 5)
- Data validation
- Automated testing
- Performance optimization
- Documentation

## Data Quality Assurance

### Validation Rules
```typescript
const validateCityData = (data: CityData): ValidationResult => {
  const errors = [];
  
  // Population checks
  if (data.population < 400000 || data.population > 5000000) {
    errors.push('Population outside expected range');
  }
  
  // Price reasonability
  if (data.avgPropertyPrice < 1000 || data.avgPropertyPrice > 15000) {
    errors.push('Property prices seem unrealistic');
  }
  
  // Temporal consistency
  if (data.year < 2020 || data.year > new Date().getFullYear()) {
    errors.push('Data year outside valid range');
  }
  
  return { valid: errors.length === 0, errors };
};
```

## Frontend Integration

### City Selector Enhancement
```typescript
// client/src/components/CitySelector.tsx
import { useCity } from '@/contexts/CityContext';

interface City {
  id: number;
  name: string;
  country: string;
  flag: string; // Emoji flag
}

const CitySelector = () => {
  const { selectedCity, setSelectedCity } = useCity();
  const { data: cities } = trpc.cities.list.useQuery();
  
  // Group by country
  const citiesByCountry = cities?.reduce((acc, city) => {
    acc[city.country] = acc[city.country] || [];
    acc[city.country].push(city);
    return acc;
  }, {});
  
  return (
    <Select value={selectedCity} onValueChange={setSelectedCity}>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select a city" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(citiesByCountry || {}).map(([country, cities]) => (
          <SelectGroup key={country}>
            <SelectLabel>{country}</SelectLabel>
            {cities.map(city => (
              <SelectItem key={city.id} value={city.name}>
                {city.flag} {city.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};
```

## API Rate Limiting & Caching

### Rate Limits
- Destatis: 100 requests/minute
- Wien Open Data: Unlimited
- INSEE: 30 requests/minute

### Caching Strategy
```typescript
// Redis caching for API responses
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

const getCachedCityData = async (cityId: number, dataType: string) => {
  const cacheKey = `city:${cityId}:${dataType}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const data = await fetchFromAPI(cityId, dataType);
  await redis.setex(cacheKey, 86400, JSON.stringify(data)); // 24h cache
  return data;
};
```

## Monitoring & Alerts

### Data Freshness Monitoring
```typescript
const checkDataFreshness = async () => {
  for (const city of ALL_CITIES) {
    const lastUpdate = await getLastUpdateTime(city.id);
    const hoursSinceUpdate = (Date.now() - lastUpdate) / (1000 * 60 * 60);
    
    if (hoursSinceUpdate > 48) {
      await sendAlert({
        type: 'STALE_DATA',
        cityId: city.id,
        cityName: city.name,
        hoursSinceUpdate,
      });
    }
  }
};
```

## Testing Strategy

### Unit Tests
- Data validation functions
- API response parsers
- Cache logic

### Integration Tests
- API connections
- Database operations
- Data transformation pipelines

### E2E Tests
- City selection
- Data display
- Multi-city comparison

## Documentation Requirements

1. **API Documentation**: All data sources and endpoints
2. **Data Dictionary**: Field definitions and units
3. **Update Procedures**: Manual data refresh guide
4. **Troubleshooting**: Common issues and solutions

## Success Metrics

- **Coverage**: All 15 cities with complete data
- **Freshness**: Data updated within 24 hours
- **Accuracy**: < 5% error rate in validation
- **Performance**: API responses < 200ms
- **Availability**: 99.9% uptime

## Future Expansion

Potential additional cities:
- **Netherlands**: Amsterdam, Rotterdam
- **Belgium**: Brussels, Antwerp
- **Switzerland**: Zurich, Geneva
- **Italy**: Rome, Milan
- **Spain**: Madrid, Barcelona

---

**Version**: 2.0
**Last Updated**: January 2025
**Status**: Ready for Implementation
