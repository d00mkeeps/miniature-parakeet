// SetDiv.tsx
import React, { useState, useRef } from 'react';
import Button from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { SetDivProps } from '@/types';
import styles from '@/styles/molecules.module.css';

const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
  event.target.select();
};

const SetDiv: React.FC<SetDivProps> = ({ set, onDelete, onUpdate }) => {
  const [weight, setWeight] = useState(set.weight.toString());
  const [reps, setReps] = useState(set.reps.toString());

  const handleInputChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    isWeight: boolean
  ) => {
    const newValue = value.replace(/^0+/, '').replace(/[^\d]/g, '');
    setter(newValue);
    onUpdate(
      set.id,
      isWeight ? Number(newValue) || 0 : Number(weight) || 0,
      isWeight ? Number(reps) || 0 : Number(newValue) || 0
    );
  };

  return (
    <div className={styles.setContainer}>
      <div className={styles.setIndex}>
        <span className={styles.setIndexText}>{set.id}</span>
      </div>
      <div className={styles.inputGroup}>
        <Label htmlFor={`weight-${set.id}`} className={styles.label}>
          Weight:
        </Label>
        <Input
          id={`weight-${set.id}`}
          type="text"
          value={weight}
          onChange={(e) => handleInputChange(e.target.value, setWeight, true)}
          className={styles.input}
          onFocus={handleFocus}
        />
        <span className={styles.unitLabel}>kg</span>
      </div>
      <div className={styles.inputGroup}>
        <Label htmlFor={`reps-${set.id}`} className={styles.label}>
          Reps:
        </Label>
        <Input
          id={`reps-${set.id}`}
          type="text"
          value={reps}
          onChange={(e) => handleInputChange(e.target.value, setReps, false)}
          className={styles.input}
          onFocus={handleFocus}
        />
      </div>
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