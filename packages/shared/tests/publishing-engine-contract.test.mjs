import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, "..");

function readSource(relativePath) {
  return readFileSync(join(packageRoot, "src", relativePath), "utf8");
}

test("publishing engine defines canonical publication build package and validation contracts", () => {
  const source = readSource("publishing-engine.ts");

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
    "PublicationApproval",
    "DependencyFingerprint"
  ]) {
    assert.match(source, new RegExp(symbol), `${symbol} must be defined`);
  }

  for (const outputFormat of [
    "PDF_DIGITAL",
    "ACCESSIBLE_PDF",
    "PDF_PRINT",
    "EPUB",
    "HTML",
    "PRINT"
  ]) {
    assert.match(source, new RegExp(`"${outputFormat}"`), `${outputFormat} must be an output format`);
  }
});

test("publishing engine preserves canonical source of truth and forbids derived outputs as master", () => {
  const source = readSource("publishing-engine.ts");

  assert.match(
    source,
    /CANONICAL_WORK_APPROVED_EDITION_APPROVED_MASTER_DOCUMENT_APPROVED_METADATA_VALIDATED_RIGHTS/
  );
  assert.match(source, /derivedOutputsCanBecomeMaster: false/);
  assert.match(source, /modifiesMasterDocument: false/);
  assert.match(source, /canBecomeMasterSource: false/);
  assert.match(source, /assertDerivedOutputIsNotMaster/);
});

test("validation and approval rules block unsafe publication approval", () => {
  const source = readSource("publishing-engine.ts");

  for (const token of [
    "ValidationSeverity",
    "BLOCKING",
    "hasBlockingValidationFindings",
    "canApprovePublicationBuild",
    "validatePublicationStartConditions",
    "APPROVED_MASTER_DOCUMENT_VERSION_REQUIRED",
    "APPROVED_METADATA_REQUIRED",
    "VALIDATED_RIGHTS_REQUIRED",
    "PUBLICATION_CONFIGURATION_REQUIRED"
  ]) {
    assert.match(source, new RegExp(token), `${token} must be represented`);
  }

  assert.match(source, /DRAFT: \["READY_FOR_BUILD", "ARCHIVED"\]/);
  assert.doesNotMatch(source, /DRAFT: \[[^\]]*"PUBLISHED"/);
});

test("regeneration build queue print provider permissions audit and observability are explicit", () => {
  const source = readSource("publishing-engine.ts");

  for (const token of [
    "PrintProviderProfileType",
    "GENERIC_PRINT",
    "PRINT_ON_DEMAND",
    "AMAZON_KDP",
    "INGRAM",
    "LOCAL_PRINTER",
    "CUSTOM",
    "BuildQueueStatus",
    "buildPublicationIdempotencyKey",
    "markBuildOutdatedIfDependenciesChanged",
    "publishing.publication.create",
    "publishing.build.execute",
    "publishing.publication.approve",
    "publishing.publication.publish",
    "PublishingObservabilityMetric"
  ]) {
    assert.match(source, new RegExp(token), `${token} must be represented`);
  }

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
    assert.match(source, new RegExp(event), `${event} audit event must exist`);
  }
});

test("JSON Master and package exports expose publishing engine extensions", () => {
  const types = readSource("json-master-format/types.ts");
  const schema = readSource("json-master-format/schema.ts");
  const validation = readSource("json-master-format/validation.ts");
  const index = readSource("index.ts");
  const packageJson = readFileSync(join(packageRoot, "package.json"), "utf8");
  const rewrite = readFileSync(join(packageRoot, "scripts", "ensure-esm-file-exports.mjs"), "utf8");

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
    assert.match(validation, new RegExp(`"${field}"`), `${field} must be validated as optional array`);
  }

  assert.match(index, /export \* from "\.\/publishing-engine"/);
  assert.match(packageJson, /"\.\/publishing-engine"/);
  assert.match(rewrite, /publishing-engine\.js/);
});
