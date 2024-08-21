import React from 'react';
import Button from '../../public/atoms/Button';

type SendOffStepProps = {
  onFinish: () => void;
};

export const SendOffStep: React.FC<SendOffStepProps> = ({ onFinish }) => (
  <div>
    <h2>You're All Set!</h2>
    <p>Thank you for completing your profile. We're excited to help you achieve your fitness goals!</p>
    <Button onClick={onFinish}>Start Your Journey</Button>
  </div>
);