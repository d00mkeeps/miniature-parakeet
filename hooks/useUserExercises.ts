import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { createClient } from '@/utils/supabase/client';

export interface Exercise {
  id: number;
  name: string;
  description: string | null;
  is_template: boolean;
}

export const useUserExercises = (fetchTemplatesOnly: boolean = false) => {
  const { userProfile } = useUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        let query = supabase.from('exercises').select('*');

        if (fetchTemplatesOnly) {
          query = query.eq('is_template', true);
        } else if (userProfile) {
          // Fetch both template exercises and user-specific exercises
          query = query.or(`is_template.eq.true,user_id.eq.${userProfile.user_id}`);
        } else {
          // If no user profile and not fetching templates only, just fetch templates
          query = query.eq('is_template', true);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (!data) {
          console.log('No data returned from Supabase');
          setExercises([]);
        } else {
          console.log('Exercises fetched:', data);
          setExercises(data as Exercise[]);
        }
      } catch (err) {
        console.error('Error in fetchExercises:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [userProfile, fetchTemplatesOnly]);

  return { exercises, loading, error };
};