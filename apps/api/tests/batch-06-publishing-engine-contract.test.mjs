import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(__dirname, "..", "..", "..");
const batchDir = join(repositoryRoot, "docs", "implementation", "execution-batches", "batch-06");

const requiredDocuments = [
  "overview.md",
  "publication-model.md",
  "publication-build-model.md",
  "publication-profiles.md",
  "layout-engine.md",
  "typography-and-font-registry.md",
  "pdf-digital.md",
  "pdf-print.md",
  "epub-generation.md",
  "html-generation.md",
  "image-pipeline.md",
  "cover-model.md",
  "publication-manifest.md",
  "rights-manifest.md",
  "accessibility-manifest.md",
  "integrity-manifest.md",
  "publication-package.md",
  "validation-pipeline.md",
  "print-preflight.md",
  "publication-approval.md",
  "regeneration-policy.md",
  "legacy-output-migration.md",
  "test-evidence.md",
  "changed-files.md",
  "rollback-plan.md",
  "compliance-report.md",
  "next-batch-proposal.md"
];

const publishingTables = [
  "publishing_publications",
  "publishing_builds",
  "publishing_publication_profiles",
  "publishing_layout_profiles",
  "publishing_typography_profiles",
  "publishing_font_registry",
  "publishing_style_mappings",
  "publishing_generated_assets",
  "publishing_image_derivatives",
  "publishing_covers",
  "publishing_validation_reports",
  "publishing_publication_packages",
  "publishing_approvals",
  "publishing_build_jobs",
  "publishing_observability_metrics",
  "publishing_audit_events"
];

function readRepositoryFile(...pathSegments) {
  return readFileSync(join(repositoryRoot, ...pathSegments), "utf8");
}

function readBatchDocument(fileName) {
  return readRepositoryFile("docs", "implementation", "execution-batches", "batch-06", fileName);
}

test("Batch 06 required publishing engine documentation deliverables exist", () => {
  for (const fileName of requiredDocuments) {
    const filePath = join(batchDir, fileName);
    assert.equal(existsSync(filePath), true, `${fileName} must exist`);
    assert.ok(readFileSync(filePath, "utf8").trim().length > 0, `${fileName} must not be empty`);
  }
});

test("shared canonical publishing engine models the required production flow", () => {
  const source = readRepositoryFile("packages", "shared", "src", "publishing-engine.ts");

  for (const symbol of [
    "CanonicalPublication",
    "PublicationBuild",
    "PublicationProfile",
    "LayoutProfile",
    "TypographyProfile",
    "FontRegistryEntry",
    "StructuralStyleMapping",
    "PublicationManifest",
    "RightsManifest",
    "AccessibilityManifest",
    "IntegrityManifest",
    "PublicationPackage",
    "PublicationValidationReport",
    "PublicationPreview",
    "PublicationApproval",
    "DependencyFingerprint"
  ]) {
    assert.match(source, new RegExp(symbol), `${symbol} must be part of Batch 06`);
  }

  for (const requiredToken of [
    "approvedMasterDocumentVersionId",
    "CANONICAL_WORK_APPROVED_EDITION_APPROVED_MASTER_DOCUMENT_APPROVED_METADATA_VALIDATED_RIGHTS",
    "derivedOutputsCanBecomeMaster: false",
    "approvalSeparateFromPublicVisibility: true",
    "epubGeneratedFromSemanticMaster: true",
    "pdfGeneratedFromSemanticMaster: true",
    "htmlGeneratedFromSemanticMaster: true",
    "printGeneratedFromSemanticMaster: true"
  ]) {
    assert.match(source, new RegExp(requiredToken), `${requiredToken} must be represented`);
  }
});

