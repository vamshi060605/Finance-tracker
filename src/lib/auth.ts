import { supabase } from "./supabase";

export async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) throw new Error(error.message);
}
  
export async function signInWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
}

export async function signUpWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
}
  
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
}

export async function getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
}

export async function updateProfile(name: string, avatar: string) {
    // Implement the logic to update the user's profile
    // This might involve making an API call to update the user data in your backend
    
}

