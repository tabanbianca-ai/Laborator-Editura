export type MediaLocalizationProjectKind =
  | "IMAGE"
  | "SUBTITLE"
  | "VOICE_OVER"
  | "DUBBING"
  | "VIDEO"
  | "MIXED";

export type MediaLocalizationAssetType =
  | "LOCALIZED_IMAGE"
  | "SUBTITLE_TRACK"
  | "VOICE_TRACK"
  | "DUBBING_TRACK"
  | "LOCALIZED_VIDEO"
  | "LOCALIZED_AUDIO";

export type MediaLocalizationApprovalStatus =
  | "PENDING_HUMAN_APPROVAL"
  | "APPROVED"
  | "REJECTED";

export type MediaLocalizationAuditAction =
  | "MEDIA_LOCALIZATION_PROJECT_CREATED"
  | "MEDIA_LOCALIZATION_ASSET_CREATED"
  | "MEDIA_LOCALIZATION_REVISION_CREATED"
  | "MEDIA_LOCALIZATION_APPROVED"
  | "MEDIA_LOCALIZATION_REJECTED";

export interface MediaLocalizationActor {
  userId: string;
  organizationId: string;
  roles?: string[];
  permissions?: string[];
}

export interface ImageLocalizationProfile {
  translatableTextRegions: string[];
  translatedTextReplacement: boolean;
  preserveIllustrationLayout: boolean;
  preserveTypographyStyle: boolean;
  localizedImageVersions: string[];
}

export interface SubtitleLocalizationProfile {
  subtitleTracks: string[];
  multilingualSubtitles: string[];
  timingMetadata: Record<string, string>;
  captionStyles: string[];
}

export interface VoiceOverDubbingProfile {
  voiceTracks: string[];
  dubbingProjects: string[];
  narratorProfiles: string[];
  synchronizationMetadata: Record<string, string>;
}

export interface VideoLocalizationProfile {
  localizedVideos: string[];
  localizedCaptions: string[];
  multilingualAudioTracks: string[];
}

export interface MediaLocalizationQaProfile {
  terminologyValidation: boolean;
  lexicographicSupport: boolean;
  semanticFidelity: boolean;
  editorialDecisionSupport: boolean;
  glossaryPrecedence: "VALIDATED_GLOSSARY_OVER_MEDIA_AI";
  terminologyRefs: string[];
  lexicographicRefs: string[];
  semanticReportRefs: string[];
  editorialDecisionRefs: string[];
}

export interface MediaLocalizationVersionHistoryItem {
  id: string;
  version: number;
  createdBy: string;
  createdAt: string;
  notes?: string;
}

export interface MediaLocalizationAuditTrailItem {
  id: string;
  action: MediaLocalizationAuditAction;
  actorId: string;
  at: string;
  version: number;
  details?: object;
}

export interface MediaLocalizationProject {
  id: string;
  organizationId: string;
  projectId?: string;
  documentId?: string;
  multimediaProjectId?: string;
  layoutPublicationPlanId?: string;
  title: string;
  sourceLanguage: string;
  targetLanguages: string[];
  projectKind: MediaLocalizationProjectKind;
  imageLocalization: ImageLocalizationProfile;
  subtitleLocalization: SubtitleLocalizationProfile;
  voiceOverDubbing: VoiceOverDubbingProfile;
  videoLocalization: VideoLocalizationProfile;
  localizationQa: MediaLocalizationQaProfile;
  assetIds: string[];
  versionHistory: MediaLocalizationVersionHistoryItem[];
  auditTrail: MediaLocalizationAuditTrailItem[];
  approvalStatus: MediaLocalizationApprovalStatus;
  humanApprovalRequired: true;
  providerIntegrationStatus: "PLACEHOLDER_ONLY";
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface MediaLocalizationAsset {
  id: string;
  organizationId: string;
  mediaLocalizationProjectId: string;
  assetType: MediaLocalizationAssetType;
  title: string;
  language: string;
  sourceUri?: string;
  localizedUri?: string;
  sourceReferences: string[];
  timingMetadata?: Record<string, string>;
  captionStyles?: string[];
  synchronizationMetadata?: Record<string, string>;
  typographyStyle?: string;
  qaEvidence: MediaLocalizationQaProfile;
  versionHistory: MediaLocalizationVersionHistoryItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface MediaLocalizationAuditEvent {
  id: string;
  organizationId: string;
  mediaLocalizationProjectId: string;
  mediaLocalizationAssetId?: string;
  action: MediaLocalizationAuditAction;
  actorId: string;
  beforeState?: MediaLocalizationProject | MediaLocalizationAsset;
  afterState?: MediaLocalizationProject | MediaLocalizationAsset;
  createdAt: string;
}

export interface CreateMediaLocalizationProjectInput {
  projectId?: string;
  documentId?: string;
  multimediaProjectId?: string;
  layoutPublicationPlanId?: string;
  title: string;
  sourceLanguage: string;
  targetLanguages: string[];
  projectKind: MediaLocalizationProjectKind;
  imageLocalization?: Partial<ImageLocalizationProfile>;
  subtitleLocalization?: Partial<SubtitleLocalizationProfile>;
  voiceOverDubbing?: Partial<VoiceOverDubbingProfile>;
  videoLocalization?: Partial<VideoLocalizationProfile>;
  localizationQa?: Partial<MediaLocalizationQaProfile>;
  metadata?: Record<string, unknown>;
}

export interface CreateMediaLocalizationAssetInput {
  assetType: MediaLocalizationAssetType;
  title: string;
  language: string;
  sourceUri?: string;
  localizedUri?: string;
  sourceReferences?: string[];
  timingMetadata?: Record<string, string>;
  captionStyles?: string[];
  synchronizationMetadata?: Record<string, string>;
  typographyStyle?: string;
  qaEvidence?: Partial<MediaLocalizationQaProfile>;
  metadata?: Record<string, unknown>;
}

export interface MediaLocalizationRepository {
  createProject(project: MediaLocalizationProject): Promise<MediaLocalizationProject>;
  updateProject(project: MediaLocalizationProject): Promise<MediaLocalizationProject>;
  findProjectById(id: string, organizationId: string): Promise<MediaLocalizationProject | null>;
  createAsset(asset: MediaLocalizationAsset): Promise<MediaLocalizationAsset>;
  appendAuditEvent(event: MediaLocalizationAuditEvent): Promise<void>;
}
