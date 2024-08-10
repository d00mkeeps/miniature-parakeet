import React, { useState } from 'react';
import { useWorkoutFunctions } from '@/utils/supabaseFunctions/programFunctions';
import { moleculeStyles } from '@/styles';
import Button from '@/components/public/atoms/Button';
import { useUserProgramWorkouts } from '@/context/ProgramWorkoutContext';

interface AddWorkoutModalProps {
  programId: string ;
  isOpen: boolean;
  onClose: () => void;
}

export const AddWorkoutModal: React.FC<AddWorkoutModalProps> = ({ programId, isOpen, onClose }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const { addWorkoutToProgram } = useWorkoutFunctions();
  const { refreshWorkouts } = useUserProgramWorkouts()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addWorkoutToProgram(programId, workoutName,
      workoutDescription);
      await refreshWorkouts()
      onClose();
    } catch (error) {
      console.error('Failed to add workout:', error);
      // You might want to show an error message to the user here
    }
  };

  if (!isOpen) return null;

  return (
    <div className={moleculeStyles.modalOverlay}>
      <div className={moleculeStyles.modalContent}>
      <div className={moleculeStyles.modal}>
        <h2
        className={moleculeStyles.modalTitle}>Add New Workout</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="Workout Name"
            required
            className={moleculeStyles.input}
          />
          <div></div>
          <textarea
            value={workoutDescription}
            onChange={(e) => setWorkoutDescription(e.target.value)}
            placeholder="Workout Description"
            className={moleculeStyles.descriptiontextarea}

          />
          <div
          className={moleculeStyles.buttonGroup}
          >
          <Button type="submit" variant="primary" size="medium">
            Add Workout
          </Button>
          <Button type="button" variant="secondary" size="medium" onClick={onClose}>
            Cancel
          </Button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

function onWorkoutAdded() {
  throw new Error('Function not implemented.');
}
