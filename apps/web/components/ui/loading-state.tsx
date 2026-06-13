interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Loading" }: LoadingStateProps) {
  return (
    <section className="ui-state ui-loading" aria-live="polite">
      <span className="ui-spinner" aria-hidden="true" />
      <p>{label}</p>
    </section>
  );
}
