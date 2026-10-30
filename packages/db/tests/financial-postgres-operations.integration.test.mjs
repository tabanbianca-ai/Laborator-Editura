import assert from "node:assert/strict";
import { randomUUID, createHash } from "node:crypto";
import { readFileSync, readdirSync, mkdtempSync } from "node:fs";
import { createRequire } from "node:module";
import { isAbsolute, join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import test from "node:test";
import ts from "typescript";
import { prepareMigrationSource } from "../scripts/prepare-migration-source.mjs";

const adminUrl = process.env.LABORATOR_FINANCIAL_TEST_ADMIN_URL;
const appUrl = process.env.LABORATOR_FINANCIAL_TEST_DATABASE_URL;
const pgModule = process.env.LABORATOR_FINANCIAL_TEST_PG_MODULE;
const id = (number) => `00000000-0000-0000-0000-${String(number).padStart(12, "0")}`;
const hash = "a".repeat(64);
const financialTables = ["financial_operation", "ai_provider_tariff", "ai_budget_account", "ai_cost_reservation",
  "ai_budget_allocation", "ai_provider_attempt", "ai_financial_reconciliation_event", "financial_journal", "financial_ledger_entry"];

function localUrl(value) {
  const url = new URL(value);
  assert.ok(["postgres:", "postgresql:"].includes(url.protocol));
  assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(url.hostname));
  assert.match(url.pathname, /^\/(postgres|laborator_financial_test[a-z0-9_]*)$/u);
  return url;
}
async function insert(client, table, fields) {
  // All identifiers below are test-owned constants, never HTTP/user input.
  const names = Object.keys(fields);
  return client.query(`INSERT INTO ${table} (${names.join(",")}) VALUES (${names.map((_, i) => `$${i + 1}`).join(",")})`, Object.values(fields));
}

