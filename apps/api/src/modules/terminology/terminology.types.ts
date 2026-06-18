import {
  type LexicographicAuthority,
  type LexicographicCitation
} from "../lexicographic/lexicographic.types";

export type TerminologyTermStatus =
  | "PROPOSED"
  | "UNDER_REVIEW"
  | "VALIDATED"
  | "REJECTED"
  | "SUSPENDED"
  | "ARCHIVED";

export type TerminologySource =
  | "DICTIONARY"
  | "GLOSSARY"
  | "TRANSLATION_MEMORY"
  | "CORPUS"
  | "EDITORIAL_DECISION"
  | "AI"
  | "IMPORT";

export type TerminologyAuditAction =
  | "CREATE"
  | "UPDATE"
  | "EVALUATE"
  | "MARK_UNDER_REVIEW"
  | "VALIDATE"
  | "REJECT"
  | "SUSPEND"
  | "ARCHIVE";

export interface TerminologyActor {
  userId: string;
  organizationId: string;
  roles?: string[];
}

export type TerminologyValidationStatus = "FAILED" | "NOT_APPLICABLE" | "PASSED";

export type TerminologySourceValidationStatus =
  | "APPROVED_SOURCE"
  | "MISSING_APPROVED_SOURCE";

export type TerminologyGovernanceDecisionStatus =
  | "ARCHIVED"
  | "PENDING"
  | "REJECTED"
  | "SUSPENDED"
  | "UNDER_REVIEW"
  | "VALIDATED";

export type TerminologyQualityLevel =
  | "ACCEPTABLE"
  | "REJECTED"
  | "REVIEW_REQUIRED"
  | "TRUSTED";

export interface TerminologyTerm {
  id: string;
  organizationId: string;
  language: string;
  domain?: string;
  source: TerminologySource;
  term: string;
  definition?: string;
  approvedTranslation?: string;
  forbiddenVariants: string[];
  preferredVariants: string[];
  referenceSources?: string[];
  glossaryPresent?: boolean;
  editorialApproval?: boolean;
  historicalUsageCount?: number;
  qualityScore: number;
  qualityLevel: TerminologyQualityLevel;
  orthographicValidationStatus: TerminologyValidationStatus;
  diacriticsValidationStatus: TerminologyValidationStatus;
  sourceValidationStatus: TerminologySourceValidationStatus;
  governanceDecisionStatus: TerminologyGovernanceDecisionStatus;
  notes?: string;
  status: TerminologyTermStatus;
  createdBy: string;
  updatedBy?: string;
  validatedBy?: string;
  evaluatedBy?: string;
  rejectedBy?: string;
  suspendedBy?: string;
  archivedBy?: string;
  createdAt: string;
  updatedAt: string;
  validatedAt?: string;
  evaluatedAt?: string;
  rejectedAt?: string;
  suspendedAt?: string;
  archivedAt?: string;
  rejectionReason?: string;
  metadata?: Record<string, unknown>;
}

export interface TerminologyAuditEvent {
  id: string;
  organizationId: string;
  termId: string;
  action: TerminologyAuditAction;
  actorId: string;
  beforeState?: TerminologyTerm;
  afterState?: TerminologyTerm;
  createdAt: string;
}

export interface CreateTerminologyTermInput {
  language: string;
  domain?: string;
  source?: TerminologySource;
  term: string;
  definition?: string;
  approvedTranslation?: string;
  forbiddenVariants?: string[];
  preferredVariants?: string[];
  referenceSources?: string[];
  glossaryPresent?: boolean;
  editorialApproval?: boolean;
  historicalUsageCount?: number;
  notes?: string;
  status?: TerminologyTermStatus;
  metadata?: Record<string, unknown>;
}

export interface UpdateTerminologyTermInput {
  domain?: string;
  source?: TerminologySource;
  term?: string;
  definition?: string;
  approvedTranslation?: string;
  forbiddenVariants?: string[];
  preferredVariants?: string[];
  referenceSources?: string[];
  glossaryPresent?: boolean;
  editorialApproval?: boolean;
  historicalUsageCount?: number;
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface RejectTerminologyTermInput {
  reason?: string;
}

export interface SearchTerminologyInput {
  language: string;
  domain?: string;
  status?: TerminologyTermStatus;
  query?: string;
  limit?: number;
}

export interface CheckSegmentTerminologyInput {
  sourceLanguage?: string;
  targetLanguage?: string;
  language: string;
  domain?: string;
  sourceText: string;
  targetText: string;
}

export interface TerminologyDictionaryEvidence {
  entryId: string;
  sourceId: string;
  term: string;
  sourceLanguage: string;
  targetLanguage?: string;
  senseIds: string[];
  translationEquivalents: string[];
  sourceReferences: string[];
  citations: LexicographicCitation[];
  authority: LexicographicAuthority;
  priorityRank: number;
  priority: "DICTIONARY_EVIDENCE_AFTER_VALIDATED_GLOSSARY";
  authoritative: false;
  humanFinalAuthority: true;
}

export interface TerminologyViolation {
  termId: string;
  term: string;
  type:
    | "FORBIDDEN_VARIANT"
    | "MISSING_APPROVED_TRANSLATION"
    | "MISSING_OR_INCORRECT_DIACRITICS"
    | "PREFERRED_VARIANT_AVAILABLE"
    | "REJECTED_TERM";
  message: string;
  authoritative: true;
  severity?: "CRITICAL" | "HIGH";
  priority: "TERMINOLOGY_GOVERNANCE" | "TERMINOLOGY_VALIDATED";
}

export interface TerminologyCheckResult {
  valid: boolean;
  violations: TerminologyViolation[];
  dictionaryEvidence?: TerminologyDictionaryEvidence[];
}

export interface TerminologyRepository {
  createTerm(term: TerminologyTerm): Promise<TerminologyTerm>;
  updateTerm(term: TerminologyTerm): Promise<TerminologyTerm>;
  findTermById(id: string, organizationId: string): Promise<TerminologyTerm | null>;
  searchTerms(input: SearchTerminologyInput & { organizationId: string }): Promise<TerminologyTerm[]>;
  listTermsRequiringReview(organizationId: string): Promise<TerminologyTerm[]>;
  listValidatedTerms(input: { organizationId: string; language: string; domain?: string }): Promise<TerminologyTerm[]>;
  listTermsForGovernanceCheck(input: { organizationId: string; language: string; domain?: string }): Promise<TerminologyTerm[]>;
  appendAuditEvent(event: TerminologyAuditEvent): Promise<void>;
}
