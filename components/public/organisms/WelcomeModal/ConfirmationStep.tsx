import React from "react";
import Button from "../../atoms/Button";

type ConfirmationStepProps = {
    onFinish: () => void;
};

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ onFinish }) => {
    return (
        <div>
        <h3 className="text-xl font-bold mb-2">All Set!</h3>
        <p className="mb-4">Your profile has been updated with your new goal.</p>
        <Button onClick={onFinish} variant="primary" size="large" className="w-full mt-4">
          Start Your Journey
        </Button>
      </div> 
    )
}