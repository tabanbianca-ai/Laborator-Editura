import { apiGet, apiPost, type ApiResult } from "./api-client";

export type ProjectOrigin =
  | "ORIGINAL_CREATION"
  | "EXTERNAL_AUTHOR"
  | "TRANSLATION"
  | "EDITORIAL_COLLABORATION"
  | "PUBLIC_DOMAIN_CLASSICAL_WORK"
  | "MAGAZINE_ARTICLE"
  | "CHILDRENS_BOOK"
  | "AUDIO_VIDEO_PROJECT";

export type ProjectRightsStatus =
  | "ORIGINAL_CREATION"
  | "RIGHTS_OBTAINED"
  | "PUBLIC_DOMAIN"
  | "CLASSICAL_WORK"
  | "OPEN_LICENSE"
  | "RIGHTS_PENDING"
  | "RESTRICTED_PUBLICATION";

export type ProjectPublicationType =
  | "BOOK"
  | "CHILDRENS_BOOK"
  | "MAGAZINE"
  | "POETRY"
  | "DICTIONARY"
  | "COURSE"
  | "AUDIOBOOK"
  | "VIDEO";

export type ProjectCapability =
  | "ILLUSTRATIONS"
  | "TRANSLATION"
  | "AUDIOBOOK"
  | "VIDEO"
  | "FLIPBOOK"
  | "ACCESSIBILITY";

export type ProjectEditorialDomain =
  | "LITERATURE"
  | "PHILOSOPHY"
  | "SPIRITISM"
  | "RELIGION"
  | "PSYCHOLOGY"
  | "EDUCATION"
  | "HISTORY"
  | "SCIENCE"
  | "BIOLOGY"
  | "MATHEMATICS"
  | "MEDICINE"
  | "ART"
  | "MUSIC"
  | "LINGUISTICS"
  | "LAW"
  | "ECONOMICS"
  | "TECHNOLOGY"
  | "CHILDREN_EDUCATIONAL"
  | "OTHER";

export type ProjectEditorialProcessStage =
  | "IMPORT"
  | "ANALYSIS"
  | "ILLUSTRATION"
  | "EDITING"
  | "TRANSLATION"
  | "REVIEW"
  | "EDITORIAL_VALIDATION"
  | "LAYOUT"
  | "EXPORT"
  | "TECHNICAL_VALIDATION"
  | "ACCESSIBILITY"
  | "FINAL_APPROVAL"
  | "PUBLICATION"
  | "AUDIOBOOK"
  | "VIDEO"
  | "FLIPBOOK";

export interface ProjectEditorialClassificationRecord {
  series?: string;
  collection?: string;
  volume?: string;
}

export type ProjectDossierItemType =
  | "MANUSCRIPT"
  | "DOCUMENT"
  | "RESEARCH_FILE"
  | "CONTRACT"
  | "IMAGE"
  | "AUDIO"
  | "VIDEO"
  | "EXPORT"
  | "PUBLISHING_FILE"
  | "OTHER_ASSET";

export interface ProjectIdentityRecord {
  projectOrigin: ProjectOrigin;
  rightsStatus: ProjectRightsStatus;
  originalAuthor?: {
    country?: string;
    name: string;
    originalLanguage: string;
  };
  linkedRightsContractIds?: string[];
  rightsContributionTracking: {
    audiobook: boolean;
    cover: boolean;
    editorialAdaptation: boolean;
    illustrations: boolean;
    layout: boolean;
    otherOriginalContributions: boolean;
    translation: boolean;
    video: boolean;
  };
  publicationEligibility: {
    editingAllowed: boolean;
    originalAuthorRightsRequired: boolean;
    publicationAllowed: boolean;
    translationAllowed: boolean;
  };
}

