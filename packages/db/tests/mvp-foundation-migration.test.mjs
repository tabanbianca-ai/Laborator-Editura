import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migration = readFileSync(
  join(__dirname, "..", "migrations", "0000_mvp_foundation_v1.sql"),
  "utf8"
);

test("mvp foundation migration defines missing operational tables", () => {
  for (const table of [
    "organizations",
    "users",
    "user_roles",
    "auth_sessions",
    "projects",
    "documents",
    "document_segments",
    "segment_translations",
    "export_artifacts"
  ]) {
    assert.match(migration, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}`));
  }
});

test("mvp foundation migration provides has_role model required by RLS", () => {
  assert.match(migration, /CREATE OR REPLACE FUNCTION has_role\(role_name text\)/);
  assert.match(migration, /FROM user_roles/);
  assert.match(migration, /app.current_user_id/);
  assert.match(migration, /app.current_organization_id/);
});

test("mvp foundation migration protects tenant data with RLS", () => {
  assert.match(migration, /ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /FORCE ROW LEVEL SECURITY/);
  assert.match(migration, /mvp_current_organization_id\(\)/);
  assert.match(migration, /has_role\('ADMIN'\)/);
  assert.match(migration, /has_role\('REVIEWER'\)/);
  assert.match(migration, /has_role\('TRANSLATOR'\)/);
});

test("mvp foundation migration includes export artifact generation storage", () => {
  assert.match(migration, /CREATE TYPE export_format AS ENUM/);
  assert.match(migration, /'JSON_MASTER'/);
  assert.match(migration, /artifact jsonb NOT NULL/);
});

test("mvp foundation migration includes append-only foundation audit events", () => {
  assert.match(migration, /CREATE TYPE foundation_audit_action AS ENUM/);
  for (const action of ["CREATE", "UPDATE", "DELETE", "APPROVE", "EXPORT"]) {
    assert.match(migration, new RegExp(`'${action}'`));
  }
  assert.match(migration, /CREATE TABLE IF NOT EXISTS foundation_audit_events/);
  assert.match(migration, /actor_id uuid NOT NULL REFERENCES users\(id\)/);
  assert.match(migration, /before_state jsonb/);
  assert.match(migration, /after_state jsonb/);
});

test("mvp foundation audit events are tenant-scoped and append-only", () => {
  assert.match(migration, /ALTER TABLE foundation_audit_events ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /ALTER TABLE foundation_audit_events FORCE ROW LEVEL SECURITY/);
  assert.match(migration, /tenant_select_foundation_audit_policy/);
  assert.match(migration, /tenant_write_foundation_audit_policy/);
  assert.match(migration, /FOR INSERT/);
  assert.doesNotMatch(migration, /foundation_audit_events[\s\S]*FOR UPDATE/);
  assert.doesNotMatch(migration, /foundation_audit_events[\s\S]*FOR DELETE/);
});
