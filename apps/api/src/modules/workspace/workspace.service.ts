import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseWorkspaceRepository } from "./workspace.repository";
import {
  type CreateWorkspaceWidgetInput,
  type SaveWorkspacePreferencesInput,
  type WorkspaceActor,
  type WorkspaceAuditAction,
  type WorkspaceAuditEvent,
  type WorkspaceDashboard,
  type WorkspaceLayout,
  type WorkspaceModule,
  type WorkspaceNavigationItem,
  type WorkspacePreferences,
  type WorkspaceWidget
} from "./workspace.types";

const DEFAULT_NAVIGATION: Array<Omit<
  WorkspaceNavigationItem,
  "id" | "organizationId" | "createdBy" | "createdAt" | "updatedAt"
>> = [
  { title: "Dashboard", module: "DASHBOARD", icon: "layout-dashboard", route: "/dashboard", visible: true, order: 1, permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR", "VIEWER"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "My Projects", module: "MY_PROJECTS", icon: "folder-kanban", route: "/projects", visible: true, order: 2, permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Author Studio", module: "AUTHOR_STUDIO", icon: "pen-tool", route: "/author-studio", visible: true, order: 3, permissionsRequired: ["document:write"], defaultForRoles: ["ADMIN", "TRANSLATOR"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Translation", module: "TRANSLATION", icon: "languages", route: "/translation-editor", visible: true, order: 4, permissionsRequired: ["translation:write"], defaultForRoles: ["ADMIN", "TRANSLATOR"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Lexicographic", module: "LEXICOGRAPHIC", icon: "book-open-text", route: "/lexicographic", visible: true, order: 5, permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Semantic Fidelity", module: "SEMANTIC_FIDELITY", icon: "scan-search", route: "/semantic-fidelity", visible: true, order: 6, permissionsRequired: ["review:approve"], defaultForRoles: ["ADMIN", "REVIEWER"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Research Hub", module: "RESEARCH_HUB", icon: "library-big", route: "/research", visible: true, order: 7, permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR", "VIEWER"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Library", module: "LIBRARY", icon: "book-marked", route: "/library", visible: true, order: 8, permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR", "VIEWER"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Commerce", module: "COMMERCE", icon: "store", route: "/commerce", visible: true, order: 9, permissionsRequired: ["export:write"], defaultForRoles: ["ADMIN", "REVIEWER"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Public Portal", module: "PUBLIC_PORTAL", icon: "globe", route: "/public-portal", visible: true, order: 10, permissionsRequired: ["export:write"], defaultForRoles: ["ADMIN", "REVIEWER"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Collaboration", module: "COLLABORATION", icon: "messages-square", route: "/collaboration", visible: true, order: 11, permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR", "VIEWER"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Marketplace", module: "MARKETPLACE", icon: "boxes", route: "/marketplace", visible: true, order: 12, permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Administration", module: "ADMINISTRATION", icon: "shield-user", route: "/admin", visible: true, order: 13, permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Security", module: "SECURITY", icon: "shield-check", route: "/security", visible: true, order: 14, permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Observability", module: "OBSERVABILITY", icon: "activity", route: "/observability", visible: true, order: 15, permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Backup", module: "BACKUP", icon: "archive-restore", route: "/backup", visible: true, order: 16, permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" },
  { title: "Policies", module: "POLICIES", icon: "file-check-2", route: "/policies", visible: true, order: 17, permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], organizationPolicyVisibility: "VISIBLE", moduleVisibility: "VISIBLE" }
];

const DEFAULT_WIDGETS: Array<Omit<
  WorkspaceWidget,
  "id" | "organizationId" | "createdBy" | "createdAt" | "updatedAt"
>> = [
  { widgetType: "RECENT_PROJECTS", title: "Recent projects", visible: true, order: 1, size: "MEDIUM", permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR", "VIEWER"], configuration: {}, aiSuggested: false },
  { widgetType: "ASSIGNED_TASKS", title: "Assigned tasks", visible: true, order: 2, size: "MEDIUM", permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR"], configuration: {}, aiSuggested: false },
  { widgetType: "TRANSLATION_PROGRESS", title: "Translation progress", visible: true, order: 3, size: "LARGE", permissionsRequired: ["translation:write"], defaultForRoles: ["ADMIN", "TRANSLATOR"], configuration: {}, aiSuggested: false },
  { widgetType: "RESEARCH_ACTIVITY", title: "Research activity", visible: true, order: 4, size: "MEDIUM", permissionsRequired: ["read"], defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR"], configuration: {}, aiSuggested: false },
  { widgetType: "AI_USAGE", title: "AI usage", visible: true, order: 5, size: "SMALL", permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], configuration: {}, aiSuggested: false },
  { widgetType: "BUDGET_USAGE", title: "Budget usage", visible: true, order: 6, size: "SMALL", permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], configuration: {}, aiSuggested: false },
  { widgetType: "SECURITY_ALERTS", title: "Security alerts", visible: true, order: 7, size: "MEDIUM", permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], configuration: {}, aiSuggested: false },
  { widgetType: "BACKUP_STATUS", title: "Backup status", visible: true, order: 8, size: "SMALL", permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], configuration: {}, aiSuggested: false },
  { widgetType: "PUBLISHING_STATUS", title: "Publishing status", visible: true, order: 9, size: "MEDIUM", permissionsRequired: ["export:write"], defaultForRoles: ["ADMIN", "REVIEWER"], configuration: {}, aiSuggested: false },
  { widgetType: "MARKETPLACE_AGENTS", title: "Marketplace agents", visible: true, order: 10, size: "SMALL", permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], configuration: {}, aiSuggested: false },
  { widgetType: "OBSERVABILITY_SUMMARY", title: "Observability summary", visible: true, order: 11, size: "MEDIUM", permissionsRequired: ["read"], defaultForRoles: ["ADMIN"], configuration: {}, aiSuggested: false }
];

