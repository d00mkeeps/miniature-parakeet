'use client'
import React from 'react';
import { ProfileField } from '../atoms/ProfileField';
import styles from '@/styles/molecules.module.css';
import { UserProfile } from '@/types';
import { useUser } from '@/context/UserContext';

interface ProfileSectionProps {
  userProfile: UserProfile;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ userProfile }) => {
  const { updateProfile } = useUser();

  const handleUpdateProfile = async (field: keyof UserProfile, value: any) => {
    try {
      if (field === 'training_history' && typeof value === 'string') {
        value = JSON.parse(value);
      }
      
      const success = await updateProfile(field, value);
      if (success) {
        console.log(`Successfully updated ${field}`);
      } else {
        console.error(`Failed to update ${field}`);
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  const formatValue = (field: keyof UserProfile, value: any): string => {
    if (field === 'training_history' || field === 'goals') {
      return typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
    }
    return String(value);
  };

  return (
    <div className={styles.profileSection}>
      <ProfileField 
        label="First Name" 
        field="first_name" 
        value={formatValue('first_name', userProfile.first_name)} 
        onUpdate={handleUpdateProfile} 
      />
      <ProfileField 
        label="Last Name" 
        field="last_name" 
        value={formatValue('last_name', userProfile.last_name)} 
        onUpdate={handleUpdateProfile} 
      />
      <ProfileField 
        label="Display Name" 
        field="display_name" 
        value={formatValue('display_name', userProfile.display_name)} 
        onUpdate={handleUpdateProfile} 
      />
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
        value={formatValue('training_history', userProfile.training_history)} 
        onUpdate={handleUpdateProfile} 
        multiline 
      />
      <ProfileField 
        label="Goals" 
        field="goals" 
        value={formatValue('goals', userProfile.goals)} 
        onUpdate={handleUpdateProfile} 
        multiline 
      />
    </div>
  );
};