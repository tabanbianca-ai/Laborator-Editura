import type { HTMLAttributes, ReactNode } from "react";

interface TableProps extends HTMLAttributes<HTMLDivElement> {
  ariaLabel: string;
  children: ReactNode;
}

export function Table({
  ariaLabel,
  children,
  className = "",
  ...props
}: TableProps) {
  return (
    <div
      aria-label={`${ariaLabel} scroll area`}
      className={`ui-table-wrap ${className}`.trim()}
      role="region"
      tabIndex={0}
      {...props}
    >
      <table className="ui-table" aria-label={ariaLabel}>
        {children}
      </table>
    </div>
  );
}
