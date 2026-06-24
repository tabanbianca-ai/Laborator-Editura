import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "launch-essentials");
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

test("public launch essentials module is registered with authenticated additive endpoints", () => {
  const controller = readSource("launch-essentials.controller.ts");
  const moduleSource = readSource("launch-essentials.module.ts");

  assert.match(appModule, /LaunchEssentialsModule/);
  assert.match(moduleSource, /DatabaseLaunchEssentialsRepository/);
  assert.match(moduleSource, /LaunchEssentialsService/);
  assert.match(controller, /@Controller\("launch-essentials"\)/);
  assert.match(controller, /@Get\("mfa"\)/);
  assert.match(controller, /@Post\("mfa\/enable"\)/);
  assert.match(controller, /@Post\("mfa\/disable"\)/);
  assert.match(controller, /@Get\("gdpr\/consents"\)/);
  assert.match(controller, /@Post\("gdpr\/consents"\)/);
  assert.match(controller, /@Post\("gdpr\/consents\/:id\/withdraw"\)/);
  assert.match(controller, /@Post\("gdpr\/export-requests"\)/);
  assert.match(controller, /@Post\("gdpr\/deletion-requests"\)/);
  assert.match(controller, /@Get\("secrets"\)/);
  assert.match(controller, /@Post\("secrets"\)/);
  assert.match(controller, /@Post\("secrets\/:id\/rotate"\)/);
  assert.match(controller, /@Post\("secrets\/:id\/access"\)/);
  assert.match(controller, /CurrentActor/);
});

test("MFA minimal captures sensitive role metadata without external providers", () => {
  const types = readSource("launch-essentials.types.ts");
  const service = readSource("launch-essentials.service.ts");

  for (const role of ["ADMIN", "REVIEWER", "EDITOR"]) {
    assert.match(types + service, new RegExp(`"${role}"`));
  }

  assert.match(types + service, /totpSecretPlaceholder/);
  assert.match(types + service, /recoveryCodesMetadata/);
  assert.match(types + service, /externalMfaProvider: "NOT_CONFIGURED"/);
  assert.match(types + service, /MFA_METADATA_ENABLED/);
  assert.match(types + service, /MFA_METADATA_DISABLED/);
  assert.match(service, /Public launch essentials administration requires ADMIN/);
});

test("GDPR minimal supports consent withdrawal export request and deletion request metadata", () => {
  const types = readSource("launch-essentials.types.ts");
  const service = readSource("launch-essentials.service.ts");

  assert.match(types + service, /GdprConsentRecord/);
  assert.match(types + service, /ACCEPTED/);
  assert.match(types + service, /WITHDRAWN/);
  assert.match(types + service, /PERSONAL_DATA_EXPORT/);
  assert.match(types + service, /ACCOUNT_DELETION/);
  assert.match(types + service, /exportMetadata/);
  assert.match(types + service, /deletionMetadata/);
  assert.match(types + service, /noAdvancedRetentionEngine: true/);
  assert.match(service, /GDPR_CONSENT_ACCEPTED/);
  assert.match(service, /GDPR_CONSENT_WITHDRAWN/);
  assert.match(service, /GDPR_PERSONAL_DATA_EXPORT_REQUESTED/);
  assert.match(service, /GDPR_ACCOUNT_DELETION_REQUESTED/);
});

test("secret vault minimal stores metadata placeholders and access audit only", () => {
  const types = readSource("launch-essentials.types.ts");
  const service = readSource("launch-essentials.service.ts");

  for (const secretType of ["JWT", "API_KEY", "SMTP", "OAUTH", "WEBHOOK"]) {
    assert.match(types + service, new RegExp(`"${secretType}"`));
  }

  assert.match(types + service, /encryptedValuePlaceholder/);
  assert.match(types + service, /hashedValuePlaceholder/);
  assert.match(types + service, /rotationMetadata/);
  assert.match(types + service, /accessAuditMetadata/);
  assert.match(types + service, /externalVaultProvider: "NOT_CONFIGURED"/);
  assert.match(service, /SECRET_METADATA_STORED/);
  assert.match(service, /SECRET_METADATA_ROTATED/);
  assert.match(service, /SECRET_METADATA_ACCESSED/);
  assert.doesNotMatch(service, /createCipher|decrypt|externalVaultProvider: "(?!NOT_CONFIGURED)/);
});

test("public launch essentials persists through runtime database and backup restore", () => {
  const repository = readSource("launch-essentials.repository.ts");

  for (const table of [
    "launch_mfa_records",
    "launch_gdpr_consents",
    "launch_gdpr_requests",
    "launch_secret_vault_entries",
    "launch_essentials_audit_events"
  ]) {
    assert.match(repository + runtimeDatabase + runtimeBackup + backupRestoreTest, new RegExp(`${table}`));
  }

  assert.match(repository, /selectForTenant<LaunchMfaRecord>/);
  assert.match(repository, /selectForTenant<GdprConsentRecord>/);
  assert.match(repository, /selectForTenant<SecretVaultRecord>/);
  assert.match(repository, /selectForTenant<LaunchEssentialsAuditEvent>/);
  assert.match(repository, /findByIdForTenant<LaunchMfaRecord>/);
  assert.match(repository, /findByIdForTenant<GdprConsentRecord>/);
  assert.match(repository, /findByIdForTenant<SecretVaultRecord>/);
});

test("translator attribution is preserved in editorial publication and export metadata", () => {
  const documentTypes = readFileSync(
    join(__dirname, "..", "src", "modules", "documents", "documents.types.ts"),
    "utf8"
  );
  const translationTypes = readFileSync(
    join(__dirname, "..", "src", "modules", "translations", "translations.types.ts"),
    "utf8"
  );
  const exportTypes = readFileSync(
    join(__dirname, "..", "src", "modules", "export", "export.types.ts"),
    "utf8"
  );
  const exportService = readFileSync(
    join(__dirname, "..", "src", "modules", "export", "export.service.ts"),
    "utf8"
  );
  const publicPortalTypes = readFileSync(
    join(__dirname, "..", "src", "modules", "public-portal", "public-portal.types.ts"),
    "utf8"
  );
  const authorStudioTypes = readFileSync(
    join(__dirname, "..", "src", "modules", "author-studio", "author-studio.types.ts"),
    "utf8"
  );

  for (const source of [
    documentTypes,
    translationTypes,
    exportTypes,
    publicPortalTypes,
    authorStudioTypes,
    exportService,
    backupRestoreTest
  ]) {
    assert.match(source, /translatorId/);
    assert.match(source, /translatorName/);
  }

  assert.match(documentTypes + exportService, /originalAuthorAttributionPreserved: true/);
  assert.match(publicPortalTypes, /translators/);
  assert.match(exportService, /collectTranslatorAttribution/);
  assert.match(exportService, /buildDocumentExportMetadata/);
  assert.match(authorStudioTypes, /sourceManuscriptId/);
});

test("public launch pack stays minimal and does not add excluded launch systems", () => {
  const combined =
    readSource("launch-essentials.types.ts") +
    readSource("launch-essentials.service.ts") +
    readSource("launch-essentials.controller.ts");

  assert.doesNotMatch(combined, /billing|public status page|product analytics|incident center/i);
  assert.doesNotMatch(combined, /commercial marketplace|legal center|payment provider/i);
  assert.doesNotMatch(combined, /Dockerfile|docker-compose|deploy\/staging/);
});
