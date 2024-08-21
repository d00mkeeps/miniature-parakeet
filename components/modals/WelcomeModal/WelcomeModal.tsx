import React, { useState } from 'react';
import { UserInfoStep } from './UserInfoStep';
import { TrainingHistoryStep } from './TrainingHistoryStep';
import { ModalStep, UserInfoData, WelcomeModalState } from '@/types';
import { useUser } from '@/context/UserContext';
import BackButton from '../../public/atoms/BackButton';
import Button from '../../public/atoms/Button';
import styles from "./WelcomeModal.module.css";

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
  trainingHistory: null,
  goal: '',
};

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<ModalStep>(ModalStep.Welcome);
  const [state, setState] = useState<WelcomeModalState>(initialState);

  const handleUserInfoSubmit = (data: UserInfoData) => {
    setState(prevState => ({ ...prevState, userInfo: data }));
    setCurrentStep(ModalStep.TrainingHistory);
  };

  const handleTrainingHistorySubmit = (history: any) => {
    setState(prevState => ({ ...prevState, trainingHistory: history }));
    setCurrentStep(ModalStep.Goal);
  };

  const handleGoalSubmit = (goal: string) => {
    setState(prevState => ({ ...prevState, goal }));
    setCurrentStep(ModalStep.SendOff);
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => {
      switch (prevStep) {
        case ModalStep.UserInfo:
          return ModalStep.Welcome;
        case ModalStep.TrainingHistory:
          return ModalStep.UserInfo;
        case ModalStep.Goal:
          return ModalStep.TrainingHistory;
        case ModalStep.SendOff:
          return ModalStep.Goal;
        default:
          return prevStep;
      }
    });
  };

  const { updateProfile } = useUser();

  const handleFinish = async () => {
    try {
      await updateProfile('first_name', state.userInfo.firstName);
      await updateProfile('last_name', state.userInfo.lastName);
      await updateProfile('display_name', state.userInfo.displayName);
      await updateProfile('is_imperial', state.userInfo.isImperial);
      await updateProfile('training_history', JSON.stringify(state.trainingHistory));
      await updateProfile('goals', state.goal);

      console.log('User profile updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating user profile:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {currentStep !== ModalStep.Welcome && (
          <BackButton onClick={handleBack} />
        )}

        {currentStep === ModalStep.Welcome && (
          <div>
            <h2>Welcome to Our App!</h2>
            <p>We're excited to have you on board. Let's get started by setting up your profile.</p>
            <Button onClick={() => setCurrentStep(ModalStep.UserInfo)}>Get Started</Button>
          </div>
        )}

        {currentStep === ModalStep.UserInfo && (
          <UserInfoStep onNext={handleUserInfoSubmit} initialData={state.userInfo} />
        )}

        {currentStep === ModalStep.TrainingHistory && (
          <TrainingHistoryStep onNext={handleTrainingHistorySubmit} />
        )}

        {currentStep === ModalStep.Goal && (
          <div>
            <h2>Set Your Fitness Goal</h2>
            <p>This is a placeholder for the goal conversation component.</p>
            <input
              type="text"
              value={state.goal}
              onChange={(e) => setState(prevState => ({ ...prevState, goal: e.target.value }))}
              placeholder="Enter your fitness goal"
            />
            <Button onClick={() => handleGoalSubmit(state.goal)}>Next</Button>
          </div>
        )}

        {currentStep === ModalStep.SendOff && (
          <div>
            <h2>You're All Set!</h2>
            <p>Thank you for completing your profile. We're excited to help you achieve your fitness goals!</p>
            <Button onClick={handleFinish}>Start Your Journey</Button>
          </div>
        )}
      </div>
    </div>
  );
};