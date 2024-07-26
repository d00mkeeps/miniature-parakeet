import { ProfileField } from '../atoms/ProfileField';
import styles from '@/styles/molecules.module.css';
import { UserProfile } from '@/types';

interface ProfileSectionProps {
  userProfile: UserProfile;
}

export const ProfileSection = ({ userProfile }: ProfileSectionProps) => (
  <div className={styles.profileSection}>
    <ProfileField label="First Name" value={userProfile.first_name} />
    <ProfileField label="Last Name" value={userProfile.last_name} />
    <ProfileField label="Display Name" value={userProfile.display_name} />
    <ProfileField label="Measurement System" value={userProfile.is_imperial ? 'Imperial' : 'Metric'} />
    <ProfileField label="User ID" value={userProfile.user_id} />
    <div className={styles.multilineField}>
      <ProfileField label="Training History" value={userProfile.training_history} multiline />
    </div>
    <div className={styles.multilineField}>
      <ProfileField label="Goals" value={userProfile.goals} multiline />
    </div>

  </div>
);