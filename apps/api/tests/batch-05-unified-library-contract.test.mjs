import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(__dirname, "..", "..", "..");
const batchDir = join(repositoryRoot, "docs", "implementation", "execution-batches", "batch-05");

const requiredDocuments = [
  "overview.md",
  "work-model.md",
  "original-edition-model.md",
  "edition-model.md",
  "editorial-metadata.md",
  "contributor-model.md",
  "rights-model.md",
  "public-domain-validation.md",
  "provenance-model.md",
  "digital-assets.md",
  "library-model.md",
  "library-search.md",
  "publication-readiness.md",
  "duplicate-consolidation.md",
  "data-migration-plan.md",
  "test-evidence.md",
  "changed-files.md",
  "rollback-plan.md",
  "compliance-report.md",
  "next-batch-proposal.md"
];

const canonicalLibraryTables = [
  "library_works",
  "library_original_editions",
  "library_canonical_editions",
  "library_resource_relationships",
  "library_contributors",
  "library_edition_contributors",
  "library_rights_records",
  "library_provenance_records",
  "library_digital_assets",
  "library_records",
  "library_reservations",
  "library_metadata_history",
  "library_search_index",
  "library_duplicate_reviews"
];

function readRepositoryFile(...pathSegments) {
  return readFileSync(join(repositoryRoot, ...pathSegments), "utf8");
}

function readBatchDocument(fileName) {
  return readRepositoryFile("docs", "implementation", "execution-batches", "batch-05", fileName);
}

test("Batch 05 required documentation deliverables exist", () => {
  for (const fileName of requiredDocuments) {
    const filePath = join(batchDir, fileName);
    assert.equal(existsSync(filePath), true, `${fileName} must exist`);
    assert.ok(readFileSync(filePath, "utf8").trim().length > 0, `${fileName} must not be empty`);
  }
});

test("shared unified library contract separates Work Edition Publication Asset and Library Record", () => {
  const source = readRepositoryFile("packages", "shared", "src", "unified-library.ts");

  for (const symbol of [
    "CanonicalWork",
    "OriginalEditionIdentity",
    "CanonicalEdition",
    "ResourceRelationship",
    "EditorialMetadata",
    "MetadataVersionRecord",
    "Contributor",
    "EditionContributor",
    "CanonicalRightsRecord",
    "PublicDomainValidation",
    "ProvenanceRecord",
    "TranslationSourceLink",
    "DigitalAssetRecord",
    "UnifiedLibraryRecord",
    "LibraryReservation"
  ]) {
    assert.match(source, new RegExp(symbol), `${symbol} must be part of Batch 05`);
  }

  assert.match(source, /work_id/);
  assert.match(source, /edition_id/);
  assert.match(source, /library_record_id/);
  assert.match(source, /asset_id/);
  assert.match(source, /source_edition_id/);
  assert.match(source, /source_master_version_id/);
});

test("rights readiness asset integrity search and duplicate safeguards are implemented as shared rules", () => {
  const source = readRepositoryFile("packages", "shared", "src", "unified-library.ts");

  for (const token of [
    "evaluateRightsForPublication",
    "evaluateAiProcessingRights",
    "evaluateAssetIntegrity",
    "evaluatePublicationReadiness",
    "detectPossibleDuplicate",
    "translatedEditionHasSourceLink",
    "sortLibraryRecordsByTitle",
    "normalizeCatalogText",
    "public_action_allowed: false",
    "ai_processing_allowed: false",
    "manually_editable: false",
    "automatic_merge: false",
    "derived_from_canonical: true"
  ]) {
    assert.match(source, new RegExp(token), `${token} must be present`);
  }
});

test("runtime database and backup include canonical unified library tables", () => {
  const runtimeDatabase = readRepositoryFile("packages", "db", "src", "runtime-database.ts");
  const backupLibrary = readRepositoryFile("packages", "db", "scripts", "runtime-backup-lib.mjs");

  for (const tableName of canonicalLibraryTables) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`), `${tableName} must be a runtime table`);
    assert.match(backupLibrary, new RegExp(`"${tableName}"`), `${tableName} must be included in backup/restore`);
  }
});

test("existing modules remain the implementation surface without creating a parallel archive", () => {
  const libraryTypes = readRepositoryFile("apps", "api", "src", "modules", "library", "library.types.ts");
  const libraryController = readRepositoryFile("apps", "api", "src", "modules", "library", "library.controller.ts");
  const rightsTypes = readRepositoryFile(
    "apps",
    "api",
    "src",
    "modules",
    "rights-provenance",
    "rights-provenance.types.ts"
  );
  const publicPortalTypes = readRepositoryFile("apps", "api", "src", "modules", "public-portal", "public-portal.types.ts");
  const commerceTypes = readRepositoryFile("apps", "api", "src", "modules", "commerce", "commerce.types.ts");

  assert.match(libraryTypes, /LibraryPublicationRecord/);
  assert.match(libraryTypes, /LibraryPublicationEdition/);
  assert.match(libraryTypes, /LibraryPublicationFile/);
  assert.match(libraryTypes, /LibraryDuplicateCandidate/);
  assert.match(libraryController, /@Post\("publications\/search"\)/);
  assert.match(libraryController, /@Post\("publications\/duplicates"\)/);
  assert.match(rightsTypes, /TranslationAuthorization/);
  assert.match(rightsTypes, /PublishingAuthorization/);
  assert.match(rightsTypes, /ProvenanceRecord/);
  assert.match(publicPortalTypes, /PublicCatalogItem/);
  assert.match(commerceTypes, /CommerceEdition/);
});

test("JSON Master supports additive unified library fields", () => {
  const types = readRepositoryFile("packages", "shared", "src", "json-master-format", "types.ts");
  const schema = readRepositoryFile("packages", "shared", "src", "json-master-format", "schema.ts");
  const validation = readRepositoryFile("packages", "shared", "src", "json-master-format", "validation.ts");

  for (const field of [
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
    "duplicateCandidates"
  ]) {
    assert.match(types, new RegExp(`${field}\\??:`), `${field} must be typed`);
    assert.match(schema, new RegExp(`${field}:`), `${field} must be in schema`);
    assert.match(validation, new RegExp(`"${field}"`), `${field} must be validated`);
  }
});

test("Batch 05 reports document closure blockers and incremental migration", () => {
  const overview = readBatchDocument("overview.md");
  const migration = readBatchDocument("data-migration-plan.md");
  const compliance = readBatchDocument("compliance-report.md");
  const readiness = readBatchDocument("publication-readiness.md");
  const duplicates = readBatchDocument("duplicate-consolidation.md");

  assert.match(overview, /Project -> Document Master -> Work -> Editorial Catalog -> Rights \+ Provenance -> Edition -> Unified Library/);
  assert.match(migration, /No Destructive Migration/);
  assert.match(migration, /Expand-Migrate-Contract/);
  assert.match(compliance, /Remaining P1\/P2 Gaps/);
  assert.match(readiness, /Publication readiness is derived/);
  assert.match(duplicates, /No automatic merge based only on title/);
});
