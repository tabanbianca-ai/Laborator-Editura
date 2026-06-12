import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migration = readFileSync(
  join(__dirname, "..", "migrations", "0002_terminology_glossary_v1.sql"),
  "utf8"
);

test("terminology migration defines required table columns", () => {
  for (const column of [
    "language varchar(16) NOT NULL",
    "domain text",
    "source terminology_source NOT NULL",
    "term text NOT NULL",
    "definition text",
    "approved_translation text",
    "forbidden_variants text[] NOT NULL",
    "preferred_variants text[] NOT NULL",
    "notes text",
    "status terminology_term_status NOT NULL",
    "created_by uuid NOT NULL"
  ]) {
    assert.ok(migration.includes(column), `${column} should be present`);
  }
});

test("terminology migration includes all required term statuses", () => {
  for (const status of ["PROPOSED", "UNDER_REVIEW", "VALIDATED", "SUSPENDED", "ARCHIVED"]) {
    assert.match(migration, new RegExp(`'${status}'`));
  }
});

test("terminology migration protects tenant data with RLS and role checks", () => {
  assert.match(migration, /ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /FORCE ROW LEVEL SECURITY/);
  assert.match(migration, /terminology_current_organization_id\(\)/);
  assert.match(migration, /has_role\('ADMIN'\)/);
  assert.match(migration, /has_role\('TRANSLATOR'\)/);
});

test("terminology migration includes search function and validated priority", () => {
  assert.match(migration, /CREATE OR REPLACE FUNCTION search_terminology_terms/);
  assert.match(migration, /pg_trgm/);
  assert.match(migration, /CASE WHEN term\.status = 'VALIDATED' THEN 0 ELSE 1 END/);
});

test("terminology migration includes audit events", () => {
  assert.match(migration, /CREATE TABLE IF NOT EXISTS terminology_audit_events/);
  for (const action of ["CREATE", "UPDATE", "VALIDATE", "SUSPEND", "ARCHIVE"]) {
    assert.match(migration, new RegExp(`'${action}'`));
  }
});
