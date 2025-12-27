# UrbanPulse Data Import Schema

Complete JSON format specification for importing real data into UrbanPulse database.

## Required Data Files

Provide separate JSON files for each table, or combine into a single file with root-level keys matching table names.

---

## 1. Cities (`cities.json`)

**Required for:** All other data (cityId references)

```json
{
  "cities": [
    {
      "name": "Berlin",
      "country": "Germany",
      "population": 3850809
    }
  ]
}
```

**Fields:**
- `name` (string, unique): City name
- `country` (string): Country name
- `population` (integer): Total population

**Current cities:** Berlin, Munich, Hamburg, Cologne, Paris, Vienna, Rome, Amsterdam, Brussels, London, Washington D.C., New York, Toronto, Los Angeles, Chicago

---

## 2. Districts (`districts.json`)

**Required for:** District-level demographics and property prices

```json
{
  "districts": [
    {
      "city": "Berlin",
      "name": "Mitte",
      "nameEn": "Mitte",
      "population": 380000,
      "area": 39,
      "foreignerPercentage": 35,
      "dominantCommunity": "Turkish"
    }
  ]
}
```

**Fields:**
- `city` (string): City name (must match cities table)
- `name` (string): District name in local language
- `nameEn` (string): District name in English
- `population` (integer): District population
- `area` (integer): Area in square kilometers
- `foreignerPercentage` (integer): Percentage of foreign residents (0-100)
- `dominantCommunity` (string, optional): Largest immigrant community

---

## 3. Demographics (`demographics.json`)

**Time series:** 2015-2024 (10 years)

```json
{
  "demographics": [
    {
      "districtId": 1,
      "year": 2024,
      "community": "Turkish",
      "population": 45000,
      "percentageOfDistrict": 118
    }
  ]
}
```

**Fields:**
- `districtId` (integer): References districts.id
- `year` (integer): 2015-2024
- `community` (string): Community name (Turkish, Arab, Polish, etc.)
- `population` (integer): Absolute population count
- `percentageOfDistrict` (integer): **Stored as integer × 10** (e.g., 118 = 11.8%)

**Note:** Percentage stored as `actual_percentage * 10` to avoid decimals

---

## 4. Property Prices (`propertyPrices.json`)

**Time series:** 2015-2024, monthly data

```json
{
  "propertyPrices": [
    {
      "districtId": 1,
      "year": 2024,
      "month": 6,
      "averagePricePerSqm": 5200
    }
  ]
}
```

**Fields:**
- `districtId` (integer): References districts.id
- `year` (integer): 2015-2024
- `month` (integer): 1-12
- `averagePricePerSqm` (integer): Price per square meter in local currency (EUR for Europe, USD for US)

---

## 5. Community Infrastructure (`communityInfrastructure.json`)

**Static or updated annually**

```json
{
  "communityInfrastructure": [
    {
      "districtId": 1,
      "type": "mosque",
      "name": "Şehitlik Mosque",
      "address": "Columbiadamm 128, 10965 Berlin",
      "community": "Turkish",
      "latitude": "52.4891",
      "longitude": "13.3997"
    }
  ]
}
```

**Fields:**
- `districtId` (integer): References districts.id
- `type` (enum): `mosque`, `church`, `synagogue`, `cultural_center`, `ethnic_store`
- `name` (string): Facility name
- `address` (string, optional): Full address
- `community` (string): Associated community
- `latitude` (string, optional): Decimal degrees
- `longitude` (string, optional): Decimal degrees

---

## 6. City Summary (`citySummary.json`)

**Time series:** 2015-2024 (annual aggregates)

```json
{
  "citySummary": [
    {
      "city": "Berlin",
      "year": 2024,
      "mosquesCount": 76,
      "churchesCount": 450,
      "synagoguesCount": 12,
      "totalPopulation": 3850809,
      "foreignerPopulation": 1100000
    }
  ]
}
```

**Fields:**
- `city` (string): City name
- `year` (integer): 2015-2024
- `mosquesCount` (integer): Number of mosques
- `churchesCount` (integer): Number of churches
- `synagoguesCount` (integer): Number of synagogues
- `totalPopulation` (integer): Total city population
- `foreignerPopulation` (integer): Foreign residents count

---

## 7. Unemployment (`unemployment.json`)

**Time series:** 2015-2024 (annual data)

```json
{
  "unemployment": [
    {
      "cityId": 1,
      "districtId": null,
      "year": 2024,
      "unemploymentRate": 85,
      "youthUnemploymentRate": 120,
      "longTermUnemployed": 35,
      "foreignerUnemploymentRate": 145
    }
  ]
}
```

**Fields:**
- `cityId` (integer): References cities.id
- `districtId` (integer, optional): For district-level data
- `year` (integer): 2015-2024
- `unemploymentRate` (integer): **Stored as percentage × 10** (e.g., 85 = 8.5%)
- `youthUnemploymentRate` (integer): Unemployment rate for under 25 (× 10)
- `longTermUnemployed` (integer): Percentage unemployed >1 year (× 10)
- `foreignerUnemploymentRate` (integer): Rate among foreign residents (× 10)

