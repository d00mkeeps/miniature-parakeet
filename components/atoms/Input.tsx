// components/atoms/Input.tsx
import React, { forwardRef } from "react";
import { InputProps } from "@/types"

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, ...props }, ref) => {
    return <input id={id} ref={ref} {...props} />;
  }
);

Input.displayName = "Input";
