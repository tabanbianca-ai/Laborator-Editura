export interface ProjectActor {
  userId: string;
  organizationId: string;
}

export type ProjectAuditAction = "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | "EXPORT";

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

export interface ProjectAuditEvent {
  id: string;
  organizationId: string;
  actorId: string;
  action: ProjectAuditAction;
  entityType: "PROJECT";
  entityId: string;
  beforeState?: Project | null;
  afterState?: Project | null;
  createdAt: string;
}
