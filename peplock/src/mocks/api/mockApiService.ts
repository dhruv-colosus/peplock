import { pumpFunMockData } from "../data/pumpFun";
import { goFundMeMockData } from "../data/goFundMe";

const ARTIFICIAL_DELAY_MS = 2000;

export type Provider = "pumpfun" | "gofundme";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApiService = {
  async fetchDashboardData(provider: Provider) {
    await delay(ARTIFICIAL_DELAY_MS);

    switch (provider) {
      case "pumpfun":
        return pumpFunMockData;
      case "gofundme":
        return goFundMeMockData;
      default:
        throw new Error("Invalid provider");
    }
  },
};
