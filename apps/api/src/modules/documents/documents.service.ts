import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  normalizeLanguageLocale,
  validateIsoCompatibleLanguageTag,
  validateTranslationTargetV1
} from "@laborator/shared";
import { randomUUID } from "node:crypto";
import { ProjectsService } from "../projects/projects.service";
import { DatabaseDocumentsRepository } from "./documents.repository";
import {
  type CreateDocumentInput,
  type Document,
  type DocumentActor,
  type DocumentAuditAction,
  type DocumentAuditEvent
} from "./documents.types";

@Injectable()
export class DocumentsService {
  constructor(
    private readonly repository: DatabaseDocumentsRepository,
    private readonly projectsService: ProjectsService
  ) {}

  async createDocument(actor: DocumentActor, input: CreateDocumentInput): Promise<Document> {
    this.validateActor(actor);

    if (!input.projectId || !input.title || !input.sourceLanguage || !input.targetLanguage) {
      throw new BadRequestException("projectId, title, sourceLanguage and targetLanguage are required.");
    }

    await this.projectsService.getProject(actor, input.projectId);

    const originalLanguage = this.normalizeIsoLanguage(input.originalLanguage ?? input.sourceLanguage, input.originalLocale);
    const authoringLanguage = this.normalizeIsoLanguage(
      input.authoringLanguage ?? input.sourceLanguage,
      input.authoringLocale
    );
    const targetLanguage = this.normalizeTranslationTarget(input.targetLanguage, input.targetLocale);
    const now = new Date().toISOString();
    const document = await this.repository.createDocument({
      id: randomUUID(),
      organizationId: actor.organizationId,
      projectId: input.projectId,
      title: input.title,
      sourceLanguage: originalLanguage.language,
      originalLanguage: originalLanguage.language,
      originalLocale: originalLanguage.locale,
      authoringLanguage: authoringLanguage.language,
      authoringLocale: authoringLanguage.locale,
      targetLanguage: targetLanguage.language,
      targetLocale: targetLanguage.locale,
      documentType: input.documentType ?? "text",
      status: "DRAFT",
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      translatorId: input.translatorId,
      translatorName: input.translatorName,
      originalAuthorId: input.originalAuthorId,
      originalAuthorName: input.originalAuthorName,
      translatorAttribution: this.buildTranslatorAttribution(input),
      metadata: {
        ...(input.metadata ?? {}),
        languagePolicyVersion: "v1.0"
      }
    });

    await this.audit("CREATE", actor, document.id, undefined, document);

    return document;
  }

  async getDocument(actor: DocumentActor, documentId: string): Promise<Document> {
    this.validateActor(actor);
    const document = await this.repository.findDocumentById(documentId, actor.organizationId);

    if (!document) {
      throw new NotFoundException("document not found.");
    }

    return document;
  }

  async listDocuments(actor: DocumentActor, projectId?: string): Promise<Document[]> {
    this.validateActor(actor);
    return this.repository.listDocuments(actor.organizationId, projectId);
  }

  async markDocumentStatus(
    actor: DocumentActor,
    documentId: string,
    status: Document["status"]
  ): Promise<Document> {
    const document = await this.getDocument(actor, documentId);
    const saved = await this.repository.updateDocument({
      ...document,
      status,
      updatedAt: new Date().toISOString()
    });

    await this.audit(this.actionForStatus(status), actor, saved.id, document, saved);

    return saved;
  }

  getAuditEvents(actor: DocumentActor): DocumentAuditEvent[] {
    this.validateActor(actor);
    return this.repository.getAuditEvents(actor.organizationId);
  }

  private actionForStatus(status: Document["status"]): DocumentAuditAction {
    if (status === "APPROVED") {
      return "APPROVE";
    }

    if (status === "EXPORTED") {
      return "EXPORT";
    }

    return "UPDATE";
  }

  private async audit(
    action: DocumentAuditAction,
    actor: DocumentActor,
    entityId: string,
    beforeState: Document | undefined,
    afterState: Document
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      actorId: actor.userId,
      action,
      entityType: "DOCUMENT",
      entityId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private validateActor(actor: DocumentActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

  private buildTranslatorAttribution(input: CreateDocumentInput): Document["translatorAttribution"] {
    if (!input.translatorId && !input.translatorName) {
      return undefined;
    }

    return {
      translatorId: input.translatorId,
      translatorName: input.translatorName,
      originalAuthorId: input.originalAuthorId,
      originalAuthorName: input.originalAuthorName,
      originalAuthorAttributionPreserved: true,
      visibleInEditorialRecords: true,
      visibleInPublicationRecords: true
    };
  }

  private normalizeIsoLanguage(language: string, locale?: string) {
    const validation = validateIsoCompatibleLanguageTag(language);

    if (!validation.valid) {
      throw new BadRequestException(validation.reason ?? "Language must be ISO-compatible.");
    }

    return normalizeLanguageLocale(language, locale);
  }

  private normalizeTranslationTarget(targetLanguage: string, targetLocale?: string) {
    const validation = validateTranslationTargetV1({
      targetLanguage,
      targetLocale
    });

    if (!validation.valid) {
      throw new BadRequestException(validation.reason ?? "Unsupported translation target.");
    }

    return {
      language: validation.language,
      locale: validation.locale
    };
  }
}
