import { supabase } from "./supabase";
import { handleMonthlyReset } from "./monthlyReset";

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/dashboard`
    }
  });
  if (error) throw error;
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


