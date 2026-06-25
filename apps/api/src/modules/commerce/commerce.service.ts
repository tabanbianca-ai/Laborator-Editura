import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseCommerceRepository } from "./commerce.repository";
import {
  type CommerceActor,
  type CommerceAuditAction,
  type CommerceAuditTrailItem,
  type CommerceAvailabilityStatus,
  type CommerceDistributionChannel,
  type CommerceEdition,
  type CommerceEditionMetadata,
  type CommercePrintProfile,
  type CommercePrintOnDemandMetadata,
  type CommercePrintTrimSize,
  type CreateCommerceDistributionInput,
  type CreateCommerceEditionInput
} from "./commerce.types";

@Injectable()
export class CommerceService {
  constructor(private readonly repository: DatabaseCommerceRepository) {}

  async createEdition(actor: CommerceActor, input: CreateCommerceEditionInput): Promise<CommerceEdition> {
    this.validateActor(actor);

    if (!input.title || !input.language || !input.editionType || !input.metadata?.originalLanguage) {
      throw new BadRequestException("title, language, editionType and metadata.originalLanguage are required.");
    }

    const now = new Date().toISOString();
    const editionId = randomUUID();
    const printProfile = this.buildPrintProfile(actor, input, editionId, now);
    const pricingAvailability = input.pricing?.availability ?? "PENDING_COMMERCIAL_APPROVAL";
    const edition: CommerceEdition = {
      id: editionId,
      organizationId: actor.organizationId,
      projectId: input.projectId,
      documentId: input.documentId,
      publicCatalogItemId: input.publicCatalogItemId,
      title: input.title,
      language: input.language,
      targetLanguage: input.metadata.targetLanguage ?? input.language,
      targetLocale: input.metadata.targetLocale,
      editionType: input.editionType,
      metadata: this.buildEditionMetadata(input.metadata),
      printProfile,
      pricing: {
        price: input.pricing?.price,
        currency: input.pricing?.currency,
        stock: input.pricing?.stock,
        availability: pricingAvailability,
        royaltyPercentages: input.pricing?.royaltyPercentages ?? {},
        distributionChannels: input.pricing?.distributionChannels ?? []
      },
      printOnDemand: this.buildPrintOnDemand(input.printOnDemand, printProfile.id),
      distributionChannelIds: [],
      availabilityStatus: "PENDING_COMMERCIAL_APPROVAL",
      approvalStatus: "PENDING_HUMAN_APPROVAL",
      humanApprovalRequired: true,
      paymentProviderIntegration: "NOT_CONFIGURED",
      printProviderIntegration: "METADATA_ONLY",
      auditTrail: [
        this.auditTrailItem("COMMERCE_EDITION_CREATED", actor, now, 1, {
          aiMaySuggestPricing: true,
          aiMaySuggestPrintProfiles: true,
          aiMaySuggestDistribution: true,
          humanFinalAuthority: true,
          paymentProviderIntegration: "NOT_CONFIGURED",
          printProviderIntegration: "METADATA_ONLY"
        })
      ],
      version: 1,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now
    };

    await this.repository.createPrintProfile(printProfile);
    const created = await this.repository.createEdition(edition);
    await this.audit("COMMERCE_EDITION_CREATED", actor, created.id, undefined, created, undefined, printProfile.id);

    return created;
  }

  async getEdition(actor: CommerceActor, editionId: string): Promise<CommerceEdition> {
    this.validateActor(actor);

    const edition = await this.repository.findEditionById(editionId, actor.organizationId);

    if (!edition) {
      throw new NotFoundException("Commerce edition not found.");
    }

    return edition;
  }

  async listPublicStore(): Promise<CommerceEdition[]> {
    return this.repository.listPublicStoreEditions();
  }

  async createDistribution(
    actor: CommerceActor,
    editionId: string,
    input: CreateCommerceDistributionInput
  ): Promise<CommerceEdition> {
    this.validateActor(actor);

    if (!input.channelName) {
      throw new BadRequestException("channelName is required.");
    }

    const existing = await this.getEdition(actor, editionId);
    const now = new Date().toISOString();
    const channel: CommerceDistributionChannel = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      commerceEditionId: existing.id,
      channelName: input.channelName,
      channelType: input.channelType,
      availability: input.availability ?? "PENDING_COMMERCIAL_APPROVAL",
      price: input.price,
      currency: input.currency,
      stock: input.stock,
      royaltyPercentages: input.royaltyPercentages ?? {},
      region: input.region,
      metadata: input.metadata,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now
    };

    await this.repository.createDistributionChannel(channel);

