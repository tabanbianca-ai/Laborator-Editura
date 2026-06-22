import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "author-studio");
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

test("author studio module is registered with authenticated endpoints", () => {
  const controller = readSource("author-studio.controller.ts");
  const moduleSource = readSource("author-studio.module.ts");

  assert.match(appModule, /AuthorStudioModule/);
  assert.match(moduleSource, /DatabaseAuthorStudioRepository/);
  assert.match(moduleSource, /AuthorStudioService/);
  assert.match(controller, /@Controller\("author-studio"\)/);
  assert.match(controller, /@Post\("manuscripts"\)/);
  assert.match(controller, /@Get\("manuscripts"\)/);
  assert.match(controller, /@Get\("manuscripts\/:id"\)/);
  assert.match(controller, /@Post\("manuscripts\/:id\/sections"\)/);
  assert.match(controller, /@Post\("sections\/:id\/drafts"\)/);
  assert.match(controller, /@Post\("manuscripts\/:id\/notes"\)/);
  assert.match(controller, /@Post\("manuscripts\/:id\/submit"\)/);
  assert.match(controller, /@Post\("manuscripts\/:id\/archive"\)/);
  assert.match(controller, /CurrentActor/);
  assert.doesNotMatch(controller, /@Controller\("public/);
});

test("manuscript creation supports required metadata types attribution and privacy", () => {
  const types = readSource("author-studio.types.ts");
  const service = readSource("author-studio.service.ts");

  for (const manuscriptType of ["BOOK", "ARTICLE", "MAGAZINE_ARTICLE", "CHILDREN_BOOK", "SCRIPT"]) {
    assert.match(types, new RegExp(`"${manuscriptType}"`));
  }

  for (const field of [
    "title",
    "subtitle",
    "language",
    "genre",
    "authorId",
    "projectId",
    "documentId",
    "authorAttribution",
    "publicExposure: false",
    "humanEditorialApprovalRequired: true"
  ]) {
    assert.match(service, new RegExp(`${field}`));
  }
});

test("author studio supports chapters sections scenes notes synopsis and outline", () => {
  const types = readSource("author-studio.types.ts");
  const service = readSource("author-studio.service.ts");

  for (const sectionType of ["CHAPTER", "SECTION", "SCENE", "SYNOPSIS", "OUTLINE"]) {
    assert.match(types, new RegExp(`"${sectionType}"`));
  }

  for (const field of ["synopsis", "outline", "notes", "orderIndex", "parentSectionId", "addSection"]) {
    assert.match(service, new RegExp(`${field}`));
  }
});

test("draft saving preserves version history autosave metadata and text counts", () => {
  const types = readSource("author-studio.types.ts");
  const service = readSource("author-studio.service.ts");

  for (const field of [
    "version",
    "autosaveMetadata",
    "wordCount",
    "characterCount",
    "findLatestDraftForSection",
    "aiSuggestionApplied: false"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  assert.match(service, /\(existing\?\.version \?\? 0\) \+ 1/);
  assert.match(service, /countWords/);
});

test("author tools include private research character glossary style notes and advisory AI only", () => {
  const types = readSource("author-studio.types.ts");
  const service = readSource("author-studio.service.ts");

  for (const noteType of [
    "PRIVATE_AUTHOR_NOTE",
    "RESEARCH_NOTE",
    "CHARACTER_NOTE",
    "GLOSSARY_NOTE",
    "STYLE_PREFERENCE",
    "AUTHOR_EDITOR_COMMENT",
    "REVISION_REQUEST"
  ]) {
    assert.match(types, new RegExp(`"${noteType}"`));
  }

  assert.match(types, /aiSuggestionsAdvisoryOnly: true/);
  assert.match(service, /aiSuggestionsAdvisoryOnly: true/);
  assert.match(service, /privateToAuthor/);
});

test("submission links or requests document creation and preserves human final authority", () => {
  const types = readSource("author-studio.types.ts");
  const service = readSource("author-studio.service.ts");

  assert.match(types, /createOrLinkDocument/);
  assert.match(types, /PENDING_EDITORIAL_WORKFLOW/);
  assert.match(types, /humanEditorialApprovalRequired: true/);
  assert.match(service, /DOCUMENT_LINKED/);
  assert.match(service, /DOCUMENT_CREATION_REQUESTED/);
  assert.match(service, /AUTHOR_MANUSCRIPT_SUBMITTED/);
  assert.match(service, /humanEditorialApprovalRequired: true/);
});

test("AI cannot auto-submit or overwrite author drafts", () => {
  const service = readSource("author-studio.service.ts");
  const types = readSource("author-studio.types.ts");

  assert.match(service, /if \(input\.aiInitiated\)/);
  assert.match(service, /AI cannot submit manuscripts automatically/);
  assert.match(service, /aiSuggestionApplied: false/);
  assert.match(types, /aiInitiated: false/);
});

test("manuscripts remain private and access is limited to author or editorial roles", () => {
  const service = readSource("author-studio.service.ts");
  const repository = readSource("author-studio.repository.ts");

  assert.match(service, /publicExposure: false/);
  assert.match(service, /manuscript\.authorId === actor\.userId/);
  assert.match(service, /hasRole\(actor, "ADMIN"\)/);
  assert.match(service, /hasRole\(actor, "REVIEWER"\)/);
  assert.match(repository, /listManuscriptsByAuthor/);
  assert.match(repository, /listManuscriptsByOrganization/);
  assert.doesNotMatch(service + repository, /publicManuscript|publishManuscript|PUBLIC_RELEASE/);
});

test("author studio audit trail is preserved for manuscript lifecycle", () => {
  const service = readSource("author-studio.service.ts");
  const repository = readSource("author-studio.repository.ts");
  const types = readSource("author-studio.types.ts");

  assert.match(repository, /author_studio_audit_events/);
  assert.match(types, /AuthorStudioAuditEvent/);

  for (const action of [
    "AUTHOR_MANUSCRIPT_CREATED",
    "AUTHOR_SECTION_CREATED",
    "AUTHOR_DRAFT_SAVED",
    "AUTHOR_NOTE_CREATED",
    "AUTHOR_MANUSCRIPT_SUBMITTED",
    "AUTHOR_MANUSCRIPT_ARCHIVED"
  ]) {
    assert.match(service, new RegExp(`${action}`));
  }
});

test("runtime persistence and backup include author studio data", () => {
  for (const tableName of [
    "author_manuscripts",
    "author_manuscript_sections",
    "author_drafts",
    "author_notes",
    "author_submission_events",
    "author_studio_audit_events"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`));
    assert.match(runtimeBackup, new RegExp(`"${tableName}"`));
    assert.match(backupRestoreTest, new RegExp(`${tableName}`));
  }

  assert.match(runtimeDatabase, /"author_drafts",\s*"sectionId",\s*"author_manuscript_sections"/);
  assert.match(runtimeBackup, /"author_submission_events",\s*"manuscriptId",\s*"author_manuscripts"/);
  assert.match(backupRestoreTest, /author-manuscript-a/);
  assert.match(backupRestoreTest, /author-submission-a/);
});
