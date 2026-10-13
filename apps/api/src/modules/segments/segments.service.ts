import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DocumentsService } from "../documents/documents.service";
import { DatabaseSegmentsRepository } from "./segments.repository";
import {
  type CreateSegmentInput,
  type CanonicalSegmentInput,
  type ReviseSegmentSourceInput,
  type Segment,
  type SegmentActor,
  type SegmentAuditAction,
  type SegmentAuditEvent
} from "./segments.types";

@Injectable()
export class SegmentsService {
  constructor(
    private readonly repository: DatabaseSegmentsRepository,
    private readonly documentsService: DocumentsService
  ) {}

  async createSegment(actor: SegmentActor, input: CreateSegmentInput): Promise<Segment> {
    this.validateActor(actor);

    if (!input.projectId || !input.documentId || !input.sourceText) {
      throw new BadRequestException("projectId, documentId and sourceText are required.");
    }

    const document = await this.documentsService.getDocument(actor, input.documentId);
    const existing = await this.repository.listSegmentsByDocument(actor.organizationId, input.documentId);
    const now = new Date().toISOString();

    const segment = await this.repository.createSegment({
      id: randomUUID(),
      organizationId: actor.organizationId,
      projectId: input.projectId,
      documentId: input.documentId,
      sourceText: input.sourceText,
      sourceLanguage: input.sourceLanguage ?? document.sourceLanguage,
      sourceLocale: input.sourceLocale ?? document.originalLocale,
      targetLanguage: input.targetLanguage ?? document.targetLanguage,
      targetLocale: input.targetLocale ?? document.targetLocale,
      order: input.order ?? existing.length + 1,
      status: "NEW",
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    });

    await this.audit("CREATE", actor, segment.id, undefined, segment);

    return segment;
  }

  async createCanonicalSegments(
    actor: SegmentActor,
    inputs: CanonicalSegmentInput[]
  ): Promise<Segment[]> {
    const saved: Segment[] = [];

    for (const input of inputs.sort((left, right) => left.order! - right.order!)) {
      const existing = await this.repository.findBySourceBlock(
        actor.organizationId,
        input.documentId,
        input.sourceBlockId
      );

      if (existing) {
        saved.push(existing);
        continue;
      }

      saved.push(await this.createSegment(actor, {
        ...input,
        metadata: {
          ...(input.metadata ?? {}),
          sourceBlockId: input.sourceBlockId,
          sourceBlockOrder: input.sourceBlockOrder,
          sourceChecksum: input.sourceChecksum,
          sourceVersion: input.sourceVersion
        }
      }));
    }

    return saved;
  }

  async reviseSource(
    actor: SegmentActor,
    segmentId: string,
    input: ReviseSegmentSourceInput
  ): Promise<Segment> {
    if (!input.sourceText.trim() || !input.reason.trim()) {
      throw new BadRequestException("sourceText and reason are required.");
    }

    const segment = await this.getSegment(actor, segmentId);
    const sourceVersion = Number(segment.metadata?.sourceVersion ?? 1);
    const sourceVersions = Array.isArray(segment.metadata?.sourceVersions)
      ? segment.metadata.sourceVersions
      : [];
    const saved = await this.repository.updateSegment({
      ...segment,
      sourceText: input.sourceText.trim(),
      status: "NEW",
      latestTranslationId: undefined,
      latestTargetText: undefined,
      updatedAt: new Date().toISOString(),
      metadata: {
        ...(segment.metadata ?? {}),
        sourceVersion: sourceVersion + 1,
        sourceVersions: [
          ...sourceVersions,
          {
            changedAt: new Date().toISOString(),
            changedBy: actor.userId,
            reason: input.reason.trim(),
            sourceText: segment.sourceText,
            version: sourceVersion
          }
        ]
      }
    });

    await this.audit("UPDATE", actor, saved.id, segment, saved);
    return saved;
  }

  async getSegment(actor: SegmentActor, segmentId: string): Promise<Segment> {
    this.validateActor(actor);
    const segment = await this.repository.findSegmentById(segmentId, actor.organizationId);

    if (!segment) {
      throw new NotFoundException("segment not found.");
    }

    return segment;
  }

  async listSegments(actor: SegmentActor, documentId: string): Promise<Segment[]> {
    this.validateActor(actor);

    if (!documentId) {
      throw new BadRequestException("documentId is required.");
    }

    return this.repository.listSegmentsByDocument(actor.organizationId, documentId);
  }

  async markTranslated(
    actor: SegmentActor,
    segmentId: string,
    translationId: string,
    targetText: string
  ): Promise<Segment> {
    const segment = await this.getSegment(actor, segmentId);
    const saved = await this.repository.updateSegment({
      ...segment,
      status: "TRANSLATED",
      latestTranslationId: translationId,
      latestTargetText: targetText,
      updatedAt: new Date().toISOString()
    });

    await this.audit("UPDATE", actor, saved.id, segment, saved);

    return saved;
  }

  getAuditEvents(actor: SegmentActor): SegmentAuditEvent[] {
    this.validateActor(actor);
    return this.repository.getAuditEvents(actor.organizationId);
  }

  private async audit(
    action: SegmentAuditAction,
    actor: SegmentActor,
    entityId: string,
    beforeState: Segment | undefined,
    afterState: Segment
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      actorId: actor.userId,
      action,
      entityType: "SEGMENT",
      entityId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private validateActor(actor: SegmentActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }
}
