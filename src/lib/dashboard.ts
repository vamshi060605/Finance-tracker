// Aggregates dashboard data for the current user

import { supabase } from "./supabase";

// Fetches transactions, allocation, and profile for dashboard display
export async function getDashboardData(userId: string) {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [transactions, allocation, profile] = await Promise.all([
    supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', firstDayOfMonth.toISOString())
      .lte('date', lastDayOfMonth.toISOString()),
    
    supabase
      .from('monthly_allocations')
      .select('*')
      .eq('user_id', userId)
      .eq('month', firstDayOfMonth.toISOString().split('T')[0])
      .single(),
    
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
  ]);

  // Calculate monthly income and expenses
  const monthlyIncome = transactions.data
    ?.filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  const monthlyExpenses = transactions.data
    ?.filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  return {
    transactions: transactions.data || [],
    allocation: allocation.data,
    profile: profile.data,
    summary: {
      monthlyIncome,
      monthlyExpenses,
      balance: monthlyIncome - monthlyExpenses
    }
  };
}
