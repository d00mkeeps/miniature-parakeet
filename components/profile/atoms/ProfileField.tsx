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
  isUnitSystem?: boolean;
}

export const ProfileField: React.FC<ProfileFieldProps> = ({ 
  label, 
  field, 
  value, 
  onUpdate, 
  multiline = false,
  isUnitSystem = false
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState<string | boolean>(
    isUnitSystem ? (value === true ? 'Imperial' : 'Metric') : (value ?? 'Not set')
  );

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = async (newValue: string | boolean) => {
    await onUpdate(field, newValue);
    setDisplayValue(isUnitSystem ? (newValue === true ? 'Imperial' : 'Metric') : newValue);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.profileField}>
      <strong>{label}: </strong>
      {multiline ? (
        <pre className={`${styles.preWrapped} ${styles.multiline}`}>{displayValue}</pre>
      ) : (
        <span>{displayValue}</span>
      )}
      <Button onClick={handleEdit} variant="secondary" size="small" className={styles.editButton}>
        Edit
      </Button>
      <EditProfileFieldModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        fieldName={label}
        currentValue={displayValue}
        multiline={multiline}
        isUnitSystem={isUnitSystem}
      />
    </div>
  );
};