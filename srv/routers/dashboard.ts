import { router, publicProcedure } from "../trpc";
import { DuneClient } from "@duneanalytics/client-sdk";
import { z } from "zod";

const dune = new DuneClient(process.env.DUNE_API_KEY!);

export const dashboardRouter = router({
  getGlobalStats: publicProcedure.query(async () => {
    try {
      const queryResult = await dune.getLatestResult({ queryId: 4996314 });
      return {
        success: true,
        data: queryResult,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch data from Dune",
      };
    }
  }),
  getGraduatedtokens: publicProcedure.query(async () => {
    try {
      const queryResult = await dune.getLatestResult({ queryId: 5013312 });
      return {
        success: true,
        data: queryResult.result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch data from Dune",
      };
    }
  }),
  get24hVolume: publicProcedure.query(async () => {
    try {
      const query_result = await dune.getLatestResult({ queryId: 4996419 });
      return {
        success: true,
        data: query_result.result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch data from Dune",
      };
    }
  }),
  getTopLaunches: publicProcedure.query(async () => {
    try {
      const queryResult = await dune.getLatestResult({ queryId: 5013341 });
      return {
        success: true,
        data: queryResult.result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch data from Dune",
      };
    }
  }),
  getVolumeBrackets: publicProcedure.query(async () => {
    try {
      const queryResult = await dune.getLatestResult({ queryId: 5013376 });
      return {
        success: true,
        data: queryResult.result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch data from Dune",
      };
    }
  }),
  getchartdata: publicProcedure.query(async () => {
    try {
      const queryResult = await dune.getLatestResult({ queryId: 5013509 });
      return {
        success: true,
        data: queryResult.result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch data from Dune",
      };
    }
  }),
});
