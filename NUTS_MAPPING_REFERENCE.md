# NUTS Classification Mapping Reference

**City-to-region mapping follows Eurostat NUTS 2021 classification and administrative correspondence.**

This document provides the official mapping between cities analyzed in UrbanPulse and their corresponding NUTS (Nomenclature of Territorial Units for Statistics) regions. This mapping is used when city-level data is unavailable and regional proxies are employed.

---

## What is NUTS?

The **NUTS classification** (Nomenclature of Territorial Units for Statistics) is a hierarchical system for dividing up the economic territory of the European Union and the United Kingdom for the purpose of:

- Collection, development and harmonization of European regional statistics
- Socio-economic analyses of the regions
- Framing of EU regional policies

**NUTS Levels:**
- **NUTS 1**: Major socio-economic regions (3-7 million inhabitants)
- **NUTS 2**: Basic regions for the application of regional policies (800,000 - 3 million inhabitants)
- **NUTS 3**: Small regions for specific diagnoses (150,000 - 800,000 inhabitants)

---

## City-to-NUTS Mapping Table

| City | Country | NUTS 2 Code | NUTS 2 Name | NUTS 3 Code | NUTS 3 Name | Population (2024) |
|------|---------|-------------|-------------|-------------|-------------|-------------------|
| **Berlin** | Germany | DE30 | Berlin | DE300 | Berlin | 3,850,809 |
| **Munich** | Germany | DE21 | Oberbayern | DE212 | München, Kreisfreie Stadt | 1,512,491 |
| **Hamburg** | Germany | DE60 | Hamburg | DE600 | Hamburg | 1,906,411 |
| **Cologne** | Germany | DEA2 | Köln | DEA23 | Köln, Kreisfreie Stadt | 1,087,863 |
| **Paris** | France | FR10 | Île-de-France | FR101 | Paris | 2,165,423 |
| **Vienna** | Austria | AT13 | Wien | AT130 | Wien | 1,982,442 |
| **Rome** | Italy | ITI4 | Lazio | ITI43 | Roma | 2,761,632 |
| **Amsterdam** | Netherlands | NL32 | Noord-Holland | NL329 | Groot-Amsterdam | 921,402 |
| **Brussels** | Belgium | BE10 | Région de Bruxelles-Capitale | BE100 | Arr. de Bruxelles-Capitale | 1,222,637 |
| **London** | United Kingdom | UKI | London | UKI1 | Inner London - West | 9,648,110 |
| **Washington D.C.** | United States | N/A | N/A | N/A | N/A | 678,972 |
| **New York** | United States | N/A | N/A | N/A | N/A | 8,336,817 |
| **Toronto** | Canada | N/A | N/A | N/A | N/A | 2,794,356 |
| **Los Angeles** | United States | N/A | N/A | N/A | N/A | 3,898,747 |
| **Chicago** | United States | N/A | N/A | N/A | N/A | 2,746,388 |

**Note:** NUTS classification applies only to EU member states and the United Kingdom. For non-EU cities (USA, Canada), equivalent regional statistical areas are used (e.g., Metropolitan Statistical Areas in the USA).

---

## Data Granularity by Indicator

| Indicator | Eurostat Dataset | Available Granularity | UrbanPulse Usage |
|-----------|------------------|----------------------|------------------|
| **Demographics** | urb_cpopcb | City level (✓) | Direct city data |
| **Population Structure** | urb_cpop1 | City level (✓) | Direct city data |
| **Unemployment** | lfst_r_lfu3rt | NUTS 2 only | Regional proxy |
| **GDP** | nama_10r_3gdp | NUTS 3 | Regional proxy |
| **Property Prices** | N/A (not in Eurostat) | National sources | City-specific from national registries |
| **Social Benefits** | gov_10a_exp | National only | National proxy |
| **Tax Burden** | gov_10a_taxag | National only | National proxy |

---

## Important Disclaimers

### Regional Proxies
When data is reported at NUTS 2 or NUTS 3 level, it represents the **entire region**, not just the city. For example:

- **Berlin (DE30)**: City-state, so NUTS 2 = city boundaries (✓ accurate)
- **Munich (DE21 Oberbayern)**: NUTS 2 includes surrounding rural areas (⚠️ proxy)
- **Cologne (DEA2 Köln)**: NUTS 2 includes Bonn and surrounding districts (⚠️ proxy)

### City-States vs. Metropolitan Regions
Some cities are **city-states** where NUTS boundaries align with city limits:
- Berlin (DE300)
- Hamburg (DE600)
- Vienna (AT130)
- Brussels (BE100)

For these cities, NUTS 2/3 data is **directly representative** of city conditions.

Other cities are part of **larger metropolitan regions** where NUTS data includes surrounding areas:
- Munich (part of Oberbayern region)
- Cologne (part of Köln region)
- Amsterdam (part of Groot-Amsterdam)

For these cities, NUTS data provides **regional context** but may not precisely reflect city-specific conditions.

---

## NUTS 2021 Revision

The current mapping follows **NUTS 2021 classification**, which came into effect on January 1, 2021. 

**Key changes from NUTS 2016:**
- United Kingdom retained NUTS codes post-Brexit for statistical continuity
- Some French regions were merged (e.g., Normandie)
- Croatian regions were restructured

**Future revisions:** NUTS classifications are reviewed every 3 years. The next revision is expected in 2024-2025.

---

## Usage Guidelines

### When Using Regional Data as City Proxy

✅ **Appropriate:**
- Comparing trends over time within the same city
- Identifying regional economic patterns
- Contextualizing city-level observations with regional labor market conditions

❌ **Inappropriate:**
- Claiming regional unemployment rate is the "city unemployment rate"
- Making precise city-level policy recommendations based on regional data
- Comparing cities across different NUTS region types (city-state vs. metropolitan region)

### Labeling Requirements

When displaying regional proxy data in UrbanPulse:

1. **Always label the data source:**
   - ✓ "Regional Labour Market Indicator (NUTS 2)"
   - ✗ "City Unemployment Rate"

2. **Include the NUTS code:**
   - ✓ "Berlin region (DE30)"
   - ✗ "Berlin"

3. **Add contextual disclaimer:**
   - ✓ "Regional indicator used for contextual comparison"
   - ✗ (no disclaimer)

---

## References

- **Eurostat NUTS Classification:** https://ec.europa.eu/eurostat/web/nuts/background
- **NUTS 2021 Regulation:** Commission Regulation (EU) 2019/1755
- **NUTS Correspondence Tables:** https://ec.europa.eu/eurostat/web/nuts/correspondence-tables
- **NUTS History:** https://ec.europa.eu/eurostat/web/nuts/history

---

## Maintenance

This mapping reference is maintained alongside the UrbanPulse codebase and should be updated when:

1. Eurostat publishes a new NUTS revision
2. New cities are added to the platform
3. Data sources change their regional reporting structure

**Last Updated:** December 2025  
**NUTS Version:** NUTS 2021  
**Next Review:** Q1 2026 (upon NUTS 2024 publication)
