import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(__dirname, "..", "..", "..");
const batchDir = join(repositoryRoot, "docs", "implementation", "execution-batches", "batch-04");

const requiredDocuments = [
  "overview.md",
  "project-model.md",
  "master-document-schema.md",
  "content-block-model.md",
  "versioning-model.md",
  "import-pipeline.md",
  "translation-model.md",
  "translation-memory.md",
  "terminology-model.md",
  "correction-engine.md",
  "editorial-profiles.md",
  "comments-suggestions.md",
  "editorial-workflow.md",
  "ai-integration.md",
  "editor-accessibility.md",
  "test-evidence.md",
  "changed-files.md",
  "migration-plan.md",
  "rollback-plan.md",
  "compliance-report.md",
  "next-batch-proposal.md"
];

function readRepositoryFile(...pathSegments) {
  return readFileSync(join(repositoryRoot, ...pathSegments), "utf8");
}

function readBatchDocument(fileName) {
  return readRepositoryFile("docs", "implementation", "execution-batches", "batch-04", fileName);
}

test("Batch 04 required documentation deliverables exist", () => {
  for (const fileName of requiredDocuments) {
    const filePath = join(batchDir, fileName);
    assert.equal(existsSync(filePath), true, `${fileName} must exist`);
    assert.ok(readFileSync(filePath, "utf8").trim().length > 0, `${fileName} must not be empty`);
  }
});

test("shared editorial core defines project master document versioning and import contracts", () => {
  const source = readRepositoryFile("packages", "shared", "src", "editorial-core.ts");

  for (const token of [
    "CanonicalEditorialProject",
    "CanonicalEditorialProjectType",
    "EDITORIAL_PROJECT_LIFECYCLE_TRANSITIONS",
    "StructuredMasterDocument",
    "StructuredMasterContent",
    "StructuredContentBlock",
    "EDITORIAL_MASTER_SCHEMA_VERSION",
    "validateStructuredMasterDocument",
    "ManuscriptImportPreview",
    "createRestoredVersionMetadata",
    "EditorialVersionComparison",
    "assertEditorialOptimisticLock"
  ]) {
    assert.match(source, new RegExp(token), `${token} must exist`);
  }

  for (const field of [
    "project_id",
    "organization_id",
    "canonical_name",
    "display_name",
    "project_type",
    "source_language",
    "target_languages",
    "owner_id",
    "editorial_manager_id",
    "workflow_id",
    "master_document_id",
    "current_version_id",
    "content_hash",
    "content_snapshot"
  ]) {
    assert.match(source, new RegExp(field), `${field} must be canonical`);
  }

  for (const importFormat of ["DOCX", "TXT", "MARKDOWN", "HTML", "JSON_MASTER", "PDF"]) {
    assert.match(source, new RegExp(`"${importFormat}"`), `${importFormat} import must be represented`);
  }
});

test("shared editorial core preserves translation terminology correction workflow and AI authority rules", () => {
  const source = readRepositoryFile("packages", "shared", "src", "editorial-core.ts");

  for (const token of [
    "EditorialTranslation",
    "EditorialTranslationSegment",
    "source_version_id",
    "source_block_id",
    "EditorialTranslationMemoryMatch",
    "proposal_only: true",
    "automatic_replacement: false",
    "EditorialGlossaryTerm",
    "RomanianTerminologySource",
    "TerminologyCheckResult",
    "CorrectionFinding",
    "EditorialProfile",
    "VerbTenseAnalysis",
    "EditorialComment",
    "EditorialSuggestion",
    "EditorialApproval",
    "resource_version",
    "detectSourceOutdated",
    "SOURCE_OUTDATED",
    "EditorialAiExecutionRecord",
    "direct_approved_version_modification: false"
  ]) {
    assert.match(source, new RegExp(token), `${token} must be part of Batch 04 contracts`);
  }

  for (const eventName of [
    "ProjectCreated",
    "MasterDocumentCreated",
    "DocumentVersionCreated",
    "TranslationStarted",
    "TranslationSegmentUpdated",
    "TranslationValidated",
    "CorrectionFindingCreated",
    "SuggestionAccepted",
    "SuggestionRejected",
    "CommentCreated",
    "CommentResolved",
    "EditorialApprovalGranted",
    "SourceVersionChanged"
  ]) {
    assert.match(source, new RegExp(`"${eventName}"`), `${eventName} audit event must be defined`);
  }
});

