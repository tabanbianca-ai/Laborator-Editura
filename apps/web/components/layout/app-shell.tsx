"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import type { WorkspaceNavigationItem, WorkspacePreferences } from "../../lib/workspace-types";
import { createUiTranslator } from "../../lib/ui-i18n";
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
  const platformLanguage = preferences?.platformLanguage ?? preferences?.language ?? "en";
  const ui = createUiTranslator(platformLanguage);
  const publicAuthRoute = currentPath === "/login" || currentPath === "/reset-password";

  if (publicAuthRoute) {
    return <div className="auth-shell">{children}</div>;
  }

  return (
    <div className="app-shell" data-collapsed-menus={collapsedMenus}>
      <a className="skip-link" href="#main-content">
        {ui.t("nav.skipToContent")}
      </a>
      <SidebarNav
        currentPath={currentPath}
        navigation={navigation}
        navigationError={navigationError}
        platformLanguage={platformLanguage}
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
