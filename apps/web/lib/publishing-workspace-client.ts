import { apiGet, apiPost, type ApiResult } from "./api-client";
import {
  listDocuments,
  listProjects,
  type DocumentRecord,
  type ProjectRecord
} from "./projects-documents-api";
import { getRightsWarningsForDocument, type RightsWarning } from "./rights-workspace-client";
import type { ReviewWorkflowState } from "./review-workspace-client";
import type { WorkspaceTranslationRecord } from "./translation-workspace-client";

export type PublishingExportFormat = "PDF" | "EPUB" | "MOBI" | "PRINT_ON_DEMAND";
export type LayoutApprovalStatus = "PENDING_HUMAN_APPROVAL" | "APPROVED" | "REJECTED";

export interface LayoutPublicationPlanRecord {
  approvalStatus: LayoutApprovalStatus;
  approvedAt?: string;
  approvedBy?: string;
  createdAt: string;
  documentId?: string;
  editorialFinishing: {
    bleed: string;
    margins: string;
    pagination: string;
    printProfiles: string[];
    typographyValidation: boolean;
    widowOrphanControl: boolean;
  };
  exportFormats: string[];
  exportHistory: Array<{
    artifactUri?: string;
    createdAt: string;
    createdBy: string;
    format: string;
    id: string;
  }>;
  humanApprovalRequired: true;
  id: string;
  language: string;
  layoutVersion: number;
  projectId?: string;
  publicationHistory: Array<{
    action: string;
    actorId: string;
    at: string;
    id: string;
  }>;
  publicationKind: "BOOK" | "MAGAZINE";
  styleRevision: number;
  title: string;
  updatedAt: string;
}

export interface ExportArtifactRecord {
  createdAt: string;
  createdBy: string;
  documentId: string;
  format: "JSON_MASTER";
  id: string;
  metadata?: {
    translatorAttribution?: Array<{
      originalAuthorId?: string;
      originalAuthorName?: string;
      translatorId?: string;
      translatorName?: string;
    }>;
  };
  projectId: string;
}

export interface PublicCatalogItemRecord {
  approvedAt?: string;
  approvedBy?: string;
  availabilityStatus: "DRAFT" | "PENDING_RELEASE_APPROVAL" | "PUBLIC" | "REJECTED" | "UNAVAILABLE";
  documentId?: string;
  humanApprovalRequired: true;
  id: string;
  metadata: {
    authors: string[];
    language: string;
    originalSourceReferences: string[];
    title: string;
    translators?: Array<{
      originalAuthorAttributionPreserved: true;
      translatorId?: string;
      translatorName?: string;
    }>;
  };
  releaseApprovalStatus: "PENDING_HUMAN_APPROVAL" | "APPROVED" | "REJECTED";
  updatedAt: string;
}

export interface CommerceEditionRecord {
  approvalStatus: "PENDING_HUMAN_APPROVAL" | "APPROVED" | "REJECTED";
  approvedAt?: string;
  approvedBy?: string;
  availabilityStatus:
    | "DRAFT"
    | "PENDING_COMMERCIAL_APPROVAL"
    | "AVAILABLE"
    | "REJECTED"
    | "UNAVAILABLE"
    | "OUT_OF_STOCK";
  editionType: string;
  id: string;
  language: string;
  metadata: {
    firstPublicationYear?: number;
    isbn?: string;
    originalEditionReference?: string;
    originalLanguage: string;
  };
  paymentProviderIntegration: "NOT_CONFIGURED";
  printOnDemand: {
    provider?: string;
    region?: string;
    status?: string;
  };
  printProfile: {
    bleed?: string;
    coverSizes?: string[];
    margins?: string;
    paperTypes?: string[];
    region: string;
    spineWidth?: string;
    trimSize: string;
  };
  pricing: {
    availability: string;
    currency?: string;
    price?: number;
    stock?: number;
  };
  title: string;
  updatedAt: string;
}

