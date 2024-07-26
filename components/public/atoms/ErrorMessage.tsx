import styles from '@/styles/atoms.module.css';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div className={styles.errorMessage}>Error loading user profile: {message}</div>
);