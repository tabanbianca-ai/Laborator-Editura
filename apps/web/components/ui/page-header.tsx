import type { ReactNode } from "react";

interface PageHeaderProps {
  actions?: ReactNode;
  eyebrow?: string;
  title: string;
}

export function PageHeader({ actions, eyebrow, title }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        {eyebrow ? <p className="section-kicker">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </header>
  );
}
