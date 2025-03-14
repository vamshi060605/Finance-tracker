import { supabase } from "./supabase";

// Update user profile (name, avatar)
export async function updateProfile(name: string, avatar_url: string) {
  const { data, error } = await supabase.auth.updateUser({
    data: { name, avatar_url }
  });

  if (error) throw new Error(error.message);
  return data;
}
