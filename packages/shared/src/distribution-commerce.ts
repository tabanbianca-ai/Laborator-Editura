export const DISTRIBUTION_COMMERCE_SCHEMA_VERSION = "1.0.0" as const;

export type DistributionStatus =
  | "ACCEPTED"
  | "AVAILABLE"
  | "FAILED"
  | "NOT_READY"
  | "READY"
  | "REJECTED"
  | "SUBMITTED"
  | "SUBMITTING"
  | "SUSPENDED"
  | "UNDER_REVIEW"
  | "WITHDRAWING"
  | "WITHDRAWN";

export type DistributionChannelType =
  | "AUDIO_PLATFORM"
  | "DIRECT_DOWNLOAD"
  | "EXTERNAL_STORE"
  | "INSTITUTIONAL"
  | "OWN_PUBLIC_LIBRARY"
  | "OWN_STORE"
  | "PRINT_ON_DEMAND"
  | "VIDEO_PLATFORM";

export type DistributionConnectorStatus =
  | "DISABLED"
  | "ERROR"
  | "NOT_CONFIGURED"
  | "READY"
  | "SUSPENDED";

export type DistributionReadinessStatus =
  | "BLOCKED"
  | "CHANNEL_INCOMPATIBLE"
  | "EXPIRED_RIGHTS"
  | "FORMAT_UNSUPPORTED"
  | "MISSING_METADATA"
  | "MISSING_RIGHTS"
  | "READY_FOR_DISTRIBUTION"
  | "TERRITORY_BLOCKED";

export type PublicPublicationType =
  | "ACCESSIBLE_PUBLICATION"
  | "ARTICLE"
  | "AUDIOBOOK"
  | "BOOK"
  | "CHILDREN_PUBLICATION"
  | "EBOOK"
  | "MAGAZINE"
  | "VIDEO";

export type ReaderAnnotationType = "BOOKMARK" | "HIGHLIGHT" | "PRIVATE_NOTE";

export type ReaderAccessType =
  | "ADMIN_GRANTED"
  | "FREE"
  | "INSTITUTIONAL"
  | "PROMOTIONAL"
  | "PURCHASED"
  | "SUBSCRIPTION";

export type ProductType =
  | "AUDIOBOOK"
  | "BUNDLE"
  | "DIGITAL_SUBSCRIPTION"
  | "EBOOK"
  | "FREE_PUBLICATION"
  | "MAGAZINE"
  | "PRINT_BOOK";

export type CommercialStatus =
  | "ACTIVE"
  | "ARCHIVED"
  | "DRAFT"
  | "EXPIRED"
  | "SUSPENDED";

export type TaxBehavior = "EXCLUSIVE" | "INCLUSIVE" | "NOT_APPLICABLE";

export type OrderStatus =
  | "CANCELLED"
  | "COMPLETED"
  | "CREATED"
  | "PAID"
  | "PARTIALLY_REFUNDED"
  | "PAYMENT_FAILED"
  | "PENDING_PAYMENT"
  | "REFUNDED";

export type PaymentStatus =
  | "AUTHORIZED"
  | "CANCELLED"
  | "CAPTURED"
  | "CREATED"
  | "FAILED"
  | "PROCESSING"
  | "REFUNDED";

export type RefundStatus = "CANCELLED" | "COMPLETED" | "CREATED" | "FAILED" | "PROCESSING";

export type EntitlementStatus = "ACTIVE" | "EXPIRED" | "REVOKED" | "SUSPENDED";

export type PublicationVersionPolicy =
  | "ALL_FUTURE_UPDATES"
  | "EXACT_VERSION_ONLY"
  | "LATEST_COMPATIBLE_VERSION";

export type PromotionType =
  | "BUNDLE"
  | "COUPON"
  | "DISCOUNT"
  | "PROMOTIONAL_ENTITLEMENT"
  | "TEMPORARY_FREE_ACCESS";

export type ReconciliationResultStatus =
  | "IN_SYNC"
  | "MANUAL_REVIEW_REQUIRED"
  | "METADATA_DIVERGED"
  | "MISSING_EXTERNAL_PRODUCT"
  | "MISSING_INTERNAL_MAPPING"
  | "STATUS_DIVERGED";

export type WithdrawalReason =
  | "CHANNEL_REQUIREMENT"
  | "CRITICAL_CONTENT_ERROR"
  | "EDITORIAL_DECISION"
  | "LEGAL_REQUEST"
  | "OTHER"
  | "PRIVACY_ISSUE"
  | "RIGHTS_EXPIRED"
  | "RIGHTS_REVOKED"
  | "SECURITY_ISSUE"
  | "SUPERSEDED";

