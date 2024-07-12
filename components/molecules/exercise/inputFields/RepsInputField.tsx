import React from 'react';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';

interface RepsInputFieldProps {
  value: number;
  onChange: (value: number) => void;
}

const RepsInputField: React.FC<RepsInputFieldProps> = ({ value, onChange }) => {
  return (
    <div>
      <Label htmlFor="reps">Repetitions</Label>
      <Input
        id="reps"
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        min={0}
        step={1}
      />
    </div>
  );
};

export default RepsInputField;