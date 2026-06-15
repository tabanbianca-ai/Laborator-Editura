import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migration = readFileSync(
  join(__dirname, "..", "migrations", "0007_founder_protection_v1.sql"),
  "utf8"
);
const indexSource = readFileSync(join(__dirname, "..", "src", "index.ts"), "utf8");

test("founder protection migration defines protected ownership tables", () => {
  assert.match(migration, /CREATE TABLE IF NOT EXISTS organization_founder_protection/);
  assert.match(migration, /founder_user_id uuid NOT NULL REFERENCES users\(id\)/);
  assert.match(migration, /protection_status text NOT NULL DEFAULT 'ACTIVE'/);
  assert.match(migration, /recovery_enabled boolean NOT NULL DEFAULT true/);
  assert.match(migration, /UNIQUE \(organization_id\)/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS founder_ownership_transfers/);
  assert.match(migration, /from_founder_user_id uuid NOT NULL REFERENCES users\(id\)/);
  assert.match(migration, /to_founder_user_id uuid NOT NULL REFERENCES users\(id\)/);
  assert.match(migration, /status text NOT NULL DEFAULT 'PENDING'/);
  assert.match(migration, /expires_at timestamptz NOT NULL DEFAULT \(now\(\) \+ interval '30 days'\)/);
});

test("founder protection migration is exposed in database package status", () => {
  assert.match(indexSource, /"0007_founder_protection_v1\.sql"/);
});

test("founder protection migration backfills an initial founder per organization", () => {
  assert.match(migration, /INSERT INTO organization_founder_protection/);
  assert.match(migration, /FROM organizations/);
  assert.match(migration, /FROM user_roles/);
  assert.match(migration, /ORDER BY user_roles\.created_at ASC, user_roles\.id ASC/);
  assert.match(migration, /ON CONFLICT \(organization_id\) DO NOTHING/);
});

test("founder protection migration adds founder-aware RLS", () => {
  assert.match(migration, /CREATE OR REPLACE FUNCTION is_current_founder\(\)/);
  assert.match(migration, /mvp_current_user_id\(\)/);
  assert.match(migration, /ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /FORCE ROW LEVEL SECURITY/);
  assert.match(migration, /founder_protection_select_policy/);
  assert.match(migration, /founder_protection_update_policy/);
  assert.match(migration, /founder_ownership_transfers_insert_policy/);
  assert.match(migration, /is_current_founder\(\)/);
  assert.match(migration, /founder_ownership_transfers_one_pending_idx/);
  assert.match(migration, /WHERE status = 'PENDING'/);
});

test("founder ownership transfer requires current founder and target acceptance paths", () => {
  assert.match(migration, /from_founder_user_id = mvp_current_user_id\(\)/);
  assert.match(migration, /requested_by = mvp_current_user_id\(\)/);
  assert.match(migration, /to_founder_user_id = mvp_current_user_id\(\)/);
  assert.match(migration, /expires_at > now\(\)/);
  assert.match(migration, /status IN \('PENDING', 'ACCEPTED', 'CANCELLED'\)/);
});
