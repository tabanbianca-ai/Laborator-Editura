export const UNIFIED_LIBRARY_SCHEMA_VERSION = "1.0.0" as const;

export type CanonicalWorkType =
  | "ARTICLE"
  | "BOOK"
  | "CHILDREN_WORK"
  | "EDUCATIONAL_WORK"
  | "MAGAZINE_CONTENT"
  | "MULTIMEDIA_WORK"
  | "OTHER"
  | "POEM";

export type CanonicalWorkStatus =
  | "ACTIVE"
  | "ARCHIVED"
  | "DRAFT"
  | "NEEDS_REVIEW"
  | "READY_FOR_CATALOG"
  | "WITHDRAWN";

export type OriginalEditionVerificationStatus =
  | "NEEDS_REVIEW"
  | "REJECTED"
  | "UNVERIFIED"
  | "VERIFIED"
  | "VERIFIED_WITH_NOTES";

export type CanonicalEditionType =
  | "ACCESSIBLE"
  | "ANNOTATED"
  | "AUDIO"
  | "CRITICAL"
  | "DIGITAL"
  | "ORIGINAL"
  | "PRINT"
  | "REVISED"
  | "TRANSLATION"
  | "VIDEO";

export type CanonicalEditionStatus =
  | "APPROVED"
  | "ARCHIVED"
  | "DRAFT"
  | "IN_PRODUCTION"
  | "READY_FOR_PUBLICATION"
  | "UNDER_REVIEW"
  | "WITHDRAWN";

export type ResourceRelationshipType =
  | "ACCESSIBLE_VERSION_OF"
  | "ADAPTATION_OF"
  | "AUDIO_VERSION_OF"
  | "DERIVED_FROM"
  | "EDITION_OF"
  | "REVISION_OF"
  | "SUPERSEDES"
  | "TRANSLATION_OF"
  | "VIDEO_VERSION_OF";

export type ContributorType =
  | "INDIVIDUAL"
  | "ORGANIZATION"
  | "PSEUDONYM"
  | "UNKNOWN";

export type EditionContributorRole =
  | "ANNOTATOR"
  | "AUTHOR"
  | "DESIGNER"
  | "EDITOR"
  | "ILLUSTRATOR"
  | "NARRATOR"
  | "OTHER"
  | "PREFACE_AUTHOR"
  | "PROOFREADER"
  | "TRANSLATOR";

export type CanonicalRightsStatus =
  | "ARCHIVED"
  | "DRAFT"
  | "EXPIRED"
  | "INFORMATION_MISSING"
  | "REJECTED"
  | "REVOKED"
  | "UNDER_REVIEW"
  | "VALIDATED"
  | "VALIDATED_WITH_RESTRICTIONS";

export type RightsValidationOutcome =
  | "EXPIRED"
  | "MISSING_RIGHTS"
  | "NOT_VALIDATED"
  | "RESTRICTED"
  | "VALIDATED";

export type PublicDomainVerificationStatus =
  | "NOT_PUBLIC_DOMAIN"
  | "PUBLIC_DOMAIN_CONFIRMED"
  | "REVIEW_REQUIRED"
  | "UNKNOWN";

export type ProvenanceSourceType =
  | "AI_GENERATION"
  | "AI_TRANSFORMATION"
  | "AUTHOR_SUBMISSION"
  | "AUTHORIZED_IMPORT"
  | "DERIVED_RESOURCE"
  | "EXTERNAL_PROVIDER"
  | "LEGACY_MIGRATION"
  | "LICENSED_SOURCE"
  | "OCR_EXTRACTION"
  | "ORIGINAL_CREATION"
  | "PUBLIC_DOMAIN_SOURCE";

export type ProvenanceValidationStatus =
  | "MISSING"
  | "NEEDS_REVIEW"
  | "REJECTED"
  | "VALIDATED"
  | "VALIDATED_WITH_NOTES";

