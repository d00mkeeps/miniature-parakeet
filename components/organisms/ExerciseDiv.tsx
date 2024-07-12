import React, { useState } from 'react';
import Button from '../atoms/Button';
import SetDiv from '../molecules/SetDiv';
import { Set, ExerciseProps } from '@/types';
import styles from '@/styles/organisms.module.css';
import { useUserExercises } from '@/context/UserExercisesContext'; // Adjust the import path as necessary

const ExerciseDiv: React.FC<ExerciseProps & { updateExerciseSet: (uniqueId: string, sets: Set[]) => void }> = 
  ({ index, exerciseId, uniqueId, onDelete, updateExerciseSet }) => {
  
  const { exercises } = useUserExercises();
  const exercise = exercises.find(ex => ex.id === exerciseId);

  console.log('Full exercise data from context:', exercise);

  const [sets, setSets] = useState<Set[]>([]);

  if (!exercise) {
    return <div>Exercise not found</div>;
  }

  const addSet = () => {
    const newSet: Set = {
      id: sets.length + 1,
      weight: 0,
      reps: 0,
      duration: 0,
      distance: 0
    };
    const updatedSets = [...sets, newSet];
    setSets(updatedSets);
    updateExerciseSet(uniqueId, updatedSets);
  };

  const deleteSet = (setId: number) => {
    const updatedSets = sets.filter(set => set.id !== setId)
      .map((set, index) => ({ ...set, id: index + 1 }));
    setSets(updatedSets);
    updateExerciseSet(uniqueId, updatedSets);
  };

  const updateSet = (id: number, weight: number, reps: number, duration: number, distance: number) => {
    const updatedSets = sets.map(set =>
      set.id === id ? { ...set, weight, reps, duration, distance } : set
    );
    setSets(updatedSets);
    updateExerciseSet(uniqueId, updatedSets);
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
          onClick={() => onDelete(uniqueId)}
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
            exerciseProps={{
              tracks_weight: exercise.tracks_weight,
              tracks_reps: exercise.tracks_reps,
              tracks_duration: exercise.tracks_duration,
              tracks_distance: exercise.tracks_distance,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ExerciseDiv;