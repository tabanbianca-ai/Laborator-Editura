export type TerminologyTermStatus =
  | "PROPOSED"
  | "UNDER_REVIEW"
  | "VALIDATED"
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
  | "VALIDATE"
  | "SUSPEND"
  | "ARCHIVE";

export interface TerminologyActor {
  userId: string;
  organizationId: string;
}

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
  notes?: string;
  status: TerminologyTermStatus;
  createdBy: string;
  updatedBy?: string;
  validatedBy?: string;
  suspendedBy?: string;
  archivedBy?: string;
  createdAt: string;
  updatedAt: string;
  validatedAt?: string;
  suspendedAt?: string;
  archivedAt?: string;
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
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface SearchTerminologyInput {
  language: string;
  domain?: string;
  status?: TerminologyTermStatus;
  query?: string;
  limit?: number;
}

export interface CheckSegmentTerminologyInput {
  language: string;
  domain?: string;
  sourceText: string;
  targetText: string;
}

export interface TerminologyViolation {
  termId: string;
  term: string;
  type: "MISSING_APPROVED_TRANSLATION" | "FORBIDDEN_VARIANT" | "PREFERRED_VARIANT_AVAILABLE";
  message: string;
  authoritative: true;
  priority: "TERMINOLOGY_VALIDATED";
}

export interface TerminologyCheckResult {
  valid: boolean;
  violations: TerminologyViolation[];
}

export interface TerminologyRepository {
  createTerm(term: TerminologyTerm): Promise<TerminologyTerm>;
  updateTerm(term: TerminologyTerm): Promise<TerminologyTerm>;
  findTermById(id: string, organizationId: string): Promise<TerminologyTerm | null>;
  searchTerms(input: SearchTerminologyInput & { organizationId: string }): Promise<TerminologyTerm[]>;
  listValidatedTerms(input: { organizationId: string; language: string; domain?: string }): Promise<TerminologyTerm[]>;
  appendAuditEvent(event: TerminologyAuditEvent): Promise<void>;
}