export type DigitalAssetType =
  | "AUDIO"
  | "COVER"
  | "EPUB"
  | "IMAGE"
  | "ILLUSTRATION"
  | "MARKETING_ASSET"
  | "OTHER"
  | "PDF"
  | "SOURCE_FILE"
  | "SUBTITLE"
  | "THUMBNAIL"
  | "TRANSCRIPT"
  | "VIDEO";

export type DigitalAssetStatus =
  | "ACTIVE"
  | "ARCHIVED"
  | "DRAFT"
  | "MISSING"
  | "SUPERSEDED"
  | "WITHDRAWN";

export type AssetIntegrityStatus =
  | "ARCHIVED"
  | "CORRUPTED"
  | "MISSING"
  | "SUPERSEDED"
  | "UNVERIFIED"
  | "VALID";

export type LibraryScope =
  | "ARCHIVED"
  | "EDITORIAL"
  | "PUBLIC"
  | "RESERVED"
  | "WITHDRAWN";

export type LibraryVisibility =
  | "ORGANIZATION"
  | "PRIVATE"
  | "PUBLIC"
  | "TEAM";

export type LibraryAvailabilityStatus =
  | "AVAILABLE"
  | "MISSING"
  | "RESERVED"
  | "UNAVAILABLE"
  | "WITHDRAWN";

export type LibraryPublicationStatus =
  | "BLOCKED"
  | "NOT_PUBLIC"
  | "PUBLIC"
  | "READY_FOR_PUBLICATION"
  | "UNDER_REVIEW";

export type LibraryReservationStatus =
  | "ACTIVE"
  | "EXPIRED"
  | "RELEASED";

export type PublicationReadinessStatus =
  | "BLOCKED"
  | "MISSING_ACCESSIBILITY"
  | "MISSING_APPROVAL"
  | "MISSING_METADATA"
  | "MISSING_PROVENANCE"
  | "MISSING_RIGHTS"
  | "NOT_READY"
  | "READY_FOR_PUBLICATION";

export type DuplicateReviewStatus =
  | "CONFIRMED_DUPLICATE"
  | "POSSIBLE_DUPLICATE"
  | "RELATED_NOT_DUPLICATE";

export type ExistingResourceMigrationStatus =
  | "MIGRATED"
  | "NEEDS_REVIEW"
  | "ORPHANED"
  | "POSSIBLE_DUPLICATE"
  | "PROVENANCE_UNKNOWN"
  | "RIGHTS_UNKNOWN";

export type UnifiedLibraryAuditEventName =
  | "AssetIntegrityFailed"
  | "AssetRegistered"
  | "DuplicateDetected"
  | "EditionCreated"
  | "LibraryRecordCreated"
  | "LibraryVisibilityChanged"
  | "MetadataUpdated"
  | "ProvenanceRecorded"
  | "PublicationReadinessChanged"
  | "RecordsMerged"
  | "ResourceReleased"
  | "ResourceReserved"
  | "RightsExpired"
  | "RightsRecordCreated"
  | "RightsValidated"
  | "WorkCreated";

export interface LocalizedMetadataValue {
  language: string;
  locale?: string;
  value: string;
}

export type LocalizedMetadataMap = Record<string, string | LocalizedMetadataValue>;

