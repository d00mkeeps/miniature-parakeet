import React, { useState, useEffect } from 'react';
import Button from '@/components/public/atoms/Button';
import styles from '@/styles/molecules.module.css';

interface EditProfileFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string | boolean) => void;
  fieldName: string;
  currentValue: string | boolean;
  multiline?: boolean;
  isUnitSystem?: boolean;
}

const EditProfileModal: React.FC<EditProfileFieldModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  fieldName,
  currentValue,
  multiline = false,
  isUnitSystem = false
}) => {
  const [inputValue, setInputValue] = useState<string>(
    isUnitSystem ? (currentValue === true ? 'Imperial' : 'Metric') : String(currentValue)
  );

  useEffect(() => {
    if (isOpen) {
      setInputValue(isUnitSystem ? (currentValue === true ? 'Imperial' : 'Metric') : String(currentValue));
    }
  }, [isOpen, currentValue, isUnitSystem]);

  const handleConfirm = () => {
    const valueToSubmit = isUnitSystem ? inputValue === 'Imperial' : inputValue;
    onConfirm(valueToSubmit);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Edit {fieldName}</h2>
        <div className={styles.formGroup}>
          {isUnitSystem ? (
            <select
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={styles.select}
            >
              <option value="Imperial">Imperial</option>
              <option value="Metric">Metric</option>
            </select>
          ) : multiline ? (
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