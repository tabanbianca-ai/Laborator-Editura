export const JSON_MASTER_FORMAT_VERSION = "1.0" as const;

export type JsonMasterFormatVersion = typeof JSON_MASTER_FORMAT_VERSION;

export type JsonMasterStatus =
  | "draft"
  | "active"
  | "in_review"
  | "approved"
  | "published"
  | "archived";

export type SegmentStatus =
  | "new"
  | "in_translation"
  | "translated"
  | "in_review"
  | "approved"
  | "locked";

export type TranslationStatus =
  | "draft"
  | "machine_suggested"
  | "human_edited"
  | "reviewed"
  | "approved"
  | "rejected";

export type TermStatus =
  | "proposed"
  | "under_review"
  | "validated"
  | "suspended"
  | "archived_historically";

export type ProvenanceSource =
  | "human"
  | "ai"
  | "translation_memory"
  | "glossary"
  | "dictionary"
  | "corpus"
  | "editorial_decision";

export type QaSeverity = "info" | "warning" | "error" | "blocking";

export type QaStatus = "open" | "resolved" | "accepted_risk" | "false_positive";

export interface JsonMasterFormatV1 {
  formatVersion: JsonMasterFormatVersion;
  project: JsonMasterProject;
  documents: JsonMasterDocument[];
  terminology: JsonMasterTerminology;
  translationMemory: JsonMasterTranslationMemory;
  qa: JsonMasterProjectQa;
  workflow: JsonMasterWorkflow;
  audit: JsonMasterAudit;
  versionHistory: JsonMasterVersionHistory;
  mediaLocalization?: JsonMasterMediaLocalization;
}

export interface JsonMasterProject {
  id: string;
  name: string;
  description?: string;
  sourceLanguage: string;
  targetLanguages: string[];
  domain?: string;
  status: JsonMasterStatus;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface JsonMasterDocument {
  id: string;
  projectId: string;
  title: string;
  sourceLanguage: string;
  documentType?:
    | "book"
    | "article"
    | "technical_document"
    | "subtitle_script"
    | "media_transcript"
    | "other";
  sourceFile?: JsonMasterSourceFile;
  segments: JsonMasterSegment[];
  versions?: JsonMasterVersionReference[];
  metadata?: Record<string, unknown>;
}

export interface JsonMasterSourceFile {
  name?: string;
  mimeType?: string;
  checksum?: string;
  uri?: string;
}

export interface JsonMasterSegment {
  id: string;
  order: number;
  source: JsonMasterSourceSegment;
  translations: JsonMasterTranslation[];
  terminologyRefs?: string[];
  translationMemoryRefs?: string[];
  qaRefs?: string[];
  workflowState?: string;
  status: SegmentStatus;
  mediaTiming?: JsonMasterMediaTiming;
  metadata?: Record<string, unknown>;
}

export interface JsonMasterSourceSegment {
  text: string;
  normalizedText?: string;
  notes?: string[];
  structuralPath?: string;
}

export interface JsonMasterTranslation {
  id: string;
  language: string;
  text: string;
  status: TranslationStatus;
  translatorId?: string;
  reviewerId?: string;
  qa?: JsonMasterSegmentQa;
  provenance?: JsonMasterProvenance;
  createdAt: string;
  updatedAt: string;
}

export interface JsonMasterProvenance {
  source?: ProvenanceSource;
  sourceRefs?: string[];
  confidence?: number;
  explanation?: string;
}

export interface JsonMasterTerminology {
  terms: JsonMasterTerm[];
}

export interface JsonMasterTerm {
  id: string;
  sourceTerm: string;
  language: string;
  approvedTranslations?: JsonMasterTermTranslation[];
  forbiddenTranslations?: string[];
  domain?: string;
  definition?: string;
  source?:
    | "dictionary"
    | "glossary"
    | "translation_memory"
    | "corpus"
    | "editorial_decision"
    | "ai";
  status: TermStatus;
}

export interface JsonMasterTermTranslation {
  language: string;
  text: string;
}

export interface JsonMasterTranslationMemory {
  entries: JsonMasterTranslationMemoryEntry[];
}

export interface JsonMasterTranslationMemoryEntry {
  id: string;
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  domain?: string;
  qualityScore?: number;
  sourceDocumentId?: string;
}

export interface JsonMasterProjectQa {
  checks: JsonMasterQaCheck[];
  scores?: JsonMasterQaScores;
}

export interface JsonMasterSegmentQa {
  checks?: JsonMasterQaCheck[];
  scores?: JsonMasterQaScores;
}

export interface JsonMasterQaCheck {
  id: string;
  type:
    | "semantic_fidelity"
    | "terminology"
    | "numbers"
    | "dates"
    | "units"
    | "proper_names"
    | "punctuation"
    | "formatting"
    | "missing_segment"
    | "duplicate_segment"
    | "subtitle_timing"
    | "audio_sync"
    | "reading_speed";
  severity: QaSeverity;
  message?: string;
  status: QaStatus;
}

export interface JsonMasterQaScores {
  semanticFidelity?: number;
  terminology?: number;
  consistency?: number;
  fluency?: number;
  overall?: number;
}

export interface JsonMasterWorkflow {
  state: "draft" | "translation" | "review" | "approved" | "published" | "archived";
  assignments?: JsonMasterAssignment[];
  events: JsonMasterWorkflowEvent[];
}

export interface JsonMasterAssignment {
  userId: string;
  role: "admin" | "translator" | "reviewer" | "viewer" | "expert";
}

export interface JsonMasterWorkflowEvent {
  id: string;
  type: string;
  actorId?: string;
  createdAt: string;
  payload?: Record<string, unknown>;
}

export interface JsonMasterAudit {
  events: JsonMasterAuditEvent[];
}

export interface JsonMasterAuditEvent {
  id: string;
  actorId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  timestamp: string;
}

export interface JsonMasterVersionHistory {
  versions: JsonMasterVersionReference[];
}

export interface JsonMasterVersionReference {
  id: string;
  createdAt: string;
  createdBy: string;
  summary?: string;
  snapshotRef: string;
  checksum?: string;
}

export interface JsonMasterMediaLocalization {
  mediaAssets?: JsonMasterMediaAsset[];
  subtitleTracks?: JsonMasterSubtitleTrack[];
  voiceOverTracks?: JsonMasterAudioTrack[];
  dubbingTracks?: JsonMasterAudioTrack[];
  localizedVideoExports?: JsonMasterLocalizedVideoExport[];
}

export interface JsonMasterMediaAsset {
  id: string;
  type: "video" | "audio" | "subtitle" | "transcript";
  uri: string;
  durationMs?: number;
  checksum?: string;
}

export interface JsonMasterMediaTiming {
  startMs?: number;
  endMs?: number;
  speakerId?: string;
}

export interface JsonMasterSubtitleTrack {
  id: string;
  language: string;
  format: "srt" | "vtt" | "ass";
  segmentRefs: string[];
}

export interface JsonMasterAudioTrack {
  id: string;
  language: string;
  type: "voice_over" | "dubbing";
  uri: string;
  sourceSegmentRefs?: string[];
  syncQualityScore?: number;
}

export interface JsonMasterLocalizedVideoExport {
  id: string;
  language: string;
  uri: string;
  subtitleTrackId?: string;
  audioTrackId?: string;
  createdAt: string;
}
