import type {
  CorrectionFinding,
  EditorialAiExecutionRecord,
  EditorialApproval,
  EditorialComment,
  EditorialDocumentVersion,
  EditorialSuggestion,
  StructuredMasterDocument
} from "../editorial-core";
import type {
  CanonicalEdition,
  CanonicalRightsRecord,
  CanonicalWork,
  Contributor,
  DigitalAssetRecord,
  DuplicateCandidate,
  EditionContributor,
  EditorialMetadata,
  LibraryReservation,
  MetadataVersionRecord,
  OriginalEditionIdentity,
  ProvenanceRecord,
  PublicationReadinessResult,
  ResourceRelationship,
  SearchIndexRecord,
  UnifiedLibraryRecord
} from "../unified-library";

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
  masterDocuments?: JsonMasterStructuredMasterDocument[];
  editorialVersions?: JsonMasterEditorialVersion[];
  editorialComments?: JsonMasterEditorialComment[];
  editorialSuggestions?: JsonMasterEditorialSuggestion[];
  correctionFindings?: JsonMasterCorrectionFinding[];
  editorialApprovals?: JsonMasterEditorialApproval[];
  editorialAiExecutions?: JsonMasterEditorialAiExecution[];
  works?: JsonMasterWork[];
  originalEditions?: JsonMasterOriginalEdition[];
  editions?: JsonMasterEdition[];
  resourceRelationships?: JsonMasterResourceRelationship[];
  contributors?: JsonMasterContributor[];
  editionContributors?: JsonMasterEditionContributor[];
  editorialMetadata?: JsonMasterEditorialMetadata[];
  metadataHistory?: JsonMasterMetadataVersion[];
  rightsRecords?: JsonMasterRightsRecord[];
  provenanceRecords?: JsonMasterProvenanceRecord[];
  digitalAssets?: JsonMasterDigitalAsset[];
  libraryRecords?: JsonMasterLibraryRecord[];
  libraryReservations?: JsonMasterLibraryReservation[];
  searchIndexRecords?: JsonMasterSearchIndexRecord[];
  publicationReadiness?: JsonMasterPublicationReadiness[];
  duplicateCandidates?: JsonMasterDuplicateCandidate[];
  mediaLocalization?: JsonMasterMediaLocalization;
  layout?: JsonMasterLayout;
  pageTemplates?: JsonMasterPageTemplate[];
  printProfiles?: JsonMasterPrintProfile[];
  illustrations?: JsonMasterIllustration[];
  audioTracks?: JsonMasterProductionAudioTrack[];
  videoAssets?: JsonMasterProductionVideoAsset[];
  publicationProfiles?: JsonMasterPublicationProfile[];
  mediaAssets?: JsonMasterCreationMediaAsset[];
  illustrationProjects?: JsonMasterIllustrationProject[];
  audioProjects?: JsonMasterAudioProject[];
  videoProjects?: JsonMasterVideoProject[];
  voiceProfiles?: JsonMasterVoiceProfile[];
  subtitleTracks?: JsonMasterProductionSubtitleTrack[];
  localizedIllustrations?: JsonMasterLocalizedIllustration[];
  localizedVideos?: JsonMasterLocalizedVideo[];
  localizedAudio?: JsonMasterLocalizedAudio[];
  voiceOverTracks?: JsonMasterLocalizedAudio[];
  dubbingProjects?: JsonMasterDubbingProject[];
}

export type JsonMasterStructuredMasterDocument = StructuredMasterDocument;
export type JsonMasterEditorialVersion = EditorialDocumentVersion;
export type JsonMasterEditorialComment = EditorialComment;
export type JsonMasterEditorialSuggestion = EditorialSuggestion;
export type JsonMasterCorrectionFinding = CorrectionFinding;
export type JsonMasterEditorialApproval = EditorialApproval;
export type JsonMasterEditorialAiExecution = EditorialAiExecutionRecord;
export type JsonMasterWork = CanonicalWork;
export type JsonMasterOriginalEdition = OriginalEditionIdentity;
export type JsonMasterEdition = CanonicalEdition;
export type JsonMasterResourceRelationship = ResourceRelationship;
export type JsonMasterContributor = Contributor;
export type JsonMasterEditionContributor = EditionContributor;
export type JsonMasterEditorialMetadata = EditorialMetadata;
export type JsonMasterMetadataVersion = MetadataVersionRecord;
export type JsonMasterRightsRecord = CanonicalRightsRecord;
export type JsonMasterProvenanceRecord = ProvenanceRecord;
export type JsonMasterDigitalAsset = DigitalAssetRecord;
export type JsonMasterLibraryRecord = UnifiedLibraryRecord;
export type JsonMasterLibraryReservation = LibraryReservation;
export type JsonMasterSearchIndexRecord = SearchIndexRecord;
export type JsonMasterPublicationReadiness = PublicationReadinessResult;
export type JsonMasterDuplicateCandidate = DuplicateCandidate;

