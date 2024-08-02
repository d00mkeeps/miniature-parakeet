// components/atoms/ProfileField.tsx

import React, { useState } from 'react';
import styles from '@/styles/atoms.module.css';
import EditProfileFieldModal from '../molecules/EditProfileModal';
import Button from '../../public/atoms/Button';
import { UserProfile } from '@/types';

interface ProfileFieldProps {
  label: string;
  field: keyof UserProfile;
  value: string | boolean | null | undefined;
  onUpdate: (field: keyof UserProfile, value: string | boolean) => Promise<void>;
  multiline?: boolean;
}

export const ProfileField: React.FC<ProfileFieldProps> = ({ label, field, value, onUpdate, multiline = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = async (newValue: string) => {
    await onUpdate(field, field === 'is_imperial' ? newValue === 'Imperial' : newValue);
    setIsModalOpen(false);
  };

  const displayValue = typeof value === 'boolean' ? (value ? 'Imperial' : 'Metric') : value;

  return (
    <div className={styles.profileField}>
      <strong>{label}: </strong>
      {multiline ? (
        <pre className={`${styles.preWrapped} ${styles.multiline}`}>{displayValue || 'Not set'}</pre>
      ) : (
        <span>{displayValue || 'Not set'}</span>
      )}
      <Button onClick={handleEdit} variant="secondary" size="small" className={styles.editButton}>
        Edit
      </Button>
      <EditProfileFieldModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        fieldName={label}
        currentValue={typeof displayValue === 'string' ? displayValue : ''}
        multiline={multiline}
      />
    </div>
  );
};