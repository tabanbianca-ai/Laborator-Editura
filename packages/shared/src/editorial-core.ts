export const EDITORIAL_MASTER_SCHEMA_VERSION = "1.0.0" as const;

export type CanonicalEditorialProjectType =
  | "AUDIO"
  | "BOOK"
  | "CHILDREN_BOOK"
  | "CORRECTION"
  | "LAYOUT"
  | "MAGAZINE"
  | "MULTIMEDIA"
  | "TRANSLATION"
  | "VIDEO";

export type EditorialProjectLifecycleState =
  | "DRAFT"
  | "PLANNED"
  | "ACTIVE"
  | "PAUSED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "COMPLETED"
  | "CANCELLED"
  | "ARCHIVED";

export type MasterDocumentStatus =
  | "DRAFT"
  | "IMPORT_PREVIEW"
  | "ACTIVE"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "ARCHIVED";

export type ContentBlockType =
  | "BACK_MATTER"
  | "CHAPTER"
  | "FRONT_MATTER"
  | "FOOTNOTE"
  | "IMAGE"
  | "NOTE"
  | "PARAGRAPH"
  | "QUOTE"
  | "REFERENCE"
  | "SECTION"
  | "TABLE";

export type EditorialVersionChangeType =
  | "APPROVED_VERSION"
  | "AUTO_SAVE"
  | "CORRECTION_REVISION"
  | "EDITORIAL_REVISION"
  | "MANUAL_SAVE"
  | "RESTORED_VERSION"
  | "TRANSLATION_REVISION";

export type EditorialSnapshotKind = "CANONICAL_VERSION" | "WORKING_SNAPSHOT";

export type EditorialDiffOperation = "ADDED" | "MODIFIED" | "MOVED" | "REMOVED";

export type ManuscriptImportFormat = "DOCX" | "HTML" | "JSON_MASTER" | "MARKDOWN" | "PDF" | "TXT";

export type ManuscriptImportStage =
  | "UPLOAD"
  | "FILE_VALIDATION"
  | "FORMAT_DETECTION"
  | "CONTENT_EXTRACTION"
  | "STRUCTURE_ANALYSIS"
  | "PREVIEW"
  | "HUMAN_CONFIRMATION"
  | "MASTER_CREATED";

export type EditorialTranslationStatus =
  | "DRAFT"
  | "LOCKED"
  | "REVISED"
  | "TRANSLATED"
  | "UNDER_REVIEW"
  | "UNTRANSLATED"
  | "VALIDATED";

export type EditorialTranslationMemoryMatchType =
  | "EXACT"
  | "FUZZY"
  | "HIGH_FUZZY"
  | "NO_MATCH";

export type EditorialGlossaryStatus =
  | "ARCHIVED"
  | "SPECIALIZED_TERM"
  | "SUSPENDED"
  | "UNDER_REVIEW"
  | "VALIDATED";

export type RomanianTerminologySource =
  | "CHILDREN_GLOSSARY"
  | "DEX"
  | "DOOM_1"
  | "DOOM_2"
  | "DOOM_3"
  | "EDITORIAL_GLOSSARY"
  | "FALSE_FRIENDS"
  | "RISK_TERMS"
  | "SPIRITIST_GLOSSARY";

export type TerminologyCheckSeverity = "BLOCKING" | "ERROR" | "INFO" | "WARNING";

export type CorrectionFindingCategory =
  | "AGREEMENT"
  | "AMBIGUITY"
  | "ANACOLUTHON"
  | "CACOPHONY"
  | "DIACRITICS"
  | "GRAMMAR"
  | "PLURAL"
  | "PLEONASM"
  | "PREPOSITION"
  | "PRONOUN"
  | "PUNCTUATION"
  | "REPETITION"
  | "SPELLING"
  | "TERMINOLOGY_UNIFORMITY"
  | "WORD_ORDER";

export type CorrectionFindingStatus =
  | "ACCEPTED"
  | "IGNORED"
  | "OPEN"
  | "REJECTED"
  | "RESOLVED";

export type EditorialProfileCode =
  | "ACADEMIC"
  | "CHILDREN"
  | "CUSTOM"
  | "GENERAL_ROMANIAN"
  | "KARDECIAN"
  | "LITERARY"
  | "SPIRITIST";

export type EditorialCommentStatus = "OPEN" | "REOPENED" | "RESOLVED";

export type EditorialSuggestionOperation = "DELETE" | "FORMAT" | "INSERT" | "MOVE" | "REPLACE";

export type EditorialSuggestionStatus = "ACCEPTED" | "PENDING" | "REJECTED";

