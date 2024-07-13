import React from 'react';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import styles from '@/styles/molecules.module.css'
interface RepsInputFieldProps {
  value: number;
  onChange: (value: number) => void;
}

const RepsInputField: React.FC<RepsInputFieldProps> = ({ value, onChange }) => {
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
      />
    </div>
  );
};

export default RepsInputField;