export interface ProjectRecord {
  createdAt: string;
  createdBy: string;
  description?: string;
  domain?: string;
  id: string;
  name: string;
  originalLanguage?: string;
  originalLocale?: string;
  sourceLanguage: string;
  status: "ACTIVE" | "ARCHIVED";
  targetLanguages: string[];
  targetLocales?: string[];
  updatedAt: string;
  publicationType?: ProjectPublicationType;
  editorialDomain?: ProjectEditorialDomain;
  editorialClassification?: ProjectEditorialClassificationRecord;
  capabilities?: ProjectCapability[];
  editorialProcess?: ProjectEditorialProcessStage[];
  projectIdentity?: ProjectIdentityRecord;
  metadata?: {
    capabilities?: ProjectCapability[];
    editorialClassification?: ProjectEditorialClassificationRecord;
    editorialDomain?: ProjectEditorialDomain;
    editorialProcess?: ProjectEditorialProcessStage[];
    publicationType?: ProjectPublicationType;
    projectIdentity?: ProjectIdentityRecord;
    [key: string]: unknown;
  };
}

export interface ProjectDossierRecord {
  createdAt: string;
  createdBy: string;
  dossierType: "DEFAULT" | "CUSTOM";
  id: string;
  name: string;
  order: number;
  organizationId: string;
  parentDossierId?: string;
  projectId: string;
  slug: string;
  updatedAt: string;
}

export interface ProjectDossierItemRecord {
  assignedAt: string;
  assignedBy: string;
  dossierId: string;
  id: string;
  itemId: string;
  itemType: ProjectDossierItemType;
  label?: string;
  metadata?: Record<string, unknown>;
  organizationId: string;
  projectId: string;
}

export interface ProjectDossierOverview {
  dossiers: ProjectDossierRecord[];
  items: ProjectDossierItemRecord[];
}

export interface CreateProjectRequest {
  description?: string;
  domain?: string;
  name: string;
  originalLanguage?: string;
  originalLocale?: string;
  publicationType: ProjectPublicationType;
  editorialDomain: ProjectEditorialDomain;
  editorialClassification?: ProjectEditorialClassificationRecord;
  capabilities?: ProjectCapability[];
  projectIdentity: {
    linkedRightsContractIds?: string[];
    originalAuthor?: {
      country?: string;
      name?: string;
      originalLanguage?: string;
    };
    projectOrigin: ProjectOrigin;
    rightsStatus: ProjectRightsStatus;
  };
  sourceLanguage: string;
  targetLanguages: string[];
  targetLocales?: string[];
}

export interface DocumentRecord {
  createdAt: string;
  createdBy: string;
  documentType: string;
  id: string;
  originalLanguage?: string;
  originalLocale?: string;
  authoringLanguage?: string;
  authoringLocale?: string;
  projectId: string;
  sourceLanguage: string;
  status: "DRAFT" | "IN_TRANSLATION" | "IN_REVIEW" | "APPROVED" | "EXPORTED";
  targetLanguage: string;
  targetLocale?: string;
  title: string;
  updatedAt: string;
}

export function listProjects(): Promise<ApiResult<ProjectRecord[]>> {
  return apiGet<ProjectRecord[]>("/projects");
}

export function getProject(projectId: string): Promise<ApiResult<ProjectRecord>> {
  return apiGet<ProjectRecord>(`/projects/${encodeURIComponent(projectId)}`);
}

export function createProject(input: CreateProjectRequest): Promise<ApiResult<ProjectRecord>> {
  return apiPost<ProjectRecord, CreateProjectRequest>("/projects", input);
}

export function getProjectDossiers(projectId: string): Promise<ApiResult<ProjectDossierOverview>> {
  return apiGet<ProjectDossierOverview>(`/projects/${encodeURIComponent(projectId)}/dossiers`);
}

export function createProjectDossier(
  projectId: string,
  input: {
    name: string;
    parentDossierId?: string;
  }
): Promise<ApiResult<ProjectDossierRecord>> {
  return apiPost<ProjectDossierRecord, typeof input>(
    `/projects/${encodeURIComponent(projectId)}/dossiers`,
    input
  );
}

export function assignProjectDossierItem(
  projectId: string,
  input: {
    dossierId: string;
    itemId: string;
    itemType: ProjectDossierItemType;
    label?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<ApiResult<ProjectDossierItemRecord>> {
  return apiPost<ProjectDossierItemRecord, typeof input>(
    `/projects/${encodeURIComponent(projectId)}/dossier-items`,
    input
  );
}

export function listDocuments(projectId?: string): Promise<ApiResult<DocumentRecord[]>> {
  const query = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";

  return apiGet<DocumentRecord[]>(`/documents${query}`);
}
