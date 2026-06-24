"use client";

import { PRODUCT_NAME } from "@laborator/shared";

import { Badge, Button } from "../ui";
import type { WorkspaceNavigationItem, WorkspacePreferences } from "../../lib/workspace-types";
import { getCurrentNavigationLabel } from "./navigation";
import { toNavigationItems } from "./navigation";

interface TopNavProps {
  currentPath: string;
  navigation: WorkspaceNavigationItem[];
  preferences?: WorkspacePreferences | null;
}

export function TopNav({ currentPath, navigation, preferences }: TopNavProps) {
  const navigationItems = toNavigationItems(navigation);
  const language = preferences?.language?.toUpperCase() ?? "RO";

  return (
    <header className="top-nav">
      <div>
        <p className="top-nav-kicker">Unified Workspace</p>
        <h1>{getCurrentNavigationLabel(currentPath, navigationItems)}</h1>
      </div>

      <div className="top-nav-meta" aria-label="Workspace status">
        <Button disabled size="sm" variant="secondary">
          Workspace
        </Button>
        <Button disabled size="sm" variant="ghost">
          User
        </Button>
        <Badge tone="neutral">{language}</Badge>
        <span>{PRODUCT_NAME}</span>
        <Badge tone="info">Closed beta</Badge>
      </div>
    </header>
  );
}
