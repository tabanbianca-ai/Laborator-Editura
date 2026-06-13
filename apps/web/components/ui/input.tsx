import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ className = "", id, label, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="ui-input-field">
      {label ? <span>{label}</span> : null}
      <input
        className={`ui-input ${className}`.trim()}
        id={inputId}
        {...props}
      />
    </label>
  );
}
