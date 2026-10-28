import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(new URL("../migrations/0010_ai_agent_registry_versions_v1.sql", import.meta.url), "utf8");
test("operational agent migration preserves tenant boundaries and immutable approval snapshots", () => {
  for (const table of ["ai_agent_registry", "ai_agent_configuration_versions"]) {
    assert.match(migration, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\b`, "u"));
    assert.match(migration, new RegExp(`ALTER TABLE ${table} FORCE ROW LEVEL SECURITY`, "u"));
  }
  assert.match(migration, /UNIQUE \(organization_id, canonical_agent_id\)/u);
  assert.match(migration, /FOREIGN KEY \(organization_id, id, active_version_id\)/u);
  assert.match(migration, /Activated agent versions are immutable/u);
  assert.match(migration, /Only activation of an unchanged approved version is allowed/u);
  assert.match(migration, /approved_by IS NOT NULL AND approved_at IS NOT NULL/u);
  assert.match(migration, /NOT \(has_role\('AI_AGENT'\)/u);
  assert.doesNotMatch(migration, /DROP TABLE|TRUNCATE|DELETE FROM|INSERT INTO/iu);
});
