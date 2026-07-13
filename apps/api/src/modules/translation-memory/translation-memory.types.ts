export type TranslationMemoryApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ARCHIVED";

export type TranslationMemoryOrigin = "HUMAN" | "AI" | "IMPORT";

export type TranslationMemoryAuditAction =
  | "CREATE"
  | "UPDATE"
  | "APPROVE"
  | "TRANSLATION_MEMORY_ENTRY_ADDED"
  | "TRANSLATION_MEMORY_REUSED"
  | "CONFIDENCE_RECALCULATED";

export type TranslationMemoryMatchType = "CONTEXT" | "EXACT" | "FUZZY";

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
  sourceSegment?: string;
  translatedSegment?: string;
  sourceLanguage: string;
  targetLanguage: string;
  domain?: string;
  context?: string;
  author?: string;
  reviewer?: string;
  approvalDate?: string;
  version?: number;
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
  context?: string;
  author?: string;
  reviewer?: string;
  approvalDate?: string;
  version?: number;
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
  context?: string;
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
  matchType: TranslationMemoryMatchType;
  authoritative: boolean;
  automaticReplacement: false;
  proposalOnly: true;
}

export interface TranslationMemoryProposal {
  id: string;
  sourceText: string;
  proposedTargetText: string;
  confidenceScore: number;
  consultedSources: string[];
  glossaryUsed?: string;
  translationMemoryMatch: TranslationMemoryMatch;
  terminologyStatus: "NOT_CHECKED" | "REQUIRES_REVIEW" | "VALIDATED";
  semanticValidation: "NOT_CHECKED" | "SUPPORTING_EVIDENCE";
  explanation: string;
  automaticReplacement: false;
  humanFinalAuthority: true;
}

export interface TranslationMemoryRepository {
  createEntry(entry: TranslationMemoryEntry): Promise<TranslationMemoryEntry>;
  updateEntry(entry: TranslationMemoryEntry): Promise<TranslationMemoryEntry>;
  findEntryById(id: string, organizationId: string): Promise<TranslationMemoryEntry | null>;
  searchEntries(input: SearchTranslationMemoryInput & { organizationId: string }): Promise<TranslationMemoryEntry[]>;
  listEntries(input: ListTranslationMemoryInput & { organizationId: string }): Promise<TranslationMemoryEntry[]>;
  appendAuditEvent(event: TranslationMemoryAuditEvent): Promise<void>;
}
