import React, { useState } from 'react';
import { UserInfoStep } from './UserInfoStep';
import { TrainingHistoryStep } from './TrainingHistoryStep';
import { InitialGoalStep } from './InitialGoalStep';
import { ImprovedGoalStep } from './ImprovedGoalStep';
import { ConfirmationStep } from './ConfirmationStep';
import { ModalStep, UserInfoData, ImprovedGoal, WelcomeModalState } from '@/types';
import { callImproveGoalAPI } from './utils';
import { useUser } from '@/context/UserContext';
import BackButton from '../../atoms/BackButton';
import styles from '@/styles/molecules.module.css'

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

  const handleBack = () => {
    setCurrentStep((prevStep) => {
      switch (prevStep) {
        case ModalStep.TrainingHistory:
          return ModalStep.UserInfo;
        case ModalStep.InitialGoal:
          return ModalStep.TrainingHistory;
        case ModalStep.ImprovedGoal:
          return ModalStep.InitialGoal;
        default:
          return prevStep;
      }
    });
  };
  
  const {updateProfile} = useUser()

  const handleFinish = async () => {
  try {
    // Update user info
    await updateProfile('first_name', state.userInfo.firstName);
    await updateProfile('last_name', state.userInfo.lastName);
    await updateProfile('display_name', state.userInfo.displayName);
    await updateProfile('is_imperial', state.userInfo.isImperial);

    // Update training history
    await updateProfile('training_history', state.trainingHistory);

    // Update goals (using the improved goal)
    await updateProfile('goals', state.improvedGoal);

    console.log('User profile updated successfully');
    onClose();
  } catch (error) {
    console.error('Error updating user profile:', error);
    // Handle error (e.g., show an error message to the user)
  }
};

  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className={`bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-300 ${
      currentStep === ModalStep.ImprovedGoal ? 'w-3/4 max-w-4xl' : 'w-96'
    }`}>
        <h2 className={styles.modalTitle}>Welcome to SuperCoach!</h2>
        {currentStep !== ModalStep.UserInfo && currentStep !== ModalStep.Confirmation && (
  <BackButton onClick={handleBack} />
)}
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