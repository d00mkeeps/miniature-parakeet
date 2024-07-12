import React from 'react';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';

interface WeightInputFieldProps {
  value: number;
  onChange: (value: number) => void;
}

const WeightInputField: React.FC<WeightInputFieldProps> = ({ value, onChange }) => {
  return (
    <div>
      <Label htmlFor="weight">Weight (kg)</Label>
      <Input
        id="weight"
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={0}
        step={0.1}
      />
    </div>
  );
};

export default WeightInputField;