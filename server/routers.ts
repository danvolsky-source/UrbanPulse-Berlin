import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  districts: router({
    list: publicProcedure
      .input((val: unknown) => {
        if (val === undefined || val === null) return { city: undefined };
        if (typeof val === "object" && "city" in val) {
          return val as { city?: string };
        }
        return { city: undefined };
      })
      .query(async ({ input }) => {
        const { getAllDistricts } = await import("./db");
        return await getAllDistricts(input.city);
      }),
    getById: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "id" in val) {
          return val as { id: number };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getDistrictById } = await import("./db");
        return await getDistrictById(input.id);
      }),
  }),

  ecology: router({
    getByCity: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "cityId" in val) {
          return val as { cityId: number };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getEcologyByCity } = await import("./db");
        return await getEcologyByCity(input.cityId);
      }),
    getAll: publicProcedure.query(async () => {
      const { getAllEcology } = await import("./db");
      return await getAllEcology();
    }),
  }),

  vehicles: router({
    getByCity: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "cityId" in val) {
          return val as { cityId: number };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getVehiclesByCity } = await import("./db");
        return await getVehiclesByCity(input.cityId);
      }),
    getAll: publicProcedure.query(async () => {
      const { getAllVehicles } = await import("./db");
      return await getAllVehicles();
    }),
  }),

  cities: router({
    list: publicProcedure.query(async () => {
      const { getCities } = await import("./db");
      return await getCities();
    }),
    getCitySummary: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "city" in val) {
          return val as { city: string };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getCitySummaryHistory } = await import("./db");
        return await getCitySummaryHistory(input.city);
      }),
    getDemographics: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "city" in val) {
          return val as { city: string };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getAllDemographics } = await import("./db");
        return await getAllDemographics(input.city);
      }),
    getInfrastructure: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "city" in val) {
          return val as { city: string };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getAllInfrastructure } = await import("./db");
        return await getAllInfrastructure(input.city);
      }),
    getPropertyPrices: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "city" in val) {
          return val as { city: string };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getPropertyPricesByCity } = await import("./db");
        return await getPropertyPricesByCity(input.city);
      }),
  }),

  demographics: router({
    citySummary: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "city" in val && "year" in val) {
          return val as { city: string; year: number };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getCitySummary, getCitySummaryHistory } = await import("./db");
        const currentYear = await getCitySummary(input.city, input.year);
        const previousYear = await getCitySummary(input.city, input.year - 1);
        const history = await getCitySummaryHistory(input.city);
        
        return {
          current: currentYear,
          previous: previousYear,
          history,
        };
      }),
    communityComposition: publicProcedure
      .input((val: unknown) => {
        if (val === undefined || val === null) return { city: "Berlin" };
        if (typeof val === "object" && "city" in val) {
          return val as { city: string };
        }
        return { city: "Berlin" };
      })
      .query(async ({ input }) => {
        const { getCommunityComposition } = await import("./db");
        return await getCommunityComposition(input.city);
      }),
    byDistrict: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "districtId" in val) {
          return val as { districtId: number };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getDemographicsByDistrict } = await import("./db");
        return await getDemographicsByDistrict(input.districtId);
      }),
  }),

  infrastructure: router({
    all: publicProcedure.query(async () => {
      const { getAllInfrastructure } = await import("./db");
      return await getAllInfrastructure();
    }),
    byDistrict: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "districtId" in val) {
          return val as { districtId: number };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getInfrastructureByDistrict } = await import("./db");
        return await getInfrastructureByDistrict(input.districtId);
      }),
  }),

  propertyPrices: router({
    byDistrict: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "districtId" in val) {
          return val as { districtId: number };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getPropertyPricesByDistrict } = await import("./db");
        return await getPropertyPricesByDistrict(input.districtId);
      }),
  }),

  berlinGrid: publicProcedure
    .input((val: unknown) => {
      const defaults = { year: 2024, month: 6, cellsPerRow: 80 };
      if (typeof val === "object" && val !== null) {
        return {
          year: "year" in val && typeof val.year === "number" ? val.year : defaults.year,
          month: "month" in val && typeof val.month === "number" ? val.month : defaults.month,
          cellsPerRow: "cellsPerRow" in val && typeof val.cellsPerRow === "number" ? val.cellsPerRow : defaults.cellsPerRow,
        };
      }
      return defaults;
    })
    .query(async ({ input }) => {
      const { getBerlinGridData } = await import("./db");
      return await getBerlinGridData(input.year, input.month, input.cellsPerRow);
    }),

  communityGrowth: router({
    getAll: publicProcedure.query(async () => {
      const { getAllCommunityGrowth } = await import("./db");
      return await getAllCommunityGrowth();
    }),
    getByCity: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "cityId" in val) {
          return val as { cityId: number };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getCommunityGrowthByCity } = await import("./db");
        return await getCommunityGrowthByCity(input.cityId);
      }),
  }),

  migrationEvents: router({
    getAll: publicProcedure.query(async () => {
      const { getAllMigrationEvents } = await import("./db");
      return await getAllMigrationEvents();
    }),
    getByCity: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "cityId" in val) {
          return val as { cityId: number };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getMigrationEventsByCity } = await import("./db");
        return await getMigrationEventsByCity(input.cityId);
      }),
  }),

  correlations: router({
    getCommunityImpact: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "cityId" in val) {
          return val as { cityId: number };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { calculateCommunityImpactCorrelations } = await import("./db");
        return await calculateCommunityImpactCorrelations(input.cityId);
      }),
  }),

  rentalPrices: router({
    getAll: publicProcedure.query(async () => {
      const { getAllRentalPrices } = await import("./db");
      return await getAllRentalPrices();
    }),
    getByCity: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "cityId" in val) {
          return val as { cityId: number };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getRentalPricesByCity } = await import("./db");
        return await getRentalPricesByCity(input.cityId);
      }),
  }),

  unemployment: router({
    getAll: publicProcedure.query(async () => {
      const { getAllUnemployment } = await import("./db");
      return await getAllUnemployment();
    }),
    getByCity: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "cityId" in val) {
          return val as { cityId: number };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getUnemploymentByCity } = await import("./db");
        return await getUnemploymentByCity(input.cityId);
      }),
  }),

  socialBenefits: router({
    getAll: publicProcedure.query(async () => {
      const { getAllSocialBenefits } = await import("./db");
      return await getAllSocialBenefits();
    }),
    getByCity: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "cityId" in val) {
          return val as { cityId: number };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getSocialBenefitsByCity } = await import("./db");
        return await getSocialBenefitsByCity(input.cityId);
      }),
  }),

  averageIncome: router({
    getAll: publicProcedure.query(async () => {
      const { getAllAverageIncome } = await import("./db");
      return await getAllAverageIncome();
    }),
    getByCity: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "cityId" in val) {
          return val as { cityId: number };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getAverageIncomeByCity } = await import("./db");
        return await getAverageIncomeByCity(input.cityId);
      }),
  }),

  taxBurden: router({
    getAll: publicProcedure.query(async () => {
      const { getAllTaxBurden } = await import("./db");
      return await getAllTaxBurden();
    }),
    getByCity: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "cityId" in val) {
          return val as { cityId: number };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getTaxBurdenByCity } = await import("./db");
        return await getTaxBurdenByCity(input.cityId);
      }),
  }),

  governmentDecisions: router({
    getAll: publicProcedure.query(async () => {
      const { getAllGovernmentDecisions } = await import("./db");
      return await getAllGovernmentDecisions();
    }),
    getByCountry: publicProcedure
      .input((val: unknown) => {
        if (typeof val === "object" && val !== null && "country" in val) {
          return val as { country: string };
        }
        throw new Error("Invalid input");
      })
      .query(async ({ input }) => {
        const { getGovernmentDecisionsByCountry } = await import("./db");
        return await getGovernmentDecisionsByCountry(input.country);
      }),
  }),

  heatMap: router({
    districtData: publicProcedure
      .input((val: unknown) => {
        if (val === undefined || val === null) return { city: "Berlin" };
        if (typeof val === "object" && "city" in val && typeof val.city === "string") {
          return val as { city: string };
        }
        return { city: "Berlin" };
      })
      .query(async ({ input }) => {
        const { getDistrictMapData } = await import("./db");
        return await getDistrictMapData(input.city);
      }),
    propertyPricesByYear: publicProcedure
      .input((val: unknown) => {
        if (val === undefined || val === null) return { city: "Berlin", year: 2024 };
        if (typeof val === "object" && "city" in val && "year" in val) {
          const city = typeof val.city === "string" ? val.city : "Berlin";
          const year = typeof val.year === "number" ? val.year : 2024;
          return { city, year };
        }
        return { city: "Berlin", year: 2024 };
      })
      .query(async ({ input }) => {
        const { getPropertyPricesForYear } = await import("./db");
        return await getPropertyPricesForYear(input.city, input.year);
      }),
    demographicsByYear: publicProcedure
      .input((val: unknown) => {
        if (val === undefined || val === null) return { city: "Berlin", year: 2024 };
        if (typeof val === "object" && "city" in val && "year" in val) {
          const city = typeof val.city === "string" ? val.city : "Berlin";
          const year = typeof val.year === "number" ? val.year : 2024;
          return { city, year };
        }
        return { city: "Berlin", year: 2024 };
      })
      .query(async ({ input }) => {
        const { getDemographicsForYear } = await import("./db");
        return await getDemographicsForYear(input.city, input.year);
      }),
  }),

                gridCells: router({
        getGrid: publicProcedure
            .input((val: unknown) => {
                if (typeof val === "object" && val !== null) {
                    const city = (val as any).city || "Berlin";
                    const zoomLevel = (val as any).zoomLevel || 12;
                    const bounds = (val as any).bounds || {};
                    return { city, zoomLevel, bounds };
                }
                return { city: "Berlin", zoomLevel: 12, bounds: {} };
            })
            .query(async ({ input }) => {
                const { getGridCells } = await import("./db");
                return await getGridCells(input.city, input.zoomLevel, input.bounds);
            }),
    }),
});

export type AppRouter = typeof appRouter;