test("existing modules map to the Batch 04 editorial core without duplicate modules", () => {
  const projects = readRepositoryFile("apps", "api", "src", "modules", "projects", "projects.types.ts");
  const authorStudio = readRepositoryFile("apps", "api", "src", "modules", "author-studio", "author-studio.types.ts");
  const documents = readRepositoryFile("apps", "api", "src", "modules", "documents", "documents.types.ts");
  const segments = readRepositoryFile("apps", "api", "src", "modules", "segments", "segments.types.ts");
  const translations = readRepositoryFile("apps", "api", "src", "modules", "translations", "translations.types.ts");
  const tm = readRepositoryFile("apps", "api", "src", "modules", "translation-memory", "translation-memory.types.ts");
  const terminology = readRepositoryFile("apps", "api", "src", "modules", "terminology", "terminology.types.ts");
  const qa = readRepositoryFile("apps", "api", "src", "modules", "qa", "qa.types.ts");
  const workflow = readRepositoryFile("apps", "api", "src", "modules", "workflow", "workflow.types.ts");
  const collaboration = readRepositoryFile("apps", "api", "src", "modules", "collaboration", "collaboration.types.ts");
  const editorialDecisions = readRepositoryFile(
    "apps",
    "api",
    "src",
    "modules",
    "editorial-decisions",
    "editorial-decisions.types.ts"
  );

  assert.match(projects, /ProjectPublicationType/);
  assert.match(projects, /ProjectCapability/);
  assert.match(projects, /ProjectIdentity/);
  assert.match(authorStudio, /AuthorDraft/);
  assert.match(authorStudio, /autosave/);
  assert.match(documents, /originalLanguage/);
  assert.match(documents, /translatorAttribution/);
  assert.match(segments, /latestTranslationId/);
  assert.match(translations, /sourceText/);
  assert.match(translations, /targetText/);
  assert.match(tm, /proposalOnly: true/);
  assert.match(tm, /automaticReplacement: false/);
  assert.match(terminology, /dictionaryEvidence/);
  assert.match(terminology, /humanFinalAuthority: true/);
  assert.match(qa, /TERMINOLOGY_VIOLATION/);
  assert.match(workflow, /DOCUMENT_APPROVED/);
  assert.match(collaboration, /COLLABORATION_COMMENT_CREATED/);
  assert.match(editorialDecisions, /humanApprovalRequired: true/);
});

test("JSON Master supports additive editorial core fields without invalidating existing contracts", () => {
  const types = readRepositoryFile("packages", "shared", "src", "json-master-format", "types.ts");
  const schema = readRepositoryFile("packages", "shared", "src", "json-master-format", "schema.ts");
  const validation = readRepositoryFile("packages", "shared", "src", "json-master-format", "validation.ts");

  for (const field of [
    "masterDocuments",
    "editorialVersions",
    "editorialComments",
    "editorialSuggestions",
    "correctionFindings",
    "editorialApprovals",
    "editorialAiExecutions"
  ]) {
    assert.match(types, new RegExp(`${field}\\??:`), `${field} must be typed`);
    assert.match(schema, new RegExp(`${field}:`), `${field} must be in schema`);
    assert.match(validation, new RegExp(`"${field}"`), `${field} must be validated as optional array`);
  }
});

test("Batch 04 reports document no-loss closure rules and remaining gaps", () => {
  const overview = readBatchDocument("overview.md");
  const versioning = readBatchDocument("versioning-model.md");
  const translation = readBatchDocument("translation-model.md");
  const workflow = readBatchDocument("editorial-workflow.md");
  const compliance = readBatchDocument("compliance-report.md");
  const migration = readBatchDocument("migration-plan.md");

  assert.match(overview, /Project -> Document Master -> Version -> Translation -> Correction -> Review -> Editorial Approval/);
  assert.match(versioning, /Approved or historical content must never be overwritten/);
  assert.match(versioning, /RESTORED_VERSION/);
  assert.match(translation, /source_version_id/);
  assert.match(translation, /SOURCE_OUTDATED/);
  assert.match(workflow, /resource_version/);
  assert.match(compliance, /Remaining P1\/P2 Gaps/);
  assert.match(migration, /No destructive migration/);
  assert.match(migration, /Expand-Migrate-Contract/);
});
