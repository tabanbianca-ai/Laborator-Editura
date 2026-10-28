import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const sql = readFileSync(new URL("../migrations/0011_ai_execution_runtime_v1.sql", import.meta.url), "utf8");
test("execution migration preserves identity, task lifecycle, audit and tenant boundaries", () => {
  for (const status of ["CREATED", "AUTHORIZED", "RUNNING", "COMPLETED", "FAILED", "CANCELLED", "BLOCKED"]) {
    assert.ok(sql.includes(`'${status}'`));
  }
  assert.match(sql, /UNIQUE \(organization_id, user_id, idempotency_key\)/u);
  assert.match(sql, /FOREIGN KEY \(organization_id, agent_id, agent_version_id\)/u);
  assert.match(sql, /Terminal task records are immutable/u);
  assert.match(sql, /Execution identity and request are immutable/u);
  assert.match(sql, /AI execution audit is append-only/u);
  assert.match(sql, /ALTER TABLE ai_execution_records FORCE ROW LEVEL SECURITY/u);
  assert.match(sql, /ALTER TABLE ai_operational_audit_events FORCE ROW LEVEL SECURITY/u);
  assert.doesNotMatch(sql, /DROP TABLE|TRUNCATE|DELETE FROM/iu);
});
