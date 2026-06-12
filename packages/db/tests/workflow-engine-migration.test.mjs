import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migration = readFileSync(
  join(__dirname, "..", "migrations", "0005_workflow_engine_v1.sql"),
  "utf8"
);

test("workflow migration defines states transitions and audit tables", () => {
  assert.match(migration, /CREATE TABLE IF NOT EXISTS workflow_states/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS workflow_transitions/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS workflow_audit_events/);
});

test("workflow migration includes required statuses", () => {
  for (const status of [
    "DRAFT",
    "IN_TRANSLATION",
    "IN_QA",
    "IN_SEMANTIC_REVIEW",
    "IN_REVIEW",
    "APPROVED",
    "READY_FOR_EXPORT",
    "EXPORTED",
    "BLOCKED"
  ]) {
    assert.match(migration, new RegExp(`'${status}'`));
  }
});

test("workflow migration supports document and segment scope", () => {
  assert.match(migration, /CREATE TYPE workflow_scope AS ENUM/);
  assert.match(migration, /'DOCUMENT'/);
  assert.match(migration, /'SEGMENT'/);
  assert.match(migration, /workflow_states_scope_target/);
});

test("workflow migration protects tenant data with RLS and role checks", () => {
  assert.match(migration, /ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /FORCE ROW LEVEL SECURITY/);
  assert.match(migration, /workflow_current_organization_id\(\)/);
  assert.match(migration, /has_role\('ADMIN'\)/);
  assert.match(migration, /has_role\('REVIEWER'\)/);
  assert.match(migration, /has_role\('TRANSLATOR'\)/);
});

test("workflow migration restricts approval export states to authorized human roles", () => {
  assert.match(migration, /status IN \('APPROVED', 'READY_FOR_EXPORT', 'EXPORTED'\)/);
  assert.match(migration, /has_role\('ADMIN'\)/);
  assert.match(migration, /has_role\('REVIEWER'\)/);
});

test("workflow migration includes required audit actions", () => {
  for (const action of [
    "WORKFLOW_STARTED",
    "WORKFLOW_ADVANCED",
    "WORKFLOW_BLOCKED",
    "WORKFLOW_UNBLOCKED",
    "DOCUMENT_APPROVED",
    "READY_FOR_EXPORT",
    "DOCUMENT_EXPORTED"
  ]) {
    assert.match(migration, new RegExp(`'${action}'`));
  }
});
