import React from 'react';
import Button from '../../public/atoms/Button';

type WelcomeStepProps = {
  onNext: () => void;
};

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => (
  <div>
    <h2>Welcome to Our App!</h2>
    <p>We're excited to have you on board. Let's get started by setting up your profile.</p>
    <Button onClick={onNext}>Get Started</Button>
  </div>
);