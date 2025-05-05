import { supabase } from './supabase';
import { SPENDING_RULES } from "@/config/constants";
import type { MonthlyAllocation } from "@/types/database";

export type Budget = {
  id: number;
  user_id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'yearly';
  created_at?: string;
}

export async function getBudgets(userId: string): Promise<{ data: Budget[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function addBudget(budget: Omit<Budget, 'id'>): Promise<{ data: Budget | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('budgets')
      .insert(budget)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateBudget(id: number, updates: Partial<Budget>): Promise<{ data: Budget | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('budgets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function initializeMonthlyBudget(userId: string, income: number) {
  const now = new Date();
  const month = now.toISOString().split('T')[0];

  const allocation = {
    user_id: userId,
    month,
    needs_budget: income * SPENDING_RULES.NEEDS_PERCENTAGE,
    wants_budget: income * SPENDING_RULES.WANTS_PERCENTAGE,
    savings_budget: income * SPENDING_RULES.SAVINGS_PERCENTAGE,
    spent_needs: 0,
    spent_wants: 0,
    spent_savings: 0,
  };

  const { error } = await supabase
    .from('monthly_allocations')
    .upsert(allocation);

  if (error) throw error;
  return allocation;
}

export async function updateSpending(
  userId: string,
  category: 'needs' | 'wants' | 'savings',
  amount: number
) {
  const now = new Date();
  const month = now.toISOString().split('T')[0];

  const { error } = await supabase
    .from('monthly_allocations')
    .update({
      [`spent_${category}`]: supabase.rpc('increment', { amount })
    })
    .eq('user_id', userId)
    .eq('month', month);

  if (error) throw error;
}
