import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { loadFinancialSource as load } from "./helpers/load-financial-source.mjs";

const source = (file) => load(`apps/api/src/modules/ai-governance/${file}.ts`);
const { projectGovernanceBudgets, budgetMonetaryUnits } = source("ai-budget-policy-projection");
const { DatabaseAiGovernanceRepository } = source("ai-governance.repository");
const { AiSpendingService } = source("ai-spending.service");
const { FileBackedRuntimeDatabase } = load("packages/db/src/runtime-database.ts");
const { PostgresAiBudgetProjection } = load("packages/db/src/ai-budget-projection.ts");
const id = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, "0")}`;
const now = new Date("2026-10-30T10:00:00Z");
const budget = { id: id(1), organizationId: id(2), budgetScope: "ORGANIZATION", amount: 10.25, currency: "EUR", period: "MONTHLY",
  humanApprovalRequired: true, createdBy: id(3), createdAt: now.toISOString(), updatedAt: now.toISOString() };
const initial = { budgets: [budget], usage: [], quotas: [], policies: [], agents: [] };

test("Governance projection derives exact amounts, versions and every scope without inventing policies", () => {
  assert.equal(budgetMonetaryUnits(10.25), "10250000");
  assert.throws(() => budgetMonetaryUnits(0.0000001));
  const snapshot = projectGovernanceBudgets(id(2), initial, now);
  assert.equal(snapshot.accounts[0].limitUnits, "10250000");
  assert.deepEqual(projectGovernanceBudgets(id(2), JSON.parse(JSON.stringify(initial)), now), snapshot);
  assert.notEqual(projectGovernanceBudgets(id(2), { ...initial, budgets: [{ ...budget, amount: 5 }] }, now).sourceSha256, snapshot.sourceSha256);
  const multiple = projectGovernanceBudgets(id(2), { ...initial, agents: [{ id: id(9), canonicalAgentId: "translation-agent" }], budgets: [budget,
    { ...budget, id: id(4), budgetScope: "PROJECT", scopeRef: id(5) },
    { ...budget, id: id(6), budgetScope: "USER", scopeRef: id(3) },
    { ...budget, id: id(7), budgetScope: "AGENT", agentName: "Translation AI" }] }, now);
  assert.deepEqual(multiple.accounts.map((account) => account.scope), ["ORGANIZATION", "PROJECT", "USER", "AGENT"]);
  assert.equal(multiple.accounts[3].subjectId, id(9));
  assert.throws(() => projectGovernanceBudgets(id(8), initial, now), /FOREIGN/u);
  assert.throws(() => projectGovernanceBudgets(id(2), { ...initial, usage: [{ organizationId: id(2), createdAt: now.toISOString(), currency: "EUR", totalTokens: 5 }] }, now), /UNVERIFIED/u);
  const quota = projectGovernanceBudgets(id(2), { ...initial, quotas: [{ id: id(10), organizationId: id(2), quotaScope: "USER",
    scopeRef: id(3), maxTokensPerRun: 42, maxRunsPerDay: 3 }] }, now).quotas[0];
  assert.equal(quota.maximumTokens, "42");
  assert.equal(quota.runsPerDay, "3");
  assert.throws(() => projectGovernanceBudgets(id(2), { ...initial, budgets: [{ ...budget, period: "CUSTOM" }] }, now), /UNSUPPORTED/u);
});

test("canonical source fence blocks concurrent budget/usage writers and releases after failure", async (t) => {
  const directory = mkdtempSync(join(tmpdir(), "financial-source-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const db = new FileBackedRuntimeDatabase(join(directory, "runtime.json"));
  const first = new DatabaseAiGovernanceRepository(db);
  const second = new DatabaseAiGovernanceRepository(new FileBackedRuntimeDatabase(db.getPath()));
  await first.createBudget(budget);
  let startUnrelated;
  const unrelated = new Promise((resolve) => { startUnrelated = resolve; }).then(() => db.insert("documents", { id: "unrelated-document" }));
  await first.withFinancialSource(async (snapshot) => {
    startUnrelated();
    await assert.rejects(unrelated, /busy/u);
    assert.equal(snapshot.budgets.length, 1);
    await assert.rejects(second.createBudget({ ...budget, id: id(4) }), /busy/u);
    await assert.rejects(second.createUsageRecord({ id: id(5), organizationId: id(2) }), /busy/u);
    await assert.rejects(second.withFinancialSource(async () => {}, id(2)), /busy/u);
    const script = `import {loadFinancialSource} from ${JSON.stringify(new URL("./helpers/load-financial-source.mjs", import.meta.url).href)};
      const {FileBackedRuntimeDatabase}=loadFinancialSource('packages/db/src/runtime-database.ts');
      try {new FileBackedRuntimeDatabase(${JSON.stringify(db.getPath())}).insert('documents',{id:'foreign-process'});process.exitCode=1;}
      catch(error){if(!/busy/.test(error.message))throw error;console.log('BLOCKED');}`;
    const child = spawnSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8", timeout: 10000 });
    assert.equal(child.status, 0, child.stderr);
    assert.equal(child.stdout.trim(), "BLOCKED");
  }, id(2));
  await assert.rejects(first.withFinancialSource(async () => { throw new Error("rollback-test"); }, id(2)), /rollback-test/u);
  await second.createBudget({ ...budget, id: id(4) });
  assert.equal((await first.listBudgets(id(2))).length, 2);
  let resume; let detached;
  await db.withFinancialSource(async () => {
    detached = new Promise((resolve) => { resume = resolve; }).then(() => db.insert("documents", { id: "expired-context" }));
  });
  await db.withFinancialSource(async () => { resume(); await assert.rejects(detached, /busy/u); });
});

test("invalid projection period is rejected before opening a financial transaction", async () => {
  let transactions = 0;
  const projector = new PostgresAiBudgetProjection({ async transaction() { transactions++; throw new Error("unexpected transaction"); } });
  const snapshot = projectGovernanceBudgets(id(2), initial, now);
  for (const periodEnd of ["invalid", "2026-09-01T00:00:00Z"]) {
    await assert.rejects(projector.synchronize({ organizationId: id(2), actorId: id(3) }, {
      ...snapshot, accounts: snapshot.accounts.map((account) => ({ ...account, periodEnd }))
    }, id(4)), /INVALID_POLICY_ACCOUNT/u);
  }
  assert.equal(transactions, 0);
});

test("active cost policy ceilings cannot be bypassed by zero handler estimates or spend consent", () => {
  const policy = { id: id(20), organizationId: id(2), status: "ACTIVE",
    hardLimitMetadata: { maxCostPerRun: 0.5 }, approvalRequiredOverThreshold: 0.25 };
  const result = projectGovernanceBudgets(id(2), { ...initial, policies: [policy] }, now);
  assert.equal(result.quotas[0].maximumUnits, "249999");
  assert.equal(projectGovernanceBudgets(id(2), { ...initial, policies: [{ ...policy, approvalRequiredOverThreshold: 0 }] }, now)
    .quotas[0].runsPerDay, "0");
  assert.equal(projectGovernanceBudgets(id(2), { ...initial, policies: [{ ...policy, status: "DRAFT" }] }, now).quotas.length, 0);
  assert.throws(() => projectGovernanceBudgets(id(2), { ...initial, policies: [{ ...policy, organizationId: id(9) }] }, now), /FOREIGN_COST_POLICY/u);
  assert.throws(() => projectGovernanceBudgets(id(2), { ...initial, policies: [{ ...policy, hardLimitMetadata: { maxCostPerRun: "unknown" } }] }, now), /INVALID_POLICY_COST_LIMIT/u);
});

test("projection freshness ends at the next policy activation, expiry or UTC day boundary", () => {
  assert.equal(projectGovernanceBudgets(id(2), initial, now).validUntil, "2026-10-31T00:00:00.000Z");
  const future = { ...budget, id: id(21), budgetScope: "PROJECT", scopeRef: id(22), startsAt: "2026-10-30T10:01:00Z" };
  const before = projectGovernanceBudgets(id(2), { ...initial, budgets: [budget, future] }, now);
  assert.equal(before.validUntil, "2026-10-30T10:01:00.000Z");
  assert.equal(before.accounts.length, 1);
  const after = projectGovernanceBudgets(id(2), { ...initial, budgets: [budget, future] }, new Date("2026-10-30T10:02:00Z"));
  assert.equal(after.accounts.length, 2);
  assert.notEqual(before.sourceSha256, after.sourceSha256);
  assert.equal(projectGovernanceBudgets(id(2), { ...initial, budgets: [{ ...budget, endsAt: "2026-10-30T10:00:30Z" }] }, now)
    .validUntil, "2026-10-30T10:00:30.000Z");
});

test("spending principal denies ordinary, mixed agent, foreign and unprivileged actors before database access", async () => {
  let connections = 0;
  const audits = [];
  const repository = { async appendAuditEvent(event) { audits.push(event); } };
  const service = new AiSpendingService(repository, { async connect() { connections++; throw new Error("unexpected database access"); } });
  const task = { organizationId: id(2), userId: id(3) };
  const actor = { organizationId: id(2), userId: id(3), roles: ["ADMIN"], canonicalPermissions: ["platform.admin.manage"] };
  for (const candidate of [ { ...actor, roles: ["TRANSLATOR"] }, { ...actor, roles: ["ADMIN", "AI_AGENT"] },
    { ...actor, organizationId: id(9) }, { ...actor, canonicalPermissions: [] }, { ...actor, userId: id(8) }]) {
    await assert.rejects(service.reserve(candidate, task, {}, async () => {}), /authority/u);
  }
  assert.equal(connections, 0);
  await assert.rejects(new AiSpendingService(repository, null).reserve(actor, task, {}, async () => {}), /not configured/u);
  assert.equal(audits.length, 6);
  assert.ok(audits.every((event) => event.action === "AI_SPENDING_DENIED"));
});
