// API client class for interacting with Supabase tables

import { supabase } from './supabase';
import type { User, Transaction, Budget, SavingsGoal } from '@/types';

// Custom error class for API errors
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

// APIClient provides methods for user, transaction, and budget operations
export class APIClient {
  // Fetch a user profile by userId
  async getUser(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw new APIError(400, error.message, 'USER_FETCH_ERROR');
    return data;
  }

  // Update a user profile
  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .single();

    if (error) throw new APIError(400, error.message, 'USER_UPDATE_ERROR');
    return data;
  }

  // Fetch all transactions for a user
  async getTransactions(userId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw new APIError(400, error.message, 'TRANSACTIONS_FETCH_ERROR');
    return data;
  }

  // Create a new transaction
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

// Export a singleton API client instance
export const api = new APIClient();
