'use client';

import React, { useState } from 'react';
import ExerciseDiv from './ExerciseDiv';
import Button from '../atoms/Button';  // Import your Button component

const WorkoutTracker: React.FC = () => {
  const [exercises, setExercises] = useState<number[]>([]);
  const [nextExerciseId, setNextExerciseId] = useState(1);

  const addExercise = () => {
    setExercises(prevExercises => [...prevExercises, nextExerciseId]);
    setNextExerciseId(prevId => prevId + 1);
  };

  const deleteExercise = (id: number) => {
    setExercises(prevExercises => prevExercises.filter(exerciseId => exerciseId !== id));
  };

  return (
    <div className="workout-tracker w-full">
      <Button 
        onClick={addExercise} 
        variant="primary"
        size="medium"
        className="mb-4"
      >
        Add Exercise
      </Button>
      {exercises.map((exerciseId) => (
        <ExerciseDiv 
          key={exerciseId} 
          id={exerciseId} 
          onDelete={() => deleteExercise(exerciseId)}
        />
      ))}
    </div>
  );
};

export default WorkoutTracker;