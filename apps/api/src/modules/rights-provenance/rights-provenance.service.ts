import { BadRequestException, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseRightsProvenanceRepository } from "./rights-provenance.repository";
import {
  type CollaborationAgreement,
  type CreateCollaborationAgreementInput,
  type CreateProvenanceRecordInput,
  type CreatePublishingAuthorizationInput,
  type CreateTranslationAuthorizationInput,
  type ProvenanceRecord,
  type PublishingAuthorization,
  type RightsActor,
  type RightsAuditAction,
  type RightsAuditEvent,
  type RightsQuery,
  type TranslationAuthorization
} from "./rights-provenance.types";

@Injectable()
export class RightsProvenanceService {
  constructor(private readonly repository: DatabaseRightsProvenanceRepository) {}

  async createCollaborationAgreement(
    actor: RightsActor,
    input: CreateCollaborationAgreementInput
  ): Promise<CollaborationAgreement> {
    this.validateActor(actor);

    if (!input.agreementType || !input.collaboratorName) {
      throw new BadRequestException("agreementType and collaboratorName are required.");
    }

    const now = new Date().toISOString();
    const agreement: CollaborationAgreement = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      projectId: input.projectId,
      documentId: input.documentId,
      agreementType: input.agreementType,
      status: input.status ?? "DRAFT",
      collaboratorId: input.collaboratorId,
      collaboratorName: input.collaboratorName,
      startDate: input.startDate,
      endDate: input.endDate,
      attachedDocumentMetadata: input.attachedDocumentMetadata,
      notes: input.notes,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now
    };
    const created = await this.repository.createCollaborationAgreement(agreement);
    await this.audit("COLLABORATION_AGREEMENT_CREATED", actor, { collaborationAgreementId: created.id }, created);

    return created;
  }

  async listCollaborationAgreements(actor: RightsActor, query: RightsQuery = {}): Promise<CollaborationAgreement[]> {
    this.validateActor(actor);
    const agreements = await this.repository.listCollaborationAgreements(actor.organizationId);

    return this.filterByProjectDocument(agreements, query);
  }

  async createTranslationAuthorization(
    actor: RightsActor,
    input: CreateTranslationAuthorizationInput
  ): Promise<TranslationAuthorization> {
    this.validateActor(actor);

    const now = new Date().toISOString();
    const authorization: TranslationAuthorization = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      projectId: input.projectId,
      documentId: input.documentId,
      originalAuthor: input.originalAuthor,
      rightsHolder: input.rightsHolder,
      translationAuthorized: input.translationAuthorized ?? false,
      authorizedLanguages: input.authorizedLanguages ?? [],
      territories: input.territories ?? [],
      validUntil: input.validUntil,
      authorizationDocumentMetadata: input.authorizationDocumentMetadata,
      notes: input.notes,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now
    };
    const created = await this.repository.createTranslationAuthorization(authorization);
    await this.audit("TRANSLATION_AUTHORIZATION_CREATED", actor, { translationAuthorizationId: created.id }, created);

    return created;
  }

  async listTranslationAuthorizations(actor: RightsActor, query: RightsQuery = {}): Promise<TranslationAuthorization[]> {
    this.validateActor(actor);
    const authorizations = await this.repository.listTranslationAuthorizations(actor.organizationId);

    return this.filterByProjectDocument(authorizations, query);
  }

  async createPublishingAuthorization(
    actor: RightsActor,
    input: CreatePublishingAuthorizationInput
  ): Promise<PublishingAuthorization> {
    this.validateActor(actor);

    const now = new Date().toISOString();
    const authorization: PublishingAuthorization = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      projectId: input.projectId,
      documentId: input.documentId,
      publicationAuthorized: input.publicationAuthorized ?? false,
      ebookAllowed: input.ebookAllowed ?? false,
      printAllowed: input.printAllowed ?? false,
      pdfAllowed: input.pdfAllowed ?? false,
      mobiAllowed: input.mobiAllowed ?? false,
      audiobookAllowed: input.audiobookAllowed ?? false,
      videoAllowed: input.videoAllowed ?? false,
      commercialDistributionAllowed: input.commercialDistributionAllowed ?? false,
      notes: input.notes,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now
    };
    const created = await this.repository.createPublishingAuthorization(authorization);
    await this.audit("PUBLISHING_AUTHORIZATION_CREATED", actor, { publishingAuthorizationId: created.id }, created);

    return created;
  }

  async listPublishingAuthorizations(actor: RightsActor, query: RightsQuery = {}): Promise<PublishingAuthorization[]> {
    this.validateActor(actor);
    const authorizations = await this.repository.listPublishingAuthorizations(actor.organizationId);

    return this.filterByProjectDocument(authorizations, query);
  }

  async createProvenanceRecord(actor: RightsActor, input: CreateProvenanceRecordInput): Promise<ProvenanceRecord> {
    this.validateActor(actor);

    const now = new Date().toISOString();
    const record: ProvenanceRecord = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      projectId: input.projectId,
      documentId: input.documentId,
      originalTitle: input.originalTitle,
      originalLanguage: input.originalLanguage,
      firstPublicationYear: input.firstPublicationYear,
      originalEdition: input.originalEdition,
      originalPublisher: input.originalPublisher,
      originalSourceReference: input.originalSourceReference,
      originalAuthor: input.originalAuthor,
      translator: input.translator,
      reviewer: input.reviewer,
      publisher: input.publisher,
      publicationHistory: input.publicationHistory ?? [],
      metadata: input.metadata,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now
    };
    const created = await this.repository.createProvenanceRecord(record);
    await this.audit("PROVENANCE_RECORD_CREATED", actor, { provenanceRecordId: created.id }, created);

    return created;
  }

  async listProvenanceRecords(actor: RightsActor, query: RightsQuery = {}): Promise<ProvenanceRecord[]> {
    this.validateActor(actor);
    const records = await this.repository.listProvenanceRecords(actor.organizationId);

    return this.filterByProjectDocument(records, query);
  }

  async listAuditEvents(actor: RightsActor): Promise<RightsAuditEvent[]> {
    this.validateActor(actor);

    return this.repository.listAuditEvents(actor.organizationId);
  }

  private filterByProjectDocument<T extends { documentId?: string; projectId?: string }>(
    records: T[],
    query: RightsQuery
  ): T[] {
    return records.filter(
      (record) =>
        (!query.projectId || record.projectId === query.projectId) &&
        (!query.documentId || record.documentId === query.documentId)
    );
  }

  private async audit(
    action: RightsAuditAction,
    actor: RightsActor,
    ids: Partial<Pick<
      RightsAuditEvent,
      | "collaborationAgreementId"
      | "translationAuthorizationId"
      | "publishingAuthorizationId"
      | "provenanceRecordId"
    >>,
    afterState: object
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      action,
      actorId: actor.userId,
      ...ids,
      afterState,
      humanFinalAuthorityRequired: true,
      aiMaySummarizeAgreements: true,
      aiMayDetectMissingPermissions: true,
      aiMayApproveAgreements: false,
      aiMayAuthorizeTranslations: false,
      aiMayAuthorizePublication: false,
      aiMayModifyProvenanceAutomatically: false,
      createdAt: new Date().toISOString()
    });
  }

  private validateActor(actor: RightsActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("Authenticated actor with organization is required.");
    }
  }
}
