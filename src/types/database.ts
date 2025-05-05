export interface MonthlySnapshot {
  id: string
  user_id: string
  month: number
  year: number
  needs_balance: number
  wants_balance: number
  savings_balance: number
  total_expenses: number
  total_income: number
  created_at: string
}

export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  avatar: string | null
  currency: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'income' | 'expense';
  category: 'needs' | 'wants' | 'savings' | 'income';
  description: string | null;
  date: string;
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
  updated_at: string;
}
