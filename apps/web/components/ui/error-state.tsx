import type { ReactNode } from "react";

interface ErrorStateProps {
  action?: ReactNode;
  message: string;
  title?: string;
}

export function ErrorState({
  action,
  message,
  title = "Something needs attention"
}: ErrorStateProps) {
  return (
    <section className="ui-state ui-error" role="alert">
      <h2>{title}</h2>
      <p>{message}</p>
      {action ? <div className="ui-state-action">{action}</div> : null}
    </section>
  );
}
