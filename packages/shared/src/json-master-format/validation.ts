import {
  JSON_MASTER_FORMAT_VERSION,
  type JsonMasterFormatV1
} from "./types.js";

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
  validateMediaLocalization(value.mediaLocalization, issues);

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
    "localizedVideoExports"
  ]) {
    if (value[key] !== undefined && !Array.isArray(value[key])) {
      addIssue(issues, `$.mediaLocalization.${key}`, "media localization field must be an array.");
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
