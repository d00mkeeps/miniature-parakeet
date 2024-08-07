import React, { useState } from 'react';
import { UserInfoStep } from './UserInfoStep';
import { TrainingHistoryStep } from './TrainingHistoryStep';
import { InitialGoalStep } from './InitialGoalStep';
import { ImprovedGoalStep } from './ImprovedGoalStep';
import { ConfirmationStep } from './ConfirmationStep';
import { ModalStep, UserInfoData, ImprovedGoal, WelcomeModalState } from '@/types';
import { callImproveGoalAPI } from './utils';

type WelcomeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const initialState: WelcomeModalState = {
  userInfo: {
    displayName: '',
    firstName: '',
    lastName: '',
    isImperial: false,
  },
  trainingHistory: '',
  initialGoal: '',
  improvedGoal: '',
};

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<ModalStep>(ModalStep.UserInfo);
  const [state, setState] = useState<WelcomeModalState>(initialState);

  const handleUserInfoSubmit = (data: UserInfoData) => {
    setState(prevState => ({ ...prevState, userInfo: data }));
    setCurrentStep(ModalStep.TrainingHistory);
  };

  const handleTrainingHistorySubmit = (history: string) => {
    setState(prevState => ({ ...prevState, trainingHistory: history }));
    setCurrentStep(ModalStep.InitialGoal);
  };

  const handleInitialGoalSubmit = async (goal: string) => {
    setState(prevState => ({ ...prevState, initialGoal: goal }));
    try {
      const improvedGoalResponse = await callImproveGoalAPI(goal, state.trainingHistory);
      console.log('Improved Goal Response:', improvedGoalResponse);  // Log the response
  
      // The API now returns just the text, so we can use it directly
      setState(prevState => ({ ...prevState, improvedGoal: improvedGoalResponse.improved_goal }));
      setCurrentStep(ModalStep.ImprovedGoal);
    } catch (error) {
      console.error('Error improving goal:', error);
      // Handle error
    }
  };
  const handleImprovedGoalEdit = (editedGoal: string) => {
    setState(prevState => ({ ...prevState, improvedGoal: editedGoal }));
  };

  const handleFinish = () => {
    console.log('Final submission:', {
      userInfo: state.userInfo,
      trainingHistory: state.trainingHistory,
      improvedGoal: state.improvedGoal,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-500 p-8 rounded-lg w-96 shadow-xl border border-gray-300">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Welcome to SuperCoach!</h2>
        {currentStep === ModalStep.UserInfo && <UserInfoStep onNext={handleUserInfoSubmit} initialData={state.userInfo} />}
        {currentStep === ModalStep.TrainingHistory && <TrainingHistoryStep onNext={handleTrainingHistorySubmit} initialData={state.trainingHistory} />}
        {currentStep === ModalStep.InitialGoal && <InitialGoalStep onNext={handleInitialGoalSubmit} initialData={state.initialGoal} />}
        {currentStep === ModalStep.ImprovedGoal && 
  <ImprovedGoalStep 
    improvedGoal={state.improvedGoal} 
    onEdit={handleImprovedGoalEdit}     
    onNext={() => setCurrentStep(ModalStep.Confirmation)} 
  />
}
        {currentStep === ModalStep.Confirmation && <ConfirmationStep onFinish={handleFinish} />}
      </div>
    </div>
  );
};