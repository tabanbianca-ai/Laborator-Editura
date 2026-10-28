import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import test from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const moduleRoot = join(root, "apps/api/src/modules/ai-governance");
function load(path, mocks = {}) {
  const output = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, experimentalDecorators: true }
  }).outputText;
  const module = { exports: {} };
  new Function("exports", "require", "module", output)(module.exports,
    (id) => Object.hasOwn(mocks, id) ? mocks[id] : require(id), module);
  return module.exports;
}
const governanceTypes = load(join(moduleRoot, "ai-governance.types.ts"));
const identity = load(join(moduleRoot, "ai-agent-identity.ts"), { "./ai-governance.types": governanceTypes });
const dbModule = load(join(root, "packages/db/src/runtime-database.ts"));
const mocks = { "@laborator/db": dbModule, "../runtime-database.provider": { RUNTIME_DATABASE: "runtime" } };
const repoModule = load(join(moduleRoot, "ai-governance.repository.ts"), mocks);
const handlerModule = load(join(moduleRoot, "ai-handler-registry.ts"));
const registryModule = load(join(moduleRoot, "ai-agent-registry.service.ts"), {
  "./ai-agent-identity": identity, "./ai-governance.repository": repoModule, "./ai-handler-registry": handlerModule
});
const costModule = load(join(moduleRoot, "ai-governance.service.ts"), {
  "./ai-governance.repository": repoModule, "./ai-governance.types": governanceTypes
});
const executionRepoModule = load(join(moduleRoot, "ai-execution.repository.ts"), mocks);
const { AiExecutionService } = load(join(moduleRoot, "ai-execution.service.ts"), {
  "./ai-agent-identity": identity, "./ai-governance.repository": repoModule,
  "./ai-governance.service": costModule, "./ai-handler-registry": handlerModule,
  "./ai-execution.repository": executionRepoModule,
  "../documents/documents.service": {}, "../workspace/workspace.service": {}, "../workflow/workflow.service": {}
});
const actor = { userId: "admin", organizationId: "org", roles: ["ADMIN"],
  canonicalPermissions: ["document.read"], permissions: ["read"] };
const binding = { capabilityId: "quality.metadata", operationId: "quality.validate-metadata",
  handlerKey: "quality.metadata.v1", inputSchemaRef: "quality.metadata.input.v1",
  outputSchemaRef: "quality.metadata.output.v1", requiredPermissions: ["document.read"] };
const input = { agentId: "quality-agent", operationId: binding.operationId,
  projectId: "project", documentId: "document", idempotencyKey: "request-1" };

