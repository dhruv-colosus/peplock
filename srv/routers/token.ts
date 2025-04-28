import { router, publicProcedure } from "../trpc";
import { DuneClient } from "@duneanalytics/client-sdk";
import { z } from "zod";

const dune = new DuneClient(process.env.DUNE_API_KEY!);

export const tokenRouter = router({
  getTokenInfo: publicProcedure
    .input(z.object({ tokenId: z.string() }))
    .query(async ({ input }) => {
      // Hard coded check for the specific token ID
      if (input.tokenId === "DitHyRMQiSDhn5cnKMJV2CDDt6sVct96YrECiM49pump") {
        try {
          const queryResult = await dune.getLatestResult({ queryId: 5019005 });
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
      // Hard coded check for the specific token ID
      if (input.tokenId === "DitHyRMQiSDhn5cnKMJV2CDDt6sVct96YrECiM49pump") {
        try {
          const queryResult = await dune.getLatestResult({ queryId: 5018459 });
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
      // Hard coded check for the specific token ID
      if (input.tokenId === "DitHyRMQiSDhn5cnKMJV2CDDt6sVct96YrECiM49pump") {
        try {
          const queryResult = await dune.getLatestResult({ queryId: 5019108 });
          if (!queryResult.result?.rows) {
            return {
              success: false,
              error: "No price data available",
            };
          }
          // Sort the data by block_time in ascending order
          const sortedData = queryResult.result.rows.sort(
            (a: any, b: any) =>
              new Date(a.block_time).getTime() -
              new Date(b.block_time).getTime()
          );
          return {
            success: true,
            data: {
              rows: sortedData,
              latestPrice: sortedData[sortedData.length - 1]?.price || 0,
            },
          };
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
