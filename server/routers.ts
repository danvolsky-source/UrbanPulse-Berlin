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

  cities: router({
    list: publicProcedure.query(async () => {
      const { getCities } = await import("./db");
      return await getCities();
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
});

export type AppRouter = typeof appRouter;
