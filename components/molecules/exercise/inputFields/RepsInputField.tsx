import React from 'react';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import styles from '@/styles/molecules.module.css'
import { RepsInputFieldProps } from '@/types';


const RepsInputField: React.FC<RepsInputFieldProps> = ({ value, onChange }) => {
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };
  return (
    <div className={styles.inputGroup}>
      <Label htmlFor="reps" className={styles.label}>Reps</Label>
      <Input
        id="reps"
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        min={0}
        step={1}
        className={styles.input}
        onFocus={handleFocus}
      />
    </div>
  );
};

export default RepsInputField;