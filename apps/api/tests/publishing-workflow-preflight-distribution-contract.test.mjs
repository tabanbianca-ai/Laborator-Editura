import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiRoot = join(__dirname, "..");
const repoRoot = join(apiRoot, "..", "..");
const moduleDir = join(apiRoot, "src", "modules", "layout-publishing");

function readSource(path) {
  return readFileSync(join(repoRoot, path), "utf8");
}

function readModuleSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

test("publishing workflow extends layout publishing without creating duplicate modules", () => {
  const moduleSource = readModuleSource("layout-publishing.module.ts");
  const service = readModuleSource("layout-publishing.service.ts");

  assert.equal(existsSync(join(apiRoot, "src", "modules", "preflight")), false);
  assert.equal(existsSync(join(apiRoot, "src", "modules", "distribution")), false);
  assert.match(moduleSource, /LibraryModule/);
  assert.match(moduleSource, /ExportModule/);
  assert.match(moduleSource, /RightsProvenanceModule/);
  assert.match(moduleSource, /WorkflowModule/);
  assert.match(service, /librarySingleSourceOfTruth: true/);
  assert.match(service, /noSeparatePreflightModule: true/);
  assert.match(service, /noDuplicateValidationLogic: true/);
  assert.match(service, /publicationMetadataOwner: "LIBRARY"/);
  assert.match(service, /formatsOwner: "EXPORT"/);
  assert.match(service, /rightsOwner: "RIGHTS_PROVENANCE"/);
});

test("publishing states preflight statuses severities and channels are official", () => {
  const types = readModuleSource("layout-publishing.types.ts");
  const service = readModuleSource("layout-publishing.service.ts");

  for (const state of [
    "IN_PREGATIRE",
    "GATA_PENTRU_PUBLICARE",
    "PUBLICAT",
    "REPUBLICAT",
    "RETRAS_DIN_PUBLICARE"
  ]) {
    assert.match(types, new RegExp(`"${state}"`));
  }

  for (const status of ["PASS", "WARNING", "ERROR", "NOT_APPLICABLE", "PENDING"]) {
    assert.match(types, new RegExp(`"${status}"`));
  }

  for (const severity of ["INFORMATIONAL", "WARNING", "CRITICAL"]) {
    assert.match(types, new RegExp(`"${severity}"`));
  }

  for (const channel of [
    "INTERNAL_LIBRARY",
    "PUBLIC_PORTAL",
    "DIGITAL_BOOKSTORE",
    "EXTERNAL_EXPORT",
    "PRINT_ON_DEMAND"
  ]) {
    assert.match(types, new RegExp(`"${channel}"`));
  }

  assert.doesNotMatch(types, /SOCIAL_MEDIA|PROMOTION/);
  assert.doesNotMatch(service, /SOCIAL_MEDIA|PROMOTION/);
});

test("preflight aggregates readiness and blocks critical publication issues", () => {
  const service = readModuleSource("layout-publishing.service.ts");
  const types = readModuleSource("layout-publishing.types.ts");

  for (const key of [
    "METADATA_COMPLETE",
    "RIGHTS_VALIDATED",
    "REQUIRED_FORMATS_GENERATED",
    "REQUIRED_FORMAT_COVERAGE",
    "EDITION_SELECTED",
    "VERSION_SELECTED",
    "PUBLICATION_CHANNELS_SELECTED",
    "WORKFLOW_APPROVALS_COMPLETE"
  ]) {
    assert.match(types, new RegExp(`"${key}"`));
    assert.match(service, new RegExp(`key: "${key}"`));
  }

  assert.match(service, /generatePublishingPreflight/);
  assert.match(service, /assertReadyPreflight/);
  assert.match(service, /Critical preflight errors block publishing/);
  assert.match(service, /rightsPermitPublication/);
  assert.match(service, /rightsBlockPublication/);
  assert.match(service, /workflowReadyForPublishing/);
  assert.match(service, /versionApproved/);
});

test("official editions are immutable and republishing creates a separate record", () => {
  const service = readModuleSource("layout-publishing.service.ts");
  const types = readModuleSource("layout-publishing.types.ts");

  assert.match(types, /immutableOfficialEdition: true/);
  assert.match(types, /previousPublishingRecordId\?: string/);
  assert.match(service, /immutableOfficialEdition: true/);
  assert.match(service, /previousPublishingRecordId: previous\.id/);
  assert.match(service, /publishedWithoutMetadataDuplication: true/);
  assert.match(service, /officialEditionImmutableFrom/);
  assert.match(service, /Republication requires a new or explicitly revised edition\/version/);
});

test("publishing transitions distribution history and audit are preserved", () => {
  const controller = readModuleSource("layout-publishing.controller.ts");
  const service = readModuleSource("layout-publishing.service.ts");
  const repository = readModuleSource("layout-publishing.repository.ts");
  const types = readModuleSource("layout-publishing.types.ts");

  for (const endpoint of [
    '@Post("publishing/preflight")',
    '@Get("publishing/preflight/:id")',
    '@Post("publishing/records")',
    '@Post("publishing/records/:id/ready")',
    '@Post("publishing/records/:id/publish")',
    '@Post("publishing/records/:id/withdraw")',
    '@Post("publishing/records/:id/republish")',
    '@Post("publishing/records/:id/distribution")',
    '@Get("publishing/records/:id/distribution")',
    '@Post("publishing/distribution/:id/status")'
  ]) {
    assert.match(controller, new RegExp(endpoint.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(service, /assertPublishingTransition/);
  assert.match(service, /Invalid publishing state transition/);
  assert.match(service, /DISTRIBUTION_INITIATED/);
  assert.match(service, /DISTRIBUTION_DELIVERED/);
  assert.match(service, /DISTRIBUTION_FAILED/);
  assert.match(service, /CHANNEL_WITHDRAWN/);
  assert.match(repository, /layout_publishing_distribution_records/);
  assert.match(types, /distributionRecordId\?: string/);
  assert.match(types, /history: PublishingDistributionHistoryItem\[]/);
  assert.match(service, /existing\.history/);
});

test("runtime database and backup include publishing preflight and distribution records", () => {
  const runtimeDatabase = readSource("packages/db/src/runtime-database.ts");
  const backupLib = readSource("packages/db/scripts/runtime-backup-lib.mjs");

  for (const table of [
    "layout_publishing_preflight_results",
    "layout_publishing_records",
    "layout_publishing_distribution_records"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${table}"`));
    assert.match(backupLib, new RegExp(`"${table}"`));
  }

  assert.match(runtimeDatabase, /"layout_publishing_records"[\s\S]*"preflightResultId"[\s\S]*"layout_publishing_preflight_results"/);
  assert.match(runtimeDatabase, /"layout_publishing_distribution_records"[\s\S]*"publishingRecordId"[\s\S]*"layout_publishing_records"/);
  assert.match(backupLib, /"layout_publishing_records"[\s\S]*"preflightResultId"[\s\S]*"layout_publishing_preflight_results"/);
  assert.match(backupLib, /"layout_publishing_distribution_records"[\s\S]*"publishingRecordId"[\s\S]*"layout_publishing_records"/);
});
