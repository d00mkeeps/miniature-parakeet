import React from 'react';
import { ProfileField } from '../atoms/ProfileField';
import styles from '@/styles/molecules.module.css';
import { UserProfile } from '@/types';
import { useUser } from '@/context/UserContext';


interface ProfileSectionProps {
  userProfile: UserProfile;
}

export const ProfileSection = ({ userProfile }: ProfileSectionProps) => {
  const { updateProfile } = useUser();

  const handleUpdateProfile = async (field: keyof UserProfile, value: string | boolean) => {
    const success = await updateProfile(field, value);
    if (success) {
      // You might want to show a success message here
    } else {
      // You might want to show an error message here
    }
  };

  return (
    <div className={styles.profileSection}>
      <ProfileField label="First Name" field="first_name" value={userProfile.first_name} onUpdate={handleUpdateProfile} />
      <ProfileField label="Last Name" field="last_name" value={userProfile.last_name} onUpdate={handleUpdateProfile} />
      <ProfileField label="Display Name" field="display_name" value={userProfile.display_name} onUpdate={handleUpdateProfile} />
      <ProfileField 
        label="Measurement System" 
        field="is_imperial" 
        value={userProfile.is_imperial ? 'Imperial' : 'Metric'} 
        onUpdate={handleUpdateProfile} 
        isUnitSystem={true}
      />
      <ProfileField 
        label="Training History" 
        field="training_history" 
        value={userProfile.training_history} 
        onUpdate={handleUpdateProfile} 
        multiline 
      />
      <ProfileField 
        label="Goals" 
        field="goals" 
        value={userProfile.goals} 
        onUpdate={handleUpdateProfile} 
        multiline 
      />
    </div>
  );
};