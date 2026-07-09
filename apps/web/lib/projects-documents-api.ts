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
  projectIdentity?: ProjectIdentityRecord;
  metadata?: {
    projectIdentity?: ProjectIdentityRecord;
    [key: string]: unknown;
  };
}

export interface CreateProjectRequest {
  description?: string;
  domain?: string;
  name: string;
  originalLanguage?: string;
  originalLocale?: string;
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

export function createProject(input: CreateProjectRequest): Promise<ApiResult<ProjectRecord>> {
  return apiPost<ProjectRecord, CreateProjectRequest>("/projects", input);
}

export function listDocuments(projectId?: string): Promise<ApiResult<DocumentRecord[]>> {
  const query = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";

  return apiGet<DocumentRecord[]>(`/documents${query}`);
}
