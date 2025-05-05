import { supabase } from "./supabase";
import type { MonthlyAllocation } from "@/types";

export async function handleMonthlyReset(userId: string) {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  try {
    // Get previous month's allocation
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const { data: prevAllocation } = await supabase
      .from('monthly_allocations')
      .select('*')
      .eq('user_id', userId)
      .eq('month', prevMonth.toISOString().split('T')[0])
      .single();

    // Calculate total income and expenses
    const { data: monthData } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', prevMonth.toISOString().split('T')[0])
      .lt('date', firstDayOfMonth.toISOString().split('T')[0]);

    const income = monthData
      ?.filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0) || 0;

    const expenses = {
      needs: monthData?.filter(t => t.category === 'needs').reduce((sum, t) => sum + t.amount, 0) || 0,
      wants: monthData?.filter(t => t.category === 'wants').reduce((sum, t) => sum + t.amount, 0) || 0,
      savings: monthData?.filter(t => t.category === 'savings').reduce((sum, t) => sum + t.amount, 0) || 0
    };

    // Create snapshot
    await supabase.from('monthly_snapshots').insert({
      user_id: userId,
      month: prevMonth.getMonth() + 1,
      year: prevMonth.getFullYear(),
      total_income: income,
      total_expenses: expenses.needs + expenses.wants + expenses.savings,
      needs_balance: expenses.needs,
      wants_balance: expenses.wants,
      savings_balance: expenses.savings
    });

    // Create new allocation
    await supabase.from('monthly_allocations').insert({
      user_id: userId,
      month: firstDayOfMonth.toISOString().split('T')[0],
      needs_budget: income * 0.5,
      wants_budget: income * 0.3,
      savings_budget: income * 0.2,
      spent_needs: 0,
      spent_wants: 0,
      spent_savings: 0
    });

  } catch (error) {
    console.error('Monthly reset error:', error);
    throw error;
  }
}
