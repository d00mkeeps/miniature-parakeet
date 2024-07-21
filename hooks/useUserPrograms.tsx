// hooks/useUserPrograms.ts
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/utils/supabase/client';
import { Program } from '@/types';

export const useUserPrograms = () => {
  const { userProfile } = useUser();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  const fetchPrograms = useCallback(async () => {
    if (!userProfile) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('user_id', userProfile.user_id);

      if (error) throw error;

      setPrograms(data || []);
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  return { programs, loading, error, refetch: fetchPrograms };
};