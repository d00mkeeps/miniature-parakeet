import React from 'react';
import styles from '@/styles/atoms.module.css';

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string
}

export const Heading: React.FC<HeadingProps> = ({ children, level = 1 }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className={styles.heading}>{children}</Tag>;
};

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
}

export const Paragraph: React.FC<ParagraphProps> = ({ children, className }) => (
  <p className={`${styles.paragraph} ${className || ''}`}>{children}</p>
);