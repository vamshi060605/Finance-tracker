import { supabase } from "./supabase"

// Fetch the current user’s profile (name & avatar)
export async function getUserProfile() {
  const { data: user, error } = await supabase.auth.getUser()
  if (error || !user?.user) return null

  const { data: profile, error: profileError } = await supabase
    .from("profiles") // Make sure you have a "profiles" table
    .select("name, avatar_url")
    .eq("id", user.user.id)
    .single()

  if (profileError) return null
  return profile
}

// Update user profile (name, avatar)
export async function updateProfile(name: string, avatar_url: string) {
  const { data: user, error: userError } = await supabase.auth.getUser()
  if (userError || !user?.user) throw new Error("User not authenticated.")

  const { data, error } = await supabase
    .from("profiles")
    .update({ name, avatar_url })
    .eq("id", user.user.id)

  if (error) throw new Error(error.message)
  return data
}
