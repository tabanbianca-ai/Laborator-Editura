export interface DocumentActor {
  userId: string;
  organizationId: string;
  roles?: string[];
  permissions?: string[];
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

export type CanonicalDocumentBlockType =
  | "PARAGRAPH"
  | "HEADING"
  | "LIST_ITEM"
  | "TABLE"
  | "CAPTION"
  | "IMAGE"
  | "FOOTNOTE"
  | "ENDNOTE";

export interface CanonicalDocumentBlock {
  id: string;
  order: number;
  type: CanonicalDocumentBlockType;
  text: string;
  html: string;
  headingLevel?: number;
  listType?: "ORDERED" | "UNORDERED";
  sourceReference: string;
}

export interface DocxImportInput {
  projectId: string;
  title?: string;
  originalLanguage: string;
  originalLocale?: string;
  authoringLanguage?: string;
  authoringLocale?: string;
  targetLanguage: string;
  targetLocale?: string;
  translatorName?: string;
  originalAuthorName?: string;
}

export interface UploadedDocxFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

export interface ParsedDocxDocument {
  blocks: CanonicalDocumentBlock[];
  canonicalHtml: string;
  plainText: string;
  messages: string[];
  imageCount: number;
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
