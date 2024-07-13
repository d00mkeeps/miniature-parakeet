// useWorkoutTracker.ts
import { useState } from 'react';
import { TrackedExercise, Set } from '@/types';

const generateUniqueId = () => Math.random().toString(36).substr(2, 9);

export function useWorkoutTracker() {
  const [exercises, setExercises] = useState<TrackedExercise[]>([]);

  const addExercise = (exerciseId: number, exerciseName: string) => {
    setExercises(prevExercises => [
      ...prevExercises, 
      { 
        id: exerciseId, 
        name: exerciseName,
        uniqueId: generateUniqueId(),
        sets: []
      }
    ]);
  };

  const deleteExercise = (uniqueId: string) => {
    setExercises(prevExercises => prevExercises.filter(exercise => exercise.uniqueId !== uniqueId));
  };

  const updateExerciseSet = (uniqueId: string, sets: Set[]) => {
    setExercises(prevExercises => 
      prevExercises.map(exercise => 
        exercise.uniqueId === uniqueId ? { ...exercise, sets } : exercise
      )
    );
  };

  const submitWorkout = async () => {
    // Log the current state of exercises
    console.log(JSON.stringify(exercises, null, 2));


    
//Add better submission logic here


    // Clear out all exercises and sets
    setExercises([]);

    // Return the submitted data (you might want to return the server response instead)
    return exercises;
  };

  return {
    exercises,
    addExercise,
    deleteExercise,
    updateExerciseSet,
    submitWorkout,
  };
}