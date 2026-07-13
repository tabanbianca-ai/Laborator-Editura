import {
  type LexicographicAuthority,
  type LexicographicCitation,
  type LinguisticAuthorityLevel,
  type LinguisticContentAccessMode,
  type LinguisticLicenseStatus
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
  | "GLOSSARY_CREATED"
  | "GLOSSARY_UPDATED"
  | "GLOSSARY_CONFLICT"
  | "SOURCE_PRIORITY_CHANGED"
  | "CONFIDENCE_RECALCULATED"
  | "EVALUATE"
  | "MARK_UNDER_REVIEW"
  | "VALIDATE"
  | "REJECT"
  | "SUSPEND"
  | "ARCHIVE";

export type GlossaryScope = "PERSONAL" | "PLATFORM" | "PROJECT";

export type LinguisticSourcePriorityKind =
  | "BILINGUAL_DICTIONARY"
  | "CORPUS_EXAMPLES"
  | "EXPLANATORY_DICTIONARY"
  | "OFFICIAL_NORMATIVE_SOURCE"
  | "PLATFORM_GLOSSARY"
  | "PROJECT_GLOSSARY"
  | "SPECIALIZED_GLOSSARY"
  | "TRANSLATION_MEMORY";

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
  projectId?: string;
  ownerUserId?: string;
  glossaryScope: GlossaryScope;
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
  beforeState?: object;
  afterState?: object;
  createdAt: string;
}

export interface CreateTerminologyTermInput {
  language: string;
  domain?: string;
  projectId?: string;
  ownerUserId?: string;
  glossaryScope?: GlossaryScope;
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
  projectId?: string;
  ownerUserId?: string;
  glossaryScope?: GlossaryScope;
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
  projectId?: string;
  ownerUserId?: string;
  status?: TerminologyTermStatus;
  query?: string;
  limit?: number;
}

export interface CheckSegmentTerminologyInput {
  sourceLanguage?: string;
  targetLanguage?: string;
  language: string;
  domain?: string;
  projectId?: string;
  ownerUserId?: string;
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
  authorityLevel?: LinguisticAuthorityLevel;
  sourceTitle?: string;
  sourceEdition?: string;
  publicationYear?: number;
  licenseStatus?: LinguisticLicenseStatus;
  accessMode?: LinguisticContentAccessMode;
  lastVerificationDate?: string;
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

export interface GlossaryConflict {
  term: string;
  termIds: string[];
  glossaryScopes: GlossaryScope[];
  message: string;
  humanReviewRequired: true;
}

export interface LinguisticSourcePriorityItem {
  id: string;
  sourceType: LinguisticSourcePriorityKind;
  label: string;
  order: number;
  enabled: boolean;
}

export interface ProjectLinguisticSourcePriority {
  id: string;
  organizationId: string;
  projectId: string;
  items: LinguisticSourcePriorityItem[];
  dragDropOrderingSupported: true;
  updatedBy: string;
  updatedAt: string;
}

export interface UpdateProjectSourcePriorityInput {
  projectId: string;
  items: LinguisticSourcePriorityItem[];
}

export interface LinguisticProposalExplanation {
  confidenceScore: number;
  consultedSources: string[];
  glossaryUsed?: GlossaryScope;
  translationMemoryMatch?: {
    entryId: string;
    matchType: string;
    similarityScore: number;
  };
  terminologyStatus: "CONFLICT_REVIEW_REQUIRED" | "NO_MATCH" | "VALIDATED";
  semanticValidation: "NOT_RUN" | "SUPPORTING_EVIDENCE";
  explanation: string;
  humanFinalAuthority: true;
}

export interface TerminologyCheckResult {
  valid: boolean;
  violations: TerminologyViolation[];
  dictionaryEvidence?: TerminologyDictionaryEvidence[];
  glossaryConflicts?: GlossaryConflict[];
  glossaryPriority?: GlossaryScope[];
  sourcePriority?: LinguisticSourcePriorityItem[];
  proposalExplanation?: LinguisticProposalExplanation;
}

export interface TerminologyRepository {
  createTerm(term: TerminologyTerm): Promise<TerminologyTerm>;
  updateTerm(term: TerminologyTerm): Promise<TerminologyTerm>;
  findTermById(id: string, organizationId: string): Promise<TerminologyTerm | null>;
  searchTerms(input: SearchTerminologyInput & { organizationId: string }): Promise<TerminologyTerm[]>;
  listTermsRequiringReview(organizationId: string): Promise<TerminologyTerm[]>;
  listValidatedTerms(input: { organizationId: string; language: string; domain?: string; projectId?: string; ownerUserId?: string }): Promise<TerminologyTerm[]>;
  listTermsForGovernanceCheck(input: { organizationId: string; language: string; domain?: string; projectId?: string; ownerUserId?: string }): Promise<TerminologyTerm[]>;
  getSourcePriority(projectId: string, organizationId: string): Promise<ProjectLinguisticSourcePriority | null>;
  upsertSourcePriority(priority: ProjectLinguisticSourcePriority): Promise<ProjectLinguisticSourcePriority>;
  appendAuditEvent(event: TerminologyAuditEvent): Promise<void>;
}
