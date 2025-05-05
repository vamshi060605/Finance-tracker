export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  app: {
    name: 'Finance Tracker',
    version: '1.0.0',
    currency: {
      default: 'USD',
      supported: ['USD', 'EUR', 'GBP', 'INR', 'JPY']
    },
    categories: {
      expense: ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Other'],
      income: ['Salary', 'Freelance', 'Investments', 'Other']
    }
  },
  theme: {
    defaultMode: 'system' as const,
    storageKey: 'theme-preference',
  }
};
