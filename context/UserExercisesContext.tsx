'use client'

import React, {createContext, useContext, useState, useEffect} from 'react'
import { useUser } from './UserContext'
import { createClient } from '@/utils/supabase/client'
import {Exercise, UserExercisesContextType} from '@/types'

const UserExercisesContext = createContext<UserExercisesContextType | undefined>(undefined)

export const UserExercisesProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { userProfile } = useUser();
  const supabase = createClient();

const fetchExercises =  async (fetchTemplatesOnly: boolean = false) => {
    setLoading(true);
    try {
      let query = supabase.from('exercises').select('*');

      if (fetchTemplatesOnly) {
        query = query.eq('is_template', true);
      } else if (userProfile) {
        query = query.or(`is_template.eq.true,user_id.eq.${userProfile.user_id}`);
      } else {
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

  useEffect(() => {
    fetchExercises()
  }, [userProfile])

  return (
    <UserExercisesContext.Provider value={{exercises, loading, error, refetchExercises: fetchExercises}}>
        {children}
    </UserExercisesContext.Provider>
  )
}

export const useUserExercises = () => {
    const context = useContext(UserExercisesContext)
    if (context === undefined) {
        throw new Error('useUserExercises must be used within a UserExercisesProvider')
    }
    return context
}