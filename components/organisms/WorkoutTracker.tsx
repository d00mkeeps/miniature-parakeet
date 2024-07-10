'use client';
import React, { useState } from 'react';
import ExerciseDiv from './ExerciseDiv';
import Button from '../atoms/Button';
import AddExerciseModal from './AddExerciseModal';

const WorkoutTracker: React.FC = () => {
  const [exercises, setExercises] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addExercise = (exerciseId: number) => {
    setExercises(prevExercises => [...prevExercises, exerciseId]);
    closeModal();
  };

  const deleteExercise = (id: number) => {
    setExercises(prevExercises => prevExercises.filter(exerciseId => exerciseId !== id));
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
      {exercises.map((exerciseId) => (
        <ExerciseDiv
          key={exerciseId}
          id={exerciseId}
          onDelete={() => deleteExercise(exerciseId)}
        />
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