import React from 'react';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';

interface DistanceInputFieldProps {
  value: number;
  onChange: (value: number) => void;
}

const DistanceInputField: React.FC<DistanceInputFieldProps> = ({ value, onChange }) => {
  return (
    <div>
      <Label htmlFor="distance">Distance (km)</Label>
      <Input
        id="distance"
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={0}
        step={0.1}
      />
    </div>
  );
};

export default DistanceInputField;