import { z } from "zod";

export const depositSchema = z.object({
  amount: z.number().positive(),
});

export const withdrawSchema = z.object({
  amount: z.number().positive(),
});

export const transferSchema = z.object({
  toAccountId: z.string().min(1, "Destination account ID is required"),
  amount: z.number().positive("Amount must be greater than 0"),
});