import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migration = readFileSync(
  join(__dirname, "..", "migrations", "0004_semantic_fidelity_v1.sql"),
  "utf8"
);

test("semantic migration defines reports issues and audit tables", () => {
  assert.match(migration, /CREATE TABLE IF NOT EXISTS semantic_fidelity_reports/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS semantic_fidelity_issues/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS semantic_fidelity_audit_events/);
});

test("semantic migration includes required issue types and risk levels", () => {
  for (const issueType of [
    "MEANING_DRIFT",
    "UNJUSTIFIED_REINTERPRETATION",
    "OMITTED_MEANING",
    "ADDED_MEANING",
    "TERMINOLOGY_MEANING_CONFLICT",
    "CONTEXT_MISMATCH"
  ]) {
    assert.match(migration, new RegExp(`'${issueType}'`));
  }

  for (const risk of ["LOW", "MEDIUM", "HIGH", "CRITICAL"]) {
    assert.match(migration, new RegExp(`'${risk}'`));
  }
});

test("semantic migration protects tenant data with RLS and role checks", () => {
  assert.match(migration, /ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /FORCE ROW LEVEL SECURITY/);
  assert.match(migration, /semantic_fidelity_current_organization_id\(\)/);
  assert.match(migration, /has_role\('ADMIN'\)/);
  assert.match(migration, /has_role\('TRANSLATOR'\)/);
});

test("semantic migration includes audit actions and AI explanation fields", () => {
  for (const action of ["SEMANTIC_CHECK", "ISSUE_CREATED", "ISSUE_RESOLVED", "SCORE_RECALCULATED"]) {
    assert.match(migration, new RegExp(`'${action}'`));
  }

  assert.match(migration, /ai_explanation text/);
  assert.match(migration, /alternatives jsonb/);
});
