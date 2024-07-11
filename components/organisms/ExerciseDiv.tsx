'use client';

import React, { useState } from 'react';
import Button from '../atoms/Button';
import SetDiv from '../molecules/SetDiv';
import { Set, ExerciseProps } from '@/types';
import styles from '@/styles/organisms.module.css';

// Updated component props to include updateExerciseSet function
const ExerciseDiv: React.FC<ExerciseProps & { updateExerciseSet: (uniqueId: string, sets: Set[]) => void }> = 
  ({ index, exercise, onDelete, updateExerciseSet }) => {
  const [sets, setSets] = useState<Set[]>([]);

  const addSet = () => {
    const newSet: Set = {
      id: sets.length + 1,
      weight: 0,
      reps: 0
    };
    const updatedSets = [...sets, newSet];
    setSets(updatedSets);
    // Call updateExerciseSet to update the parent component
    updateExerciseSet(exercise.uniqueId, updatedSets);
  };

  const deleteSet = (setId: number) => {
    const updatedSets = sets.filter(set => set.id !== setId)
      .map((set, index) => ({ ...set, id: index + 1 }));
    setSets(updatedSets);
    // Call updateExerciseSet to update the parent component
    updateExerciseSet(exercise.uniqueId, updatedSets);
  };

  const updateSet = (id: number, weight: number, reps: number) => {
    const updatedSets = sets.map(set =>
      set.id === id ? { ...set, weight, reps } : set
    );
    setSets(updatedSets);
    // Call updateExerciseSet to update the parent component
    updateExerciseSet(exercise.uniqueId, updatedSets);
  };

  return (
    <div className={styles.exerciseContainer}>
      <div className={styles.exerciseIndex}>
        <span className={styles.exerciseIndexText}>{index + 1}</span>
      </div>
      <div className={styles.exerciseHeader}>
        <div className={styles.exerciseNameContainer}>
          <h2 className={styles.exerciseName}>{exercise.name}</h2>
        </div>
        <Button
          onClick={onDelete}
          variant="danger"
          size="small"
          className={styles.deleteExerciseButton}
        >
          Delete Exercise
        </Button>
      </div>
      <Button
        onClick={addSet}
        variant="secondary"
        size="small"
        className={styles.addSetButton}
      >
        Add Set
      </Button>
      <div className={styles.setsContainer}>
        {sets.map(set => (
          <SetDiv
            key={set.id}
            set={set}
            onDelete={deleteSet}
            onUpdate={updateSet}
          />
        ))}
      </div>
    </div>
  );
};

export default ExerciseDiv;