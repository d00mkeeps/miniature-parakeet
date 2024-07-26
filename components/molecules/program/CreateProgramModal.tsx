// components/molecules/CreateProgramModal.tsx
import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import Button from '@/components/atoms/Button';
import { Heading } from '@/components/atoms/Typography';
import styles from '@/styles/molecules.module.css';
import { insertProgram } from '@/utils/supabaseFunctions/programFunctions';
import { CreateProgramModalProps } from '@/types';

const CreateProgramModal: React.FC<CreateProgramModalProps> = ({ isOpen, onClose, onProgramCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { userProfile } = useUser();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!userProfile) {
        console.error('User not logged in');
        return;
      }
  
      setIsSubmitting(true);
  
      try {
        const newProgram = await insertProgram(name, description, userProfile.user_id);
        if (newProgram) {
          console.log('Program created:', newProgram);
          if (onProgramCreated) {
            onProgramCreated(newProgram);
          }
          setName('');
          setDescription('');
          onClose();
        }
      } catch (error) {
        console.error('Error creating program:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  
    if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <Heading level={2} className={styles.modalTitle}>Create New Program</Heading>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.descriptiontextarea}
              rows={3}
            />
          </div>
          <div className={styles.buttonGroup}>
            <Button onClick={onClose} variant="secondary">Cancel</Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProgramModal;