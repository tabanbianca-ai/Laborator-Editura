"use client";

import Link from "next/link";

import { mainNavigation } from "./navigation";

interface SidebarNavProps {
  currentPath: string;
}

export function SidebarNav({ currentPath }: SidebarNavProps) {
  return (
    <aside className="sidebar-nav">
      <nav aria-label="Primary navigation" className="sidebar-nav-list">
        {mainNavigation.map((item) => {
          const isActive =
            currentPath === item.href ||
            (item.href !== "/dashboard" && currentPath.startsWith(item.href));

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={isActive ? "sidebar-link sidebar-link-active" : "sidebar-link"}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
