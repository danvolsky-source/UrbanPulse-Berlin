# Eurostat Dataset Codes for UrbanPulse Data Import

Exact dataset codes for fetching real data from Eurostat API.

---

## City-Level Demographics

### **urb_cpopcb** - Population by citizenship and country of birth (cities and greater cities)
- **Coverage:** EU cities and greater cities
- **Time period:** 2011-present (varies by city)
- **Granularity:** City level
- **Variables:**
  - Total population
  - National citizens
  - Foreign citizens by country of birth
  - EU vs non-EU citizens
- **Use for:** `demographics`, `citySummary` tables
- **API endpoint:** `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/urb_cpopcb`

### **urb_cpop1** - Population on 1 January by age groups and sex (cities and greater cities)
- **Coverage:** EU cities and greater cities
- **Time period:** 2011-present
- **Granularity:** City level, age groups (0-4, 5-9, ..., 85+)
- **Variables:**
  - Population by age group
  - Population by sex
- **Use for:** `citySummary`, demographic breakdowns
- **API endpoint:** `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/urb_cpop1`

### **urb_lpop1** - Population on 1 January by age groups and sex (functional urban areas)
- **Coverage:** Functional Urban Areas (FUA) - larger metropolitan areas
- **Time period:** 2011-present
- **Granularity:** Metropolitan area level
- **Use for:** Alternative to city-level data for larger urban regions
- **API endpoint:** `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/urb_lpop1`

---

## Regional-Level Unemployment (NUTS 2/3)

**Note:** Eurostat does NOT provide city-level unemployment data. Use regional (NUTS 2 or NUTS 3) data instead.

### **lfst_r_lfu3rt** - Unemployment rates by educational attainment level and NUTS 2 region
- **Coverage:** NUTS 2 regions (e.g., Berlin region, Bavaria, Île-de-France)
- **Time period:** 2000-present
- **Granularity:** NUTS 2 (regional level, not city-specific)
- **Variables:**
  - Unemployment rate (%) by education level
  - Total unemployment rate
  - Youth unemployment (15-24 years)
- **Use for:** `unemployment` table (cityId mapped from NUTS 2 region)
- **API endpoint:** `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/lfst_r_lfu3rt`

### **lfst_r_lfu3pers** - Unemployed persons by educational attainment level and NUTS 2 region
- **Coverage:** NUTS 2 regions
- **Time period:** 2000-present
- **Granularity:** NUTS 2 (regional level)
- **Variables:**
  - Absolute number of unemployed persons
  - Breakdown by education level (ISCED 0-2, 3-4, 5-8)
- **Use for:** `unemployment` table (absolute numbers)
- **API endpoint:** `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/lfst_r_lfu3pers`

### **lfst_r_lfu2ltu** - Long-term unemployment (12 months and more) by NUTS 2 regions
- **Coverage:** NUTS 2 regions
- **Time period:** 2000-present
- **Variables:**
  - Long-term unemployment rate (%)
  - Long-term unemployed persons (thousands)
- **Use for:** `unemployment.longTermUnemployed` field
- **API endpoint:** `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/lfst_r_lfu2ltu`

---

## Regional-Level Demographics (NUTS 2/3)

### **demo_r_pjangrp3** - Population on 1 January by age group, sex and NUTS 3 region
- **Coverage:** NUTS 3 regions (smaller administrative units, closer to city level)
- **Time period:** 1990-present
- **Granularity:** NUTS 3 (district/county level)
- **Variables:**
  - Population by age group (0-4, 5-9, ..., 85+)
  - Population by sex
- **Use for:** `demographics`, `districts` tables
- **API endpoint:** `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/demo_r_pjangrp3`

### **demo_r_d3area** - Area by NUTS 3 region
- **Coverage:** NUTS 3 regions
- **Time period:** Static (latest year)
- **Variables:**
  - Total area (km²)
- **Use for:** `districts.area` field
- **API endpoint:** `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/demo_r_d3area`

---

## Income and Economic Indicators

### **nama_10r_3gdp** - Gross domestic product (GDP) at current market prices by NUTS 3 regions
- **Coverage:** NUTS 3 regions
- **Time period:** 2000-present
- **Variables:**
  - GDP (million EUR)
  - GDP per capita (EUR)
- **Use for:** `averageIncome` table (proxy for income levels)
- **API endpoint:** `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/nama_10r_3gdp`

### **ilc_di03** - Median income by household type (EU-SILC survey)
- **Coverage:** National level (not regional)
- **Time period:** 2005-present
- **Variables:**
  - Median equivalised disposable income (EUR)
- **Use for:** `averageIncome.medianMonthlyIncome` (national proxy)
- **API endpoint:** `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/ilc_di03`

---

## Migration and Foreign Population

### **migr_pop1ctz** - Population on 1 January by age group, sex and citizenship
- **Coverage:** National level (not city-specific)
- **Time period:** 2008-present
- **Variables:**
  - Population by citizenship (national, EU, non-EU)
  - Foreign population by country of citizenship
