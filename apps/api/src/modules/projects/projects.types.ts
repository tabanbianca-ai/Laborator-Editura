export interface ProjectActor {
  userId: string;
  organizationId: string;
}

export type ProjectAuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "APPROVE"
  | "EXPORT"
  | "DOSSIER_CREATED"
  | "DOSSIER_ITEM_ASSIGNED";

export type ProjectDossierType =
  | "DEFAULT"
  | "CUSTOM";

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

export interface ProjectOriginalAuthorIdentity {
  name: string;
  country?: string;
  originalLanguage: string;
}

export interface ProjectRightsContributionTracking {
  translation: boolean;
  editorialAdaptation: boolean;
  illustrations: boolean;
  layout: boolean;
  cover: boolean;
  audiobook: boolean;
  video: boolean;
  otherOriginalContributions: boolean;
}

export interface ProjectIdentity {
  projectOrigin: ProjectOrigin;
  rightsStatus: ProjectRightsStatus;
  originalAuthor?: ProjectOriginalAuthorIdentity;
  linkedRightsContractIds?: string[];
  rightsContributionTracking: ProjectRightsContributionTracking;
  publicationEligibility: {
    editingAllowed: boolean;
    translationAllowed: boolean;
    publicationAllowed: boolean;
    originalAuthorRightsRequired: boolean;
  };
}

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  sourceLanguage: string;
  originalLanguage: string;
  originalLocale?: string;
  targetLanguages: string[];
  targetLocales?: string[];
  domain?: string;
  status: "ACTIVE" | "ARCHIVED";
  projectIdentity?: ProjectIdentity;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface ProjectDossier {
  id: string;
  organizationId: string;
  projectId: string;
  parentDossierId?: string;
  name: string;
  slug: string;
  dossierType: ProjectDossierType;
  order: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDossierItem {
  id: string;
  organizationId: string;
  projectId: string;
  dossierId: string;
  itemType: ProjectDossierItemType;
  itemId: string;
  label?: string;
  metadata?: Record<string, unknown>;
  assignedBy: string;
  assignedAt: string;
}

export interface ProjectDossierOverview {
  dossiers: ProjectDossier[];
  items: ProjectDossierItem[];
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  sourceLanguage: string;
  originalLanguage?: string;
  originalLocale?: string;
  targetLanguages: string[];
  targetLocales?: string[];
  domain?: string;
  projectIdentity: ProjectIdentityInput;
  metadata?: Record<string, unknown>;
}

export interface ProjectIdentityInput {
  projectOrigin: ProjectOrigin;
  rightsStatus: ProjectRightsStatus;
  originalAuthor?: Partial<ProjectOriginalAuthorIdentity>;
  linkedRightsContractIds?: string[];
}

export interface CreateProjectDossierInput {
  name: string;
  parentDossierId?: string;
}

export interface AssignProjectDossierItemInput {
  dossierId: string;
  itemType: ProjectDossierItemType;
  itemId: string;
  label?: string;
  metadata?: Record<string, unknown>;
}

export interface ProjectAuditEvent {
  id: string;
  organizationId: string;
  actorId: string;
  action: ProjectAuditAction;
  entityType: "PROJECT" | "PROJECT_DOSSIER" | "PROJECT_DOSSIER_ITEM";
  entityId: string;
  beforeState?: Project | ProjectDossier | ProjectDossierItem | null;
  afterState?: Project | ProjectDossier | ProjectDossierItem | null;
  createdAt: string;
}
