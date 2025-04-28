import { z } from "zod";
import { publicProcedure, router } from "../trpc";

// Sample user data
const users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
];

export const userRouter = router({
  // Get all users
  getAll: publicProcedure.query(() => {
    return users;
  }),

  // Get user by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const user = users.find((u) => u.id === input.id);
      if (!user) {
        throw new Error(`User with ID ${input.id} not found`);
      }
      return user;
    }),

  // Create a new user
  create: publicProcedure
    .input(z.object({ name: z.string().min(3) }))
    .mutation(({ input }) => {
      const newUser = {
        id: users.length + 1,
        name: input.name,
      };
      users.push(newUser);
      return newUser;
    }),
});