- **Use for:** `demographics.community` field (national-level proxy)
- **API endpoint:** `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/migr_pop1ctz`

### **migr_imm1ctz** - Immigration by age group, sex and citizenship
- **Coverage:** National level
- **Time period:** 2008-present
- **Variables:**
  - Number of immigrants per year
  - Breakdown by citizenship
- **Use for:** `migrationEvents` table
- **API endpoint:** `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/migr_imm1ctz`

---

## Housing and Property Prices

**⚠️ Limitation:** Eurostat does NOT provide property price data at city or regional level.

### Alternative Sources:
- **National statistical offices** (e.g., Destatis for Germany, INSEE for France)
- **OECD Housing Prices Database** - National level only
- **Commercial providers** (e.g., Immobilienscout24, Zillow, Rightmove)

For `propertyPrices` and `rentalPrices` tables, you MUST use:
- **Germany:** Destatis, Berlin.de Open Data Portal
- **France:** INSEE, APUR (Paris Urban Planning Agency)
- **UK:** ONS House Price Index, Land Registry
- **USA:** Zillow Research Data, US Census Bureau

---

## Social Benefits and Taxation

**⚠️ Limitation:** Eurostat does NOT provide city-level social spending or tax data.

### **gov_10a_exp** - General government expenditure by function (COFOG)
- **Coverage:** National level
- **Time period:** 1995-present
- **Variables:**
  - Social protection expenditure (million EUR)
  - Unemployment benefits
  - Housing benefits
- **Use for:** `socialBenefits` table (national proxy)
- **API endpoint:** `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/gov_10a_exp`

### **gov_10a_taxag** - Tax revenue by tax category
- **Coverage:** National level
- **Time period:** 1995-present
- **Variables:**
  - Total tax revenue (million EUR)
  - Direct taxes (income, corporate)
  - Indirect taxes (VAT, excise)
- **Use for:** `taxBurden` table (national proxy)
- **API endpoint:** `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/gov_10a_taxag`

---

## Data Availability Summary

| Table | Eurostat Dataset | Granularity | Coverage |
|-------|------------------|-------------|----------|
| **demographics** | `urb_cpopcb` | City | ✅ Available |
| **citySummary** | `urb_cpop1` | City | ✅ Available |
| **districts** | `demo_r_pjangrp3` | NUTS 3 | ✅ Available (regional proxy) |
| **unemployment** | `lfst_r_lfu3rt` | NUTS 2 | ⚠️ Regional only (not city) |
| **propertyPrices** | ❌ Not available | - | ❌ Use national sources |
| **rentalPrices** | ❌ Not available | - | ❌ Use national sources |
| **socialBenefits** | `gov_10a_exp` | National | ⚠️ National only |
| **taxBurden** | `gov_10a_taxag` | National | ⚠️ National only |
| **averageIncome** | `nama_10r_3gdp` | NUTS 3 | ⚠️ GDP proxy only |

---

## NUTS Region Mapping for Cities

To use regional data for cities, map cities to NUTS 2/3 regions:

| City | NUTS 2 Code | NUTS 2 Name | NUTS 3 Code | NUTS 3 Name |
|------|-------------|-------------|-------------|-------------|
| **Berlin** | DE30 | Berlin | DE300 | Berlin |
| **Munich** | DE21 | Oberbayern | DE212 | München, Kreisfreie Stadt |
| **Hamburg** | DE60 | Hamburg | DE600 | Hamburg |
| **Cologne** | DEA2 | Köln | DEA23 | Köln, Kreisfreie Stadt |
| **Paris** | FR10 | Île-de-France | FR101 | Paris |
| **Vienna** | AT13 | Wien | AT130 | Wien |
| **Rome** | ITI4 | Lazio | ITI43 | Roma |
| **Amsterdam** | NL32 | Noord-Holland | NL329 | Groot-Amsterdam |
| **Brussels** | BE10 | Région de Bruxelles-Capitale | BE100 | Arr. de Bruxelles-Capitale |
| **London** | UKI | London | UKI1 | Inner London - West |

---

## Eurostat API Usage

### Base URL
```
https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/{dataset_code}
```

### Example Query (Berlin population by citizenship)
```
https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/urb_cpopcb?format=JSON&geo=DE300&time=2015-2024
```

### Parameters
- `format=JSON` - Response format (JSON, XML, CSV)
- `geo=DE300` - Geographic code (NUTS code or city code)
- `time=2015-2024` - Time period
- `lang=en` - Language (en, de, fr, etc.)

---

## Next Steps

1. **Implement Eurostat API client** - Fetch data programmatically
2. **Map NUTS codes to cities** - Use mapping table above
3. **Supplement with national sources** - For property prices, detailed social spending
4. **Handle missing data** - Use statistical interpolation or model-based estimation where gaps exist

Would you like me to create an automated data fetching script using these dataset codes?
