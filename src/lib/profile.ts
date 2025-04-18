import { supabase } from "./supabase";

// Get user profile by user ID
export async function getUserProfile(userId: string) {
  if (!userId) throw new Error("User ID is required.");

  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, preferred_currency")
    .eq("id", userId)
    .single();

  if (error) throw new Error(error.message);

  return {
    name: data.full_name,
    currency: data.preferred_currency
  };
}

// Update user profile fields
export async function updateUserProfile(userId: string, updates: {
  name?: string;
  currency?: string;
}) {
  if (!userId) throw new Error("User ID is required.");

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: updates.name,
      preferred_currency: updates.currency
    })
    .eq("id", userId);

  if (error) throw new Error(error.message);
}

