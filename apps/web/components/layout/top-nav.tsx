"use client";

import { PRODUCT_NAME } from "@laborator/shared";

import { Badge } from "../ui";
import { getCurrentNavigationLabel } from "./navigation";

interface TopNavProps {
  currentPath: string;
}

export function TopNav({ currentPath }: TopNavProps) {
  return (
    <header className="top-nav">
      <div>
        <p className="top-nav-kicker">MVP Workspace</p>
        <h1>{getCurrentNavigationLabel(currentPath)}</h1>
      </div>

      <div className="top-nav-meta" aria-label="Workspace status">
        <span>{PRODUCT_NAME}</span>
        <Badge tone="info">Closed beta</Badge>
      </div>
    </header>
  );
}