export interface CanonicalWork {
  work_id: string;
  organization_id: string;
  canonical_title: string;
  work_type: CanonicalWorkType;
  original_language: string;
  first_edition_year?: number;
  original_author_ids: string[];
  status: CanonicalWorkStatus;
  canonical_master_id?: string;
  rights_status: CanonicalRightsStatus | "PUBLIC_DOMAIN";
  provenance_status: ProvenanceValidationStatus;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface OriginalEditionIdentity {
  original_edition_id: string;
  work_id: string;
  organization_id: string;
  original_language: string;
  first_publication_year?: number;
  edition_title: string;
  publisher?: string;
  publication_place?: string;
  publication_year?: number;
  edition_number?: string;
  source_type: ProvenanceSourceType;
  source_reference: string;
  purchase_or_download_reference?: string;
  verification_status: OriginalEditionVerificationStatus;
  metadata?: Record<string, unknown>;
}

export interface CanonicalEdition {
  edition_id: string;
  work_id: string;
  organization_id: string;
  language: string;
  locale?: string;
  edition_type: CanonicalEditionType;
  edition_number?: string;
  source_edition_id?: string;
  translation_id?: string;
  master_document_version_id?: string;
  publisher?: string;
  publication_year?: number;
  isbn?: string;
  issn?: string;
  status: CanonicalEditionStatus;
  rights_record_id?: string;
  metadata_version: number;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface ResourceRelationship {
  relationship_id: string;
  organization_id: string;
  source_resource_id: string;
  target_resource_id: string;
  relationship_type: ResourceRelationshipType;
  source_version?: string;
  created_by: string;
  created_at: string;
  evidence?: Record<string, unknown>;
}

export interface EditorialMetadata {
  metadata_id: string;
  organization_id: string;
  resource_type: "EDITION" | "LIBRARY_RECORD" | "PUBLICATION" | "WORK";
  resource_id: string;
  title?: string;
  subtitle?: string;
  alternative_titles?: LocalizedMetadataMap;
  author?: string;
  translator?: string;
  editor?: string;
  proofreader?: string;
  illustrator?: string;
  narrator?: string;
  language?: string;
  original_language?: string;
  edition?: string;
  original_edition?: string;
  first_edition_year?: number;
  publisher?: string;
  publication_place?: string;
  publication_date?: string;
  isbn?: string;
  issn?: string;
  doi?: string;
  subjects?: string[];
  keywords?: string[];
  description?: LocalizedMetadataMap;
  series?: string;
  volume?: string;
  rights?: string;
  license?: string;
  accessibility?: Record<string, unknown>;
  metadata_version: number;
}

export interface MetadataVersionRecord {
  metadata_version_id: string;
  organization_id: string;
  resource_type: string;
  resource_id: string;
  metadata_version: number;
  changed_fields: string[];
  previous_values: Record<string, unknown>;
  new_values: Record<string, unknown>;
  changed_by: string;
  changed_at: string;
  reason: string;
}

export interface Contributor {
  contributor_id: string;
  organization_id: string;
  canonical_name: string;
  display_name: string;
  alternative_names: string[];
  contributor_type: ContributorType;
  birth_date?: string;
  death_date?: string;
  organization?: string;
  identifiers?: Record<string, string>;
  metadata?: Record<string, unknown>;
  verification_status: OriginalEditionVerificationStatus;
}

export interface EditionContributor {
  edition_contributor_id: string;
  organization_id: string;
  edition_id: string;
  contributor_id: string;
  role: EditionContributorRole;
  credit_order: number;
  display_credit: string;
}

export interface CanonicalRightsRecord {
  rights_record_id: string;
  organization_id: string;
  resource_type: "ASSET" | "EDITION" | "LIBRARY_RECORD" | "WORK";
  resource_id: string;
  rights_holder_id?: string;
  rights_type: string;
  authorization_basis: string;
  languages: string[];
  territories: string[];
  formats: string[];
  distribution_channels: string[];
  commercial_use: boolean;
  adaptation_allowed: boolean;
  ai_processing_allowed: boolean;
  valid_from?: string;
  valid_until?: string;
  restrictions: string[];
  verification_status: CanonicalRightsStatus;
  verified_by?: string;
  verified_at?: string;
  evidence?: Record<string, unknown>;
}

export interface RightsEvaluationRequest {
  language: string;
  territory: string;
  format: string;
  distribution_channel: string;
  commercial_use: boolean;
  evaluated_at: string;
}

export interface RightsEvaluationResult {
  outcome: RightsValidationOutcome;
  public_action_allowed: boolean;
  ai_processing_allowed: boolean;
  reasons: string[];
}

export interface PublicDomainValidation {
  public_domain_validation_id: string;
  organization_id: string;
  work_id: string;
  jurisdiction: string;
  author_id?: string;
  relevant_dates: Record<string, string>;
  source_reference: string;
  edition_reference?: string;
  translation_reference?: string;
  added_editorial_elements: string[];
  verification_status: PublicDomainVerificationStatus;
  evidence?: Record<string, unknown>;
  verified_by?: string;
  verified_at?: string;
}

export interface ProvenanceRecord {
  provenance_record_id: string;
  organization_id: string;
  resource_id: string;
  source_type: ProvenanceSourceType;
  source_resource_id?: string;
  source_location?: string;
  source_owner?: string;
  acquisition_method: string;
  acquired_by?: string;
  acquired_at?: string;
  source_version?: string;
  transformation_history: string[];
  validation_status: ProvenanceValidationStatus;
  evidence?: Record<string, unknown>;
}

export interface TranslationSourceLink {
  translation_id: string;
  organization_id: string;
  source_work_id: string;
  source_edition_id: string;
  source_master_version_id: string;
  source_language: string;
  target_language: string;
  translator_id?: string;
  translation_right_record_id?: string;
}

export interface DigitalAssetRecord {
  asset_id: string;
  organization_id: string;
  work_id?: string;
  edition_id?: string;
  asset_type: DigitalAssetType;
  mime_type: string;
  language?: string;
  source_asset_id?: string;
  source_version?: string;
  storage_reference: string;
  checksum: string;
  size: number;
  status: DigitalAssetStatus;
  rights_record_id?: string;
  accessibility_metadata?: Record<string, unknown>;
  integrity_status: AssetIntegrityStatus;
  created_at: string;
}

export interface AssetIntegrityObservation {
  checksum?: string;
  size?: number;
  mime_type?: string;
  storage_status: "AVAILABLE" | "MISSING";
  source_version?: string;
}

export interface UnifiedLibraryRecord {
  library_record_id: string;
  organization_id: string;
  resource_type: "ASSET" | "EDITION" | "PUBLICATION" | "WORK";
  resource_id: string;
  library_scope: LibraryScope;
  visibility: LibraryVisibility;
  availability_status: LibraryAvailabilityStatus;
  publication_status: LibraryPublicationStatus;
  reserved_status?: LibraryReservationStatus;
  indexed_at?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface LibraryReservation {
  reservation_id: string;
  organization_id: string;
  library_record_id: string;
  project_id: string;
  reserved_by: string;
  reserved_at: string;
  expires_at?: string;
  status: LibraryReservationStatus;
}

export interface LibrarySearchInput {
  title?: string;
  author?: string;
  translator?: string;
  language?: string;
  original_language?: string;
  year?: number;
  work_type?: CanonicalWorkType;
  edition_type?: CanonicalEditionType;
  status?: string;
  rights_status?: CanonicalRightsStatus | "PUBLIC_DOMAIN";
  publication_status?: LibraryPublicationStatus;
  keyword?: string;
  project_id?: string;
  locale?: string;
}

export interface SearchIndexRecord {
  search_index_id: string;
  organization_id: string;
  resource_type: "EDITION" | "LIBRARY_RECORD" | "WORK";
  resource_id: string;
  indexed_text: string;
  normalized_title?: string;
  normalized_author?: string;
  language?: string;
  project_ids: string[];
  visibility: LibraryVisibility;
  indexed_at: string;
  derived_from_canonical: true;
}

export interface PublicationReadinessInput {
  metadata_complete: boolean;
  rights_status: CanonicalRightsStatus | "PUBLIC_DOMAIN";
  provenance_status: ProvenanceValidationStatus;
  accessibility_complete: boolean;
  approval_complete: boolean;
  blocked?: boolean;
}

export interface PublicationReadinessResult {
  status: PublicationReadinessStatus;
  manually_editable: false;
  reasons: string[];
}

export interface DuplicateCandidate {
  duplicate_candidate_id: string;
  organization_id: string;
  source_resource_id: string;
  compared_resource_id: string;
  status: DuplicateReviewStatus;
  compared_fields: string[];
  score: number;
  automatic_merge: false;
  human_confirmation_required: true;
}

export interface ControlledMergeRecord {
  merge_id: string;
  organization_id: string;
  primary_resource_id: string;
  merged_resource_ids: string[];
  preserved_identifiers: string[];
  redirects_created: string[];
  assets_preserved: true;
  relationships_preserved: true;
  audit_preserved: true;
  merged_by: string;
  merged_at: string;
}

export function normalizeCatalogText(value: string, locale = "ro"): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase(locale)
    .trim();
}

export function sortLibraryRecordsByTitle<T extends { title?: string; canonical_title?: string }>(
  records: readonly T[],
  locale = "ro"
): T[] {
  return [...records].sort((left, right) =>
    (left.title ?? left.canonical_title ?? "").localeCompare(
      right.title ?? right.canonical_title ?? "",
      locale,
      { sensitivity: "base" }
    )
  );
}

export function evaluateRightsForPublication(
  rights: CanonicalRightsRecord | undefined,
  request: RightsEvaluationRequest
): RightsEvaluationResult {
  if (!rights) {
    return {
      outcome: "MISSING_RIGHTS",
      public_action_allowed: false,
      ai_processing_allowed: false,
      reasons: ["Rights record is missing."]
    };
  }

  const reasons: string[] = [];
  const rightsValidated =
    rights.verification_status === "VALIDATED" ||
    rights.verification_status === "VALIDATED_WITH_RESTRICTIONS";

  if (!rightsValidated) {
    reasons.push(`Rights status is ${rights.verification_status}.`);
  }

  if (rights.valid_until && rights.valid_until < request.evaluated_at.slice(0, 10)) {
    reasons.push("Rights validity period has expired.");
    return {
      outcome: "EXPIRED",
      public_action_allowed: false,
      ai_processing_allowed: rights.ai_processing_allowed,
      reasons
    };
  }

  if (!matchesScope(rights.languages, request.language)) {
    reasons.push(`Language ${request.language} is not covered.`);
  }

  if (!matchesScope(rights.territories, request.territory)) {
    reasons.push(`Territory ${request.territory} is not covered.`);
  }

  if (!matchesScope(rights.formats, request.format)) {
    reasons.push(`Format ${request.format} is not covered.`);
  }

  if (!matchesScope(rights.distribution_channels, request.distribution_channel)) {
    reasons.push(`Distribution channel ${request.distribution_channel} is not covered.`);
  }

  if (request.commercial_use && !rights.commercial_use) {
    reasons.push("Commercial use is not allowed.");
  }

  if (reasons.length > 0) {
    return {
      outcome: rightsValidated ? "RESTRICTED" : "NOT_VALIDATED",
      public_action_allowed: false,
      ai_processing_allowed: rights.ai_processing_allowed,
      reasons
    };
  }

  return {
    outcome: "VALIDATED",
    public_action_allowed: true,
    ai_processing_allowed: rights.ai_processing_allowed,
    reasons: []
  };
}

export function evaluateAiProcessingRights(rights?: CanonicalRightsRecord): RightsEvaluationResult {
  if (!rights) {
    return {
      outcome: "MISSING_RIGHTS",
      public_action_allowed: false,
      ai_processing_allowed: false,
      reasons: ["AI processing rights are unknown."]
    };
  }

  if (!rights.ai_processing_allowed) {
    return {
      outcome: "RESTRICTED",
      public_action_allowed: false,
      ai_processing_allowed: false,
      reasons: ["AI processing is not allowed by the rights record."]
    };
  }

  return {
    outcome: "VALIDATED",
    public_action_allowed: true,
    ai_processing_allowed: true,
    reasons: []
  };
}

export function evaluateAssetIntegrity(
  asset: DigitalAssetRecord,
  observation: AssetIntegrityObservation
): AssetIntegrityStatus {
  if (observation.storage_status === "MISSING") {
    return "MISSING";
  }

  if (
    (observation.checksum && observation.checksum !== asset.checksum) ||
    (typeof observation.size === "number" && observation.size !== asset.size) ||
    (observation.mime_type && observation.mime_type !== asset.mime_type)
  ) {
    return "CORRUPTED";
  }

  if (asset.status === "SUPERSEDED") {
    return "SUPERSEDED";
  }

  return "VALID";
}

export function evaluatePublicationReadiness(input: PublicationReadinessInput): PublicationReadinessResult {
  if (input.blocked) {
    return { status: "BLOCKED", manually_editable: false, reasons: ["Resource is explicitly blocked."] };
  }

  if (!input.metadata_complete) {
    return { status: "MISSING_METADATA", manually_editable: false, reasons: ["Required metadata is missing."] };
  }

  if (
    input.rights_status !== "VALIDATED" &&
    input.rights_status !== "VALIDATED_WITH_RESTRICTIONS" &&
    input.rights_status !== "PUBLIC_DOMAIN"
  ) {
    return { status: "MISSING_RIGHTS", manually_editable: false, reasons: ["Validated rights are missing."] };
  }

  if (input.provenance_status !== "VALIDATED" && input.provenance_status !== "VALIDATED_WITH_NOTES") {
    return { status: "MISSING_PROVENANCE", manually_editable: false, reasons: ["Validated provenance is missing."] };
  }

  if (!input.accessibility_complete) {
    return { status: "MISSING_ACCESSIBILITY", manually_editable: false, reasons: ["Accessibility metadata is incomplete."] };
  }

  if (!input.approval_complete) {
    return { status: "MISSING_APPROVAL", manually_editable: false, reasons: ["Human editorial approval is missing."] };
  }

  return { status: "READY_FOR_PUBLICATION", manually_editable: false, reasons: [] };
}

export function detectPossibleDuplicate(
  candidate: Pick<CanonicalWork, "canonical_title" | "original_language" | "first_edition_year"> & {
    author_ids?: string[];
    isbn?: string;
    checksum?: string;
  },
  existing: Array<Pick<CanonicalWork, "work_id" | "canonical_title" | "original_language" | "first_edition_year"> & {
    author_ids?: string[];
    isbn?: string;
    checksum?: string;
  }>
): DuplicateCandidate[] {
  const candidateTitle = normalizeCatalogText(candidate.canonical_title);

  return existing
    .map((record) => {
      const comparedFields: string[] = [];

      if (normalizeCatalogText(record.canonical_title) === candidateTitle) {
        comparedFields.push("title");
      }

      if (record.original_language === candidate.original_language) {
        comparedFields.push("language");
      }

      if (record.first_edition_year && record.first_edition_year === candidate.first_edition_year) {
        comparedFields.push("first_edition_year");
      }

      if (candidate.isbn && record.isbn === candidate.isbn) {
        comparedFields.push("isbn");
      }

      if (candidate.checksum && record.checksum === candidate.checksum) {
        comparedFields.push("checksum");
      }

      const candidateAuthors = new Set(candidate.author_ids ?? []);
      if ((record.author_ids ?? []).some((authorId) => candidateAuthors.has(authorId))) {
        comparedFields.push("author");
      }

      return {
        duplicate_candidate_id: `${record.work_id}:candidate`,
        organization_id: "",
        source_resource_id: "candidate",
        compared_resource_id: record.work_id,
        status: "POSSIBLE_DUPLICATE" as const,
        compared_fields: comparedFields,
        score: comparedFields.length * 20,
        automatic_merge: false as const,
        human_confirmation_required: true as const
      };
    })
    .filter((result) => result.compared_fields.length > 0);
}

export function translatedEditionHasSourceLink(
  edition: CanonicalEdition,
  link?: TranslationSourceLink
): boolean {
  if (edition.edition_type !== "TRANSLATION") {
    return true;
  }

  return Boolean(
    edition.source_edition_id &&
      edition.translation_id &&
      link?.source_work_id &&
      link.source_edition_id === edition.source_edition_id &&
      link.translation_id === edition.translation_id &&
      link.source_master_version_id
  );
}

function matchesScope(allowedValues: readonly string[], requestedValue: string): boolean {
  return allowedValues.includes("*") || allowedValues.includes("GLOBAL") || allowedValues.includes(requestedValue);
}
