import { supabase } from "./supabase";
import { Profile as DatabaseProfile } from '@/types/database';

export interface ProfileResponse {
  data: {
    name: string;
    currency: string;
    avatar: string;
  } | null;
  error: any | null;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar: string | null;
  preferred_currency: string; // Changed from currency to preferred_currency
  created_at: string;
}

// Get user profile by user ID
export async function getUserProfile(userId: string): Promise<Profile | null> {
  if (!userId) throw new Error("User ID is required");
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
}

export async function updateUserProfile(userId: string, updates: {
  full_name?: string;
  preferred_currency?: string;
  avatar?: string;
}) {
  if (!userId) throw new Error("User ID is required");
  try {
    const cleanUpdates: Record<string, any> = {};
    // Only include allowed fields
    if (updates.full_name !== undefined) cleanUpdates.full_name = updates.full_name;
    if (updates.avatar !== undefined) cleanUpdates.avatar = updates.avatar;
    if (updates.preferred_currency !== undefined) {
      cleanUpdates.preferred_currency = updates.preferred_currency;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(cleanUpdates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
}

export async function updateProfile(userId: string, updates: {
  full_name?: string;
  preferred_currency?: string;
  avatar?: string;
  monthly_income?: number;
  budget_alerts?: boolean;
}) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      monthly_allocations!monthly_allocations_user_id_fkey(
        needs_budget,
        wants_budget,
        savings_budget,
        spent_needs,
        spent_wants,
        spent_savings
      )
    `)
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

