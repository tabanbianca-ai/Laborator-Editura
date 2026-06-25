export type CommerceEditionType =
  | "HARDCOVER"
  | "PAPERBACK"
  | "EPUB"
  | "MOBI"
  | "PDF"
  | "AUDIOBOOK"
  | "VIDEO_EDITION";

export type CommerceAvailabilityStatus =
  | "DRAFT"
  | "PENDING_COMMERCIAL_APPROVAL"
  | "AVAILABLE"
  | "REJECTED"
  | "UNAVAILABLE"
  | "OUT_OF_STOCK";

export type CommerceApprovalStatus =
  | "PENDING_HUMAN_APPROVAL"
  | "APPROVED"
  | "REJECTED";

export type CommercePrintRegion = "EUROPEAN" | "AMERICAN";

export type CommercePrintTrimSize = "A5" | "B5" | "A4" | "5x8" | "6x9" | "8.5x11";

export type CommerceAuditAction =
  | "COMMERCE_EDITION_CREATED"
  | "COMMERCE_DISTRIBUTION_CREATED"
  | "COMMERCE_EDITION_APPROVED"
  | "COMMERCE_EDITION_REJECTED";

export interface CommerceActor {
  userId: string;
  organizationId: string;
  roles?: string[];
  permissions?: string[];
}

export interface CommerceEditionMetadata {
  isbn?: string;
  editionNumber?: string;
  originalEditionReference?: string;
  originalLanguage: string;
  originalLocale?: string;
  authoringLanguage?: string;
  authoringLocale?: string;
  targetLanguage?: string;
  targetLocale?: string;
  firstPublicationYear?: number;
}

export interface CommercePrintProfile {
  id: string;
  organizationId: string;
  commerceEditionId: string;
  region: CommercePrintRegion;
  trimSize: CommercePrintTrimSize;
  bleed?: string;
  margins?: string;
  coverSizes?: string[];
  spineWidth?: string;
  paperTypes?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommercePricing {
  price?: number;
  currency?: string;
  stock?: number;
  availability: CommerceAvailabilityStatus;
  royaltyPercentages: Record<string, number>;
  distributionChannels: string[];
}

export interface CommercePrintOnDemandMetadata {
  provider?: string;
  region?: string;
  status?: string;
  printProfileId?: string;
}

export interface CommerceAuditTrailItem {
  id: string;
  action: CommerceAuditAction;
  actorId: string;
  at: string;
  version: number;
  details?: object;
}

export interface CommerceEdition {
  id: string;
  organizationId: string;
  projectId?: string;
  documentId?: string;
  publicCatalogItemId?: string;
  title: string;
  language: string;
  targetLanguage: string;
  targetLocale?: string;
  editionType: CommerceEditionType;
  metadata: CommerceEditionMetadata;
  printProfile: CommercePrintProfile;
  pricing: CommercePricing;
  printOnDemand: CommercePrintOnDemandMetadata;
  distributionChannelIds: string[];
  availabilityStatus: CommerceAvailabilityStatus;
  approvalStatus: CommerceApprovalStatus;
  humanApprovalRequired: true;
  paymentProviderIntegration: "NOT_CONFIGURED";
  printProviderIntegration: "METADATA_ONLY";
  auditTrail: CommerceAuditTrailItem[];
  version: number;
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommerceDistributionChannel {
  id: string;
  organizationId: string;
  commerceEditionId: string;
  channelName: string;
  channelType?: string;
  availability: CommerceAvailabilityStatus;
  price?: number;
  currency?: string;
  stock?: number;
  royaltyPercentages: Record<string, number>;
  region?: string;
  metadata?: Record<string, unknown>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommerceAuditEvent {
  id: string;
  organizationId: string;
  commerceEditionId?: string;
  commerceDistributionChannelId?: string;
  commercePrintProfileId?: string;
  action: CommerceAuditAction;
  actorId: string;
  beforeState?: CommerceEdition | CommerceDistributionChannel;
  afterState?: CommerceEdition | CommerceDistributionChannel;
  createdAt: string;
}

export interface CreateCommerceEditionInput {
  projectId?: string;
  documentId?: string;
  publicCatalogItemId?: string;
  title: string;
  language: string;
  editionType: CommerceEditionType;
  metadata: CommerceEditionMetadata;
  printProfile?: Partial<CommercePrintProfile>;
  pricing?: Partial<CommercePricing>;
  printOnDemand?: CommercePrintOnDemandMetadata;
}

export interface CreateCommerceDistributionInput {
  channelName: string;
  channelType?: string;
  availability?: CommerceAvailabilityStatus;
  price?: number;
  currency?: string;
  stock?: number;
  royaltyPercentages?: Record<string, number>;
  region?: string;
  metadata?: Record<string, unknown>;
}

export interface CommerceRepository {
  createEdition(edition: CommerceEdition): Promise<CommerceEdition>;
  updateEdition(edition: CommerceEdition): Promise<CommerceEdition>;
  findEditionById(id: string, organizationId: string): Promise<CommerceEdition | null>;
  listPublicStoreEditions(): Promise<CommerceEdition[]>;
  createDistributionChannel(channel: CommerceDistributionChannel): Promise<CommerceDistributionChannel>;
  createPrintProfile(profile: CommercePrintProfile): Promise<CommercePrintProfile>;
  appendAuditEvent(event: CommerceAuditEvent): Promise<void>;
}
