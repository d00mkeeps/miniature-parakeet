'use client'

import React, {createContext, useContext, useState, useEffect, useCallback} from 'react'
import {createClient} from '@/utils/supabase/client'
import { useUser } from './UserContext'

export interface ProgramWorkout {
    id: string
    name: string
    description: string
}

interface UserWorkoutsContextType {
    workouts: ProgramWorkout[]
    loading: boolean
    error: Error | null
    refreshWorkouts: () => Promise<void>
}

const UserProgramWorkoutsContext = createContext<UserWorkoutsContextType | undefined>(undefined);

export const UserWorkoutsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<ProgramWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();
  const { userProfile } = useUser();

  const fetchWorkouts = useCallback(async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('program_workouts')
        .select('*')
        .eq('user_id', userProfile.auth_user_uuid);

      if (error) throw error;

      setWorkouts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [userProfile, supabase]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const refreshWorkouts = useCallback(async () => {
    await fetchWorkouts();
  }, [fetchWorkouts]);

  return (
    <UserProgramWorkoutsContext.Provider value={{ workouts, loading, error, refreshWorkouts }}>
      {children}
    </UserProgramWorkoutsContext.Provider>
  );
};

export const useUserProgramWorkouts = () => {
  const context = useContext(UserProgramWorkoutsContext);
  if (context === undefined) {
    throw new Error('useUserWorkouts must be used within a UserWorkoutsProvider');
  }
  return context;
};