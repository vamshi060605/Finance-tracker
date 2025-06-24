// Application-wide constants for spending rules, transaction types, categories, and budget periods

export const SPENDING_RULES = {
  NEEDS_PERCENTAGE: 0.5,    // 50% for needs
  WANTS_PERCENTAGE: 0.3,    // 30% for wants
  SAVINGS_PERCENTAGE: 0.2   // 20% for savings
} as const;

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
} as const;

export const TRANSACTION_CATEGORIES = {
  NEEDS: 'needs',
  WANTS: 'wants',
  SAVINGS: 'savings',
  INCOME: 'income'
} as const;

export const BUDGET_PERIODS = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
} as const;
