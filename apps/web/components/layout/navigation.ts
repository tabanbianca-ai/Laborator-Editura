import { resolveModuleRoute, resolveModuleTitle } from "../../lib/module-registry";
import type { WorkspaceNavigationItem } from "../../lib/workspace-types";

export interface NavigationItem {
  href: string;
  icon: string;
  id: string;
  label: string;
  module: string;
  order: number;
  permissionsRequired: string[];
}

export function toNavigationItems(items: WorkspaceNavigationItem[]): NavigationItem[] {
  return items
    .filter((item) => item.visible)
    .sort((left, right) => left.order - right.order)
    .map((item) => ({
      href: resolveModuleRoute(item.module, item.route),
      icon: item.icon,
      id: item.id,
      label: resolveModuleTitle(item.module, item.title),
      module: item.module,
      order: item.order,
      permissionsRequired: item.permissionsRequired
    }));
}

export function getCurrentNavigationLabel(pathname: string, items: NavigationItem[]) {
  if (pathname === "/pipeline" || pathname.startsWith("/pipeline/")) {
    return "Production Pipeline";
  }

  if (pathname === "/magazine" || pathname.startsWith("/magazine/")) {
    return "Magazine";
  }

  if (pathname === "/distribution") {
    return "Distribution Center";
  }

  const current = items.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  return current?.label ?? "Dashboard";
}
