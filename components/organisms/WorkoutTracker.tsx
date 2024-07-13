// WorkoutTracker.tsx
'use client';
import React, { useState } from 'react';
import ExerciseDiv from './ExerciseDiv';
import Button from '../atoms/Button';
import AddExerciseModal from './AddExerciseModal';
import { useWorkoutTracker } from '@/hooks/useWorkoutTracker';

const WorkoutTracker: React.FC = () => {
  const { exercises, addExercise, deleteExercise, updateExerciseSet, submitWorkout } = useWorkoutTracker();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddExercise = (exerciseId: number, exerciseName: string) => {
    addExercise(exerciseId, exerciseName);
    closeModal();
  };

  const handleSubmit = async () => {
    const submittedData = await submitWorkout();
    // You can do something with submittedData if needed
    setTimeout(() => {alert("Workout submitted and cleared!");}, 33);
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
          exerciseId={exercise.id}
          uniqueId={exercise.uniqueId}
          onDelete={deleteExercise}
          updateExerciseSet={updateExerciseSet}
        />
      ))}
      <AddExerciseModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleAddExercise}
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