import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabasePublicPortalRepository } from "./public-portal.repository";
import {
  type CreatePublicCatalogItemInput,
  type CreatePublicDistributionRecordInput,
  type PublicAccessRecord,
  type PublicCatalogItem,
  type PublicDistributionRecord,
  type PublicPortalActor,
  type PublicPortalAuditAction,
  type PublicPortalAuditTrailItem,
  type PublicReaderAccessMetadata
} from "./public-portal.types";

@Injectable()
export class PublicPortalService {
  constructor(private readonly repository: DatabasePublicPortalRepository) {}

  async createCatalogItem(
    actor: PublicPortalActor,
    input: CreatePublicCatalogItemInput
  ): Promise<PublicCatalogItem> {
    this.validateActor(actor);

    if (!input.itemType || !input.metadata?.title || !input.metadata.language) {
      throw new BadRequestException("itemType, metadata.title and metadata.language are required.");
    }

    const now = new Date().toISOString();
    const item: PublicCatalogItem = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      projectId: input.projectId,
      documentId: input.documentId,
      layoutPublicationPlanId: input.layoutPublicationPlanId,
      multimediaProjectId: input.multimediaProjectId,
      mediaLocalizationProjectId: input.mediaLocalizationProjectId,
      itemType: input.itemType,
      metadata: {
        ...input.metadata,
        authors: input.metadata.authors ?? [],
        keywords: input.metadata.keywords ?? [],
        originalSourceReferences: input.metadata.originalSourceReferences ?? []
      },
      readerAccess: this.buildReaderAccess(input.readerAccess),
      rights: input.rights ?? {},
      availabilityStatus: "PENDING_RELEASE_APPROVAL",
      releaseApprovalStatus: "PENDING_HUMAN_APPROVAL",
      humanApprovalRequired: true,
      paymentIntegration: "NOT_CONFIGURED",
      cdnIntegration: "NOT_CONFIGURED",
      distributionRecordIds: [],
      auditTrail: [
        this.auditTrailItem("PUBLIC_CATALOG_ITEM_CREATED", actor, now, 1, {
          aiMayPrepareMetadata: true,
          aiMaySuggestDistribution: true,
          humanFinalAuthority: true,
          paymentIntegration: "NOT_CONFIGURED",
          cdnIntegration: "NOT_CONFIGURED"
        })
      ],
      version: 1,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repository.createCatalogItem(item);
    await this.createAccessRecords(actor, created);
    await this.audit("PUBLIC_CATALOG_ITEM_CREATED", actor, created.id, undefined, created);

    return created;
  }

  async getCatalogItem(actor: PublicPortalActor, itemId: string): Promise<PublicCatalogItem> {
    this.validateActor(actor);

    const item = await this.repository.findCatalogItemById(itemId, actor.organizationId);

    if (!item) {
      throw new NotFoundException("Public catalog item not found.");
    }

    return item;
  }

  async listPublicCatalog(): Promise<PublicCatalogItem[]> {
    return this.repository.listPublicCatalogItems();
  }

  async getPublicCatalogItem(itemId: string): Promise<PublicCatalogItem> {
    const item = await this.repository.findCatalogItemPublicById(itemId);

    if (!item) {
      throw new NotFoundException("Public catalog item not found.");
    }

    return item;
  }

  async createDistributionRecord(
    actor: PublicPortalActor,
    itemId: string,
    input: CreatePublicDistributionRecordInput
  ): Promise<PublicCatalogItem> {
    this.validateActor(actor);

    const existing = await this.getCatalogItem(actor, itemId);
    const now = new Date().toISOString();
    const record: PublicDistributionRecord = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      publicCatalogItemId: existing.id,
      publicationChannels: input.publicationChannels ?? [],
      availabilityStatus: input.availabilityStatus ?? "PENDING_RELEASE_APPROVAL",
      releaseDate: input.releaseDate,
      editionStatus: input.editionStatus,
      languageVariants: input.languageVariants ?? [],
      printOnDemandMetadata: input.printOnDemandMetadata ?? {},
      paymentIntegration: "NOT_CONFIGURED",
      fileHostingIntegration: "NOT_CONFIGURED",
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    await this.repository.createDistributionRecord(record);

    const updated: PublicCatalogItem = {
      ...existing,
      distributionRecordIds: [...existing.distributionRecordIds, record.id],
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("PUBLIC_DISTRIBUTION_RECORD_CREATED", actor, now, existing.version + 1, {
          distributionRecordId: record.id,
          paymentIntegration: "NOT_CONFIGURED",
          fileHostingIntegration: "NOT_CONFIGURED"
        })
      ],
      version: existing.version + 1,
      updatedAt: now
    };

    const saved = await this.repository.updateCatalogItem(updated);
    await this.audit("PUBLIC_DISTRIBUTION_RECORD_CREATED", actor, saved.id, existing, saved, record.id);

