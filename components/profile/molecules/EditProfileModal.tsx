

import React, { useState, useEffect } from 'react';
import Button from '@/components/public/atoms/Button';
import styles from '@/styles/molecules.module.css';

interface EditProfileFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  fieldName: string;
  currentValue: string;
  multiline?: boolean;
}

const EditProfileModal: React.FC<EditProfileFieldModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  fieldName,
  currentValue,
  multiline = false
}) => {
  const [inputValue, setInputValue] = useState(currentValue);

  useEffect(() => {
    if (isOpen) {
      setInputValue(currentValue);
    }
  }, [isOpen, currentValue]);

  const handleConfirm = () => {
    onConfirm(inputValue);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Edit {fieldName}</h2>
        <div className={styles.formGroup}>
          {multiline ? (
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={styles.descriptiontextarea}
              placeholder={`Enter ${fieldName}`}
            />
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={styles.input}
              placeholder={`Enter ${fieldName}`}
            />
          )}
        </div>
        <div className={styles.buttongroup}>
          <Button onClick={onClose} variant="secondary" className={styles.marginRight}>
            Back
          </Button>
          <Button onClick={handleConfirm} variant="primary">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;