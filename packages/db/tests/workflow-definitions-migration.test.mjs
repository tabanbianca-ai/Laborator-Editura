import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(testDirectory, "..", "..", "..");
const migration = readFileSync(
  join(repositoryRoot, "packages", "db", "migrations", "0009_workflow_definitions_versions_v1.sql"),
  "utf8"
);
const indexSource = readFileSync(join(repositoryRoot, "packages", "db", "src", "index.ts"), "utf8");

const tables = [
  "workflow_definitions",
  "workflow_versions",
  "workflow_instances",
  "workflow_instance_transitions",
  "workflow_approval_records",
  "workflow_configuration_audit_events"
];

test("workflow definition migration is additive, versioned and tenant scoped", () => {
  for (const table of tables) {
    assert.match(migration, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\b`, "u"));
    assert.match(migration, new RegExp(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`, "u"));
    assert.match(migration, new RegExp(`ALTER TABLE ${table} FORCE ROW LEVEL SECURITY`, "u"));
  }
  assert.doesNotMatch(migration, /DROP\s+(TABLE|COLUMN|TYPE)/iu);
  assert.doesNotMatch(migration, /ALTER\s+TABLE\s+workflow_(states|transitions|audit_events)/iu);
  assert.match(indexSource, /"0009_workflow_definitions_versions_v1\.sql"/u);
});

test("workflow versions are immutable after activation and preserve configuration identity", () => {
  assert.match(migration, /configuration_sha256\s+TEXT\s+GENERATED ALWAYS AS/iu);
  assert.match(migration, /prevent_active_workflow_version_mutation/iu);
  assert.match(migration, /Activated workflow versions are immutable/iu);
  assert.match(migration, /UNIQUE \(organization_id, workflow_definition_id, version\)/u);
});

test("workflow approvals are human-only and all configuration actions are auditable", () => {
  assert.match(migration, /workflow_roles_are_human/iu);
  assert.match(migration, /AI_AGENT/iu);
  assert.match(migration, /workflow_approval_records/iu);
  assert.match(migration, /workflow_configuration_audit_events/iu);
  assert.match(migration, /workflow_current_organization_id\(\)/u);
});
