// Authentication and session management functions

import { supabase } from "./supabase";
import { handleMonthlyReset } from "./monthlyReset";

// Sign in using Google OAuth
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  });
  if (error) throw error;
}
  
// Sign in using email and password
export async function signInWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
}

// Sign up using email and password
export async function signUpWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
}
  
// Sign out the current user
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
}

// Get the currently authenticated user and initialize profile if needed
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error("Not authenticated");

  // Initialize user profile if doesn't exist
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    await supabase.from('profiles').insert({
      id: user.id,
      full_name: user.user_metadata.full_name || '',
      avatar: user.user_metadata.avatar_url || '/avatars/001.png',
      currency: 'USD'
    });

    // Initialize monthly allocation
    await handleMonthlyReset(user.id);
  }

  return user;
}

// Check authentication and redirect based on session state
export async function checkAuthAndRedirect(router: any, requireAuth = true) {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (!session && requireAuth) {
            router.replace('/');
            return null;
        }

        if (session && !requireAuth) {
            router.replace('/dashboard');
            return null;
        }

        return session;
    } catch (error) {
        console.error('Auth check error:', error);
        router.replace('/');
        return null;
    }
}


