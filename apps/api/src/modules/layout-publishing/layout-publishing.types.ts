import { type AuthenticatedRequestContext } from "../auth/request-context.types";

export type LayoutPublicationKind = "BOOK" | "MAGAZINE";

export type LayoutExportFormat =
  | "DOCX"
  | "PDF_X"
  | "PDF_A"
  | "AZW3"
  | "HTML"
  | "MP3"
  | "M4B"
  | "MP4"
  | "WEBM"
  | "PNG"
  | "JPG"
  | "JPEG"
  | "SVG"
  | "WEBP"
  | "TIFF"
  | "ACCESSIBLE_PDF"
  | "ACCESSIBLE_EPUB"
  | "SRT"
  | "VTT"
  | "JSON"
  | "XML"
  | "CSV"
  | "ZIP"
  | "JSON_MASTER"
  | "PDF"
  | "EPUB"
  | "MOBI"
  | "HARDCOVER"
  | "PAPERBACK"
  | "PRINT_ON_DEMAND";

export type LayoutApprovalStatus =
  | "PENDING_HUMAN_APPROVAL"
  | "APPROVED"
  | "REJECTED";

export type LayoutAuditAction =
  | "LAYOUT_PLAN_CREATED"
  | "STYLE_REVISION_CREATED"
  | "PUBLICATION_APPROVED"
  | "PUBLICATION_REJECTED"
  | "EXPORT_RECORDED"
  | "PUBLISHING_STATE_CHANGED"
  | "PREFLIGHT_GENERATED"
  | "PREFLIGHT_REFRESHED"
  | "WARNING_ACCEPTED"
  | "OVERRIDE_APPLIED"
  | "PUBLICATION_CREATED"
  | "EDITION_PUBLISHED"
  | "PUBLICATION_WITHDRAWN"
  | "PUBLICATION_REPUBLISHED"
  | "DISTRIBUTION_INITIATED"
  | "DISTRIBUTION_DELIVERED"
  | "DISTRIBUTION_FAILED"
  | "CHANNEL_WITHDRAWN"
  | "OFFICIAL_EDITION_SELECTED"
  | "FORMAT_REFERENCES_SELECTED";

export type PublishingState =
  | "IN_PREGATIRE"
  | "GATA_PENTRU_PUBLICARE"
  | "PUBLICAT"
  | "REPUBLICAT"
  | "RETRAS_DIN_PUBLICARE";

export type PublishingPreflightStatus =
  | "PASS"
  | "WARNING"
  | "ERROR"
  | "NOT_APPLICABLE"
  | "PENDING";

export type PublishingPreflightSeverity =
  | "INFORMATIONAL"
  | "WARNING"
  | "CRITICAL";

export type PublishingSourceComponent =
  | "LIBRARY"
  | "QUALITY_AGENT"
  | "RIGHTS_PROVENANCE"
  | "TRANSLATION"
  | "REVIEW"
  | "LAYOUT"
  | "EXPORT"
  | "PUBLISHING"
  | "WORKFLOW";

export type PublishingDistributionChannel =
  | "INTERNAL_LIBRARY"
  | "PUBLIC_PORTAL"
  | "DIGITAL_BOOKSTORE"
  | "EXTERNAL_EXPORT"
  | "PRINT_ON_DEMAND";

export type PublishingDistributionStatus =
  | "PENDING"
  | "PROCESSING"
  | "DELIVERED"
  | "FAILED"
  | "WITHDRAWN";

export type LayoutPublishingActor = AuthenticatedRequestContext;

export interface BookLayoutPlan {
  chapters: string[];
  sections: string[];
  footnotes: string[];
  tableOfContents: boolean;
  indexes: string[];
  illustrations: string[];
  captions: string[];
  pageTemplates: string[];
}

export interface MagazineLayoutPlan {
  issues: string[];
  articles: string[];
  columns: string[];
  imageGalleries: string[];
  covers: string[];
  archives: string[];
}

export interface EditorialFinishingProfile {
  widowOrphanControl: boolean;
  typographyValidation: boolean;
  spacing: "COMPACT" | "STANDARD" | "EXPANDED";
  kerning: boolean;
  margins: string;
  bleed: string;
  pagination: "AUTO" | "MANUAL_REVIEW_REQUIRED";
  printProfiles: string[];
}

export interface LayoutMultimediaProfile {
  audioChapters: string[];
  synchronizedNarration: boolean;
  videoAssets: string[];
  illustrations: string[];
  galleries: string[];
}

export interface LayoutPublicationExportHistory {
  id: string;
  format: LayoutExportFormat;
  artifactUri?: string;
  createdBy: string;
  createdAt: string;
}

