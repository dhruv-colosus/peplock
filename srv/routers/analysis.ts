import { router, publicProcedure } from "../trpc";
import { DuneClient } from "@duneanalytics/client-sdk";
import { z } from "zod";

const dune = new DuneClient(process.env.DUNE_API_KEY!);

export const analysisRouter = router({
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

  getRiskyTokens: publicProcedure.query(async () => {
    try {
      // Fetch the same data as getTopLaunches
      const queryResult = await dune.getLatestResult({ queryId: 5013341 });

      if (!queryResult.result || !queryResult.result.rows) {
        return {
          success: false,
          error: "No data returned from Dune query",
        };
      }

      // Map and analyze tokens based on percentage change
      const tokens = queryResult.result.rows.map((token: any) => {
        const priceChangePct = parseFloat(token.price_change_pct);
        const walletConcentration = token.pct_supply_top10_wallets
          ? parseFloat(token.pct_supply_top10_wallets)
          : 0;

        let riskReason = "";

        // Assign risk reason based on percentage change
        if (!isNaN(priceChangePct)) {
          if (priceChangePct > 1000) {
            riskReason = "Token likely being pumped, risk of being rugged";
          } else if (priceChangePct < -90) {
            riskReason = "Rugged, liquidity pulled";
          }
        }

        // Check for wallet concentration
        if (!isNaN(walletConcentration) && walletConcentration > 90) {
          // If there's already a risk reason, add an additional one
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

      // Filter to only include tokens with an assigned risk reason
      const riskyTokens = tokens.filter((token) => token.riskReason !== "");

      return {
        success: true,
        data: {
          totalRiskyTokens: riskyTokens.length,
          riskyTokens,
        },
      };
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
        const queryResult = await dune.getLatestResult({ queryId: 5046420 });
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
              : "Failed to fetch volume data from Dune",
        };
      }
    }),
});
