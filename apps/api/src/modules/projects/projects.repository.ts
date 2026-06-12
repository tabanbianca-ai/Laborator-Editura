import { Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { type Project, type ProjectAuditEvent } from "./projects.types";

@Injectable()
export class DatabaseProjectsRepository {
  constructor(private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()) {}

  async createProject(project: Project): Promise<Project> {
    return this.database.insert("projects", project);
  }

  async findProjectById(id: string, organizationId: string): Promise<Project | null> {
    return this.database.findByIdForTenant<Project>("projects", id, organizationId);
  }

  async listProjects(organizationId: string): Promise<Project[]> {
    return this.database.selectForTenant<Project>("projects", organizationId);
  }

  async appendAuditEvent(event: ProjectAuditEvent): Promise<void> {
    this.database.insert("foundation_audit_events", event);
  }

  getAuditEvents(organizationId: string): ProjectAuditEvent[] {
    return this.database.selectForTenant<ProjectAuditEvent>(
      "foundation_audit_events",
      organizationId,
      (event) => event.entityType === "PROJECT"
    );
  }
}
