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
  avatar: text("avatar"), // S3 URL for user avatar
  loginMethod: varchar("loginMethod", { length: 64 }),
  oauthProvider: mysqlEnum("oauthProvider", ["manus", "google"]).default("manus").notNull(),
  communityPreference: varchar("communityPreference", { length: 50 }), // User's community (Muslim, Hindu, etc.)
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

/**
 * Saved Cities table - tracks cities saved/favorited by users
 */
export const savedCities = mysqlTable("savedCities", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  cityId: int("cityId").notNull(),
  notes: text("notes"), // user's personal notes about this city
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavedCity = typeof savedCities.$inferSelect;
export type InsertSavedCity = typeof savedCities.$inferInsert;

/**
 * Notifications table - stores user notifications
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["government_decision", "price_change", "migration_event", "digest"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  relatedCityId: int("relatedCityId"), // optional: link to specific city
  relatedUrl: varchar("relatedUrl", { length: 500 }), // optional: link to relevant page
  isRead: int("isRead").default(0).notNull(), // 0 = unread, 1 = read
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Notification Preferences table - user notification settings
 */
export const notificationPreferences = mysqlTable("notificationPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  emailNotifications: int("emailNotifications").default(1).notNull(), // 0 = off, 1 = on
  pushNotifications: int("pushNotifications").default(1).notNull(),
  governmentDecisions: int("governmentDecisions").default(1).notNull(),
  priceChanges: int("priceChanges").default(1).notNull(),
  migrationEvents: int("migrationEvents").default(1).notNull(),
  weeklyDigest: int("weeklyDigest").default(1).notNull(),
  monthlyDigest: int("monthlyDigest").default(0).notNull(),
  priceChangeThreshold: int("priceChangeThreshold").default(10).notNull(), // notify if price changes by X%
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreference = typeof notificationPreferences.$inferInsert;

/**
 * Browsing History table - tracks user's city page visits
 */
export const browsingHistory = mysqlTable("browsingHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  cityId: int("cityId").notNull(),
  visitedAt: timestamp("visitedAt").defaultNow().notNull(),
});

export type BrowsingHistory = typeof browsingHistory.$inferSelect;
export type InsertBrowsingHistory = typeof browsingHistory.$inferInsert;


/**
 * Grid Cells table - stores fine-grained mosaic grid data for heatmap visualization
 * Each cell represents a small geographic area with aggregated demographic and infrastructure metrics
 */
export const gridCells = mysqlTable("gridCells", {
  id: int("id").autoincrement().primaryKey(),
  city: varchar("city", { length: 50 }).notNull().default("Berlin"),
  zoomLevel: int("zoomLevel").notNull(), // 11, 12, 13, etc.
  cellX: int("cellX").notNull(), // grid column index
  cellY: int("cellY").notNull(), // grid row index
  
  // GeoJSON geometry for cell boundaries
  bboxGeojson: text("bboxGeojson").notNull(), // JSON string of polygon coordinates
  
  // Population metrics
  population: int("population"),
  populationDensity: int("populationDensity"), // people per km² * 100 (for int storage)
  
  // Religious infrastructure counts
  mosquesCount: int("mosquesCount").default(0),
  churchesCount: int("churchesCount").default(0),
  synagoguesCount: int("synagoguesCount").default(0),
  
  // Community demographics
  turkishPop: int("turkishPop").default(0),
  syrianPop: int("syrianPop").default(0),
  polishPop: int("polishPop").default(0),
  italianPop: int("italianPop").default(0),
  russianPop: int("russianPop").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GridCell = typeof gridCells.$inferSelect;
export type InsertGridCell = typeof gridCells.$inferInsert;
