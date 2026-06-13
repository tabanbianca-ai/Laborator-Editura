import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  footer?: ReactNode;
  title?: string;
}

export function Card({
  children,
  className = "",
  footer,
  title,
  ...props
}: CardProps) {
  return (
    <article className={`ui-card ${className}`.trim()} {...props}>
      {title ? <h2 className="ui-card-title">{title}</h2> : null}
      <div className="ui-card-body">{children}</div>
      {footer ? <div className="ui-card-footer">{footer}</div> : null}
    </article>
  );
}