export type ReaderWithdrawalPolicy =
  | "KEEP_EXISTING_ACCESS"
  | "MANUAL_REVIEW"
  | "REMOVE_ACCESS"
  | "REPLACE_WITH_NEW_VERSION";

export type LegacyPublicResourceClassification =
  | "CANONICAL"
  | "EXTERNAL_ONLY"
  | "LEGACY_PRODUCT"
  | "LEGACY_PUBLIC_PAGE"
  | "MAPPING_REQUIRED"
  | "RIGHTS_REVIEW_REQUIRED"
  | "UNKNOWN";

export type PublicRoute =
  | "GET /public/v1/catalog"
  | "GET /public/v1/publications/{slug}"
  | "GET /reader/v1/library"
  | "GET /reader/v1/publications/{id}"
  | "POST /store/v1/orders";

export type DistributionMetricName =
  | "checkout_success_rate"
  | "distribution_failure_rate"
  | "distribution_submit_count"
  | "distribution_sync_lag"
  | "download_failure_rate"
  | "entitlement_failure_rate"
  | "external_channel_errors"
  | "payment_failure_rate"
  | "withdrawal_failure_rate";

export type DistributionAuditEventName =
  | "DistributionAccepted"
  | "DistributionAvailable"
  | "DistributionCreated"
  | "DistributionRejected"
  | "DistributionSubmitted"
  | "EntitlementGranted"
  | "EntitlementRevoked"
  | "ExternalMetadataDiverged"
  | "OrderCreated"
  | "PaymentConfirmed"
  | "PaymentFailed"
  | "PublicationDownloaded"
  | "PublicationSuperseded"
  | "PublicationWithdrawalRequested"
  | "PublicationWithdrawn"
  | "RefundCreated";

