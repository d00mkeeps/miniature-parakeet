import React from 'react';
import styles from '@/styles/atoms.module.css';
import { HeadingProps } from '@/types';

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