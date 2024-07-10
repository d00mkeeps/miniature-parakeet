import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
}

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
