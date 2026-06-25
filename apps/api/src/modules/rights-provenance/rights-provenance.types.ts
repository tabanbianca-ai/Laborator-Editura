import { type AuthenticatedRequestContext } from "../auth/request-context.types";

export type RightsActor = AuthenticatedRequestContext;

export type CollaborationAgreementType =
  | "AUTHOR"
  | "TRANSLATOR"
  | "EDITOR"
  | "DESIGNER"
  | "ILLUSTRATOR"
  | "AUDIO_NARRATOR"
  | "COLLABORATOR";

export type CollaborationAgreementStatus =
  | "DRAFT"
  | "SENT"
  | "ACCEPTED"
  | "EXPIRED"
  | "TERMINATED";

export type RightsAuditAction =
  | "COLLABORATION_AGREEMENT_CREATED"
  | "TRANSLATION_AUTHORIZATION_CREATED"
  | "PUBLISHING_AUTHORIZATION_CREATED"
  | "PROVENANCE_RECORD_CREATED";

export interface RightsDocumentMetadata {
  fileName?: string;
  fileType?: string;
  reference?: string;
  uploadedAt?: string;
}

export interface CollaborationAgreement {
  id: string;
  organizationId: string;
  projectId?: string;
  documentId?: string;
  agreementType: CollaborationAgreementType;
  status: CollaborationAgreementStatus;
  collaboratorId?: string;
  collaboratorName: string;
  startDate?: string;
  endDate?: string;
  attachedDocumentMetadata?: RightsDocumentMetadata;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TranslationAuthorization {
  id: string;
  organizationId: string;
  projectId?: string;
  documentId?: string;
  originalAuthor?: string;
  rightsHolder?: string;
  translationAuthorized: boolean;
  authorizedLanguages: string[];
  territories: string[];
  validUntil?: string;
  authorizationDocumentMetadata?: RightsDocumentMetadata;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublishingAuthorization {
  id: string;
  organizationId: string;
  projectId?: string;
  documentId?: string;
  publicationAuthorized: boolean;
  ebookAllowed: boolean;
  printAllowed: boolean;
  pdfAllowed: boolean;
  mobiAllowed: boolean;
  audiobookAllowed: boolean;
  videoAllowed: boolean;
  commercialDistributionAllowed: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface ProvenanceRecord {
  id: string;
  organizationId: string;
  projectId?: string;
  documentId?: string;
  originalTitle?: string;
  originalLanguage?: string;
  firstPublicationYear?: number;
  originalEdition?: string;
  originalPublisher?: string;
  originalSourceReference?: string;
  originalAuthor?: string;
  translator?: string;
  reviewer?: string;
  publisher?: string;
  publicationHistory?: string[];
  metadata?: Record<string, unknown>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RightsAuditEvent {
  id: string;
  organizationId: string;
  action: RightsAuditAction;
  actorId: string;
  collaborationAgreementId?: string;
  translationAuthorizationId?: string;
  publishingAuthorizationId?: string;
  provenanceRecordId?: string;
  beforeState?: object;
  afterState?: object;
  humanFinalAuthorityRequired: true;
  aiMaySummarizeAgreements: true;
  aiMayDetectMissingPermissions: true;
  aiMayApproveAgreements: false;
  aiMayAuthorizeTranslations: false;
  aiMayAuthorizePublication: false;
  aiMayModifyProvenanceAutomatically: false;
  createdAt: string;
}

export interface CreateCollaborationAgreementInput {
  projectId?: string;
  documentId?: string;
  agreementType: CollaborationAgreementType;
  status?: CollaborationAgreementStatus;
  collaboratorId?: string;
  collaboratorName: string;
  startDate?: string;
  endDate?: string;
  attachedDocumentMetadata?: RightsDocumentMetadata;
  notes?: string;
}

export interface CreateTranslationAuthorizationInput {
  projectId?: string;
  documentId?: string;
  originalAuthor?: string;
  rightsHolder?: string;
  translationAuthorized?: boolean;
  authorizedLanguages?: string[];
  territories?: string[];
  validUntil?: string;
  authorizationDocumentMetadata?: RightsDocumentMetadata;
  notes?: string;
}

export interface CreatePublishingAuthorizationInput {
  projectId?: string;
  documentId?: string;
  publicationAuthorized?: boolean;
  ebookAllowed?: boolean;
  printAllowed?: boolean;
  pdfAllowed?: boolean;
  mobiAllowed?: boolean;
  audiobookAllowed?: boolean;
  videoAllowed?: boolean;
  commercialDistributionAllowed?: boolean;
  notes?: string;
}

export interface CreateProvenanceRecordInput {
  projectId?: string;
  documentId?: string;
  originalTitle?: string;
  originalLanguage?: string;
  firstPublicationYear?: number;
  originalEdition?: string;
  originalPublisher?: string;
  originalSourceReference?: string;
  originalAuthor?: string;
  translator?: string;
  reviewer?: string;
  publisher?: string;
  publicationHistory?: string[];
  metadata?: Record<string, unknown>;
}

export interface RightsQuery {
  documentId?: string;
  projectId?: string;
}

export interface RightsProvenanceRepository {
  createCollaborationAgreement(agreement: CollaborationAgreement): Promise<CollaborationAgreement>;
  listCollaborationAgreements(organizationId: string): Promise<CollaborationAgreement[]>;
  createTranslationAuthorization(authorization: TranslationAuthorization): Promise<TranslationAuthorization>;
  listTranslationAuthorizations(organizationId: string): Promise<TranslationAuthorization[]>;
  createPublishingAuthorization(authorization: PublishingAuthorization): Promise<PublishingAuthorization>;
  listPublishingAuthorizations(organizationId: string): Promise<PublishingAuthorization[]>;
  createProvenanceRecord(record: ProvenanceRecord): Promise<ProvenanceRecord>;
  listProvenanceRecords(organizationId: string): Promise<ProvenanceRecord[]>;
  appendAuditEvent(event: RightsAuditEvent): Promise<void>;
  listAuditEvents(organizationId: string): Promise<RightsAuditEvent[]>;
}
