'use client';
import React, { useState } from 'react';
import ExerciseDiv from '../../exercise/organisms/ExerciseDiv';
import Button from '@/components/public/atoms/Button';
import AddExerciseModal from '../../exercise/organisms/AddExerciseModal';
import { useWorkoutTracker } from '@/hooks/useWorkoutTracker';
import styles from '@/styles/molecules.module.css';
import { useUser } from '@/context/UserContext';
const WorkoutTracker: React.FC = () => {
  const { userProfile } = useUser();
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Early return if no user profile
  if (!userProfile) {
    return <div>Loading user profile... Please wait or try refreshing the page.</div>;
  }

  const { exercises, addExercise, deleteExercise, updateExerciseSet, submitWorkout } = useWorkoutTracker(userProfile.user_id);

  const handleAddExercise = (exerciseId: number, exerciseName: string) => {
    addExercise(exerciseId, exerciseName);
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!workoutDescription.trim()) {
      alert('Please provide a workout description.');
      return;
    }
    try {
      await submitWorkout(workoutName, workoutDescription);
      alert('Workout submitted successfully!');
      setWorkoutName('');
      setWorkoutDescription('');
    } catch (error) {
      alert('Failed to submit workout. Please try again.');
    }
  };

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  return (
    <div className="workout-tracker w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-grow mr-4">
          <input
            type="text"
            placeholder="Workout Name (required)"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className={styles.input}
          />
        </div>
        <Button
          onClick={openModal}
          variant="primary"
          size="medium"
        >
          Add Exercise
        </Button>
      </div>
      <textarea
        placeholder="Workout Description (optional)"
        value={workoutDescription}
        onChange={(e) => setWorkoutDescription(e.target.value)}
        className={styles.descriptiontextarea}
        rows={3}
      />
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
          disabled={!workoutName.trim()}
        >
          Submit Workout
        </Button>
      </div>
    </div>
  );
};

export default WorkoutTracker;