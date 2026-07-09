import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type Project,
  type ProjectAuditEvent,
  type ProjectDossier,
  type ProjectDossierItem
} from "./projects.types";

@Injectable()
export class DatabaseProjectsRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createProject(project: Project): Promise<Project> {
    return this.database.insert("projects", project);
  }

  async findProjectById(id: string, organizationId: string): Promise<Project | null> {
    return this.database.findByIdForTenant<Project>("projects", id, organizationId);
  }

  async listProjects(organizationId: string): Promise<Project[]> {
    return this.database.selectForTenant<Project>("projects", organizationId);
  }

  async createDossier(dossier: ProjectDossier): Promise<ProjectDossier> {
    return this.database.insert("project_dossiers", dossier);
  }

  async findDossierById(
    dossierId: string,
    organizationId: string
  ): Promise<ProjectDossier | null> {
    return this.database.findByIdForTenant<ProjectDossier>(
      "project_dossiers",
      dossierId,
      organizationId
    );
  }

  async listDossiers(projectId: string, organizationId: string): Promise<ProjectDossier[]> {
    return this.database.selectForTenant<ProjectDossier>(
      "project_dossiers",
      organizationId,
      (dossier) => dossier.projectId === projectId
    );
  }

  async assignDossierItem(item: ProjectDossierItem): Promise<ProjectDossierItem> {
    return this.database.upsert("project_dossier_items", item);
  }

  async listDossierItems(projectId: string, organizationId: string): Promise<ProjectDossierItem[]> {
    return this.database.selectForTenant<ProjectDossierItem>(
      "project_dossier_items",
      organizationId,
      (item) => item.projectId === projectId
    );
  }

  async appendAuditEvent(event: ProjectAuditEvent): Promise<void> {
    this.database.insert("foundation_audit_events", event);
  }

  getAuditEvents(organizationId: string): ProjectAuditEvent[] {
    return this.database.selectForTenant<ProjectAuditEvent>(
      "foundation_audit_events",
      organizationId,
      (event) =>
        event.entityType === "PROJECT" ||
        event.entityType === "PROJECT_DOSSIER" ||
        event.entityType === "PROJECT_DOSSIER_ITEM"
    );
  }
}
