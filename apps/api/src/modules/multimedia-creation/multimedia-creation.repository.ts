import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type MultimediaAsset,
  type MultimediaAuditEvent,
  type MultimediaProject,
  type MultimediaRepository
} from "./multimedia-creation.types";

@Injectable()
export class DatabaseMultimediaRepository implements MultimediaRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createProject(project: MultimediaProject): Promise<MultimediaProject> {
    return this.database.insert("multimedia_projects", project);
  }

  async updateProject(project: MultimediaProject): Promise<MultimediaProject> {
    return this.database.upsert("multimedia_projects", project);
  }

  async findProjectById(id: string, organizationId: string): Promise<MultimediaProject | null> {
    return this.database.findByIdForTenant<MultimediaProject>(
      "multimedia_projects",
      id,
      organizationId
    );
  }

  async createAsset(asset: MultimediaAsset): Promise<MultimediaAsset> {
    return this.database.insert("multimedia_assets", asset);
  }

  async appendAuditEvent(event: MultimediaAuditEvent): Promise<void> {
    this.database.insert("multimedia_audit_events", event);
  }
}
