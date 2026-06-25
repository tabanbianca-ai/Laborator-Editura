import { apiGet, apiPost, type ApiResult } from "./api-client";

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

export interface RightsDocumentMetadata {
  fileName?: string;
  fileType?: string;
  reference?: string;
  uploadedAt?: string;
}

export interface CollaborationAgreementRecord {
  agreementType: CollaborationAgreementType;
  attachedDocumentMetadata?: RightsDocumentMetadata;
  collaboratorId?: string;
  collaboratorName: string;
  createdAt: string;
  createdBy: string;
  documentId?: string;
  endDate?: string;
  id: string;
  notes?: string;
  projectId?: string;
  startDate?: string;
  status: CollaborationAgreementStatus;
  updatedAt: string;
}

export interface TranslationAuthorizationRecord {
  authorizationDocumentMetadata?: RightsDocumentMetadata;
  authorizedLanguages: string[];
  createdAt: string;
  createdBy: string;
  documentId?: string;
  id: string;
  notes?: string;
  originalAuthor?: string;
  projectId?: string;
  rightsHolder?: string;
  territories: string[];
  translationAuthorized: boolean;
  updatedAt: string;
  validUntil?: string;
}

export interface PublishingAuthorizationRecord {
  audiobookAllowed: boolean;
  commercialDistributionAllowed: boolean;
  createdAt: string;
  createdBy: string;
  documentId?: string;
  ebookAllowed: boolean;
  id: string;
  mobiAllowed: boolean;
  notes?: string;
  pdfAllowed: boolean;
  printAllowed: boolean;
  projectId?: string;
  publicationAuthorized: boolean;
  updatedAt: string;
  videoAllowed: boolean;
}

export interface ProvenanceRecord {
  createdAt: string;
  createdBy: string;
  documentId?: string;
  firstPublicationYear?: number;
  id: string;
  metadata?: Record<string, unknown>;
  originalAuthor?: string;
  originalEdition?: string;
  originalLanguage?: string;
  originalPublisher?: string;
  originalSourceReference?: string;
  originalTitle?: string;
  projectId?: string;
  publicationHistory?: string[];
  publisher?: string;
  reviewer?: string;
  translator?: string;
  updatedAt: string;
}

export interface RightsAuditEventRecord {
  action: string;
  actorId: string;
  aiMayApproveAgreements: false;
  aiMayAuthorizePublication: false;
  aiMayAuthorizeTranslations: false;
  aiMayDetectMissingPermissions: true;
  aiMayModifyProvenanceAutomatically: false;
  aiMaySummarizeAgreements: true;
  collaborationAgreementId?: string;
  createdAt: string;
  humanFinalAuthorityRequired: true;
  id: string;
  provenanceRecordId?: string;
  publishingAuthorizationId?: string;
  translationAuthorizationId?: string;
}

export interface RightsWarning {
  code:
    | "TRANSLATION_AUTHORIZATION_MISSING"
    | "TRANSLATION_NOT_AUTHORIZED"
    | "TRANSLATION_AUTHORIZATION_EXPIRED"
    | "PUBLICATION_AUTHORIZATION_MISSING"
    | "PUBLICATION_NOT_AUTHORIZED";
  message: string;
  severity: "warning" | "danger";
}

export interface RightsWorkspaceData {
  audit: RightsAuditEventRecord[];
  auditError: string | null;
  contracts: CollaborationAgreementRecord[];
  contractsError: string | null;
  provenance: ProvenanceRecord[];
  provenanceError: string | null;
  publishingRights: PublishingAuthorizationRecord[];
  publishingRightsError: string | null;
  translationRights: TranslationAuthorizationRecord[];
  translationRightsError: string | null;
  warnings: RightsWarning[];
}

export interface RightsWorkspaceInput {
  documentId?: string;
  projectId?: string;
}

export type CreateCollaborationAgreementRequest = Pick<
  CollaborationAgreementRecord,
  | "agreementType"
  | "collaboratorId"
  | "collaboratorName"
  | "documentId"
  | "endDate"
  | "notes"
  | "projectId"
  | "startDate"
> & {
  attachedDocumentMetadata?: RightsDocumentMetadata;
  status?: CollaborationAgreementStatus;
};

export type CreateTranslationAuthorizationRequest = Pick<
  TranslationAuthorizationRecord,
  | "authorizedLanguages"
  | "documentId"
  | "notes"
  | "originalAuthor"
  | "projectId"
  | "rightsHolder"
  | "territories"
  | "translationAuthorized"
  | "validUntil"
> & {
  authorizationDocumentMetadata?: RightsDocumentMetadata;
};

export type CreatePublishingAuthorizationRequest = Pick<
  PublishingAuthorizationRecord,
  | "audiobookAllowed"
  | "commercialDistributionAllowed"
  | "documentId"
  | "ebookAllowed"
  | "mobiAllowed"
  | "notes"
  | "pdfAllowed"
  | "printAllowed"
  | "projectId"
  | "publicationAuthorized"
  | "videoAllowed"
>;

export type CreateProvenanceRecordRequest = Pick<
  ProvenanceRecord,
  | "documentId"
  | "firstPublicationYear"
  | "metadata"
  | "originalAuthor"
  | "originalEdition"
  | "originalLanguage"
  | "originalPublisher"
  | "originalSourceReference"
  | "originalTitle"
  | "projectId"
  | "publicationHistory"
  | "publisher"
  | "reviewer"
  | "translator"
>;

export async function getRightsWorkspaceData(input: RightsWorkspaceInput): Promise<RightsWorkspaceData> {
  const query = buildRightsQuery(input);
  const [contractsResult, translationResult, publishingResult, provenanceResult, auditResult] =
    await Promise.all([
      apiGet<CollaborationAgreementRecord[]>(`/rights/contracts${query}`),
      apiGet<TranslationAuthorizationRecord[]>(`/rights/translation${query}`),
      apiGet<PublishingAuthorizationRecord[]>(`/rights/publishing${query}`),
      apiGet<ProvenanceRecord[]>(`/rights/provenance${query}`),
      apiGet<RightsAuditEventRecord[]>("/rights/audit")
    ]);
  const translationRights = translationResult.data ?? [];
  const publishingRights = publishingResult.data ?? [];

  return {
    audit: auditResult.data ?? [],
    auditError: auditResult.error,
    contracts: contractsResult.data ?? [],
    contractsError: contractsResult.error,
    provenance: provenanceResult.data ?? [],
    provenanceError: provenanceResult.error,
    publishingRights,
    publishingRightsError: publishingResult.error,
    translationRights,
    translationRightsError: translationResult.error,
    warnings: buildRightsWarnings(translationRights, publishingRights)
  };
}

export async function getRightsWarningsForDocument(input: {
  documentId: string;
  projectId?: string;
}): Promise<ApiResult<RightsWarning[]>> {
  const query = buildRightsQuery(input);
  const [translationResult, publishingResult] = await Promise.all([
    apiGet<TranslationAuthorizationRecord[]>(`/rights/translation${query}`),
    apiGet<PublishingAuthorizationRecord[]>(`/rights/publishing${query}`)
  ]);

  return {
    data: buildRightsWarnings(translationResult.data ?? [], publishingResult.data ?? []),
    error: translationResult.error ?? publishingResult.error
  };
}

export function createCollaborationAgreement(
  input: CreateCollaborationAgreementRequest
): Promise<ApiResult<CollaborationAgreementRecord>> {
  return apiPost<CollaborationAgreementRecord, CreateCollaborationAgreementRequest>("/rights/contracts", input);
}

export function createTranslationAuthorization(
  input: CreateTranslationAuthorizationRequest
): Promise<ApiResult<TranslationAuthorizationRecord>> {
  return apiPost<TranslationAuthorizationRecord, CreateTranslationAuthorizationRequest>("/rights/translation", input);
}

export function createPublishingAuthorization(
  input: CreatePublishingAuthorizationRequest
): Promise<ApiResult<PublishingAuthorizationRecord>> {
  return apiPost<PublishingAuthorizationRecord, CreatePublishingAuthorizationRequest>("/rights/publishing", input);
}

export function createProvenanceRecord(
  input: CreateProvenanceRecordRequest
): Promise<ApiResult<ProvenanceRecord>> {
  return apiPost<ProvenanceRecord, CreateProvenanceRecordRequest>("/rights/provenance", input);
}

export function buildRightsWarnings(
  translationRights: TranslationAuthorizationRecord[],
  publishingRights: PublishingAuthorizationRecord[]
): RightsWarning[] {
  const warnings: RightsWarning[] = [];
  const latestTranslation = newestByCreatedAt(translationRights);
  const latestPublishing = newestByCreatedAt(publishingRights);

  if (!latestTranslation) {
    warnings.push({
      code: "TRANSLATION_AUTHORIZATION_MISSING",
      message: "Translation authorization is missing.",
      severity: "warning"
    });
  } else {
    if (!latestTranslation.translationAuthorized) {
      warnings.push({
        code: "TRANSLATION_NOT_AUTHORIZED",
        message: "Translation authorization is not confirmed.",
        severity: "danger"
      });
    }

    if (isExpired(latestTranslation.validUntil)) {
      warnings.push({
        code: "TRANSLATION_AUTHORIZATION_EXPIRED",
        message: "Translation authorization has expired.",
        severity: "danger"
      });
    }
  }

  if (!latestPublishing) {
    warnings.push({
      code: "PUBLICATION_AUTHORIZATION_MISSING",
      message: "Publishing authorization is missing.",
      severity: "warning"
    });
  } else if (!latestPublishing.publicationAuthorized) {
    warnings.push({
      code: "PUBLICATION_NOT_AUTHORIZED",
      message: "Publication authorization is not confirmed.",
      severity: "danger"
    });
  }

  return warnings;
}

function buildRightsQuery(input: RightsWorkspaceInput): string {
  const query = new URLSearchParams();

  if (input.projectId) {
    query.set("projectId", input.projectId);
  }

  if (input.documentId) {
    query.set("documentId", input.documentId);
  }

  const value = query.toString();

  return value ? `?${value}` : "";
}

function newestByCreatedAt<T extends { createdAt: string }>(items: T[]): T | null {
  return (
    [...items].sort(
      (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    )[0] ?? null
  );
}

function isExpired(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  const time = new Date(value).getTime();

  return Number.isFinite(time) && time < Date.now();
}
