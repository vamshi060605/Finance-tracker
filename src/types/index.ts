// Shared TypeScript interfaces for user, transaction, budget, and related entities

export interface User {
  // User profile information
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  preferred_currency?: string;
  theme?: 'light' | 'dark' | 'system';
}

export interface Transaction {
  // Transaction record
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
  // Budget record for a category and period
  id: string;
  user_id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  spent?: number;
  remaining?: number;
}

export interface SavingsGoal {
  // Savings goal definition
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface MonthlyAllocation {
  // Monthly allocation for needs, wants, and savings
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
