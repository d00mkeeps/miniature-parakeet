import styles from '@/styles/atoms.module.css';

interface ProfileFieldProps {
  label: string;
  value: string | null | undefined;
  multiline?: boolean;
}

export const ProfileField = ({ label, value, multiline = false }: ProfileFieldProps) => (
  <div className={styles.profileField}>
    <strong>{label}: </strong>
    {multiline ? (
      <pre className={`${styles.preWrapped} ${styles.multiline}`}>{value || 'Not set'}</pre>
    ) : (
      <span>{value || 'Not set'}</span>
    )}
  </div>
);
