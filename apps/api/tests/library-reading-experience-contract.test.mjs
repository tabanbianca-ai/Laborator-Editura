import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "library");
const appModule = readFileSync(join(__dirname, "..", "src", "modules", "app.module.ts"), "utf8");
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

test("library module is registered with authenticated reading experience endpoints", () => {
  const controller = readSource("library.controller.ts");
  const moduleSource = readSource("library.module.ts");

  assert.match(appModule, /LibraryModule/);
  assert.match(moduleSource, /DatabaseLibraryRepository/);
  assert.match(moduleSource, /LibraryService/);
  assert.match(controller, /@Controller\("library"\)/);
  assert.match(controller, /@Get\(\)/);
  assert.match(controller, /@Post\("items"\)/);
  assert.match(controller, /@Post\("items\/:id\/progress"\)/);
  assert.match(controller, /@Post\("items\/:id\/bookmarks"\)/);
  assert.match(controller, /@Post\("items\/:id\/highlights"\)/);
  assert.match(controller, /@Post\("items\/:id\/notes"\)/);
  assert.match(controller, /@Post\("items\/:id\/favorite"\)/);
  assert.match(controller, /@Delete\("items\/:id\/favorite"\)/);
  assert.match(controller, /CurrentActor/);
  assert.doesNotMatch(controller, /x-user-id/);
  assert.doesNotMatch(controller, /x-organization-id/);
});

test("user library supports saved books magazines articles audiobooks videos and localized media", () => {
  const types = readSource("library.types.ts");
  const service = readSource("library.service.ts");

  for (const itemType of ["BOOK", "MAGAZINE", "ARTICLE", "AUDIOBOOK", "VIDEO", "LOCALIZED_MEDIA"]) {
    assert.match(types, new RegExp(`"${itemType}"`));
  }

  for (const field of ["publicCatalogItemId", "commerceEditionId", "sourceReference", "favorite", "savedAt"]) {
    assert.match(types, new RegExp(`${field}`));
    assert.match(service, new RegExp(`${field}`));
  }

  assert.match(service, /addItem/);
  assert.match(service, /LIBRARY_ITEM_ADDED/);
});

test("reading progress tracks current chapter section position and sessions", () => {
  const types = readSource("library.types.ts");
  const service = readSource("library.service.ts");

  for (const field of [
    "progressPercent",
    "currentChapter",
    "currentSection",
    "position",
    "readingSessionId"
  ]) {
    assert.match(types, new RegExp(`${field}`));
    assert.match(service, new RegExp(`${field}`));
  }

  assert.match(service, /updateProgress/);
  assert.match(service, /READING_PROGRESS_UPDATED/);
  assert.match(service, /clampProgress/);
});

test("bookmarks highlights notes and favorites are supported", () => {
  const controller = readSource("library.controller.ts");
  const service = readSource("library.service.ts");
  const types = readSource("library.types.ts");

  for (const action of ["addBookmark", "addHighlight", "addNote", "favoriteItem", "unfavoriteItem"]) {
    assert.match(controller, new RegExp(`${action}`));
    assert.match(service, new RegExp(`${action}`));
  }

  for (const action of ["BOOKMARK_ADDED", "HIGHLIGHT_ADDED", "NOTE_ADDED", "FAVORITE_ADDED", "FAVORITE_REMOVED"]) {
    assert.match(types, new RegExp(`${action}`));
    assert.match(service, new RegExp(`${action}`));
  }
});

test("access history records recently opened items reading sessions and download logs", () => {
  const types = readSource("library.types.ts");
  const service = readSource("library.service.ts");

  for (const eventType of ["OPENED", "DOWNLOADED", "READING_SESSION_STARTED", "READING_SESSION_ENDED"]) {
    assert.match(types, new RegExp(`"${eventType}"`));
  }

  assert.match(types, /LibraryAccessEvent/);
  assert.match(service, /recordAccess/);
  assert.match(service, /ACCESS_EVENT_RECORDED/);
  assert.match(service, /lastAccessedAt/);
});

test("private user access is enforced by organization and user identity", () => {
  const repository = readSource("library.repository.ts");
  const service = readSource("library.service.ts");
  const controller = readSource("library.controller.ts");

  assert.match(repository, /listItemsForUser\(organizationId: string, userId: string\)/);
  assert.match(repository, /item\.userId === userId/);
  assert.match(repository, /findItemByIdForUser/);
  assert.match(repository, /item\?\.userId === userId/);
  assert.match(service, /actor\.organizationId/);
  assert.match(service, /actor\.userId/);
  assert.doesNotMatch(controller, /@Controller\("public"\)/);
  assert.doesNotMatch(controller, /@Get\("public|@Post\("public/);
});

test("library audit events are written for reading mutations and administrative changes", () => {
  const repository = readSource("library.repository.ts");
  const service = readSource("library.service.ts");
  const types = readSource("library.types.ts");

  assert.match(repository, /library_audit_events/);
  assert.match(types, /LibraryAuditEvent/);

  for (const action of [
    "LIBRARY_ITEM_ADDED",
    "READING_PROGRESS_UPDATED",
    "BOOKMARK_ADDED",
    "HIGHLIGHT_ADDED",
    "NOTE_ADDED",
    "FAVORITE_ADDED",
    "FAVORITE_REMOVED",
    "ACCESS_EVENT_RECORDED"
  ]) {
    assert.match(service, new RegExp(`${action}`));
  }

  assert.match(service, /repository\.appendAuditEvent/);
});

test("runtime persistence and backup include private library data", () => {
  for (const tableName of [
    "library_items",
    "library_reading_progress",
    "library_bookmarks",
    "library_highlights",
    "library_notes",
    "library_access_events",
    "library_audit_events"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`));
    assert.match(runtimeBackup, new RegExp(`"${tableName}"`));
    assert.match(backupRestoreTest, new RegExp(`${tableName}`));
  }

  assert.match(runtimeDatabase, /"libraryItemId",\s*"library_items"/);
  assert.match(runtimeBackup, /"libraryItemId",\s*"library_items"/);
  assert.match(backupRestoreTest, /library-item-a/);
});
