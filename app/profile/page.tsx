import  UserProfileDisplay from '@/components/pages/ProfileDisplay'
import styles from '@/styles/pages.module.css'; 

const ProfilePage = () => {
  return (
    <div className={styles.profilePage}>
      <UserProfileDisplay />
    </div>
  );
};

export default ProfilePage;