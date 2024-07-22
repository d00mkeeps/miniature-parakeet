import React from 'react';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import styles from '@/styles/molecules.module.css'
import { DurationInputFieldProps } from '@/types';

const DurationInputField: React.FC<DurationInputFieldProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };
  return (
    <div className={styles.inputGroup}>
      <Label htmlFor="duration" className={styles.label}>Duration</Label>
      <Input
        id="duration"
        type="time"
        value={value}
        onChange={handleChange}
        step="1"
        className={`${styles.input} ${styles.durationInput}  ${styles.widerTimeInput}`}
      />
    </div>
  );
};

export default DurationInputField;