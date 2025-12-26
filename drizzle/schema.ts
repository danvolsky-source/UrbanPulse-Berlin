import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Districts table - stores Berlin district information
 */
export const districts = mysqlTable("districts", {
  id: int("id").autoincrement().primaryKey(),
  city: varchar("city", { length: 100 }).notNull().default("Berlin"),
  name: varchar("name", { length: 255 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  population: int("population").notNull(),
  area: int("area").notNull(), // in square kilometers
  foreignerPercentage: int("foreignerPercentage").notNull(), // percentage
  dominantCommunity: varchar("dominantCommunity", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type District = typeof districts.$inferSelect;
export type InsertDistrict = typeof districts.$inferInsert;

/**
 * Demographics table - stores community population data by district and year
 */
export const demographics = mysqlTable("demographics", {
  id: int("id").autoincrement().primaryKey(),
  districtId: int("districtId").notNull(),
  year: int("year").notNull(),
  community: varchar("community", { length: 255 }).notNull(),
  population: int("population").notNull(),
  percentageOfDistrict: int("percentageOfDistrict").notNull(), // stored as integer (e.g., 48 for 4.8%)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Demographic = typeof demographics.$inferSelect;
export type InsertDemographic = typeof demographics.$inferInsert;

/**
 * Community Infrastructure table - stores locations of religious and cultural facilities
 */
export const communityInfrastructure = mysqlTable("communityInfrastructure", {
  id: int("id").autoincrement().primaryKey(),
  districtId: int("districtId").notNull(),
  type: mysqlEnum("type", ["mosque", "church", "synagogue", "cultural_center", "ethnic_store"]).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  community: varchar("community", { length: 255 }).notNull(), // e.g., "Turkish", "Jewish", "Arab"
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CommunityInfrastructure = typeof communityInfrastructure.$inferSelect;
export type InsertCommunityInfrastructure = typeof communityInfrastructure.$inferInsert;

/**
 * City Summary table - aggregated statistics for the entire city by year
 */
export const citySummary = mysqlTable("citySummary", {
  id: int("id").autoincrement().primaryKey(),
  city: varchar("city", { length: 255 }).notNull(),
  year: int("year").notNull(),
  mosquesCount: int("mosquesCount").notNull(),
  churchesCount: int("churchesCount").notNull(),
  synagoguesCount: int("synagoguesCount").notNull(),
  totalPopulation: int("totalPopulation").notNull(),
  foreignerPopulation: int("foreignerPopulation").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CitySummary = typeof citySummary.$inferSelect;
export type InsertCitySummary = typeof citySummary.$inferInsert;

/**
 * Property Prices table - stores average property prices by district and year
 */
export const propertyPrices = mysqlTable("propertyPrices", {
  id: int("id").autoincrement().primaryKey(),
  districtId: int("districtId").notNull(),
  year: int("year").notNull(),
  month: int("month").notNull(),
  averagePricePerSqm: int("averagePricePerSqm").notNull(), // in euros
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PropertyPrice = typeof propertyPrices.$inferSelect;
export type InsertPropertyPrice = typeof propertyPrices.$inferInsert;

/**
 * Cities table - stores city information
 */
export const cities = mysqlTable("cities", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  country: varchar("country", { length: 255 }).notNull(),
  population: int("population").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type City = typeof cities.$inferSelect;
export type InsertCity = typeof cities.$inferInsert;

/**
 * Ecology table - stores environmental data for cities
 */
export const ecology = mysqlTable("ecology", {
  id: int("id").autoincrement().primaryKey(),
  cityId: int("cityId").notNull(),
  year: int("year").notNull(),
  aqi: int("aqi").notNull(), // Air Quality Index (0-500)
  co2Emissions: int("co2Emissions").notNull(), // tons per capita
  greenSpaceArea: int("greenSpaceArea").notNull(), // square kilometers
  ecoRating: int("ecoRating").notNull(), // 1-100 scale
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Ecology = typeof ecology.$inferSelect;
export type InsertEcology = typeof ecology.$inferInsert;

/**
 * Vehicles table - stores vehicle statistics for cities
 */
export const vehicles = mysqlTable("vehicles", {
  id: int("id").autoincrement().primaryKey(),
  cityId: int("cityId").notNull(),
  year: int("year").notNull(),
  totalVehicles: int("totalVehicles").notNull(),
  electricVehicles: int("electricVehicles").notNull(),
  gasolineVehicles: int("gasolineVehicles").notNull(),
  chargingStations: int("chargingStations").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = typeof vehicles.$inferInsert;

/**
 * Community Growth table - tracks immigrant community percentage changes over time
 */
export const communityGrowth = mysqlTable("communityGrowth", {
  id: int("id").autoincrement().primaryKey(),
  cityId: int("cityId").notNull(),
  districtId: int("districtId"),
  year: int("year").notNull(),
  communityType: varchar("communityType", { length: 100 }).notNull(), // Muslim, Hindu, Buddhist, etc.
  percentage: int("percentage").notNull(), // percentage of population
  growthRate: int("growthRate").notNull(), // year-over-year growth rate
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CommunityGrowth = typeof communityGrowth.$inferSelect;
export type InsertCommunityGrowth = typeof communityGrowth.$inferInsert;

/**
 * Migration Events table - records significant migration events and their impacts
 */
export const migrationEvents = mysqlTable("migrationEvents", {
  id: int("id").autoincrement().primaryKey(),
  cityId: int("cityId").notNull(),
  year: int("year").notNull(),
  month: int("month").notNull(),
  eventType: varchar("eventType", { length: 100 }).notNull(), // refugee_wave, policy_change, economic_migration
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  impactScore: int("impactScore").notNull(), // 1-100 scale
  affectedCommunity: varchar("affectedCommunity", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MigrationEvent = typeof migrationEvents.$inferSelect;
export type InsertMigrationEvent = typeof migrationEvents.$inferInsert;

/**
 * Rental Prices table - tracks monthly rental prices over time
 */
export const rentalPrices = mysqlTable("rentalPrices", {
  id: int("id").autoincrement().primaryKey(),
  cityId: int("cityId").notNull(),
  districtId: int("districtId"),
  year: int("year").notNull(),
  apartmentType: varchar("apartmentType", { length: 50 }).notNull(), // 1-bedroom, 2-bedroom, 3-bedroom, house
  monthlyRent: int("monthlyRent").notNull(), // in local currency
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RentalPrice = typeof rentalPrices.$inferSelect;
export type InsertRentalPrice = typeof rentalPrices.$inferInsert;

/**
 * Unemployment table - tracks unemployment rates by city and district
 */
export const unemployment = mysqlTable("unemployment", {
  id: int("id").autoincrement().primaryKey(),
  cityId: int("cityId").notNull(),
  districtId: int("districtId"),
  year: int("year").notNull(),
  unemploymentRate: int("unemploymentRate").notNull(), // percentage (e.g., 85 for 8.5%)
  youthUnemploymentRate: int("youthUnemploymentRate").notNull(), // percentage for under 25
  longTermUnemployed: int("longTermUnemployed").notNull(), // percentage unemployed >1 year
  foreignerUnemploymentRate: int("foreignerUnemploymentRate").notNull(), // percentage among foreigners
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Unemployment = typeof unemployment.$inferSelect;
export type InsertUnemployment = typeof unemployment.$inferInsert;

/**
 * Social Benefits table - tracks social welfare spending
 */
export const socialBenefits = mysqlTable("socialBenefits", {
  id: int("id").autoincrement().primaryKey(),
  cityId: int("cityId").notNull(),
  year: int("year").notNull(),
  totalBenefitsSpending: int("totalBenefitsSpending").notNull(), // millions of euros
  unemploymentBenefits: int("unemploymentBenefits").notNull(), // millions
  housingBenefits: int("housingBenefits").notNull(), // millions
  childBenefits: int("childBenefits").notNull(), // millions
  refugeeBenefits: int("refugeeBenefits").notNull(), // millions
  beneficiariesCount: int("beneficiariesCount").notNull(), // number of people
  foreignerBeneficiariesPercent: int("foreignerBeneficiariesPercent").notNull(), // percentage
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SocialBenefit = typeof socialBenefits.$inferSelect;
export type InsertSocialBenefit = typeof socialBenefits.$inferInsert;

/**
 * Average Income table - tracks income levels by city and district
 */
export const averageIncome = mysqlTable("averageIncome", {
  id: int("id").autoincrement().primaryKey(),
  cityId: int("cityId").notNull(),
  districtId: int("districtId"),
  year: int("year").notNull(),
  averageMonthlyIncome: int("averageMonthlyIncome").notNull(), // euros
  medianMonthlyIncome: int("medianMonthlyIncome").notNull(), // euros
  foreignerAverageIncome: int("foreignerAverageIncome").notNull(), // euros
  incomeGrowthRate: int("incomeGrowthRate").notNull(), // percentage YoY
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AverageIncome = typeof averageIncome.$inferSelect;
export type InsertAverageIncome = typeof averageIncome.$inferInsert;

/**
 * Tax Burden table - tracks taxation levels
 */
export const taxBurden = mysqlTable("taxBurden", {
  id: int("id").autoincrement().primaryKey(),
  cityId: int("cityId").notNull(),
  year: int("year").notNull(),
  averageTaxRate: int("averageTaxRate").notNull(), // percentage of income
  socialSecurityRate: int("socialSecurityRate").notNull(), // percentage
  totalTaxRevenue: int("totalTaxRevenue").notNull(), // millions of euros
  taxRevenuePerCapita: int("taxRevenuePerCapita").notNull(), // euros per person
  socialSpendingPercent: int("socialSpendingPercent").notNull(), // % of budget on social programs
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TaxBurden = typeof taxBurden.$inferSelect;
export type InsertTaxBurden = typeof taxBurden.$inferInsert;

/**
 * Government Decisions table - records policy decisions and their consequences
 */
export const governmentDecisions = mysqlTable("governmentDecisions", {
  id: int("id").autoincrement().primaryKey(),
  cityId: int("cityId"),
  country: varchar("country", { length: 100 }).notNull(),
  year: int("year").notNull(),
  month: int("month").notNull(),
  decisionType: varchar("decisionType", { length: 100 }).notNull(), // immigration_policy, welfare_reform, housing_policy, etc.
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  officialPromise: text("officialPromise").notNull(), // what government said would happen
  actualOutcome: text("actualOutcome").notNull(), // what actually happened
  impactScore: int("impactScore").notNull(), // 1-100 scale (negative or positive)
  economicImpact: text("economicImpact"), // specific economic consequences
  socialImpact: text("socialImpact"), // specific social consequences
  dataSource: text("dataSource"), // source of data (e.g., "Federal Statistical Office (Destatis), 2024")
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GovernmentDecision = typeof governmentDecisions.$inferSelect;
export type InsertGovernmentDecision = typeof governmentDecisions.$inferInsert;