test("real PostgreSQL: financial transactions, real IAM/RLS, contention, immutable history and full backup/restore", {
  skip: adminUrl && appUrl && pgModule ? false : "Requires disposable local PostgreSQL, application role, pg driver and native backup tools.",
  timeout: 120000
}, async (t) => {
  const admin = localUrl(adminUrl);
  const app = localUrl(appUrl);
  assert.equal(admin.host, app.host, "All tests must use the same explicitly isolated cluster");
  assert.ok(isAbsolute(pgModule));
  const require = createRequire(import.meta.url);
  const { Client, Pool } = require(pgModule);
  const database = `laborator_financial_test_ops_${randomUUID().replaceAll("-", "")}`;
  const restoredDatabase = `laborator_financial_test_restored_${randomUUID().replaceAll("-", "")}`;
  const control = new Client({ connectionString: admin.toString() });
  await control.connect();
  try {
    await control.query(`CREATE DATABASE "${database}"`);
    await control.query(`CREATE DATABASE "${restoredDatabase}"`);
  } finally { await control.end(); }
  admin.pathname = `/${database}`;
  app.pathname = `/${database}`;
  const owner = new Client({ connectionString: admin.toString() });
  const application = new Client({ connectionString: app.toString() });
  await owner.connect();
  await application.connect();
  const pool = new Pool({ connectionString: app.toString(), max: 3 });
  t.after(async () => { await pool.end(); await application.end(); await owner.end(); });
  const directory = new URL("../migrations/", import.meta.url);
  for (const name of readdirSync(directory).filter((file) => /^\d{4}_.*\.sql$/u.test(file)).sort()) {
    const prepared = prepareMigrationSource(name, readFileSync(new URL(name, directory), "utf8"), { confirmedPending: true });
    await owner.query("BEGIN");
    try { await owner.query(prepared.sql); await owner.query("COMMIT"); }
    catch (error) { await owner.query("ROLLBACK"); throw error; }
  }
  const context = { organizationId: id(1), actorId: id(3) };
  for (const organization_id of [id(1), id(2)]) {
    await insert(owner, "organizations", { id: organization_id, name: "Isolated financial fixture" });
  }
  for (const user of [3, 36]) await insert(owner, "users", { id: id(user), email: `fixture-${user}@example.invalid`, display_name: "Fixture" });
  for (const [number, organization_id, user_id, role] of [[50, id(1), id(3), "ADMIN"], [51, id(2), id(3), "ADMIN"], [52, id(1), id(36), "VIEWER"]]) {
    await insert(owner, "user_roles", { id: id(number), organization_id, user_id, role });
  }
  await insert(owner, "projects", { id: id(4), organization_id: id(1), name: "Fixture", source_language: "fr", target_languages: ["ro"], domain: "LITERATURE", created_by: id(3) });
  await insert(owner, "ai_agent_registry", { id: id(6), organization_id: id(1), canonical_agent_id: "translation-agent", created_by: id(3), updated_by: id(3) });
  await insert(owner, "ai_agent_configuration_versions", { id: id(35), organization_id: id(1), registry_id: id(6), version: 1, revision: 1,
    governance_version: "1", configuration_sha256: hash, bindings: "[]", status: "DRAFT", reason: "Non-executable fixture", created_by: id(3), updated_by: id(3) });
  for (const number of [7, 40]) await insert(owner, "ai_execution_records", { id: id(number), organization_id: id(1), user_id: id(3), agent_id: id(6), canonical_agent_id: "translation-agent",
    agent_version_id: id(35), configuration_sha256: hash, binding: "{}", project_id: id(4), document_id: null, resource: { type: "PROJECT", id: id(4) },
    idempotency_key: `fixture-${number}`, request_hash: hash, correlation_id: id(30), status: "CREATED" });
  for (const table of financialTables) await owner.query(`GRANT SELECT, INSERT, UPDATE ON ${table} TO "${app.username}"`);
  const role = (await application.query("SELECT rolsuper,rolbypassrls FROM pg_roles WHERE rolname=current_user")).rows[0];
  assert.deepEqual(role, { rolsuper: false, rolbypassrls: false });

  const module = { exports: {} };
  const compiled = ts.transpileModule(readFileSync(new URL("../src/financial-persistence.ts", import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  new Function("require", "module", "exports", compiled)(require, module, module.exports);
  const { PostgresFinancialUnitOfWork } = module.exports;
  const executed = [];
  const unit = new PostgresFinancialUnitOfWork({ async connect() {
    const client = await pool.connect();
    return { async query(sql, parameters) { executed.push({ sql, parameters }); return client.query(sql, parameters); }, release(error) { client.release(error); } };
  } });
  const operation = (number, kind, key) => ({ id: id(number), owner: "AI_GOVERNANCE", kind, idempotencyKey: key,
    requestSha256: hash, correlationId: id(30), sourceReference: "local:financial-test" });
  const reserve = (number, operation_id, execution_id) => ({ id: id(number), organization_id: id(1), operation_id,
    execution_id, project_id: id(4), agent_id: id(6), tariff_id: id(9), currency: "EUR", monetary_scale: 6,
    maximum_units: "100", maximum_input_tokens: "20", maximum_output_tokens: "20", expires_at: "2099-01-01T00:00:00Z" });

  await unit.transaction(context, [], async (client) => {
    assert.equal((await client.query("SELECT has_role('ADMIN') AS allowed")).rows[0].allowed, true);
    await insert(client, "ai_provider_tariff", { id: id(9), organization_id: id(1), provider: "FIXTURE", model: "local", version: 1, currency: "EUR", monetary_scale: 6,
      input_units_per_million: "100", output_units_per_million: "200", effective_at: "2020-01-01T00:00:00Z", approved_by: id(3), source_sha256: hash });
    for (const number of [10, 26]) await insert(client, "ai_budget_account", { id: id(number), organization_id: id(1), source_budget_id: id(number + 100), source_sha256: hash,
      scope_kind: "ORGANIZATION", currency: "EUR", monetary_scale: 6, limit_units: "1000", limit_tokens: "1000", opening_consumed_units: "0", opening_consumed_tokens: "0",
      period_start: "2020-01-01T00:00:00Z", period_end: "2099-01-01T00:00:00Z", approved_by: id(3) });
    await unit.claimOperation(client, context, operation(8, "RESERVE", "seed-reserve"));
    await insert(client, "ai_cost_reservation", reserve(11, id(8), id(7)));
    await insert(client, "ai_budget_allocation", { id: id(12), organization_id: id(1), reservation_id: id(11), budget_account_id: id(10), currency: "EUR", monetary_scale: 6, reserved_units: "100", reserved_tokens: "40" });
    await unit.claimOperation(client, context, operation(16, "DISPATCH", "seed-dispatch"));
    await insert(client, "ai_provider_attempt", { id: id(17), organization_id: id(1), reservation_id: id(11), operation_id: id(16), attempt_number: 1,
      provider: "FIXTURE", tariff_id: id(9), currency: "EUR", monetary_scale: 6, maximum_units: "100", maximum_input_tokens: "20", maximum_output_tokens: "20",
      provider_idempotency_key: "local-attempt", request_sha256: hash });
    await unit.claimOperation(client, context, operation(18, "SETTLE", "seed-settle"));
    await insert(client, "ai_financial_reconciliation_event", { id: id(19), organization_id: id(1), reservation_id: id(11), attempt_id: id(17), operation_id: id(18), event_kind: "SETTLED",
      currency: "EUR", monetary_scale: 6, amount_units: "100", input_tokens: "10", output_tokens: "10", provider: "FIXTURE", provider_event_id: "local-event", evidence_sha256: hash, reason: "Fixture, no provider call" });
    await insert(client, "financial_journal", { id: id(20), organization_id: id(1), operation_id: id(18), subledger: "AI_EXPENSE", reconciliation_event_id: id(19), currency: "EUR", monetary_scale: 6 });
    for (const [number, side, account_code] of [[21, "DEBIT", "AI_EXPENSE"], [22, "CREDIT", "PROVIDER_PAYABLE"]]) {
      await insert(client, "financial_ledger_entry", { id: id(number), organization_id: id(1), journal_id: id(20), line_number: number - 20, account_code, side, amount_units: "100", currency: "EUR", monetary_scale: 6 });
    }
  });

  await t.test("real IAM and forced RLS deny missing context, ordinary users and foreign tenants", async () => {
    assert.equal((await application.query("SELECT count(*)::integer AS n FROM ai_budget_account")).rows[0].n, 0);
    for (const ctx of [{ ...context, organizationId: id(2) }, { ...context, actorId: id(36) }]) {
      await assert.rejects(unit.transaction(ctx, [id(10)], async () => { throw new Error("must not reach"); }), /SCOPE_UNAVAILABLE/u);
      await assert.rejects(unit.transaction(ctx, [], (client) => insert(client, "financial_operation", {
        id: randomUUID(), organization_id: id(1), actor_id: ctx.actorId, owner: "AI_GOVERNANCE", operation_kind: "RESERVE", idempotency_key: randomUUID(),
        request_sha256: hash, correlation_id: id(30), source_reference: "denied"
      })), (error) => error.code === "42501");
    }
    const settings = (await pool.query("SELECT current_setting('app.current_organization_id',true) AS tenant,current_setting('app.current_user_id',true) AS actor")).rows[0];
    assert.ok(!settings.tenant && !settings.actor);
  });

  await t.test("SERIALIZABLE, real account locks and duplicate reservation conflicts", async () => {
    let unlock; let entered;
    const firstEntered = new Promise((resolve) => { entered = resolve; });
    const hold = new Promise((resolve) => { unlock = resolve; });
    const command = operation(41, "RESERVE", "concurrent-reservation");
    const action = async (client) => {
      const receipt = await unit.claimOperation(client, context, command);
      if (receipt.created) {
        await insert(client, "ai_cost_reservation", reserve(42, receipt.id, id(40)));
        for (const [number, budget] of [[43, 10], [44, 26]]) await insert(client, "ai_budget_allocation", {
          id: id(number), organization_id: id(1), reservation_id: id(42), budget_account_id: id(budget), currency: "EUR", monetary_scale: 6, reserved_units: "100", reserved_tokens: "40"
        });
      }
      return receipt;
    };
    const first = unit.transaction(context, [id(26), id(10)], async (client) => {
      assert.equal((await client.query("SHOW transaction_isolation")).rows[0].transaction_isolation, "serializable");
      entered(); await hold; return action(client);
    });
    await firstEntered;
    const second = unit.transaction(context, [id(10), id(26)], action).then((value) => ({ value }), (error) => ({ error }));
    let waiting = false;
    try {
      for (let attempt = 0; attempt < 100; attempt++) {
        waiting = (await owner.query("SELECT EXISTS(SELECT 1 FROM pg_stat_activity WHERE datname=current_database() AND wait_event_type='Lock' AND query LIKE '%ai_budget_account%') AS waiting")).rows[0].waiting;
        if (waiting) break;
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
    } finally { unlock(); }
    const original = await first;
    const contender = await second;
    assert.equal(waiting, true, "Second real database transaction must wait on the account lock");
    assert.equal(original.created, true);
    if (contender.error) assert.equal(contender.error.code, "40001"); else assert.equal(contender.value.created, false);
    const retry = await unit.transaction(context, [id(10), id(26)], action);
    assert.deepEqual(retry, { id: command.id, created: false });
    t.diagnostic(`Concurrent reservation contender=${contender.error?.code ?? "IDEMPOTENT_REPLAY"}; explicit retry created=false`);
    assert.equal((await owner.query("SELECT count(*)::integer AS n FROM ai_cost_reservation WHERE execution_id=$1", [id(40)])).rows[0].n, 1);
    assert.ok(executed.filter((q) => q.sql.includes("ORDER BY id FOR UPDATE")).every((q) => q.parameters[1].join() === [...q.parameters[1]].sort().join()));
    await assert.rejects(unit.transaction(context, [], (client) => unit.claimOperation(client, context, { ...command, requestSha256: "b".repeat(64) })), /IDEMPOTENCY_CONFLICT/u);
  });

  await t.test("rollback and immutable financial ledger survive failed writes", async () => {
    await assert.rejects(unit.transaction(context, [], async (client) => {
      await unit.claimOperation(client, context, operation(45, "RELEASE", "rollback-real"));
      await insert(client, "financial_ledger_entry", { id: id(46), organization_id: id(1), journal_id: id(20), line_number: 3, account_code: "AI_EXPENSE", side: "DEBIT", amount_units: "1", currency: "EUR", monetary_scale: 6 });
    }), /sealed/u);
    assert.equal((await owner.query("SELECT count(*)::integer AS n FROM financial_operation WHERE id=$1", [id(45)])).rows[0].n, 0);
    await assert.rejects(owner.query("UPDATE financial_ledger_entry SET amount_units=99 WHERE id=$1", [id(21)]), /append-only/u);
    assert.equal((await owner.query("SELECT sealed FROM financial_journal WHERE id=$1", [id(20)])).rows[0].sealed, true);
  });

  await t.test("pg_dump/pg_restore preserve all nine financial tables and pass the financial verifier", async () => {
    const snapshot = async (client) => {
      const result = {};
      for (const table of financialTables) result[table] = (await client.query(`SELECT to_jsonb(t) AS row FROM ${table} t ORDER BY id`)).rows;
      return result;
    };
    const before = await snapshot(owner);
    assert.ok(financialTables.every((table) => before[table].length > 0));
    const directory = mkdtempSync(join(tmpdir(), "financial-pg-backup-"));
    const archive = join(directory, "financial.dump");
    const dump = spawnSync("pg_dump", ["--dbname", admin.toString(), "--format=custom", "--compress=0", "--file", archive], { encoding: "utf8", timeout: 30000 });
    assert.equal(dump.status, 0, dump.stderr);
    const digest = createHash("sha256").update(readFileSync(archive)).digest("hex");
    const target = new URL(admin); target.pathname = `/${restoredDatabase}`;
    const restore = spawnSync("pg_restore", ["--dbname", target.toString(), "--single-transaction", "--exit-on-error", archive], { encoding: "utf8", timeout: 30000 });
    assert.equal(restore.status, 0, restore.stderr);
    const verification = new Client({ connectionString: target.toString() });
    await verification.connect();
    try {
      await verification.query(readFileSync(new URL("../scripts/verify-financial-postgres.sql", import.meta.url), "utf8"));
      assert.deepEqual(await snapshot(verification), before);
      assert.deepEqual(await snapshot(owner), before, "Backup/restore must not alter source financial history");
      assert.equal((await owner.query("SELECT count(*)::integer AS n FROM ai_agent_registry WHERE enabled")).rows[0].n, 0);
      assert.equal((await owner.query("SELECT count(*)::integer AS n FROM ai_agent_configuration_versions WHERE status <> 'DRAFT'")).rows[0].n, 0);
    } finally { await verification.end(); }
    t.diagnostic(`Financial archive=${archive}; SHA256=${digest}; all nine table snapshots match`);
  });
});
