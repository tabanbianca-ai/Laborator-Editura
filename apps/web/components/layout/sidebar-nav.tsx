"use client";

import Link from "next/link";

import { EmptyState, ErrorState } from "../ui";
import type { WorkspaceNavigationItem } from "../../lib/workspace-types";
import { toNavigationItems } from "./navigation";

interface SidebarNavProps {
  currentPath: string;
  navigation: WorkspaceNavigationItem[];
  navigationError?: string | null;
}

export function SidebarNav({ currentPath, navigation, navigationError }: SidebarNavProps) {
  const items = toNavigationItems(navigation);

  return (
    <aside className="sidebar-nav">
      <div className="sidebar-brand" aria-label="Workspace">
        <span>LE</span>
        <strong>Laborator</strong>
      </div>
      <nav aria-label="Primary navigation" className="sidebar-nav-list">
        {navigationError ? (
          <ErrorState message={navigationError} title="Navigation unavailable" />
        ) : null}

        {!navigationError && items.length === 0 ? (
          <EmptyState description="No modules are visible for this session." title="No navigation" />
        ) : null}

        {items.map((item) => {
          const isActive =
            currentPath === item.href ||
            (item.href !== "/dashboard" && currentPath.startsWith(item.href));

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={isActive ? "sidebar-link sidebar-link-active" : "sidebar-link"}
              href={item.href}
              key={item.id}
            >
              <span className="sidebar-link-icon" aria-hidden="true">
                {item.icon.slice(0, 1).toUpperCase()}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
