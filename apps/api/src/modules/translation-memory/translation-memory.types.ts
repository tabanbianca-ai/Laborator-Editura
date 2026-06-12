export type TranslationMemoryApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ARCHIVED";

export type TranslationMemoryOrigin = "HUMAN" | "AI" | "IMPORT";

export type TranslationMemoryAuditAction = "CREATE" | "UPDATE" | "APPROVE";

export interface TranslationMemoryActor {
  userId: string;
  organizationId: string;
}

export interface TranslationMemoryEntry {
  id: string;
  organizationId: string;
  projectId?: string;
  documentId?: string;
  sourceSegmentId?: string;
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  domain?: string;
  confidenceScore: number;
  approvalStatus: TranslationMemoryApprovalStatus;
  origin: TranslationMemoryOrigin;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface TranslationMemoryAuditEvent {
  id: string;
  organizationId: string;
  tmEntryId: string;
  action: TranslationMemoryAuditAction;
  actorId: string;
  beforeState?: TranslationMemoryEntry;
  afterState?: TranslationMemoryEntry;
  createdAt: string;
}

export interface CreateTranslationMemoryEntryInput {
  projectId?: string;
  documentId?: string;
  sourceSegmentId?: string;
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  domain?: string;
  confidenceScore?: number;
  approvalStatus?: TranslationMemoryApprovalStatus;
  origin?: TranslationMemoryOrigin;
  metadata?: Record<string, unknown>;
}

export interface UpdateTranslationMemoryEntryInput {
  targetText?: string;
  domain?: string;
  confidenceScore?: number;
  approvalStatus?: TranslationMemoryApprovalStatus;
  metadata?: Record<string, unknown>;
}

export interface SearchTranslationMemoryInput {
  sourceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  domain?: string;
  limit?: number;
  similarityThreshold?: number;
}

export interface ListTranslationMemoryInput {
  sourceLanguage: string;
  targetLanguage: string;
  domain?: string;
  includePending?: boolean;
}

export interface TranslationMemoryMatch {
  entry: TranslationMemoryEntry;
  similarityScore: number;
  authoritative: boolean;
}

export interface TranslationMemoryRepository {
  createEntry(entry: TranslationMemoryEntry): Promise<TranslationMemoryEntry>;
  updateEntry(entry: TranslationMemoryEntry): Promise<TranslationMemoryEntry>;
  findEntryById(id: string, organizationId: string): Promise<TranslationMemoryEntry | null>;
  searchEntries(input: SearchTranslationMemoryInput & { organizationId: string }): Promise<TranslationMemoryEntry[]>;
  listEntries(input: ListTranslationMemoryInput & { organizationId: string }): Promise<TranslationMemoryEntry[]>;
  appendAuditEvent(event: TranslationMemoryAuditEvent): Promise<void>;
}
