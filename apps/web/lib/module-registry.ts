import type { WorkspaceModule } from "./workspace-types";

export interface ModuleRegistryEntry {
  module: WorkspaceModule;
  title: string;
  route: string;
  shellOnly: boolean;
}

export const moduleRegistry: Record<WorkspaceModule, ModuleRegistryEntry> = {
  DASHBOARD: { module: "DASHBOARD", title: "Dashboard", route: "/dashboard", shellOnly: false },
  MY_PROJECTS: { module: "MY_PROJECTS", title: "My Projects", route: "/projects", shellOnly: false },
  AUTHOR_STUDIO: { module: "AUTHOR_STUDIO", title: "Author Studio", route: "/author-studio", shellOnly: false },
  TRANSLATION: { module: "TRANSLATION", title: "Translation", route: "/translation", shellOnly: false },
  LEXICOGRAPHIC: { module: "LEXICOGRAPHIC", title: "Lexicographic", route: "/terminology", shellOnly: true },
  SEMANTIC_FIDELITY: { module: "SEMANTIC_FIDELITY", title: "Semantic Fidelity", route: "/semantic-fidelity", shellOnly: false },
  RESEARCH_HUB: { module: "RESEARCH_HUB", title: "Research Hub", route: "/research", shellOnly: false },
  LIBRARY: { module: "LIBRARY", title: "Library", route: "/library", shellOnly: false },
  COMMERCE: { module: "COMMERCE", title: "Commerce", route: "/export-center", shellOnly: true },
  PUBLIC_PORTAL: { module: "PUBLIC_PORTAL", title: "Public Portal", route: "/export-center", shellOnly: true },
  COLLABORATION: { module: "COLLABORATION", title: "Collaboration", route: "/workflow-center", shellOnly: true },
  MARKETPLACE: { module: "MARKETPLACE", title: "Marketplace", route: "/marketplace", shellOnly: false },
  ADMINISTRATION: { module: "ADMINISTRATION", title: "Administration", route: "/admin", shellOnly: false },
  SECURITY: { module: "SECURITY", title: "Security", route: "/admin", shellOnly: true },
  OBSERVABILITY: { module: "OBSERVABILITY", title: "Observability", route: "/reports-center", shellOnly: true },
  BACKUP: { module: "BACKUP", title: "Backup", route: "/admin", shellOnly: true },
  POLICIES: { module: "POLICIES", title: "Policies", route: "/admin", shellOnly: true }
};

export function resolveModuleRoute(moduleName: WorkspaceModule, backendRoute: string): string {
  return moduleRegistry[moduleName]?.route ?? backendRoute;
}

export function resolveModuleTitle(moduleName: WorkspaceModule, backendTitle: string): string {
  return backendTitle || moduleRegistry[moduleName]?.title || "Workspace";
}
