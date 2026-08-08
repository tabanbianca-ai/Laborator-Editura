export const MULTIMEDIA_PRODUCTION_SCHEMA_VERSION = "1.0.0" as const;

export type MultimediaValidationSeverity = "INFO" | "WARNING" | "ERROR" | "BLOCKING";

export type MultimediaValidationStatus =
  | "BLOCKED"
  | "FAILED"
  | "OUTDATED"
  | "PASS"
  | "PASS_WITH_WARNINGS"
  | "PENDING";

export type ProductionStatus =
  | "APPROVED"
  | "BLOCKED"
  | "COMPLETED"
  | "DRAFT"
  | "FAILED"
  | "OUTDATED"
  | "PENDING_REVIEW"
  | "QUEUED"
  | "RUNNING"
  | "VALIDATING";

export type AudioProductionType =
  | "ACCESSIBLE_AUDIO"
  | "CHILDREN_READ_ALOUD"
  | "HUMAN_NARRATION"
  | "HYBRID"
  | "TTS";

export type AudioOutputKind =
  | "ACCESSIBLE_AUDIO"
  | "AUDIO_MASTER"
  | "DISTRIBUTION_MP3"
  | "PREVIEW_AUDIO";

export type AudioOutputFormat = "MP3" | "WAV";

export type NarratorType = "CLONED_VOICE" | "HUMAN" | "SYNTHETIC";

export type SsmlValidationStatus = "BLOCKED" | "INVALID" | "PENDING" | "VALID";

export type PronunciationAlphabet = "IPA" | "PROVIDER_SPECIFIC" | "RESPelling" | "SSML_PHONEME";

export type PronunciationStatus = "ACTIVE" | "ARCHIVED" | "DRAFT" | "UNDER_REVIEW";

export type TtsProviderName = "AZURE" | "ELEVENLABS" | "GOOGLE" | "OTHER_APPROVED_PROVIDER";

export type AudioSegmentStatus =
  | "APPROVED"
  | "FAILED"
  | "GENERATED"
  | "OUTDATED"
  | "PENDING"
  | "QUEUED"
  | "VALIDATED";

export type VideoProductionType =
  | "ACCESSIBLE_VIDEO"
  | "CHILDREN_ANIMATED"
  | "EDITORIAL_VIDEO"
  | "PROMOTIONAL_VIDEO"
  | "READ_ALOUD";

export type VideoSceneStatus = "APPROVED" | "DRAFT" | "OUTDATED" | "RENDERED" | "VALIDATED";

export type SubtitleFormat = "SRT" | "WEBVTT";

export type SubtitleSource = "AI_DRAFT" | "HUMAN" | "TRANSCRIPT" | "TRANSLATION";

export type BuildStatus =
  | "APPROVED"
  | "CANCELLED"
  | "COMPLETED"
  | "FAILED"
  | "QUEUED"
  | "RETRYING"
  | "RUNNING"
  | "VALIDATION_FAILED";

export type ChildrenCreatorType = "AI" | "HUMAN" | "HYBRID";

export type IllustrationStatus =
  | "APPROVED"
  | "BLOCKED"
  | "DRAFT"
  | "GENERATED"
  | "OUTDATED"
  | "REJECTED"
  | "UNDER_REVIEW";

export type MultimediaRightType =
  | "ADAPTATION"
  | "AI_PROCESSING"
  | "AUDIO"
  | "ILLUSTRATION"
  | "IMAGE"
  | "MUSIC"
  | "VIDEO"
  | "VOICE";

export type MultimediaAssetKind =
  | "AUDIO"
  | "CHILDREN_READ_ALOUD"
  | "IMAGE"
  | "INTERACTIVE_CHILDREN_PUBLICATION"
  | "VIDEO";

export type MultimediaPackageStatus = "APPROVED" | "DRAFT" | "FAILED" | "IMMUTABLE" | "VALIDATING";

export type MultimediaBuildPriority =
  | "ACCESSIBILITY_FIX"
  | "HIGH"
  | "NORMAL"
  | "REGENERATE_CHANGED_SEGMENTS";

export type LegacyMultimediaClassification =
  | "ACCESSIBILITY_UNKNOWN"
  | "CANONICAL"
  | "LEGACY_MULTIMEDIA"
  | "ORPHANED"
  | "RIGHTS_UNKNOWN"
  | "SOURCE_VERSION_UNKNOWN"
  | "VOICE_CONSENT_UNKNOWN";

