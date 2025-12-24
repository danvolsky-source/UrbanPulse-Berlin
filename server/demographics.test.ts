import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("demographics API", () => {
  it("should return city summary for Berlin", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.demographics.citySummary({
      city: "Berlin",
      year: 2024,
    });

    expect(result).toBeDefined();
    expect(result.current).toBeDefined();
    expect(result.current?.city).toBe("Berlin");
    expect(result.current?.year).toBe(2024);
    expect(result.current?.mosquesCount).toBeGreaterThan(0);
    expect(result.current?.churchesCount).toBeGreaterThan(0);
    expect(result.current?.synagoguesCount).toBeGreaterThan(0);
  });

  it("should return community composition for Berlin", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.demographics.communityComposition({
      city: "Berlin",
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(5); // Top 5 communities

    // Check structure of first community
    if (result.length > 0) {
      const community = result[0];
      expect(community).toHaveProperty("name");
      expect(community).toHaveProperty("latestPercentage");
      expect(community).toHaveProperty("progression");
      expect(Array.isArray(community.progression)).toBe(true);
      
      if (community.progression.length > 0) {
        const progression = community.progression[0];
        expect(progression).toHaveProperty("year");
        expect(progression).toHaveProperty("population");
      }
    }
  });

  it("should return demographics by district", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // First get a district ID
    const districts = await caller.districts.list();
    expect(districts.length).toBeGreaterThan(0);

    const districtId = districts[0].id;
    const result = await caller.demographics.byDistrict({ districtId });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    
    if (result.length > 0) {
      const demo = result[0];
      expect(demo).toHaveProperty("districtId");
      expect(demo).toHaveProperty("year");
      expect(demo).toHaveProperty("community");
      expect(demo).toHaveProperty("population");
      expect(demo).toHaveProperty("percentageOfDistrict");
      expect(demo.districtId).toBe(districtId);
    }
  });
});

describe("districts API", () => {
  it("should return list of all districts", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.districts.list();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    // Check structure of first district
    const district = result[0];
    expect(district).toHaveProperty("id");
    expect(district).toHaveProperty("name");
    expect(district).toHaveProperty("nameEn");
    expect(district).toHaveProperty("population");
    expect(district).toHaveProperty("area");
    expect(district).toHaveProperty("foreignerPercentage");
    expect(district).toHaveProperty("dominantCommunity");
  });

  it("should return a specific district by ID", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // First get all districts to get a valid ID
    const districts = await caller.districts.list();
    expect(districts.length).toBeGreaterThan(0);

    const districtId = districts[0].id;
    const result = await caller.districts.getById({ id: districtId });

    expect(result).toBeDefined();
    expect(result?.id).toBe(districtId);
    expect(result?.name).toBe(districts[0].name);
  });
});

describe("infrastructure API", () => {
  it("should return all infrastructure", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.infrastructure.all();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    // Check structure of first infrastructure item
    const item = result[0];
    expect(item).toHaveProperty("id");
    expect(item).toHaveProperty("districtId");
    expect(item).toHaveProperty("type");
    expect(item).toHaveProperty("name");
    expect(item).toHaveProperty("community");
    expect(["mosque", "church", "synagogue", "cultural_center", "ethnic_store"]).toContain(item.type);
  });

  it("should return infrastructure by district", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // First get a district ID
    const districts = await caller.districts.list();
    expect(districts.length).toBeGreaterThan(0);

    const districtId = districts[0].id;
    const result = await caller.infrastructure.byDistrict({ districtId });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    // All items should belong to the requested district
    result.forEach((item) => {
      expect(item.districtId).toBe(districtId);
    });
  });
});

describe("property prices API", () => {
  it("should return property prices by district", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // First get a district ID
    const districts = await caller.districts.list();
    expect(districts.length).toBeGreaterThan(0);

    const districtId = districts[0].id;
    const result = await caller.propertyPrices.byDistrict({ districtId });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    if (result.length > 0) {
      const price = result[0];
      expect(price).toHaveProperty("districtId");
      expect(price).toHaveProperty("year");
      expect(price).toHaveProperty("month");
      expect(price).toHaveProperty("averagePricePerSqm");
      expect(price.districtId).toBe(districtId);
      expect(price.averagePricePerSqm).toBeGreaterThan(0);
    }
  });
});
