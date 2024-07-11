'use client';
import React, { useState } from 'react';
import ExerciseDiv from './ExerciseDiv';
import Button from '../atoms/Button';
import AddExerciseModal from './AddExerciseModal';
import { TrackedExercise } from '@/types';

const WorkoutTracker: React.FC = () => {
  const [exercises, setExercises] = useState<TrackedExercise[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);



  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addExercise = (exerciseId: number, exerciseName: string) => {
    setExercises(prevExercises => [...prevExercises, { id: exerciseId, name: exerciseName }]);
    closeModal();
  };

  const deleteExercise = (id: number) => {
    setExercises(prevExercises => prevExercises.filter(exercise => exercise.id !== id));
  };

  return (
    <div className="workout-tracker w-full">
      <Button
        onClick={openModal}
        variant="primary"
        size="medium"
        className="mb-4"
      >
        Add Exercise
      </Button>
      {exercises.map((exercise, index) => (
        <ExerciseDiv
          key={exercise.id}
          index={index}
          onDelete={() => deleteExercise(exercise.id)} exercise={{
            id: 0,
            name: exercise.name
          }}        />
      ))}
      <AddExerciseModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={addExercise}
      />
    </div>
  );
};

export default WorkoutTracker;