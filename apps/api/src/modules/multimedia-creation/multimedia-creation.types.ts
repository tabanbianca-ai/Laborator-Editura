export type MultimediaProjectKind = "ILLUSTRATION" | "AUDIO" | "VIDEO";

export type MultimediaApprovalStatus =
  | "PENDING_HUMAN_APPROVAL"
  | "APPROVED"
  | "REJECTED";

export type MultimediaAssetType = "IMAGE" | "AUDIO" | "VIDEO" | "SUBTITLE";

export type MultimediaExportTarget =
  | "PNG"
  | "JPG"
  | "MP3"
  | "WAV"
  | "FLAC"
  | "MP4"
  | "SRT"
  | "VTT"
  | "ASS";

export type MultimediaAuditAction =
  | "MEDIA_PROJECT_CREATED"
  | "MEDIA_ASSET_CREATED"
  | "MEDIA_REVISION_CREATED"
  | "MEDIA_APPROVED"
  | "MEDIA_REJECTED"
  | "MEDIA_EXPORT_RECORDED";

export interface MultimediaActor {
  userId: string;
  organizationId: string;
  roles?: string[];
  permissions?: string[];
}

export interface IllustrationProjectProfile {
  bookIllustrations: boolean;
  childrenBookIllustrations: boolean;
  editorialIllustrations: boolean;
  covers: boolean;
  translatedTextReplacement: boolean;
  visualConsistencyTracking: boolean;
  stylePresets: string[];
}

export interface AudioProjectProfile {
  chapterNarration: boolean;
  audiobookMetadata: Record<string, string>;
  voiceProfileIds: string[];
  synchronizedTextAudio: boolean;
  exportTargets: Array<"MP3" | "WAV" | "FLAC">;
}

export interface VideoProjectProfile {
  bookTrailers: boolean;
  educationalVideos: boolean;
  reelsShorts: boolean;
  subtitleTrackIds: string[];
  narrationSynchronization: boolean;
  linkedAssetIds: string[];
}

export interface MultimediaRightsMetadata {
  license?: string;
  rightsHolder?: string;
  usageNotes?: string;
  sourceReference?: string;
}

export interface MultimediaVersionHistoryItem {
  id: string;
  version: number;
  createdBy: string;
  createdAt: string;
  notes?: string;
}

export interface MultimediaExportHistoryItem {
  id: string;
  target: MultimediaExportTarget;
  artifactUri?: string;
  createdBy: string;
  createdAt: string;
}

export interface MultimediaAuditTrailItem {
  id: string;
  action: MultimediaAuditAction;
  actorId: string;
  at: string;
  version: number;
  details?: object;
}

export interface MultimediaProject {
  id: string;
  organizationId: string;
  projectId?: string;
  documentId?: string;
  title: string;
  language: string;
  kind: MultimediaProjectKind;
  illustrationProfile?: IllustrationProjectProfile;
  audioProfile?: AudioProjectProfile;
  videoProfile?: VideoProjectProfile;
  assetIds: string[];
  versionHistory: MultimediaVersionHistoryItem[];
  exportHistory: MultimediaExportHistoryItem[];
  auditTrail: MultimediaAuditTrailItem[];
  approvalStatus: MultimediaApprovalStatus;
  humanApprovalRequired: true;
  approvedBy?: string;
  approvedAt?: string;
  providerIntegrationStatus: "PLACEHOLDER_ONLY";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface MultimediaAsset {
  id: string;
  organizationId: string;
  multimediaProjectId: string;
  assetType: MultimediaAssetType;
  title: string;
  uri?: string;
  language?: string;
  sourceReferences: string[];
  rights: MultimediaRightsMetadata;
  versionHistory: MultimediaVersionHistoryItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface MultimediaAuditEvent {
  id: string;
  organizationId: string;
  multimediaProjectId: string;
  multimediaAssetId?: string;
  action: MultimediaAuditAction;
  actorId: string;
  beforeState?: MultimediaProject | MultimediaAsset;
  afterState?: MultimediaProject | MultimediaAsset;
  createdAt: string;
}

export interface CreateMultimediaProjectInput {
  projectId?: string;
  documentId?: string;
  title: string;
  language: string;
  kind: MultimediaProjectKind;
  illustrationProfile?: Partial<IllustrationProjectProfile>;
  audioProfile?: Partial<AudioProjectProfile>;
  videoProfile?: Partial<VideoProjectProfile>;
  metadata?: Record<string, unknown>;
}

export interface CreateMultimediaAssetInput {
  assetType: MultimediaAssetType;
  title: string;
  uri?: string;
  language?: string;
  sourceReferences?: string[];
  rights?: MultimediaRightsMetadata;
  metadata?: Record<string, unknown>;
}

export interface RecordMultimediaExportInput {
  target: MultimediaExportTarget;
  artifactUri?: string;
}

export interface MultimediaRepository {
  createProject(project: MultimediaProject): Promise<MultimediaProject>;
  updateProject(project: MultimediaProject): Promise<MultimediaProject>;
  findProjectById(id: string, organizationId: string): Promise<MultimediaProject | null>;
  createAsset(asset: MultimediaAsset): Promise<MultimediaAsset>;
  appendAuditEvent(event: MultimediaAuditEvent): Promise<void>;
}
