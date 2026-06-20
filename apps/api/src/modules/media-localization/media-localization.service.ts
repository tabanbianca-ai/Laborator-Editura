import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseMediaLocalizationRepository } from "./media-localization.repository";
import {
  type CreateMediaLocalizationAssetInput,
  type CreateMediaLocalizationProjectInput,
  type ImageLocalizationProfile,
  type MediaLocalizationActor,
  type MediaLocalizationAsset,
  type MediaLocalizationAuditAction,
  type MediaLocalizationAuditTrailItem,
  type MediaLocalizationProject,
  type MediaLocalizationQaProfile,
  type MediaLocalizationVersionHistoryItem,
  type SubtitleLocalizationProfile,
  type VideoLocalizationProfile,
  type VoiceOverDubbingProfile
} from "./media-localization.types";

@Injectable()
export class MediaLocalizationService {
  constructor(private readonly repository: DatabaseMediaLocalizationRepository) {}

  async createProject(
    actor: MediaLocalizationActor,
    input: CreateMediaLocalizationProjectInput
  ): Promise<MediaLocalizationProject> {
    this.validateActor(actor);
    this.validateCreateInput(input);

    const now = new Date().toISOString();
    const project: MediaLocalizationProject = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      projectId: input.projectId,
      documentId: input.documentId,
      multimediaProjectId: input.multimediaProjectId,
      layoutPublicationPlanId: input.layoutPublicationPlanId,
      title: input.title,
      sourceLanguage: input.sourceLanguage,
      targetLanguages: input.targetLanguages,
      projectKind: input.projectKind,
      imageLocalization: this.buildImageLocalization(input.imageLocalization),
      subtitleLocalization: this.buildSubtitleLocalization(input.subtitleLocalization),
      voiceOverDubbing: this.buildVoiceOverDubbing(input.voiceOverDubbing),
      videoLocalization: this.buildVideoLocalization(input.videoLocalization),
      localizationQa: this.buildLocalizationQa(input.localizationQa),
      assetIds: [],
      versionHistory: [
        this.versionItem(actor, now, 1, "Media localization project created.")
      ],
      auditTrail: [
        this.auditTrailItem("MEDIA_LOCALIZATION_PROJECT_CREATED", actor, now, 1, {
          aiMayLocalize: true,
          aiMaySynchronize: true,
          aiMaySuggestAdaptations: true,
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
    await this.audit("MEDIA_LOCALIZATION_PROJECT_CREATED", actor, created.id, undefined, created);

    return created;
  }

  async getProject(
    actor: MediaLocalizationActor,
    projectId: string
  ): Promise<MediaLocalizationProject> {
    this.validateActor(actor);

    const project = await this.repository.findProjectById(projectId, actor.organizationId);

    if (!project) {
      throw new NotFoundException("Media localization project not found.");
    }

    return project;
  }

  async addAsset(
    actor: MediaLocalizationActor,
    projectId: string,
    input: CreateMediaLocalizationAssetInput
  ): Promise<MediaLocalizationProject> {
    this.validateActor(actor);

    if (!input.assetType || !input.title || !input.language) {
      throw new BadRequestException("assetType, title and language are required.");
    }

    const existing = await this.getProject(actor, projectId);
    const now = new Date().toISOString();
    const asset: MediaLocalizationAsset = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      mediaLocalizationProjectId: existing.id,
      assetType: input.assetType,
      title: input.title,
      language: input.language,
      sourceUri: input.sourceUri,
      localizedUri: input.localizedUri,
      sourceReferences: input.sourceReferences ?? [],
      timingMetadata: input.timingMetadata,
      captionStyles: input.captionStyles,
      synchronizationMetadata: input.synchronizationMetadata,
      typographyStyle: input.typographyStyle,
      qaEvidence: this.buildLocalizationQa(input.qaEvidence),
      versionHistory: [
        this.versionItem(actor, now, 1, "Media localization asset created.")
      ],
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    await this.repository.createAsset(asset);

    const nextVersion = existing.versionHistory.length + 1;
    const updated: MediaLocalizationProject = {
      ...existing,
      assetIds: [...existing.assetIds, asset.id],
      versionHistory: [
        ...existing.versionHistory,
        this.versionItem(actor, now, nextVersion, "Media localization asset linked.")
      ],
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("MEDIA_LOCALIZATION_ASSET_CREATED", actor, now, nextVersion, {
          assetId: asset.id,
          assetType: asset.assetType,
          glossaryPrecedence: asset.qaEvidence.glossaryPrecedence
        }),
        this.auditTrailItem("MEDIA_LOCALIZATION_REVISION_CREATED", actor, now, nextVersion, {
          assetId: asset.id,
          revisionReason: "Localized asset linked to project."
        })
      ],
      updatedAt: now
    };

    const saved = await this.repository.updateProject(updated);
    await this.audit("MEDIA_LOCALIZATION_ASSET_CREATED", actor, saved.id, existing, saved, asset.id);
    await this.audit("MEDIA_LOCALIZATION_REVISION_CREATED", actor, saved.id, existing, saved, asset.id);

    return saved;
  }

  async approveProject(
    actor: MediaLocalizationActor,
    projectId: string
  ): Promise<MediaLocalizationProject> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getProject(actor, projectId);
    const now = new Date().toISOString();
    const nextVersion = existing.versionHistory.length + 1;
    const approved: MediaLocalizationProject = {
      ...existing,
      approvalStatus: "APPROVED",
      approvedBy: actor.userId,
      approvedAt: now,
      versionHistory: [
        ...existing.versionHistory,
        this.versionItem(actor, now, nextVersion, "Media localization approved for publication.")
      ],
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("MEDIA_LOCALIZATION_APPROVED", actor, now, nextVersion, {
          finalAuthority: "AUTHORIZED_HUMAN"
        })
      ],
      updatedAt: now
    };

    const saved = await this.repository.updateProject(approved);
    await this.audit("MEDIA_LOCALIZATION_APPROVED", actor, saved.id, existing, saved);

    return saved;
  }