export interface CanonicalDistribution {
  id: string;
  organizationId: string;
  publicationId: string;
  publicationPackageId: string;
  publicationVersion: string;
  channelId: string;
  language: string;
  territory: string;
  format: string;
  status: DistributionStatus;
  channelProductId?: string;
  submittedAt?: string;
  acceptedAt?: string;
  availableAt?: string;
  withdrawnAt?: string;
  lastSynchronizedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface DistributionChannelRegistryEntry {
  id: string;
  organizationId: string;
  canonicalName: string;
  channelType: DistributionChannelType;
  provider: string;
  supportedFormats: string[];
  supportedLanguages: string[];
  supportedTerritories: string[];
  authenticationProfile: "NOT_CONFIGURED" | "CONFIGURED" | "DISABLED";
  metadataProfile: Record<string, unknown>;
  rightsRequirements: string[];
  commercialCapabilities: string[];
  connectorStatus: DistributionConnectorStatus;
  owner: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface DistributionReadinessInput {
  publicationPackageApproved: boolean;
  integrityValid: boolean;
  rightsValid: boolean;
  territoryAllowed: boolean;
  languageAllowed: boolean;
  formatAllowed: boolean;
  channelCompatible: boolean;
  metadataComplete: boolean;
  identifiersComplete: boolean;
  commercialAvailabilityValid: boolean;
  distributionApprovalGranted: boolean;
  rightsExpired?: boolean;
}

export interface DistributionReadinessResult {
  status: DistributionReadinessStatus;
  ready: boolean;
  blockers: DistributionReadinessStatus[];
}

export interface PublicCatalogProjection {
  id: string;
  organizationId: string;
  publicationId: string;
  workId: string;
  editionId: string;
  visibility: "PRIVATE" | "PUBLIC";
  publicationStatus: "PUBLISHED" | "WITHDRAWN" | "DRAFT";
  rightsValid: boolean;
  availability: "AVAILABLE" | "UNAVAILABLE" | "WITHDRAWN";
  itemType: PublicPublicationType;
  presentation: PublicPresentationModel;
  createdAt: string;
  updatedAt: string;
}

export interface PublicPresentationModel {
  publicItemId: string;
  workId: string;
  editionId: string;
  publicationId: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  contributors: PublicContributor[];
  language: string;
  originalLanguage?: string;
  cover?: PublicCover;
  publicationDate?: string;
  categories: string[];
  keywords: string[];
  formats: string[];
  accessibility: Record<string, unknown>;
  availability: string;
  commercialOffer?: PublicCommercialOfferSummary;
  originalEditionReference?: string;
}

export interface PublicContributor {
  name: string;
  role: "AUTHOR" | "EDITOR" | "ILLUSTRATOR" | "NARRATOR" | "OTHER" | "TRANSLATOR";
}

export interface PublicCover {
  uri: string;
  altText?: string;
  checksum?: string;
}

export interface PublicCommercialOfferSummary {
  productId: string;
  offerId: string;
  territory: string;
  currency: string;
  price: number;
  taxBehavior: TaxBehavior;
}

export interface PublicSlug {
  id: string;
  organizationId: string;
  resourceId: string;
  locale: string;
  slug: string;
  canonical: boolean;
  createdAt: string;
  deprecatedAt?: string;
  redirectTo?: string;
}

export interface PublicSearchFilters {
  title?: string;
  author?: string;
  translator?: string;
  language?: string;
  category?: string;
  keyword?: string;
  year?: number;
  publicationType?: PublicPublicationType;
  availability?: string;
  accessibility?: string;
}

export interface DigitalReaderCapabilities {
  supportsEpub: boolean;
  supportsHtml: boolean;
  supportsStructuredText: boolean;
  chapterNavigation: boolean;
  tableOfContents: boolean;
  bookmarks: boolean;
  resumeReading: boolean;
  inBookSearch: boolean;
  fontAdjustment: boolean;
  textSizeAdjustment: boolean;
  lineSpacingAdjustment: boolean;
  contrastAdjustment: boolean;
  darkMode: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

export interface ReadingProgress {
  id: string;
  organizationId: string;
  identityId: string;
  publicationId: string;
  publicationVersion: string;
  location: string;
  percentage: number;
  updatedAt: string;
  deviceReference?: string;
}

export interface ReaderAnnotation {
  id: string;
  organizationId: string;
  identityId: string;
  publicationId: string;
  publicationVersion: string;
  contentLocator: string;
  annotationType: ReaderAnnotationType;
  content?: string;
  createdAt: string;
  updatedAt: string;
  partOfEditorialMasterDocument: false;
}

export interface ReaderLibraryEntry {
  id: string;
  organizationId: string;
  identityId: string;
  publicationId: string;
  accessType: ReaderAccessType;
  acquiredAt: string;
  expiresAt?: string;
  status: EntitlementStatus;
  sourceOrderId?: string;
  entitlementId: string;
}

export interface Product {
  id: string;
  organizationId: string;
  publicationId: string;
  canonicalName: string;
  productType: ProductType;
  status: CommercialStatus;
  availableFormats: string[];
  territories: string[];
  currencyProfile: string;
  taxProfile: string;
  commercialPolicy: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  organizationId: string;
  productId: string;
  territory: string;
  currency: string;
  price: number;
  taxBehavior: TaxBehavior;
  validFrom: string;
  validUntil?: string;
  discountPolicy?: Record<string, unknown>;
  status: CommercialStatus;
}

export interface TaxProfile {
  id: string;
  organizationId: string;
  territory: string;
  currency: string;
  taxName?: string;
  taxRate?: number;
  configurableRules: Record<string, unknown>;
  provider?: string;
}

export interface Order {
  id: string;
  organizationId: string;
  identityId: string;
  currency: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  idempotencyKey: string;
  createdAt: string;
  completedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface OrderItem {
  id: string;
  organizationId: string;
  orderId: string;
  productId: string;
  publicationId: string;
  publicationVersion: string;
  offerId: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
  accessEntitlementId?: string;
}

export interface Payment {
  id: string;
  organizationId: string;
  orderId: string;
  provider: string;
  providerPaymentId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  initiatedAt: string;
  confirmedAt?: string;
  failureCode?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentWebhookEvent {
  id: string;
  organizationId: string;
  provider: string;
  providerEventId: string;
  paymentId?: string;
  verified: boolean;
  idempotencyKey: string;
  processedAt?: string;
  replaySafe: true;
}

export interface Entitlement {
  id: string;
  organizationId: string;
  identityId: string;
  publicationId: string;
  publicationVersionPolicy: PublicationVersionPolicy;
  accessType: ReaderAccessType;
  source: "ADMIN_GRANT" | "FREE_PUBLICATION" | "ORDER" | "PROMOTION" | "SUBSCRIPTION";
  sourceOrderId?: string;
  validFrom: string;
  validUntil?: string;
  status: EntitlementStatus;
}

export interface DownloadAuthorization {
  id: string;
  organizationId: string;
  entitlementId: string;
  identityId: string;
  publicationId: string;
  publicationVersion: string;
  format: string;
  temporaryUrl: string;
  expiresAt: string;
  rateLimitKey: string;
  auditEventId?: string;
}

export interface Promotion {
  id: string;
  organizationId: string;
  promotionType: PromotionType;
  productId?: string;
  offerId?: string;
  code?: string;
  validFrom: string;
  validUntil?: string;
  status: CommercialStatus;
  metadata?: Record<string, unknown>;
}

export interface DistributionConnectorContract {
  channelId: string;
  validatePublication: "validatePublication()";
  validateMetadata: "validateMetadata()";
  submit: "submit()";
  updateMetadata: "updateMetadata()";
  queryStatus: "queryStatus()";
  withdraw: "withdraw()";
  reconcile: "reconcile()";
  editorialLogicAllowedInAdapter: false;
  externalProviderIsCanonicalSource: false;
}

export interface ExternalProductMapping {
  id: string;
  organizationId: string;
  distributionId: string;
  channelId: string;
  internalPublicationId: string;
  externalProductId: string;
  externalVersion?: string;
  lastSynchronizedAt?: string;
  status: string;
}

export interface DistributionSyncRecord {
  id: string;
  organizationId: string;
  distributionId: string;
  externalMappingId?: string;
  internalMetadataSnapshot: Record<string, unknown>;
  submittedMetadataSnapshot: Record<string, unknown>;
  acceptedMetadataSnapshot?: Record<string, unknown>;
  publicationVersion: string;
  externalStatus?: string;
  errors: string[];
  divergences: string[];
  lastSynchronizedAt: string;
  silentOverwriteAllowed: false;
}

export interface ReconciliationJob {
  id: string;
  organizationId: string;
  distributionId: string;
  channelId: string;
  result: ReconciliationResultStatus;
  checkedAt: string;
  findings: string[];
  manualReviewRequired: boolean;
}

export interface PublicationWithdrawalRequest {
  id: string;
  organizationId: string;
  publicationId: string;
  reason: WithdrawalReason;
  readerPolicy: ReaderWithdrawalPolicy;
  impactAnalysis: Record<string, unknown>;
  rightsApprovalRequired: boolean;
  editorialApprovalRequired: boolean;
  legalApprovalRequired: boolean;
  disableNewAvailability: boolean;
  withdrawInternalCatalog: boolean;
  withdrawExternalChannels: boolean;
  preserveEvidence: true;
  deletesPublication: false;
  requestedBy: string;
  requestedAt: string;
  completedAt?: string;
}

export interface PublicationSupersedingRecord {
  id: string;
  organizationId: string;
  previousPublicationId: string;
  replacementPublicationId: string;
  reason: string;
  supersededAt: string;
  readerPolicy: ReaderWithdrawalPolicy;
  channelStatuses: Record<string, string>;
}

export interface Refund {
  id: string;
  organizationId: string;
  paymentId: string;
  orderId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  providerReference?: string;
  createdAt: string;
  completedAt?: string;
  entitlementPolicy: ReaderWithdrawalPolicy;
}

export interface PublicAnalyticsEvent {
  id: string;
  organizationId: string;
  eventType:
    | "CATALOG_VIEW"
    | "CHECKOUT_CONVERSION"
    | "DOWNLOAD"
    | "ERROR"
    | "PERFORMANCE"
    | "PUBLICATION_OPEN"
    | "READER_FEATURE_USED";
  publicationId?: string;
  operationalAnalyticsOnly: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface DistributionAuditEvent {
  id: string;
  organizationId: string;
  action: DistributionAuditEventName;
  actorId: string;
  distributionId?: string;
  orderId?: string;
  paymentId?: string;
  entitlementId?: string;
  withdrawalRequestId?: string;
  beforeState?: object;
  afterState?: object;
  createdAt: string;
}

export function evaluateDistributionReadiness(
  input: DistributionReadinessInput
): DistributionReadinessResult {
  const blockers: DistributionReadinessStatus[] = [];

  if (!input.publicationPackageApproved || !input.integrityValid) {
    blockers.push("BLOCKED");
  }

  if (!input.rightsValid) {
    blockers.push(input.rightsExpired ? "EXPIRED_RIGHTS" : "MISSING_RIGHTS");
  }

  if (!input.territoryAllowed) {
    blockers.push("TERRITORY_BLOCKED");
  }

  if (!input.formatAllowed) {
    blockers.push("FORMAT_UNSUPPORTED");
  }

  if (!input.channelCompatible || !input.languageAllowed) {
    blockers.push("CHANNEL_INCOMPATIBLE");
  }

  if (!input.metadataComplete || !input.identifiersComplete) {
    blockers.push("MISSING_METADATA");
  }

  if (!input.commercialAvailabilityValid || !input.distributionApprovalGranted) {
    blockers.push("BLOCKED");
  }

  const uniqueBlockers = [...new Set(blockers)];

  return {
    status: uniqueBlockers[0] ?? "READY_FOR_DISTRIBUTION",
    ready: uniqueBlockers.length === 0,
    blockers: uniqueBlockers
  };
}

export function isVisibleInPublicCatalog(
  projection: Pick<
    PublicCatalogProjection,
    "availability" | "publicationStatus" | "rightsValid" | "visibility"
  >
): boolean {
  return (
    projection.visibility === "PUBLIC" &&
    projection.publicationStatus === "PUBLISHED" &&
    projection.rightsValid &&
    projection.availability === "AVAILABLE"
  );
}

export function sanitizePublicPresentation(
  presentation: PublicPresentationModel
): PublicPresentationModel {
  return JSON.parse(JSON.stringify(presentation)) as PublicPresentationModel;
}

export function calculateOrderTotals(input: {
  quantity: number;
  unitPrice: number;
  tax: number;
}): Pick<OrderItem, "quantity" | "tax" | "total" | "unitPrice"> {
  const quantity = Math.max(1, Math.trunc(input.quantity));
  const unitPrice = Math.max(0, input.unitPrice);
  const tax = Math.max(0, input.tax);

  return {
    quantity,
    unitPrice,
    tax,
    total: quantity * unitPrice + tax
  };
}

export function canGrantEntitlementAfterPayment(
  order: Pick<Order, "paymentStatus" | "status">,
  payment: Pick<Payment, "status">
): boolean {
  return (
    order.status === "PAID" &&
    order.paymentStatus === "CAPTURED" &&
    payment.status === "CAPTURED"
  );
}

export function canAuthorizeDownload(
  entitlement: Pick<Entitlement, "status" | "validFrom" | "validUntil">,
  requestedAt: string
): boolean {
  if (entitlement.status !== "ACTIVE") {
    return false;
  }

  const requestedTime = Date.parse(requestedAt);
  const validFrom = Date.parse(entitlement.validFrom);
  const validUntil = entitlement.validUntil === undefined ? Number.POSITIVE_INFINITY : Date.parse(entitlement.validUntil);

  return requestedTime >= validFrom && requestedTime <= validUntil;
}

export function isPaymentWebhookProcessable(
  event: Pick<PaymentWebhookEvent, "processedAt" | "verified">
): boolean {
  return event.verified && event.processedAt === undefined;
}

export function createCommercialIdempotencyKey(input: {
  identityId: string;
  operation: string;
  productId?: string;
  offerId?: string;
  orderId?: string;
  providerEventId?: string;
}): string {
  return stableStringify(input);
}

export function externalProviderCanBecomeCanonicalSource(
  connector: Pick<DistributionConnectorContract, "externalProviderIsCanonicalSource">
): false {
  return connector.externalProviderIsCanonicalSource;
}

export function classifyLegacyPublicResource(
  input: Partial<{
    hasCanonicalPublication: boolean;
    hasExternalOnlyRecord: boolean;
    hasRightsEvidence: boolean;
    hasMapping: boolean;
    isProduct: boolean;
    isPublicPage: boolean;
  }>
): LegacyPublicResourceClassification {
  if (input.hasCanonicalPublication) {
    return "CANONICAL";
  }

  if (input.hasExternalOnlyRecord) {
    return "EXTERNAL_ONLY";
  }

  if (!input.hasRightsEvidence) {
    return "RIGHTS_REVIEW_REQUIRED";
  }

  if (!input.hasMapping) {
    return "MAPPING_REQUIRED";
  }

  if (input.isProduct) {
    return "LEGACY_PRODUCT";
  }

  if (input.isPublicPage) {
    return "LEGACY_PUBLIC_PAGE";
  }

  return "UNKNOWN";
}

function stableStringify(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sortValue(item));
  }

  if (value !== null && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce<Record<string, unknown>>((record, key) => {
        record[key] = sortValue((value as Record<string, unknown>)[key]);
        return record;
      }, {});
  }

  return value;
}
