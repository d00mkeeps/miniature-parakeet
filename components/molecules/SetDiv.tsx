import React, { useState } from 'react';
import Button from '../atoms/Button';
import { SetDivProps } from '@/types';
import styles from '@/styles/molecules.module.css';
import { WeightInputField, RepsInputField, DurationInputField, DistanceInputField } from './exercise/inputFields';

const SetDiv: React.FC<SetDivProps> = ({ set, onDelete, onUpdate, exerciseProps }) => {
  const [weight, setWeight] = useState(set.weight || 0);
  const [reps, setReps] = useState(set.reps || 0);
  const [duration, setDuration] = useState({ 
    minutes: set.duration ? Math.floor(set.duration / 60) : 0, 
    seconds: set.duration ? set.duration % 60 : 0 
  });
  const [distance, setDistance] = useState(set.distance || 0);
  console.log('SetDiv rendering:', { set, exerciseProps });
  const handleUpdate = () => {
    onUpdate(
      set.id,
      weight,
      reps,
      duration.minutes * 60 + duration.seconds,
      distance
    );
  };
  console.log('SetDiv input states:', { weight, reps, duration, distance });
  return (
    <div className={styles.setContainer}>
      <div className={styles.setIndex}>
        <span className={styles.setIndexText}>{set.id}</span>
      </div>
      {exerciseProps.tracks_weight && (
        <WeightInputField
          value={weight}
          onChange={(newWeight) => {
            setWeight(newWeight);
            handleUpdate();
          }}
        />
      )}
      {exerciseProps.tracks_reps && (
        <RepsInputField
          value={reps}
          onChange={(newReps) => {
            setReps(newReps);
            handleUpdate();
          }}
        />
      )}
      {exerciseProps.tracks_duration && (
        <DurationInputField
          minutes={duration.minutes}
          seconds={duration.seconds}
          onChange={(minutes, seconds) => {
            setDuration({ minutes, seconds });
            handleUpdate();
          }}
        />
      )}
      {exerciseProps.tracks_distance && (
        <DistanceInputField
          value={distance}
          onChange={(newDistance) => {
            setDistance(newDistance);
            handleUpdate();
          }}
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

export default SetDiv;