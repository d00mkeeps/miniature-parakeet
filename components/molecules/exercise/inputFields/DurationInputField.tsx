import React from 'react';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';

interface DurationInputFieldProps {
  minutes: number;
  seconds: number;
  onChange: (minutes: number, seconds: number) => void;
}

const DurationInputField: React.FC<DurationInputFieldProps> = ({ minutes, seconds, onChange }) => {
  return (
    <div>
      <Label htmlFor="duration-minutes">Duration</Label>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Input
          id="duration-minutes"
          type="number"
          value={minutes}
          onChange={(e) => onChange(parseInt(e.target.value, 10), seconds)}
          min={0}
          step={1}
          placeholder="Minutes"
        />
        <Input
          id="duration-seconds"
          type="number"
          value={seconds}
          onChange={(e) => onChange(minutes, parseInt(e.target.value, 10))}
          min={0}
          max={59}
          step={1}
          placeholder="Seconds"
        />
      </div>
    </div>
  );
};

export default DurationInputField;