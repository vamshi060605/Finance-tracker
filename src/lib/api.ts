// API utility functions for fetching allocations and transactions

import { supabase } from "./supabase";
import type { Transaction, MonthlyAllocation } from "@/types";

// Get current month's allocation for a user
export async function getCurrentMonthAllocation(userId: string): Promise<MonthlyAllocation | null> {
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  
  const { data, error } = await supabase
    .from('monthly_allocations')
    .select('*')
    .eq('user_id', userId)
    .eq('month', firstDayOfMonth.toISOString().split('T')[0])
    .single();

  if (error) throw error;
  return data;
}

// Get all transactions for the current month for a user
export async function getCurrentMonthTransactions(userId: string): Promise<Transaction[]> {
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('date', firstDayOfMonth.toISOString().split('T')[0])
    .lt('date', new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 1).toISOString())
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}
