import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migration = readFileSync(
  join(__dirname, "..", "migrations", "0008_security_hardening_phase_1.sql"),
  "utf8"
);
const indexSource = readFileSync(join(__dirname, "..", "src", "index.ts"), "utf8");

test("security hardening migration defines login attempt and security event tables", () => {
  assert.match(migration, /CREATE TABLE IF NOT EXISTS auth_login_attempts/);
  assert.match(migration, /failure_count integer NOT NULL DEFAULT 0/);
  assert.match(migration, /locked_until timestamptz/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS auth_security_events/);
  assert.match(migration, /LOGIN_FAILED/);
  assert.match(migration, /ACCOUNT_LOCKED/);
  assert.match(migration, /LOGIN_LOCKED/);
});

test("security hardening migration adds session expiration and idle tracking", () => {
  assert.match(migration, /ADD COLUMN IF NOT EXISTS last_seen_at timestamptz/);
  assert.match(migration, /created_at \+ interval '8 hours'/);
  assert.match(migration, /ALTER COLUMN expires_at SET DEFAULT \(now\(\) \+ interval '8 hours'\)/);
  assert.match(migration, /ALTER COLUMN last_seen_at SET DEFAULT now\(\)/);
  assert.match(migration, /auth_sessions_expiration_idx/);
});

test("security hardening migration is exposed in database package status", () => {
  assert.match(indexSource, /"0008_security_hardening_phase_1\.sql"/);
});
