import { z } from "zod";

export const transactionSchema = z.object({
  description: z.string().min(1, "Name is required"),
  amount: z.string().min(1, "Amount is required").regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  type: z.enum(["income", "expense"]),
  category: z.enum(["needs", "wants", "savings"]).nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  currency: z.string().min(1, "Currency is required"),
  theme: z.enum(["light", "dark", "system"]),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
