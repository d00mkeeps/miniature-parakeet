import React from 'react';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import styles from '@/styles/molecules.module.css';

interface WeightInputFieldProps {
  value: number;
  onChange: (value: number) => void;
}

const WeightInputField: React.FC<WeightInputFieldProps> = ({ value, onChange }) => {
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
      />
      <span className={styles.unitLabel}>kg</span>
    </div>
  );
};

export default WeightInputField;