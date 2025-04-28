# tRPC Server

This is a tRPC server built with Express and Bun.

## Getting Started

1. Install dependencies:

   ```
   bun install
   ```

2. Start the development server:
   ```
   bun dev
   ```

The server will run on http://localhost:3000 with the tRPC endpoint at http://localhost:3000/trpc.

## Integration with React

To use this tRPC server with your React application, follow these steps:

1. Install the required dependencies in your React project:

   ```
   npm install @trpc/client @trpc/react-query @tanstack/react-query zod
   ```

2. Create a `trpc.ts` file in your React project:

   ```typescript
   import { createTRPCReact } from "@trpc/react-query";
   import type { AppRouter } from "../path-to-server/routers";

   export const trpc = createTRPCReact<AppRouter>();
   ```

3. Set up the provider in your main component:

   ```typescript
   import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
   import { httpBatchLink } from "@trpc/client";
   import { useState } from "react";
   import { trpc } from "./trpc";

   function App() {
     const [queryClient] = useState(() => new QueryClient());
     const [trpcClient] = useState(() =>
       trpc.createClient({
         links: [
           httpBatchLink({
             url: "http://localhost:3000/trpc",
           }),
         ],
       })
     );

     return (
       <trpc.Provider client={trpcClient} queryClient={queryClient}>
         <QueryClientProvider client={queryClient}>
           {/* Your app components */}
         </QueryClientProvider>
       </trpc.Provider>
     );
   }
   ```

4. Use tRPC queries and mutations in your components:

   ```typescript
   import { trpc } from "./trpc";

   function UserList() {
     const usersQuery = trpc.user.getAll.useQuery();

     if (usersQuery.isLoading) return <div>Loading...</div>;
     if (usersQuery.error) return <div>Error: {usersQuery.error.message}</div>;

     return (
       <ul>
         {usersQuery.data.map((user) => (
           <li key={user.id}>{user.name}</li>
         ))}
       </ul>
     );
   }
   ```

## API Routes

The server includes the following tRPC procedures:

- `user.getAll` - Get all users
- `user.getById` - Get a user by ID
- `user.create` - Create a new user

## Type Safety

Since tRPC leverages TypeScript, you get end-to-end type safety between your server and client.
