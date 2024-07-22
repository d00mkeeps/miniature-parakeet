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
  

  export interface HeadingProps {
    children: React.ReactNode;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string
  }
