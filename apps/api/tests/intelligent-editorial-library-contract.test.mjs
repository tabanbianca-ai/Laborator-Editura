import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "library");
const runtimeDatabase = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "src", "runtime-database.ts"),
  "utf8"
);
const runtimeBackup = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "scripts", "runtime-backup-lib.mjs"),
  "utf8"
);
const backupRestoreTest = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "tests", "runtime-backup-restore.test.mjs"),
  "utf8"
);

function readSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

test("Intelligent Editorial Library extends existing Library without a new module", () => {
  const controller = readSource("library.controller.ts");
  const service = readSource("library.service.ts");

  assert.match(controller, /@Controller\("library"\)/);
  assert.match(controller, /@Post\("publications\/search"\)/);
  assert.match(controller, /@Post\("publications"\)/);
  assert.match(controller, /@Post\("publications\/:id\/status"\)/);
  assert.match(controller, /@Post\("publications\/:id\/visibility"\)/);
  assert.match(controller, /@Post\("publications\/:id\/editions"\)/);
  assert.match(controller, /@Post\("publications\/:id\/versions"\)/);
  assert.match(controller, /@Post\("publications\/:id\/files"\)/);
  assert.match(controller, /@Post\("publications\/:id\/preview"\)/);
  assert.match(controller, /@Post\("publications\/bulk-actions"\)/);
  assert.match(controller, /@Post\("publications\/duplicates"\)/);
  assert.match(controller, /@Post\("preferences"\)/);
  assert.doesNotMatch(service + controller, /ArchiveModule|archive_publications|separate archive/i);
});

test("publication lifecycle statuses and transitions are modeled without destroying history", () => {
  const types = readSource("library.types.ts");
  const service = readSource("library.service.ts");

  for (const status of ["STOC_REAL", "IN_LUCRU", "PUBLICAT"]) {
    assert.match(types + service, new RegExp(`"${status}"`));
  }

  assert.match(service, /canTransition/);
  assert.match(service, /from === "STOC_REAL" && to === "IN_LUCRU"/);
  assert.match(service, /from === "IN_LUCRU" && to === "PUBLICAT"/);
  assert.match(service, /from === "PUBLICAT" && to === "IN_LUCRU"/);
  assert.match(service, /historicalVersionsPreserved: true/);
  assert.match(types, /immutableHistoricalVersion: true/);
});

test("publication records contain lifecycle metadata relationships rights formats editions and versions", () => {
  const types = readSource("library.types.ts");

  for (const field of [
    "title",
    "subtitle",
    "author",
    "contributors",
    "description",
    "publicationType",
    "editorialDomain",
    "language",
    "series",
    "collection",
    "volume",
    "originalTitle",
    "originalLanguage",
    "originalAuthor",
    "firstPublicationYear",
    "sourceAcquisition",
    "manuscriptId",
    "projectId",
    "activeWorkflowId",
    "translationRefs",
    "reviewRefs",
    "layoutRefs",
    "publishingRecordRefs",
    "rightsStatus",
    "license",
    "contractRefs",
    "availableFormats",
    "publishedChannels",
    "distributionStatus",
    "associatedIdentifiers"
  ]) {
    assert.match(types, new RegExp(field));
  }
});

test("search filtering sorting grid list preferences and visibility are supported", () => {
  const types = readSource("library.types.ts");
  const service = readSource("library.service.ts");

  for (const marker of [
    "LibraryPublicationSearchInput",
    "query",
    "author",
    "language",
    "editorialDomain",
    "publicationType",
    "lifecycleStatus",
    "publicationYear",
    "originalPublicationYear",
    "rightsStatus",
    "format",
    "series",
    "collection",
    "LibraryViewMode",
    '"GRID"',
    '"LIST"',
    "LibraryViewPreference",
    "persistentFilters",
    "recentSearches",
    "savedSearches"
  ]) {
    assert.match(types, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(service, /normalizeSearchText/);
  assert.match(service, /fuzzyIncludes/);
  assert.match(service, /levenshteinDistance/);
  assert.match(service, /sortPublications/);
  assert.match(service, /saveViewPreference/);
});

test("preview bulk actions duplicate detection and restricted metadata protection are explicit", () => {
  const types = readSource("library.types.ts");
  const service = readSource("library.service.ts");

  assert.match(types, /LibraryPublicationPreview/);
  assert.match(types, /restrictedContentReturned: false/);
  assert.match(service, /previewPublication/);
  assert.match(service, /sanitizePublicationForActor/);
  assert.match(service, /restrictedMetadata: undefined/);
  assert.match(service, /canAccessRestrictedMetadata/);
  assert.match(types + service, /LibraryBulkActionInput/);
  assert.match(types + service, /destructiveChanges: false/);
  assert.match(service, /runBulkAction/);
  assert.match(service, /permissionsRespected: true/);
  assert.match(service, /subscriptionLimitsRespected: true/);
  assert.match(service, /detectDuplicates/);
  assert.match(service, /automaticMerge: false as const/);
  assert.match(service, /humanConfirmationRequired: true as const/);
});

test("Library Agent Quality Agent rights and audit actions are represented through existing governance", () => {
  const types = readSource("library.types.ts");
  const service = readSource("library.service.ts");

  for (const action of [
    "LIBRARY_PUBLICATION_CREATED",
    "LIBRARY_METADATA_CHANGED",
    "LIBRARY_STATUS_CHANGED",
    "LIBRARY_VISIBILITY_CHANGED",
    "LIBRARY_MANUSCRIPT_LINKED",
    "LIBRARY_PROJECT_LINKED",
    "LIBRARY_EDITION_CREATED",
    "LIBRARY_VERSION_CREATED",
    "LIBRARY_FILE_ADDED",
    "LIBRARY_FILE_REPLACED",
    "LIBRARY_BULK_ACTION",
    "LIBRARY_PUBLICATION_PUBLISHED",
    "LIBRARY_PUBLICATION_WITHDRAWN",
    "LIBRARY_DUPLICATE_REVIEWED",
    "LIBRARY_RIGHTS_STATUS_CHANGED",
    "LIBRARY_VIEW_PREFERENCE_SAVED"
  ]) {
    assert.match(types + service, new RegExp(action));
  }

  assert.match(service, /completeLifecycleManagedByLibrary: true/);
  assert.match(service, /noSeparateArchiveModule: true/);
});

test("runtime persistence and backup include intelligent editorial library data", () => {
  for (const tableName of [
    "library_publications",
    "library_publication_editions",
    "library_publication_versions",
    "library_publication_files",
    "library_view_preferences"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`));
    assert.match(runtimeBackup, new RegExp(`"${tableName}"`));
    assert.match(backupRestoreTest, new RegExp(`${tableName}`));
  }

  assert.match(runtimeDatabase, /"library_publication_editions",\s*"publicationId",\s*"library_publications"/);
  assert.match(runtimeBackup, /"library_publication_versions",\s*"publicationId",\s*"library_publications"/);
  assert.match(backupRestoreTest, /library-publication-a/);
  assert.match(backupRestoreTest, /library-version-a/);
});
