import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const sql = readFileSync(new URL("../migrations/0014_ai_financial_foundation_v1.sql", import.meta.url), "utf8");
const tables = ["financial_operation", "ai_provider_tariff", "ai_budget_account", "ai_cost_reservation",
  "ai_budget_allocation", "ai_provider_attempt", "ai_financial_reconciliation_event", "financial_journal", "financial_ledger_entry"];

test("P0-A adds nine tenant-scoped PostgreSQL tables without modifying legacy budgets or activating execution", () => {
  for (const table of tables) {
    assert.match(sql, new RegExp(`CREATE TABLE ${table} \\(`, "u"));
    assert.ok(sql.includes(`'${table}'`));
  }
  assert.match(sql, /ENABLE ROW LEVEL SECURITY/u);
  assert.match(sql, /FORCE ROW LEVEL SECURITY/u);
  assert.match(sql, /workflow_current_organization_id\(\)/u);
  assert.match(sql, /actor_id = workflow_current_user_id\(\)/u);
  assert.match(sql, /has_role\(''AUTOMATION''\)/u);
  assert.doesNotMatch(sql, /\b(DROP TABLE|DELETE FROM|TRUNCATE TABLE|DISABLE TRIGGER|SECURITY DEFINER)\b/iu);
  assert.doesNotMatch(sql, /ALTER TABLE ai_budgets|UPDATE ai_agent_registry/u);
  assert.ok(readFileSync(new URL("../src/index.ts", import.meta.url), "utf8").includes("0014_ai_financial_foundation_v1.sql"));
});

test("financial schema pins tenant, execution, currency, version and idempotency references", () => {
  assert.match(sql, /FOREIGN KEY \(organization_id, execution_id, project_id, agent_id\)/u);
  assert.match(sql, /FOREIGN KEY \(organization_id, reservation_id, attempt_id\)/u);
  assert.match(sql, /UNIQUE \(organization_id, idempotency_key\)/u);
  assert.match(sql, /UNIQUE \(organization_id, provider, provider_event_id\)/u);
  assert.match(sql, /CREATE UNIQUE INDEX ai_attempt_settled_once/u);
  assert.match(sql, /UNIQUE \(organization_id, reservation_id, budget_account_id\)/u);
  assert.match(sql, /request_sha256 ~ '\^\[a-f0-9\]\{64\}\$'/u);
  assert.match(sql, /REFERENCES ai_provider_tariff \(organization_id, id, currency, monetary_scale\)/u);
  assert.match(sql, /REFERENCES financial_journal \(organization_id, id, currency, monetary_scale\)/u);
  assert.doesNotMatch(sql, /\b(real|double precision|money)\b/iu);
});

test("financial ledger seals balanced journals at the transaction boundary and denies history changes", () => {
  assert.match(sql, /DEFERRABLE INITIALLY DEFERRED/gmu);
  assert.match(sql, /line_count < 2 OR balance <> 0/u);
  assert.match(sql, /amount_units::numeric/u);
  assert.match(sql, /BEFORE INSERT OR UPDATE OR DELETE ON financial_journal/u);
  assert.match(sql, /BEFORE UPDATE OR DELETE ON %I/u);
  assert.match(sql, /BEFORE TRUNCATE ON %I/u);
  assert.match(sql, /Journal unavailable or sealed/u);
  assert.match(sql, /UPDATE financial_journal SET sealed = true/u);
  assert.match(sql, /Financial subledger ownership mismatch/u);
  assert.match(sql, /same settled AI financial operation/u);
  assert.match(sql, /Journal amount differs from reconciled AI expense/u);
});

test("post-restore gate checks financial history separately from unchanged JSON runtime backup", () => {
  const verifier = readFileSync(new URL("../scripts/verify-financial-postgres.sql", import.meta.url), "utf8");
  for (const table of tables) assert.ok(verifier.includes(`'${table}'`));
  assert.match(verifier, /rolbypassrls/u);
  assert.match(verifier, /required_foreign_keys/u);
  assert.match(verifier, /g\.tgenabled IN \('O','A'\)/u);
  assert.match(verifier, /HAVING NOT j.sealed/u);
  assert.match(verifier, /Financial restore has unvalidated constraints/u);
  assert.doesNotMatch(verifier, /\b(INSERT INTO|UPDATE |DELETE FROM|DROP TABLE|TRUNCATE TABLE)\b/iu);
  const runtime = readFileSync(new URL("../src/runtime-database.ts", import.meta.url), "utf8");
  assert.ok(!runtime.includes('"ai_cost_reservation"'), "Do not silently create a second JSON financial store");
});