export type MultimediaMetricName =
  | "ai_illustration_cost"
  | "audio_accessibility_failures"
  | "audio_generation_duration"
  | "multimedia_queue_depth"
  | "subtitle_validation_failures"
  | "tts_failure_rate"
  | "tts_job_count"
  | "video_accessibility_failures"
  | "video_render_duration"
  | "video_render_failure_rate";

export type MultimediaAuditEventName =
  | "AudioProductionCompleted"
  | "AudioProductionCreated"
  | "AudioSegmentGenerated"
  | "IllustrationApproved"
  | "IllustrationGenerated"
  | "LocalizedIllustrationCreated"
  | "MultimediaPackageApproved"
  | "MultimediaValidationFailed"
  | "SceneUpdated"
  | "SubtitleTrackCreated"
  | "TranscriptGenerated"
  | "VideoProductionCreated"
  | "VideoRendered"
  | "VoiceProfileUsed";

export type MultimediaPermission =
  | "audio.production.create"
  | "audio.production.generate"
  | "audio.production.review"
  | "audio.voice.manage"
  | "children.illustration.generate"
  | "children.illustration.review"
  | "multimedia.accessibility.approve"
  | "video.production.create"
  | "video.production.render"
  | "video.production.review";

export interface MultimediaLineage {
  workId: string;
  editionId: string;
  masterDocumentVersionId: string;
  publicationId: string;
  sourceBlockIds: string[];
  generatorOrCreator: string;
  profileVersion: string;
  rightsRecordIds: string[];
}

