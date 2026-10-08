import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { ExportService } from "../export/export.service";
import { LibraryService } from "../library/library.service";
import {
  type LibraryPublicationEdition,
  type LibraryPublicationFile,
  type LibraryPublicationRecord,
  type LibraryPublicationVersion
} from "../library/library.types";
import { RightsProvenanceService } from "../rights-provenance/rights-provenance.service";
import { type PublishingAuthorization } from "../rights-provenance/rights-provenance.types";
import { WorkflowService } from "../workflow/workflow.service";
import { type WorkflowState } from "../workflow/workflow.types";
import { DatabaseLayoutPublicationRepository } from "./layout-publishing.repository";
import {
  type BookLayoutPlan,
  type CreateLayoutPublicationPlanInput,
  type EditorialFinishingProfile,
  type GeneratePublishingPreflightInput,
  type LayoutAuditAction,
  type LayoutMultimediaProfile,
  type LayoutPublicationExportHistory,
  type LayoutPublicationHistoryItem,
  type LayoutPublicationPlan,
  type LayoutPublishingActor,
  type MagazineLayoutPlan,
  type PreparePublishingRecordInput,
  type PublishRecordInput,
  type PublishingDistributionChannel,
  type PublishingDistributionRecord,
  type PublishingDistributionStatus,
  type PublishingPreflightCheck,
  type PublishingPreflightResult,
  type PublishingPreflightSeverity,
  type PublishingPreflightStatus,
  type PublishingRecord,
  type PublishingSourceComponent,
  type RecordDistributionInput,
  type RecordLayoutExportInput,
  type RepublishPublishingRecordInput,
  type UpdateDistributionStatusInput,
  type WithdrawPublishingRecordInput
} from "./layout-publishing.types";

@Injectable()
export class LayoutPublishingService {
  constructor(
    private readonly repository: DatabaseLayoutPublicationRepository,
    private readonly libraryService: LibraryService,
    private readonly exportService: ExportService,
    private readonly rightsProvenanceService: RightsProvenanceService,
    private readonly workflowService: WorkflowService
  ) {}

  async createPlan(
    actor: LayoutPublishingActor,
    input: CreateLayoutPublicationPlanInput
  ): Promise<LayoutPublicationPlan> {
    this.validateActor(actor);
    this.validateCreateInput(input);

    const now = new Date().toISOString();
    const planId = randomUUID();
    const plan: LayoutPublicationPlan = {
      id: planId,
      organizationId: actor.organizationId,
      projectId: input.projectId,
      documentId: input.documentId,
      publicationKind: input.publicationKind,
      title: input.title,
      language: input.language,
      bookLayout: input.publicationKind === "BOOK"
        ? this.buildBookLayout(input.bookLayout)
        : undefined,
      magazineLayout: input.publicationKind === "MAGAZINE"
        ? this.buildMagazineLayout(input.magazineLayout)
        : undefined,
      editorialFinishing: this.buildEditorialFinishing(input.editorialFinishing),
      exportFormats: input.exportFormats ?? ["JSON_MASTER", "PDF", "EPUB"],
      multimedia: this.buildMultimedia(input.multimedia),
      layoutVersion: 1,
      styleRevision: 1,
      publicationHistory: [
        this.historyItem("LAYOUT_PLAN_CREATED", actor, now, 1, 1, {
          aiMaySuggestLayouts: true,
          aiMayGenerateStyles: true,
          aiMayOptimizeTypography: true,
          humanFinalAuthority: true
        })
      ],
      exportHistory: [],
      approvalStatus: "PENDING_HUMAN_APPROVAL",
      humanApprovalRequired: true,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createPlan(plan);
    await this.audit("LAYOUT_PLAN_CREATED", actor, created.id, undefined, created);

    return created;
  }

  async getPlan(actor: LayoutPublishingActor, planId: string): Promise<LayoutPublicationPlan> {
    this.validateActor(actor);

    const plan = await this.repository.findPlanById(planId, actor.organizationId);

    if (!plan) {
      throw new NotFoundException("Layout publication plan not found.");
    }

    return plan;
  }

  async createStyleRevision(
    actor: LayoutPublishingActor,
    planId: string,
    input: Partial<EditorialFinishingProfile> = {}
  ): Promise<LayoutPublicationPlan> {
    this.validateActor(actor);

    const existing = await this.getPlan(actor, planId);
    const now = new Date().toISOString();
    const updated: LayoutPublicationPlan = {
      ...existing,
      editorialFinishing: this.buildEditorialFinishing({
        ...existing.editorialFinishing,
        ...input
      }),
      styleRevision: existing.styleRevision + 1,
      updatedAt: now,
      publicationHistory: [
        ...existing.publicationHistory,
        this.historyItem(
          "STYLE_REVISION_CREATED",
          actor,
          now,
          existing.layoutVersion,
          existing.styleRevision + 1,
          { humanFinalAuthority: true }
        )
      ]
    };

    const saved = await this.repository.updatePlan(updated);
    await this.audit("STYLE_REVISION_CREATED", actor, saved.id, existing, saved);

    return saved;
  }

  async approvePublication(
    actor: LayoutPublishingActor,
    planId: string
  ): Promise<LayoutPublicationPlan> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getPlan(actor, planId);
    const now = new Date().toISOString();
    const approved: LayoutPublicationPlan = {
      ...existing,
      approvalStatus: "APPROVED",
      approvedBy: actor.userId,
      approvedAt: now,
      updatedAt: now,
      publicationHistory: [
        ...existing.publicationHistory,
        this.historyItem(
          "PUBLICATION_APPROVED",
          actor,
          now,
          existing.layoutVersion,
          existing.styleRevision,
          { finalAuthority: "AUTHORIZED_HUMAN" }
        )
      ]
    };

    const saved = await this.repository.updatePlan(approved);
    await this.audit("PUBLICATION_APPROVED", actor, saved.id, existing, saved);

    return saved;
  }

