export interface DocumentActor {
  userId: string;
  organizationId: string;
}

export type DocumentAuditAction = "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | "EXPORT";

export interface DocumentTranslatorAttribution {
  translatorId?: string;
  translatorName?: string;
  originalAuthorId?: string;
  originalAuthorName?: string;
  originalAuthorAttributionPreserved: true;
  visibleInEditorialRecords: true;
  visibleInPublicationRecords: true;
}

export interface Document {
  id: string;
  organizationId: string;
  projectId: string;
  title: string;
  sourceLanguage: string;
  originalLanguage: string;
  originalLocale?: string;
  authoringLanguage: string;
  authoringLocale?: string;
  targetLanguage: string;
  targetLocale?: string;
  documentType: string;
  status: "DRAFT" | "IN_TRANSLATION" | "IN_REVIEW" | "APPROVED" | "EXPORTED";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  translatorId?: string;
  translatorName?: string;
  originalAuthorId?: string;
  originalAuthorName?: string;
  translatorAttribution?: DocumentTranslatorAttribution;
  metadata?: Record<string, unknown>;
}

export interface CreateDocumentInput {
  projectId: string;
  title: string;
  sourceLanguage: string;
  originalLanguage?: string;
  originalLocale?: string;
  authoringLanguage?: string;
  authoringLocale?: string;
  targetLanguage: string;
  targetLocale?: string;
  documentType?: string;
  translatorId?: string;
  translatorName?: string;
  originalAuthorId?: string;
  originalAuthorName?: string;
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
