import React, { useEffect, useState } from 'react';
import ExerciseSelectField from '@/components/molecules/exercise/ExerciseSelectField';
import Button from '@/components/atoms/Button';
import { AddExerciseModalProps, Exercise } from '@/types';
import styles from '@/styles/organisms.module.css';
import { WeightInputField, RepsInputField, DurationInputField, DistanceInputField } from '@/components/molecules/exercise/inputFields';

interface InputValues {
  weight: number;
  reps: number;
  duration: { minutes: number; seconds: number };
  distance: number;
}

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

  const renderInputFields = () => {
    return (
      <>
        {exerciseType & 1 && (
          <WeightInputField 
            value={inputValues.weight} 
            onChange={handleWeightChange} 
          />
        )}
        {exerciseType & 2 && (
          <RepsInputField 
            value={inputValues.reps} 
            onChange={handleRepsChange} 
          />
        )}
        {exerciseType & 4 && (
  <DurationInputField 
    value={`${inputValues.duration.minutes.toString().padStart(2, '0')}:${inputValues.duration.seconds.toString().padStart(2, '0')}`}
    onChange={handleDurationChange} 
  />
)}
        {exerciseType & 8 && (
          <DistanceInputField 
            value={inputValues.distance} 
            onChange={handleDistanceChange} 
          />
        )}
      </>
    );
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Add Exercise</h2>
        <ExerciseSelectField onExerciseSelect={handleExerciseSelect} value={selectedExercise} />
        {selectedExercise && (
          <div className={styles.inputFieldsContainer}>
            {renderInputFields()}
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