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

test("editorial core defines canonical project lifecycle and master document contracts", () => {
  const source = readSource("editorial-core.ts");

  for (const projectType of [
    "TRANSLATION",
    "CORRECTION",
    "LAYOUT",
    "BOOK",
    "MAGAZINE",
    "AUDIO",
    "VIDEO",
    "CHILDREN_BOOK",
    "MULTIMEDIA"
  ]) {
    assert.match(source, new RegExp(`"${projectType}"`));
  }

  for (const state of [
    "DRAFT",
    "PLANNED",
    "ACTIVE",
    "PAUSED",
    "UNDER_REVIEW",
    "APPROVED",
    "COMPLETED",
    "CANCELLED",
    "ARCHIVED"
  ]) {
    assert.match(source, new RegExp(`"${state}"`));
  }

  for (const field of [
    "master_document_id",
    "schema_version",
    "current_version_id",
    "front_matter",
    "chapters",
    "back_matter",
    "references",
    "block_id"
  ]) {
    assert.match(source, new RegExp(field));
  }

  assert.match(source, /EDITORIAL_MASTER_SCHEMA_VERSION = "1\.0\.0"/);
  assert.match(source, /validateStructuredMasterDocument/);
  assert.match(source, /Duplicate block_id/);
});

test("editorial versioning is non-destructive and source-version specific", () => {
  const source = readSource("editorial-core.ts");

  for (const changeType of [
    "AUTO_SAVE",
    "MANUAL_SAVE",
    "EDITORIAL_REVISION",
    "TRANSLATION_REVISION",
    "CORRECTION_REVISION",
    "APPROVED_VERSION",
    "RESTORED_VERSION"
  ]) {
    assert.match(source, new RegExp(`"${changeType}"`));
  }

  assert.match(source, /WORKING_SNAPSHOT/);
  assert.match(source, /CANONICAL_VERSION/);
  assert.match(source, /createRestoredVersionMetadata/);
  assert.match(source, /parent_version_id: input\.previous_current_version_id/);
  assert.match(source, /Restored from/);
  assert.match(source, /source_version_id/);
  assert.match(source, /detectSourceOutdated/);
  assert.match(source, /SOURCE_OUTDATED/);
});

test("translation terminology correction comments suggestions approvals and AI rules are canonical", () => {
  const source = readSource("editorial-core.ts");

  for (const status of [
    "UNTRANSLATED",
    "DRAFT",
    "TRANSLATED",
    "UNDER_REVIEW",
    "REVISED",
    "VALIDATED",
    "LOCKED"
  ]) {
    assert.match(source, new RegExp(`"${status}"`));
  }

  for (const matchType of ["EXACT", "HIGH_FUZZY", "FUZZY", "NO_MATCH"]) {
    assert.match(source, new RegExp(`"${matchType}"`));
  }

  for (const sourceName of ["DEX", "DOOM_1", "DOOM_2", "DOOM_3", "SPIRITIST_GLOSSARY", "FALSE_FRIENDS"]) {
    assert.match(source, new RegExp(`"${sourceName}"`));
  }

  for (const category of [
    "SPELLING",
    "DIACRITICS",
    "PUNCTUATION",
    "GRAMMAR",
    "AGREEMENT",
    "WORD_ORDER",
    "PREPOSITION",
    "PLURAL",
    "PRONOUN",
    "REPETITION",
    "PLEONASM",
    "ANACOLUTHON",
    "CACOPHONY",
    "AMBIGUITY",
    "TERMINOLOGY_UNIFORMITY"
  ]) {
    assert.match(source, new RegExp(`"${category}"`));
  }

  for (const profile of ["GENERAL_ROMANIAN", "LITERARY", "ACADEMIC", "CHILDREN", "SPIRITIST", "KARDECIAN", "CUSTOM"]) {
    assert.match(source, new RegExp(`"${profile}"`));
  }

  for (const operation of ["INSERT", "DELETE", "REPLACE", "MOVE", "FORMAT"]) {
    assert.match(source, new RegExp(`"${operation}"`));
  }

  assert.match(source, /proposal_only: true/);
  assert.match(source, /automatic_replacement: false/);
  assert.match(source, /direct_approved_version_modification: false/);
  assert.match(source, /validateVersionSpecificApproval/);
  assert.match(source, /resource_version is required/);
});

test("JSON Master exposes additive editorial core extension points", () => {
  const types = readSource("json-master-format/types.ts");
  const schema = readSource("json-master-format/schema.ts");
  const validation = readSource("json-master-format/validation.ts");
  const index = readSource("index.ts");
  const packageJson = readFileSync(join(packageRoot, "package.json"), "utf8");
  const rewrite = readFileSync(join(packageRoot, "scripts", "ensure-esm-file-exports.mjs"), "utf8");

  for (const field of [
    "masterDocuments",
    "editorialVersions",
    "editorialComments",
    "editorialSuggestions",
    "correctionFindings",
    "editorialApprovals",
    "editorialAiExecutions"
  ]) {
    assert.match(types, new RegExp(`${field}\\??:`));
    assert.match(schema, new RegExp(`${field}:`));
    assert.match(validation, new RegExp(`"${field}"`));
  }

  assert.match(types, /StructuredMasterDocument/);
  assert.match(schema, /editorialRecord/);
  assert.match(index, /export \* from "\.\/editorial-core"/);
  assert.match(packageJson, /"\.\/editorial-core"/);
  assert.match(rewrite, /editorial-core\.js/);
});
