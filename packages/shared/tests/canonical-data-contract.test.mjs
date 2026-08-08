import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, "..");

function readSource(fileName) {
  return readFileSync(join(packageRoot, "src", fileName), "utf8");
}

test("canonical data model exposes approved entity and metadata foundations", () => {
  const source = readSource("canonical-data.ts");

  for (const entity of [
    "Identity",
    "Organization",
    "Project",
    "Manuscript",
    "Work",
    "Edition",
    "Translation",
    "Revision",
    "Publication",
    "MagazineIssue",
    "Article",
    "DigitalAsset",
    "RightsRecord",
    "Contract",
    "Workflow",
    "Task",
    "Notification",
    "AuditRecord",
    "LocalizationResource",
    "AIAsset"
  ]) {
    assert.match(source, new RegExp(`"${entity}"`));
  }

  for (const field of [
    "id",
    "version",
    "status",
    "organization_id",
    "project_id",
    "created_at",
    "created_by",
    "updated_at",
    "updated_by",
    "deleted_at",
    "deleted_by",
    "correlation_id",
    "metadata"
  ]) {
    assert.match(source, new RegExp(`"${field}"`));
  }
});

test("canonical API event import export and retention contracts are versioned", () => {
  const source = readSource("canonical-data.ts");
  const index = readSource("index.ts");
  const packageJson = readFileSync(join(packageRoot, "package.json"), "utf8");
  const rewrite = readFileSync(join(packageRoot, "scripts", "ensure-esm-file-exports.mjs"), "utf8");

  for (const symbol of [
    "ApiSuccessEnvelope",
    "ApiErrorEnvelope",
    "ApiEndpointContract",
    "CanonicalEventEnvelope",
    "EventContract",
    "ImportExportContract",
    "RetentionPolicyDefinition",
    "MigrationManifest",
    "ReferentialIntegrityRule",
    "validateCanonicalMetadata"
  ]) {
    assert.match(source, new RegExp(symbol));
  }

  assert.match(source, /CANONICAL_API_VERSION = "v1"/);
  assert.match(source, /CANONICAL_EVENT_VERSION = "1\.0\.0"/);
  assert.match(source, /PUBLIC/);
  assert.match(source, /INTERNAL/);
  assert.match(source, /CONFIDENTIAL/);
  assert.match(source, /RESTRICTED/);
  assert.match(index, /export \* from "\.\/canonical-data"/);
  assert.match(packageJson, /"\.\/canonical-data"/);
  assert.match(rewrite, /canonical-data\.js/);
});