export interface JsonMasterProject {
  id: string;
  name: string;
  description?: string;
  sourceLanguage: string;
  originalLanguage?: string;
  originalLocale?: string;
  targetLanguages: string[];
  targetLocales?: string[];
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
  originalLanguage?: string;
  originalLocale?: string;
  authoringLanguage?: string;
  authoringLocale?: string;
  targetLanguage?: string;
  targetLocale?: string;
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
  targetLanguage?: string;
  targetLocale?: string;
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
  payload?: object;
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
  before?: object | null;
  after?: object | null;
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
  localizedIllustrations?: JsonMasterLocalizedIllustration[];
  localizedVideos?: JsonMasterLocalizedVideo[];
  localizedAudio?: JsonMasterLocalizedAudio[];
  dubbingProjects?: JsonMasterDubbingProject[];
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

export interface JsonMasterLayout {
  id: string;
  layoutVersion: number;
  styleRevision: number;
  publicationKind: "book" | "magazine";
  documentRefs?: string[];
  pageTemplateRefs?: string[];
  printProfileRefs?: string[];
  publicationProfileRefs?: string[];
  approvedBy?: string;
  approvedAt?: string;
  approvalStatus: "pending_human_approval" | "approved" | "rejected";
}

export interface JsonMasterPageTemplate {
  id: string;
  name: string;
  pageSize?: string;
  margins?: string;
  columns?: number;
  bleed?: string;
}

export interface JsonMasterPrintProfile {
  id: string;
  name: string;
  format: "pdf_x" | "hardcover" | "paperback" | "print_on_demand";
  colorProfile?: string;
  bleed?: string;
  cropMarks?: boolean;
}

export interface JsonMasterIllustration {
  id: string;
  uri: string;
  caption?: string;
  altText?: string;
  documentRef?: string;
  segmentRefs?: string[];
}

export interface JsonMasterProductionAudioTrack {
  id: string;
  language: string;
  uri: string;
  type: "audio_chapter" | "synchronized_narration";
  chapterRef?: string;
  syncQualityScore?: number;
}

export interface JsonMasterProductionVideoAsset {
  id: string;
  uri: string;
  type: "video_asset" | "trailer" | "gallery_video";
  language?: string;
  documentRef?: string;
}

export interface JsonMasterPublicationProfile {
  id: string;
  name: string;
  formats: Array<"json_master" | "pdf" | "epub" | "mobi" | "hardcover" | "paperback" | "print_on_demand">;
  humanApprovalRequired: true;
  approvedBy?: string;
  approvedAt?: string;
}

export interface JsonMasterCreationMediaAsset {
  id: string;
  type: "image" | "audio" | "video" | "subtitle";
  uri?: string;
  language?: string;
  sourceRefs?: string[];
  rights?: JsonMasterMediaRights;
  versionRefs?: string[];
  approvalStatus: "pending_human_approval" | "approved" | "rejected";
}

export interface JsonMasterMediaRights {
  license?: string;
  rightsHolder?: string;
  sourceReference?: string;
  usageNotes?: string;
}

export interface JsonMasterIllustrationProject {
  id: string;
  title: string;
  language: string;
  projectRefs?: string[];
  documentRefs?: string[];
  stylePresets?: string[];
  mediaAssetRefs?: string[];
  humanApprovalRequired: true;
  approvalStatus: "pending_human_approval" | "approved" | "rejected";
}

export interface JsonMasterAudioProject {
  id: string;
  title: string;
  language: string;
  projectRefs?: string[];
  documentRefs?: string[];
  voiceProfileRefs?: string[];
  mediaAssetRefs?: string[];
  exportTargets?: Array<"mp3" | "wav" | "flac">;
  humanApprovalRequired: true;
  approvalStatus: "pending_human_approval" | "approved" | "rejected";
}

export interface JsonMasterVideoProject {
  id: string;
  title: string;
  language: string;
  projectRefs?: string[];
  documentRefs?: string[];
  subtitleTrackRefs?: string[];
  mediaAssetRefs?: string[];
  humanApprovalRequired: true;
  approvalStatus: "pending_human_approval" | "approved" | "rejected";
}

export interface JsonMasterVoiceProfile {
  id: string;
  name: string;
  language: string;
  profileRef?: string;
  approvalStatus?: "pending_human_approval" | "approved" | "rejected";
}

export interface JsonMasterProductionSubtitleTrack {
  id: string;
  language: string;
  format: "srt" | "vtt" | "ass";
  mediaAssetRef?: string;
  segmentRefs?: string[];
  syncStatus?: "draft" | "aligned" | "human_review_required" | "approved";
}

export interface JsonMasterLocalizedIllustration {
  id: string;
  sourceIllustrationRef?: string;
  language: string;
  uri?: string;
  textRegionRefs?: string[];
  typographyStyle?: string;
  approvalStatus: "pending_human_approval" | "approved" | "rejected";
}

export interface JsonMasterLocalizedVideo {
  id: string;
  sourceVideoRef?: string;
  language: string;
  uri?: string;
  subtitleTrackRefs?: string[];
  audioTrackRefs?: string[];
  approvalStatus: "pending_human_approval" | "approved" | "rejected";
}

export interface JsonMasterLocalizedAudio {
  id: string;
  sourceAudioRef?: string;
  language: string;
  uri?: string;
  type: "voice_over" | "dubbing" | "localized_audio";
  synchronizationMetadata?: Record<string, string>;
  approvalStatus: "pending_human_approval" | "approved" | "rejected";
}

export interface JsonMasterDubbingProject {
  id: string;
  title: string;
  sourceLanguage: string;
  targetLanguage: string;
  narratorProfileRefs?: string[];
  voiceTrackRefs?: string[];
  synchronizationMetadata?: Record<string, string>;
  humanApprovalRequired: true;
  approvalStatus: "pending_human_approval" | "approved" | "rejected";
}
