import { supabase } from "./supabase";
import { updateSpending } from "./budget";
import type { TransactionInput } from "./validations/transaction";

export interface Transaction {
  id: string;
  amount: number;
  description: string;  // Make it required, not optional
  category: string;
  date: string;
  type: 'income' | 'expense';
  userId: string;
}

export async function getTransactions(userId: string): Promise<{ data: Transaction[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function addTransaction(transaction: Omit<Transaction, 'id'>): Promise<{ data: Transaction | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateTransaction(id: number, updates: Partial<Transaction>): Promise<{ data: Transaction | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('transactions')
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

export async function deleteTransaction(id: number): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    return { error };
  }
}

export async function createTransaction(
  userId: string,
  transaction: TransactionInput
) {
  const { error } = await supabase
    .from('transactions')
    .insert({
      ...transaction,
      user_id: userId,
      amount: Number(transaction.amount),
      created_at: new Date().toISOString()
    });

  if (error) throw error;

  // Update monthly allocation if it's an expense
  if (transaction.type === 'expense' && 
      (transaction.category === 'needs' || 
       transaction.category === 'wants' || 
       transaction.category === 'savings')) {
    await updateSpending(
      userId,
      transaction.category,
      Number(transaction.amount)
    );
  }
}

export async function getTransactionsByPeriod(
  userId: string,
  startDate: string,
  endDate: string
) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}
