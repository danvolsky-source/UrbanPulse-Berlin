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