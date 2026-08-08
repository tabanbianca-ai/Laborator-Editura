export const PUBLISHING_ENGINE_SCHEMA_VERSION = "1.0.0" as const;

export type PublicationOutputFormat =
  | "ACCESSIBLE_PDF"
  | "EPUB"
  | "HTML"
  | "PDF_DIGITAL"
  | "PDF_PRINT"
  | "PRINT";

export type PublicationStatus =
  | "DRAFT"
  | "READY_FOR_BUILD"
  | "BUILDING"
  | "BUILD_FAILED"
  | "BUILT"
  | "VALIDATING"
  | "VALIDATION_FAILED"
  | "READY_FOR_REVIEW"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "SUPERSEDED"
  | "WITHDRAWN"
  | "ARCHIVED";

export type PublicationBuildStatus =
  | "REQUESTED"
  | "QUEUED"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "RETRYING";

export type PublicationProfileStatus = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export type FontRegistryStatus =
  | "BLOCKED"
  | "LICENSE_UNKNOWN"
  | "RESTRICTED"
  | "VALIDATED"
  | "ARCHIVED";

export type FontEmbeddingPolicy =
  | "EMBED_ALLOWED"
  | "SUBSET_ALLOWED"
  | "PRINT_ONLY"
  | "NO_EMBEDDING"
  | "UNKNOWN";

export type StructuralStyle =
  | "AUTHOR"
  | "BIBLIOGRAPHY"
  | "BLOCK_QUOTE"
  | "BODY"
  | "CAPTION"
  | "CHAPTER_TITLE"
  | "ENDNOTE"
  | "FOOTNOTE"
  | "LIST"
  | "PART_TITLE"
  | "POETRY"
  | "SECTION_TITLE"
  | "SUBTITLE"
  | "TABLE"
  | "TITLE";

export type ValidationStage =
  | "ACCESSIBILITY"
  | "FORMAT"
  | "HUMAN_REVIEW"
  | "INTEGRITY"
  | "METADATA"
  | "RIGHTS"
  | "STRUCTURAL";

export type ValidationSeverity = "INFO" | "WARNING" | "ERROR" | "BLOCKING";

export type ValidationResultStatus = "PASS" | "PASS_WITH_WARNINGS" | "FAIL";

export type PrintProviderProfileType =
  | "AMAZON_KDP"
  | "CUSTOM"
  | "GENERIC_PRINT"
  | "INGRAM"
  | "LOCAL_PRINTER"
  | "PRINT_ON_DEMAND";

export type BuildQueueStatus =
  | "CANCELLED"
  | "COMPLETED"
  | "FAILED"
  | "QUEUED"
  | "RETRYING"
  | "RUNNING";

export type LegacyOutputClassification =
  | "CANONICAL_BUILD"
  | "LEGACY_OUTPUT"
  | "MASTER_VERSION_UNKNOWN"
  | "RIGHTS_UNKNOWN"
  | "SOURCE_UNKNOWN"
  | "SUPERSEDED"
  | "VALIDATION_UNKNOWN";

export type PublishingAuditEventName =
  | "LibraryPublicationLinked"
  | "PublicationApproved"
  | "PublicationBuildCompleted"
  | "PublicationBuildFailed"
  | "PublicationBuildRequested"
  | "PublicationBuildStarted"
  | "PublicationCreated"
  | "PublicationMarkedOutdated"
  | "PublicationPackageCreated"
  | "PublicationReadyForReview"
  | "PublicationRegenerated"
  | "PublicationRejected"
  | "PublicationValidationFailed";

export type PublicationPermission =
  | "publishing.publication.create"
  | "publishing.build.execute"
  | "publishing.build.view"
  | "publishing.layout.manage"
  | "publishing.validation.run"
  | "publishing.publication.review"
  | "publishing.publication.approve"
  | "publishing.publication.publish";

export interface PublicationSourceSnapshot {
  canonicalWorkId: string;
  canonicalEditionId: string;
  approvedMasterDocumentVersionId: string;
  approvedMetadataVersionId: string;
  validatedRightsRecordId: string;
  publicationConfigurationId: string;
  workflowApprovalId?: string;
  sourceOfTruth:
    "CANONICAL_WORK_APPROVED_EDITION_APPROVED_MASTER_DOCUMENT_APPROVED_METADATA_VALIDATED_RIGHTS";
  derivedOutputsCanBecomeMaster: false;
}

