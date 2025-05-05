import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { handleMonthlyReset } from '@/lib/monthlyReset';

export function useMonthlyBudget(userId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkAndResetMonthly = async () => {
      try {
        const today = new Date();
        const { data: lastReset } = await supabase
          .from('monthly_allocations')
          .select('created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (!lastReset || new Date(lastReset.created_at).getMonth() < today.getMonth()) {
          await handleMonthlyReset(userId);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to reset monthly budget'));
      } finally {
        setLoading(false);
      }
    };

    checkAndResetMonthly();
  }, [userId]);

  return { loading, error };
}