test("publishing runtime persistence and backup include canonical publishing tables", () => {
  const runtimeDatabase = readRepositoryFile("packages", "db", "src", "runtime-database.ts");
  const backupLibrary = readRepositoryFile("packages", "db", "scripts", "runtime-backup-lib.mjs");
  const inventory = readRepositoryFile(
    "docs",
    "implementation",
    "execution-batches",
    "batch-03",
    "data-store-inventory.md"
  );

  for (const tableName of publishingTables) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`), `${tableName} must be a runtime table`);
    assert.match(backupLibrary, new RegExp(`"${tableName}"`), `${tableName} must be included in backup/restore`);
    assert.match(inventory, new RegExp(tableName), `${tableName} must be inventoried`);
  }

  for (const reference of [
    ["publishing_publications", "libraryPublicationId", "library_publications"],
    ["publishing_builds", "publicationId", "publishing_publications"],
    ["publishing_publication_packages", "buildId", "publishing_builds"],
    ["publishing_approvals", "validationReportId", "publishing_validation_reports"]
  ]) {
    const referencePattern = new RegExp(reference.map((value) => `"${value}"`).join("[\\s\\S]*"));
    assert.match(runtimeDatabase, referencePattern, `${reference.join(" -> ")} must be tenant-validated`);
    assert.match(backupLibrary, referencePattern, `${reference.join(" -> ")} must be backup-validated`);
  }
});

test("Batch 06 reuses existing library rights workflow export and layout surfaces", () => {
  const layoutTypes = readRepositoryFile("apps", "api", "src", "modules", "layout-publishing", "layout-publishing.types.ts");
  const exportTypes = readRepositoryFile("apps", "api", "src", "modules", "export", "export.types.ts");
  const libraryTypes = readRepositoryFile("apps", "api", "src", "modules", "library", "library.types.ts");
  const rightsTypes = readRepositoryFile(
    "apps",
    "api",
    "src",
    "modules",
    "rights-provenance",
    "rights-provenance.types.ts"
  );
  const workflowTypes = readRepositoryFile("apps", "api", "src", "modules", "workflow", "workflow.types.ts");

  assert.match(layoutTypes, /PublishingPreflightResult/);
  assert.match(layoutTypes, /PublishingDistributionRecord/);
  assert.match(exportTypes, /ExportArtifact/);
  assert.match(libraryTypes, /LibraryPublicationRecord/);
  assert.match(libraryTypes, /LibraryPublicationFile/);
  assert.match(rightsTypes, /PublishingAuthorization/);
  assert.match(rightsTypes, /ProvenanceRecord/);
  assert.match(workflowTypes, /WorkflowState/);
});

test("validation approval regeneration queue and audit safeguards are explicit", () => {
  const source = readRepositoryFile("packages", "shared", "src", "publishing-engine.ts");

  for (const token of [
    "validatePublicationStartConditions",
    "hasBlockingValidationFindings",
    "canApprovePublicationBuild",
    "fontAllowsEmbedding",
    "createDependencyFingerprint",
    "markBuildOutdatedIfDependenciesChanged",
    "buildPublicationIdempotencyKey",
    "assertDerivedOutputIsNotMaster",
    "BLOCKING",
    "QUEUED",
    "RUNNING",
    "RETRYING",
    "COMPLETED",
    "FAILED",
    "CANCELLED"
  ]) {
    assert.match(source, new RegExp(token), `${token} must be represented`);
  }

  assert.equal(source.includes('DRAFT: ["READY_FOR_BUILD", "ARCHIVED"]'), true);

  for (const event of [
    "PublicationCreated",
    "PublicationBuildRequested",
    "PublicationBuildStarted",
    "PublicationBuildCompleted",
    "PublicationBuildFailed",
    "PublicationValidationFailed",
    "PublicationReadyForReview",
    "PublicationApproved",
    "PublicationRejected",
    "PublicationPackageCreated",
    "PublicationMarkedOutdated",
    "PublicationRegenerated",
    "LibraryPublicationLinked"
  ]) {
    assert.match(source, new RegExp(event), `${event} audit event must be represented`);
  }
});

test("JSON Master exposes additive publishing engine extension points", () => {
  const types = readRepositoryFile("packages", "shared", "src", "json-master-format", "types.ts");
  const schema = readRepositoryFile("packages", "shared", "src", "json-master-format", "schema.ts");
  const validation = readRepositoryFile("packages", "shared", "src", "json-master-format", "validation.ts");

  for (const field of [
    "canonicalPublications",
    "publicationBuilds",
    "canonicalPublicationProfiles",
    "layoutProfiles",
    "typographyProfiles",
    "fontRegistry",
    "styleMappings",
    "publicationGeneratedAssets",
    "publicationManifests",
    "rightsManifests",
    "accessibilityManifests",
    "integrityManifests",
    "publicationPackages",
    "publicationValidationReports",
    "publicationApprovals",
    "publicationBuildJobs",
    "publishingObservabilityMetrics",
    "legacyPublicationOutputs"
  ]) {
    assert.match(types, new RegExp(`${field}\\??:`), `${field} must be typed`);
    assert.match(schema, new RegExp(`${field}:`), `${field} must be in schema`);
    assert.match(validation, new RegExp(`"${field}"`), `${field} must be validated`);
  }
});

test("Batch 06 reports preserve no second editorial source of truth", () => {
  const overview = readBatchDocument("overview.md");
  const packageDoc = readBatchDocument("publication-package.md");
  const approval = readBatchDocument("publication-approval.md");
  const regeneration = readBatchDocument("regeneration-policy.md");
  const compliance = readBatchDocument("compliance-report.md");

  assert.match(overview, /No second editorial source of truth/);
  assert.match(overview, /Approved Master Document Version -> Edition -> Publication Readiness/);
  assert.match(packageDoc, /immutable/);
  assert.match(approval, /separate from public visibility/);
  assert.match(regeneration, /OUTDATED/);
  assert.match(compliance, /Canonical Publication Package/);
});
