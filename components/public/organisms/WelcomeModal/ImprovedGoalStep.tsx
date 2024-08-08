// In ImprovedGoalStep.tsx

import React from 'react';
import { Label } from '../../atoms/Label';
import Button from '../../atoms/Button';

type ImprovedGoalStepProps = {
  improvedGoal: string;
  onEdit: (goal: string) => void;
  onNext: () => void;
};

export const ImprovedGoalStep: React.FC<ImprovedGoalStepProps> = ({ improvedGoal, onEdit, onNext }) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-2">Improved Goal</h3>
      <p className="mb-2">Our AI coach has suggested the following improved goal based on your input:</p>
      {improvedGoal ? (
        <p className="font-bold mb-2"></p>
      ) : (
        <p className="text-red-500 mb-2">No improved goal available. Please try again.</p>
      )}
      <div className="mb-4">
    
        <textarea
          id="editedGoal"
          value={improvedGoal || ''}
          onChange={(e) => onEdit(e.target.value)}
          className="w-full p-2 border rounded bg-gray-800"
          rows={8}
        />
      </div>
      <Button onClick={onNext} variant="primary" size="large" className="w-full mt-4">
        Confirm Goal
      </Button>
    </div>
  );
};