import React, { useState } from 'react';
import Button from '../../public/atoms/Button';

type GoalStepProps = {
  onNext: (goal: string) => void;
  initialGoal: string;
};

export const GoalStep: React.FC<GoalStepProps> = ({ onNext, initialGoal }) => {
  const [goal, setGoal] = useState(initialGoal);

  return (
    <div>
      <h2>Set Your Fitness Goal</h2>
      <p>This is a placeholder for the goal conversation component.</p>
      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter your fitness goal"
      />
      <Button onClick={() => onNext(goal)}>Next</Button>
    </div>
  );
};