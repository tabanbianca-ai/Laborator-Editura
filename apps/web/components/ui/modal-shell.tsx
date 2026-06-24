import type { ReactNode } from "react";

import { Button } from "./button";

interface ModalShellProps {
  children: ReactNode;
  onClose?: () => void;
  open: boolean;
  title: string;
}

export function ModalShell({ children, onClose, open, title }: ModalShellProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="ui-modal-backdrop" role="presentation">
      <section aria-modal="true" className="ui-modal" role="dialog">
        <header className="ui-modal-header">
          <h2>{title}</h2>
          <Button aria-label="Close modal" onClick={onClose} size="sm" variant="ghost">
            Close
          </Button>
        </header>
        <div className="ui-modal-body">{children}</div>
      </section>
    </div>
  );
}
