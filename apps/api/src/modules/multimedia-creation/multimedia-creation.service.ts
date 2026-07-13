import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseMultimediaRepository } from "./multimedia-creation.repository";
import {
  type AudioProjectProfile,
  type CreateMultimediaAssetInput,
  type CreateMultimediaProjectInput,
  type IllustrationProjectProfile,
  type MultimediaActor,
  type MultimediaAsset,
  type MultimediaAuditAction,
  type MultimediaAuditTrailItem,
  type MultimediaExportHistoryItem,
  type MultimediaProject,
  type MultimediaVersionHistoryItem,
  type RecordMultimediaExportInput,
  type VideoProjectProfile
} from "./multimedia-creation.types";

@Injectable()
export class MultimediaCreationService {
  constructor(private readonly repository: DatabaseMultimediaRepository) {}

  async createProject(
    actor: MultimediaActor,
    input: CreateMultimediaProjectInput
  ): Promise<MultimediaProject> {
    this.validateActor(actor);
    this.validateCreateInput(input);

    const now = new Date().toISOString();
    const projectId = randomUUID();
    const project: MultimediaProject = {
      id: projectId,
      organizationId: actor.organizationId,
      projectId: input.projectId,
      documentId: input.documentId,
      title: input.title,
      language: input.language,
      kind: input.kind,
      illustrationProfile: input.kind === "ILLUSTRATION"
        ? this.buildIllustrationProfile(input.illustrationProfile)
        : undefined,
      audioProfile: input.kind === "AUDIO"
        ? this.buildAudioProfile(input.audioProfile)
        : undefined,
      videoProfile: input.kind === "VIDEO"
        ? this.buildVideoProfile(input.videoProfile)
        : undefined,
      assetIds: [],
      versionHistory: [
        this.versionItem(actor, now, 1, "Multimedia project created.")
      ],
      exportHistory: [],
      auditTrail: [
        this.auditTrailItem("MEDIA_PROJECT_CREATED", actor, now, 1, {
          aiMayCreateDrafts: true,
          aiMaySuggestOptimizations: true,
          aiMayRenderDrafts: true,
          humanFinalAuthority: true
        })
      ],
      approvalStatus: "PENDING_HUMAN_APPROVAL",
      humanApprovalRequired: true,
      providerIntegrationStatus: "PLACEHOLDER_ONLY",
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createProject(project);
    await this.audit("MEDIA_PROJECT_CREATED", actor, created.id, undefined, created);

    return created;
  }

  async getProject(actor: MultimediaActor, projectId: string): Promise<MultimediaProject> {
    this.validateActor(actor);

    const project = await this.repository.findProjectById(projectId, actor.organizationId);

    if (!project) {
      throw new NotFoundException("Multimedia project not found.");
    }

    return project;
  }

  async addAsset(
    actor: MultimediaActor,
    projectId: string,
    input: CreateMultimediaAssetInput
  ): Promise<MultimediaProject> {
    this.validateActor(actor);

    if (!input.assetType || !input.title) {
      throw new BadRequestException("assetType and title are required.");
    }

    const existing = await this.getProject(actor, projectId);
    const now = new Date().toISOString();
    const assetId = randomUUID();
    const asset: MultimediaAsset = {
      id: assetId,
      organizationId: actor.organizationId,
      multimediaProjectId: existing.id,
      assetType: input.assetType,
      title: input.title,
      uri: input.uri,
      language: input.language,
      sourceReferences: input.sourceReferences ?? [],
      rights: input.rights ?? {},
      versionHistory: [
        this.versionItem(actor, now, 1, "Media asset created.")
      ],
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    await this.repository.createAsset(asset);

    const nextVersion = existing.versionHistory.length + 1;
    const updated: MultimediaProject = {
      ...existing,
      assetIds: [...existing.assetIds, asset.id],
      versionHistory: [
        ...existing.versionHistory,
        this.versionItem(actor, now, nextVersion, "Media asset linked to project.")
      ],
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("MEDIA_ASSET_CREATED", actor, now, nextVersion, {
          assetId: asset.id,
          assetType: asset.assetType,
          humanFinalAuthority: true
        }),
        this.auditTrailItem("MEDIA_REVISION_CREATED", actor, now, nextVersion, {
          assetId: asset.id,
          revisionReason: "Media asset linked to project."
        })
      ],
      updatedAt: now
    };

    const saved = await this.repository.updateProject(updated);
    await this.audit("MEDIA_ASSET_CREATED", actor, saved.id, existing, saved, asset.id);
    await this.audit("MEDIA_REVISION_CREATED", actor, saved.id, existing, saved, asset.id);

    return saved;
  }

  async approveProject(actor: MultimediaActor, projectId: string): Promise<MultimediaProject> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getProject(actor, projectId);
    const now = new Date().toISOString();
    const nextVersion = existing.versionHistory.length + 1;
    const approved: MultimediaProject = {
      ...existing,
      approvalStatus: "APPROVED",
      approvedBy: actor.userId,
      approvedAt: now,
      versionHistory: [
        ...existing.versionHistory,
        this.versionItem(actor, now, nextVersion, "Media approved for publication.")
      ],
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("MEDIA_APPROVED", actor, now, nextVersion, {
          finalAuthority: "AUTHORIZED_HUMAN"
        })
      ],
      updatedAt: now
    };

    const saved = await this.repository.updateProject(approved);
    await this.audit("MEDIA_APPROVED", actor, saved.id, existing, saved);

