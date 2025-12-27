/**
 * Citation Reference Database
 * Maps data sources to their official URLs and metadata
 */

export interface Citation {
  id: string;
  shortName: string;
  fullName: string;
  organization: string;
  url: string;
  datasetCode?: string;
  accessDate: string;
  type: "official" | "national" | "market" | "government";
}

export const CITATIONS: Record<string, Citation> = {
  // Eurostat - Demographics
  "eurostat_urb_cpopcb": {
    id: "eurostat_urb_cpopcb",
    shortName: "Eurostat urb_cpopcb",
    fullName: "Population by citizenship and country of birth - cities and greater cities",
    organization: "Eurostat",
    url: "https://ec.europa.eu/eurostat/databrowser/view/urb_cpopcb/default/table",
    datasetCode: "urb_cpopcb",
    accessDate: "2024-12-27",
    type: "official"
  },

  "eurostat_urb_cpop1": {
    id: "eurostat_urb_cpop1",
    shortName: "Eurostat urb_cpop1",
    fullName: "Population on 1 January by age groups and sex - cities and greater cities",
    organization: "Eurostat",
    url: "https://ec.europa.eu/eurostat/databrowser/view/urb_cpop1/default/table",
    datasetCode: "urb_cpop1",
    accessDate: "2024-12-27",
    type: "official"
  },

  // Eurostat - Unemployment (NUTS 2)
  "eurostat_lfst_r_lfu3rt": {
    id: "eurostat_lfst_r_lfu3rt",
    shortName: "Eurostat lfst_r_lfu3rt",
    fullName: "Unemployment rates by NUTS 2 regions",
    organization: "Eurostat",
    url: "https://ec.europa.eu/eurostat/databrowser/view/lfst_r_lfu3rt/default/table",
    datasetCode: "lfst_r_lfu3rt",
    accessDate: "2024-12-27",
    type: "official"
  },

  "eurostat_lfst_r_lfu2ltu": {
    id: "eurostat_lfst_r_lfu2ltu",
    shortName: "Eurostat lfst_r_lfu2ltu",
    fullName: "Long-term unemployment (12 months and more) by NUTS 2 regions",
    organization: "Eurostat",
    url: "https://ec.europa.eu/eurostat/databrowser/view/lfst_r_lfu2ltu/default/table",
    datasetCode: "lfst_r_lfu2ltu",
    accessDate: "2024-12-27",
    type: "official"
  },

  // Eurostat - GDP (NUTS 3)
  "eurostat_nama_10r_3gdp": {
    id: "eurostat_nama_10r_3gdp",
    shortName: "Eurostat nama_10r_3gdp",
    fullName: "Gross domestic product (GDP) at current market prices by NUTS 3 regions",
    organization: "Eurostat",
    url: "https://ec.europa.eu/eurostat/databrowser/view/nama_10r_3gdp/default/table",
    datasetCode: "nama_10r_3gdp",
    accessDate: "2024-12-27",
    type: "official"
  },

  // Eurostat - Social Benefits
  "eurostat_gov_10a_exp": {
    id: "eurostat_gov_10a_exp",
    shortName: "Eurostat gov_10a_exp",
    fullName: "General government expenditure by function (COFOG)",
    organization: "Eurostat",
    url: "https://ec.europa.eu/eurostat/databrowser/view/gov_10a_exp/default/table",
    datasetCode: "gov_10a_exp",
    accessDate: "2024-12-27",
    type: "official"
  },

  // Eurostat - Taxation
  "eurostat_gov_10a_taxag": {
    id: "eurostat_gov_10a_taxag",
    shortName: "Eurostat gov_10a_taxag",
    fullName: "Tax revenue by tax category",
    organization: "Eurostat",
    url: "https://ec.europa.eu/eurostat/databrowser/view/gov_10a_taxag/default/table",
    datasetCode: "gov_10a_taxag",
    accessDate: "2024-12-27",
    type: "official"
  },

  // Germany - Destatis
  "destatis_property_prices": {
    id: "destatis_property_prices",
    shortName: "Destatis Housing Price Index",
    fullName: "Residential property price indices - Germany",
    organization: "Statistisches Bundesamt (Destatis)",
    url: "https://www.destatis.de/EN/Themes/Economy/Prices/Construction-Prices-And-Real-Property-Prices/_node.html",
    accessDate: "2024-12-27",
    type: "national"
  },

  "destatis_demographics": {
    id: "destatis_demographics",
    shortName: "Destatis Population Statistics",
    fullName: "Population and migration statistics - Germany",
    organization: "Statistisches Bundesamt (Destatis)",
    url: "https://www.destatis.de/EN/Themes/Society-Environment/Population/_node.html",
    accessDate: "2024-12-27",
    type: "national"
  },

  // France - INSEE
  "insee_property_prices": {
    id: "insee_property_prices",
    shortName: "INSEE Housing Price Index",
    fullName: "Price indices of housing - France",
    organization: "Institut national de la statistique et des études économiques (INSEE)",
    url: "https://www.insee.fr/en/statistiques/series/105071770",
    accessDate: "2024-12-27",
    type: "national"
  },

  "insee_demographics": {
    id: "insee_demographics",
    shortName: "INSEE Population Statistics",
    fullName: "Population and demography - France",
    organization: "Institut national de la statistique et des études économiques (INSEE)",
    url: "https://www.insee.fr/en/statistiques",
    accessDate: "2024-12-27",
    type: "national"
  },

  // Austria - Statistics Austria
  "statistik_austria_property": {
    id: "statistik_austria_property",
    shortName: "Statistics Austria HPI",
    fullName: "House price index - Austria",
    organization: "Statistics Austria",
    url: "https://www.statistik.at/en/statistics/national-economy-and-public-finance/prices-and-price-indices/house-price-index-and-ooh-pi",
    accessDate: "2024-12-27",
    type: "national"
  },

  // UK - ONS
  "ons_house_prices": {
    id: "ons_house_prices",
    shortName: "ONS UK House Price Index",
    fullName: "UK House Price Index",
    organization: "Office for National Statistics (ONS)",
    url: "https://www.ons.gov.uk/economy/inflationandpriceindices/datasets/ukhousepriceindexmonthlypricestatistics",
    accessDate: "2024-12-27",
    type: "national"
  },

  "hm_land_registry": {
    id: "hm_land_registry",
    shortName: "HM Land Registry",
    fullName: "Price Paid Data",
    organization: "HM Land Registry",
    url: "https://www.gov.uk/government/collections/uk-house-price-index-reports",
    accessDate: "2024-12-27",
    type: "national"
  },

  // USA - Census Bureau
  "us_census_housing": {
    id: "us_census_housing",
    shortName: "US Census Bureau Housing",
    fullName: "Housing Data - American Community Survey",
    organization: "United States Census Bureau",
    url: "https://www.census.gov/topics/housing.html",
    accessDate: "2024-12-27",
    type: "national"
  },

  // Italy - ISTAT
  "istat_property_prices": {
    id: "istat_property_prices",
    shortName: "ISTAT House Price Index",
    fullName: "House Price Index - Italy",
    organization: "Istituto Nazionale di Statistica (ISTAT)",
    url: "https://www.istat.it/en/statistical-themes/economy/prices/",
    accessDate: "2024-12-27",
    type: "national"
  },

  // Government Records
  "german_government_records": {
    id: "german_government_records",
    shortName: "German Federal Government",
    fullName: "Official government policy documents and legislative records",
    organization: "Bundesregierung Deutschland",
    url: "https://www.bundesregierung.de/breg-en",
    accessDate: "2024-12-27",
    type: "government"
  },

  "french_government_records": {
    id: "french_government_records",
    shortName: "French Government",
    fullName: "Official government policy documents",
    organization: "Gouvernement français",
    url: "https://www.gouvernement.fr/",
    accessDate: "2024-12-27",
    type: "government"
  },

  // OpenStreetMap
  "openstreetmap": {
    id: "openstreetmap",
    shortName: "OpenStreetMap",
    fullName: "OpenStreetMap - Infrastructure and points of interest",
    organization: "OpenStreetMap Foundation",
    url: "https://www.openstreetmap.org/",
    accessDate: "2024-12-27",
    type: "official"
  },
};

/**
 * Get citation by ID
 */
export function getCitation(id: string): Citation | undefined {
  return CITATIONS[id];
}

/**
 * Get citations by type
 */
export function getCitationsByType(type: Citation["type"]): Citation[] {
  return Object.values(CITATIONS).filter(c => c.type === type);
}

/**
 * Format citation in APA style
 */
export function formatCitationAPA(citation: Citation): string {
  const { organization, fullName, url, accessDate } = citation;
  return `${organization}. ${fullName}. Retrieved ${accessDate}, from ${url}`;
}

/**
 * Get all citations sorted by organization
 */
export function getAllCitationsSorted(): Citation[] {
  return Object.values(CITATIONS).sort((a, b) => 
    a.organization.localeCompare(b.organization)
  );
}