export interface LayoutPublicationHistoryItem {
  id: string;
  action: LayoutAuditAction;
  actorId: string;
  at: string;
  layoutVersion: number;
  styleRevision: number;
  details?: object;
}

export interface LayoutPublicationPlan {
  id: string;
  organizationId: string;
  projectId?: string;
  documentId?: string;
  publicationKind: LayoutPublicationKind;
  title: string;
  language: string;
  bookLayout?: BookLayoutPlan;
  magazineLayout?: MagazineLayoutPlan;
  editorialFinishing: EditorialFinishingProfile;
  exportFormats: LayoutExportFormat[];
  multimedia: LayoutMultimediaProfile;
  layoutVersion: number;
  styleRevision: number;
  publicationHistory: LayoutPublicationHistoryItem[];
  exportHistory: LayoutPublicationExportHistory[];
  approvalStatus: LayoutApprovalStatus;
  humanApprovalRequired: true;
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface PublishingPreflightCheck {
  id: string;
  key:
    | "METADATA_COMPLETE"
    | "RIGHTS_VALIDATED"
    | "REQUIRED_FORMATS_GENERATED"
    | "REQUIRED_FORMAT_COVERAGE"
    | "IMAGES_AND_RESOURCES_AVAILABLE"
    | "ACCESSIBILITY_REQUIREMENTS_SATISFIED"
    | "LAYOUT_VALIDATION_COMPLETED"
    | "MANDATORY_TRANSLATIONS_COMPLETED"
    | "MANDATORY_REVIEW_COMPLETED"
    | "IDENTIFIER_PRESENT"
    | "EDITION_SELECTED"
    | "VERSION_SELECTED"
    | "VISIBILITY_CONFIRMED"
    | "PUBLICATION_CHANNELS_SELECTED"
    | "WORKFLOW_APPROVALS_COMPLETE";
  label: string;
  status: PublishingPreflightStatus;
  sourceComponent: PublishingSourceComponent;
  severity: PublishingPreflightSeverity;
  message: string;
  remediationLink: string;
  lastValidationTimestamp: string;
  overridable: boolean;
  references?: Record<string, string>;
}

export interface PublishingPreflightResult {
  id: string;
  organizationId: string;
  publicationId: string;
  editionId?: string;
  versionId?: string;
  projectId?: string;
  documentId?: string;
  layoutPublicationPlanId?: string;
  selectedChannels: PublishingDistributionChannel[];
  selectedArtifactRefs: string[];
  visibility?: string;
  readinessPercentage: number;
  blocked: boolean;
  blockingIssues: string[];
  warnings: string[];
  missingActions: string[];
  checks: PublishingPreflightCheck[];
  ownershipBoundaries: {
    metadata: "LIBRARY";
    rights: "RIGHTS_PROVENANCE";
    formats: "EXPORT";
    workflow: "WORKFLOW";
    quality: "QUALITY_AGENT";
    layout: "LAYOUT";
    distribution: "LAYOUT_PUBLISHING";
  };
  noDuplicateValidationLogic: true;
  humanFinalAuthorityRequired: true;
  createdBy: string;
  createdAt: string;
  refreshedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface PublishingRecord {
  id: string;
  organizationId: string;
  publicationId: string;
  editionId: string;
  versionId: string;
  preflightResultId: string;
  previousPublishingRecordId?: string;
  publishingState: PublishingState;
  publicationDate?: string;
  publishingUserOrAgent?: string;
  selectedChannels: PublishingDistributionChannel[];
  formatsMadeAvailable: string[];
  selectedArtifactRefs: string[];
  visibility: string;
  rightsSnapshotRef?: string;
  preflightSnapshotRef: string;
  immutableOfficialEdition: true;
  metadataDuplicated: false;
  publicationMetadataOwner: "LIBRARY";
  versionOwner: "LIBRARY";
  formatsOwner: "EXPORT";
  rightsOwner: "RIGHTS_PROVENANCE";
  withdrawalReason?: string;
  withdrawalEffectiveDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface PublishingDistributionRecord {
  id: string;
  organizationId: string;
  publicationId: string;
  editionId: string;
  publishingRecordId: string;
  channel: PublishingDistributionChannel;
  deliveryStatus: PublishingDistributionStatus;
  distributionTimestamp: string;
  targetDestination?: string;
  integrationReference?: string;
  selectedExportedArtifactRefs: string[];
  responsibleUserOrAgent: string;
  success: boolean;
  externalReference?: string;
  withdrawalStatus?: "NOT_WITHDRAWN" | "WITHDRAWN";
  withdrawalReason?: string;
  republicationOfPublishingRecordId?: string;
  notes?: string;
  history: PublishingDistributionHistoryItem[];
  auditReference?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface PublishingDistributionHistoryItem {
  deliveryStatus: PublishingDistributionStatus;
  changedBy: string;
  changedAt: string;
  notes?: string;
  externalReference?: string;
}

export interface LayoutPublicationAuditEvent {
  id: string;
  organizationId: string;
  layoutPublicationPlanId?: string;
  preflightResultId?: string;
  publishingRecordId?: string;
  distributionRecordId?: string;
  publicationId?: string;
  editionId?: string;
  versionId?: string;
  action: LayoutAuditAction;
  actorId: string;
  reason?: string;
  beforeState?: object;
  afterState?: object;
  createdAt: string;
}

export interface CreateLayoutPublicationPlanInput {
  projectId?: string;
  documentId?: string;
  publicationKind: LayoutPublicationKind;
  title: string;
  language: string;
  bookLayout?: Partial<BookLayoutPlan>;
  magazineLayout?: Partial<MagazineLayoutPlan>;
  editorialFinishing?: Partial<EditorialFinishingProfile>;
  exportFormats?: LayoutExportFormat[];
  multimedia?: Partial<LayoutMultimediaProfile>;
  metadata?: Record<string, unknown>;
}

export interface RecordLayoutExportInput {
  format: LayoutExportFormat;
  artifactUri?: string;
}

export interface GeneratePublishingPreflightInput {
  publicationId: string;
  editionId?: string;
  versionId?: string;
  documentId?: string;
  layoutPublicationPlanId?: string;
  selectedChannels?: PublishingDistributionChannel[];
  selectedArtifactRefs?: string[];
  requiredFormats?: string[];
  visibility?: string;
  refreshOfPreflightResultId?: string;
  metadata?: Record<string, unknown>;
}

export interface PreparePublishingRecordInput {
  publicationId: string;
  editionId: string;
  versionId: string;
  preflightResultId: string;
  selectedChannels?: PublishingDistributionChannel[];
  selectedArtifactRefs?: string[];
  visibility?: string;
  rightsSnapshotRef?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export interface PublishRecordInput {
  channel?: PublishingDistributionChannel;
  formatsMadeAvailable?: string[];
  selectedArtifactRefs?: string[];
  reason?: string;
}

export interface WithdrawPublishingRecordInput {
  reason: string;
  effectiveDate?: string;
  channels?: PublishingDistributionChannel[];
}

export interface RepublishPublishingRecordInput {
  editionId: string;
  versionId: string;
  preflightResultId: string;
  selectedChannels?: PublishingDistributionChannel[];
  selectedArtifactRefs?: string[];
  reason?: string;
}

export interface RecordDistributionInput {
  channel: PublishingDistributionChannel;
  deliveryStatus?: PublishingDistributionStatus;
  targetDestination?: string;
  integrationReference?: string;
  selectedExportedArtifactRefs?: string[];
  externalReference?: string;
  notes?: string;
}

export interface UpdateDistributionStatusInput {
  deliveryStatus: PublishingDistributionStatus;
  externalReference?: string;
  notes?: string;
}

export interface LayoutPublicationRepository {
  createPlan(plan: LayoutPublicationPlan): Promise<LayoutPublicationPlan>;
  updatePlan(plan: LayoutPublicationPlan): Promise<LayoutPublicationPlan>;
  findPlanById(id: string, organizationId: string): Promise<LayoutPublicationPlan | null>;
  createPreflightResult(result: PublishingPreflightResult): Promise<PublishingPreflightResult>;
  findPreflightResultById(id: string, organizationId: string): Promise<PublishingPreflightResult | null>;
  createPublishingRecord(record: PublishingRecord): Promise<PublishingRecord>;
  updatePublishingRecord(record: PublishingRecord): Promise<PublishingRecord>;
  findPublishingRecordById(id: string, organizationId: string): Promise<PublishingRecord | null>;
  listPublishingRecords(publicationId: string, organizationId: string): Promise<PublishingRecord[]>;
  createDistributionRecord(record: PublishingDistributionRecord): Promise<PublishingDistributionRecord>;
  updateDistributionRecord(record: PublishingDistributionRecord): Promise<PublishingDistributionRecord>;
  findDistributionRecordById(
    id: string,
    organizationId: string
  ): Promise<PublishingDistributionRecord | null>;
  listDistributionRecords(
    publishingRecordId: string,
    organizationId: string
  ): Promise<PublishingDistributionRecord[]>;
  appendAuditEvent(event: LayoutPublicationAuditEvent): Promise<void>;
}
