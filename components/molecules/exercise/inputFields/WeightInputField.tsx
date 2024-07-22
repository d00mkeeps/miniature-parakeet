import React from 'react';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import styles from '@/styles/molecules.module.css';
import { WeightInputFieldProps } from '@/types';

const WeightInputField: React.FC<WeightInputFieldProps> = ({ value, onChange }) => {
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };
  return (
    <div className={styles.inputGroup}>
      <Label htmlFor="weight" className={styles.label}>Weight</Label>
      <Input
        id="weight"
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={0}
        step={0.1}
        className={styles.input}
        onFocus={handleFocus}
      />
      <span className={styles.unitLabel}>kg</span>
    </div>
  );
};

export default WeightInputField;