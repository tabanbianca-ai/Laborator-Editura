export type PublicCatalogItemType =
  | "BOOK"
  | "MAGAZINE"
  | "ARTICLE"
  | "AUDIOBOOK"
  | "VIDEO"
  | "LOCALIZED_MEDIA";

export type PublicAvailabilityStatus =
  | "DRAFT"
  | "PENDING_RELEASE_APPROVAL"
  | "PUBLIC"
  | "REJECTED"
  | "UNAVAILABLE";

export type PublicReleaseApprovalStatus =
  | "PENDING_HUMAN_APPROVAL"
  | "APPROVED"
  | "REJECTED";

export type PublicPortalAuditAction =
  | "PUBLIC_CATALOG_ITEM_CREATED"
  | "PUBLIC_DISTRIBUTION_RECORD_CREATED"
  | "PUBLIC_RELEASE_APPROVED"
  | "PUBLIC_RELEASE_REJECTED";

export interface PublicPortalActor {
  userId: string;
  organizationId: string;
  roles?: string[];
  permissions?: string[];
}

export interface PublicRightsMetadata {
  license?: string;
  sourceAttribution?: string;
  copyrightStatus?: string;
  usageRestrictions?: string[];
}

export interface PublicReaderAccessMetadata {
  onlineReadingAvailable: boolean;
  downloadableFormats: Array<"PDF" | "EPUB" | "MOBI" | "HTML" | "JSON_MASTER">;
  pdfRef?: string;
  epubRef?: string;
  mobiRef?: string;
  audioChapterRefs: string[];
  videoRefs: string[];
  localizedMediaRefs: string[];
  fileHostingIntegration: "NOT_CONFIGURED";
}

export interface PublicCatalogMetadata {
  title: string;
  subtitle?: string;
  description?: string;
  authors: string[];
  translators?: Array<{
    translatorId?: string;
    translatorName?: string;
    originalAuthorAttributionPreserved: true;
  }>;
  language: string;
  originalLanguage?: string;
  originalLocale?: string;
  authoringLanguage?: string;
  authoringLocale?: string;
  targetLanguage?: string;
  targetLocale?: string;
  edition?: string;
  keywords: string[];
  originalSourceReferences: string[];
}

export interface PublicPortalAuditTrailItem {
  id: string;
  action: PublicPortalAuditAction;
  actorId: string;
  at: string;
  version: number;
  details?: object;
}

export interface PublicCatalogItem {
  id: string;
  organizationId: string;
  projectId?: string;
  documentId?: string;
  layoutPublicationPlanId?: string;
  multimediaProjectId?: string;
  mediaLocalizationProjectId?: string;
  itemType: PublicCatalogItemType;
  metadata: PublicCatalogMetadata;
  readerAccess: PublicReaderAccessMetadata;
  rights: PublicRightsMetadata;
  availabilityStatus: PublicAvailabilityStatus;
  releaseApprovalStatus: PublicReleaseApprovalStatus;
  humanApprovalRequired: true;
  paymentIntegration: "NOT_CONFIGURED";
  cdnIntegration: "NOT_CONFIGURED";
  distributionRecordIds: string[];
  auditTrail: PublicPortalAuditTrailItem[];
  version: number;
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicDistributionRecord {
  id: string;
  organizationId: string;
  publicCatalogItemId: string;
  publicationChannels: string[];
  availabilityStatus: PublicAvailabilityStatus;
  releaseDate?: string;
  editionStatus?: string;
  languageVariants: string[];
  localeVariants?: string[];
  printOnDemandMetadata: Record<string, string>;
  paymentIntegration: "NOT_CONFIGURED";
  fileHostingIntegration: "NOT_CONFIGURED";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface PublicAccessRecord {
  id: string;
  organizationId: string;
  publicCatalogItemId: string;
  accessType: "ONLINE_READING" | "DOWNLOAD" | "AUDIO_STREAM" | "VIDEO_STREAM" | "LOCALIZED_MEDIA";
  format?: "PDF" | "EPUB" | "MOBI" | "HTML" | "JSON_MASTER" | "AUDIO" | "VIDEO";
  artifactRef?: string;
  publicUrl?: string;
  fileHostingIntegration: "NOT_CONFIGURED";
  createdBy: string;
  createdAt: string;
}

export interface PublicPortalAuditEvent {
  id: string;
  organizationId: string;
  publicCatalogItemId?: string;
  publicDistributionRecordId?: string;
  action: PublicPortalAuditAction;
  actorId: string;
  beforeState?: PublicCatalogItem | PublicDistributionRecord;
  afterState?: PublicCatalogItem | PublicDistributionRecord;
  createdAt: string;
}

export interface CreatePublicCatalogItemInput {
  projectId?: string;
  documentId?: string;
  layoutPublicationPlanId?: string;
  multimediaProjectId?: string;
  mediaLocalizationProjectId?: string;
  itemType: PublicCatalogItemType;
  metadata: PublicCatalogMetadata;
  readerAccess?: Partial<PublicReaderAccessMetadata>;
  rights?: PublicRightsMetadata;
}

export interface CreatePublicDistributionRecordInput {
  publicationChannels?: string[];
  availabilityStatus?: PublicAvailabilityStatus;
  releaseDate?: string;
  editionStatus?: string;
  languageVariants?: string[];
  localeVariants?: string[];
  printOnDemandMetadata?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface PublicPortalRepository {
  createCatalogItem(item: PublicCatalogItem): Promise<PublicCatalogItem>;
  updateCatalogItem(item: PublicCatalogItem): Promise<PublicCatalogItem>;
  findCatalogItemById(id: string, organizationId: string): Promise<PublicCatalogItem | null>;
  findCatalogItemPublicById(id: string): Promise<PublicCatalogItem | null>;
  listPublicCatalogItems(): Promise<PublicCatalogItem[]>;
  createDistributionRecord(record: PublicDistributionRecord): Promise<PublicDistributionRecord>;
  createAccessRecord(record: PublicAccessRecord): Promise<PublicAccessRecord>;
  appendAuditEvent(event: PublicPortalAuditEvent): Promise<void>;
}
