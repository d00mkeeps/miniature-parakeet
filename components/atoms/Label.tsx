import React from "react";
import { LabelProps } from "@/types";

export const Label: React.FC<LabelProps> = ({
  htmlFor,
  children,
  ...props
}) => {
  return (
    <label htmlFor={htmlFor} {...props}>
      {children}
    </label>
  );
};
