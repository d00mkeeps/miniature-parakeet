// WorkoutTracker.tsx
'use client';
import React, { useState } from 'react';
import ExerciseDiv from '../exercise/ExerciseDiv';
import Button from '@/components/atoms/Button';
import AddExerciseModal from '../exercise/AddExerciseModal';
import { useWorkoutTracker } from '@/hooks/useWorkoutTracker';

const WorkoutTracker: React.FC = () => {
  const userId = 1 //use the usercontext to grab the actual user id
  const { exercises, addExercise, deleteExercise, updateExerciseSet, submitWorkout } = useWorkoutTracker(userId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddExercise = (exerciseId: number, exerciseName: string) => {
    addExercise(exerciseId, exerciseName);
    closeModal();
  };

  const handleSubmit = async () => {
    try {
      await submitWorkout();
      alert('Workout submitted successfully!');
    } catch (error) {
      alert('Failed to submit workout. Please try again.');
    }
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