import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../srv/routers";

export const trpc = createTRPCReact<AppRouter>();