async function harness(t) {
  const directory = mkdtempSync(join(tmpdir(), "ai-runtime-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const database = new dbModule.FileBackedRuntimeDatabase(join(directory, "runtime.json"));
  database.insert("organizations", { id: "org", name: "Test" });
  database.insert("projects", { id: "project", organizationId: "org" });
  database.insert("documents", { id: "document", projectId: "project", organizationId: "org" });
  const governanceRepo = new repoModule.DatabaseAiGovernanceRepository(database);
  const handlers = new handlerModule.AiHandlerRegistry();
  const registry = new registryModule.AiAgentRegistryService(governanceRepo, handlers);
  const version = await registry.createDraft(actor, "quality-agent", { bindings: [binding], reason: "Test" });
  const decision = { reason: "Human-approved", configurationSha256: version.configurationSha256 };
  await registry.approveVersion(actor, "quality-agent", version.id, decision);
  await registry.activateVersion(actor, "quality-agent", version.id, decision);
  const executionRepo = new executionRepoModule.AiExecutionRepository(database);
  const access = { decision: "ALLOW" };
  const workflow = { status: "IN_REVIEW" };
  const document = { id: "document", projectId: "project", title: "Book", originalLanguage: "fr" };
  const runtime = new AiExecutionService(executionRepo, governanceRepo,
    new costModule.AiGovernanceService(governanceRepo), handlers,
    { async getDocument(context, id) {
      assert.equal(context.organizationId, "org"); assert.equal(id, "document"); return document;
    } },
    { async evaluateNeedToKnowAccess(context, scope) {
      assert.equal(context.organizationId, "org"); assert.equal(scope.documentId, "document"); return access;
    } },
    { async getWorkflowStatus() { return workflow; } });
  return { runtime, registry, database, governanceRepo, executionRepo, handlers, access, workflow, document };
}

test("validated, human-activated handler executes a correlated, persisted lifecycle without editorial writes", async (t) => {
  const { runtime, registry, database } = await harness(t);
  assert.equal(registry.getAgent(actor, "quality-agent").availability.executable, true);
  const task = runtime.create(actor, input);
  assert.equal(runtime.create(actor, input).id, task.id);
  const before = database.select("documents");
  const completed = await runtime.execute(actor, task.id);
  assert.equal(completed.status, "COMPLETED");
  assert.equal(completed.result.humanApprovalRequired, true);
  assert.equal(completed.inputTokens, 0);
  assert.equal(completed.actualCost, 0);
  assert.ok(completed.correlationId);
  assert.deepEqual(database.select("documents"), before);
  assert.deepEqual(database.select("ai_operational_audit_events").map((event) => event.action),
    ["AI_TASK_CREATED", "AI_TASK_AUTHORIZED", "AI_TASK_RUNNING", "AI_TASK_COMPLETED"]);
  assert.equal(database.select("ai_usage_records").length, 1);
  await assert.rejects(runtime.execute(actor, task.id), /eligible/u);
  assert.throws(() => runtime.create(actor, { ...input, documentId: "other" }), /payload mismatch/u);
  const restored = new dbModule.FileBackedRuntimeDatabase(`${database.getPath()}.restored`);
  restored.restoreBackup(database.createBackup());
  assert.equal(restored.select("ai_execution_records")[0].status, "COMPLETED");
});

test("tenant, RBAC, need-to-know, workflow and inactive-agent checks deny execution", async (t) => {
  const h = await harness(t);
  const task = h.runtime.create(actor, input);
  assert.throws(() => h.runtime.get({ ...actor, organizationId: "other" }, task.id), /not found/u);
  assert.throws(() => h.runtime.create({ ...actor, roles: ["ADMIN", "AI_AGENT"] }, input), /human/u);
  const blocked = await h.runtime.execute({ ...actor, canonicalPermissions: [] }, task.id);
  assert.equal(blocked.status, "BLOCKED");
  for (const gate of ["access", "workflow", "disabled"]) {
    const next = h.runtime.create(actor, { ...input, idempotencyKey: gate });
    h.access.decision = gate === "access" ? "DENY" : "ALLOW";
    h.workflow.status = gate === "workflow" ? "BLOCKED" : "IN_REVIEW";
    if (gate === "disabled") await h.registry.disableAgent(actor, "quality-agent", { reason: "Test" });
    assert.equal((await h.runtime.execute(actor, next.id)).status, "BLOCKED");
  }
  assert.equal(h.database.select("ai_usage_records").length, 0);
});

test("quota and budget exhaustion fail closed before handler execution", async (t) => {
  const h = await harness(t);
  await h.governanceRepo.createQuota({ id: "quota", organizationId: "org", quotaScope: "ORGANIZATION", maxRunsPerDay: 0 });
  const task = h.runtime.create(actor, input);
  assert.equal((await h.runtime.execute(actor, task.id)).status, "BLOCKED");
  await h.governanceRepo.createBudget({ id: "budget", organizationId: "org", budgetScope: "ORGANIZATION",
    amount: 0, currency: "EUR", period: "MONTHLY" });
  const other = h.runtime.create(actor, { ...input, idempotencyKey: "budget" });
  assert.equal((await h.runtime.execute(actor, other.id)).status, "BLOCKED");
});

test("cancellation and exclusive execution prevent duplicate/concurrent invocation", async (t) => {
  const h = await harness(t);
  const cancelled = h.runtime.create(actor, input);
  assert.equal(h.runtime.cancel(actor, cancelled.id).status, "CANCELLED");
  await assert.rejects(h.runtime.execute(actor, cancelled.id), /eligible/u);
  const task = h.runtime.create(actor, { ...input, idempotencyKey: "run" });
  let release;
  const wait = new Promise((resolve) => { release = resolve; });
  let invoked;
  const started = new Promise((resolve) => { invoked = resolve; });
  h.handlers.execute = async () => { invoked(); await wait; return { readiness: "READY", issues: [], humanApprovalRequired: true }; };
  const running = h.runtime.execute(actor, task.id);
  await started;
  await assert.rejects(h.runtime.execute(actor, task.id), /eligible/u);
  h.runtime.cancel(actor, task.id);
  release();
  assert.equal((await running).status, "CANCELLED");
  assert.equal(h.runtime.get(actor, task.id).result, undefined);
});

test("unknown handlers and forged validation fields cannot create executable tasks", async (t) => {
  const h = await harness(t);
  assert.throws(() => h.runtime.create(actor, { ...input, handlerKey: "eval" }), /Invalid/u);
  assert.throws(() => h.runtime.create(actor, { ...input, operationId: "publish" }), /validated/u);
  const v = await h.registry.createDraft(actor, "quality-agent", {
    reason: "Unknown", bindings: [{ ...binding, handlerKey: "arbitrary.code" }]
  });
  const d = { reason: "Review", configurationSha256: v.configurationSha256 };
  await h.registry.approveVersion(actor, "quality-agent", v.id, d);
  await h.registry.activateVersion(actor, "quality-agent", v.id, d);
  assert.equal(h.registry.getAgent(actor, "quality-agent").availability.executable, false);
  assert.throws(() => h.runtime.create(actor, { ...input, idempotencyKey: "unknown" }), /validated/u);
});

test("handler failures produce sanitized evidence and failed usage without changing documents", async (t) => {
  const h = await harness(t);
  h.handlers.execute = async () => { throw new Error("CONFIDENTIAL_MANUSCRIPT_TEXT"); };
  const task = h.runtime.create(actor, input);
  const failed = await h.runtime.execute(actor, task.id);
  assert.equal(failed.status, "FAILED");
  assert.equal(failed.failureCode, "HANDLER_FAILED");
  assert.equal(h.database.select("ai_usage_records")[0].status, "FAILED");
  assert.ok(!JSON.stringify(h.database.createBackup()).includes("CONFIDENTIAL_MANUSCRIPT_TEXT"));
});

test("kill switches and stale active versions prevent handler invocation", async (t) => {
  const h = await harness(t);
  const task = h.runtime.create(actor, input);
  h.database.insert("ai_kill_switches", { id: "kill", organizationId: "org",
    targetType: "AGENT", targetId: "quality-agent", disabled: true });
  assert.equal((await h.runtime.execute(actor, task.id)).status, "BLOCKED");
  const next = h.runtime.create(actor, { ...input, idempotencyKey: "stale" });
  const version = await h.registry.createDraft(actor, "quality-agent", { bindings: [binding], reason: "New version" });
  const decision = { configurationSha256: version.configurationSha256, reason: "Approved" };
  await h.registry.approveVersion(actor, "quality-agent", version.id, decision);
  await h.registry.activateVersion(actor, "quality-agent", version.id, decision);
  assert.equal((await h.runtime.execute(actor, next.id)).status, "BLOCKED");
});

test("filesystem execution exclusion applies across repository instances", async (t) => {
  const h = await harness(t);
  const release = h.executionRepo.acquireExecution();
  const other = new executionRepoModule.AiExecutionRepository(
    new dbModule.FileBackedRuntimeDatabase(h.database.getPath()));
  assert.throws(() => other.acquireExecution(), /busy/u);
  release();
  const second = other.acquireExecution();
  second();
});
