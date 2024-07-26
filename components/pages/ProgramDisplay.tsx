// pages/ProgramDisplayPage.tsx
import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useUserPrograms } from '@/hooks/useUserPrograms';
import Button from '@/components/atoms/Button';
import { Heading, Paragraph } from '@/components/atoms/Typography';
import ProgramList from '@/components/organisms/program/ProgramList';
import CreateProgramModal from '@/components/molecules/program/CreateProgramModal';
import styles from '@/styles/pages.module.css';
import { deleteProgram } from '@/utils/supabaseFunctions/programFunctions';

const ProgramDisplayPage: React.FC = () => {
  useUser();
  const { programs, loading, error, refetch } = useUserPrograms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (selectedProgramId: string) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      setIsDeleting(true);
      try {
        const success = await deleteProgram(selectedProgramId);
        if (success) {
          await refetch();
        } else {
          alert('Failed to delete the program. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting program:', error);
        alert('An error occurred while deleting the program.');
      } finally {
        setIsDeleting(false);
      }
    }
  };


  const handleProgramCreated = async () => {
    await refetch()
  }

  return (
    <div className={styles.pageContainer}>
      <main className={styles.pageContent}>
        <div className={styles.pageHeader}>
          <Heading level={1}>Your Programs</Heading>
          <Button onClick={() => setIsModalOpen(true)} variant="primary">
            Create New Program
          </Button>
        </div>
        {loading && <Paragraph>Loading your programs...</Paragraph>}
        {error && <Paragraph className={styles.errorText}>{error.message || String(error)}</Paragraph>}
        {!loading && !error && programs.length > 0 ? (
          <ProgramList programs={programs} onDelete={handleDelete} />
        ) : (
          <div className={styles.noProgramsMessage}>
            <Paragraph>You don't have any programs yet. Create one to get started!</Paragraph>
          </div>
        )}
      </main>
      <CreateProgramModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProgramCreated={handleProgramCreated}
      />
    </div>
  );
};

export default ProgramDisplayPage;