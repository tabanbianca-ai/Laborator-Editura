import type { ReactNode } from "react";

interface EmptyStateProps {
  action?: ReactNode;
  description?: string;
  title: string;
}

export function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <section className="ui-state" aria-label={title}>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
      {action ? <div className="ui-state-action">{action}</div> : null}
    </section>
  );
}
