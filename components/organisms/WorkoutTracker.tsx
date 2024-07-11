'use client';
import React, { useState } from 'react';
import ExerciseDiv from './ExerciseDiv';
import Button from '../atoms/Button';
import AddExerciseModal from './AddExerciseModal';
import { TrackedExercise } from '@/types';

const generateUniqueId = () => Math.random().toString(36).substr(2, 9)
// added to improve the ux of tracking a workout

const WorkoutTracker: React.FC = () => {
  const [exercises, setExercises] = useState<(TrackedExercise & {uniqueId: string})[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);



  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addExercise = (exerciseId: number, exerciseName: string) => {
    setExercises(prevExercises => [
      
      ...prevExercises, 
      { 
        id: exerciseId, 
        name: exerciseName,
      uniqueId: generateUniqueId()
     }
    ]);
    closeModal();
  };

  const deleteExercise = (uniqueId: string) => {
    console.log('Deleting exercise with uniqueId:', uniqueId);
    console.log('Before deletion:', exercises);
    setExercises(prevExercises => {
      const newExercises = prevExercises.filter(exercise => exercise.uniqueId !== uniqueId);
      console.log('After deletion:', newExercises);
      return newExercises;
    });
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
          key={exercise.uniqueId}
          index={index}
          onDelete={() => deleteExercise(exercise.uniqueId)} exercise={{
            id: exercise.id,
            name: exercise.name
          }}       
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