import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type MediaLocalizationAsset,
  type MediaLocalizationAuditEvent,
  type MediaLocalizationProject,
  type MediaLocalizationRepository
} from "./media-localization.types";

@Injectable()
export class DatabaseMediaLocalizationRepository implements MediaLocalizationRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createProject(project: MediaLocalizationProject): Promise<MediaLocalizationProject> {
    return this.database.insert("media_localization_projects", project);
  }

  async updateProject(project: MediaLocalizationProject): Promise<MediaLocalizationProject> {
    return this.database.upsert("media_localization_projects", project);
  }

  async findProjectById(
    id: string,
    organizationId: string
  ): Promise<MediaLocalizationProject | null> {
    return this.database.findByIdForTenant<MediaLocalizationProject>(
      "media_localization_projects",
      id,
      organizationId
    );
  }

  async createAsset(asset: MediaLocalizationAsset): Promise<MediaLocalizationAsset> {
    return this.database.insert("media_localization_assets", asset);
  }

  async appendAuditEvent(event: MediaLocalizationAuditEvent): Promise<void> {
    this.database.insert("media_localization_audit_events", event);
  }
}
