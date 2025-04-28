import { router } from "../trpc";
import { userRouter } from "./user";
import { dashboardRouter } from "./dashboard";
import { analysisRouter } from "./analysis";
import { tokenRouter } from "./token";

export const appRouter = router({
  user: userRouter,
  dashboard: dashboardRouter,
  analysis: analysisRouter,
  token: tokenRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