@Injectable()
export class WorkspaceService {
  constructor(private readonly repository: DatabaseWorkspaceRepository) {}

  async getNavigation(actor: WorkspaceActor): Promise<WorkspaceNavigationItem[]> {
    const navigation = await this.ensureNavigation(actor);
    const filtered = navigation
      .filter((item) => this.isNavigationItemVisible(actor, item))
      .sort((left, right) => left.order - right.order);

    await this.audit("WORKSPACE_NAVIGATION_GENERATED", actor, {}, {
      visibleModules: filtered.map((item) => item.module)
    });

    return filtered;
  }

  async getDashboard(actor: WorkspaceActor): Promise<WorkspaceDashboard> {
    const [layout, navigation, widgets, preferences] = await Promise.all([
      this.ensureLayout(actor),
      this.getNavigation(actor),
      this.getWidgets(actor),
      this.getPreferences(actor)
    ]);

    return {
      layout,
      navigation,
      widgets,
      preferences,
      generatedFor: {
        userId: actor.userId,
        organizationId: actor.organizationId,
        roles: actor.roles,
        permissions: actor.permissions
      }
    };
  }

  async getPreferences(actor: WorkspaceActor): Promise<WorkspacePreferences> {
    const existing = await this.repository.findPreferencesByUser(actor.userId, actor.organizationId);

    if (existing) {
      return existing;
    }

    return this.savePreferences(actor, {
      favoriteModules: ["DASHBOARD", "MY_PROJECTS"],
      dashboardLayout: { columns: 3, density: "comfortable" },
      collapsedMenus: [],
      themeMetadata: { theme: "system" },
      language: "ro",
      notificationPreferences: { email: false, inApp: true },
      metadata: { generatedDefault: true }
    });
  }

  async savePreferences(
    actor: WorkspaceActor,
    input: SaveWorkspacePreferencesInput
  ): Promise<WorkspacePreferences> {
    const existing = await this.repository.findPreferencesByUser(actor.userId, actor.organizationId);
    const now = new Date().toISOString();
    const preferences: WorkspacePreferences = {
      id: existing?.id ?? randomUUID(),
      organizationId: actor.organizationId,
      userId: actor.userId,
      favoriteModules: input.favoriteModules ?? existing?.favoriteModules ?? ["DASHBOARD"],
      dashboardLayout: input.dashboardLayout ?? existing?.dashboardLayout ?? {},
      collapsedMenus: input.collapsedMenus ?? existing?.collapsedMenus ?? [],
      themeMetadata: input.themeMetadata ?? existing?.themeMetadata ?? { theme: "system" },
      language: input.language ?? existing?.language ?? "ro",
      notificationPreferences:
        input.notificationPreferences ?? existing?.notificationPreferences ?? { inApp: true },
      aiSuggestedLayout: input.aiSuggestedLayout ?? existing?.aiSuggestedLayout,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      metadata: {
        ...(existing?.metadata ?? {}),
        ...(input.metadata ?? {}),
        aiMayAlterPermissions: false,
        aiMayExposeHiddenModules: false,
        aiMayChangePolicies: false
      }
    };

    const saved = await this.repository.upsertPreferences(preferences);
    await this.audit(
      "WORKSPACE_PREFERENCES_SAVED",
      actor,
      { preferenceId: saved.id },
      saved,
      existing ?? undefined
    );

    return saved;
  }

  async getWidgets(actor: WorkspaceActor): Promise<WorkspaceWidget[]> {
    const widgets = await this.ensureWidgets(actor);

    return widgets
      .filter((widget) => this.isWidgetVisible(actor, widget))
      .sort((left, right) => left.order - right.order);
  }

