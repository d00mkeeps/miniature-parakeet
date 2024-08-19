import React from 'react';
import { UserProfile } from '@/types';
import { useUser } from '@/context/UserContext';
import Button from '../atoms/Button';

interface UserProfileConfirmationModalProps {
  summary: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const UserProfileConfirmationModal: React.FC<UserProfileConfirmationModalProps> = ({ summary, onConfirm, onCancel }) => {
  const { updateProfile } = useUser();

  const handleConfirm = async () => {
    try {
      const summaryData = JSON.parse(summary) as Partial<UserProfile>;
      
      // Update each field in the user profile
      for (const [key, value] of Object.entries(summaryData)) {
        if (key in summaryData) {
          await updateProfile(key as keyof UserProfile, value as string | boolean);
        }
      }
      
      onConfirm();
    } catch (error) {
      console.error('Error updating user profile:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Confirm Training History Summary</h2>
        <pre>{JSON.stringify(JSON.parse(summary), null, 2)}</pre>
        <div className="modal-actions">
          <Button onClick={handleConfirm} variant="primary" size="medium">
            Confirm
          </Button>
          <Button onClick={onCancel} variant="secondary" size="medium">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileConfirmationModal;