import { supabase } from './supabase';
import type { User, Transaction, Budget, SavingsGoal } from '@/types';

class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class APIClient {
  async getUser(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw new APIError(400, error.message, 'USER_FETCH_ERROR');
    return data;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .single();

    if (error) throw new APIError(400, error.message, 'USER_UPDATE_ERROR');
    return data;
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw new APIError(400, error.message, 'TRANSACTIONS_FETCH_ERROR');
    return data;
  }

  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) throw new APIError(400, error.message, 'TRANSACTION_CREATE_ERROR');
    return data;
  }

  // Add more methods as needed
}

export const api = new APIClient();
