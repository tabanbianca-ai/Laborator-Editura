import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{
    label: string;
    value: string;
  }>;
}

export function Select({ className = "", id, label, options, ...props }: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <label className="ui-input-field">
      {label ? <span>{label}</span> : null}
      <select className={`ui-input ui-select ${className}`.trim()} id={selectId} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
