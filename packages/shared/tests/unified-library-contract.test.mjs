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

test("unified library defines distinct Work Edition Publication Asset and Library Record contracts", () => {
  const source = readSource("unified-library.ts");

  for (const symbol of [
    "CanonicalWork",
    "OriginalEditionIdentity",
    "CanonicalEdition",
    "ResourceRelationship",
    "DigitalAssetRecord",
    "UnifiedLibraryRecord",
    "LibraryReservation",
    "SearchIndexRecord",
    "PublicationReadinessResult"
  ]) {
    assert.match(source, new RegExp(symbol), `${symbol} must be defined`);
  }

  for (const field of [
    "work_id",
    "canonical_title",
    "canonical_master_id",
    "original_edition_id",
    "first_publication_year",
    "publication_year",
    "source_edition_id",
    "translation_id",
    "master_document_version_id",
    "library_record_id",
    "resource_id"
  ]) {
    assert.match(source, new RegExp(field), `${field} must be canonical`);
  }

  for (const workType of [
    "BOOK",
    "ARTICLE",
    "MAGAZINE_CONTENT",
    "POEM",
    "CHILDREN_WORK",
    "EDUCATIONAL_WORK",
    "MULTIMEDIA_WORK",
    "OTHER"
  ]) {
    assert.match(source, new RegExp(`"${workType}"`), `${workType} must be a work type`);
  }
});

test("rights provenance public domain and AI processing rules are explicit", () => {
  const source = readSource("unified-library.ts");

  for (const status of [
    "DRAFT",
    "UNDER_REVIEW",
    "INFORMATION_MISSING",
    "VALIDATED",
    "VALIDATED_WITH_RESTRICTIONS",
    "EXPIRED",
    "REVOKED",
    "REJECTED",
    "ARCHIVED"
  ]) {
    assert.match(source, new RegExp(`"${status}"`), `${status} rights status must exist`);
  }

  for (const field of [
    "languages",
    "territories",
    "formats",
    "distribution_channels",
    "commercial_use",
    "adaptation_allowed",
    "ai_processing_allowed",
    "evaluateRightsForPublication",
    "evaluateAiProcessingRights",
    "PublicDomainValidation",
    "ProvenanceRecord"
  ]) {
    assert.match(source, new RegExp(field), `${field} must be represented`);
  }

  assert.match(source, /Rights record is missing/);
  assert.match(source, /AI processing rights are unknown/);
});

test("digital asset integrity search projection duplicate and readiness rules are non-destructive", () => {
  const source = readSource("unified-library.ts");

  for (const token of [
    "evaluateAssetIntegrity",
    "CORRUPTED",
    "checksum",
    "size",
    "mime_type",
    "derived_from_canonical: true",
    "evaluatePublicationReadiness",
    "manually_editable: false",
    "DuplicateCandidate",
    "automatic_merge: false",
    "human_confirmation_required: true",
    "ControlledMergeRecord",
    "assets_preserved: true",
    "relationships_preserved: true",
    "audit_preserved: true"
  ]) {
    assert.match(source, new RegExp(token), `${token} must be represented`);
  }
});

test("JSON Master exposes additive unified library extension points", () => {
  const types = readSource("json-master-format/types.ts");
  const schema = readSource("json-master-format/schema.ts");
  const validation = readSource("json-master-format/validation.ts");
  const index = readSource("index.ts");
  const packageJson = readFileSync(join(packageRoot, "package.json"), "utf8");
  const rewrite = readFileSync(join(packageRoot, "scripts", "ensure-esm-file-exports.mjs"), "utf8");

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
    assert.match(validation, new RegExp(`"${field}"`), `${field} must be validated as an optional array`);
  }

  assert.match(types, /CanonicalWork/);
  assert.match(schema, /libraryRecord/);
  assert.match(index, /export \* from "\.\/unified-library"/);
  assert.match(packageJson, /"\.\/unified-library"/);
  assert.match(rewrite, /unified-library\.js/);
});
