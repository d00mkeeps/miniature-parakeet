// pages/ProgramPage.tsx
import React, { useState, useEffect } from 'react';
import Header from '@/components/molecules/Header';
import { useUser } from '@/context/UserContext';
import { fetchUserPrograms } from '@/supabaseFunctions/programFunctions';
import { Program } from '@/types';
import Button from '../atoms/Button';
import { Heading, Paragraph } from '../atoms/Typography';
import ProgramList from '@/components/organisms/program/ProgramList';
import styles from '@/styles/pages.module.css';

const ProgramDisplayPage: React.FC = () => {
  const { userProfile } = useUser();
  const [userPrograms, setUserPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserPrograms = async () => {
      if (!userProfile) return;

      setIsLoading(true);
      setError(null);

      try {
        const programs = await fetchUserPrograms(userProfile.user_id);
        setUserPrograms(programs);
      } catch (err) {
        setError('Failed to fetch programs');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserPrograms();
  }, [userProfile]);

  const handleDelete = async (selectedProgramId: number) => {
    // Implement delete functionality here
    console.log('Delete program:', selectedProgramId);
  };

  return (
    <div className={styles.programPage}>
      <Header />
      <main className={styles.programPageMain}>
        <Heading>Your Programs</Heading>
        <Button href="/programs/create" variant="primary">
          Create New Program
        </Button>
        {isLoading && <Paragraph>Loading your programs...</Paragraph>}
        {error && <Paragraph className={styles.errorText}>{error}</Paragraph>}
        {!isLoading && !error && (
          userPrograms.length > 0 ? (
            <ProgramList programs={userPrograms} onDelete={handleDelete} />
          ) : (
            <div className={styles.noProgramsMessage}>
              <Paragraph>You don't have any programs yet. Create one to get started!</Paragraph>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default ProgramDisplayPage;