export interface AudioProduction {
  id: string;
  organizationId: string;
  lineage: MultimediaLineage;
  language: string;
  productionType: AudioProductionType;
  narratorProfileId: string;
  audioProfileId: string;
  status: ProductionStatus;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface AudioProfile {
  id: string;
  organizationId: string;
  name: string;
  version: string;
  sampleRate: number;
  bitDepth: number;
  channels: number;
  targetLoudness: string;
  peakLimit: string;
  speechRate: number;
  pauseProfile: Record<string, unknown>;
  chapterPolicy: string;
  outputFormats: AudioOutputFormat[];
  normalizationProfile: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NarratorProfile {
  id: string;
  organizationId: string;
  narratorType: NarratorType;
  canonicalName: string;
  language: string;
  voiceCharacteristics: string[];
  provider?: TtsProviderName;
  providerVoiceId?: string;
  consentRecordId?: string;
  usageRights: MultimediaRightType[];
  allowedProjectIds: string[];
  voiceCloningAllowed?: boolean;
  consentVerified?: boolean;
  validFrom: string;
  validUntil?: string;
  status: "ACTIVE" | "ARCHIVED" | "BLOCKED" | "UNDER_REVIEW";
  version: string;
}

export interface SsmlDocument {
  id: string;
  organizationId: string;
  sourceMasterVersionId: string;
  language: string;
  voiceProfileId: string;
  ssmlProfileVersion: string;
  content: string;
  supportedControls: SsmlControl[];
  validationStatus: SsmlValidationStatus;
  createdAt: string;
  updatedAt: string;
}

export type SsmlControl =
  | "ABBREVIATION"
  | "ACCENT"
  | "CHAPTER"
  | "LANGUAGE_CHANGE"
  | "NUMBER"
  | "PAUSE"
  | "PRONUNCIATION"
  | "QUOTE"
  | "RATE";

export interface PronunciationEntry {
  id: string;
  organizationId: string;
  term: string;
  language: string;
  phoneticValue: string;
  alphabet: PronunciationAlphabet;
  domain: string;
  voiceScope: string;
  status: PronunciationStatus;
  version: string;
}

export interface TtsSynthesisInput {
  lineage: MultimediaLineage;
  language: string;
  voiceProfileId: string;
  ssmlDocumentId: string;
  audioProfileId: string;
  configuration: Record<string, unknown>;
  idempotencyKey: string;
}

export interface TtsProviderContract {
  providerName: TtsProviderName;
  validateVoice(profile: NarratorProfile): MultimediaValidationResult;
  validateSSML(document: SsmlDocument): MultimediaValidationResult;
  synthesizeSegment(input: TtsSynthesisInput): TtsJobReference;
  queryJob(jobId: string): TtsJobReference;
  cancelJob(jobId: string): TtsJobReference;
}

export interface TtsJobReference {
  providerName: TtsProviderName;
  jobId: string;
  status: BuildStatus;
  retryable: boolean;
  failureReason?: string;
}

export interface AudioSegment {
  id: string;
  organizationId: string;
  audioProductionId: string;
  sourceBlockIds: string[];
  sequence: number;
  textHash: string;
  voiceProfileVersion: string;
  audioAssetId?: string;
  durationSeconds?: number;
  status: AudioSegmentStatus;
}

export interface AudioAssembly {
  id: string;
  organizationId: string;
  audioProductionId: string;
  segmentIds: string[];
  chapterMarkers: ChapterMarker[];
  introAssetId?: string;
  outroAssetId?: string;
  continuityValidation: MultimediaValidationResult;
  status: ProductionStatus;
}

export interface ChapterMarker {
  chapterId: string;
  title: string;
  startTime: number;
  endTime: number;
}

export interface AudioOutput {
  id: string;
  organizationId: string;
  audioProductionId: string;
  outputKind: AudioOutputKind;
  format: AudioOutputFormat;
  assetId: string;
  checksum: string;
  derivedDistributionOutput: boolean;
  status: ProductionStatus;
}

export interface Transcript {
  id: string;
  organizationId: string;
  audioProductionId: string;
  masterDocumentVersionId: string;
  language: string;
  content: string;
  timingInformation: TimedTextSegment[];
  status: ProductionStatus;
  version: string;
}

export interface VideoProduction {
  id: string;
  organizationId: string;
  lineage: MultimediaLineage;
  language: string;
  videoType: VideoProductionType;
  videoProfileId: string;
  status: ProductionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VideoProfile {
  id: string;
  organizationId: string;
  name: string;
  version: string;
  resolution: string;
  aspectRatio: string;
  frameRate: number;
  audioProfileId: string;
  captionProfile: Record<string, unknown>;
  visualTemplate: string;
  transitionProfile: string;
  accessibilityProfile: Record<string, unknown>;
  outputCodec: string;
  outputContainer: string;
}

export interface VideoScene {
  id: string;
  organizationId: string;
  videoProductionId: string;
  sequence: number;
  sourceBlockIds: string[];
  startTime: number;
  endTime: number;
  visualAssetIds: string[];
  audioSegmentIds: string[];
  captionIds: string[];
  transition?: string;
  status: VideoSceneStatus;
  version: string;
}

export interface SubtitleTrack {
  id: string;
  organizationId: string;
  videoProductionId: string;
  language: string;
  format: SubtitleFormat;
  source: SubtitleSource;
  segments: TimedTextSegment[];
  version: string;
  status: ProductionStatus;
}

export interface TimedTextSegment {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
  soundDescription?: string;
}

export interface AudioDescription {
  id: string;
  organizationId: string;
  sceneId: string;
  language: string;
  descriptionText: string;
  timing: {
    startTime: number;
    endTime: number;
  };
  narratorProfileId?: string;
  status: ProductionStatus;
}

export interface VideoBuild {
  id: string;
  organizationId: string;
  videoProductionId: string;
  masterVersionId: string;
  timelineVersion: string;
  videoProfileVersion: string;
  assetVersions: string[];
  rendererName: string;
  rendererVersion: string;
  status: BuildStatus;
  checksums: string[];
  validationResult: MultimediaValidationResult;
  immutable: boolean;
}

export interface MultimediaManifest {
  id: string;
  organizationId: string;
  editionId: string;
  masterDocumentVersionId: string;
  audioProductionIds: string[];
  videoProductionIds: string[];
  profileIds: string[];
  generators: string[];
  activeAssetIds: string[];
  transcriptIds: string[];
  subtitleTrackIds: string[];
  accessibilityReportIds: string[];
  rightsRecordIds: string[];
  checksums: string[];
}

export interface ChildrenProfile {
  id: string;
  organizationId: string;
  editionId: string;
  ageRange: AgeClassification;
  readingLevel: string;
  typographyProfile: Record<string, unknown>;
  illustrationProfile: Record<string, unknown>;
  terminologyDomain: "CHILDREN";
  accessibilityProfile: Record<string, unknown>;
  interactionPolicy: Record<string, unknown>;
  contentSafetyProfile: Record<string, unknown>;
  version: string;
}

export interface AgeClassification {
  ageMin: number;
  ageMax: number;
  readingLevel: string;
  parentalGuidance: boolean;
  contentNotes: string[];
  version?: string;
}

export interface IllustrationAsset {
  id: string;
  organizationId: string;
  editionId: string;
  sourceBlockIds: string[];
  illustrationProfileId: string;
  creatorType: ChildrenCreatorType;
  creatorId: string;
  promptReference?: string;
  sourceAssetIds: string[];
  rightsRecordId: string;
  version: string;
  status: IllustrationStatus;
}

export interface AiIllustrationGeneration {
  id: string;
  organizationId: string;
  illustrationId: string;
  agentId: string;
  modelId: string;
  modelVersion: string;
  promptVersion: string;
  referenceAssetIds: string[];
  outputAssetId: string;
  generationParameters: Record<string, unknown>;
  cost: number;
  currency: string;
  rightsStatus: MultimediaValidationStatus;
  humanReview: HumanReviewGate;
}

export interface HumanReviewGate {
  required: true;
  status: "APPROVED" | "PENDING" | "REJECTED";
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface VisualIdentityProfile {
  id: string;
  organizationId: string;
  workId: string;
  characters: string[];
  proportions: string;
  style: string;
  clothing: string;
  palette: string[];
  environment: string;
  lighting: string;
  compositionRules: string[];
  version: string;
}

export interface CharacterRegistryEntry {
  id: string;
  organizationId: string;
  workId: string;
  canonicalName: string;
  description: string;
  visualReferenceAssetIds: string[];
  physicalTraits: string[];
  clothingRules: string[];
  age?: string;
  allowedVariations: string[];
  version: string;
}

export interface LocalizedTextLayer {
  id: string;
  organizationId: string;
  illustrationId: string;
  sourceTextReference: string;
  language: string;
  localizedText: string;
  typographyProfileId: string;
  status: ProductionStatus;
}

export interface LocalizedImageDerivative {
  id: string;
  organizationId: string;
  illustrationId: string;
  localizedTextLayerId: string;
  sourceAssetId: string;
  derivativeAssetId: string;
  language: string;
  checksum: string;
  preservesOriginal: true;
}

export interface TextAudioSyncSegment {
  id: string;
  organizationId: string;
  publicationId: string;
  blockId: string;
  audioSegmentId: string;
  startTime: number;
  endTime: number;
  sequence: number;
}

export interface MultimediaRightsValidation {
  id: string;
  organizationId: string;
  publicationId: string;
  requiredRights: MultimediaRightType[];
  grantedRights: MultimediaRightType[];
  pdfOrEpubRightsAreSufficient: false;
  result: MultimediaValidationResult;
  validatedAt: string;
}

export interface MusicSoundAsset {
  id: string;
  organizationId: string;
  digitalAssetId: string;
  creator: string;
  source: string;
  license: string;
  commercialUse: boolean;
  adaptationAllowed: boolean;
  territories: string[];
  channels: string[];
  validity?: {
    validFrom: string;
    validUntil?: string;
  };
  creditRequirement?: string;
}

export interface MultimediaAccessibilityReport {
  id: string;
  organizationId: string;
  assetKind: MultimediaAssetKind;
  assetId: string;
  transcriptAvailable: boolean;
  captionsAvailable: boolean;
  audioDescriptionAvailable: boolean;
  altTextAvailable: boolean;
  keyboardAccessible: boolean;
  screenReaderCompatible: boolean;
  reducedMotionSupported: boolean;
  result: MultimediaValidationResult;
}

export interface MultimediaPackage {
  id: string;
  organizationId: string;
  publicationId: string;
  manifestId: string;
  rightsManifestId: string;
  accessibilityManifestId: string;
  integrityManifestId: string;
  audioAssetIds: string[];
  videoAssetIds: string[];
  transcriptIds: string[];
  captionTrackIds: string[];
  illustrationAssetIds: string[];
  localizedAssetIds: string[];
  validationEvidenceIds: string[];
  checksums: string[];
  immutable: boolean;
  status: MultimediaPackageStatus;
  approvedBy?: string;
  approvedAt?: string;
}

export interface MultimediaBuildJob {
  id: string;
  organizationId: string;
  productionId: string;
  productionKind: "AUDIO" | "ILLUSTRATION" | "VIDEO";
  priority: MultimediaBuildPriority;
  status: BuildStatus;
  idempotencyKey: string;
  retryCount: number;
  maxRetries: number;
  cancellable: boolean;
  timeoutSeconds: number;
  selectiveRegeneration: boolean;
  failureReason?: string;
}

export interface MultimediaCostRecord {
  id: string;
  organizationId: string;
  provider: string;
  model: string;
  jobId: string;
  projectId: string;
  publicationId: string;
  inputUnits: number;
  outputUnits: number;
  cost: number;
  currency: string;
  timestamp: string;
}

export interface MultimediaObservabilityMetric {
  id: string;
  organizationId: string;
  metricName: MultimediaMetricName;
  value: number;
  unit: string;
  recordedAt: string;
  metadata?: Record<string, unknown>;
}

export interface MultimediaAuditEvent {
  id: string;
  organizationId: string;
  eventName: MultimediaAuditEventName;
  actorId?: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface LegacyMultimediaResource {
  id: string;
  organizationId: string;
  originalUri?: string;
  classification: LegacyMultimediaClassification;
  sourceVersionKnown: boolean;
  rightsKnown: boolean;
  voiceConsentKnown: boolean;
  accessibilityKnown: boolean;
  orphaned: boolean;
  reviewNotes?: string;
}

export interface MultimediaValidationIssue {
  severity: MultimediaValidationSeverity;
  code: string;
  message: string;
}

export interface MultimediaValidationResult {
  status: MultimediaValidationStatus;
  valid: boolean;
  issues: MultimediaValidationIssue[];
}

export function validateMultimediaLineage(lineage: Partial<MultimediaLineage>): MultimediaValidationResult {
  const issues: MultimediaValidationIssue[] = [];

  requireNonEmpty(lineage.workId, "workId", issues);
  requireNonEmpty(lineage.editionId, "editionId", issues);
  requireNonEmpty(lineage.masterDocumentVersionId, "masterDocumentVersionId", issues);
  requireNonEmpty(lineage.publicationId, "publicationId", issues);
  requireNonEmpty(lineage.generatorOrCreator, "generatorOrCreator", issues);
  requireNonEmpty(lineage.profileVersion, "profileVersion", issues);
  requireNonEmptyArray(lineage.sourceBlockIds, "sourceBlockIds", issues);
  requireNonEmptyArray(lineage.rightsRecordIds, "rightsRecordIds", issues);

  return validationResult(issues);
}

export function validateNarratorConsent(profile: Pick<NarratorProfile, "narratorType" | "voiceCloningAllowed" | "consentVerified" | "status">): MultimediaValidationResult {
  const issues: MultimediaValidationIssue[] = [];

  if (profile.status !== "ACTIVE") {
    issues.push({
      severity: "BLOCKING",
      code: "NARRATOR_NOT_ACTIVE",
      message: "Narrator profile must be active before production use."
    });
  }

  if (
    profile.narratorType === "CLONED_VOICE" &&
    (profile.voiceCloningAllowed !== true || profile.consentVerified !== true)
  ) {
    issues.push({
      severity: "BLOCKING",
      code: "CLONED_VOICE_CONSENT_REQUIRED",
      message: "Cloned voices require explicit cloning permission and verified consent."
    });
  }

  return validationResult(issues);
}

export function canUseNarratorProfile(profile: Pick<NarratorProfile, "narratorType" | "voiceCloningAllowed" | "consentVerified" | "status">): boolean {
  return validateNarratorConsent(profile).valid;
}

export function createSourceBlockTextHash(blockHashes: Record<string, string>, sourceBlockIds: string[]): string {
  return sourceBlockIds.map((sourceBlockId) => `${sourceBlockId}:${blockHashes[sourceBlockId] ?? "MISSING"}`).join("|");
}

export function detectOutdatedAudioSegments(
  segments: Pick<AudioSegment, "id" | "sourceBlockIds" | "textHash">[],
  currentBlockHashes: Record<string, string>
): string[] {
  return segments
    .filter((segment) => segment.textHash !== createSourceBlockTextHash(currentBlockHashes, segment.sourceBlockIds))
    .map((segment) => segment.id);
}

export function canUseAudioOutputAsProductionMaster(output: Pick<AudioOutput, "derivedDistributionOutput" | "outputKind">): boolean {
  return output.outputKind === "AUDIO_MASTER" && output.derivedDistributionOutput === false;
}

export function validateSubtitleTrack(track: Pick<SubtitleTrack, "language" | "segments">): MultimediaValidationResult {
  const issues: MultimediaValidationIssue[] = [];

  requireNonEmpty(track.language, "language", issues);

  const segments = [...track.segments].sort((left, right) => left.startTime - right.startTime);
  let previousEndTime = 0;

  for (const segment of segments) {
    if (segment.startTime < 0 || segment.endTime < 0) {
      issues.push({
        severity: "BLOCKING",
        code: "NEGATIVE_SUBTITLE_TIME",
        message: "Subtitle segment times cannot be negative."
      });
    }

    if (segment.endTime <= segment.startTime) {
      issues.push({
        severity: "BLOCKING",
        code: "INVALID_SUBTITLE_TIMING",
        message: "Subtitle segment end time must be after start time."
      });
    }

    if (segment.startTime < previousEndTime) {
      issues.push({
        severity: "ERROR",
        code: "OVERLAPPING_SUBTITLE",
        message: "Subtitle segments cannot overlap."
      });
    }

    const duration = Math.max(segment.endTime - segment.startTime, 0.001);
    const charactersPerSecond = segment.text.length / duration;

    if (charactersPerSecond > 21) {
      issues.push({
        severity: "WARNING",
        code: "SUBTITLE_READING_SPEED_HIGH",
        message: "Subtitle reading speed may be too fast."
      });
    }

    previousEndTime = Math.max(previousEndTime, segment.endTime);
  }

  return validationResult(issues);
}

export interface MultimediaAccessibilityGateInput {
  assetKind: MultimediaAssetKind;
  transcriptAvailable?: boolean;
  captionsAvailable?: boolean;
  audioDescriptionAvailable?: boolean;
  visualInformationCritical?: boolean;
  altTextAvailable?: boolean;
  keyboardAccessible?: boolean;
  screenReaderCompatible?: boolean;
  reducedMotionSupported?: boolean;
}

export function evaluateMultimediaAccessibilityGate(input: MultimediaAccessibilityGateInput): MultimediaValidationResult {
  const issues: MultimediaValidationIssue[] = [];

  if ((input.assetKind === "AUDIO" || input.assetKind === "CHILDREN_READ_ALOUD") && input.transcriptAvailable !== true) {
    issues.push({
      severity: "BLOCKING",
      code: "AUDIO_TRANSCRIPT_REQUIRED",
      message: "Accessible audio requires a transcript."
    });
  }

  if (input.assetKind === "VIDEO" && input.captionsAvailable !== true) {
    issues.push({
      severity: "BLOCKING",
      code: "VIDEO_CAPTIONS_REQUIRED",
      message: "Accessible video requires captions."
    });
  }

  if (input.assetKind === "VIDEO" && input.visualInformationCritical === true && input.audioDescriptionAvailable !== true) {
    issues.push({
      severity: "BLOCKING",
      code: "AUDIO_DESCRIPTION_REQUIRED",
      message: "Visual-critical video requires audio description."
    });
  }

  if (input.assetKind === "IMAGE" && input.altTextAvailable !== true) {
    issues.push({
      severity: "BLOCKING",
      code: "IMAGE_ALT_TEXT_REQUIRED",
      message: "Images require alt text for accessibility."
    });
  }

  if (input.keyboardAccessible === false) {
    issues.push({
      severity: "ERROR",
      code: "KEYBOARD_ACCESS_REQUIRED",
      message: "Controls cannot depend exclusively on gestures."
    });
  }

  if (input.screenReaderCompatible === false) {
    issues.push({
      severity: "ERROR",
      code: "SCREEN_READER_SUPPORT_REQUIRED",
      message: "Multimedia controls must be screen-reader compatible."
    });
  }

  if (
    (input.assetKind === "VIDEO" || input.assetKind === "INTERACTIVE_CHILDREN_PUBLICATION") &&
    input.reducedMotionSupported === false
  ) {
    issues.push({
      severity: "WARNING",
      code: "REDUCED_MOTION_RECOMMENDED",
      message: "Non-essential motion should support reduced motion preferences."
    });
  }

  return validationResult(issues);
}

export interface MultimediaRightsInput {
  requiredRights: MultimediaRightType[];
  grantedRights: MultimediaRightType[];
  pdfOrEpubRightsOnly?: boolean;
}

export function evaluateMultimediaRights(input: MultimediaRightsInput): MultimediaValidationResult {
  const issues: MultimediaValidationIssue[] = [];
  const granted = new Set(input.grantedRights);

  if (input.pdfOrEpubRightsOnly === true && input.requiredRights.length > 0) {
    issues.push({
      severity: "BLOCKING",
      code: "PDF_EPUB_RIGHTS_NOT_MULTIMEDIA_RIGHTS",
      message: "PDF or EPUB rights do not automatically grant multimedia rights."
    });
  }

  for (const right of input.requiredRights) {
    if (!granted.has(right)) {
      issues.push({
        severity: "BLOCKING",
        code: `MISSING_${right}_RIGHT`,
        message: `${right} rights must be verified before multimedia production.`
      });
    }
  }

  return validationResult(issues);
}

export function canApproveAiIllustration(generation: Pick<AiIllustrationGeneration, "humanReview" | "rightsStatus">): boolean {
  return generation.humanReview.required === true &&
    generation.humanReview.status === "APPROVED" &&
    generation.rightsStatus === "PASS";
}

export function canModifyVideoBuild(build: Pick<VideoBuild, "immutable" | "status">): boolean {
  return build.immutable !== true && build.status !== "APPROVED";
}

export function canApproveMultimediaPackage(
  multimediaPackage: Pick<MultimediaPackage, "checksums" | "immutable" | "status">,
  lineageValidation: MultimediaValidationResult,
  rightsValidation: MultimediaValidationResult,
  accessibilityValidation: MultimediaValidationResult
): boolean {
  return multimediaPackage.status === "APPROVED" &&
    multimediaPackage.immutable === true &&
    multimediaPackage.checksums.length > 0 &&
    lineageValidation.valid &&
    rightsValidation.valid &&
    accessibilityValidation.valid;
}

export function createMultimediaIdempotencyKey(input: Record<string, string | number | boolean | null | undefined>): string {
  return stableStringify(input);
}

export function classifyLegacyMultimediaResource(input: {
  sourceVersionKnown?: boolean;
  rightsKnown?: boolean;
  voiceConsentKnown?: boolean;
  accessibilityKnown?: boolean;
  orphaned?: boolean;
  canonical?: boolean;
}): LegacyMultimediaClassification {
  if (input.canonical === true) {
    return "CANONICAL";
  }

  if (input.orphaned === true) {
    return "ORPHANED";
  }

  if (input.sourceVersionKnown !== true) {
    return "SOURCE_VERSION_UNKNOWN";
  }

  if (input.rightsKnown !== true) {
    return "RIGHTS_UNKNOWN";
  }

  if (input.voiceConsentKnown === false) {
    return "VOICE_CONSENT_UNKNOWN";
  }

  if (input.accessibilityKnown !== true) {
    return "ACCESSIBILITY_UNKNOWN";
  }

  return "LEGACY_MULTIMEDIA";
}

function requireNonEmpty(value: unknown, field: string, issues: MultimediaValidationIssue[]): void {
  if (typeof value !== "string" || value.length === 0) {
    issues.push({
      severity: "BLOCKING",
      code: `MISSING_${field}`,
      message: `${field} is required for multimedia lineage.`
    });
  }
}

function requireNonEmptyArray(value: unknown, field: string, issues: MultimediaValidationIssue[]): void {
  if (!Array.isArray(value) || value.length === 0 || value.some((item) => typeof item !== "string" || item.length === 0)) {
    issues.push({
      severity: "BLOCKING",
      code: `MISSING_${field}`,
      message: `${field} must contain at least one identifier.`
    });
  }
}

function validationResult(issues: MultimediaValidationIssue[]): MultimediaValidationResult {
  const hasBlocking = issues.some((issue) => issue.severity === "BLOCKING");
  const hasError = issues.some((issue) => issue.severity === "ERROR");
  const hasWarning = issues.some((issue) => issue.severity === "WARNING");

  return {
    status: hasBlocking ? "BLOCKED" : hasError ? "FAILED" : hasWarning ? "PASS_WITH_WARNINGS" : "PASS",
    valid: !hasBlocking && !hasError,
    issues
  };
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();

  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(",")}}`;
}
