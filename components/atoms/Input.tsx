// components/atoms/Input.tsx
import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, ...props }, ref) => {
    return <input id={id} ref={ref} {...props} />;
  }
);

Input.displayName = "Input";
