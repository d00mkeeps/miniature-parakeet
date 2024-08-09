import { useState, useCallback } from 'react';
import { TrackedExercise, Set } from '@/types';
import { uploadWorkout } from '@/utils/supabaseFunctions/workoutFunctions';

const generateUniqueId = () => Math.random().toString(36).substr(2, 9);

export function useWorkoutTracker(userId: number) {
  const [exercises, setExercises] = useState<TrackedExercise[]>([]);

  const addExercise = useCallback((exerciseId: number, exerciseName: string) => {
    setExercises(prevExercises => [
      ...prevExercises, 
      { 
        id: exerciseId, 
        name: exerciseName,
        uniqueId: generateUniqueId(),
        sets: []
      }
    ]);
  }, []);

  const deleteExercise = useCallback((uniqueId: string) => {
    setExercises(prevExercises => prevExercises.filter(exercise => exercise.uniqueId !== uniqueId));
  }, []);

  const updateExerciseSet = useCallback((uniqueId: string, sets: Set[]) => {
    setExercises(prevExercises => 
      prevExercises.map(exercise => 
        exercise.uniqueId === uniqueId ? { ...exercise, sets } : exercise
      )
    );
  }, []);

  const submitWorkout = useCallback(async (workoutName: string, workoutDescription: string) => {
    if (!userId) {
      console.error('User ID is undefined!')
      throw new Error('User ID is required to submit a workout.')
    }
    try {
      const workoutId = await uploadWorkout(userId, exercises, workoutName, workoutDescription);
      console.log('Workout uploaded successfully, ID:', workoutId);
      setExercises([]); // Clear exercises after successful upload
      return workoutId;
    } catch (error) {
      console.error('Failed to upload workout:', error);
      throw error;
    }
  }, [userId, exercises]);

  return {
    exercises,
    addExercise,
    deleteExercise,
    updateExerciseSet,
    submitWorkout,
  };
}