export interface NavigationItem {
  href: string;
  label: string;
}

export const mainNavigation: NavigationItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/documents", label: "Documents" },
  { href: "/editor", label: "Translation Editor" },
  { href: "/translation-memory", label: "Translation Memory" },
  { href: "/terminology", label: "Terminology" },
  { href: "/qa-center", label: "QA Center" },
  { href: "/semantic-fidelity", label: "Semantic Fidelity" },
  { href: "/workflow-center", label: "Workflow Center" },
  { href: "/export-center", label: "Export Center" },
  { href: "/reports-center", label: "Reports Center" },
  { href: "/administration", label: "Administration" }
];

export function getCurrentNavigationLabel(pathname: string) {
  const current = mainNavigation.find((item) => pathname.startsWith(item.href));

  return current?.label ?? "Dashboard";
}
