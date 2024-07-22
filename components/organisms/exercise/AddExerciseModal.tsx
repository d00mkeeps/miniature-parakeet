import React, { useEffect, useState } from 'react';
import ExerciseSelectField from '@/components/molecules/exercise/ExerciseSelectField';
import Button from '@/components/atoms/Button';
import { AddExerciseModalProps, Exercise, InputValues } from '@/types';
import styles from '@/styles/organisms.module.css';

const AddExerciseModal: React.FC<AddExerciseModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseType, setExerciseType] = useState<number>(0);
  const [inputValues, setInputValues] = useState<InputValues>({
    weight: 0,
    reps: 0,
    duration: { minutes: 0, seconds: 0 },
    distance: 0
  });

  useEffect(() => {
    if (!isOpen) {
      setSelectedExercise(null);
      setExerciseType(0);
      setInputValues({
        weight: 0,
        reps: 0,
        duration: { minutes: 0, seconds: 0 },
        distance: 0
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedExercise) {
      let type = 0;
      if (selectedExercise.tracks_weight) type |= 1;
      if (selectedExercise.tracks_reps) type |= 2;
      if (selectedExercise.tracks_duration) type |= 4;
      if (selectedExercise.tracks_distance) type |= 8;
      setExerciseType(type);
    } else {
      setExerciseType(0);
    }
  }, [selectedExercise]);

  const handleExerciseSelect = (exercise: Exercise | null) => {
    setSelectedExercise(exercise);
  };

  const handleWeightChange = (newWeight: number) => {
    setInputValues(prev => ({ ...prev, weight: newWeight }));
  };

  const handleRepsChange = (newReps: number) => {
    setInputValues(prev => ({ ...prev, reps: newReps }));
  };

  const handleDurationChange = (value: string) => {
    // Assuming the value is in the format "MM:SS"
    const [minutes, seconds] = value.split(':').map(Number);
    setInputValues(prev => ({
      ...prev,
      duration: { minutes: minutes || 0, seconds: seconds || 0 }
    }));
  };
  const handleDistanceChange = (newDistance: number) => {
    setInputValues(prev => ({ ...prev, distance: newDistance }));
  };

  const handleConfirm = () => {
    if (selectedExercise !== null) {
      onConfirm(selectedExercise.id, selectedExercise.name, inputValues);
      onClose();
    }
  };

  

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Add Exercise</h2>
        <ExerciseSelectField onExerciseSelect={handleExerciseSelect} value={selectedExercise} />
        {selectedExercise && (
          <div className={styles.inputFieldsContainer}>
       
          </div>
        )}
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