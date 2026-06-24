import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type WorkspaceAuditEvent,
  type WorkspaceLayout,
  type WorkspaceNavigationItem,
  type WorkspacePreferences,
  type WorkspaceRepository,
  type WorkspaceWidget
} from "./workspace.types";

@Injectable()
export class DatabaseWorkspaceRepository implements WorkspaceRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createLayout(layout: WorkspaceLayout): Promise<WorkspaceLayout> {
    return this.database.insert("workspace_layouts", layout);
  }

  async listLayouts(organizationId: string): Promise<WorkspaceLayout[]> {
    return this.database.selectForTenant<WorkspaceLayout>("workspace_layouts", organizationId);
  }

  async createNavigationItem(item: WorkspaceNavigationItem): Promise<WorkspaceNavigationItem> {
    return this.database.insert("workspace_navigation_items", item);
  }

  async listNavigationItems(organizationId: string): Promise<WorkspaceNavigationItem[]> {
    return this.database.selectForTenant<WorkspaceNavigationItem>(
      "workspace_navigation_items",
      organizationId
    );
  }

  async createWidget(widget: WorkspaceWidget): Promise<WorkspaceWidget> {
    return this.database.insert("workspace_widgets", widget);
  }

  async listWidgets(organizationId: string): Promise<WorkspaceWidget[]> {
    return this.database.selectForTenant<WorkspaceWidget>("workspace_widgets", organizationId);
  }

  async upsertPreferences(preferences: WorkspacePreferences): Promise<WorkspacePreferences> {
    return this.database.upsert("workspace_preferences", preferences);
  }

  async findPreferencesByUser(
    userId: string,
    organizationId: string
  ): Promise<WorkspacePreferences | null> {
    return this.database.selectForTenant<WorkspacePreferences>(
      "workspace_preferences",
      organizationId,
      (preferences) => preferences.userId === userId
    )[0] ?? null;
  }

  async appendAuditEvent(event: WorkspaceAuditEvent): Promise<void> {
    this.database.insert("workspace_audit_events", event);
  }

  async listAuditEvents(organizationId: string): Promise<WorkspaceAuditEvent[]> {
    return this.database.selectForTenant<WorkspaceAuditEvent>("workspace_audit_events", organizationId);
  }
}