**Sources:** Eurostat, national statistical offices

---

## 8. Social Benefits (`socialBenefits.json`)

**Time series:** 2015-2024 (annual data)

```json
{
  "socialBenefits": [
    {
      "cityId": 1,
      "year": 2024,
      "totalBenefitsSpending": 2500,
      "unemploymentBenefits": 800,
      "housingBenefits": 600,
      "childBenefits": 700,
      "refugeeBenefits": 400,
      "beneficiariesCount": 450000,
      "foreignerBeneficiariesPercent": 65
    }
  ]
}
```

**Fields:**
- `cityId` (integer): References cities.id
- `year` (integer): 2015-2024
- `totalBenefitsSpending` (integer): Total spending in millions of local currency
- `unemploymentBenefits` (integer): Millions
- `housingBenefits` (integer): Millions
- `childBenefits` (integer): Millions
- `refugeeBenefits` (integer): Millions
- `beneficiariesCount` (integer): Number of people receiving benefits
- `foreignerBeneficiariesPercent` (integer): Percentage of beneficiaries who are foreign (0-100)

**Sources:** Government budget reports, social welfare agencies

---

## 9. Tax Burden (`taxBurden.json`)

**Time series:** 2015-2024 (annual data)

```json
{
  "taxBurden": [
    {
      "cityId": 1,
      "year": 2024,
      "averageTaxRate": 42,
      "socialSecurityRate": 20,
      "totalTaxRevenue": 15000,
      "taxRevenuePerCapita": 3900,
      "socialSpendingPercent": 55
    }
  ]
}
```

**Fields:**
- `cityId` (integer): References cities.id
- `year` (integer): 2015-2024
- `averageTaxRate` (integer): Average income tax rate (0-100)
- `socialSecurityRate` (integer): Social security contribution rate (0-100)
- `totalTaxRevenue` (integer): Total tax revenue in millions
- `taxRevenuePerCapita` (integer): Tax revenue per person in local currency
- `socialSpendingPercent` (integer): Percentage of budget spent on social programs (0-100)

**Sources:** Tax authorities, city budget documents

---

## 10. Government Decisions (`governmentDecisions.json`)

**Event-based data:** Major policy decisions 2015-2024

```json
{
  "governmentDecisions": [
    {
      "cityId": null,
      "country": "Germany",
      "year": 2015,
      "month": 9,
      "decisionType": "immigration_policy",
      "title": "Open Border Policy (Wir schaffen das)",
      "description": "Chancellor Merkel announced open borders for Syrian refugees",
      "officialPromise": "Refugees will integrate quickly and contribute to economy",
      "actualOutcome": "Mixed results: integration challenges, labor market participation below expectations",
      "impactScore": -25,
      "economicImpact": "Increased social spending by €20B annually; labor force participation rate 40% vs promised 70%",
      "socialImpact": "Housing shortage in major cities; increased demand for language courses",
      "dataSource": "Federal Statistical Office (Destatis), 2024"
    }
  ]
}
```

**Fields:**
- `cityId` (integer, optional): Specific city affected
- `country` (string): Country name
- `year` (integer): 2015-2024
- `month` (integer): 1-12
- `decisionType` (string): `immigration_policy`, `welfare_reform`, `housing_policy`, `tax_policy`, etc.
- `title` (string): Policy name
- `description` (string): What the policy entailed
- `officialPromise` (string): What government said would happen
- `actualOutcome` (string): What actually happened (neutral, factual)
- `impactScore` (integer): -100 to +100 (negative = worse than promised, positive = better)
- `economicImpact` (string, optional): Specific economic consequences
- `socialImpact` (string, optional): Specific social consequences
- `dataSource` (string, optional): Citation for data

**Important:** Use neutral, factual language. Avoid politically charged framing.

---

## 11. Community Growth (`communityGrowth.json`)

**Time series:** 2015-2024 (annual data)

```json
{
  "communityGrowth": [
    {
      "cityId": 1,
      "districtId": null,
      "year": 2024,
      "communityType": "Muslim",
      "percentage": 15,
      "growthRate": 8
    }
  ]
}
```

**Fields:**
- `cityId` (integer): References cities.id
- `districtId` (integer, optional): For district-level data
- `year` (integer): 2015-2024
- `communityType` (string): Muslim, Hindu, Buddhist, Jewish, etc.
- `percentage` (integer): Percentage of total population (0-100)
- `growthRate` (integer): Year-over-year growth rate (can be negative)

---

## 12. Migration Events (`migrationEvents.json`)

**Event-based data:** Significant migration events

```json
{
  "migrationEvents": [
    {
      "cityId": 1,
      "year": 2015,
      "month": 9,
      "eventType": "refugee_wave",
      "title": "Syrian Refugee Crisis",
      "description": "Large influx of Syrian refugees to Berlin",
      "impactScore": 85,
      "affectedCommunity": "Syrian"
    }
  ]
}
```

**Fields:**
- `cityId` (integer): References cities.id
- `year` (integer): 2015-2024
- `month` (integer): 1-12
- `eventType` (string): `refugee_wave`, `policy_change`, `economic_migration`
- `title` (string): Event name
- `description` (string): What happened
- `impactScore` (integer): 1-100 (magnitude of impact)
- `affectedCommunity` (string, optional): Primary community affected

