import assert from "node:assert/strict";
import { randomUUID, createHash } from "node:crypto";
import { readFileSync, readdirSync, mkdtempSync } from "node:fs";
import { createRequire } from "node:module";
import { isAbsolute, join } from "node:path";
import { tmpdir } from "node:os";
import { spawn, spawnSync } from "node:child_process";
import test from "node:test";
import ts from "typescript";
import { prepareMigrationSource } from "../scripts/prepare-migration-source.mjs";
import { loadFinancialSource } from "../../../apps/api/tests/helpers/load-financial-source.mjs";

const adminUrl = process.env.LABORATOR_FINANCIAL_TEST_ADMIN_URL;
const appUrl = process.env.LABORATOR_FINANCIAL_TEST_DATABASE_URL;
const pgModule = process.env.LABORATOR_FINANCIAL_TEST_PG_MODULE;
const id = (number) => `00000000-0000-0000-0000-${String(number).padStart(12, "0")}`;
const hash = "a".repeat(64);
const financialTables = ["financial_operation", "ai_provider_tariff", "ai_budget_account", "ai_cost_reservation",
  "ai_budget_allocation", "ai_provider_attempt", "ai_financial_reconciliation_event", "financial_journal", "financial_ledger_entry", "ai_budget_projection"];

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
  await owner.query(`GRANT SELECT ON ai_execution_records TO "${app.username}"`);
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
    maximum_units: "100", maximum_input_tokens: "20", maximum_output_tokens: "20", expires_at: "2099-01-01T00:00:00Z", projection_id: id(68) });

  await unit.transaction(context, [], async (client) => {
    assert.equal((await client.query("SELECT has_role('ADMIN') AS allowed")).rows[0].allowed, true);
    await insert(client, "ai_provider_tariff", { id: id(9), organization_id: id(1), provider: "FIXTURE", model: "local", version: 1, currency: "EUR", monetary_scale: 6,
      input_units_per_million: "100", output_units_per_million: "200", effective_at: "2020-01-01T00:00:00Z", approved_by: id(3), source_sha256: hash });
    for (const number of [10, 26]) await insert(client, "ai_budget_account", { id: id(number), organization_id: id(1), source_budget_id: id(number + 100), source_sha256: hash,
      scope_kind: "ORGANIZATION", currency: "EUR", monetary_scale: 6, limit_units: "1000", limit_tokens: "1000", opening_consumed_units: "0", opening_consumed_tokens: "0",
      period_start: "2020-01-01T00:00:00Z", period_end: "2099-01-01T00:00:00Z", approved_by: id(3) });
    await insert(client, "ai_budget_projection", { id: id(68), organization_id: id(1), version: "1", source_sha256: hash,
      account_ids: [id(10), id(26)], actor_id: id(3), correlation_id: id(30) });
    await client.query("SELECT set_config('app.ai_budget_source_sha256',$1,true)", [hash]);
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
      await client.query("SELECT set_config('app.ai_budget_source_sha256',$1,true)", [hash]);
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

  await t.test("P0-B projection rejects duplicate, missing and foreign account references in PostgreSQL", async () => {
    await insert(owner, "ai_budget_account", { id: id(98), organization_id: id(2), source_budget_id: id(198), source_sha256: hash,
      scope_kind: "ORGANIZATION", currency: "EUR", monetary_scale: 6, limit_units: "1000", limit_tokens: "1000",
      opening_consumed_units: "0", opening_consumed_tokens: "0", period_start: "2020-01-01T00:00:00Z",
      period_end: "2099-01-01T00:00:00Z", approved_by: id(3) });
    for (const accounts of [[id(10), id(10)], [id(10), id(999)], [id(10), id(98)], [id(10), null]]) {
      await assert.rejects(unit.transaction(context, [], (client) => insert(client, "ai_budget_projection", {
        id: randomUUID(), organization_id: id(1), version: "999", source_sha256: hash,
        account_ids: accounts, actor_id: id(3), correlation_id: id(30)
      })), /Invalid, missing or foreign/u);
    }
    assert.equal((await owner.query("SELECT count(*)::integer AS n FROM ai_budget_projection WHERE version=999")).rows[0].n, 0);
  });

  await t.test("P0-B: independent processes enforce overlapping budgets and durable idempotent holds", async () => {
    const budgetModule = { exports: {} };
    const budgetCompiled = ts.transpileModule(readFileSync(new URL("../src/ai-budget-reservations.ts", import.meta.url), "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
    }).outputText;
    new Function("require", "module", "exports", budgetCompiled)(
      (name) => name === "./financial-persistence.js" ? module.exports : require(name), budgetModule, budgetModule.exports);
    const reservations = new budgetModule.exports.PostgresAiBudgetReservations(unit);
    await unit.transaction(context, [], (client) => insert(client, "ai_budget_account", {
      id: id(60), organization_id: id(1), source_budget_id: id(160), source_sha256: hash,
      scope_kind: "PROJECT", project_id: id(4), currency: "EUR", monetary_scale: 6,
      limit_units: "300", limit_tokens: "120", opening_consumed_units: "0", opening_consumed_tokens: "0",
      period_start: "2020-01-01T00:00:00Z", period_end: "2099-01-01T00:00:00Z", approved_by: id(3)
    }));
    for (const [number, scope, subject] of [[66, "USER", { user_id: id(3) }], [67, "AGENT", { agent_id: id(6) }]]) {
      await unit.transaction(context, [], (client) => insert(client, "ai_budget_account", {
        id: id(number), organization_id: id(1), source_budget_id: id(number + 100), source_sha256: hash,
        scope_kind: scope, ...subject, currency: "EUR", monetary_scale: 6, limit_units: "300", limit_tokens: "120",
        opening_consumed_units: "0", opening_consumed_tokens: "0", period_start: "2020-01-01T00:00:00Z",
        period_end: "2099-01-01T00:00:00Z", approved_by: id(3)
      }));
    }
    for (const number of [61, 62, 63]) await insert(owner, "ai_execution_records", {
      id: id(number), organization_id: id(1), user_id: id(3), agent_id: id(6), canonical_agent_id: "translation-agent",
      agent_version_id: id(35), configuration_sha256: hash, binding: "{}", project_id: id(4), document_id: null,
      resource: { type: "PROJECT", id: id(4) }, idempotency_key: `p0b-${number}`, request_hash: hash,
      correlation_id: id(30), status: "CREATED"
    });
    const projectionModule = { exports: {} };
    const projectionCompiled = ts.transpileModule(readFileSync(new URL("../src/ai-budget-projection.ts", import.meta.url), "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
    }).outputText;
    new Function("require", "module", "exports", projectionCompiled)(
      (name) => name === "./financial-persistence.js" ? module.exports : require(name), projectionModule, projectionModule.exports);
    const projector = new projectionModule.exports.PostgresAiBudgetProjection(unit);
    const rows = (await owner.query("SELECT * FROM ai_budget_account WHERE organization_id=$1 ORDER BY id", [context.organizationId])).rows;
    const snapshot = { sourceSha256: "b".repeat(64), validUntil: new Date(Date.now()+300000).toISOString(), quotas: [{ scope: "ORGANIZATION", subjectId: null,
      maximumUnits: "100", maximumTokens: null, runsPerDay: "100", runsPerMonth: "100", openingDayRuns: "0", openingMonthRuns: "0" }], accounts: rows.map((row) => ({
      sourceBudgetId: row.source_budget_id, sourceSha256: row.source_sha256, scope: row.scope_kind,
      subjectId: row.project_id ?? row.user_id ?? row.agent_id ?? null, currency: row.currency, scale: row.monetary_scale,
      limitUnits: row.limit_units, limitTokens: row.limit_tokens, openingUnits: row.opening_consumed_units,
      openingTokens: row.opening_consumed_tokens, periodStart: row.period_start.toISOString(), periodEnd: row.period_end.toISOString()
    })) };
    const projection = await projector.synchronize(context, snapshot, id(30));
    await assert.rejects(projector.synchronize(context, { ...snapshot, validUntil: "2000-01-01T00:00:00Z" }, id(30)), /STALE_POLICY_SNAPSHOT/u);
    assert.deepEqual(await projector.synchronize(context, snapshot, id(30)), projection);
    const request = (number) => ({ context, executionId: id(number), projectId: id(4), agentId: id(6), tariffId: id(9),
      agentVersionId: id(35), configurationSha256: hash,
      idempotencyKey: `p0b-${number}`, correlationId: id(30), maximum: { units: "100", currency: "EUR", scale: 6 },
      maximumInputTokens: "20", maximumOutputTokens: "20", expiresAt: new Date(Date.now() + 300000).toISOString(), projection });
    const commands = [request(61), request(62)];
    await assert.rejects(reservations.reserve({ ...request(63), projection: { id: id(68), sourceSha256: hash } }), /STALE_BUDGET_PROJECTION/u);
    await assert.rejects(reservations.reserve({ ...request(63), maximum: { units: "101", currency: "EUR", scale: 6 } }), /QUOTA_EXHAUSTED/u);
    await assert.rejects(reservations.reserve({ ...request(63), maximumInputTokens: "21" }), /BUDGET_EXHAUSTED/u);
    await assert.rejects(reservations.reserve({ ...request(63), expiresAt: "2000-01-01T00:00:00Z" }), /INVALID_RESERVATION_EXPIRY/u);
    await assert.rejects(reservations.reserve({ ...request(63), maximum: { units: "0", currency: "EUR", scale: 6 } }), /UNDERFUNDED_TARIFF/u);
    await assert.rejects(reservations.reserve({ ...request(63), context: { ...context, actorId: id(36) } }));
    const worker = `
      const {Pool}=require(${JSON.stringify(pgModule)});
      const first={exports:{}};new Function('require','module','exports',${JSON.stringify(compiled)})(require,first,first.exports);
      const second={exports:{}};new Function('require','module','exports',${JSON.stringify(budgetCompiled)})
        (n=>n==='./financial-persistence.js'?first.exports:require(n),second,second.exports);
      const pool=new Pool({connectionString:${JSON.stringify(app.toString())}});
      const engine=new second.exports.PostgresAiBudgetReservations(new first.exports.PostgresFinancialUnitOfWork(pool));
      engine.reserve(JSON.parse(process.argv[1])).then(value=>console.log(JSON.stringify({value})),
        error=>console.log(JSON.stringify({error:error.code||error.message}))).finally(()=>pool.end());`;
    const run = (command) => new Promise((resolve, reject) => {
      const child = spawn(process.execPath, ["-e", worker, JSON.stringify(command)], {
        stdio: ["ignore", "pipe", "pipe"], timeout: 15000
      });
      let stdout = ""; let stderr = "";
      child.stdout.on("data", (data) => { stdout += data; }); child.stderr.on("data", (data) => { stderr += data; });
      child.on("error", reject); child.on("exit", (code) => {
        if (code !== 0) reject(new Error(stderr)); else { try { resolve(JSON.parse(stdout)); } catch (error) { reject(error); } }
      });
    });
    const outcomes = await Promise.all(commands.map(run));
    assert.equal(outcomes.filter((result) => result.value).length, 1);
    const winner = outcomes.findIndex((result) => result.value);
    const loser = 1 - winner;
    assert.ok(["40001", "AI_BUDGET_EXHAUSTED"].includes(outcomes[loser].error));
    assert.deepEqual(await reservations.reserve(commands[winner]), outcomes[winner].value);
    await assert.rejects(reservations.reserve(commands[loser]), /BUDGET_EXHAUSTED/u);
    await assert.rejects(reservations.reserve({ ...commands[winner], maximumInputTokens: "19" }), /IDEMPOTENCY_CONFLICT/u);
    await assert.rejects(reservations.reserve({ ...request(63), context: { ...context, organizationId: id(2) } }));
    const held = outcomes[winner].value;
    assert.equal((await owner.query("SELECT count(*)::integer AS n FROM ai_budget_allocation WHERE reservation_id=$1", [held.reservationId])).rows[0].n, 5);
    const released = await reservations.releaseUndispatched(context, held.reservationId, "p0b-release", id(30));
    assert.deepEqual(await reservations.releaseUndispatched(context, held.reservationId, "p0b-release", id(30)), released);
    const second = await reservations.reserve(commands[loser]);
    // A persisted attempt represents an uncertain provider outcome, even without a response.
    await unit.transaction(context, [id(60)], async (client) => {
      const op = await unit.claimOperation(client, context, operation(64, "DISPATCH", "p0b-uncertain-attempt"));
      await insert(client, "ai_provider_attempt", { id: id(65), organization_id: id(1), reservation_id: second.reservationId,
        operation_id: op.id, attempt_number: 1, provider: "FIXTURE", tariff_id: id(9), currency: "EUR", monetary_scale: 6,
        maximum_units: "100", maximum_input_tokens: "20", maximum_output_tokens: "20", provider_idempotency_key: "p0b-attempt",
        request_sha256: hash });
    });
    await assert.rejects(reservations.releaseUndispatched(context, second.reservationId, "p0b-cancel", id(30)), /REQUIRES_RECONCILIATION/u);
    await assert.rejects(reservations.reserve(request(63)), /BUDGET_EXHAUSTED/u);
    const reduced = { ...snapshot, sourceSha256: "c".repeat(64), accounts: snapshot.accounts.map((account) => ({ ...account, limitUnits: "0" })) };
    const concurrentUpdate = await Promise.allSettled([
      projector.synchronize(context, reduced, id(30)), reservations.reserve(request(63))
    ]);
    assert.equal(concurrentUpdate[0].status, "fulfilled");
    assert.equal(concurrentUpdate[1].status, "rejected");
    const latest = concurrentUpdate[0].value;
    await assert.rejects(reservations.reserve(request(63)), /STALE_BUDGET_PROJECTION/u);
    await assert.rejects(reservations.reserve({ ...request(63), projection: latest }), /BUDGET_EXHAUSTED/u);
    await assert.rejects(projector.synchronize({ ...context, organizationId: id(2) }, snapshot, id(30)));
    assert.equal((await owner.query("SELECT count(*)::integer AS n FROM ai_budget_projection WHERE organization_id=$1", [id(1)])).rows[0].n, 3);
    const quotaProjection = await projector.synchronize(context, { ...snapshot, sourceSha256: "d".repeat(64),
      quotas: [{ ...snapshot.quotas[0], runsPerDay: "0" }] }, id(30));
    await assert.rejects(reservations.reserve({ ...request(63), projection: quotaProjection }), /QUOTA_EXHAUSTED/u);
    t.diagnostic("P0-B independent process contention: one reservation committed; replay survived process exit; uncertain attempt retains all capacity");
  });

  await t.test("configured financial pool rejects superuser principals and accepts the isolated least-privilege role", async () => {
    const { createFinancialPool } = loadFinancialSource("apps/api/src/modules/ai-governance/ai-financial-pool.ts");
    const previous = process.env.AI_FINANCIAL_DATABASE_URL;
    try {
      process.env.AI_FINANCIAL_DATABASE_URL = app.toString();
      const safe = createFinancialPool();
      try { const client = await safe.connect(); client.release(); } finally { await safe.end(); }
      process.env.AI_FINANCIAL_DATABASE_URL = admin.toString();
      const unsafe = createFinancialPool();
      try { await assert.rejects(unsafe.connect(), /UNSAFE_FINANCIAL_DATABASE_ROLE/u); } finally { await unsafe.end(); }
    } finally {
      if (previous === undefined) delete process.env.AI_FINANCIAL_DATABASE_URL; else process.env.AI_FINANCIAL_DATABASE_URL = previous;
    }
  });

  await t.test("real Governance source to PostgreSQL spending service preserves authority and idempotency", async () => {
    const { FileBackedRuntimeDatabase } = loadFinancialSource("packages/db/src/runtime-database.ts");
    const { DatabaseAiGovernanceRepository } = loadFinancialSource("apps/api/src/modules/ai-governance/ai-governance.repository.ts");
    const { AiSpendingService } = loadFinancialSource("apps/api/src/modules/ai-governance/ai-spending.service.ts");
    const directory = mkdtempSync(join(tmpdir(), "financial-governance-integration-"));
    const db = new FileBackedRuntimeDatabase(join(directory, "runtime.json"));
    const governanceRepository = new DatabaseAiGovernanceRepository(db);
    const now = new Date().toISOString();
    await governanceRepository.createBudget({ id: id(90), organizationId: id(1), budgetScope: "ORGANIZATION",
      amount: 1, currency: "EUR", period: "MONTHLY", humanApprovalRequired: true, createdBy: id(3), createdAt: now, updatedAt: now });
    governanceRepository.saveAgentRegistry({ id: id(6), organizationId: id(1), canonicalAgentId: "translation-agent", enabled: true,
      activeVersionId: id(35), createdBy: id(3), updatedBy: id(3) });
    governanceRepository.saveAgentVersion({ id: id(35), organizationId: id(1), registryId: id(6), status: "ACTIVE",
      approvedBy: id(3), activatedBy: id(3), configurationSha256: hash, validatedHandlerKeys: ["fixture"], bindings: [{ handlerKey: "fixture" }] });
    const spending = new AiSpendingService(governanceRepository, { connect: () => pool.connect() });
    const actor = { userId: id(3), organizationId: id(1), roles: ["ADMIN"], canonicalPermissions: ["platform.admin.manage"] };
    const task = { id: id(63), organizationId: id(1), userId: id(3), projectId: id(4), agentId: id(6), agentVersionId: id(35),
      canonicalAgentId: "translation-agent", correlationId: id(30), configurationSha256: hash, binding: { handlerKey: "fixture" } };
    const quote = { tariffId: id(9), maximum: { units: "100", currency: "EUR", scale: 6 }, maximumInputTokens: "20",
      maximumOutputTokens: "20", expiresAt: new Date(Date.now() + 300000).toISOString(), idempotencyKey: "source-to-pg-reserve" };
    let checks = 0;
    const authorize = async () => {
      checks++;
      await assert.rejects(governanceRepository.createBudget({ id: id(91), organizationId: id(1) }), /busy/u);
    };
    const first = await spending.reserve(actor, task, quote, authorize);
    assert.deepEqual(await spending.reserve(actor, task, quote, authorize), first);
    assert.equal(checks, 4);
    assert.equal(db.select("ai_cost_audit_events").filter((event) => event.action === "AI_SPENDING_RESERVED").length, 2);
    await assert.rejects(spending.reserve(actor, task, quote, async () => { throw new Error("NEED_TO_KNOW_REVOKED"); }), /REVOKED/u);
    governanceRepository.saveAgentRegistry({ ...governanceRepository.findAgentRegistry(id(1), "translation-agent"), enabled: false });
    await assert.rejects(spending.reserve(actor, task, quote, async () => {}), /Human-approved/u);
    assert.equal(db.select("ai_cost_audit_events").filter((event) => event.action === "AI_SPENDING_DENIED").length, 2);
    assert.equal((await owner.query("SELECT count(*)::integer AS n FROM ai_cost_reservation WHERE execution_id=$1", [id(63)])).rows[0].n, 1);
  });

  await t.test("pg_dump/pg_restore preserve financial tables and pass the financial verifier", async () => {
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
    t.diagnostic(`Financial archive=${archive}; SHA256=${digest}; all ${financialTables.length} table snapshots match`);
  });
});
