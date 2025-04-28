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

export const analysisRouter = router({
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

  getRiskyTokens: publicProcedure.query(async () => {
    try {
      if (shouldUseLocalData()) {
        const localData = readDataFromFile("getRiskyTokens");
        if (localData) return localData;
      }

      const queryResult = await dune.getLatestResult({ queryId: 5013341 });

      if (!queryResult.result || !queryResult.result.rows) {
        return {
          success: false,
          error: "No data returned from Dune query",
        };
      }

      const tokens = queryResult.result.rows.map((token: any) => {
        const priceChangePct = parseFloat(token.price_change_pct);
        const walletConcentration = token.pct_supply_top10_wallets
          ? parseFloat(token.pct_supply_top10_wallets)
          : 0;

        let riskReason = "";

        if (!isNaN(priceChangePct)) {
          if (priceChangePct > 1000) {
            riskReason = "Token likely being pumped, risk of being rugged";
          } else if (priceChangePct < -90) {
            riskReason = "Rugged, liquidity pulled";
          }
        }

        if (!isNaN(walletConcentration) && walletConcentration > 90) {
          if (riskReason) {
            riskReason += " & High top wallet concentration";
          } else {
            riskReason = "High top wallet concentration";
          }
        }

        return {
          symbol: token.symbol,
          address: token.token_address,
          priceChangePct: !isNaN(priceChangePct) ? priceChangePct : 0,
          walletConcentration: !isNaN(walletConcentration)
            ? walletConcentration
            : 0,
          riskReason,
        };
      });

      const riskyTokens = tokens.filter((token) => token.riskReason !== "");

      const result = {
        success: true,
        data: {
          totalRiskyTokens: riskyTokens.length,
          riskyTokens,
        },
      };
      saveDataToFile("getRiskyTokens", result);
      return result;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze risky tokens",
      };
    }
  }),

  getTokenVolume: publicProcedure
    .input(z.object({ tokenId: z.string() }))
    .query(async ({ input }) => {
      try {
        if (shouldUseLocalData()) {
          const localData = readDataFromFile("getTokenVolume");
          if (localData) return localData;
        }

        const result = await fetchFromDune(5046420);
        saveDataToFile("getTokenVolume", result);
        return result;
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch volume data from Dune",
        };
      }
    }),
});
