// components/organisms/UserProfileDisplay.tsx
'use client'
import { useUser } from '@/context/UserContext';
import { PageTitle } from '../atoms/PageTitle';
import { LoadingSpinner } from '@/components/public/atoms/LoadingSpinner';
import { ErrorMessage } from '@/components/public/atoms/ErrorMessage';
import { ProfileSection } from '../molecules/ProfileSection';
import styles from '@/styles/organisms.module.css';
import { UserProfile } from '@/types'; // Adjust the import path as needed

export const UserProfileDisplay = () => {
  const { userProfile, loading, error } = useUser();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (!userProfile) {
    return <div>No user profile found.</div>;
  }

  return (
    <div className={styles.container}>
      <PageTitle title="User Profile" />
      <ProfileSection userProfile={userProfile} />
    </div>
  );
};

export default UserProfileDisplay;