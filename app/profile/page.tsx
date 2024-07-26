import { UserProfileDisplay } from '@/components/profile/organisms/UserProfileDisplay';
import styles from '@/styles/pages.module.css'; 

const ProfilePage = () => {
  return (
    <div className={styles.profilePage}>
      <UserProfileDisplay />
    </div>
  );
};

export default ProfilePage;