    return saved;
  }

  async rejectProject(actor: MultimediaActor, projectId: string): Promise<MultimediaProject> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getProject(actor, projectId);
    const now = new Date().toISOString();
    const nextVersion = existing.versionHistory.length + 1;
    const rejected: MultimediaProject = {
      ...existing,
      approvalStatus: "REJECTED",
      versionHistory: [
        ...existing.versionHistory,
        this.versionItem(actor, now, nextVersion, "Media rejected by authorized human.")
      ],
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("MEDIA_REJECTED", actor, now, nextVersion, {
          finalAuthority: "AUTHORIZED_HUMAN"
        })
      ],
      updatedAt: now
    };

    const saved = await this.repository.updateProject(rejected);
    await this.audit("MEDIA_REJECTED", actor, saved.id, existing, saved);

    return saved;
  }

  async recordExport(
    actor: MultimediaActor,
    projectId: string,
    input: RecordMultimediaExportInput
  ): Promise<MultimediaProject> {
    this.validateActor(actor);

    if (!input.target) {
      throw new BadRequestException("target is required.");
    }

    const existing = await this.getProject(actor, projectId);
    const now = new Date().toISOString();
    const exportRecord: MultimediaExportHistoryItem = {
      id: randomUUID(),
      target: input.target,
      artifactUri: input.artifactUri,
      createdBy: actor.userId,
      createdAt: now
    };
    const nextVersion = existing.versionHistory.length + 1;
    const updated: MultimediaProject = {
      ...existing,
      exportHistory: [...existing.exportHistory, exportRecord],
      versionHistory: [
        ...existing.versionHistory,
        this.versionItem(actor, now, nextVersion, "Media export recorded.")
      ],
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("MEDIA_EXPORT_RECORDED", actor, now, nextVersion, {
          target: input.target,
          artifactUri: input.artifactUri,
          humanFinalAuthority: true
        })
      ],
      updatedAt: now
    };

    const saved = await this.repository.updateProject(updated);
    await this.audit("MEDIA_EXPORT_RECORDED", actor, saved.id, existing, saved);

    return saved;
  }

  private buildIllustrationProfile(
    input: Partial<IllustrationProjectProfile> = {}
  ): IllustrationProjectProfile {
    return {
      bookIllustrations: input.bookIllustrations ?? true,
      childrenBookIllustrations: input.childrenBookIllustrations ?? false,
      editorialIllustrations: input.editorialIllustrations ?? true,
      covers: input.covers ?? true,
      translatedTextReplacement: input.translatedTextReplacement ?? true,
      visualConsistencyTracking: input.visualConsistencyTracking ?? true,
      stylePresets: input.stylePresets ?? ["editorial-consistent"]
    };
  }

  private buildAudioProfile(input: Partial<AudioProjectProfile> = {}): AudioProjectProfile {
    return {
      chapterNarration: input.chapterNarration ?? true,
      audiobookMetadata: input.audiobookMetadata ?? {},
      voiceProfileIds: input.voiceProfileIds ?? [],
      synchronizedTextAudio: input.synchronizedTextAudio ?? true,
      exportTargets: input.exportTargets ?? ["MP3", "WAV", "FLAC"]
    };
  }

  private buildVideoProfile(input: Partial<VideoProjectProfile> = {}): VideoProjectProfile {
    return {
      bookTrailers: input.bookTrailers ?? true,
      educationalVideos: input.educationalVideos ?? true,
      reelsShorts: input.reelsShorts ?? true,
      subtitleTrackIds: input.subtitleTrackIds ?? [],
      narrationSynchronization: input.narrationSynchronization ?? true,
      linkedAssetIds: input.linkedAssetIds ?? []
    };
  }

  private async audit(
    action: MultimediaAuditAction,
    actor: MultimediaActor,
    multimediaProjectId: string,
    beforeState: MultimediaProject | MultimediaAsset | undefined,
    afterState: MultimediaProject | MultimediaAsset,
    multimediaAssetId?: string
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      multimediaProjectId,
      multimediaAssetId,
      action,
      actorId: actor.userId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private versionItem(
    actor: MultimediaActor,
    createdAt: string,
    version: number,
    notes: string
  ): MultimediaVersionHistoryItem {
    return {
      id: randomUUID(),
      version,
      createdBy: actor.userId,
      createdAt,
      notes
    };
  }

  private auditTrailItem(
    action: MultimediaAuditAction,
    actor: MultimediaActor,
    at: string,
    version: number,
    details?: object
  ): MultimediaAuditTrailItem {
    return {
      id: randomUUID(),
      action,
      actorId: actor.userId,
      at,
      version,
      details
    };
  }

  private validateActor(actor: MultimediaActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

  private validateCreateInput(input: CreateMultimediaProjectInput): void {
    if (!input.kind || !input.title || !input.language) {
      throw new BadRequestException("kind, title and language are required.");
    }
  }

  private assertAuthorizedHuman(actor: MultimediaActor): void {
    const permissions = new Set(actor.permissions ?? []);
    const roles = new Set((actor.roles ?? []).map((role) => role.toUpperCase()));

    if (
      !permissions.has("review:approve") &&
      !roles.has("PLATFORM_CREATOR") &&
      !roles.has("ADMIN") &&
      !roles.has("REVIEWER")
    ) {
      throw new ForbiddenException("Only authorized humans may approve media for publication.");
    }
  }
}
