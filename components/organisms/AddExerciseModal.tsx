import React, { useState } from 'react';
import ExerciseSelectField from '../molecules/ExerciseSelectField';
import Button from '../atoms/Button';

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (exerciseId: number, exerciseName: string) => void;
}

const AddExerciseModal: React.FC<AddExerciseModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [selectedExercise, setSelectedExercise] = useState<{ id: number; name: string } | null>(null);

  const handleExerciseSelect = (exercise: { id: number; name: string } | null) => {
    setSelectedExercise(exercise);
  };

  const handleConfirm = () => {
    if (selectedExercise !== null) {
      onConfirm(selectedExercise.id, selectedExercise.name);
      onClose();
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add Exercise</h2>
        <ExerciseSelectField onExerciseSelect={handleExerciseSelect} />
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose} variant="secondary" className="mr-2">
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="primary" disabled={selectedExercise === null}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddExerciseModal;