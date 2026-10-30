import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
const module = { exports: {} };
const code = ts.transpileModule(readFileSync(new URL("../src/financial-persistence.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
new Function("require", "module", "exports", code)(require, module, module.exports);
const { PostgresFinancialUnitOfWork, financialRequestHash, financialUnits, assertBalancedFinancialLines } = module.exports;
const id = (digit) => `${digit.repeat(8)}-${digit.repeat(4)}-${digit.repeat(4)}-${digit.repeat(4)}-${digit.repeat(12)}`;
const context = { organizationId: id("1"), actorId: id("2") };
const operation = { id: id("3"), owner: "AI_GOVERNANCE", kind: "RESERVE", idempotencyKey: "test-reservation",
  requestSha256: financialRequestHash({ amount: "100", executionId: id("4") }), correlationId: id("5"), sourceReference: "test:quote-v1" };
function fixture(respond = () => ({ rows: [] })) {
  const calls = [];
  const releases = [];
  const client = { async query(sql, parameters) { calls.push({ sql, parameters }); return respond(sql, parameters); },
    release(error) { releases.push(error); } };
  return { calls, releases, client, unit: new PostgresFinancialUnitOfWork({ async connect() { return client; } }) };
}

test("financial money and ledger balancing use exact bigint, never floating point", () => {
  assert.equal(financialUnits("9007199254740993"), 9007199254740993n);
  for (const value of [1, "-1", "1.2", "01", "9223372036854775808", "1e3"]) assert.throws(() => financialUnits(value));
  const debit = { money: { units: "9007199254740993", currency: "EUR", scale: 6 }, side: "DEBIT" };
  const credit = { ...debit, side: "CREDIT" };
  assert.doesNotThrow(() => assertBalancedFinancialLines([debit, credit]));
  assert.throws(() => assertBalancedFinancialLines([debit]), /UNBALANCED/u);
  assert.throws(() => assertBalancedFinancialLines([debit, { ...credit, money: { ...credit.money, units: "1" } }]), /UNBALANCED/u);
  for (const money of [{ ...credit.money, currency: "USD" }, { ...credit.money, scale: 2 }, { ...credit.money, units: "0" }]) {
    assert.throws(() => assertBalancedFinancialLines([debit, { ...credit, money }]));
  }
});

test("financial request hashes are stable and reject ambiguous or unsafe representations", () => {
  assert.equal(financialRequestHash({ b: [1, "2"], a: true }), financialRequestHash({ a: true, b: [1, "2"] }));
  assert.notEqual(financialRequestHash({ amount: "10" }), financialRequestHash({ amount: "11" }));
  for (const value of [undefined, NaN, Infinity, 1.1, 9007199254740992, new Date(), { a: undefined }, new Array(1)]) {
    assert.throws(() => financialRequestHash(value));
  }
  const cycle = {}; cycle.self = cycle;
  assert.throws(() => financialRequestHash(cycle));
});

test("transaction adapter scopes tenant locally and locks all accounts in deterministic order", async () => {
  const f = fixture((sql, parameters) => ({ rows: sql.includes("FOR UPDATE") ? parameters[1].map((value) => ({ id: value })) : [] }));
  await f.unit.transaction(context, [id("7"), id("6"), id("7")], async () => "result");
  assert.equal(f.calls[0].sql, "BEGIN ISOLATION LEVEL SERIALIZABLE");
  assert.deepEqual(f.calls[1].parameters, [context.organizationId, context.actorId]);
  assert.match(f.calls[1].sql, /set_config.*true/u);
  const locks = f.calls.find((call) => call.sql.includes("FOR UPDATE"));
  assert.deepEqual(locks.parameters, [context.organizationId, [id("6"), id("7")]]);
  assert.match(locks.sql, /ORDER BY id FOR UPDATE$/u);
  assert.doesNotMatch(locks.sql, /SKIP LOCKED/u);
  assert.equal(f.calls.at(-2).sql, "SET CONSTRAINTS ALL IMMEDIATE");
  assert.equal(f.calls.at(-1).sql, "COMMIT");
  assert.deepEqual(f.releases, [undefined]);
});

test("missing or foreign account locks fail closed before executing any financial command", async () => {
  const f = fixture(); let invoked = false;
  await assert.rejects(f.unit.transaction(context, [id("6")], async () => { invoked = true; }), /SCOPE_UNAVAILABLE/u);
  assert.equal(invoked, false);
  assert.equal(f.calls.at(-1).sql, "ROLLBACK");
  await assert.rejects(f.unit.transaction({ ...context, organizationId: "invalid" }, [], async () => {}), /INVALID_FINANCIAL_ID/u);
});

test("operation conflicts, deferred constraint errors and serialization failures roll back without automatic retry", async () => {
  for (const failurePoint of ["INSERT INTO", "SET CONSTRAINTS", "COMMIT"]) {
    const f = fixture((sql) => { if (sql.startsWith(failurePoint)) throw new Error("transaction failure"); return { rows: [] }; });
    await assert.rejects(f.unit.transaction(context, [], async (client) => {
      if (failurePoint === "INSERT INTO") await f.unit.claimOperation(client, context, operation);
    }), /transaction failure/u);
    assert.equal(f.calls.at(-1).sql, "ROLLBACK");
    assert.equal(f.calls.filter((call) => call.sql.startsWith("BEGIN")).length, 1);
    assert.equal(f.releases.length, 1);
  }
});

test("idempotency returns the original operation only for matching tenant, actor, owner, kind and payload", async () => {
  const previous = { id: operation.id, actor_id: context.actorId, request_sha256: operation.requestSha256,
    owner: operation.owner, operation_kind: operation.kind };
  const f = fixture((sql) => ({ rows: sql.startsWith("SELECT id, request_sha256") ? [previous] : [] }));
  const receipt = await f.unit.transaction(context, [], (client) => f.unit.claimOperation(client, context, operation));
  assert.deepEqual(receipt, { id: operation.id, created: false });
  for (const override of [{ requestSha256: "f".repeat(64) }, { owner: "COMMERCE" }, { kind: "RELEASE" }]) {
    await assert.rejects(f.unit.transaction(context, [], (client) => f.unit.claimOperation(client, context, { ...operation, ...override })), /IDEMPOTENCY_CONFLICT/u);
  }
  await assert.rejects(f.unit.claimOperation(f.client, context, operation), /TRANSACTION_REQUIRED/u);
  await assert.rejects(f.unit.transaction(context, [], (client) => f.unit.claimOperation(client,
    { ...context, organizationId: id("9") }, operation)), /TRANSACTION_REQUIRED/u);
});

test("failed rollback invalidates the pooled connection", async () => {
  const f = fixture((sql) => { if (sql === "ROLLBACK") throw new Error("connection lost"); return { rows: [] }; });
  await assert.rejects(f.unit.transaction(context, [], async () => { throw new Error("original error"); }), /original error/u);
  assert.equal(f.releases[0].message, "FINANCIAL_TRANSACTION_CONNECTION_UNSAFE");
});

test("successful claim returns a single receipt and cannot escape its tenant transaction", async () => {
  const f = fixture((sql) => ({ rows: sql.startsWith("INSERT INTO") ? [{ id: operation.id }] : [] }));
  const receipt = await f.unit.transaction(context, [], (client) => f.unit.claimOperation(client, context, operation));
  assert.deepEqual(receipt, { id: operation.id, created: true });
  assert.equal(f.calls.filter((call) => call.sql.startsWith("INSERT INTO")).length, 1);
  assert.deepEqual(f.calls.find((call) => call.sql.startsWith("INSERT INTO")).parameters.slice(0, 3),
    [operation.id, context.organizationId, context.actorId]);
  await assert.rejects(f.unit.claimOperation(f.client, context, operation), /TRANSACTION_REQUIRED/u);
});
