import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";

const app = express();
const port = process.env.PORT || 3003;

// Middleware
app.use(express.json());
app.use(cors());

// Regular Express endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from Bun Express server!" });
});

// tRPC endpoint
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`tRPC available at http://localhost:${port}/trpc`);
});
