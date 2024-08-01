import styles from '@/styles/atoms.module.css';

interface PageTitleProps {
  title: string;
}

export const PageTitle = ({ title }: PageTitleProps) => (
  <h1 className={styles.pageTitle}>{title}</h1>
);