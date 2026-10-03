import { z } from "zod";

export const depositSchema = z.object({
  amount: z.number().positive(),
});

export const withdrawSchema = z.object({
  amount: z.number().positive(),
});