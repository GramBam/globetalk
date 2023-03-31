import { EventHandler, MouseEvent } from "react";

export interface ButtonProps {
  label: string;
  onClick?: EventHandler<MouseEvent<HTMLButtonElement>>;
  disabled?: boolean;
  className?: string;
}

function Button({ onClick, disabled, label, className }: ButtonProps) {
  return (
    <button
      className={`common-btn ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
export default Button;
