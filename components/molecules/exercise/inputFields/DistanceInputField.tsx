import React from 'react';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import styles from '@/styles/molecules.module.css'
interface DistanceInputFieldProps {
  value: number;
  onChange: (value: number) => void;
}

const DistanceInputField: React.FC<DistanceInputFieldProps> = ({ value, onChange }) => {
  return (
    <div className={styles.inputGroup}>
      <Label htmlFor="distance" className={styles.label}>Distance</Label>
      <Input
        id="distance"
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={0}
        step={0.1}
        className={styles.input}
      />
      <span className={styles.unitLabel}>km</span>
    </div>
  );
};

export default DistanceInputField;