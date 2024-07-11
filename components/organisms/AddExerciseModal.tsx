import React, { useState } from 'react';
import ExerciseSelectField from '../molecules/ExerciseSelectField';
import Button from '../atoms/Button';
import { AddExerciseModalProps } from '@/types';
import styles from '@/styles/organisms.module.css';

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
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Add Exercise</h2>
        <ExerciseSelectField onExerciseSelect={handleExerciseSelect} />
        <div className={styles.actionContainer}>
          <Button onClick={onClose} variant="secondary" className={styles.marginRight}>
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
