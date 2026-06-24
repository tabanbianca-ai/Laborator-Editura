"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import type { WorkspaceNavigationItem, WorkspacePreferences } from "../../lib/workspace-types";
import { SidebarNav } from "./sidebar-nav";
import { TopNav } from "./top-nav";

interface AppShellProps {
  children: ReactNode;
  navigation: WorkspaceNavigationItem[];
  navigationError?: string | null;
  preferences?: WorkspacePreferences | null;
}

export function AppShell({
  children,
  navigation,
  navigationError = null,
  preferences = null
}: AppShellProps) {
  const pathname = usePathname() ?? "/dashboard";
  const currentPath = pathname === "/" ? "/dashboard" : pathname;
  const collapsedMenus = preferences?.collapsedMenus?.join(",") ?? "";

  return (
    <div className="app-shell" data-collapsed-menus={collapsedMenus}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SidebarNav
        currentPath={currentPath}
        navigation={navigation}
        navigationError={navigationError}
      />
      <div className="app-main">
        <TopNav currentPath={currentPath} navigation={navigation} preferences={preferences} />
        <main className="app-content" id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
