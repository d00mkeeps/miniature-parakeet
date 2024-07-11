'use client';
import React, { useState } from 'react';
import ExerciseDiv from './ExerciseDiv';
import Button from '../atoms/Button';
import AddExerciseModal from './AddExerciseModal';
import { TrackedExercise, Set } from '@/types';

const generateUniqueId = () => Math.random().toString(36).substr(2, 9);

const WorkoutTracker: React.FC = () => {
  const [exercises, setExercises] = useState<TrackedExercise[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
    closeModal();
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

  const handleSubmit = () => {
    // Log the current state of exercises
    console.log(JSON.stringify(exercises, null, 2));

    // Clear out all exercises and sets
    setExercises([]);

    // Optionally, you can add some user feedback here, like an alert or a toast notification
    setTimeout(() => {alert("Workout submitted and cleared!");}, 33)
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
          onDelete={() => deleteExercise(exercise.uniqueId)}
          exercise={{
            id: exercise.id,
            name: exercise.name,
            uniqueId: exercise.uniqueId
          }}
          updateExerciseSet={updateExerciseSet}
        />
      ))}
      <AddExerciseModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={addExercise}
      />
      <div className=''> 
      <Button
        onClick={handleSubmit}
        variant="secondary"
        size="large"
        className="mt-4 w-full"
      >
        Submit Workout
      </Button>
      </div>
    </div>
  );
};

export default WorkoutTracker;