export interface PublishingWorkspaceData {
  artifact: ExportArtifactRecord | null;
  artifactError: string | null;
  commerceEdition: CommerceEditionRecord | null;
  commerceEditionError: string | null;
  documents: DocumentRecord[];
  documentsError: string | null;
  layoutPlan: LayoutPublicationPlanRecord | null;
  layoutPlanError: string | null;
  latestTranslation: WorkspaceTranslationRecord | null;
  projects: ProjectRecord[];
  projectsError: string | null;
  publicCatalogItem: PublicCatalogItemRecord | null;
  publicCatalogItemError: string | null;
  rightsError: string | null;
  rightsWarnings: RightsWarning[];
  selectedDocument: DocumentRecord | null;
  selectedProject: ProjectRecord | null;
  translations: WorkspaceTranslationRecord[];
  translationsError: string | null;
  workflow: ReviewWorkflowState | null;
  workflowError: string | null;
}

interface PublishingWorkspaceInput {
  commerceEditionId?: string;
  documentId?: string;
  exportArtifactId?: string;
  layoutPlanId?: string;
  publicCatalogItemId?: string;
}

export async function getPublishingWorkspaceData({
  commerceEditionId,
  documentId,
  exportArtifactId,
  layoutPlanId,
  publicCatalogItemId
}: PublishingWorkspaceInput): Promise<PublishingWorkspaceData> {
  const [projectsResult, documentsResult] = await Promise.all([listProjects(), listDocuments()]);
  const documents = documentsResult.data ?? [];
  const projects = projectsResult.data ?? [];
  const selectedDocument = documentId
    ? documents.find((document) => document.id === documentId) ?? null
    : null;
  const selectedProject = selectedDocument
    ? projects.find((project) => project.id === selectedDocument.projectId) ?? null
    : null;

  if (!selectedDocument) {
    return emptyPublishingWorkspace({
      documents,
      documentsError: documentsResult.error,
      projects,
      projectsError: projectsResult.error
    });
  }

  const [
    translationsResult,
    workflowResult,
    layoutPlanResult,
    artifactResult,
    publicCatalogResult,
    commerceEditionResult,
    rightsResult
  ] = await Promise.all([
    listPublishingTranslations(selectedDocument.id),
    getWorkflowStatus({
      documentId: selectedDocument.id,
      projectId: selectedDocument.projectId
    }),
    layoutPlanId ? getLayoutPublicationPlan(layoutPlanId) : emptyResult<LayoutPublicationPlanRecord>(),
    exportArtifactId ? getExportArtifact(exportArtifactId) : emptyResult<ExportArtifactRecord>(),
    publicCatalogItemId ? getPublicCatalogItem(publicCatalogItemId) : emptyResult<PublicCatalogItemRecord>(),
    commerceEditionId ? getCommerceEdition(commerceEditionId) : emptyResult<CommerceEditionRecord>(),
    getRightsWarningsForDocument({
      documentId: selectedDocument.id,
      projectId: selectedDocument.projectId
    })
  ]);
  const translations = translationsResult.data ?? [];

  return {
    artifact: artifactResult.data,
    artifactError: artifactResult.error,
    commerceEdition: commerceEditionResult.data,
    commerceEditionError: commerceEditionResult.error,
    documents,
    documentsError: documentsResult.error,
    layoutPlan: layoutPlanResult.data,
    layoutPlanError: layoutPlanResult.error,
    latestTranslation: findLatestTranslation(translations),
    projects,
    projectsError: projectsResult.error,
    publicCatalogItem: publicCatalogResult.data,
    publicCatalogItemError: publicCatalogResult.error,
    rightsError: rightsResult.error,
    rightsWarnings: rightsResult.data ?? [],
    selectedDocument,
    selectedProject,
    translations,
    translationsError: translationsResult.error,
    workflow: workflowResult.data,
    workflowError: workflowResult.error
  };
}

