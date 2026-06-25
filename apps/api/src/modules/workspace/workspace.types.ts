import { type AuthenticatedRequestContext } from "../auth/request-context.types";

export type WorkspaceActor = AuthenticatedRequestContext;

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

export type WorkspaceAuditAction =
  | "WORKSPACE_LAYOUT_CREATED"
  | "WORKSPACE_NAVIGATION_GENERATED"
  | "WORKSPACE_WIDGET_CREATED"
  | "WORKSPACE_PREFERENCES_SAVED";

export interface WorkspaceLayout {
  id: string;
  organizationId: string;
  name: string;
  defaultForRoles: string[];
  dashboardRoute: "/workspace/dashboard";
  navigationRoute: "/workspace/navigation";
  visibleModules: WorkspaceModule[];
  humanFinalAuthorityRequired: true;
  aiMaySuggestDashboardLayouts: true;
  aiMaySuggestWidgets: true;
  aiMayRecommendShortcuts: true;
  aiMayAlterPermissions: false;
  aiMayExposeHiddenModules: false;
  aiMayChangePolicies: false;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: object;
}

export interface WorkspaceNavigationItem {
  id: string;
  organizationId: string;
  title: string;
  module: WorkspaceModule;
  icon: string;
  route: string;
  visible: boolean;
  order: number;
  permissionsRequired: string[];
  defaultForRoles: string[];
  organizationPolicyVisibility?: "VISIBLE" | "HIDDEN" | "RESTRICTED";
  moduleVisibility?: "VISIBLE" | "HIDDEN";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: object;
}

export interface WorkspaceWidget {
  id: string;
  organizationId: string;
  widgetType: WorkspaceWidgetType;
  title: string;
  visible: boolean;
  order: number;
  size: "SMALL" | "MEDIUM" | "LARGE";
  permissionsRequired: string[];
  defaultForRoles: string[];
  configuration: object;
  aiSuggested: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: object;
}

export interface WorkspacePreferences {
  id: string;
  organizationId: string;
  userId: string;
  favoriteModules: WorkspaceModule[];
  dashboardLayout: object;
  collapsedMenus: string[];
  themeMetadata: object;
  language: string;
  platformLanguage: string;
  notificationPreferences: object;
  aiSuggestedLayout?: object;
  createdAt: string;
  updatedAt: string;
  metadata?: object;
}

export interface WorkspaceDashboard {
  layout: WorkspaceLayout;
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

export interface WorkspaceAuditEvent {
  id: string;
  organizationId: string;
  actorId: string;
  action: WorkspaceAuditAction;
  layoutId?: string;
  navigationItemId?: string;
  widgetId?: string;
  preferenceId?: string;
  beforeState?: object;
  afterState?: object;
  humanFinalAuthority: true;
  createdAt: string;
}

export interface SaveWorkspacePreferencesInput {
  favoriteModules?: WorkspaceModule[];
  dashboardLayout?: object;
  collapsedMenus?: string[];
  themeMetadata?: object;
  language?: string;
  platformLanguage?: string;
  notificationPreferences?: object;
  aiSuggestedLayout?: object;
  metadata?: object;
}

export interface CreateWorkspaceWidgetInput {
  widgetType: WorkspaceWidgetType;
  title?: string;
  visible?: boolean;
  order?: number;
  size?: "SMALL" | "MEDIUM" | "LARGE";
  permissionsRequired?: string[];
  defaultForRoles?: string[];
  configuration?: object;
  aiSuggested?: boolean;
  metadata?: object;
}

export interface WorkspaceRepository {
  createLayout(layout: WorkspaceLayout): Promise<WorkspaceLayout>;
  listLayouts(organizationId: string): Promise<WorkspaceLayout[]>;
  createNavigationItem(item: WorkspaceNavigationItem): Promise<WorkspaceNavigationItem>;
  listNavigationItems(organizationId: string): Promise<WorkspaceNavigationItem[]>;
  createWidget(widget: WorkspaceWidget): Promise<WorkspaceWidget>;
  listWidgets(organizationId: string): Promise<WorkspaceWidget[]>;
  upsertPreferences(preferences: WorkspacePreferences): Promise<WorkspacePreferences>;
  findPreferencesByUser(userId: string, organizationId: string): Promise<WorkspacePreferences | null>;
  appendAuditEvent(event: WorkspaceAuditEvent): Promise<void>;
  listAuditEvents(organizationId: string): Promise<WorkspaceAuditEvent[]>;
}
