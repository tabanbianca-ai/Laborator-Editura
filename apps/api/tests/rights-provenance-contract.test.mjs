import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "rights-provenance");
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

test("rights provenance module is registered with authenticated endpoints", () => {
  const controller = readSource("rights-provenance.controller.ts");
  const moduleSource = readSource("rights-provenance.module.ts");

  assert.match(appModule, /RightsProvenanceModule/);
  assert.match(moduleSource, /DatabaseRightsProvenanceRepository/);
  assert.match(moduleSource, /RightsProvenanceService/);
  assert.match(controller, /@Controller\("rights"\)/);
  assert.match(controller, /@Get\("contracts"\)/);
  assert.match(controller, /@Post\("contracts"\)/);
  assert.match(controller, /@Get\("translation"\)/);
  assert.match(controller, /@Post\("translation"\)/);
  assert.match(controller, /@Get\("publishing"\)/);
  assert.match(controller, /@Post\("publishing"\)/);
  assert.match(controller, /@Get\("provenance"\)/);
  assert.match(controller, /@Post\("provenance"\)/);
  assert.match(controller, /@Get\("audit"\)/);
  assert.match(controller, /CurrentActor/);
  assert.doesNotMatch(controller, /x-user-id|x-organization-id|x-user-roles/);
});

test("collaboration agreements model editorial collaborator roles and statuses", () => {
  const types = readSource("rights-provenance.types.ts");
  const service = readSource("rights-provenance.service.ts");

  for (const agreementType of [
    "AUTHOR",
    "TRANSLATOR",
    "EDITOR",
    "DESIGNER",
    "ILLUSTRATOR",
    "AUDIO_NARRATOR",
    "COLLABORATOR"
  ]) {
    assert.match(types, new RegExp(`"${agreementType}"`));
  }

  for (const status of ["DRAFT", "SENT", "ACCEPTED", "EXPIRED", "TERMINATED"]) {
    assert.match(types, new RegExp(`"${status}"`));
  }

  for (const field of [
    "collaboratorId",
    "collaboratorName",
    "attachedDocumentMetadata",
    "startDate",
    "endDate"
  ]) {
    assert.match(types, new RegExp(field));
    assert.match(service, new RegExp(field));
  }
});

test("translation and publishing authorizations capture rights warnings metadata", () => {
  const types = readSource("rights-provenance.types.ts");
  const service = readSource("rights-provenance.service.ts");

  for (const field of [
    "translationAuthorized",
    "authorizedLanguages",
    "territories",
    "validUntil",
    "publicationAuthorized",
    "ebookAllowed",
    "printAllowed",
    "pdfAllowed",
    "mobiAllowed",
    "audiobookAllowed",
    "videoAllowed",
    "commercialDistributionAllowed"
  ]) {
    assert.match(types, new RegExp(field));
    assert.match(service, new RegExp(field));
  }

  assert.match(service, /translationAuthorized: input\.translationAuthorized \?\? false/);
  assert.match(service, /publicationAuthorized: input\.publicationAuthorized \?\? false/);
});

test("provenance preserves original source and attribution metadata", () => {
  const types = readSource("rights-provenance.types.ts");
  const service = readSource("rights-provenance.service.ts");

  for (const field of [
    "originalTitle",
    "originalLanguage",
    "firstPublicationYear",
    "originalEdition",
    "originalPublisher",
    "originalSourceReference",
    "originalAuthor",
    "translator",
    "reviewer",
    "publisher",
    "publicationHistory",
    "metadata"
  ]) {
    assert.match(types, new RegExp(field));
    assert.match(service, new RegExp(field));
  }
});

test("rights provenance audit preserves human authority and blocks AI authorization", () => {
  const service = readSource("rights-provenance.service.ts");
  const types = readSource("rights-provenance.types.ts");

  for (const action of [
    "COLLABORATION_AGREEMENT_CREATED",
    "TRANSLATION_AUTHORIZATION_CREATED",
    "PUBLISHING_AUTHORIZATION_CREATED",
    "PROVENANCE_RECORD_CREATED"
  ]) {
    assert.match(types, new RegExp(action));
    assert.match(service, new RegExp(action));
  }

  assert.match(service, /humanFinalAuthorityRequired: true/);
  assert.match(service, /aiMayApproveAgreements: false/);
  assert.match(service, /aiMayAuthorizeTranslations: false/);
  assert.match(service, /aiMayAuthorizePublication: false/);
  assert.match(service, /aiMayModifyProvenanceAutomatically: false/);
  assert.doesNotMatch(service, /autoApprove|autoAuthorize|digitalSignature|royalt|invoice|billing|litigation|erp/i);
});

test("runtime persistence and backup include rights provenance data", () => {
  for (const tableName of [
    "rights_collaboration_agreements",
    "rights_translation_authorizations",
    "rights_publishing_authorizations",
    "rights_provenance_records",
    "rights_audit_events"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`));
    assert.match(runtimeBackup, new RegExp(`"${tableName}"`));
    assert.match(backupRestoreTest, new RegExp(tableName));
  }

  assert.match(runtimeDatabase, /"rights_audit_events",\s*"translationAuthorizationId"/);
  assert.match(runtimeBackup, /"rights_audit_events",\s*"publishingAuthorizationId"/);
  assert.match(backupRestoreTest, /rights-contract-a/);
  assert.match(backupRestoreTest, /rights-provenance-a/);
});
