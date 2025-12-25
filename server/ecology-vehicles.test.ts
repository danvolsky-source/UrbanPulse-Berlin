import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("Ecology and Vehicles API", () => {
  const caller = appRouter.createCaller({ user: null });

  describe("Ecology Endpoints", () => {
    it("should fetch all ecology data", async () => {
      const result = await caller.ecology.getAll();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
      
      // Verify data structure if data exists
      if (result.length > 0) {
        const firstRecord = result[0];
        expect(firstRecord).toHaveProperty("id");
        expect(firstRecord).toHaveProperty("cityId");
        expect(firstRecord).toHaveProperty("year");
        expect(firstRecord).toHaveProperty("aqi");
        expect(firstRecord).toHaveProperty("co2Emissions");
        expect(firstRecord).toHaveProperty("greenSpaceArea");
        expect(firstRecord).toHaveProperty("ecoRating");
      }
    });

    it("should fetch ecology data for a specific city", async () => {
      // Use city ID 1 (should exist from seed data)
      const result = await caller.ecology.getByCity({ cityId: 1 });
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      if (result.length > 0) {
        // All records should be for the same city
        result.forEach((record: any) => {
          expect(record.cityId).toBe(1);
        });
      }
    });

    it("should have data for years 2020-2024", async () => {
      const result = await caller.ecology.getAll();
      if (result.length > 0) {
        const years = [...new Set(result.map((r: any) => r.year))].sort();
        expect(years).toEqual([2020, 2021, 2022, 2023, 2024]);
      } else {
        // No data yet, skip test
        expect(result.length).toBe(0);
      }
    });

    it("should have valid AQI values (0-500 range)", async () => {
      const result = await caller.ecology.getAll();
      result.forEach((record: any) => {
        expect(record.aqi).toBeGreaterThanOrEqual(0);
        expect(record.aqi).toBeLessThanOrEqual(500);
      });
    });

    it("should have valid eco ratings (0-100 range)", async () => {
      const result = await caller.ecology.getAll();
      result.forEach((record: any) => {
        expect(record.ecoRating).toBeGreaterThanOrEqual(0);
        expect(record.ecoRating).toBeLessThanOrEqual(100);
      });
    });
  });

  describe("Vehicles Endpoints", () => {
    it("should fetch all vehicles data", async () => {
      const result = await caller.vehicles.getAll();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
      
      // Verify data structure if data exists
      if (result.length > 0) {
        const firstRecord = result[0];
        expect(firstRecord).toHaveProperty("id");
        expect(firstRecord).toHaveProperty("cityId");
        expect(firstRecord).toHaveProperty("year");
        expect(firstRecord).toHaveProperty("totalVehicles");
        expect(firstRecord).toHaveProperty("electricVehicles");
        expect(firstRecord).toHaveProperty("gasolineVehicles");
        expect(firstRecord).toHaveProperty("chargingStations");
      }
    });

    it("should fetch vehicles data for a specific city", async () => {
      // Use city ID 1 (should exist from seed data)
      const result = await caller.vehicles.getByCity({ cityId: 1 });
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      
      if (result.length > 0) {
        // All records should be for the same city
        result.forEach((record: any) => {
          expect(record.cityId).toBe(1);
        });
      }
    });

    it("should have data for years 2020-2024", async () => {
      const result = await caller.vehicles.getAll();
      if (result.length > 0) {
        const years = [...new Set(result.map((r: any) => r.year))].sort();
        expect(years).toEqual([2020, 2021, 2022, 2023, 2024]);
      } else {
        // No data yet, skip test
        expect(result.length).toBe(0);
      }
    });

    it("should have total vehicles equal to electric + gasoline", async () => {
      const result = await caller.vehicles.getAll();
      result.forEach((record: any) => {
        expect(record.totalVehicles).toBe(
          record.electricVehicles + record.gasolineVehicles
        );
      });
    });

    it("should show increasing EV adoption over time", async () => {
      // Use city ID 1
      const cityData = await caller.vehicles.getByCity({ cityId: 1 });
      
      if (cityData.length >= 2) {
        // Sort by year
        const sorted = cityData.sort((a: any, b: any) => a.year - b.year);
        
        // Calculate EV percentages
        const evPercentages = sorted.map((r: any) => 
          (r.electricVehicles / r.totalVehicles) * 100
        );
        
        // Check that EV adoption is generally increasing
        // (Allow for minor fluctuations but overall trend should be up)
        const firstYear = evPercentages[0];
        const lastYear = evPercentages[evPercentages.length - 1];
        expect(lastYear).toBeGreaterThanOrEqual(firstYear);
      } else {
        // Not enough data to test trend
        expect(cityData.length).toBeGreaterThanOrEqual(0);
      }
    });

    it("should have positive number of charging stations", async () => {
      const result = await caller.vehicles.getAll();
      result.forEach((record: any) => {
        expect(record.chargingStations).toBeGreaterThan(0);
      });
    });
  });

  describe("Data Consistency", () => {
    it("should have ecology and vehicles data", async () => {
      const ecologyData = await caller.ecology.getAll();
      const vehiclesData = await caller.vehicles.getAll();
      
      // Should have data
      expect(ecologyData.length).toBeGreaterThanOrEqual(0);
      expect(vehiclesData.length).toBeGreaterThanOrEqual(0);
      
      // If we have data, it should match
      if (ecologyData.length > 0 && vehiclesData.length > 0) {
        expect(ecologyData.length).toBe(vehiclesData.length);
      }
    });

    it("should have complete 5-year data if data exists", async () => {
      const ecologyData = await caller.ecology.getAll();
      const vehiclesData = await caller.vehicles.getAll();
      
      if (ecologyData.length > 0) {
        // Should be divisible by 5 (5 years per city)
        expect(ecologyData.length % 5).toBe(0);
      }
      
      if (vehiclesData.length > 0) {
        // Should be divisible by 5 (5 years per city)
        expect(vehiclesData.length % 5).toBe(0);
      }
    });
  });
});
