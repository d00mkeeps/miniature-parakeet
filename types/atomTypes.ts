export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary" | "danger";
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    className?: string;
  }

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
  }

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    htmlFor: string;
  }
  