    return saved;
  }

  async approveRelease(actor: PublicPortalActor, itemId: string): Promise<PublicCatalogItem> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getCatalogItem(actor, itemId);
    const now = new Date().toISOString();
    const approved: PublicCatalogItem = {
      ...existing,
      availabilityStatus: "PUBLIC",
      releaseApprovalStatus: "APPROVED",
      approvedBy: actor.userId,
      approvedAt: now,
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("PUBLIC_RELEASE_APPROVED", actor, now, existing.version + 1, {
          finalAuthority: "AUTHORIZED_HUMAN"
        })
      ],
      version: existing.version + 1,
      updatedAt: now
    };

    const saved = await this.repository.updateCatalogItem(approved);
    await this.audit("PUBLIC_RELEASE_APPROVED", actor, saved.id, existing, saved);

    return saved;
  }

  async rejectRelease(actor: PublicPortalActor, itemId: string): Promise<PublicCatalogItem> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getCatalogItem(actor, itemId);
    const now = new Date().toISOString();
    const rejected: PublicCatalogItem = {
      ...existing,
      availabilityStatus: "REJECTED",
      releaseApprovalStatus: "REJECTED",
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("PUBLIC_RELEASE_REJECTED", actor, now, existing.version + 1, {
          finalAuthority: "AUTHORIZED_HUMAN"
        })
      ],
      version: existing.version + 1,
      updatedAt: now
    };

    const saved = await this.repository.updateCatalogItem(rejected);
    await this.audit("PUBLIC_RELEASE_REJECTED", actor, saved.id, existing, saved);

    return saved;
  }

  private buildReaderAccess(input: Partial<PublicReaderAccessMetadata> = {}): PublicReaderAccessMetadata {
    return {
      onlineReadingAvailable: input.onlineReadingAvailable ?? true,
      downloadableFormats: input.downloadableFormats ?? [],
      pdfRef: input.pdfRef,
      epubRef: input.epubRef,
      mobiRef: input.mobiRef,
      audioChapterRefs: input.audioChapterRefs ?? [],
      videoRefs: input.videoRefs ?? [],
      localizedMediaRefs: input.localizedMediaRefs ?? [],
      fileHostingIntegration: "NOT_CONFIGURED"
    };
  }

  private async createAccessRecords(
    actor: PublicPortalActor,
    item: PublicCatalogItem
  ): Promise<void> {
    const now = new Date().toISOString();
    const records: PublicAccessRecord[] = [];

    if (item.readerAccess.onlineReadingAvailable) {
      records.push(this.accessRecord(actor, item, now, "ONLINE_READING", "HTML"));
    }

    for (const format of item.readerAccess.downloadableFormats) {
      records.push(
        this.accessRecord(
          actor,
          item,
          now,
          "DOWNLOAD",
          format,
          this.artifactRefForDownload(item.readerAccess, format)
        )
      );
    }

    for (const artifactRef of item.readerAccess.audioChapterRefs) {
      records.push(this.accessRecord(actor, item, now, "AUDIO_STREAM", "AUDIO", artifactRef));
    }

    for (const artifactRef of item.readerAccess.videoRefs) {
      records.push(this.accessRecord(actor, item, now, "VIDEO_STREAM", "VIDEO", artifactRef));
    }

    for (const artifactRef of item.readerAccess.localizedMediaRefs) {
      records.push(this.accessRecord(actor, item, now, "LOCALIZED_MEDIA", undefined, artifactRef));
    }

    await Promise.all(records.map((record) => this.repository.createAccessRecord(record)));
  }

  private accessRecord(
    actor: PublicPortalActor,
    item: PublicCatalogItem,
    createdAt: string,
    accessType: PublicAccessRecord["accessType"],
    format?: PublicAccessRecord["format"],
    artifactRef?: string
  ): PublicAccessRecord {
    return {
      id: randomUUID(),
      organizationId: actor.organizationId,
      publicCatalogItemId: item.id,
      accessType,
      format,
      artifactRef,
      fileHostingIntegration: "NOT_CONFIGURED",
      createdBy: actor.userId,
      createdAt
    };
  }

  private artifactRefForDownload(
    readerAccess: PublicReaderAccessMetadata,
    format: PublicReaderAccessMetadata["downloadableFormats"][number]
  ): string | undefined {
    if (format === "PDF") {
      return readerAccess.pdfRef;
    }

    if (format === "EPUB") {
      return readerAccess.epubRef;
    }

    if (format === "MOBI") {
      return readerAccess.mobiRef;
    }

    return undefined;
  }

  private async audit(
    action: PublicPortalAuditAction,
    actor: PublicPortalActor,
    publicCatalogItemId: string,
    beforeState: PublicCatalogItem | PublicDistributionRecord | undefined,
    afterState: PublicCatalogItem | PublicDistributionRecord,
    publicDistributionRecordId?: string
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      publicCatalogItemId,
      publicDistributionRecordId,
      action,
      actorId: actor.userId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private auditTrailItem(
    action: PublicPortalAuditAction,
    actor: PublicPortalActor,
    at: string,
    version: number,
    details?: object
  ): PublicPortalAuditTrailItem {
    return {
      id: randomUUID(),
      action,
      actorId: actor.userId,
      at,
      version,
      details
    };
  }

  private validateActor(actor: PublicPortalActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

  private assertAuthorizedHuman(actor: PublicPortalActor): void {
    const permissions = new Set(actor.permissions ?? []);
    const roles = new Set((actor.roles ?? []).map((role) => role.toUpperCase()));

    if (
      !permissions.has("review:approve") &&
      !roles.has("ADMIN") &&
      !roles.has("REVIEWER")
    ) {
      throw new ForbiddenException("Only authorized humans may approve public release.");
    }
  }
}
