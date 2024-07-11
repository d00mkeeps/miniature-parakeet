import Link from "next/link";
import React from "react";
import { ButtonProps } from "@/types";
import styles from '@/styles/atoms.module.css';

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  href,
  type = "button",
  variant = "primary",
  size = "medium",
  disabled = false,
  className = "",
}) => {
  const buttonStyles = `
    ${styles.button}
    ${styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`]}
    ${styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`]}
    ${disabled ? styles.buttonDisabled : ''}
    ${className}
  `.trim();

  if (href && !disabled) {
    return (
      <Link href={href} className={buttonStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonStyles}
    >
      {children}
    </button>
  );
};

export default Button;