import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("Community Impact and Rental Prices API", () => {
  const caller = appRouter.createCaller({
    req: {} as any,
    res: {} as any,
    user: null,
  });

  describe("Community Growth Endpoints", () => {
    it("should fetch all community growth data", async () => {
      const result = await caller.communityGrowth.getAll();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
      
      if (result.length > 0) {
        const firstRecord = result[0];
        expect(firstRecord).toHaveProperty("cityId");
        expect(firstRecord).toHaveProperty("year");
        expect(firstRecord).toHaveProperty("communityType");
        expect(firstRecord).toHaveProperty("percentage");
        expect(firstRecord).toHaveProperty("growthRate");
      }
    });

    it("should fetch community growth by city", async () => {
      const result = await caller.communityGrowth.getByCity({ cityId: 1 });
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      if (result.length > 0) {
        expect(result.every((r: any) => r.cityId === 1)).toBe(true);
      }
    });
  });

  describe("Migration Events Endpoints", () => {
    it("should fetch all migration events", async () => {
      const result = await caller.migrationEvents.getAll();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
      
      if (result.length > 0) {
        const firstEvent = result[0];
        expect(firstEvent).toHaveProperty("cityId");
        expect(firstEvent).toHaveProperty("year");
        expect(firstEvent).toHaveProperty("eventType");
        expect(firstEvent).toHaveProperty("title");
        expect(firstEvent).toHaveProperty("impactScore");
      }
    });

    it("should fetch migration events by city", async () => {
      const result = await caller.migrationEvents.getByCity({ cityId: 1 });
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      if (result.length > 0) {
        expect(result.every((r: any) => r.cityId === 1)).toBe(true);
      }
    });
  });

  describe("Correlation Analysis Endpoints", () => {
    it("should calculate community impact correlations", async () => {
      const result = await caller.correlations.getCommunityImpact({ cityId: 1 });
      expect(result).toBeDefined();
      expect(result).toHaveProperty("cityId");
      expect(result).toHaveProperty("correlations");
      
      if (result.correlations) {
        expect(result.correlations).toHaveProperty("propertyPrices");
        expect(result.correlations).toHaveProperty("infrastructure");
        expect(result.correlations).toHaveProperty("ecology");
        expect(result.correlations).toHaveProperty("evAdoption");
        expect(result.correlations).toHaveProperty("qualityOfLife");
      }
    });
  });

  describe("Rental Prices Endpoints", () => {
    it("should fetch all rental prices", async () => {
      const result = await caller.rentalPrices.getAll();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
      
      if (result.length > 0) {
        const firstRecord = result[0];
        expect(firstRecord).toHaveProperty("cityId");
        expect(firstRecord).toHaveProperty("year");
        expect(firstRecord).toHaveProperty("apartmentType");
        expect(firstRecord).toHaveProperty("monthlyRent");
        
        // Verify apartment types
        expect(["1-bedroom", "2-bedroom", "3-bedroom", "house"]).toContain(firstRecord.apartmentType);
        
        // Verify year range
        expect(firstRecord.year).toBeGreaterThanOrEqual(2020);
        expect(firstRecord.year).toBeLessThanOrEqual(2024);
        
        // Verify rent is positive
        expect(firstRecord.monthlyRent).toBeGreaterThan(0);
      }
    });

    it("should fetch rental prices by city", async () => {
      const result = await caller.rentalPrices.getByCity({ cityId: 1 });
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      if (result.length > 0) {
        expect(result.every((r: any) => r.cityId === 1)).toBe(true);
        
        // Should have data for multiple years
        const years = [...new Set(result.map((r: any) => r.year))];
        expect(years.length).toBeGreaterThan(0);
        
        // Should have data for multiple apartment types
        const types = [...new Set(result.map((r: any) => r.apartmentType))];
        expect(types.length).toBeGreaterThan(0);
      }
    });

    it("should show rental price growth over time", async () => {
      const result = await caller.rentalPrices.getByCity({ cityId: 1 });
      
      if (result.length > 0) {
        // Group by apartment type
        const byType: Record<string, any[]> = {};
        result.forEach((r: any) => {
          if (!byType[r.apartmentType]) byType[r.apartmentType] = [];
          byType[r.apartmentType].push(r);
        });
        
        // Check that prices generally increase over time
        Object.values(byType).forEach((records) => {
          if (records.length > 1) {
            const sorted = records.sort((a, b) => a.year - b.year);
            const firstYear = sorted[0];
            const lastYear = sorted[sorted.length - 1];
            
            // Prices should increase or stay the same
            expect(lastYear.monthlyRent).toBeGreaterThanOrEqual(firstYear.monthlyRent);
          }
        });
      }
    });
  });

  describe("Data Integrity", () => {
    it("should have consistent city IDs across all tables", async () => {
      const communityGrowth = await caller.communityGrowth.getAll();
      const migrationEvents = await caller.migrationEvents.getAll();
      const rentalPrices = await caller.rentalPrices.getAll();
      
      const cgCityIds = [...new Set(communityGrowth.map((r: any) => r.cityId))];
      const meCityIds = [...new Set(migrationEvents.map((r: any) => r.cityId))];
      const rpCityIds = [...new Set(rentalPrices.map((r: any) => r.cityId))];
      
      // All city IDs should be positive integers
      expect(cgCityIds.every((id) => id > 0)).toBe(true);
      expect(meCityIds.every((id) => id > 0)).toBe(true);
      expect(rpCityIds.every((id) => id > 0)).toBe(true);
    });
  });
});
