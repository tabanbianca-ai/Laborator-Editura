export interface DocumentActor {
  userId: string;
  organizationId: string;
}

export type DocumentAuditAction = "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | "EXPORT";

export interface Document {
  id: string;
  organizationId: string;
  projectId: string;
  title: string;
  sourceLanguage: string;
  targetLanguage: string;
  documentType: string;
  status: "DRAFT" | "IN_TRANSLATION" | "IN_REVIEW" | "APPROVED" | "EXPORTED";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface CreateDocumentInput {
  projectId: string;
  title: string;
  sourceLanguage: string;
  targetLanguage: string;
  documentType?: string;
  metadata?: Record<string, unknown>;
}

export interface DocumentAuditEvent {
  id: string;
  organizationId: string;
  actorId: string;
  action: DocumentAuditAction;
  entityType: "DOCUMENT";
  entityId: string;
  beforeState?: Document | null;
  afterState?: Document | null;
  createdAt: string;
}
