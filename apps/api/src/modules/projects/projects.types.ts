export interface ProjectActor {
  userId: string;
  organizationId: string;
}

export type ProjectAuditAction = "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | "EXPORT";

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  sourceLanguage: string;
  targetLanguages: string[];
  domain?: string;
  status: "ACTIVE" | "ARCHIVED";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  sourceLanguage: string;
  targetLanguages: string[];
  domain?: string;
  metadata?: Record<string, unknown>;
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