  async createWidget(actor: WorkspaceActor, input: CreateWorkspaceWidgetInput): Promise<WorkspaceWidget> {
    const now = new Date().toISOString();
    const widget: WorkspaceWidget = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      widgetType: input.widgetType,
      title: input.title ?? input.widgetType,
      visible: input.visible ?? true,
      order: input.order ?? 100,
      size: input.size ?? "MEDIUM",
      permissionsRequired: input.permissionsRequired ?? ["read"],
      defaultForRoles: input.defaultForRoles ?? actor.roles,
      configuration: input.configuration ?? {},
      aiSuggested: input.aiSuggested ?? false,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: {
        ...(input.metadata ?? {}),
        humanFinalAuthorityRequired: true,
        aiMaySuggestWidgets: true,
        aiMayAlterPermissions: false
      }
    };

    const created = await this.repository.createWidget(widget);
    await this.audit("WORKSPACE_WIDGET_CREATED", actor, { widgetId: created.id }, created);

    return created;
  }

  async listAudit(actor: WorkspaceActor): Promise<WorkspaceAuditEvent[]> {
    return this.repository.listAuditEvents(actor.organizationId);
  }

  private async ensureLayout(actor: WorkspaceActor): Promise<WorkspaceLayout> {
    const existing = await this.repository.listLayouts(actor.organizationId);
    const firstLayout = existing[0];

    if (firstLayout) {
      return firstLayout;
    }

    const now = new Date().toISOString();
    const layout: WorkspaceLayout = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      name: "Unified Enterprise Workspace",
      defaultForRoles: ["ADMIN", "REVIEWER", "TRANSLATOR", "VIEWER"],
      dashboardRoute: "/workspace/dashboard",
      navigationRoute: "/workspace/navigation",
      visibleModules: DEFAULT_NAVIGATION.map((item) => item.module),
      humanFinalAuthorityRequired: true,
      aiMaySuggestDashboardLayouts: true,
      aiMaySuggestWidgets: true,
      aiMayRecommendShortcuts: true,
      aiMayAlterPermissions: false,
      aiMayExposeHiddenModules: false,
      aiMayChangePolicies: false,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: {
        backendOnly: true,
        frontendImplementation: "NOT_CONFIGURED"
      }
    };

    const created = await this.repository.createLayout(layout);
    await this.audit("WORKSPACE_LAYOUT_CREATED", actor, { layoutId: created.id }, created);

    return created;
  }

  private async ensureNavigation(actor: WorkspaceActor): Promise<WorkspaceNavigationItem[]> {
    const existing = await this.repository.listNavigationItems(actor.organizationId);

    if (existing.length > 0) {
      return existing;
    }

    const now = new Date().toISOString();
    const created: WorkspaceNavigationItem[] = [];

    for (const item of DEFAULT_NAVIGATION) {
      created.push(
        await this.repository.createNavigationItem({
          ...item,
          id: randomUUID(),
          organizationId: actor.organizationId,
          createdBy: actor.userId,
          createdAt: now,
          updatedAt: now,
          metadata: {
            generatedDefault: true,
            roleBasedNavigation: true
          }
        })
      );
    }

    return created;
  }

  private async ensureWidgets(actor: WorkspaceActor): Promise<WorkspaceWidget[]> {
    const existing = await this.repository.listWidgets(actor.organizationId);

    if (existing.length > 0) {
      return existing;
    }

    const now = new Date().toISOString();
    const created: WorkspaceWidget[] = [];

    for (const widget of DEFAULT_WIDGETS) {
      created.push(
        await this.repository.createWidget({
          ...widget,
          id: randomUUID(),
          organizationId: actor.organizationId,
          createdBy: actor.userId,
          createdAt: now,
          updatedAt: now,
          metadata: {
            generatedDefault: true,
            roleBasedDashboard: true
          }
        })
      );
    }

    return created;
  }

  private isNavigationItemVisible(actor: WorkspaceActor, item: WorkspaceNavigationItem): boolean {
    if (!item.visible || item.moduleVisibility === "HIDDEN" || item.organizationPolicyVisibility === "HIDDEN") {
      return false;
    }

    return this.hasRole(actor, item.defaultForRoles) && this.hasPermissions(actor, item.permissionsRequired);
  }

  private isWidgetVisible(actor: WorkspaceActor, widget: WorkspaceWidget): boolean {
    return widget.visible && this.hasRole(actor, widget.defaultForRoles) && this.hasPermissions(actor, widget.permissionsRequired);
  }

  private hasRole(actor: WorkspaceActor, allowedRoles: string[]): boolean {
    return allowedRoles.length === 0 || actor.roles.some((role) => allowedRoles.includes(role));
  }

  private hasPermissions(actor: WorkspaceActor, requiredPermissions: string[]): boolean {
    return requiredPermissions.length === 0 ||
      requiredPermissions.every((permission) => actor.permissions.includes(permission as never));
  }

  private async audit(
    action: WorkspaceAuditAction,
    actor: WorkspaceActor,
    refs: {
      layoutId?: string;
      navigationItemId?: string;
      widgetId?: string;
      preferenceId?: string;
    },
    afterState?: object,
    beforeState?: object
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      actorId: actor.userId,
      action,
      ...refs,
      beforeState,
      afterState,
      humanFinalAuthority: true,
      createdAt: new Date().toISOString()
    });
  }
}
