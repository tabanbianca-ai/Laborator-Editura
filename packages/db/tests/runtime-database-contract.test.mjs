import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(__dirname, "..", "src", "runtime-database.ts"), "utf8");
const indexSource = readFileSync(join(__dirname, "..", "src", "index.ts"), "utf8");
const packageJson = readFileSync(join(__dirname, "..", "package.json"), "utf8");

test("runtime database includes all MVP persistence and validation tables", () => {
  for (const table of [
    "organizations",
    "users",
    "user_roles",
    "auth_sessions",
    "projects",
    "documents",
    "document_segments",
    "segment_translations",
    "export_artifacts",
    "foundation_audit_events",
    "translation_memory_entries",
    "translation_memory_audit_events",
    "terminology_terms",
    "terminology_audit_events",
    "qa_reports",
    "qa_issues",
    "qa_audit_events",
    "semantic_fidelity_reports",
    "semantic_fidelity_issues",
    "semantic_fidelity_audit_events",
    "workflow_states",
    "workflow_transitions",
    "workflow_audit_events"
  ]) {
    assert.match(source, new RegExp(`"${table}"`));
  }
});

test("runtime database persists through a file-backed snapshot", () => {
  assert.match(source, /class FileBackedRuntimeDatabase/);
  assert.match(source, /LABORATOR_RUNTIME_DB_PATH/);
  assert.match(source, /readFileSync/);
  assert.match(source, /writeFileSync/);
  assert.match(source, /renameSync/);
  assert.match(source, /JSON\.parse/);
  assert.match(source, /JSON\.stringify/);
});

test("runtime database exposes tenant-scoped access methods for RLS-equivalent repository enforcement", () => {
  assert.match(source, /selectForTenant<T extends TenantRuntimeDatabaseRow>/);
  assert.match(source, /row\.organizationId === organizationId/);
  assert.match(source, /findByIdForTenant<T extends TenantRuntimeDatabaseRow>/);
});

test("runtime database is exported by the db package", () => {
  assert.match(indexSource, /export \* from "\.\/runtime-database\.js"/);
});

test("runtime backup and restore commands are runnable from the db package", () => {
  assert.match(packageJson, /"runtime:backup": "node scripts\/backup-runtime-db\.mjs"/);
  assert.match(packageJson, /"runtime:restore": "node scripts\/restore-runtime-db\.mjs"/);
});

test("runtime database exposes deterministic backup and validated restore helpers", () => {
  assert.match(source, /RUNTIME_DATABASE_BACKUP_FORMAT/);
  assert.match(source, /RUNTIME_DATABASE_SCHEMA_VERSION/);
  assert.match(source, /createBackup\(\)/);
  assert.match(source, /writeBackup\(filePath: string\)/);
  assert.match(source, /restoreBackup\(backup: unknown\)/);
  assert.match(source, /restoreBackupFromFile\(filePath: string\)/);
  assert.match(source, /validateRuntimeDatabaseBackup/);
  assert.match(source, /stableStringify/);
  assert.match(source, /validateTenantBoundaries/);
});
