import { router, publicProcedure } from "../trpc";
import { DuneClient } from "@duneanalytics/client-sdk";
import { z } from "zod";
import {
  saveDataToFile,
  readDataFromFile,
  shouldUseLocalData,
} from "../utils/dataStorage";

const dune = new DuneClient(process.env.DUNE_API_KEY!);

const fetchFromDune = async (queryId: number) => {
  const queryResult = await dune.getLatestResult({ queryId });
  return {
    success: true,
    data: queryResult.result,
  };
};

export const dashboardRouter = router({
  getGlobalStats: publicProcedure.query(async () => {
    try {
      if (shouldUseLocalData()) {
        const localData = readDataFromFile("getGlobalStats");
        if (localData) return localData;
      }

      const result = await fetchFromDune(4996314);
      saveDataToFile("getGlobalStats", result);
      return result;
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
      if (shouldUseLocalData()) {
        console.log("Using local data for getGlobalStats");

        const localData = readDataFromFile("getGraduatedtokens");
        if (localData) return localData;
      }

      const result = await fetchFromDune(5013312);
      saveDataToFile("getGraduatedtokens", result);
      return result;
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
      if (shouldUseLocalData()) {
        const localData = readDataFromFile("get24hVolume");
        if (localData) return localData;
      }

      const result = await fetchFromDune(4996419);
      saveDataToFile("get24hVolume", result);
      return result;
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
      if (shouldUseLocalData()) {
        const localData = readDataFromFile("getTopLaunches");
        if (localData) return localData;
      }

      const result = await fetchFromDune(5013341);
      saveDataToFile("getTopLaunches", result);
      return result;
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
      if (shouldUseLocalData()) {
        const localData = readDataFromFile("getVolumeBrackets");
        if (localData) return localData;
      }

      const result = await fetchFromDune(5013376);
      saveDataToFile("getVolumeBrackets", result);
      return result;
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
      if (shouldUseLocalData()) {
        const localData = readDataFromFile("getchartdata");
        if (localData) return localData;
      }

      const result = await fetchFromDune(5013509);
      saveDataToFile("getchartdata", result);
      return result;
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
