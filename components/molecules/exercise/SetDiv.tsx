import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import { SetDivProps } from '@/types';
import styles from '@/styles/molecules.module.css';
import { WeightInputField, RepsInputField, DurationInputField, DistanceInputField } from './inputFields';

const SetDiv: React.FC<SetDivProps> = ({ set, onDelete, onUpdate, exerciseProps }) => {
  const [weight, setWeight] = useState(set.weight || 0);
  const [reps, setReps] = useState(set.reps || 0);
  const [duration, setDuration] = useState(formatDuration(set.duration || 0));
  const [distance, setDistance] = useState(set.distance || 0);

  useEffect(() => {
    handleUpdate();
  }, [weight, reps, duration, distance]);

  const handleUpdate = () => {
    onUpdate(
      set.id,
      weight,
      reps,
      parseDuration(duration),
      distance
    );
  };

  return (
    <div className={styles.setContainer}>
      <div className={styles.setIndex}>
        <span className={styles.setIndexText}>{set.id}</span>
      </div>
      {exerciseProps.tracks_weight && (
        <WeightInputField
          value={weight}
          onChange={setWeight}
        />
      )}
      {exerciseProps.tracks_reps && (
        <RepsInputField
          value={reps}
          onChange={setReps}
        />
      )}
      {exerciseProps.tracks_duration && (
        <DurationInputField
          value={duration}
          onChange={setDuration}
        />
      )}
      {exerciseProps.tracks_distance && (
        <DistanceInputField
          value={distance}
          onChange={setDistance}
        />
      )}
      <Button 
        onClick={() => onDelete(set.id)} 
        variant="danger" 
        size="small"
        className={styles.deleteButton}
      >
        Delete
      </Button>
    </div>
  );
};

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function parseDuration(duration: string): number {
  const [minutes, seconds] = duration.split(':').map(Number);
  return minutes * 60 + seconds;
}

export default SetDiv;