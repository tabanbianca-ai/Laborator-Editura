import {
  JSON_MASTER_FORMAT_VERSION,
  type JsonMasterFormatV1
} from "./types";

export type JsonMasterValidationSeverity = "error" | "warning";

export interface JsonMasterValidationIssue {
  path: string;
  message: string;
  severity: JsonMasterValidationSeverity;
}

export interface JsonMasterValidationResult {
  valid: boolean;
  issues: JsonMasterValidationIssue[];
}

const REQUIRED_TOP_LEVEL_KEYS = [
  "formatVersion",
  "project",
  "documents",
  "terminology",
  "translationMemory",
  "qa",
  "workflow",
  "audit",
  "versionHistory"
] as const;

const PROJECT_STRING_FIELDS = [
  "id",
  "name",
  "sourceLanguage",
  "status",
  "createdAt",
  "updatedAt"
] as const;

const DOCUMENT_STRING_FIELDS = ["id", "projectId", "title", "sourceLanguage"] as const;

const TRANSLATION_STRING_FIELDS = [
  "id",
  "language",
  "text",
  "status",
  "createdAt",
  "updatedAt"
] as const;

export function validateJsonMasterFormatV1(value: unknown): JsonMasterValidationResult {
  const issues: JsonMasterValidationIssue[] = [];

  if (!isRecord(value)) {
    addIssue(issues, "$", "JSON Master payload must be an object.");
    return toResult(issues);
  }

  for (const key of REQUIRED_TOP_LEVEL_KEYS) {
    if (!(key in value)) {
      addIssue(issues, `$.${key}`, "Required top-level key is missing.");
    }
  }

  if (value.formatVersion !== JSON_MASTER_FORMAT_VERSION) {
    addIssue(issues, "$.formatVersion", "formatVersion must be 1.0.");
  }

  validateProject(value.project, issues);
  validateDocuments(value.documents, issues);
  validateTerminology(value.terminology, issues);
  validateTranslationMemory(value.translationMemory, issues);
  validateProjectQa(value.qa, issues);
  validateWorkflow(value.workflow, issues);
  validateAudit(value.audit, issues);
  validateVersionHistory(value.versionHistory, issues);
  validateEditorialCore(value, issues);
  validateMediaLocalization(value.mediaLocalization, issues);
  validateLayoutPublishing(value, issues);
  validateMultimediaCreation(value, issues);
  validateMediaLocalizationStudio(value, issues);

  return toResult(issues);
}

export function isJsonMasterFormatV1(value: unknown): value is JsonMasterFormatV1 {
  return validateJsonMasterFormatV1(value).valid;
}

function validateProject(value: unknown, issues: JsonMasterValidationIssue[]): void {
  if (!isRecord(value)) {
    addIssue(issues, "$.project", "project must be an object.");
    return;
  }

  for (const field of PROJECT_STRING_FIELDS) {
    requireNonEmptyString(value, field, `$.project.${field}`, issues);
  }

  if (!Array.isArray(value.targetLanguages)) {
    addIssue(issues, "$.project.targetLanguages", "targetLanguages must be an array.");
  }

  requireOptionalString(value, "originalLanguage", "$.project.originalLanguage", issues);
  requireOptionalString(value, "originalLocale", "$.project.originalLocale", issues);
}

function validateDocuments(value: unknown, issues: JsonMasterValidationIssue[]): void {
  if (!Array.isArray(value)) {
    addIssue(issues, "$.documents", "documents must be an array.");
    return;
  }

  value.forEach((document, index) => {
    const path = `$.documents[${index}]`;

    if (!isRecord(document)) {
      addIssue(issues, path, "document must be an object.");
      return;
    }

    for (const field of DOCUMENT_STRING_FIELDS) {
      requireNonEmptyString(document, field, `${path}.${field}`, issues);
    }

    for (const field of [
      "originalLanguage",
      "originalLocale",
      "authoringLanguage",
      "authoringLocale",
      "targetLanguage",
      "targetLocale"
    ]) {
      requireOptionalString(document, field, `${path}.${field}`, issues);
    }

    if (!Array.isArray(document.segments)) {
      addIssue(issues, `${path}.segments`, "segments must be an array.");
      return;
    }

    document.segments.forEach((segment, segmentIndex) => {
      validateSegment(segment, `${path}.segments[${segmentIndex}]`, issues);
    });
  });
}

