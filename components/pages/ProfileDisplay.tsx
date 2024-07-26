'use client'
import { useUser } from '@/context/UserContext';
import styles from '@/styles/organisms.module.css';

const UserProfileDisplay = () => {
  const { userProfile, loading, error } = useUser();

  if (loading) {
    return <div>Loading user profile...</div>;
  }

  if (error) {
    return <div>Error loading user profile: {error.message}</div>;
  }

  if (!userProfile) {
    return <div>No user profile found.</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User Profile</h1>
      <div className={styles.profileInfo}>
        <p><strong>First Name:</strong> {userProfile.first_name || 'Not set'}</p>
        <p><strong>Last Name:</strong> {userProfile.last_name || 'Not set'}</p>
        <p><strong>Display Name:</strong> {userProfile.display_name || 'Not set'}</p>
        <p><strong>Measurement System:</strong> {userProfile.is_imperial ? 'Imperial' : 'Metric'}</p>
        <p><strong>User ID:</strong> {userProfile.user_id}</p>
        <div>
          <strong>Training History:</strong>
          <pre className={styles.preWrapped}>{userProfile.training_history || 'Not set'}</pre>
        </div>
        <div>
          <strong>Goals:</strong>
          <pre className={styles.preWrapped}>{userProfile.goals || 'Not set'}</pre>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDisplay;