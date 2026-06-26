import { resolveModuleRoute, resolveModuleTitle } from "../../lib/module-registry";
import { translateModuleTitle, translateRouteLabel } from "../../lib/ui-i18n";
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

export function toNavigationItems(
  items: WorkspaceNavigationItem[],
  platformLanguage?: string | null
): NavigationItem[] {
  return items
    .filter((item) => item.visible)
    .sort((left, right) => left.order - right.order)
    .map((item) => ({
      href: resolveModuleRoute(item.module, item.route),
      icon: item.icon,
      id: item.id,
      label: translateModuleTitle(
        item.module,
        platformLanguage,
        resolveModuleTitle(item.module, item.title)
      ),
      module: item.module,
      order: item.order,
      permissionsRequired: item.permissionsRequired
    }));
}

export function getCurrentNavigationLabel(
  pathname: string,
  items: NavigationItem[],
  platformLanguage?: string | null
) {
  if (pathname === "/pipeline" || pathname.startsWith("/pipeline/")) {
    return translateRouteLabel("/pipeline", platformLanguage, "Production Pipeline");
  }

  if (pathname === "/magazine" || pathname.startsWith("/magazine/")) {
    return translateRouteLabel("/magazine", platformLanguage, "Magazine");
  }

  if (pathname === "/distribution") {
    return translateRouteLabel("/distribution", platformLanguage, "Distribution Center");
  }

  const current = items.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  return current?.label ?? translateRouteLabel("/dashboard", platformLanguage, "Dashboard");
}
