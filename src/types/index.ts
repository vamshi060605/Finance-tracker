export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  preferred_currency?: string;
  theme?: 'light' | 'dark' | 'system';
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description?: string;
  date: string;
  payment_method?: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  spent?: number;
  remaining?: number;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface MonthlyAllocation {
  id: string;
  user_id: string;
  month: string;
  needs_budget: number;
  wants_budget: number;
  savings_budget: number;
  spent_needs: number;
  spent_wants: number;
  spent_savings: number;
  created_at: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