export type EditorialWorkflowStage =
  | "APPROVED"
  | "CORRECTION"
  | "DRAFT"
  | "EDITORIAL_REVIEW"
  | "FINAL_VALIDATION"
  | "TRANSLATION"
  | "TRANSLATION_REVIEW";

export type EditorialApprovalType =
  | "CorrectionApproved"
  | "EditorialReviewApproved"
  | "MasterVersionApproved"
  | "TranslationApproved";

export type EditorialApprovalDecision = "APPROVED" | "CHANGES_REQUESTED" | "REJECTED";

export type EditorialSourceSyncStatus = "CURRENT" | "SOURCE_OUTDATED";

export type EditorialAuditEventName =
  | "CommentCreated"
  | "CommentResolved"
  | "CorrectionFindingCreated"
  | "DocumentVersionCreated"
  | "EditorialApprovalGranted"
  | "MasterDocumentCreated"
  | "ProjectCreated"
  | "SourceVersionChanged"
  | "SuggestionAccepted"
  | "SuggestionRejected"
  | "TranslationSegmentUpdated"
  | "TranslationStarted"
  | "TranslationValidated";

export interface CanonicalEditorialProject {
  project_id: string;
  organization_id: string;
  canonical_name: string;
  display_name: string;
  project_type: CanonicalEditorialProjectType;
  source_language: string;
  target_languages: string[];
  owner_id: string;
  editorial_manager_id?: string;
  status: EditorialProjectLifecycleState;
  workflow_id?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface StructuredContentBlock {
  block_id: string;
  block_type: ContentBlockType;
  order: number;
  parent_block_id?: string;
  text?: string;
  children?: StructuredContentBlock[];
  references?: string[];
  notes?: string[];
  metadata?: Record<string, unknown>;
}

export interface StructuredMasterContent {
  front_matter: StructuredContentBlock[];
  chapters: StructuredContentBlock[];
  back_matter: StructuredContentBlock[];
  references: StructuredContentBlock[];
  metadata?: Record<string, unknown>;
}

export interface StructuredMasterDocument {
  master_document_id: string;
  organization_id: string;
  project_id: string;
  work_id?: string;
  canonical_title: string;
  source_language: string;
  schema_version: typeof EDITORIAL_MASTER_SCHEMA_VERSION;
  current_version_id?: string;
  status: MasterDocumentStatus;
  content: StructuredMasterContent;
  metadata?: Record<string, unknown>;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface EditorialDocumentVersion {
  version_id: string;
  master_document_id: string;
  version_number: number;
  parent_version_id?: string;
  created_by: string;
  created_at: string;
  change_type: EditorialVersionChangeType;
  snapshot_kind: EditorialSnapshotKind;
  change_summary?: string;
  content_hash: string;
  content_snapshot: StructuredMasterContent;
  status: "ACTIVE" | "ARCHIVED" | "APPROVED";
}

export interface ManuscriptImportPreview {
  import_id: string;
  organization_id: string;
  project_id: string;
  source_format: ManuscriptImportFormat;
  stage: ManuscriptImportStage;
  validation_passed: boolean;
  virus_scan_required: true;
  human_confirmation_required: true;
  detected_language?: string;
  preview_content?: StructuredMasterContent;
  warnings: string[];
  created_by: string;
  created_at: string;
}

export interface EditorialVersionComparison {
  comparison_id: string;
  master_document_id: string;
  left_version_id: string;
  right_version_id: string;
  operations: Array<{
    operation: EditorialDiffOperation;
    block_id: string;
    previous_block_id?: string;
    summary: string;
  }>;
}

export interface EditorialTranslation {
  translation_id: string;
  project_id: string;
  master_document_id: string;
  source_version_id: string;
  source_language: string;
  target_language: string;
  translator_id: string;
  status: EditorialTranslationStatus;
  current_version: number;
  terminology_profile?: string;
  translation_memory_profile?: string;
  created_at: string;
  updated_at: string;
}

export interface EditorialTranslationSegment {
  translation_segment_id: string;
  source_block_id: string;
  source_text: string;
  target_text?: string;
  source_language: string;
  target_language: string;
  status: EditorialTranslationStatus;
  translator_id?: string;
  reviewer_id?: string;
  translation_memory_matches: EditorialTranslationMemoryMatch[];
  terminology_findings: TerminologyCheckResult[];
  updated_at: string;
}

export interface EditorialTranslationMemoryMatch {
  tm_entry_id?: string;
  match_type: EditorialTranslationMemoryMatchType;
  source_text: string;
  target_text?: string;
  confidence: number;
  proposal_only: true;
  automatic_replacement: false;
}

export interface EditorialGlossaryTerm {
  term_id: string;
  canonical_term: string;
  source_language: string;
  target_language?: string;
  translation?: string;
  definition?: string;
  domain?: string;
  context?: string;
  approved_variants: string[];
  rejected_variants: string[];
  source_reference?: string;
  source_edition?: string;
  consulted_at?: string;
  status: EditorialGlossaryStatus;
  version: number;
  owner: string;
}

export interface TerminologyCheckResult {
  finding_id: string;
  block_id: string;
  term_id?: string;
  severity: TerminologyCheckSeverity;
  message: string;
  blocking: boolean;
  resolved: boolean;
}

export interface CorrectionFinding {
  finding_id: string;
  document_version_id: string;
  block_id: string;
  category: CorrectionFindingCategory;
  severity: TerminologyCheckSeverity;
  source_range?: {
    start: number;
    end: number;
  };
  original_text: string;
  suggested_text?: string;
  explanation: string;
  rule_id?: string;
  created_by: string;
  status: CorrectionFindingStatus;
  resolved_by?: string;
  resolved_at?: string;
}

export interface EditorialProfile {
  profile_id: string;
  code: EditorialProfileCode;
  terminology_profile_ids: string[];
  stylistic_level?: string;
  active_rules: string[];
  mandatory_rules: string[];
  repetition_tolerance?: "LOW" | "MEDIUM" | "HIGH";
  capitalization_conventions?: string[];
  quote_conventions?: string[];
  punctuation_conventions?: string[];
  specialized_terms?: string[];
}

export interface VerbTenseAnalysis {
  source_tense: string;
  target_tense: string;
  match_status: "MATCH" | "MISMATCH" | "UNCERTAIN";
  confidence: number;
  explanation: string;
}

export interface EditorialComment {
  comment_id: string;
  resource_id: string;
  version_id: string;
  block_id?: string;
  author_id: string;
  content: string;
  status: EditorialCommentStatus;
  parent_comment_id?: string;
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
}

export interface EditorialSuggestion {
  suggestion_id: string;
  operation: EditorialSuggestionOperation;
  resource_id: string;
  source_version_id: string;
  block_id?: string;
  author_id: string;
  original_text?: string;
  proposed_text?: string;
  justification?: string;
  status: EditorialSuggestionStatus;
  reviewed_by?: string;
  reviewed_at?: string;
}

export interface EditorialApproval {
  approval_id: string;
  resource_id: string;
  resource_version: string;
  approval_type: EditorialApprovalType;
  approved_by: string;
  approved_at: string;
  decision: EditorialApprovalDecision;
  comments?: string;
}

export interface SourceVersionOutdatedReport {
  translation_id: string;
  master_document_id: string;
  translation_source_version_id: string;
  current_source_version_id: string;
  status: EditorialSourceSyncStatus;
  affected_source_block_ids: string[];
}

export interface EditorialAiExecutionRecord {
  agent_id: string;
  model_id: string;
  prompt_version: string;
  source_version: string;
  input_reference: string;
  output_reference: string;
  cost?: number;
  timestamp: string;
  review_status: "ACCEPTED" | "PENDING_REVIEW" | "REJECTED";
  direct_approved_version_modification: false;
}

export interface EditorialAutosaveRecord {
  autosave_id: string;
  resource_id: string;
  base_version_id: string;
  snapshot_kind: "WORKING_SNAPSHOT";
  content_hash: string;
  saved_by: string;
  saved_at: string;
}

export interface EditorialOptimisticLock {
  resource_id: string;
  expected_version: number;
  actual_version: number;
  conflict: boolean;
}

export const EDITORIAL_PROJECT_LIFECYCLE_TRANSITIONS = {
  DRAFT: ["PLANNED", "CANCELLED", "ARCHIVED"],
  PLANNED: ["ACTIVE", "PAUSED", "CANCELLED", "ARCHIVED"],
  ACTIVE: ["PAUSED", "UNDER_REVIEW", "CANCELLED", "ARCHIVED"],
  PAUSED: ["ACTIVE", "CANCELLED", "ARCHIVED"],
  UNDER_REVIEW: ["ACTIVE", "APPROVED", "PAUSED", "ARCHIVED"],
  APPROVED: ["COMPLETED", "ARCHIVED"],
  COMPLETED: ["ARCHIVED"],
  CANCELLED: ["ARCHIVED"],
  ARCHIVED: []
} as const satisfies Record<EditorialProjectLifecycleState, readonly EditorialProjectLifecycleState[]>;

export const EDITORIAL_WORKFLOW_STAGES = [
  "DRAFT",
  "TRANSLATION",
  "TRANSLATION_REVIEW",
  "CORRECTION",
  "EDITORIAL_REVIEW",
  "FINAL_VALIDATION",
  "APPROVED"
] as const satisfies readonly EditorialWorkflowStage[];

export function canTransitionEditorialProject(
  from: EditorialProjectLifecycleState,
  to: EditorialProjectLifecycleState
): boolean {
  const allowedTransitions: readonly EditorialProjectLifecycleState[] =
    EDITORIAL_PROJECT_LIFECYCLE_TRANSITIONS[from];

  return allowedTransitions.includes(to);
}

export function validateStructuredMasterDocument(document: StructuredMasterDocument): string[] {
  const issues: string[] = [];

  if (document.schema_version !== EDITORIAL_MASTER_SCHEMA_VERSION) {
    issues.push("schema_version must match the current editorial master schema.");
  }

  if (!document.master_document_id) {
    issues.push("master_document_id is required.");
  }

  if (!document.organization_id) {
    issues.push("organization_id is required.");
  }

  if (!document.project_id) {
    issues.push("project_id is required.");
  }

  if (!document.canonical_title) {
    issues.push("canonical_title is required.");
  }

  if (!document.source_language) {
    issues.push("source_language is required.");
  }

  const blockIds = new Set<string>();

  for (const block of flattenStructuredContentBlocks(document.content)) {
    if (!block.block_id) {
      issues.push("Every content block requires block_id.");
      continue;
    }

    if (blockIds.has(block.block_id)) {
      issues.push(`Duplicate block_id: ${block.block_id}`);
    }

    blockIds.add(block.block_id);
  }

  return issues;
}

export function flattenStructuredContentBlocks(content: StructuredMasterContent): StructuredContentBlock[] {
  const result: StructuredContentBlock[] = [];
  const roots = [
    ...content.front_matter,
    ...content.chapters,
    ...content.back_matter,
    ...content.references
  ];

  const visit = (block: StructuredContentBlock): void => {
    result.push(block);

    for (const child of block.children ?? []) {
      visit(child);
    }
  };

  for (const root of roots) {
    visit(root);
  }

  return result;
}

export function createRestoredVersionMetadata(input: {
  new_version_id: string;
  master_document_id: string;
  restored_from_version_id: string;
  previous_current_version_id: string;
  version_number: number;
  created_by: string;
  created_at: string;
  content_hash: string;
  content_snapshot: StructuredMasterContent;
}): EditorialDocumentVersion {
  return {
    version_id: input.new_version_id,
    master_document_id: input.master_document_id,
    version_number: input.version_number,
    parent_version_id: input.previous_current_version_id,
    created_by: input.created_by,
    created_at: input.created_at,
    change_type: "RESTORED_VERSION",
    snapshot_kind: "CANONICAL_VERSION",
    change_summary: `Restored from ${input.restored_from_version_id}`,
    content_hash: input.content_hash,
    content_snapshot: input.content_snapshot,
    status: "ACTIVE"
  };
}

export function detectSourceOutdated(input: {
  translation_id: string;
  master_document_id: string;
  translation_source_version_id: string;
  current_source_version_id: string;
  affected_source_block_ids?: string[];
}): SourceVersionOutdatedReport {
  const outdated = input.translation_source_version_id !== input.current_source_version_id;

  return {
    translation_id: input.translation_id,
    master_document_id: input.master_document_id,
    translation_source_version_id: input.translation_source_version_id,
    current_source_version_id: input.current_source_version_id,
    status: outdated ? "SOURCE_OUTDATED" : "CURRENT",
    affected_source_block_ids: outdated ? input.affected_source_block_ids ?? [] : []
  };
}

export function assertEditorialOptimisticLock(input: Omit<EditorialOptimisticLock, "conflict">): EditorialOptimisticLock {
  return {
    ...input,
    conflict: input.expected_version !== input.actual_version
  };
}

export function validateVersionSpecificApproval(approval: EditorialApproval): string[] {
  const issues: string[] = [];

  if (!approval.resource_version) {
    issues.push("resource_version is required for editorial approval.");
  }

  if (!approval.approved_by) {
    issues.push("approved_by is required for editorial approval.");
  }

  if (!approval.approved_at || Number.isNaN(Date.parse(approval.approved_at))) {
    issues.push("approved_at must be a valid timestamp.");
  }

  return issues;
}