  async rejectPublication(
    actor: LayoutPublishingActor,
    planId: string
  ): Promise<LayoutPublicationPlan> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getPlan(actor, planId);
    const now = new Date().toISOString();
    const rejected: LayoutPublicationPlan = {
      ...existing,
      approvalStatus: "REJECTED",
      updatedAt: now,
      publicationHistory: [
        ...existing.publicationHistory,
        this.historyItem(
          "PUBLICATION_REJECTED",
          actor,
          now,
          existing.layoutVersion,
          existing.styleRevision,
          { finalAuthority: "AUTHORIZED_HUMAN" }
        )
      ]
    };

    const saved = await this.repository.updatePlan(rejected);
    await this.audit("PUBLICATION_REJECTED", actor, saved.id, existing, saved);

    return saved;
  }

  async recordExport(
    actor: LayoutPublishingActor,
    planId: string,
    input: RecordLayoutExportInput
  ): Promise<LayoutPublicationPlan> {
    this.validateActor(actor);

    if (!input.format) {
      throw new BadRequestException("format is required.");
    }

    const existing = await this.getPlan(actor, planId);
    const now = new Date().toISOString();
    const exportRecord: LayoutPublicationExportHistory = {
      id: randomUUID(),
      format: input.format,
      artifactUri: input.artifactUri,
      createdBy: actor.userId,
      createdAt: now
    };
    const updated: LayoutPublicationPlan = {
      ...existing,
      exportHistory: [...existing.exportHistory, exportRecord],
      updatedAt: now,
      publicationHistory: [
        ...existing.publicationHistory,
        this.historyItem(
          "EXPORT_RECORDED",
          actor,
          now,
          existing.layoutVersion,
          existing.styleRevision,
          { format: input.format, artifactUri: input.artifactUri }
        )
      ]
    };

    const saved = await this.repository.updatePlan(updated);
    await this.audit("EXPORT_RECORDED", actor, saved.id, existing, saved);

    return saved;
  }

  async generatePublishingPreflight(
    actor: LayoutPublishingActor,
    input: GeneratePublishingPreflightInput
  ): Promise<PublishingPreflightResult> {
    this.validateActor(actor);

    if (!input.publicationId) {
      throw new BadRequestException("publicationId is required.");
    }

    const publication = await this.libraryService.getPublication(actor, input.publicationId);
    const [editions, versions, files, rightsAuthorizations, workflow, artifacts, layoutPlan] =
      await Promise.all([
        this.libraryService.listPublicationEditions(actor, publication.id),
        this.libraryService.listPublicationVersions(actor, publication.id),
        this.libraryService.listPublicationFiles(actor, publication.id),
        this.rightsProvenanceService.listPublishingAuthorizations(actor, {
          documentId: input.documentId,
          projectId: publication.projectId
        }),
        this.resolveWorkflow(actor, publication, input.documentId),
        this.resolveArtifactRefs(actor, input.selectedArtifactRefs ?? []),
        input.layoutPublicationPlanId
          ? this.repository.findPlanById(input.layoutPublicationPlanId, actor.organizationId)
          : Promise.resolve(null)
      ]);
    const edition = this.selectEdition(editions, input.editionId);
    const version = this.selectVersion(versions, input.versionId, edition?.id);
    const now = new Date().toISOString();
    const selectedChannels = input.selectedChannels ?? [];
    const selectedArtifactRefs = input.selectedArtifactRefs ?? [];
    const checks = this.buildPreflightChecks({
      artifacts,
      edition,
      files,
      input,
      layoutPlan,
      now,
      publication,
      rightsAuthorizations,
      selectedArtifactRefs,
      selectedChannels,
      version,
      workflow
    });
    const blockingIssues = checks
      .filter((check) => check.status === "ERROR" && check.severity === "CRITICAL")
      .map((check) => check.message);
    const warnings = checks
      .filter((check) => check.status === "WARNING")
      .map((check) => check.message);
    const missingActions = checks
      .filter((check) => check.status === "ERROR" || check.status === "PENDING")
      .map((check) => check.remediationLink);
    const passed = checks.filter((check) => check.status === "PASS" || check.status === "NOT_APPLICABLE").length;
    const readinessPercentage = Math.round((passed / checks.length) * 100);
    const preflight: PublishingPreflightResult = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      publicationId: publication.id,
      editionId: edition?.id,
      versionId: version?.id,
      projectId: publication.projectId,
      documentId: input.documentId,
      layoutPublicationPlanId: layoutPlan?.id ?? input.layoutPublicationPlanId,
      selectedChannels,
      selectedArtifactRefs,
      visibility: input.visibility ?? publication.visibility,
      readinessPercentage,
      blocked: blockingIssues.length > 0,
      blockingIssues,
      warnings,
      missingActions,
      checks,
      ownershipBoundaries: {
        metadata: "LIBRARY",
        rights: "RIGHTS_PROVENANCE",
        formats: "EXPORT",
        workflow: "WORKFLOW",
        quality: "QUALITY_AGENT",
        layout: "LAYOUT",
        distribution: "LAYOUT_PUBLISHING"
      },
      noDuplicateValidationLogic: true,
      humanFinalAuthorityRequired: true,
      createdBy: actor.userId,
      createdAt: now,
      refreshedAt: input.refreshOfPreflightResultId ? now : undefined,
      metadata: {
        ...(input.metadata ?? {}),
        aggregationOnly: true,
        noSeparatePreflightModule: true,
        librarySingleSourceOfTruth: true,
        refreshOfPreflightResultId: input.refreshOfPreflightResultId
      }
    };
    const created = await this.repository.createPreflightResult(preflight);
    await this.audit(
      input.refreshOfPreflightResultId ? "PREFLIGHT_REFRESHED" : "PREFLIGHT_GENERATED",
      actor,
      {
        afterState: created,
        editionId: created.editionId,
        preflightResultId: created.id,
        publicationId: created.publicationId,
        versionId: created.versionId
      }
    );

    return created;
  }

  async getPublishingPreflight(
    actor: LayoutPublishingActor,
    preflightId: string
  ): Promise<PublishingPreflightResult> {
    this.validateActor(actor);
    const result = await this.repository.findPreflightResultById(preflightId, actor.organizationId);

    if (!result) {
      throw new NotFoundException("Publishing preflight result not found.");
    }

    return result;
  }

  async preparePublishingRecord(
    actor: LayoutPublishingActor,
    input: PreparePublishingRecordInput
  ): Promise<PublishingRecord> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor, "Only authorized humans may prepare official publishing records.");

    const preflight = await this.requirePreflight(actor, input.preflightResultId);
    this.assertPreflightMatchesInput(preflight, input.publicationId, input.editionId, input.versionId);

    const now = new Date().toISOString();
    const selectedChannels = input.selectedChannels ?? preflight.selectedChannels;
    const selectedArtifactRefs = input.selectedArtifactRefs ?? preflight.selectedArtifactRefs;
    const record: PublishingRecord = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      publicationId: input.publicationId,
      editionId: input.editionId,
      versionId: input.versionId,
      preflightResultId: preflight.id,
      publishingState: "IN_PREGATIRE",
      selectedChannels,
      formatsMadeAvailable: [],
      selectedArtifactRefs,
      visibility: input.visibility ?? preflight.visibility ?? "PRIVATE",
      rightsSnapshotRef: input.rightsSnapshotRef,
      preflightSnapshotRef: preflight.id,
      immutableOfficialEdition: true,
      metadataDuplicated: false,
      publicationMetadataOwner: "LIBRARY",
      versionOwner: "LIBRARY",
      formatsOwner: "EXPORT",
      rightsOwner: "RIGHTS_PROVENANCE",
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: {
        ...(input.metadata ?? {}),
        libraryPublicationRef: input.publicationId,
        officialEditionCandidate: input.editionId,
        selectedVersion: input.versionId
      }
    };
    const created = await this.repository.createPublishingRecord(record);
    await this.audit("PUBLICATION_CREATED", actor, {
      afterState: created,
      editionId: created.editionId,
      publishingRecordId: created.id,
      publicationId: created.publicationId,
      reason: input.reason,
      versionId: created.versionId
    });

    return created;
  }

  async markReadyForPublication(
    actor: LayoutPublishingActor,
    publishingRecordId: string,
    reason?: string
  ): Promise<PublishingRecord> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor, "Only authorized humans may mark an edition ready for publication.");

    const existing = await this.requirePublishingRecord(actor, publishingRecordId);
    const preflight = await this.requirePreflight(actor, existing.preflightResultId);
    this.assertReadyPreflight(preflight);
    this.assertPublishingTransition(existing.publishingState, "GATA_PENTRU_PUBLICARE", {
      allowWithdrawnCorrection: true
    });

    const updated = await this.savePublishingState(
      actor,
      existing,
      "GATA_PENTRU_PUBLICARE",
      "PUBLISHING_STATE_CHANGED",
      reason
    );
    await this.audit("OFFICIAL_EDITION_SELECTED", actor, {
      afterState: updated,
      beforeState: existing,
      editionId: updated.editionId,
      publishingRecordId: updated.id,
      publicationId: updated.publicationId,
      reason,
      versionId: updated.versionId
    });

    return updated;
  }

  async publishOfficialEdition(
    actor: LayoutPublishingActor,
    publishingRecordId: string,
    input: PublishRecordInput = {}
  ): Promise<PublishingRecord> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor, "Only authorized humans may publish official editions.");

    const existing = await this.requirePublishingRecord(actor, publishingRecordId);
    this.assertPublishingTransition(existing.publishingState, "PUBLICAT");
    const preflight = await this.requirePreflight(actor, existing.preflightResultId);
    this.assertReadyPreflight(preflight);

    const now = new Date().toISOString();
    const selectedArtifactRefs = input.selectedArtifactRefs ?? existing.selectedArtifactRefs;
    const published: PublishingRecord = {
      ...existing,
      publishingState: "PUBLICAT",
      publicationDate: now,
      publishingUserOrAgent: actor.userId,
      formatsMadeAvailable: input.formatsMadeAvailable ?? this.inferPublishedFormats(selectedArtifactRefs),
      selectedArtifactRefs,
      updatedAt: now,
      metadata: {
        ...(existing.metadata ?? {}),
        publishedWithoutMetadataDuplication: true,
        officialEditionImmutableFrom: now
      }
    };
    const saved = await this.repository.updatePublishingRecord(published);
    await this.libraryService.updatePublicationStatus(actor, saved.publicationId, {
      lifecycleStatus: "PUBLICAT",
      reason: input.reason ?? "Official edition published through Publishing workflow."
    });
    await this.audit("EDITION_PUBLISHED", actor, {
      afterState: saved,
      beforeState: existing,
      editionId: saved.editionId,
      publishingRecordId: saved.id,
      publicationId: saved.publicationId,
      reason: input.reason,
      versionId: saved.versionId
    });

    for (const channel of input.channel ? [input.channel] : saved.selectedChannels) {
      await this.recordDistribution(actor, saved.id, {
        channel,
        deliveryStatus: "PENDING",
        selectedExportedArtifactRefs: selectedArtifactRefs,
        notes: "Distribution initiated from official publishing action."
      });
    }

    return saved;
  }

  async withdrawPublication(
    actor: LayoutPublishingActor,
    publishingRecordId: string,
    input: WithdrawPublishingRecordInput
  ): Promise<PublishingRecord> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor, "Only authorized humans may withdraw publications.");

    if (!input.reason) {
      throw new BadRequestException("reason is required.");
    }

    const existing = await this.requirePublishingRecord(actor, publishingRecordId);
    this.assertPublishingTransition(existing.publishingState, "RETRAS_DIN_PUBLICARE");

    const now = new Date().toISOString();
    const withdrawn: PublishingRecord = {
      ...existing,
      publishingState: "RETRAS_DIN_PUBLICARE",
      withdrawalReason: input.reason,
      withdrawalEffectiveDate: input.effectiveDate ?? now,
      updatedAt: now,
      metadata: {
        ...(existing.metadata ?? {}),
        withdrawalPreservesFilesMetadataVersionsAndHistory: true
      }
    };
    const saved = await this.repository.updatePublishingRecord(withdrawn);
    const channels = input.channels ?? saved.selectedChannels;

    for (const channel of channels) {
      await this.recordDistribution(actor, saved.id, {
        channel,
        deliveryStatus: "WITHDRAWN",
        notes: input.reason,
        selectedExportedArtifactRefs: saved.selectedArtifactRefs
      });
    }

    await this.audit("PUBLICATION_WITHDRAWN", actor, {
      afterState: saved,
      beforeState: existing,
      editionId: saved.editionId,
      publishingRecordId: saved.id,
      publicationId: saved.publicationId,
      reason: input.reason,
      versionId: saved.versionId
    });

    return saved;
  }

  async republishPublication(
    actor: LayoutPublishingActor,
    publishingRecordId: string,
    input: RepublishPublishingRecordInput
  ): Promise<PublishingRecord> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor, "Only authorized humans may republish official editions.");

    const previous = await this.requirePublishingRecord(actor, publishingRecordId);

    if (previous.publishingState !== "PUBLICAT" && previous.publishingState !== "RETRAS_DIN_PUBLICARE") {
      throw new BadRequestException("Only published or withdrawn publication records can be republished.");
    }

    if (previous.editionId === input.editionId && previous.versionId === input.versionId) {
      throw new BadRequestException("Republication requires a new or explicitly revised edition/version.");
    }

    const preflight = await this.requirePreflight(actor, input.preflightResultId);
    this.assertPreflightMatchesInput(preflight, previous.publicationId, input.editionId, input.versionId);
    this.assertReadyPreflight(preflight);

    const now = new Date().toISOString();
    const record: PublishingRecord = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      publicationId: previous.publicationId,
      editionId: input.editionId,
      versionId: input.versionId,
      preflightResultId: input.preflightResultId,
      previousPublishingRecordId: previous.id,
      publishingState: "REPUBLICAT",
      publicationDate: now,
      publishingUserOrAgent: actor.userId,
      selectedChannels: input.selectedChannels ?? previous.selectedChannels,
      formatsMadeAvailable: this.inferPublishedFormats(input.selectedArtifactRefs ?? preflight.selectedArtifactRefs),
      selectedArtifactRefs: input.selectedArtifactRefs ?? preflight.selectedArtifactRefs,
      visibility: previous.visibility,
      rightsSnapshotRef: previous.rightsSnapshotRef,
      preflightSnapshotRef: preflight.id,
      immutableOfficialEdition: true,
      metadataDuplicated: false,
      publicationMetadataOwner: "LIBRARY",
      versionOwner: "LIBRARY",
      formatsOwner: "EXPORT",
      rightsOwner: "RIGHTS_PROVENANCE",
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: {
        previousPublishingRecordPreserved: true,
        republicationReason: input.reason
      }
    };
    const created = await this.repository.createPublishingRecord(record);
    await this.audit("PUBLICATION_REPUBLISHED", actor, {
      afterState: created,
      beforeState: previous,
      editionId: created.editionId,
      publishingRecordId: created.id,
      publicationId: created.publicationId,
      reason: input.reason,
      versionId: created.versionId
    });

    for (const channel of created.selectedChannels) {
      await this.recordDistribution(actor, created.id, {
        channel,
        deliveryStatus: "PENDING",
        selectedExportedArtifactRefs: created.selectedArtifactRefs,
        notes: "Distribution initiated from republication.",
        externalReference: previous.id
      });
    }

    return created;
  }

  async recordDistribution(
    actor: LayoutPublishingActor,
    publishingRecordId: string,
    input: RecordDistributionInput
  ): Promise<PublishingDistributionRecord> {
    this.validateActor(actor);

    if (!input.channel) {
      throw new BadRequestException("channel is required.");
    }

    const publishingRecord = await this.requirePublishingRecord(actor, publishingRecordId);
    const now = new Date().toISOString();
    const deliveryStatus = input.deliveryStatus ?? "PENDING";
    const record: PublishingDistributionRecord = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      publicationId: publishingRecord.publicationId,
      editionId: publishingRecord.editionId,
      publishingRecordId: publishingRecord.id,
      channel: input.channel,
      deliveryStatus,
      distributionTimestamp: now,
      targetDestination: input.targetDestination,
      integrationReference: input.integrationReference,
      selectedExportedArtifactRefs: input.selectedExportedArtifactRefs ?? publishingRecord.selectedArtifactRefs,
      responsibleUserOrAgent: actor.userId,
      success: deliveryStatus === "DELIVERED",
      externalReference: input.externalReference,
      withdrawalStatus: deliveryStatus === "WITHDRAWN" ? "WITHDRAWN" : "NOT_WITHDRAWN",
      withdrawalReason: deliveryStatus === "WITHDRAWN" ? input.notes : undefined,
      republicationOfPublishingRecordId: publishingRecord.previousPublishingRecordId,
      notes: input.notes,
      history: [
        {
          changedAt: now,
          changedBy: actor.userId,
          deliveryStatus,
          externalReference: input.externalReference,
          notes: input.notes
        }
      ],
      createdAt: now,
      updatedAt: now,
      metadata: {
        distributionDoesNotOwnEditionVersionFormatsOrMetadata: true
      }
    };
    const created = await this.repository.createDistributionRecord(record);
    const action = this.auditActionForDistributionStatus(deliveryStatus);
    await this.audit(action, actor, {
      afterState: created,
      distributionRecordId: created.id,
      editionId: created.editionId,
      publishingRecordId: created.publishingRecordId,
      publicationId: created.publicationId,
      reason: input.notes
    });

    return {
      ...created,
      auditReference: created.id
    };
  }

  async updateDistributionStatus(
    actor: LayoutPublishingActor,
    distributionRecordId: string,
    input: UpdateDistributionStatusInput
  ): Promise<PublishingDistributionRecord> {
    this.validateActor(actor);

    if (!input.deliveryStatus) {
      throw new BadRequestException("deliveryStatus is required.");
    }

    const existing = await this.findDistributionRecord(actor, distributionRecordId);
    const now = new Date().toISOString();
    const updated: PublishingDistributionRecord = {
      ...existing,
      deliveryStatus: input.deliveryStatus,
      success: input.deliveryStatus === "DELIVERED",
      externalReference: input.externalReference ?? existing.externalReference,
      notes: input.notes ?? existing.notes,
      withdrawalStatus: input.deliveryStatus === "WITHDRAWN" ? "WITHDRAWN" : existing.withdrawalStatus,
      withdrawalReason: input.deliveryStatus === "WITHDRAWN" ? input.notes : existing.withdrawalReason,
      history: [
        ...existing.history,
        {
          changedAt: now,
          changedBy: actor.userId,
          deliveryStatus: input.deliveryStatus,
          externalReference: input.externalReference,
          notes: input.notes
        }
      ],
      updatedAt: now
    };
    const saved = await this.repository.updateDistributionRecord(updated);
    await this.audit(this.auditActionForDistributionStatus(input.deliveryStatus), actor, {
      afterState: saved,
      beforeState: existing,
      distributionRecordId: saved.id,
      editionId: saved.editionId,
      publishingRecordId: saved.publishingRecordId,
      publicationId: saved.publicationId,
      reason: input.notes
    });

    return saved;
  }

  async listDistributionHistory(
    actor: LayoutPublishingActor,
    publishingRecordId: string
  ): Promise<PublishingDistributionRecord[]> {
    this.validateActor(actor);
    await this.requirePublishingRecord(actor, publishingRecordId);

    return this.repository.listDistributionRecords(publishingRecordId, actor.organizationId);
  }

  private buildPreflightChecks(input: {
    artifacts: string[];
    edition?: LibraryPublicationEdition;
    files: LibraryPublicationFile[];
    input: GeneratePublishingPreflightInput;
    layoutPlan: LayoutPublicationPlan | null;
    now: string;
    publication: LibraryPublicationRecord;
    rightsAuthorizations: PublishingAuthorization[];
    selectedArtifactRefs: string[];
    selectedChannels: PublishingDistributionChannel[];
    version?: LibraryPublicationVersion;
    workflow: WorkflowState | null;
  }): PublishingPreflightCheck[] {
    const {
      artifacts,
      edition,
      files,
      input: preflightInput,
      layoutPlan,
      now,
      publication,
      rightsAuthorizations,
      selectedArtifactRefs,
      selectedChannels,
      version,
      workflow
    } = input;
    const publishableFiles = files.filter((file) => this.isPublishableFile(file));
    const requiredFormats = preflightInput.requiredFormats ?? [];
    const generatedFormats = new Set([
      ...publishableFiles.map((file) => file.fileType),
      ...artifacts.map((artifactRef) => this.inferFormatFromArtifactRef(artifactRef))
    ].filter((format): format is string => Boolean(format)));
    const rightsValidated = this.rightsPermitPublication(publication, rightsAuthorizations);
    const rightsBlocked = this.rightsBlockPublication(publication, rightsAuthorizations);
    const workflowApproved = this.workflowReadyForPublishing(workflow, publication);
    const versionApproved = this.versionApproved(version);
    const accessibilityRequired = publication.metadata?.accessibilityRequired === true;

    return [
      this.preflightCheck({
        key: "METADATA_COMPLETE",
        label: "metadata complete",
        message: "Library metadata must contain title, author and publication type.",
        pass: Boolean(publication.title && publication.author && publication.publicationType),
        remediationLink: "/library",
        severity: "CRITICAL",
        sourceComponent: "LIBRARY",
        timestamp: now
      }),
      this.preflightCheck({
        key: "RIGHTS_VALIDATED",
        label: "rights validated",
        message: rightsBlocked
          ? "Rights & Provenance contains a critical publication restriction."
          : "Rights & Provenance must validate publication rights.",
        pass: rightsValidated && !rightsBlocked,
        remediationLink: "/rights",
        severity: "CRITICAL",
        sourceComponent: "RIGHTS_PROVENANCE",
        timestamp: now
      }),
      this.preflightCheck({
        key: "REQUIRED_FORMATS_GENERATED",
        label: "required formats generated",
        message: "Publishing must reference at least one existing approved export or Library file.",
        pass: publishableFiles.length > 0 || selectedArtifactRefs.length > 0,
        remediationLink: "/publishing",
        severity: "CRITICAL",
        sourceComponent: "EXPORT",
        timestamp: now
      }),
      this.preflightCheck({
        key: "IMAGES_AND_RESOURCES_AVAILABLE",
        label: "images and resources available",
        message: "Quality Agent should confirm required images and resources.",
        pass: publishableFiles.length > 0 || publication.metadata?.resourcesAvailable === true,
        remediationLink: "/publishing",
        severity: "WARNING",
        sourceComponent: "QUALITY_AGENT",
        statusWhenMissing: "WARNING",
        timestamp: now
      }),
      this.preflightCheck({
        key: "ACCESSIBILITY_REQUIREMENTS_SATISFIED",
        label: "accessibility requirements satisfied",
        message: accessibilityRequired
          ? "Mandatory accessibility checks require accessible output references."
          : "Accessibility checks are not mandatory for this publication.",
        pass: !accessibilityRequired || generatedFormats.has("ACCESSIBLE") || generatedFormats.has("ACCESSIBLE_PDF") || generatedFormats.has("ACCESSIBLE_EPUB"),
        remediationLink: "/distribution",
        severity: accessibilityRequired ? "CRITICAL" : "INFORMATIONAL",
        sourceComponent: "QUALITY_AGENT",
        statusWhenMissing: accessibilityRequired ? "ERROR" : "NOT_APPLICABLE",
        timestamp: now
      }),
      this.preflightCheck({
        key: "LAYOUT_VALIDATION_COMPLETED",
        label: "layout validation completed",
        message: "Layout Agent must supply approved layout readiness.",
        pass: layoutPlan?.approvalStatus === "APPROVED" || publication.layoutRefs.length > 0,
        remediationLink: "/publishing",
        severity: "CRITICAL",
        sourceComponent: "LAYOUT",
        timestamp: now
      }),
      this.preflightCheck({
        key: "MANDATORY_TRANSLATIONS_COMPLETED",
        label: "mandatory translations completed",
        message: "Translation Agent must complete mandatory translations.",
        pass: publication.metadata?.mandatoryTranslations !== true || publication.translationRefs.length > 0,
        remediationLink: "/translation",
        severity: publication.metadata?.mandatoryTranslations === true ? "CRITICAL" : "INFORMATIONAL",
        sourceComponent: "TRANSLATION",
        statusWhenMissing: publication.metadata?.mandatoryTranslations === true ? "ERROR" : "NOT_APPLICABLE",
        timestamp: now
      }),
      this.preflightCheck({
        key: "MANDATORY_REVIEW_COMPLETED",
        label: "mandatory review completed",
        message: "Review Agent must complete mandatory review.",
        pass: publication.reviewRefs.length > 0 || workflowApproved,
        remediationLink: "/review",
        severity: "CRITICAL",
        sourceComponent: "REVIEW",
        timestamp: now
      }),
      this.preflightCheck({
        key: "IDENTIFIER_PRESENT",
        label: "ISBN or equivalent identifier present",
        message: "Publication metadata must include ISBN or equivalent identifier when required.",
        pass: publication.metadata?.identifierRequired === false ||
          Boolean(publication.isbn || publication.associatedIdentifiers.length > 0),
        remediationLink: "/library",
        severity: publication.metadata?.identifierRequired === false ? "INFORMATIONAL" : "CRITICAL",
        sourceComponent: "LIBRARY",
        statusWhenMissing: publication.metadata?.identifierRequired === false ? "NOT_APPLICABLE" : "ERROR",
        timestamp: now
      }),
      this.preflightCheck({
        key: "EDITION_SELECTED",
        label: "edition selected",
        message: "An official Library edition must be selected.",
        pass: Boolean(edition),
        remediationLink: "/library",
        severity: "CRITICAL",
        sourceComponent: "LIBRARY",
        timestamp: now
      }),
      this.preflightCheck({
        key: "VERSION_SELECTED",
        label: "version selected",
        message: version ? "The selected Library version must be approved." : "An approved Library version must be selected.",
        pass: Boolean(version && versionApproved),
        remediationLink: "/library",
        severity: "CRITICAL",
        sourceComponent: "LIBRARY",
        timestamp: now
      }),
      this.preflightCheck({
        key: "VISIBILITY_CONFIRMED",
        label: "visibility confirmed",
        message: "Publication visibility must be confirmed before publishing.",
        pass: Boolean(preflightInput.visibility ?? publication.visibility),
        remediationLink: "/library",
        severity: "CRITICAL",
        sourceComponent: "PUBLISHING",
        timestamp: now
      }),
      this.preflightCheck({
        key: "PUBLICATION_CHANNELS_SELECTED",
        label: "publication channels selected",
        message: "At least one approved publication channel must be selected.",
        pass: selectedChannels.length > 0,
        remediationLink: "/distribution",
        severity: "CRITICAL",
        sourceComponent: "PUBLISHING",
        timestamp: now
      }),
      this.preflightCheck({
        key: "WORKFLOW_APPROVALS_COMPLETE",
        label: "editorial workflow completion",
        message: "Mandatory workflow approvals must be complete.",
        pass: workflowApproved,
        remediationLink: "/review",
        severity: "CRITICAL",
        sourceComponent: "WORKFLOW",
        timestamp: now
      }),
      this.preflightCheck({
        key: "REQUIRED_FORMAT_COVERAGE",
        label: "selected required format coverage",
        message: "Every organization-required format must reference an existing generated artifact.",
        pass: requiredFormats.length === 0 || requiredFormats.every((format) => generatedFormats.has(format)),
        remediationLink: "/export",
        severity: requiredFormats.length === 0 ? "INFORMATIONAL" : "CRITICAL",
        sourceComponent: "EXPORT",
        statusWhenMissing: requiredFormats.length === 0 ? "NOT_APPLICABLE" : "ERROR",
        timestamp: now
      })
    ];
  }

  private preflightCheck(input: {
    key: PublishingPreflightCheck["key"];
    label: string;
    message: string;
    pass: boolean;
    remediationLink: string;
    severity: PublishingPreflightSeverity;
    sourceComponent: PublishingSourceComponent;
    statusWhenMissing?: PublishingPreflightStatus;
    timestamp: string;
  }): PublishingPreflightCheck {
    return {
      id: randomUUID(),
      key: input.key,
      label: input.label,
      status: input.pass ? "PASS" : input.statusWhenMissing ?? "ERROR",
      sourceComponent: input.sourceComponent,
      severity: input.pass ? "INFORMATIONAL" : input.severity,
      message: input.message,
      remediationLink: input.remediationLink,
      lastValidationTimestamp: input.timestamp,
      overridable: input.severity !== "CRITICAL" || input.sourceComponent !== "RIGHTS_PROVENANCE"
    };
  }

  private selectEdition(
    editions: LibraryPublicationEdition[],
    editionId?: string
  ): LibraryPublicationEdition | undefined {
    if (editionId) {
      return editions.find((edition) => edition.id === editionId);
    }

    return [...editions].sort((left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    )[0];
  }

  private selectVersion(
    versions: LibraryPublicationVersion[],
    versionId?: string,
    editionId?: string
  ): LibraryPublicationVersion | undefined {
    const editionVersions = editionId
      ? versions.filter((version) => version.editionId === editionId)
      : versions;

    if (versionId) {
      return editionVersions.find((version) => version.id === versionId);
    }

    return [...editionVersions].sort((left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    )[0];
  }

  private async resolveWorkflow(
    actor: LayoutPublishingActor,
    publication: LibraryPublicationRecord,
    documentId?: string
  ): Promise<WorkflowState | null> {
    const resolvedDocumentId = documentId ?? this.stringMetadata(publication.metadata, "documentId");

    if (!resolvedDocumentId) {
      return null;
    }

    try {
      return await this.workflowService.getWorkflowStatus(actor, {
        documentId: resolvedDocumentId,
        projectId: publication.projectId
      });
    } catch {
      return null;
    }
  }

  private async resolveArtifactRefs(
    actor: LayoutPublishingActor,
    artifactRefs: string[]
  ): Promise<string[]> {
    const resolved: string[] = [];

    for (const artifactRef of artifactRefs) {
      try {
        const artifact = await this.exportService.getArtifact(actor, artifactRef);
        resolved.push(artifact.id);
      } catch {
        resolved.push(artifactRef);
      }
    }

    return resolved;
  }

  private rightsPermitPublication(
    publication: LibraryPublicationRecord,
    authorizations: PublishingAuthorization[]
  ): boolean {
    const normalizedStatus = publication.rightsStatus?.toUpperCase();
    const statusAllowsPublication = normalizedStatus === "RIGHTS_OBTAINED" ||
      normalizedStatus === "PUBLIC_DOMAIN" ||
      normalizedStatus === "ORIGINAL_CREATION" ||
      normalizedStatus === "OPEN_LICENSE";
    const authorizationAllowsPublication = authorizations.some((authorization) =>
      authorization.publicationAuthorized
    );

    return statusAllowsPublication || authorizationAllowsPublication;
  }

  private rightsBlockPublication(
    publication: LibraryPublicationRecord,
    authorizations: PublishingAuthorization[]
  ): boolean {
    const normalizedStatus = publication.rightsStatus?.toUpperCase();
    const explicitRestriction = normalizedStatus === "RESTRICTED_PUBLICATION" ||
      (publication.publicationRestrictions?.length ?? 0) > 0;
    const explicitDeniedAuthorization = authorizations.some((authorization) =>
      authorization.publicationAuthorized === false
    );

    return explicitRestriction || explicitDeniedAuthorization;
  }

  private workflowReadyForPublishing(
    workflow: WorkflowState | null,
    publication: LibraryPublicationRecord
  ): boolean {
    if (publication.metadata?.workflowApproved === true) {
      return true;
    }

    return workflow?.status === "APPROVED" ||
      workflow?.status === "READY_FOR_EXPORT" ||
      workflow?.status === "EXPORTED";
  }

  private versionApproved(version?: LibraryPublicationVersion): boolean {
    if (!version) {
      return false;
    }

    const status = this.stringMetadata(version.metadata, "approvalStatus")?.toUpperCase();

    return status === "APPROVED" ||
      status === "VALIDATED" ||
      version.metadata?.approved === true;
  }

  private isPublishableFile(file: LibraryPublicationFile): boolean {
    return !file.restricted &&
      (file.visibility === "PUBLIC" || file.visibility === "INTERNAL_WORKING_PUBLICATION") &&
      Boolean(file.artifactRef || file.fileName);
  }

  private inferFormatFromArtifactRef(artifactRef: string): string | undefined {
    const upper = artifactRef.toUpperCase();

    if (upper.includes("JSON")) {
      return "JSON";
    }

    const match = upper.match(/\.(PDF|EPUB|MOBI|AZW3|HTML|MP3|M4B|MP4|WEBM|PNG|JPG|JPEG|SVG|WEBP|TIFF|XML|CSV|ZIP|SRT|VTT)$/);

    return match?.[1];
  }

  private inferPublishedFormats(artifactRefs: string[]): string[] {
    const formats = artifactRefs
      .map((artifactRef) => this.inferFormatFromArtifactRef(artifactRef))
      .filter((format): format is string => Boolean(format));

    const unique = [...new Set(formats)];

    return unique.length > 0 ? unique : artifactRefs.length > 0 ? ["JSON_MASTER"] : [];
  }

  private assertReadyPreflight(preflight: PublishingPreflightResult): void {
    const criticalErrors = preflight.checks.filter((check) =>
      check.status === "ERROR" && check.severity === "CRITICAL"
    );

    if (criticalErrors.length > 0 || preflight.blocked) {
      throw new BadRequestException("Critical preflight errors block publishing.");
    }

    const requiredChecks = new Set<PublishingPreflightCheck["key"]>([
      "RIGHTS_VALIDATED",
      "REQUIRED_FORMATS_GENERATED",
      "EDITION_SELECTED",
      "VERSION_SELECTED",
      "WORKFLOW_APPROVALS_COMPLETE"
    ]);

    for (const check of preflight.checks) {
      if (requiredChecks.has(check.key) && check.status !== "PASS") {
        throw new BadRequestException(`Publishing readiness failed: ${check.label}.`);
      }
    }
  }

  private assertPreflightMatchesInput(
    preflight: PublishingPreflightResult,
    publicationId: string,
    editionId: string,
    versionId: string
  ): void {
    if (
      preflight.publicationId !== publicationId ||
      preflight.editionId !== editionId ||
      preflight.versionId !== versionId
    ) {
      throw new BadRequestException("Preflight result does not match selected publication edition/version.");
    }
  }

  private assertPublishingTransition(
    from: PublishingRecord["publishingState"],
    to: PublishingRecord["publishingState"],
    options: { allowWithdrawnCorrection?: boolean } = {}
  ): void {
    const allowed = new Map<PublishingRecord["publishingState"], PublishingRecord["publishingState"][]>([
      ["IN_PREGATIRE", ["GATA_PENTRU_PUBLICARE"]],
      ["GATA_PENTRU_PUBLICARE", ["PUBLICAT"]],
      ["PUBLICAT", ["REPUBLICAT", "RETRAS_DIN_PUBLICARE"]],
      ["REPUBLICAT", ["RETRAS_DIN_PUBLICARE"]],
      ["RETRAS_DIN_PUBLICARE", options.allowWithdrawnCorrection ? ["GATA_PENTRU_PUBLICARE"] : []]
    ]);

    if (!allowed.get(from)?.includes(to)) {
      throw new BadRequestException(`Invalid publishing state transition: ${from} -> ${to}.`);
    }
  }

  private async savePublishingState(
    actor: LayoutPublishingActor,
    existing: PublishingRecord,
    nextState: PublishingRecord["publishingState"],
    action: LayoutAuditAction,
    reason?: string
  ): Promise<PublishingRecord> {
    const updated: PublishingRecord = {
      ...existing,
      publishingState: nextState,
      updatedAt: new Date().toISOString()
    };
    const saved = await this.repository.updatePublishingRecord(updated);
    await this.audit(action, actor, {
      afterState: saved,
      beforeState: existing,
      editionId: saved.editionId,
      publishingRecordId: saved.id,
      publicationId: saved.publicationId,
      reason,
      versionId: saved.versionId
    });

    return saved;
  }

  private async requirePreflight(
    actor: LayoutPublishingActor,
    preflightId: string
  ): Promise<PublishingPreflightResult> {
    const result = await this.repository.findPreflightResultById(preflightId, actor.organizationId);

    if (!result) {
      throw new NotFoundException("Publishing preflight result not found.");
    }

    return result;
  }

  private async requirePublishingRecord(
    actor: LayoutPublishingActor,
    publishingRecordId: string
  ): Promise<PublishingRecord> {
    const record = await this.repository.findPublishingRecordById(
      publishingRecordId,
      actor.organizationId
    );

    if (!record) {
      throw new NotFoundException("Publishing record not found.");
    }

    return record;
  }

  private async findDistributionRecord(
    actor: LayoutPublishingActor,
    distributionRecordId: string
  ): Promise<PublishingDistributionRecord> {
    const record = await this.repository.findDistributionRecordById(
      distributionRecordId,
      actor.organizationId
    );

    if (!record) {
      throw new NotFoundException("Distribution record not found.");
    }

    return record;
  }

  private auditActionForDistributionStatus(status: PublishingDistributionStatus): LayoutAuditAction {
    if (status === "DELIVERED") {
      return "DISTRIBUTION_DELIVERED";
    }

    if (status === "FAILED") {
      return "DISTRIBUTION_FAILED";
    }

    if (status === "WITHDRAWN") {
      return "CHANNEL_WITHDRAWN";
    }

    return "DISTRIBUTION_INITIATED";
  }

  private stringMetadata(
    metadata: Record<string, unknown> | undefined,
    key: string
  ): string | undefined {
    const value = metadata?.[key];

    return typeof value === "string" ? value : undefined;
  }

  private buildBookLayout(input: Partial<BookLayoutPlan> = {}): BookLayoutPlan {
    return {
      chapters: input.chapters ?? [],
      sections: input.sections ?? [],
      footnotes: input.footnotes ?? [],
      tableOfContents: input.tableOfContents ?? true,
      indexes: input.indexes ?? [],
      illustrations: input.illustrations ?? [],
      captions: input.captions ?? [],
      pageTemplates: input.pageTemplates ?? ["front-matter", "chapter", "body", "back-matter"]
    };
  }

  private buildMagazineLayout(input: Partial<MagazineLayoutPlan> = {}): MagazineLayoutPlan {
    return {
      issues: input.issues ?? [],
      articles: input.articles ?? [],
      columns: input.columns ?? [],
      imageGalleries: input.imageGalleries ?? [],
      covers: input.covers ?? [],
      archives: input.archives ?? []
    };
  }

  private buildEditorialFinishing(
    input: Partial<EditorialFinishingProfile> = {}
  ): EditorialFinishingProfile {
    return {
      widowOrphanControl: input.widowOrphanControl ?? true,
      typographyValidation: input.typographyValidation ?? true,
      spacing: input.spacing ?? "STANDARD",
      kerning: input.kerning ?? true,
      margins: input.margins ?? "EUROPEAN_STANDARD",
      bleed: input.bleed ?? "3mm",
      pagination: input.pagination ?? "MANUAL_REVIEW_REQUIRED",
      printProfiles: input.printProfiles ?? ["PDF_X", "EPUB", "PRINT_ON_DEMAND"]
    };
  }

  private buildMultimedia(input: Partial<LayoutMultimediaProfile> = {}): LayoutMultimediaProfile {
    return {
      audioChapters: input.audioChapters ?? [],
      synchronizedNarration: input.synchronizedNarration ?? false,
      videoAssets: input.videoAssets ?? [],
      illustrations: input.illustrations ?? [],
      galleries: input.galleries ?? []
    };
  }

  private async audit(
    action: LayoutAuditAction,
    actor: LayoutPublishingActor,
    detailsOrPlanId: string | {
      afterState?: object;
      beforeState?: object;
      distributionRecordId?: string;
      editionId?: string;
      layoutPublicationPlanId?: string;
      preflightResultId?: string;
      publishingRecordId?: string;
      publicationId?: string;
      reason?: string;
      versionId?: string;
    },
    beforeState?: object,
    afterState?: object
  ): Promise<void> {
    const details = typeof detailsOrPlanId === "string"
      ? {
        afterState,
        beforeState,
        layoutPublicationPlanId: detailsOrPlanId
      }
      : detailsOrPlanId;

    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      layoutPublicationPlanId: details.layoutPublicationPlanId,
      preflightResultId: details.preflightResultId,
      publishingRecordId: details.publishingRecordId,
      distributionRecordId: details.distributionRecordId,
      publicationId: details.publicationId,
      editionId: details.editionId,
      versionId: details.versionId,
      action,
      actorId: actor.userId,
      reason: details.reason,
      beforeState: details.beforeState,
      afterState: details.afterState,
      createdAt: new Date().toISOString()
    });
  }

  private historyItem(
    action: LayoutAuditAction,
    actor: LayoutPublishingActor,
    at: string,
    layoutVersion: number,
    styleRevision: number,
    details?: object
  ): LayoutPublicationHistoryItem {
    return {
      id: randomUUID(),
      action,
      actorId: actor.userId,
      at,
      layoutVersion,
      styleRevision,
      details
    };
  }

  private validateActor(actor: LayoutPublishingActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

  private validateCreateInput(input: CreateLayoutPublicationPlanInput): void {
    if (!input.publicationKind || !input.title || !input.language) {
      throw new BadRequestException("publicationKind, title and language are required.");
    }
  }

  private assertAuthorizedHuman(
    actor: LayoutPublishingActor,
    message = "Only authorized humans may approve publication."
  ): void {
    const permissions = new Set(actor.permissions ?? []);
    const roles = new Set((actor.roles ?? []).map((role) => role.toUpperCase()));

    if (
      !permissions.has("review:approve") &&
      !roles.has("PLATFORM_CREATOR") &&
      !roles.has("ADMIN") &&
      !roles.has("REVIEWER")
    ) {
      throw new ForbiddenException(message);
    }
  }
}