export interface CanonicalPublication {
  id: string;
  organizationId: string;
  projectId: string;
  documentId?: string;
  libraryPublicationId?: string;
  title: string;
  language: string;
  locale?: string;
  status: PublicationStatus;
  sourceSnapshot: PublicationSourceSnapshot;
  publicationProfileId: string;
  layoutProfileId: string;
  typographyProfileId?: string;
  identifiers: PublicationIdentifier[];
  outputFormats: PublicationOutputFormat[];
  latestBuildId?: string;
  approvedBuildId?: string;
  publicVisibility: "NOT_PUBLIC" | "READY_FOR_PUBLICATION" | "PUBLIC" | "WITHDRAWN";
  approvalSeparateFromPublicVisibility: true;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface PublicationIdentifier {
  type: "DOI" | "INTERNAL" | "ISBN" | "ISSN";
  value: string;
  assignedAt?: string;
  assignedBy?: string;
}

export interface PublicationBuild {
  id: string;
  organizationId: string;
  publicationId: string;
  buildNumber: number;
  status: PublicationBuildStatus;
  sourceSnapshot: PublicationSourceSnapshot;
  requestedFormats: PublicationOutputFormat[];
  inputFingerprint: string;
  dependencyFingerprint: DependencyFingerprint;
  idempotencyKey: string;
  locked: boolean;
  equivalentBuildId?: string;
  outputAssets: GeneratedPublicationAsset[];
  validationReportId?: string;
  packageId?: string;
  queuedAt?: string;
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  failureReason?: string;
  createdBy: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface PublicationProfile {
  id: string;
  organizationId: string;
  name: string;
  status: PublicationProfileStatus;
  outputFormats: PublicationOutputFormat[];
  metadataInjectionSource: "APPROVED_CANONICAL_METADATA";
  sourceDocumentModel: "SEMANTIC_MASTER_DOCUMENT";
  epubGeneratedFromSemanticMaster: true;
  pdfGeneratedFromSemanticMaster: true;
  htmlGeneratedFromSemanticMaster: true;
  printGeneratedFromSemanticMaster: true;
  accessibilityRequired: boolean;
  humanApprovalRequired: true;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface LayoutProfile {
  id: string;
  organizationId: string;
  name: string;
  pageSize: string;
  margins: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  bleed?: string;
  cropMarks: boolean;
  widowsOrphansControl: boolean;
  styleMappingIds: string[];
  printProviderProfileId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TypographyProfile {
  id: string;
  organizationId: string;
  name: string;
  primaryFontId: string;
  fallbackFontIds: string[];
  hyphenation: boolean;
  kerning: boolean;
  lineHeight: number;
  paragraphSpacing: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FontRegistryEntry {
  id: string;
  organizationId: string;
  familyName: string;
  styleName?: string;
  status: FontRegistryStatus;
  embeddingPolicy: FontEmbeddingPolicy;
  licenseReference?: string;
  sourceReference?: string;
  allowedFormats: PublicationOutputFormat[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface StructuralStyleMapping {
  id: string;
  organizationId: string;
  structuralStyle: StructuralStyle;
  layoutStyleName: string;
  epubElement?: string;
  htmlElement?: string;
  pdfStyleName?: string;
  accessibilityRole?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedPublicationAsset {
  id: string;
  organizationId: string;
  publicationId: string;
  buildId: string;
  format: PublicationOutputFormat;
  uri: string;
  mimeType: string;
  checksum: string;
  sizeBytes?: number;
  derivedFromMasterDocumentVersionId: string;
  modifiesMasterDocument: false;
  canBecomeMasterSource: false;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface ImagePublicationAsset {
  id: string;
  organizationId: string;
  publicationId: string;
  sourceAssetId: string;
  usage: "COVER" | "ILLUSTRATION" | "INLINE_IMAGE" | "THUMBNAIL";
  altText?: string;
  rightsRecordId?: string;
  derivatives: ImageDerivative[];
}

export interface ImageDerivative {
  id: string;
  imageAssetId: string;
  format: "JPG" | "PNG" | "WEBP" | "TIFF" | "SVG";
  width: number;
  height: number;
  dpi?: number;
  colorProfile?: string;
  checksum: string;
  uri: string;
}

export interface CoverModel {
  id: string;
  organizationId: string;
  publicationId: string;
  frontCoverAssetId: string;
  backCoverAssetId?: string;
  spineAssetId?: string;
  thumbnailAssetId?: string;
  titleText: string;
  contributorText: string[];
  rightsRecordId?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface PrintProviderProfile {
  id: string;
  organizationId: string;
  type: PrintProviderProfileType;
  name: string;
  trimSize: string;
  bleed: string;
  marginSafety: string;
  colorProfile?: string;
  coverRequirements?: string;
  paperType?: string;
  binding?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicationManifest {
  id: string;
  organizationId: string;
  publicationId: string;
  buildId: string;
  packageId?: string;
  formats: PublicationOutputFormat[];
  sourceSnapshot: PublicationSourceSnapshot;
  assets: Array<Pick<GeneratedPublicationAsset, "id" | "format" | "checksum" | "uri">>;
  createdAt: string;
}

export interface RightsManifest {
  id: string;
  organizationId: string;
  publicationId: string;
  buildId: string;
  rightsRecordIds: string[];
  allowedFormats: PublicationOutputFormat[];
  territories: string[];
  languages: string[];
  commercialDistributionAllowed: boolean;
  validated: boolean;
  blockingIssues: string[];
  createdAt: string;
}

export interface AccessibilityManifest {
  id: string;
  organizationId: string;
  publicationId: string;
  buildId: string;
  accessiblePdfIncluded: boolean;
  epubAccessibilityChecked: boolean;
  altTextCoverage: number;
  readingOrderChecked: boolean;
  navigationChecked: boolean;
  issues: PublicationValidationFinding[];
  createdAt: string;
}

export interface IntegrityManifestItem {
  assetId: string;
  uri: string;
  checksum: string;
  sizeBytes?: number;
  algorithm: "SHA256";
}

export interface IntegrityManifest {
  id: string;
  organizationId: string;
  publicationId: string;
  buildId: string;
  items: IntegrityManifestItem[];
  packageChecksum?: string;
  createdAt: string;
}

export interface PublicationPackage {
  id: string;
  organizationId: string;
  publicationId: string;
  buildId: string;
  immutable: true;
  sourceSnapshot: PublicationSourceSnapshot;
  publicationManifestId: string;
  rightsManifestId: string;
  accessibilityManifestId: string;
  integrityManifestId: string;
  assetIds: string[];
  packageUri?: string;
  packageChecksum?: string;
  createdBy: string;
  createdAt: string;
}

export interface PublicationValidationFinding {
  id: string;
  stage: ValidationStage;
  severity: ValidationSeverity;
  code: string;
  message: string;
  assetId?: string;
  blocking: boolean;
  remediation?: string;
}

export interface PublicationValidationReport {
  id: string;
  organizationId: string;
  publicationId: string;
  buildId: string;
  status: ValidationResultStatus;
  findings: PublicationValidationFinding[];
  stagesRun: ValidationStage[];
  validatedAt: string;
  validatedBy: string;
}

export interface PublicationPreview {
  id: string;
  organizationId: string;
  publicationId: string;
  buildId: string;
  format: PublicationOutputFormat;
  previewUri: string;
  expiresAt?: string;
  createdAt: string;
}

export interface PublicationApproval {
  id: string;
  organizationId: string;
  publicationId: string;
  buildId: string;
  validationReportId: string;
  packageId: string;
  status: "APPROVED" | "REJECTED";
  reviewerId: string;
  reviewedAt: string;
  notes?: string;
  humanFinalAuthority: true;
}

export interface DependencyFingerprint {
  canonicalWorkId: string;
  canonicalEditionId: string;
  masterDocumentVersionId: string;
  metadataVersionId: string;
  rightsRecordId: string;
  publicationProfileId: string;
  layoutProfileId: string;
  typographyProfileId?: string;
  sourceChecksum?: string;
  fingerprint: string;
}

export interface OutdatedBuildReport {
  status: "CURRENT" | "OUTDATED";
  previousFingerprint: string;
  currentFingerprint: string;
  reason?: string;
}

export interface PublicationBuildJob {
  id: string;
  organizationId: string;
  publicationId: string;
  buildId?: string;
  queueStatus: BuildQueueStatus;
  idempotencyKey: string;
  inputFingerprint: string;
  locked: boolean;
  requestedBy: string;
  requestedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface PublishingObservabilityMetric {
  id: string;
  organizationId: string;
  publicationId?: string;
  buildId?: string;
  metricName:
    | "publication_build_duration_ms"
    | "publication_build_failure_total"
    | "publication_build_started_total"
    | "publication_package_created_total"
    | "publication_validation_blocking_total";
  value: number;
  recordedAt: string;
  metadata?: Record<string, unknown>;
}

export interface PublicationStartConditions {
  canonicalWorkId?: string;
  canonicalEditionId?: string;
  approvedMasterDocumentVersionId?: string;
  approvedMetadataVersionId?: string;
  validatedRightsRecordId?: string;
  publicationConfigurationId?: string;
  masterDocumentApproved: boolean;
  metadataApproved: boolean;
  rightsValidated: boolean;
}

export interface PublicationStartValidationResult {
  ready: boolean;
  blockers: string[];
}

const allowedPublicationTransitions: Record<PublicationStatus, PublicationStatus[]> = {
  DRAFT: ["READY_FOR_BUILD", "ARCHIVED"],
  READY_FOR_BUILD: ["BUILDING", "ARCHIVED"],
  BUILDING: ["BUILD_FAILED", "BUILT"],
  BUILD_FAILED: ["READY_FOR_BUILD", "ARCHIVED"],
  BUILT: ["VALIDATING", "SUPERSEDED"],
  VALIDATING: ["VALIDATION_FAILED", "READY_FOR_REVIEW"],
  VALIDATION_FAILED: ["READY_FOR_BUILD", "ARCHIVED"],
  READY_FOR_REVIEW: ["UNDER_REVIEW", "SUPERSEDED"],
  UNDER_REVIEW: ["APPROVED", "VALIDATION_FAILED"],
  APPROVED: ["PUBLISHED", "SUPERSEDED", "WITHDRAWN"],
  PUBLISHED: ["WITHDRAWN", "SUPERSEDED"],
  SUPERSEDED: ["ARCHIVED"],
  WITHDRAWN: ["ARCHIVED"],
  ARCHIVED: []
};

export function canTransitionPublicationStatus(
  from: PublicationStatus,
  to: PublicationStatus
): boolean {
  return allowedPublicationTransitions[from].includes(to);
}

export function hasBlockingValidationFindings(report: PublicationValidationReport): boolean {
  return report.findings.some((finding) => finding.severity === "BLOCKING" || finding.blocking);
}

export function canApprovePublicationBuild(report: PublicationValidationReport): boolean {
  return report.status !== "FAIL" && !hasBlockingValidationFindings(report);
}

export function validatePublicationStartConditions(
  input: PublicationStartConditions
): PublicationStartValidationResult {
  const blockers: string[] = [];

  if (!input.canonicalWorkId) {
    blockers.push("CANONICAL_WORK_REQUIRED");
  }

  if (!input.canonicalEditionId) {
    blockers.push("CANONICAL_EDITION_REQUIRED");
  }

  if (!input.approvedMasterDocumentVersionId || !input.masterDocumentApproved) {
    blockers.push("APPROVED_MASTER_DOCUMENT_VERSION_REQUIRED");
  }

  if (!input.approvedMetadataVersionId || !input.metadataApproved) {
    blockers.push("APPROVED_METADATA_REQUIRED");
  }

  if (!input.validatedRightsRecordId || !input.rightsValidated) {
    blockers.push("VALIDATED_RIGHTS_REQUIRED");
  }

  if (!input.publicationConfigurationId) {
    blockers.push("PUBLICATION_CONFIGURATION_REQUIRED");
  }

  return {
    ready: blockers.length === 0,
    blockers
  };
}

export function fontAllowsEmbedding(
  font: Pick<FontRegistryEntry, "allowedFormats" | "embeddingPolicy" | "status">,
  targetFormat: PublicationOutputFormat
): boolean {
  if (font.status !== "VALIDATED") {
    return false;
  }

  if (!font.allowedFormats.includes(targetFormat)) {
    return false;
  }

  if (font.embeddingPolicy === "EMBED_ALLOWED" || font.embeddingPolicy === "SUBSET_ALLOWED") {
    return true;
  }

  return font.embeddingPolicy === "PRINT_ONLY" && targetFormat === "PDF_PRINT";
}

export function createDependencyFingerprint(
  input: Omit<DependencyFingerprint, "fingerprint">
): DependencyFingerprint {
  return {
    ...input,
    fingerprint: stableStringify(input)
  };
}

export function markBuildOutdatedIfDependenciesChanged(
  build: Pick<PublicationBuild, "dependencyFingerprint">,
  currentFingerprint: DependencyFingerprint
): OutdatedBuildReport {
  const previousFingerprint = build.dependencyFingerprint.fingerprint;
  const nextFingerprint = currentFingerprint.fingerprint;

  if (previousFingerprint === nextFingerprint) {
    return {
      status: "CURRENT",
      previousFingerprint,
      currentFingerprint: nextFingerprint
    };
  }

  return {
    status: "OUTDATED",
    previousFingerprint,
    currentFingerprint: nextFingerprint,
    reason: "SOURCE_DEPENDENCY_CHANGED"
  };
}

export function buildPublicationIdempotencyKey(input: {
  organizationId: string;
  publicationId: string;
  sourceSnapshot: PublicationSourceSnapshot;
  formats: PublicationOutputFormat[];
  publicationProfileId: string;
  layoutProfileId: string;
  typographyProfileId?: string;
}): string {
  return stableStringify({
    organizationId: input.organizationId,
    publicationId: input.publicationId,
    sourceSnapshot: input.sourceSnapshot,
    formats: [...input.formats].sort(),
    publicationProfileId: input.publicationProfileId,
    layoutProfileId: input.layoutProfileId,
    typographyProfileId: input.typographyProfileId
  });
}

export function assertDerivedOutputIsNotMaster(
  asset: Pick<GeneratedPublicationAsset, "canBecomeMasterSource" | "modifiesMasterDocument">
): boolean {
  return asset.canBecomeMasterSource === false && asset.modifiesMasterDocument === false;
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
