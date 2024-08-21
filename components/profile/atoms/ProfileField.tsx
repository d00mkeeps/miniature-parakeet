
import React, { useState } from 'react';
import styles from '@/styles/atoms.module.css';
import { UserProfile } from '@/types';

interface ProfileFieldProps {
  label: string;
  field: keyof UserProfile;
  value: string;
  onUpdate: (field: keyof UserProfile, value: any) => Promise<void>;
  multiline?: boolean;
  isUnitSystem?: boolean;
}

export const ProfileField: React.FC<ProfileFieldProps> = ({ 
  label, 
  field, 
  value, 
  onUpdate, 
  multiline, 
  isUnitSystem 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    await onUpdate(field, editedValue);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedValue(e.target.value);
  };

  const handleToggle = async () => {
    await onUpdate(field, !value);
  };

  if (isUnitSystem) {
    return (
      <div className={styles.profileField}>
        <span>{label}:</span>
        <button onClick={handleToggle}>{value}</button>
      </div>
    );
  }

  return (
    <div className={styles.profileField}>
      <span>{label}:</span>
      {isEditing ? (
        <>
          {multiline ? (
            <textarea 
              value={editedValue} 
              onChange={handleChange}
              className={styles.textArea}
            />
          ) : (
            <input 
              type="text" 
              value={editedValue} 
              onChange={handleChange}
              className={styles.input}
            />
          )}
          <button onClick={handleSave} className={styles.button}>Save</button>
        </>
      ) : (
        <>
          <pre className={styles.preWrapped}>{value}</pre>
          <button onClick={handleEdit} className={styles.button}>Edit</button>
        </>
      )}
    </div>
  );
};