  async rejectProject(
    actor: MediaLocalizationActor,
    projectId: string
  ): Promise<MediaLocalizationProject> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getProject(actor, projectId);
    const now = new Date().toISOString();
    const nextVersion = existing.versionHistory.length + 1;
    const rejected: MediaLocalizationProject = {
      ...existing,
      approvalStatus: "REJECTED",
      versionHistory: [
        ...existing.versionHistory,
        this.versionItem(actor, now, nextVersion, "Media localization rejected by authorized human.")
      ],
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("MEDIA_LOCALIZATION_REJECTED", actor, now, nextVersion, {
          finalAuthority: "AUTHORIZED_HUMAN"
        })
      ],
      updatedAt: now
    };

    const saved = await this.repository.updateProject(rejected);
    await this.audit("MEDIA_LOCALIZATION_REJECTED", actor, saved.id, existing, saved);

    return saved;
  }

  private buildImageLocalization(
    input: Partial<ImageLocalizationProfile> = {}
  ): ImageLocalizationProfile {
    return {
      translatableTextRegions: input.translatableTextRegions ?? [],
      translatedTextReplacement: input.translatedTextReplacement ?? true,
      preserveIllustrationLayout: input.preserveIllustrationLayout ?? true,
      preserveTypographyStyle: input.preserveTypographyStyle ?? true,
      localizedImageVersions: input.localizedImageVersions ?? []
    };
  }

  private buildSubtitleLocalization(
    input: Partial<SubtitleLocalizationProfile> = {}
  ): SubtitleLocalizationProfile {
    return {
      subtitleTracks: input.subtitleTracks ?? [],
      multilingualSubtitles: input.multilingualSubtitles ?? [],
      timingMetadata: input.timingMetadata ?? {},
      captionStyles: input.captionStyles ?? []
    };
  }

  private buildVoiceOverDubbing(
    input: Partial<VoiceOverDubbingProfile> = {}
  ): VoiceOverDubbingProfile {
    return {
      voiceTracks: input.voiceTracks ?? [],
      dubbingProjects: input.dubbingProjects ?? [],
      narratorProfiles: input.narratorProfiles ?? [],
      synchronizationMetadata: input.synchronizationMetadata ?? {}
    };
  }

  private buildVideoLocalization(
    input: Partial<VideoLocalizationProfile> = {}
  ): VideoLocalizationProfile {
    return {
      localizedVideos: input.localizedVideos ?? [],
      localizedCaptions: input.localizedCaptions ?? [],
      multilingualAudioTracks: input.multilingualAudioTracks ?? []
    };
  }

  private buildLocalizationQa(
    input: Partial<MediaLocalizationQaProfile> = {}
  ): MediaLocalizationQaProfile {
    return {
      terminologyValidation: input.terminologyValidation ?? true,
      lexicographicSupport: input.lexicographicSupport ?? true,
      semanticFidelity: input.semanticFidelity ?? true,
      editorialDecisionSupport: input.editorialDecisionSupport ?? true,
      glossaryPrecedence: "VALIDATED_GLOSSARY_OVER_MEDIA_AI",
      terminologyRefs: input.terminologyRefs ?? [],
      lexicographicRefs: input.lexicographicRefs ?? [],
      semanticReportRefs: input.semanticReportRefs ?? [],
      editorialDecisionRefs: input.editorialDecisionRefs ?? []
    };
  }

  private async audit(
    action: MediaLocalizationAuditAction,
    actor: MediaLocalizationActor,
    mediaLocalizationProjectId: string,
    beforeState: MediaLocalizationProject | MediaLocalizationAsset | undefined,
    afterState: MediaLocalizationProject | MediaLocalizationAsset,
    mediaLocalizationAssetId?: string
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      mediaLocalizationProjectId,
      mediaLocalizationAssetId,
      action,
      actorId: actor.userId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private versionItem(
    actor: MediaLocalizationActor,
    createdAt: string,
    version: number,
    notes: string
  ): MediaLocalizationVersionHistoryItem {
    return {
      id: randomUUID(),
      version,
      createdBy: actor.userId,
      createdAt,
      notes
    };
  }

  private auditTrailItem(
    action: MediaLocalizationAuditAction,
    actor: MediaLocalizationActor,
    at: string,
    version: number,
    details?: object
  ): MediaLocalizationAuditTrailItem {
    return {
      id: randomUUID(),
      action,
      actorId: actor.userId,
      at,
      version,
      details
    };
  }

  private validateActor(actor: MediaLocalizationActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

  private validateCreateInput(input: CreateMediaLocalizationProjectInput): void {
    if (!input.projectKind || !input.title || !input.sourceLanguage || !Array.isArray(input.targetLanguages)) {
      throw new BadRequestException("projectKind, title, sourceLanguage and targetLanguages are required.");
    }
  }

  private assertAuthorizedHuman(actor: MediaLocalizationActor): void {
    const permissions = new Set(actor.permissions ?? []);
    const roles = new Set((actor.roles ?? []).map((role) => role.toUpperCase()));

    if (
      !permissions.has("review:approve") &&
      !roles.has("ADMIN") &&
      !roles.has("REVIEWER")
    ) {
      throw new ForbiddenException("Only authorized humans may approve media localization for publication.");
    }
  }
}
