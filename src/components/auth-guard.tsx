import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace('/');
      } else {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
