'use client'
import React from 'react';
import styles from '@/styles/atoms.module.css';

interface ProfileFieldProps {
  label: string;
  field: string;
  value: string | boolean;
  onUpdate: (field: string, value: string | boolean) => void;
  multiline?: boolean;
  isUnitSystem?: boolean;
  readOnly?: boolean;
}

export const ProfileField: React.FC<ProfileFieldProps> = ({ 
  label, 
  field, 
  value, 
  onUpdate, 
  multiline, 
  isUnitSystem,
  readOnly
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedValue, setEditedValue] = React.useState(value);

  const handleEdit = () => {
    if (!readOnly) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    onUpdate(field, editedValue);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedValue(e.target.value);
  };

  const handleToggle = () => {
    onUpdate(field, !value);
  };

  if (isUnitSystem) {
    return (
      <div className={styles.profileField}>
        <span>{label}:</span>
        <button onClick={handleToggle}>{value ? 'Imperial' : 'Metric'}</button>
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
              value={editedValue as string} 
              onChange={handleChange}
              className={styles.textArea}
            />
          ) : (
            <input 
              type="text" 
              value={editedValue as string} 
              onChange={handleChange}
              className={styles.input}
            />
          )}
          <button onClick={handleSave} className={styles.button}>Save</button>
        </>
      ) : (
        <>
          <span>{value as string}</span>
          {!readOnly && <button onClick={handleEdit} className={styles.button}>Edit</button>}
        </>
      )}
    </div>
  );
};