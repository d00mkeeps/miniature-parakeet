import React from "react";
import { LabelProps } from "@/types";
import styles from '@/styles/atoms.module.css';

export const Label: React.FC<LabelProps> = ({
  htmlFor,
  children,
  className,
  ...props
}) => {
  return (
    <label 
      htmlFor={htmlFor} 
      className={`${styles.label} ${className || ''}`} 
      {...props}
    >
      {children}
    </label>
  );
};