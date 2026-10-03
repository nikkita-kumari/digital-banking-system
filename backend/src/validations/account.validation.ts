import { z } from "zod";

export const createAccountSchema = z.object({
  accountType: z.enum(["SAVINGS", "CURRENT"]),
  currency: z.string().length(3).toUpperCase(),
});