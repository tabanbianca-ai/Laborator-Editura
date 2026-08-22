"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import type {
  WorkspaceNavigationItem,
  WorkspacePreferences
} from "../../lib/workspace-types";
import { createUiTranslator } from "../../lib/ui-i18n";
import { LocaleSwitcher } from "./locale-switcher";
import { SidebarNav } from "./sidebar-nav";
import { TopNav } from "./top-nav";

interface AppShellProps {
  children: ReactNode;
  navigation: WorkspaceNavigationItem[];
  navigationError?: string | null;
  platformLanguage?: string | null;
  preferences?: WorkspacePreferences | null;
}

export function AppShell({
  children,
  navigation,
  navigationError = null,
  platformLanguage,
  preferences = null
}: AppShellProps) {
  const pathname = usePathname() ?? "/dashboard";
  const currentPath = pathname === "/" ? "/dashboard" : pathname;
  const collapsedMenus = preferences?.collapsedMenus?.join(",") ?? "";
  const activePlatformLanguage =
    platformLanguage ?? preferences?.platformLanguage ?? preferences?.language ?? "ro-RO";
  const ui = createUiTranslator(activePlatformLanguage);
  const publicAuthRoute = currentPath === "/login" || currentPath === "/reset-password";

  if (publicAuthRoute) {
    return (
      <div className="auth-shell">
        <LocaleSwitcher currentLocale={ui.locale} />
        {children}
      </div>
    );
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
        platformLanguage={activePlatformLanguage}
      />
      <div className="app-main">
        <LocaleSwitcher currentLocale={ui.locale} />
        <TopNav
          currentPath={currentPath}
          navigation={navigation}
          platformLanguage={activePlatformLanguage}
          preferences={preferences}
        />
        <main className="app-content" id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
