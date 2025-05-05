import { z } from 'zod';
import { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from '@/config/constants';

export const transactionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.string().min(1, 'Amount is required')
    .refine(val => !isNaN(Number(val)), 'Must be a valid number')
    .refine(val => Number(val) > 0, 'Amount must be greater than 0'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
  type: z.enum([TRANSACTION_TYPES.INCOME, TRANSACTION_TYPES.EXPENSE]),
  category: z.enum([
    TRANSACTION_CATEGORIES.NEEDS,
    TRANSACTION_CATEGORIES.WANTS, 
    TRANSACTION_CATEGORIES.SAVINGS,
    TRANSACTION_CATEGORIES.INCOME
  ])
});

export type TransactionInput = z.infer<typeof transactionSchema>;