export function createJsonMasterExport(input: {
  documentId: string;
  projectId: string;
}): Promise<ApiResult<ExportArtifactRecord>> {
  return apiPost<ExportArtifactRecord, { projectId: string }>(
    `/export/documents/${encodeURIComponent(input.documentId)}/json-master`,
    { projectId: input.projectId }
  );
}

export function approveLayoutPublication(input: {
  planId: string;
}): Promise<ApiResult<LayoutPublicationPlanRecord>> {
  return apiPost<LayoutPublicationPlanRecord, Record<string, never>>(
    `/layout-publishing/plans/${encodeURIComponent(input.planId)}/approve`,
    {}
  );
}

export function recordLayoutExport(input: {
  artifactUri?: string;
  format: PublishingExportFormat;
  planId: string;
}): Promise<ApiResult<LayoutPublicationPlanRecord>> {
  return apiPost<LayoutPublicationPlanRecord, { artifactUri?: string; format: PublishingExportFormat }>(
    `/layout-publishing/plans/${encodeURIComponent(input.planId)}/exports`,
    {
      artifactUri: input.artifactUri,
      format: input.format
    }
  );
}

function listPublishingTranslations(documentId: string): Promise<ApiResult<WorkspaceTranslationRecord[]>> {
  return apiGet<WorkspaceTranslationRecord[]>(
    `/translations?documentId=${encodeURIComponent(documentId)}`
  );
}

function getWorkflowStatus(input: {
  documentId: string;
  projectId?: string;
}): Promise<ApiResult<ReviewWorkflowState>> {
  const query = new URLSearchParams({
    documentId: input.documentId
  });

  if (input.projectId) {
    query.set("projectId", input.projectId);
  }

  return apiGet<ReviewWorkflowState>(`/workflow/status?${query.toString()}`);
}

function getLayoutPublicationPlan(planId: string): Promise<ApiResult<LayoutPublicationPlanRecord>> {
  return apiGet<LayoutPublicationPlanRecord>(
    `/layout-publishing/plans/${encodeURIComponent(planId)}`
  );
}

function getExportArtifact(artifactId: string): Promise<ApiResult<ExportArtifactRecord>> {
  return apiGet<ExportArtifactRecord>(`/export/artifacts/${encodeURIComponent(artifactId)}`);
}

function getPublicCatalogItem(itemId: string): Promise<ApiResult<PublicCatalogItemRecord>> {
  return apiGet<PublicCatalogItemRecord>(
    `/public-portal/catalog-items/${encodeURIComponent(itemId)}`
  );
}

function getCommerceEdition(editionId: string): Promise<ApiResult<CommerceEditionRecord>> {
  return apiGet<CommerceEditionRecord>(`/commerce/editions/${encodeURIComponent(editionId)}`);
}

function emptyResult<T>(): ApiResult<T> {
  return {
    data: null,
    error: null
  };
}

function findLatestTranslation(
  translations: WorkspaceTranslationRecord[]
): WorkspaceTranslationRecord | null {
  return (
    [...translations].sort(
      (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    )[0] ?? null
  );
}

function emptyPublishingWorkspace(input: {
  documents: DocumentRecord[];
  documentsError: string | null;
  projects: ProjectRecord[];
  projectsError: string | null;
}): PublishingWorkspaceData {
  return {
    artifact: null,
    artifactError: null,
    commerceEdition: null,
    commerceEditionError: null,
    documents: input.documents,
    documentsError: input.documentsError,
    layoutPlan: null,
    layoutPlanError: null,
    latestTranslation: null,
    projects: input.projects,
    projectsError: input.projectsError,
    publicCatalogItem: null,
    publicCatalogItemError: null,
    rightsError: null,
    rightsWarnings: [],
    selectedDocument: null,
    selectedProject: null,
    translations: [],
    translationsError: null,
    workflow: null,
    workflowError: null
  };
}
