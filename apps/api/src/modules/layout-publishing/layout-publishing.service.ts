import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseLayoutPublicationRepository } from "./layout-publishing.repository";
import {
  type BookLayoutPlan,
  type CreateLayoutPublicationPlanInput,
  type EditorialFinishingProfile,
  type LayoutAuditAction,
  type LayoutMultimediaProfile,
  type LayoutPublicationExportHistory,
  type LayoutPublicationHistoryItem,
  type LayoutPublicationPlan,
  type LayoutPublishingActor,
  type MagazineLayoutPlan,
  type RecordLayoutExportInput
} from "./layout-publishing.types";

@Injectable()
export class LayoutPublishingService {
  constructor(private readonly repository: DatabaseLayoutPublicationRepository) {}

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
    planId: string,
    beforeState: LayoutPublicationPlan | undefined,
    afterState: LayoutPublicationPlan
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      layoutPublicationPlanId: planId,
      action,
      actorId: actor.userId,
      beforeState,
      afterState,
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

  private assertAuthorizedHuman(actor: LayoutPublishingActor): void {
    const permissions = new Set(actor.permissions ?? []);
    const roles = new Set((actor.roles ?? []).map((role) => role.toUpperCase()));

    if (
      !permissions.has("review:approve") &&
      !roles.has("PLATFORM_CREATOR") &&
      !roles.has("ADMIN") &&
      !roles.has("REVIEWER")
    ) {
      throw new ForbiddenException("Only authorized humans may approve publication.");
    }
  }
}