function validateSegment(
  value: unknown,
  path: string,
  issues: JsonMasterValidationIssue[]
): void {
  if (!isRecord(value)) {
    addIssue(issues, path, "segment must be an object.");
    return;
  }

  requireNonEmptyString(value, "id", `${path}.id`, issues);
  requireNonEmptyString(value, "status", `${path}.status`, issues);

  if (!Number.isInteger(value.order) || Number(value.order) < 0) {
    addIssue(issues, `${path}.order`, "order must be a non-negative integer.");
  }

  if (!isRecord(value.source)) {
    addIssue(issues, `${path}.source`, "source must be an object.");
  } else {
    requireString(value.source, "text", `${path}.source.text`, issues);
  }

  if (!Array.isArray(value.translations)) {
    addIssue(issues, `${path}.translations`, "translations must be an array.");
    return;
  }

  value.translations.forEach((translation, index) => {
    validateTranslation(translation, `${path}.translations[${index}]`, issues);
  });
}

function validateTranslation(
  value: unknown,
  path: string,
  issues: JsonMasterValidationIssue[]
): void {
  if (!isRecord(value)) {
    addIssue(issues, path, "translation must be an object.");
    return;
  }

  for (const field of TRANSLATION_STRING_FIELDS) {
    requireString(value, field, `${path}.${field}`, issues);
  }

  requireOptionalString(value, "targetLanguage", `${path}.targetLanguage`, issues);
  requireOptionalString(value, "targetLocale", `${path}.targetLocale`, issues);

  const provenance = value.provenance;

  if (isRecord(provenance) && typeof provenance.confidence === "number") {
    validateScore01(provenance.confidence, `${path}.provenance.confidence`, issues);
  }
}

function validateTerminology(value: unknown, issues: JsonMasterValidationIssue[]): void {
  if (!isRecord(value)) {
    addIssue(issues, "$.terminology", "terminology must be an object.");
    return;
  }

  if (!Array.isArray(value.terms)) {
    addIssue(issues, "$.terminology.terms", "terms must be an array.");
  }
}

function validateTranslationMemory(
  value: unknown,
  issues: JsonMasterValidationIssue[]
): void {
  if (!isRecord(value)) {
    addIssue(issues, "$.translationMemory", "translationMemory must be an object.");
    return;
  }

  if (!Array.isArray(value.entries)) {
    addIssue(issues, "$.translationMemory.entries", "entries must be an array.");
  }
}

function validateProjectQa(value: unknown, issues: JsonMasterValidationIssue[]): void {
  if (!isRecord(value)) {
    addIssue(issues, "$.qa", "qa must be an object.");
    return;
  }

  if (!Array.isArray(value.checks)) {
    addIssue(issues, "$.qa.checks", "checks must be an array.");
  }

  if (isRecord(value.scores)) {
    validateScores(value.scores, "$.qa.scores", issues);
  }
}

function validateWorkflow(value: unknown, issues: JsonMasterValidationIssue[]): void {
  if (!isRecord(value)) {
    addIssue(issues, "$.workflow", "workflow must be an object.");
    return;
  }

  requireNonEmptyString(value, "state", "$.workflow.state", issues);

  if (!Array.isArray(value.events)) {
    addIssue(issues, "$.workflow.events", "events must be an array.");
  }
}

function validateAudit(value: unknown, issues: JsonMasterValidationIssue[]): void {
  if (!isRecord(value)) {
    addIssue(issues, "$.audit", "audit must be an object.");
    return;
  }

  if (!Array.isArray(value.events)) {
    addIssue(issues, "$.audit.events", "events must be an array.");
  }
}

function validateVersionHistory(
  value: unknown,
  issues: JsonMasterValidationIssue[]
): void {
  if (!isRecord(value)) {
    addIssue(issues, "$.versionHistory", "versionHistory must be an object.");
    return;
  }

  if (!Array.isArray(value.versions)) {
    addIssue(issues, "$.versionHistory.versions", "versions must be an array.");
  }
}

