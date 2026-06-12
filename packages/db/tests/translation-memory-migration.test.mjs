import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migration = readFileSync(
  join(__dirname, "..", "migrations", "0001_translation_memory_v1.sql"),
  "utf8"
);

test("translation memory migration defines core table columns", () => {
  for (const column of [
    "source_text text NOT NULL",
    "target_text text NOT NULL",
    "source_language varchar(16) NOT NULL",
    "target_language varchar(16) NOT NULL",
    "domain text",
    "confidence_score numeric(5, 4) NOT NULL",
    "approval_status translation_memory_approval_status NOT NULL",
    "created_by uuid NOT NULL",
    "created_at timestamptz NOT NULL"
  ]) {
    assert.match(migration, new RegExp(column.replace(/[()]/g, "\\$&")));
  }
});

test("translation memory migration protects tenant data with RLS and role checks", () => {
  assert.match(migration, /ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /FORCE ROW LEVEL SECURITY/);
  assert.match(migration, /translation_memory_current_organization_id\(\)/);
  assert.match(migration, /has_role\('ADMIN'\)/);
  assert.match(migration, /has_role\('TRANSLATOR'\)/);
});

test("translation memory migration only returns approved fuzzy matches", () => {
  assert.match(migration, /CREATE OR REPLACE FUNCTION search_translation_memory_matches/);
  assert.match(migration, /pg_trgm/);
  assert.match(migration, /tm\.approval_status = 'APPROVED'/);
  assert.match(migration, /similarity\(tm\.normalized_source_text, query\.normalized\)/);
});

test("translation memory migration includes audit events", () => {
  assert.match(migration, /CREATE TABLE IF NOT EXISTS translation_memory_audit_events/);
  assert.match(migration, /translation_memory_audit_action AS ENUM/);
  assert.match(migration, /'CREATE'/);
  assert.match(migration, /'UPDATE'/);
  assert.match(migration, /'APPROVE'/);
});