    const updated: CommerceEdition = {
      ...existing,
      distributionChannelIds: [...existing.distributionChannelIds, channel.id],
      pricing: {
        ...existing.pricing,
        distributionChannels: [...existing.pricing.distributionChannels, channel.channelName]
      },
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("COMMERCE_DISTRIBUTION_CREATED", actor, now, existing.version + 1, {
          distributionChannelId: channel.id,
          metadataOnly: true
        })
      ],
      version: existing.version + 1,
      updatedAt: now
    };

    const saved = await this.repository.updateEdition(updated);
    await this.audit("COMMERCE_DISTRIBUTION_CREATED", actor, saved.id, existing, saved, channel.id);

    return saved;
  }

  async approveEdition(actor: CommerceActor, editionId: string): Promise<CommerceEdition> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getEdition(actor, editionId);
    const now = new Date().toISOString();
    const approved: CommerceEdition = {
      ...existing,
      availabilityStatus: "AVAILABLE",
      approvalStatus: "APPROVED",
      pricing: {
        ...existing.pricing,
        availability: this.approvedPricingAvailability(existing.pricing.availability)
      },
      approvedBy: actor.userId,
      approvedAt: now,
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("COMMERCE_EDITION_APPROVED", actor, now, existing.version + 1, {
          finalAuthority: "AUTHORIZED_HUMAN"
        })
      ],
      version: existing.version + 1,
      updatedAt: now
    };

    const saved = await this.repository.updateEdition(approved);
    await this.audit("COMMERCE_EDITION_APPROVED", actor, saved.id, existing, saved);

    return saved;
  }

  async rejectEdition(actor: CommerceActor, editionId: string): Promise<CommerceEdition> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getEdition(actor, editionId);
    const now = new Date().toISOString();
    const rejected: CommerceEdition = {
      ...existing,
      availabilityStatus: "REJECTED",
      approvalStatus: "REJECTED",
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("COMMERCE_EDITION_REJECTED", actor, now, existing.version + 1, {
          finalAuthority: "AUTHORIZED_HUMAN"
        })
      ],
      version: existing.version + 1,
      updatedAt: now
    };

    const saved = await this.repository.updateEdition(rejected);
    await this.audit("COMMERCE_EDITION_REJECTED", actor, saved.id, existing, saved);

    return saved;
  }

  private buildPrintProfile(
    actor: CommerceActor,
    input: CreateCommerceEditionInput,
    editionId: string,
    createdAt: string
  ): CommercePrintProfile {
    const trimSize = input.printProfile?.trimSize ?? this.defaultTrimSize(input.editionType);

    return {
      id: randomUUID(),
      organizationId: actor.organizationId,
      commerceEditionId: editionId,
      region: input.printProfile?.region ?? this.regionForTrimSize(trimSize),
      trimSize,
      bleed: input.printProfile?.bleed,
      margins: input.printProfile?.margins,
      coverSizes: input.printProfile?.coverSizes ?? [],
      spineWidth: input.printProfile?.spineWidth,
      paperTypes: input.printProfile?.paperTypes ?? [],
      createdBy: actor.userId,
      createdAt,
      updatedAt: createdAt
    };
  }

  private buildEditionMetadata(metadata: CommerceEditionMetadata): CommerceEditionMetadata {
    return {
      isbn: metadata.isbn,
      editionNumber: metadata.editionNumber,
      originalEditionReference: metadata.originalEditionReference,
      originalLanguage: metadata.originalLanguage,
      originalLocale: metadata.originalLocale,
      authoringLanguage: metadata.authoringLanguage,
      authoringLocale: metadata.authoringLocale,
      targetLanguage: metadata.targetLanguage,
      targetLocale: metadata.targetLocale,
      firstPublicationYear: metadata.firstPublicationYear
    };
  }

  private buildPrintOnDemand(
    input: CommercePrintOnDemandMetadata = {},
    printProfileId: string
  ): CommercePrintOnDemandMetadata {
    return {
      provider: input.provider,
      region: input.region,
      status: input.status ?? "METADATA_ONLY",
      printProfileId
    };
  }

  private defaultTrimSize(editionType: CreateCommerceEditionInput["editionType"]): CommercePrintTrimSize {
    if (editionType === "HARDCOVER" || editionType === "PAPERBACK") {
      return "A5";
    }

    return "A4";
  }

  private regionForTrimSize(trimSize: CommercePrintTrimSize): "EUROPEAN" | "AMERICAN" {
    return trimSize === "A5" || trimSize === "B5" || trimSize === "A4" ? "EUROPEAN" : "AMERICAN";
  }

  private approvedPricingAvailability(status: CommerceAvailabilityStatus): CommerceAvailabilityStatus {
    return status === "OUT_OF_STOCK" ? "OUT_OF_STOCK" : "AVAILABLE";
  }

  private async audit(
    action: CommerceAuditAction,
    actor: CommerceActor,
    commerceEditionId: string,
    beforeState: CommerceEdition | CommerceDistributionChannel | undefined,
    afterState: CommerceEdition | CommerceDistributionChannel,
    commerceDistributionChannelId?: string,
    commercePrintProfileId?: string
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      commerceEditionId,
      commerceDistributionChannelId,
      commercePrintProfileId,
      action,
      actorId: actor.userId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private auditTrailItem(
    action: CommerceAuditAction,
    actor: CommerceActor,
    at: string,
    version: number,
    details?: object
  ): CommerceAuditTrailItem {
    return {
      id: randomUUID(),
      action,
      actorId: actor.userId,
      at,
      version,
      details
    };
  }

  private validateActor(actor: CommerceActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

  private assertAuthorizedHuman(actor: CommerceActor): void {
    const permissions = new Set(actor.permissions ?? []);
    const roles = new Set((actor.roles ?? []).map((role) => role.toUpperCase()));

    if (
      !permissions.has("review:approve") &&
      !roles.has("ADMIN") &&
      !roles.has("REVIEWER")
    ) {
      throw new ForbiddenException("Only authorized humans may approve commercial release.");
    }
  }
}