function validateEditorialCore(
  value: Record<string, unknown>,
  issues: JsonMasterValidationIssue[]
): void {
  for (const key of [
    "masterDocuments",
    "editorialVersions",
    "editorialComments",
    "editorialSuggestions",
    "correctionFindings",
    "editorialApprovals",
    "editorialAiExecutions",
    "works",
    "originalEditions",
    "editions",
    "resourceRelationships",
    "contributors",
    "editionContributors",
    "editorialMetadata",
    "metadataHistory",
    "rightsRecords",
    "provenanceRecords",
    "digitalAssets",
    "libraryRecords",
    "libraryReservations",
    "searchIndexRecords",
    "publicationReadiness",
    "duplicateCandidates",
    "canonicalPublications",
    "publicationBuilds",
    "canonicalPublicationProfiles",
    "layoutProfiles",
    "typographyProfiles",
    "fontRegistry",
    "styleMappings",
    "publicationGeneratedAssets",
    "publicationImageAssets",
    "publicationImageDerivatives",
    "publicationCovers",
    "publicationManifests",
    "rightsManifests",
    "accessibilityManifests",
    "integrityManifests",
    "publicationPackages",
    "publicationValidationReports",
    "publicationPreviews",
    "publicationApprovals",
    "publicationBuildJobs",
    "publishingObservabilityMetrics",
    "legacyPublicationOutputs",
    "distributionRecords",
    "channelRegistry",
    "distributionReadinessResults",
    "publicCatalogProjections",
    "publicSlugs",
    "digitalReaderCapabilities",
    "readerProgress",
    "readerAnnotations",
    "readerLibraryEntries",
    "commerceProducts",
    "commerceOffers",
    "commerceTaxProfiles",
    "commerceOrders",
    "commerceOrderItems",
    "commercePayments",
    "commercePaymentWebhookEvents",
    "commerceEntitlements",
    "commerceDownloadAuthorizations",
    "commercePromotions",
    "commerceRefunds",
    "distributionExternalMappings",
    "distributionSyncRecords",
    "distributionReconciliationJobs",
    "publicationWithdrawalRequests",
    "publicationSupersedingRecords",
    "publicAnalyticsEvents",
    "distributionAuditEvents",
    "audioProductions",
    "audioProfiles",
    "narratorProfiles",
    "ssmlDocuments",
    "pronunciationEntries",
    "audioSegments",
    "audioAssemblies",
    "audioOutputs",
    "transcripts",
    "videoProductions",
    "videoProfiles",
    "videoScenes",
    "multimediaSubtitleTracks",
    "audioDescriptions",
    "videoBuilds",
    "multimediaManifests",
    "childrenProfiles",
    "childrenAgeClassifications",
    "illustrationAssets",
    "aiIllustrationGenerations",
    "visualIdentityProfiles",
    "characterRegistry",
    "localizedTextLayers",
    "localizedImageDerivatives",
    "textAudioSyncSegments",
    "multimediaAccessibilityReports",
    "multimediaRightsValidations",
    "musicSoundAssets",
    "multimediaPackages",
    "multimediaBuildJobs",
    "multimediaCostRecords",
    "multimediaObservabilityMetrics",
    "multimediaAuditEvents",
    "legacyMultimediaResources",
    "aiAgents",
    "aiProviders",
    "aiModels",
    "aiPrompts",
    "aiExecutions",
    "aiKnowledgeSources",
    "ragCollections",
    "ragChunkingProfiles",
    "ragVectors",
    "aiTools",
    "aiToolCalls",
    "aiEvaluationProfiles",
    "aiEvaluationDatasets",
    "aiRegressionRuns",
    "aiShadowEvaluations",
    "aiOperationalCostRecords",
    "aiOperationalBudgets",
    "aiUsageQuotas",
    "aiSemanticCacheEntries",
    "aiDataPolicies",
    "aiProviderDataPolicies",
    "aiOperationalAuditEvents",
    "aiObservabilityMetrics",
    "aiQualityDashboardSnapshots",
    "aiIncidents",
    "aiKillSwitches",
    "aiAgentMessages",
    "aiWorkflowTraces",
    "aiChangeRecords",
    "legacyAiAssets"
  ]) {
    if (value[key] !== undefined && !Array.isArray(value[key])) {
      addIssue(issues, `$.${key}`, `${key} must be an array.`);
    }
  }
}

function validateMediaLocalization(
  value: unknown,
  issues: JsonMasterValidationIssue[]
): void {
  if (value === undefined) {
    return;
  }

  if (!isRecord(value)) {
    addIssue(issues, "$.mediaLocalization", "mediaLocalization must be an object.");
    return;
  }

  for (const key of [
    "mediaAssets",
    "subtitleTracks",
    "voiceOverTracks",
    "dubbingTracks",
    "localizedVideoExports",
    "localizedIllustrations",
    "localizedVideos",
    "localizedAudio",
    "dubbingProjects"
  ]) {
    if (value[key] !== undefined && !Array.isArray(value[key])) {
      addIssue(issues, `$.mediaLocalization.${key}`, "media localization field must be an array.");
    }
  }
}

