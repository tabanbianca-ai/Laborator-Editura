"use client";

import Link from "next/link";

import { EmptyState, ErrorState } from "../ui";
import { createUiTranslator } from "../../lib/ui-i18n";
import type { WorkspaceNavigationItem } from "../../lib/workspace-types";
import { toNavigationItems } from "./navigation";

interface SidebarNavProps {
  currentPath: string;
  navigation: WorkspaceNavigationItem[];
  navigationError?: string | null;
  platformLanguage?: string | null;
}

export function SidebarNav({
  currentPath,
  navigation,
  navigationError,
  platformLanguage
}: SidebarNavProps) {
  const ui = createUiTranslator(platformLanguage);
  const items = toNavigationItems(navigation, platformLanguage);

  return (
    <aside className="sidebar-nav">
      <div className="sidebar-brand" aria-label={ui.t("label.workspace")}>
        <span>LE</span>
        <strong>Laborator</strong>
      </div>
      <nav aria-label={ui.t("nav.primaryNavigation")} className="sidebar-nav-list">
        <Link
          aria-current={currentPath === "/pipeline" || currentPath.startsWith("/pipeline/") ? "page" : undefined}
          className={
            currentPath === "/pipeline" || currentPath.startsWith("/pipeline/")
              ? "sidebar-link sidebar-link-primary sidebar-link-active"
              : "sidebar-link sidebar-link-primary"
          }
          href="/pipeline"
        >
          <span className="sidebar-link-icon" aria-hidden="true">
            P
          </span>
          {ui.t("label.productionPipeline")}
        </Link>

        {navigationError ? (
          <ErrorState message={navigationError} title={ui.t("error.navigationUnavailable")} />
        ) : null}

        {!navigationError && items.length === 0 ? (
          <EmptyState
            description={ui.t("empty.noNavigationDescription")}
            title={ui.t("empty.noNavigation")}
          />
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