---

## 13. Rental Prices (`rentalPrices.json`)

**Time series:** 2015-2024 (annual data)

```json
{
  "rentalPrices": [
    {
      "cityId": 1,
      "districtId": null,
      "year": 2024,
      "apartmentType": "2-bedroom",
      "monthlyRent": 1200
    }
  ]
}
```

**Fields:**
- `cityId` (integer): References cities.id
- `districtId` (integer, optional): For district-level data
- `year` (integer): 2015-2024
- `apartmentType` (string): `1-bedroom`, `2-bedroom`, `3-bedroom`, `house`
- `monthlyRent` (integer): Monthly rent in local currency

---

## 14. Average Income (`averageIncome.json`)

**Time series:** 2015-2024 (annual data)

```json
{
  "averageIncome": [
    {
      "cityId": 1,
      "districtId": null,
      "year": 2024,
      "averageMonthlyIncome": 3500,
      "medianMonthlyIncome": 3200,
      "incomeGrowthRate": 3
    }
  ]
}
```

**Fields:**
- `cityId` (integer): References cities.id
- `districtId` (integer, optional): For district-level data
- `year` (integer): 2015-2024
- `averageMonthlyIncome` (integer): Average monthly income in local currency
- `medianMonthlyIncome` (integer): Median monthly income
- `incomeGrowthRate` (integer): Year-over-year growth percentage

---

## 15. Ecology (`ecology.json`)

**Time series:** 2015-2024 (annual data)

```json
{
  "ecology": [
    {
      "cityId": 1,
      "year": 2024,
      "aqi": 45,
      "co2Emissions": 8,
      "greenSpaceArea": 250,
      "ecoRating": 72
    }
  ]
}
```

**Fields:**
- `cityId` (integer): References cities.id
- `year` (integer): 2015-2024
- `aqi` (integer): Air Quality Index (0-500, lower is better)
- `co2Emissions` (integer): CO2 emissions in tons per capita
- `greenSpaceArea` (integer): Green space in square kilometers
- `ecoRating` (integer): Overall eco rating (0-100, higher is better)

---

## 16. Vehicles (`vehicles.json`)

**Time series:** 2015-2024 (annual data)

```json
{
  "vehicles": [
    {
      "cityId": 1,
      "year": 2024,
      "totalVehicles": 1200000,
      "electricVehicles": 180000,
      "gasolineVehicles": 1020000,
      "chargingStations": 3500
    }
  ]
}
```

**Fields:**
- `cityId` (integer): References cities.id
- `year` (integer): 2015-2024
- `totalVehicles` (integer): Total registered vehicles
- `electricVehicles` (integer): Electric vehicles count
- `gasolineVehicles` (integer): Gasoline/diesel vehicles count
- `chargingStations` (integer): Number of EV charging stations

---

## Data Sources Checklist

### Primary Sources (Recommended)
- **Eurostat**: Demographics, unemployment, income (EU cities)
- **National Statistical Offices**: Census data, housing statistics
- **OpenStreetMap**: Infrastructure locations (mosques, churches, etc.)
- **OECD**: Economic indicators, tax data
- **World Bank**: International comparisons
- **Government Budget Reports**: Social spending, tax revenue

### City-Specific Sources
- **Germany**: Destatis, Berlin.de Open Data
- **France**: INSEE
- **UK**: ONS (Office for National Statistics)
- **USA**: US Census Bureau, BLS (Bureau of Labor Statistics)

---

## Import Process

Once you provide JSON files in this format:

1. **Validation**: I'll validate data structure and types
2. **ID Resolution**: Map city/district names to database IDs
3. **Import Script**: Create Node.js script to insert data
4. **Verification**: Run queries to verify data integrity
5. **Update Seed**: Replace model-based estimates with real data

---

## Minimal Viable Dataset

If full data is unavailable, prioritize these tables:
1. **cities** (required)
2. **districts** (required for district features)
3. **demographics** (core feature)
4. **propertyPrices** (core feature)
5. **unemployment** (for government impact analysis)
6. **governmentDecisions** (for policy analysis)

Other tables can be populated later or use statistical interpolation for missing values.

---

## Example: Single City Dataset

For testing, provide data for just one city (e.g., Berlin):

```json
{
  "cities": [{"name": "Berlin", "country": "Germany", "population": 3850809}],
  "districts": [
    {"city": "Berlin", "name": "Mitte", "nameEn": "Mitte", "population": 380000, "area": 39, "foreignerPercentage": 35, "dominantCommunity": "Turkish"}
  ],
  "demographics": [
    {"districtId": 1, "year": 2024, "community": "Turkish", "population": 45000, "percentageOfDistrict": 118}
  ],
  "propertyPrices": [
    {"districtId": 1, "year": 2024, "month": 6, "averagePricePerSqm": 5200}
  ]
}
```

I can then replicate the import process for other cities.

---

**Questions?** Ask about specific data points, sources, or import procedures.
