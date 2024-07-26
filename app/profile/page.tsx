// pages/profile.tsx (or app/profile/page.tsx if using App Router)
import { UserProfileDisplay } from '@/components/profile/organisms/UserProfileDisplay';
import styles from '@/styles/pages.module.css'; // Assuming you have page-specific styles

const ProfilePage = () => {
  return (
    <div className={styles.profilePage}>
      <UserProfileDisplay />
    </div>
  );
};

export default ProfilePage;