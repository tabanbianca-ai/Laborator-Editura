import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migration = readFileSync(
  join(__dirname, "..", "migrations", "0003_qa_engine_v1.sql"),
  "utf8"
);

test("qa migration defines reports issues and audit tables", () => {
  assert.match(migration, /CREATE TABLE IF NOT EXISTS qa_reports/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS qa_issues/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS qa_audit_events/);
});

test("qa migration includes required checks and severities", () => {
  for (const issueType of [
    "MISSING_TARGET_TRANSLATION",
    "UNTRANSLATED_SEGMENT",
    "NUMBER_MISMATCH",
    "DATE_MISMATCH",
    "PUNCTUATION_MISMATCH",
    "REPEATED_SEGMENT",
    "TERMINOLOGY_VIOLATION",
    "FORBIDDEN_TERMINOLOGY_VARIANT",
    "EMPTY_TRANSLATION",
    "TOO_SHORT_TRANSLATION"
  ]) {
    assert.match(migration, new RegExp(`'${issueType}'`));
  }

  for (const severity of ["LOW", "MEDIUM", "HIGH", "CRITICAL"]) {
    assert.match(migration, new RegExp(`'${severity}'`));
  }
});

test("qa migration protects tenant data with RLS and role checks", () => {
  assert.match(migration, /ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /FORCE ROW LEVEL SECURITY/);
  assert.match(migration, /qa_current_organization_id\(\)/);
  assert.match(migration, /has_role\('ADMIN'\)/);
  assert.match(migration, /has_role\('TRANSLATOR'\)/);
});

test("qa migration includes audit actions", () => {
  for (const action of ["QA_RUN", "ISSUE_CREATED", "ISSUE_RESOLVED", "SCORE_RECALCULATED"]) {
    assert.match(migration, new RegExp(`'${action}'`));
  }
});
