"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { SidebarNav } from "./sidebar-nav";
import { TopNav } from "./top-nav";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname() ?? "/dashboard";
  const currentPath = pathname === "/" ? "/dashboard" : pathname;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SidebarNav currentPath={currentPath} />
      <div className="app-main">
        <TopNav currentPath={currentPath} />
        <main className="app-content" id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