function validateLayoutPublishing(
  value: Record<string, unknown>,
  issues: JsonMasterValidationIssue[]
): void {
  if (value.layout !== undefined) {
    if (!isRecord(value.layout)) {
      addIssue(issues, "$.layout", "layout must be an object.");
    } else {
      requireNonEmptyString(value.layout, "id", "$.layout.id", issues);
      if (!Number.isInteger(value.layout.layoutVersion) || Number(value.layout.layoutVersion) < 1) {
        addIssue(issues, "$.layout.layoutVersion", "layoutVersion must be a positive integer.");
      }
      if (!Number.isInteger(value.layout.styleRevision) || Number(value.layout.styleRevision) < 1) {
        addIssue(issues, "$.layout.styleRevision", "styleRevision must be a positive integer.");
      }
      requireNonEmptyString(value.layout, "publicationKind", "$.layout.publicationKind", issues);
      requireNonEmptyString(value.layout, "approvalStatus", "$.layout.approvalStatus", issues);
    }
  }

  for (const key of [
    "pageTemplates",
    "printProfiles",
    "illustrations",
    "audioTracks",
    "videoAssets",
    "publicationProfiles"
  ]) {
    if (value[key] !== undefined && !Array.isArray(value[key])) {
      addIssue(issues, `$.${key}`, `${key} must be an array.`);
    }
  }
}

function validateMediaLocalizationStudio(
  value: Record<string, unknown>,
  issues: JsonMasterValidationIssue[]
): void {
  for (const key of [
    "localizedIllustrations",
    "localizedVideos",
    "localizedAudio",
    "voiceOverTracks",
    "dubbingProjects"
  ]) {
    if (value[key] !== undefined && !Array.isArray(value[key])) {
      addIssue(issues, `$.${key}`, `${key} must be an array.`);
    }
  }
}

function validateMultimediaCreation(
  value: Record<string, unknown>,
  issues: JsonMasterValidationIssue[]
): void {
  for (const key of [
    "mediaAssets",
    "illustrationProjects",
    "audioProjects",
    "videoProjects",
    "voiceProfiles",
    "subtitleTracks"
  ]) {
    if (value[key] !== undefined && !Array.isArray(value[key])) {
      addIssue(issues, `$.${key}`, `${key} must be an array.`);
    }
  }
}

function validateScores(
  value: Record<string, unknown>,
  path: string,
  issues: JsonMasterValidationIssue[]
): void {
  for (const key of [
    "semanticFidelity",
    "terminology",
    "consistency",
    "fluency",
    "overall"
  ]) {
    if (value[key] !== undefined) {
      validateScore100(value[key], `${path}.${key}`, issues);
    }
  }
}

function validateScore100(
  value: unknown,
  path: string,
  issues: JsonMasterValidationIssue[]
): void {
  if (typeof value !== "number" || value < 0 || value > 100) {
    addIssue(issues, path, "score must be a number between 0 and 100.");
  }
}

function validateScore01(
  value: number,
  path: string,
  issues: JsonMasterValidationIssue[]
): void {
  if (value < 0 || value > 1) {
    addIssue(issues, path, "confidence must be a number between 0 and 1.");
  }
}

function requireString(
  value: Record<string, unknown>,
  key: string,
  path: string,
  issues: JsonMasterValidationIssue[]
): void {
  if (typeof value[key] !== "string") {
    addIssue(issues, path, "field must be a string.");
  }
}

function requireNonEmptyString(
  value: Record<string, unknown>,
  key: string,
  path: string,
  issues: JsonMasterValidationIssue[]
): void {
  if (typeof value[key] !== "string" || String(value[key]).length === 0) {
    addIssue(issues, path, "field must be a non-empty string.");
  }
}

function requireOptionalString(
  value: Record<string, unknown>,
  key: string,
  path: string,
  issues: JsonMasterValidationIssue[]
): void {
  if (value[key] !== undefined && typeof value[key] !== "string") {
    addIssue(issues, path, `${key} must be a string when present.`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function addIssue(
  issues: JsonMasterValidationIssue[],
  path: string,
  message: string,
  severity: JsonMasterValidationSeverity = "error"
): void {
  issues.push({ path, message, severity });
}

function toResult(issues: JsonMasterValidationIssue[]): JsonMasterValidationResult {
  return {
    valid: !issues.some((issue) => issue.severity === "error"),
    issues
  };
}
