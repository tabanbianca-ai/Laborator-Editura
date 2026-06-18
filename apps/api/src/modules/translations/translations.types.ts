import { type LexicographicCitation } from "../lexicographic/lexicographic.types";

export interface TranslationActor {
  userId: string;
  organizationId: string;
}

export type TranslationAuditAction = "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | "EXPORT";

export interface SegmentTranslation {
  id: string;
  organizationId: string;
  projectId: string;
  documentId: string;
  segmentId: string;
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  status: "DRAFT" | "SUBMITTED" | "VALIDATED" | "APPROVED";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tmEntryId?: string;
  qaReportId?: string;
  semanticReportId?: string;
  metadata?: Record<string, unknown>;
}

export interface TranslationLexicographicSupport {
  entryId: string;
  sourceId: string;
  term: string;
  sourceLanguage: string;
  targetLanguage?: string;
  senseIds: string[];
  translationEquivalents: string[];
  sourceReferences: string[];
  citations: LexicographicCitation[];
  authority: string;
  priorityRank: number;
  priorityRule: string;
  authoritative: false;
  humanFinalAuthority: true;
}

export interface SubmitTranslationInput {
  segmentId: string;
  targetText: string;
  domain?: string;
  metadata?: Record<string, unknown>;
}

export interface TranslationAuditEvent {
  id: string;
  organizationId: string;
  actorId: string;
  action: TranslationAuditAction;
  entityType: "SEGMENT_TRANSLATION";
  entityId: string;
  beforeState?: SegmentTranslation | null;
  afterState?: SegmentTranslation | null;
  createdAt: string;
}
