export type WorkspaceModule =
  | "DASHBOARD"
  | "MY_PROJECTS"
  | "AUTHOR_STUDIO"
  | "TRANSLATION"
  | "LEXICOGRAPHIC"
  | "SEMANTIC_FIDELITY"
  | "RESEARCH_HUB"
  | "LIBRARY"
  | "COMMERCE"
  | "PUBLIC_PORTAL"
  | "COLLABORATION"
  | "MARKETPLACE"
  | "ADMINISTRATION"
  | "SECURITY"
  | "OBSERVABILITY"
  | "BACKUP"
  | "POLICIES";

export type WorkspaceWidgetType =
  | "RECENT_PROJECTS"
  | "ASSIGNED_TASKS"
  | "TRANSLATION_PROGRESS"
  | "RESEARCH_ACTIVITY"
  | "AI_USAGE"
  | "BUDGET_USAGE"
  | "SECURITY_ALERTS"
  | "BACKUP_STATUS"
  | "PUBLISHING_STATUS"
  | "MARKETPLACE_AGENTS"
  | "OBSERVABILITY_SUMMARY";

export interface WorkspaceNavigationItem {
  id: string;
  title: string;
  module: WorkspaceModule;
  icon: string;
  route: string;
  visible: boolean;
  order: number;
  permissionsRequired: string[];
  defaultForRoles: string[];
}

export interface WorkspaceWidget {
  id: string;
  widgetType: WorkspaceWidgetType;
  title: string;
  visible: boolean;
  order: number;
  size: "SMALL" | "MEDIUM" | "LARGE";
  permissionsRequired: string[];
  defaultForRoles: string[];
  configuration: object;
  aiSuggested: boolean;
}

export interface WorkspacePreferences {
  id: string;
  userId: string;
  favoriteModules: WorkspaceModule[];
  dashboardLayout: object;
  collapsedMenus: string[];
  themeMetadata: {
    theme?: string;
    [key: string]: unknown;
  };
  language: string;
  notificationPreferences: object;
}

export interface WorkspaceDashboard {
  layout: {
    id: string;
    name: string;
    visibleModules: WorkspaceModule[];
  };
  navigation: WorkspaceNavigationItem[];
  widgets: WorkspaceWidget[];
  preferences: WorkspacePreferences;
  generatedFor: {
    userId: string;
    organizationId: string;
    roles: string[];
    permissions: string[];
  };
}
