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

export const tokenRouter = router({
  getTokenInfo: publicProcedure
    .input(z.object({ tokenId: z.string() }))
    .query(async ({ input }) => {
      if (input.tokenId === "DitHyRMQiSDhn5cnKMJV2CDDt6sVct96YrECiM49pump") {
        try {
          if (shouldUseLocalData()) {
            const localData = readDataFromFile("getTokenInfo");
            if (localData) return localData;
          }

          const result = await fetchFromDune(5019005);
          saveDataToFile("getTokenInfo", result);
          return result;
        } catch (error) {
          return {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch token data from Dune",
          };
        }
      } else {
        return {
          success: false,
          error: "Token information not available",
        };
      }
    }),

  getTopHolders: publicProcedure
    .input(z.object({ tokenId: z.string() }))
    .query(async ({ input }) => {
      if (input.tokenId === "DitHyRMQiSDhn5cnKMJV2CDDt6sVct96YrECiM49pump") {
        try {
          if (shouldUseLocalData()) {
            const localData = readDataFromFile("getTopHolders");
            if (localData) return localData;
          }

          const result = await fetchFromDune(5018459);
          saveDataToFile("getTopHolders", result);
          return result;
        } catch (error) {
          return {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch top holders data from Dune",
          };
        }
      } else {
        return {
          success: false,
          error: "Top holders information not available",
        };
      }
    }),

  getPriceData: publicProcedure
    .input(z.object({ tokenId: z.string() }))
    .query(async ({ input }) => {
      if (input.tokenId === "DitHyRMQiSDhn5cnKMJV2CDDt6sVct96YrECiM49pump") {
        try {
          if (shouldUseLocalData()) {
            const localData = readDataFromFile("getPriceData");
            if (localData) return localData;
          }

          const queryResult = await dune.getLatestResult({ queryId: 5019108 });
          if (!queryResult.result?.rows) {
            return {
              success: false,
              error: "No price data available",
            };
          }
          const sortedData = queryResult.result.rows.sort(
            (a: any, b: any) =>
              new Date(a.block_time).getTime() -
              new Date(b.block_time).getTime()
          );
          const result = {
            success: true,
            data: {
              rows: sortedData,
              latestPrice: sortedData[sortedData.length - 1]?.price || 0,
            },
          };
          saveDataToFile("getPriceData", result);
          return result;
        } catch (error) {
          return {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch price data from Dune",
          };
        }
      } else {
        return {
          success: false,
          error: "Price data not available",
        };
      }
    }),
});
