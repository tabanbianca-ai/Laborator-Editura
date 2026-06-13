import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export function Button({
  children,
  className = "",
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`ui-button ui-button-${variant} ui-button-${size} ${className}`.trim()}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
