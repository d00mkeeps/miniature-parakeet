import React, { forwardRef } from "react";
import { InputProps } from "@/types";
import styles from '@/styles/atoms.module.css';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, className, ...props }, ref) => {
    return (
      <input 
        id={id} 
        ref={ref} 
        className={`${styles.input} ${className || ''}`} 
        {...props} 
      />
    );
  }
);

Input.displayName = "Input";