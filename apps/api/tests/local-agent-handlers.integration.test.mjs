import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import test from "node:test";
import ts from "typescript";
import { validateBackup } from "../../../packages/db/scripts/runtime-backup-lib.mjs";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const cache = new Map();
function load(path) {
  path = resolve(path);
  if (cache.has(path)) return cache.get(path).exports;
  const module = { exports: {} };
  cache.set(path, module);
  try {
    const output = ts.transpileModule(readFileSync(path, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
        experimentalDecorators: true, esModuleInterop: true }
    }).outputText;
    new Function("exports", "require", "module", output)(module.exports, (id) => {
      if (id.startsWith(".")) {
        const candidate = resolve(dirname(path), id);
        if (existsSync(`${candidate}.ts`)) return load(`${candidate}.ts`);
        if (existsSync(join(candidate, "index.ts"))) return load(join(candidate, "index.ts"));
      }
      if (id === "@laborator/db") return load(join(root, "packages/db/src/runtime-database.ts"));
      // CI runs API tests before workspace builds; load the real shared sources too.
      if (id === "@laborator/shared") return load(join(root, "packages/shared/src/index.ts"));
      return require(id);
    }, module);
    return module.exports;
  } catch (error) {
    // Failed evaluation must not leave partial exports cached for later tests.
    cache.delete(path);
    throw error;
  }
}
const moduleClass = (module, file, name) => load(join(root, `apps/api/src/modules/${module}/${file}.ts`))[name];
const { FileBackedRuntimeDatabase } = load(join(root, "packages/db/src/runtime-database.ts"));
const admin = { userId: "owner", organizationId: "org", roles: ["ADMIN"],
  permissions: ["read", "admin:manage"], canonicalPermissions: ["project.read", "document.read", "segment.read", "translation.read", "translation.write"] };
const member = { ...admin, userId: "author", roles: ["AUTHOR"], permissions: ["read"] };
const now = "2026-01-01T00:00:00.000Z";
const protectedTables = ["projects", "documents", "author_manuscripts", "author_manuscript_sections",
  "author_drafts", "research_sources", "lexicographic_sources", "workflow_states", "workflow_versions",
  "scheduling_tasks", "scheduling_events"];
const snapshot = (db) => Object.fromEntries(protectedTables.map((table) => [table, db.select(table)]));

async function harness(t, linguistic = false) {
  const directory = mkdtempSync(join(tmpdir(), "local-handlers-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const db = new FileBackedRuntimeDatabase(join(directory, "runtime.json"));
  db.insert("organizations", { id: "org", name: "Isolated" });
  db.insert("organizations", { id: "other-org", name: "Other" });
  const project = { id: "project", organizationId: "org", name: "Book", originalLanguage: "fr",
    publicationType: "BOOK", editorialDomain: "LITERATURE", projectIdentity: { projectOrigin: "ORIGINAL_CREATION" },
    editorialProcess: ["IMPORT", "REVIEW", "EDITORIAL_VALIDATION", "FINAL_APPROVAL"], status: "ACTIVE", updatedAt: now };
  db.insert("projects", project);
  db.insert("documents", { id: "document", organizationId: "org", projectId: "project",
    title: "Book", originalLanguage: "fr", updatedAt: now });
  db.insert("workflow_states", { id: "workflow", organizationId: "org", projectId: "project",
    documentId: "document", scope: "DOCUMENT", status: "IN_REVIEW", createdBy: "owner", createdAt: now, updatedAt: now });
  db.insert("author_manuscripts", { id: "manuscript", organizationId: "org", projectId: "project",
    authorId: "author", title: "Draft", updatedAt: now });
  db.insert("author_manuscript_sections", { id: "section", organizationId: "org", manuscriptId: "manuscript",
    title: "Chapter", orderIndex: 1, updatedAt: now });
  db.insert("author_drafts", { id: "draft", organizationId: "org", manuscriptId: "manuscript",
    sectionId: "section", content: "PRIVATE ORIGINAL", version: 1, wordCount: 2, characterCount: 16 });
  db.insert("research_sources", { id: "source", organizationId: "org", title: "Reference", author: "Writer",
    language: "fr", citation: "Writer, Reference", visibility: "PRIVATE", createdBy: "author",
    ecosystemReferences: [{ module: "TRANSLATION", entityId: "project" }], updatedAt: now });
  db.insert("lexicographic_sources", { id: "dictionary", organizationId: "org", enabled: true,
    projectId: "project", sourceLanguages: ["fr"], language: "fr", version: "1", createdAt: now });
  db.insert("scheduling_tasks", { id: "scheduled", organizationId: "org", projectId: "project", createdBy: "author",
    dependencies: ["missing"], dueAt: now, approvalStatus: "PENDING_HUMAN_APPROVAL", version: 1 });
  db.insert("scheduling_events", { id: "event", organizationId: "org", projectId: "project", createdBy: "author",
    startsAt: now, version: 1 });
  db.insert("workspace_need_to_know_grants", { id: "grant", organizationId: "org", projectId: "project",
    userId: "author", role: "COLLABORATOR", status: "ACTIVE", temporary: false,
    accessScope: { manuscriptIds: ["manuscript"], linguisticSourceIds: ["source", "dictionary"], documentIds: ["document"] },
    permittedTools: [], grantedBy: "owner", grantedAt: now });

  const make = (module, repoFile, repoName, serviceFile, serviceName, ...dependencies) =>
    new (moduleClass(module, serviceFile, serviceName))(
      new (moduleClass(module, repoFile, repoName))(db), ...dependencies);
  const projects = make("projects", "projects.repository", "DatabaseProjectsRepository", "projects.service", "ProjectsService");
  const documents = make("documents", "documents.repository", "DatabaseDocumentsRepository", "documents.service", "DocumentsService", projects);
  const manuscripts = make("author-studio", "author-studio.repository", "DatabaseAuthorStudioRepository", "author-studio.service", "AuthorStudioService");
  const research = make("research", "research.repository", "DatabaseResearchRepository", "research.service", "ResearchService");
  const lexicographic = make("lexicographic", "lexicographic.repository", "DatabaseLexicographicRepository", "lexicographic.service", "LexicographicService");
  const scheduling = make("scheduling", "scheduling.repository", "DatabaseSchedulingRepository", "scheduling.service", "SchedulingService");
  const workspace = make("workspace", "workspace.repository", "DatabaseWorkspaceRepository", "workspace.service", "WorkspaceService");
  const workflowRepo = new (moduleClass("workflow", "workflow.repository", "InMemoryWorkflowRepository"))(db);
  const definitions = new (moduleClass("workflow", "workflow-definition.service", "WorkflowDefinitionService"))(
    workflowRepo, new (moduleClass("workflow", "workflow-rule-evaluator", "WorkflowRuleEvaluator"))(), projects, documents);
  const workflow = new (moduleClass("workflow", "workflow.service", "WorkflowService"))(workflowRepo, projects, documents, {}, {});
  const adapters = [
    new (moduleClass("projects", "projects-agent.adapter", "ProjectsAgentAdapter"))(projects),
    new (moduleClass("author-studio", "manuscripts-agent.adapter", "ManuscriptsAgentAdapter"))(manuscripts),
    new (moduleClass("research", "documentation-agent.adapter", "DocumentationAgentAdapter"))(research, lexicographic, workspace),
    new (moduleClass("scheduling", "planning-agent.adapter", "PlanningAgentAdapter"))(scheduling, projects, definitions)
  ];
  const governanceRepo = new (moduleClass("ai-governance", "ai-governance.repository", "DatabaseAiGovernanceRepository"))(db);
  const governance = new (moduleClass("ai-governance", "ai-governance.service", "AiGovernanceService"))(governanceRepo);
  let linguisticServices;
  if (linguistic) {
    const segments = make("segments", "segments.repository", "DatabaseSegmentsRepository", "segments.service", "SegmentsService", documents);
    const terminology = make("terminology", "terminology.repository", "InMemoryTerminologyRepository", "terminology.service", "TerminologyService", lexicographic);
    const memory = make("translation-memory", "translation-memory.repository", "InMemoryTranslationMemoryRepository", "translation-memory.service", "TranslationMemoryService");
    const qa = make("qa", "qa.repository", "InMemoryQaRepository", "qa.service", "QaService", terminology);
    const semantic = make("semantic-fidelity", "semantic-fidelity.repository", "InMemorySemanticFidelityRepository", "semantic-fidelity.service", "SemanticFidelityService", lexicographic, terminology, memory, qa);
    const provider = new (moduleClass("ai-governance", "ai-translation-provider.service", "AiTranslationProviderService"))(governance);
    const translations = make("translations", "translations.repository", "DatabaseTranslationsRepository", "translations.service", "TranslationsService",
      segments, documents, lexicographic, memory, terminology, qa, semantic, workflow, provider);
    const adapter = new (moduleClass("translations", "linguistic-agent.adapter", "LinguisticAgentAdapter"))(
      segments, documents, workspace, terminology, lexicographic, memory, semantic, translations);
    adapters.push(adapter);
    linguisticServices = { segments, terminology, memory, semantic, translations, provider, adapter };
    db.insert("document_segments", { id: "segment", organizationId: "org", projectId: "project", documentId: "document",
      sourceText: "La connaissance et la raison nous permettent de comprendre le monde et de progresser ensemble.",
      latestTargetText: "Cunoaștere.", sourceLanguage: "fr", targetLanguage: "ro", targetLocale: "ro-RO",
      status: "TRANSLATED", order: 1, createdBy: "author", createdAt: now, updatedAt: now });
    const grant = db.select("workspace_need_to_know_grants")[0];
    db.upsert("workspace_need_to_know_grants", { ...grant, accessScope: { ...grant.accessScope, segmentIds: ["segment"] } });
  }
  const handlers = new (moduleClass("ai-governance", "ai-handler-registry", "AiHandlerRegistry"))(...adapters);
  const registry = new (moduleClass("ai-governance", "ai-agent-registry.service", "AiAgentRegistryService"))(governanceRepo, handlers);
  const executionRepo = new (moduleClass("ai-governance", "ai-execution.repository", "AiExecutionRepository"))(db);
  const runtime = new (moduleClass("ai-governance", "ai-execution.service", "AiExecutionService"))(executionRepo, governanceRepo,
    governance,
    handlers, documents, workspace, workflow);
  const descriptors = adapters.flatMap((adapter) => adapter.descriptors());
  const bindingFor = (descriptor) => ({ handlerKey: descriptor.id, capabilityId: descriptor.capabilityId,
    operationId: descriptor.operationId, inputSchemaRef: descriptor.inputSchemaRef,
    outputSchemaRef: descriptor.outputSchemaRef, requiredPermissions: descriptor.requiredPermissions });
  for (const descriptor of descriptors) {
    if (descriptor.availability) continue;
    const version = await registry.createDraft(admin, descriptor.agentId, { bindings: [bindingFor(descriptor)], reason: "Test configuration" });
    const decision = { configurationSha256: version.configurationSha256, reason: "Explicit human approval" };
    await registry.approveVersion(admin, descriptor.agentId, version.id, decision);
    await registry.activateVersion(admin, descriptor.agentId, version.id, decision);
  }
  const request = (agentId, key = agentId) => {
    const descriptor = descriptors.find((item) => item.agentId === agentId);
    const ids = { PROJECT: "project", MANUSCRIPT: "manuscript", LINGUISTIC_SOURCE: "source" };
    return { agentId, operationId: descriptor.operationId, projectId: "project",
      resource: { type: descriptor.resourceScope, id: descriptor.resourceScope === "DOCUMENT" ? "document" : ids[descriptor.resourceScope] }, idempotencyKey: key,
      ...(linguistic && agentId.endsWith("subagent") && ["terminology-lexicography-subagent", "semantic-fidelity-subagent"].includes(agentId) ? { segmentId: "segment" } : {}) };
  };
  return { db, runtime, registry, handlers, adapters, descriptors, bindingFor, request, projects, governanceRepo, linguisticServices };
}

for (const agentId of ["coordinator-agent", "projects-agent", "manuscripts-agent", "documentation-agent", "planning-coordination-subagent"]) {
  test(`${agentId} executes through real services, persists provenance and preserves all analyzed resources`, async (t) => {
    const h = await harness(t);
    const before = snapshot(h.db);
    const task = h.runtime.create(member, h.request(agentId));
    const completed = await h.runtime.execute(member, task.id);
    assert.equal(completed.status, "COMPLETED");
    assert.equal(completed.result.humanApprovalRequired, true);
    assert.ok(completed.result.provenance.length);
    assert.ok(!JSON.stringify(completed.result).includes("PRIVATE ORIGINAL"));
    assert.deepEqual(snapshot(h.db), before);
    assert.equal((await h.runtime.read(member, task.id)).status, "COMPLETED");
    assert.equal(h.db.select("ai_usage_records")[0].actualCost, 0);
    const audit = h.db.select("ai_operational_audit_events");
    assert.deepEqual(audit.map((event) => event.action),
      ["AI_TASK_CREATED", "AI_TASK_AUTHORIZED", "AI_TASK_RUNNING", "AI_TASK_COMPLETED"]);
    assert.ok(audit.every((event) => event.correlationId === completed.correlationId));
    if (agentId === "coordinator-agent") assert.ok(completed.result.plan.some((step) => step.blocked));
    if (agentId === "manuscripts-agent") assert.ok(completed.result.provenance.some((item) => item.resourceId === "draft"));
    if (agentId === "documentation-agent") assert.equal(completed.result.metrics.matchingResourceCount, 1);
    const restore = new FileBackedRuntimeDatabase(`${h.db.getPath()}.restored`);
    restore.restoreBackup(h.db.createBackup());
    assert.deepEqual(restore.select("ai_execution_records")[0].result, completed.result);
  });
}

test("cross-tenant and unauthorized source/manuscript resources are denied by actual services", async (t) => {
  const h = await harness(t);
  assert.throws(() => h.runtime.create({ ...member, organizationId: "other-org" }, h.request("projects-agent")), /activated/u);
  h.db.insert("author_manuscripts", { id: "private", organizationId: "org", projectId: "project",
    authorId: "someone-else", updatedAt: now });
  h.db.insert("research_sources", { id: "private-source", organizationId: "org", createdBy: "someone-else",
    visibility: "PRIVATE", ecosystemReferences: [{ module: "TRANSLATION", entityId: "project" }], updatedAt: now });
  for (const [agent, id] of [["manuscripts-agent", "private"], ["documentation-agent", "private-source"]]) {
    const request = h.request(agent);
    request.resource.id = id;
    const task = h.runtime.create(member, request);
    assert.equal((await h.runtime.execute(member, task.id)).status, "BLOCKED");
  }
  const mismatch = h.request("projects-agent", "mismatch");
  mismatch.resource.id = "another-project";
  const task = h.runtime.create(member, mismatch);
  assert.equal((await h.runtime.execute(member, task.id)).status, "BLOCKED");
});

test("completed reports are protected after permissions or grants are revoked, including idempotent create", async (t) => {
  const h = await harness(t);
  const request = h.request("projects-agent");
  const task = h.runtime.create(member, request);
  await h.runtime.execute(member, task.id);
  await assert.rejects(h.runtime.read({ ...member, canonicalPermissions: [] }, task.id));
  const grant = h.db.select("workspace_need_to_know_grants")[0];
  h.db.upsert("workspace_need_to_know_grants", { ...grant, status: "REVOKED" });
  await assert.rejects(h.runtime.read(member, task.id));
  assert.equal(h.runtime.create(member, request).result, undefined);
  const other = h.runtime.create(member, h.request("projects-agent", "after-revocation"));
  assert.equal((await h.runtime.execute(member, other.id)).status, "BLOCKED");
});

test("runtime reservation preparation requires explicit consent and rechecks Need-to-Know without running a handler", async (t) => {
  const h = await harness(t);
  const task = h.runtime.create(member, h.request("projects-agent", "reservation-contract"));
  const input = { explicitSpendingAuthorization: true, tariffId: "00000000-0000-4000-8000-000000000009",
    maximum: { units: "100", currency: "EUR", scale: 6 }, maximumInputTokens: "10", maximumOutputTokens: "10",
    expiresAt: new Date(Date.now() + 60000).toISOString(), idempotencyKey: "reservation-contract" };
  await assert.rejects(h.runtime.reserveSpending(member, task.id, { ...input, explicitSpendingAuthorization: false }));
  await assert.rejects(h.runtime.reserveSpending(member, task.id, input), /unavailable/u);
  let authorizations = 0;
  // Runtime boundary adapter only; real financial concurrency is tested against PostgreSQL.
  h.runtime.spending = { async reserve(_actor, _task, _quote, authorize) { await authorize(); authorizations++; return { outcome: "RESERVED" }; } };
  assert.equal((await h.runtime.reserveSpending(member, task.id, input)).outcome, "RESERVED");
  assert.equal(authorizations, 1);
  const grant = h.db.select("workspace_need_to_know_grants")[0];
  h.db.upsert("workspace_need_to_know_grants", { ...grant, status: "REVOKED" });
  await assert.rejects(h.runtime.reserveSpending(member, task.id, input));
  assert.equal(authorizations, 1);
  assert.equal(h.runtime.get(member, task.id).status, "CREATED");
});

test("Documentation filters each linguistic source and agenda reports exclude other users' records", async (t) => {
  const h = await harness(t);
  const grant = h.db.select("workspace_need_to_know_grants")[0];
  h.db.upsert("workspace_need_to_know_grants", { ...grant,
    accessScope: { ...grant.accessScope, linguisticSourceIds: ["source"] } });
  const task = h.runtime.create(member, h.request("documentation-agent"));
  const report = (await h.runtime.execute(member, task.id)).result;
  assert.equal(report.metrics.matchingResourceCount, 0);
  assert.ok(!JSON.stringify(report).includes("dictionary"));
  h.db.insert("scheduling_tasks", { id: "hidden-task", organizationId: "org", projectId: "project",
    createdBy: "other-user", dueAt: now, dependencies: [], version: 1 });
  h.db.insert("scheduling_events", { id: "hidden-event", organizationId: "org", projectId: "project",
    createdBy: "other-user", startsAt: now, version: 1 });
  const planTask = h.runtime.create(member, h.request("planning-coordination-subagent"));
  const plan = (await h.runtime.execute(member, planTask.id)).result;
  assert.equal(plan.metrics.taskCount, 1);
  assert.equal(plan.metrics.eventCount, 1);
  assert.ok(!JSON.stringify(plan).includes("hidden-"));
});

test("invalid descriptors, handler bindings, input/output and disabled versions fail closed", async (t) => {
  const h = await harness(t);
  assert.throws(() => h.runtime.create(member, { ...h.request("projects-agent"), executeCode: "arbitrary" }), /Invalid/u);
  assert.throws(() => h.runtime.create(member, { ...h.request("projects-agent"),
    resource: { type: "MANUSCRIPT", id: "manuscript" } }), /schema/u);
  assert.throws(() => h.runtime.create(member, { ...h.request("projects-agent"), operationId: "publish" }), /validated/u);
  const task = h.runtime.create(member, h.request("projects-agent", "bad-output"));
  const original = h.adapters[0].execute;
  h.adapters[0].execute = async () => ({ readiness: "READY", issues: [], humanApprovalRequired: false });
  assert.equal((await h.runtime.execute(member, task.id)).status, "FAILED");
  h.adapters[0].execute = original;
  const disabled = h.runtime.create(member, h.request("projects-agent", "disabled"));
  await h.registry.disableAgent(admin, "projects-agent", { reason: "Revoked" });
  assert.equal((await h.runtime.execute(member, disabled.id)).status, "BLOCKED");
  const originalDescriptors = h.adapters[0].descriptors;
  h.adapters[0].descriptors = () => [{ ...originalDescriptors()[0], estimatedCost: 1 }];
  assert.throws(() => h.handlers.validate("projects-agent", h.bindingFor(h.descriptors[0])));
});

test("concurrency, cancellation and output revocation preserve terminal status without publishing a report", async (t) => {
  const h = await harness(t);
  const before = snapshot(h.db);
  const task = h.runtime.create(member, h.request("projects-agent"));
  const second = h.runtime.create(member, h.request("projects-agent", "second"));
  let begin;
  const started = new Promise((resolve) => { begin = resolve; });
  let finish;
  const gate = new Promise((resolve) => { finish = resolve; });
  const execute = h.adapters[0].execute.bind(h.adapters[0]);
  h.adapters[0].execute = async (...args) => { begin(); await gate; return execute(...args); };
  const running = h.runtime.execute(member, task.id);
  await started;
  await assert.rejects(h.runtime.execute(member, second.id), /busy/u);
  h.runtime.cancel(member, task.id);
  finish();
  assert.equal((await running).status, "CANCELLED");
  assert.equal(h.runtime.get(member, task.id).result, undefined);
  assert.deepEqual(snapshot(h.db), before);
});

test("manuscript history and scheduling cycles produce real warnings without repairing data", async (t) => {
  const h = await harness(t);
  const section = h.db.select("author_manuscript_sections")[0];
  h.db.upsert("author_manuscript_sections", { ...section, parentSectionId: section.id });
  h.db.insert("author_drafts", { ...h.db.select("author_drafts")[0], id: "duplicate", version: 1 });
  const task = h.runtime.create(member, h.request("manuscripts-agent"));
  const report = (await h.runtime.execute(member, task.id)).result;
  assert.ok(report.issues.includes("CYCLIC_SECTION_STRUCTURE"));
  assert.ok(report.issues.includes("DUPLICATE_DRAFT_VERSION"));
  const entry = h.db.select("scheduling_tasks")[0];
  h.db.upsert("scheduling_tasks", { ...entry, dependencies: [entry.id] });
  const planned = h.runtime.create(member, h.request("planning-coordination-subagent"));
  const plan = (await h.runtime.execute(member, planned.id)).result;
  assert.ok(plan.issues.includes("CYCLIC_TASK_DEPENDENCIES"));
  assert.deepEqual(h.db.select("scheduling_tasks")[0].dependencies, [entry.id]);
});

test("all server descriptors declare bounded schemas, scopes, restrictions and no provider costs", async (t) => {
  const h = await harness(t);
  const descriptors = h.handlers.descriptors();
  assert.equal(descriptors.length, 6);
  assert.equal(new Set(descriptors.map((descriptor) => descriptor.agentId)).size, 6);
  assert.equal(h.registry.listAgents(admin).length, 24);
  for (const descriptor of descriptors) {
    assert.equal(descriptor.version, "1");
    assert.equal(descriptor.estimatedCost, 0);
    assert.equal(descriptor.metadata.externalProcessing, false);
    assert.equal(descriptor.metadata.modifiesResources, false);
    assert.ok(descriptor.timeoutMs > 0 && descriptor.timeoutMs <= 5000);
    assert.ok(descriptor.requiredPermissions.length);
    assert.ok(descriptor.allowedWorkflowStates.length);
    assert.ok(!descriptor.allowedWorkflowStates.includes("BLOCKED"));
    assert.equal(descriptor.inputSchema.safeParse({ arbitrary: true }).success, false);
    assert.equal(descriptor.outputSchema.safeParse({ humanApprovalRequired: false }).success, false);
  }
});

test("revocation during execution or of secondary-source permissions withholds reports", async (t) => {
  const h = await harness(t);
  const task = h.runtime.create(member, h.request("projects-agent"));
  const execute = h.adapters[0].execute.bind(h.adapters[0]);
  h.adapters[0].execute = async (...args) => {
    const result = await execute(...args);
    h.db.upsert("workspace_need_to_know_grants", { ...h.db.select("workspace_need_to_know_grants")[0], status: "REVOKED" });
    return result;
  };
  const failed = await h.runtime.execute(member, task.id);
  assert.equal(failed.status, "FAILED");
  assert.equal(failed.result, undefined);
  const grant = h.db.select("workspace_need_to_know_grants")[0];
  h.db.upsert("workspace_need_to_know_grants", { ...grant, status: "ACTIVE" });
  const documentationTask = h.runtime.create(member, h.request("documentation-agent"));
  assert.equal((await h.runtime.execute(member, documentationTask.id)).status, "COMPLETED");
  h.db.upsert("workspace_need_to_know_grants", { ...grant, status: "ACTIVE",
    accessScope: { ...grant.accessScope, linguisticSourceIds: ["source"] } });
  await assert.rejects(h.runtime.read(member, documentationTask.id));
});

test("all applicable budget scopes and user quotas remain enforced for local handlers", async (t) => {
  const h = await harness(t);
  await h.governanceRepo.createBudget({ id: "project-budget", organizationId: "org", budgetScope: "PROJECT",
    scopeRef: "project", amount: 100, currency: "EUR", period: "MONTHLY" });
  await h.governanceRepo.createBudget({ id: "org-budget", organizationId: "org", budgetScope: "ORGANIZATION",
    amount: 0, currency: "EUR", period: "MONTHLY" });
  const task = h.runtime.create(member, h.request("projects-agent"));
  assert.equal((await h.runtime.execute(member, task.id)).status, "BLOCKED");
  h.db.upsert("ai_budgets", { ...h.db.select("ai_budgets").find((budget) => budget.id === "org-budget"), amount: 100 });
  await h.governanceRepo.createQuota({ id: "user-quota", organizationId: "org", quotaScope: "USER",
    scopeRef: "author", maxRunsPerMonth: 0 });
  const next = h.runtime.create(member, h.request("coordinator-agent"));
  assert.equal((await h.runtime.execute(member, next.id)).status, "BLOCKED");
  assert.equal(h.db.select("ai_usage_records").length, 0);
});

test("restore rejects resource references crossing tenants in both canonical validators", async (t) => {
  const h = await harness(t);
  const task = h.runtime.create(member, h.request("projects-agent"));
  await h.runtime.execute(member, task.id);
  h.db.insert("projects", { id: "foreign-project", organizationId: "other-org" });
  const backup = h.db.createBackup();
  backup.data.ai_execution_records[0].resource.id = "foreign-project";
  const restored = new FileBackedRuntimeDatabase(`${h.db.getPath()}.corrupt-restore`);
  assert.throws(() => restored.restoreBackup(backup), /cross-tenant handler resource/u);
  assert.equal(validateBackup(backup).valid, false);
  assert.equal(h.runtime.get(member, task.id).resource.id, "project");
});

test("Quality retains its legacy request/result contract and workflow gate with normalized resource idempotency", async (t) => {
  const h = await harness(t);
  const descriptor = h.handlers.descriptors().find((item) => item.agentId === "quality-agent");
  const version = await h.registry.createDraft(admin, "quality-agent", { reason: "Quality regression",
    bindings: [h.bindingFor(descriptor)] });
  const decision = { reason: "Human-reviewed", configurationSha256: version.configurationSha256 };
  await h.registry.approveVersion(admin, "quality-agent", version.id, decision);
  await h.registry.activateVersion(admin, "quality-agent", version.id, decision);
  const input = { agentId: "quality-agent", operationId: "quality.validate-metadata", projectId: "project",
    documentId: "document", idempotencyKey: "quality" };
  const task = h.runtime.create(member, input);
  assert.equal(h.runtime.create(member, { ...input, documentId: undefined,
    resource: { type: "DOCUMENT", id: "document" } }).id, task.id);
  assert.deepEqual((await h.runtime.execute(member, task.id)).result,
    { readiness: "READY", issues: [], humanApprovalRequired: true });
  const blocked = h.runtime.create(member, { ...input, idempotencyKey: "workflow-blocked" });
  h.db.upsert("workflow_states", { ...h.db.select("workflow_states")[0], status: "BLOCKED" });
  assert.equal((await h.runtime.execute(member, blocked.id)).status, "BLOCKED");
});

for (const agent of ["terminology-lexicography-subagent", "semantic-fidelity-subagent"]) {
  test(`${agent} uses real linguistic services and persists segment evidence without editorial changes`, async (t) => {
    const h = await harness(t, true);
    const before = snapshot(h.db);
    const segment = h.db.select("document_segments");
    const task = h.runtime.create(member, h.request(agent));
    const completed = await h.runtime.execute(member, task.id);
    assert.equal(completed.status, "COMPLETED");
    assert.equal(completed.result.humanApprovalRequired, true);
    assert.ok(completed.result.provenance.some((ref) => ref.resourceType === "SEGMENT" && ref.resourceId === "segment"));
    if (agent.startsWith("semantic")) assert.ok(completed.result.findings.some((finding) => finding.code === "OMITTED_MEANING"));
    assert.deepEqual(h.db.select("document_segments"), segment);
    assert.deepEqual(snapshot(h.db), before);
    assert.doesNotMatch(JSON.stringify(completed.result), /La connaissance|Cunoaștere/u);
    const restored = new FileBackedRuntimeDatabase(`${h.db.getPath()}.restored`);
    restored.restoreBackup(h.db.createBackup());
    assert.deepEqual(restored.select("ai_execution_records")[0].result, completed.result);
    assert.equal(validateBackup(h.db.createBackup()).valid, true);
    assert.deepEqual(h.db.select("ai_operational_audit_events").map((row) => row.action),
      ["AI_TASK_CREATED", "AI_TASK_AUTHORIZED", "AI_TASK_RUNNING", "AI_TASK_COMPLETED"]);
  });
}

test("linguistic authorization rejects foreign, unassigned, mismatched and missing segments", async (t) => {
  const h = await harness(t, true);
  const original = h.db.select("document_segments")[0];
  for (const [id, organizationId, documentId] of [["foreign", "other-org", "document"],
    ["unassigned", "org", "document"], ["mismatched", "org", "another-document"]]) {
    h.db.insert("document_segments", { ...original, id, organizationId, documentId });
  }
  for (const segmentId of ["foreign", "unassigned", "mismatched", "missing"]) {
    const task = h.runtime.create(member, { ...h.request("semantic-fidelity-subagent", segmentId), segmentId });
    assert.equal((await h.runtime.execute(member, task.id)).status, "BLOCKED");
  }
  assert.throws(() => h.runtime.create(member, { ...h.request("semantic-fidelity-subagent"), segmentId: undefined }), /schema/u);
  const task = h.runtime.create(member, h.request("semantic-fidelity-subagent", "rbac"));
  assert.equal((await h.runtime.execute({ ...member, canonicalPermissions: [] }, task.id)).status, "BLOCKED");
});

test("linguistic results become inaccessible when segment content or grants change", async (t) => {
  const h = await harness(t, true);
  const task = h.runtime.create(member, h.request("semantic-fidelity-subagent"));
  assert.equal((await h.runtime.execute(member, task.id)).status, "COMPLETED");
  const original = h.db.select("document_segments")[0];
  h.db.upsert("document_segments", { ...original, latestTargetText: "Changed translation" });
  await assert.rejects(h.runtime.read(member, task.id), /evidence changed/u);
  h.db.upsert("document_segments", original);
  const grant = h.db.select("workspace_need_to_know_grants")[0];
  h.db.upsert("workspace_need_to_know_grants", { ...grant, status: "REVOKED" });
  await assert.rejects(h.runtime.read(member, task.id));
  assert.equal(h.runtime.create(member, h.request("semantic-fidelity-subagent")).result, undefined);
});

test("validated glossary conflicts override Translation Memory suggestions without altering either", async (t) => {
  const h = await harness(t, true);
  const base = { organizationId: "org", language: "ro", term: "connaissance", status: "VALIDATED",
    ownerUserId: "owner", approvedTranslation: "cunoaștere", preferredVariants: [], forbiddenVariants: [],
    sourceReferences: [], sourceValidationStatus: "VERIFIED", createdAt: now, updatedAt: now };
  h.db.insert("terminology_terms", { ...base, id: "project-term", projectId: "project", glossaryScope: "PROJECT" });
  h.db.insert("terminology_terms", { ...base, id: "platform-term", approvedTranslation: "știință", glossaryScope: "PLATFORM" });
  const segment = h.db.select("document_segments")[0];
  h.db.upsert("document_segments", { ...segment, latestTargetText: "știință" });
  h.db.insert("translation_memory_entries", { id: "memory", organizationId: "org", projectId: "project", documentId: "document",
    sourceText: segment.sourceText, targetText: "știință", sourceLanguage: "fr", targetLanguage: "ro", origin: "HUMAN",
    confidenceScore: 1, approvalStatus: "APPROVED", approvedBy: "owner", createdBy: "author", createdAt: now, updatedAt: now });
  const grant = h.db.select("workspace_need_to_know_grants")[0];
  h.db.upsert("workspace_need_to_know_grants", { ...grant, accessScope: { ...grant.accessScope,
    linguisticSourceIds: ["source", "dictionary", "project-term", "platform-term", "memory"] } });
  const before = { terms: h.db.select("terminology_terms"), memory: h.db.select("translation_memory_entries") };
  const task = h.runtime.create(member, h.request("terminology-lexicography-subagent"));
  const result = await h.runtime.execute(member, task.id);
  assert.equal(result.status, "COMPLETED");
  assert.ok(result.result.findings.some((finding) => finding.referenceId === "project-term"));
  assert.ok(result.result.issues.includes("GLOSSARY_CONFLICT"));
  assert.equal(result.result.metrics.translationMemoryMatches, 1);
  assert.equal(result.result.metrics.validatedTerminologyPriority, 1);
  assert.deepEqual(h.db.select("terminology_terms"), before.terms);
  assert.deepEqual(h.db.select("translation_memory_entries"), before.memory);
});

test("paid translation remains unavailable even after human activation and concurrent attempts", async (t) => {
  const h = await harness(t, true);
  const descriptor = h.descriptors.find((item) => item.agentId === "translation-agent");
  assert.equal(descriptor.availability, "PAID_EXECUTION_DISABLED");
  assert.equal(h.handlers.validate(descriptor.agentId, h.bindingFor(descriptor)), false);
  const version = await h.registry.createDraft(admin, descriptor.agentId, { bindings: [h.bindingFor(descriptor)], reason: "Test only" });
  const decision = { configurationSha256: version.configurationSha256, reason: "Explicit test approval" };
  await h.registry.approveVersion(admin, descriptor.agentId, version.id, decision);
  await h.registry.activateVersion(admin, descriptor.agentId, version.id, decision);
  const input = { projectId: "project", resource: { type: "DOCUMENT", id: "document" }, segmentId: "segment",
    explicitExternalProcessingAuthorization: true };
  let providerCalls = 0;
  h.linguisticServices.translations.generateAiProposal = async () => { providerCalls++; throw new Error("must not call"); };
  const outcomes = await Promise.allSettled(Array.from({ length: 4 }, () =>
    h.linguisticServices.adapter.execute("translation-agent", admin, input, new AbortController().signal)));
  assert.ok(outcomes.every((result) => result.status === "rejected" && /ATOMIC_RESERVATIONS_REQUIRED/u.test(result.reason.message)));
  assert.throws(() => h.runtime.create(admin, { ...input, agentId: descriptor.agentId,
    operationId: descriptor.operationId, idempotencyKey: "paid" }), /binding/u);
  assert.equal(providerCalls, 0);
  assert.equal(h.db.select("ai_usage_records").length, 0);
});

test("linguistic runtime enforces workflow, active versions, bindings and exhausted budgets", async (t) => {
  const h = await harness(t, true);
  const request = h.request("semantic-fidelity-subagent");
  assert.throws(() => h.runtime.create(member, { ...request, operationId: "unregistered" }), /binding/u);
  const task = h.runtime.create(member, request);
  const state = h.db.select("workflow_states")[0];
  h.db.upsert("workflow_states", { ...state, status: "APPROVED" });
  assert.equal((await h.runtime.execute(member, task.id)).status, "BLOCKED");
  h.db.upsert("workflow_states", state);
  const second = h.runtime.create(member, h.request("semantic-fidelity-subagent", "budget"));
  h.db.insert("ai_budgets", { id: "empty", organizationId: "org", budgetScope: "ORGANIZATION",
    amount: 0, currency: "EUR", period: "MONTHLY" });
  assert.equal((await h.runtime.execute(member, second.id)).status, "BLOCKED");
  await h.registry.disableAgent(admin, "semantic-fidelity-subagent", { reason: "Test disable" });
  assert.throws(() => h.runtime.create(member, h.request("semantic-fidelity-subagent", "disabled")), /activated/u);
});

test("linguistic cancellation and exclusive execution do not publish partial results", async (t) => {
  const h = await harness(t, true);
  const original = h.linguisticServices.semantic.runCheckOnSegment.bind(h.linguisticServices.semantic);
  let finish;
  let started;
  const began = new Promise((resolve) => { started = resolve; });
  h.linguisticServices.semantic.runCheckOnSegment = async (...args) => {
    started();
    await new Promise((resolve) => { finish = resolve; });
    return original(...args);
  };
  const task = h.runtime.create(member, h.request("semantic-fidelity-subagent"));
  const running = h.runtime.execute(member, task.id);
  await began;
  const second = h.runtime.create(member, h.request("terminology-lexicography-subagent"));
  await assert.rejects(h.runtime.execute(member, second.id), /busy/u);
  h.runtime.cancel(member, task.id);
  finish();
  assert.equal((await running).status, "CANCELLED");
  assert.equal(h.runtime.get(member, task.id).result, undefined);
});

test("linguistic backup validators reject segment tenant and document mismatches", async (t) => {
  const h = await harness(t, true);
  const task = h.runtime.create(member, h.request("semantic-fidelity-subagent"));
  await h.runtime.execute(member, task.id);
  const backup = h.db.createBackup();
  backup.data.document_segments[0].organizationId = "other-org";
  assert.equal(validateBackup(backup).valid, false);
  const restored = new FileBackedRuntimeDatabase(`${h.db.getPath()}.rejected`);
  assert.throws(() => restored.restoreBackup(backup));
});

test("FR to RO service/provider integration uses real glossary and TM with deterministic provider transport only", async (t) => {
  const h = await harness(t, true);
  // Fake-transport contract, not production dispatch authorization.
  h.linguisticServices.provider.requireFinancialDispatch = () => {};
  const keys = ["AI_EXTERNAL_PROCESSING_ENABLED", "OPENAI_API_KEY", "ANTHROPIC_API_KEY"];
  const saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  const fetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = fetch;
    for (const key of keys) {
      if (saved[key] === undefined) delete process.env[key]; else process.env[key] = saved[key];
    }
  });
  process.env.AI_EXTERNAL_PROCESSING_ENABLED = "true";
  process.env.OPENAI_API_KEY = "isolated-test-key";
  delete process.env.ANTHROPIC_API_KEY;
  const segment = h.db.select("document_segments")[0];
  h.db.insert("terminology_terms", { id: "approved-term", organizationId: "org", projectId: "project",
    language: "ro", term: "connaissance", approvedTranslation: "cunoaștere", status: "VALIDATED", glossaryScope: "PROJECT",
    preferredVariants: [], forbiddenVariants: [], createdAt: now, updatedAt: now });
  h.db.insert("translation_memory_entries", { id: "approved-memory", organizationId: "org", projectId: "project",
    sourceText: segment.sourceText, targetText: "Cunoaștere validată.", sourceLanguage: "fr", targetLanguage: "ro",
    approvalStatus: "APPROVED", confidenceScore: 1, origin: "HUMAN", createdBy: "owner", createdAt: now, updatedAt: now });
  let body;
  let calls = 0;
  globalThis.fetch = async (_url, init) => {
    calls++;
    body = JSON.parse(init.body);
    return new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify({
      translation: "Cunoașterea și rațiunea.", explanation: "Validated glossary preserved.", confidence: 0.9
    }) } }], usage: { prompt_tokens: 20, completion_tokens: 8 } }), { status: 200 });
  };
  await assert.rejects(h.linguisticServices.translations.generateAiProposal({ ...member, permissions: ["translation:write"] }, {
    segmentId: "segment", explicitExternalProcessingAuthorization: false
  }), /authorization/u);
  assert.equal(calls, 0);
  const before = h.db.select("document_segments");
  const proposal = await h.linguisticServices.translations.generateAiProposal({ ...member, permissions: ["translation:write"] }, {
    segmentId: "segment", explicitExternalProcessingAuthorization: true
  });
  assert.equal(proposal.status, "PENDING_HUMAN_REVIEW");
  assert.equal(proposal.automaticApproval, false);
  assert.equal(proposal.automaticPublication, false);
  assert.equal(proposal.sourceLanguage, "fr");
  assert.equal(proposal.targetLanguage, "ro");
  const payload = JSON.parse(body.messages[1].content);
  assert.equal(payload.approvedGlossary[0].approvedTranslation, "cunoaștere");
  assert.equal(payload.translationMemory[0].proposedTargetText, "Cunoaștere validată.");
  assert.deepEqual(h.db.select("document_segments"), before);
  assert.equal(h.db.select("ai_usage_records").filter((record) => record.status === "SUCCEEDED").length, 1);
});

test("linguistic analysis fails closed on unauthorized evidence and unsupported language policy", async (t) => {
  const h = await harness(t, true);
  const grant = h.db.select("workspace_need_to_know_grants")[0];
  h.db.upsert("workspace_need_to_know_grants", { ...grant, accessScope: { ...grant.accessScope, linguisticSourceIds: ["source"] } });
  const task = h.runtime.create(member, h.request("semantic-fidelity-subagent"));
  assert.equal((await h.runtime.execute(member, task.id)).status, "FAILED");
  assert.equal(h.runtime.get(member, task.id).result, undefined);
  h.db.upsert("workspace_need_to_know_grants", grant);
  const segment = h.db.select("document_segments")[0];
  h.db.upsert("document_segments", { ...segment, targetLanguage: "ja", targetLocale: "ja-JP" });
  const invalid = h.runtime.create(member, h.request("semantic-fidelity-subagent", "language"));
  assert.equal((await h.runtime.execute(member, invalid.id)).status, "BLOCKED");
});

test("linguistic runtime validates output and withholds results on an expired cooperative deadline", async (t) => {
  const h = await harness(t, true);
  const execute = h.linguisticServices.adapter.execute.bind(h.linguisticServices.adapter);
  h.linguisticServices.adapter.execute = async (...args) => ({ ...await execute(...args), humanApprovalRequired: false });
  const invalid = h.runtime.create(member, h.request("semantic-fidelity-subagent"));
  assert.equal((await h.runtime.execute(member, invalid.id)).status, "FAILED");
  assert.equal(h.runtime.get(member, invalid.id).result, undefined);
  h.linguisticServices.adapter.execute = async (...args) => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return execute(...args);
  };
  const descriptors = h.linguisticServices.adapter.descriptors.bind(h.linguisticServices.adapter);
  h.linguisticServices.adapter.descriptors = () => descriptors().map((descriptor) => ({ ...descriptor, timeoutMs: 10 }));
  const timed = h.runtime.create(member, h.request("semantic-fidelity-subagent", "deadline"));
  assert.equal((await h.runtime.execute(member, timed.id)).status, "FAILED");
  assert.equal(h.runtime.get(member, timed.id).result, undefined);
});

test("linguistic term search includes other editors' platform terms but excludes private personal terms", async (t) => {
  const h = await harness(t, true);
  const term = { organizationId: "org", term: "connaissance", language: "ro", approvedTranslation: "cunoaștere",
    status: "VALIDATED", preferredVariants: [], forbiddenVariants: [], ownerUserId: "someone-else", createdAt: now, updatedAt: now };
  h.db.insert("terminology_terms", { ...term, id: "platform", glossaryScope: "PLATFORM" });
  h.db.insert("terminology_terms", { ...term, id: "private", glossaryScope: "PERSONAL" });
  const results = await h.linguisticServices.terminology.searchTerms(member, { language: "ro", projectId: "project" });
  assert.ok(results.some((entry) => entry.id === "platform"));
  assert.ok(!results.some((entry) => entry.id === "private"));
});

test("linguistic idempotency pins the segment and legacy handlers reject linguistic inputs", async (t) => {
  const h = await harness(t, true);
  const request = h.request("semantic-fidelity-subagent");
  const first = h.runtime.create(member, request);
  assert.equal(h.runtime.create(member, request).id, first.id);
  assert.throws(() => h.runtime.create(member, { ...request, segmentId: "different-segment" }), /payload mismatch/u);
  assert.throws(() => h.runtime.create(member, { ...request, explicitExternalProcessingAuthorization: true }), /payload mismatch/u);
  assert.throws(() => h.runtime.create(member, { ...h.request("projects-agent"), segmentId: "segment" }), /schema/u);
  assert.equal(h.db.select("ai_execution_records").length, 1);
});

test("segment grant revocation during linguistic execution prevents result publication", async (t) => {
  const h = await harness(t, true);
  const original = h.linguisticServices.semantic.runCheckOnSegment.bind(h.linguisticServices.semantic);
  h.linguisticServices.semantic.runCheckOnSegment = async (...args) => {
    const report = await original(...args);
    const grant = h.db.select("workspace_need_to_know_grants")[0];
    // An empty scope means project-wide access in the existing Workspace contract.
    h.db.upsert("workspace_need_to_know_grants", { ...grant, accessScope: { ...grant.accessScope, segmentIds: ["another-segment"] } });
    return report;
  };
  const before = h.db.select("document_segments");
  const task = h.runtime.create(member, h.request("semantic-fidelity-subagent"));
  const result = await h.runtime.execute(member, task.id);
  assert.equal(result.status, "FAILED");
  assert.equal(result.result, undefined);
  await assert.rejects(h.runtime.read(member, task.id));
  assert.deepEqual(h.db.select("document_segments"), before);
  assert.equal(h.db.select("ai_operational_audit_events").at(-1).action, "AI_TASK_FAILED");
});

test("unauthorized Translation Memory is rejected before linguistic services consult it", async (t) => {
  const h = await harness(t, true);
  const segment = h.db.select("document_segments")[0];
  h.db.insert("translation_memory_entries", { id: "restricted-memory", organizationId: "org", projectId: "project",
    sourceText: segment.sourceText, targetText: "Restricted evidence", sourceLanguage: "fr", targetLanguage: "ro",
    approvalStatus: "APPROVED", confidenceScore: 1, origin: "HUMAN", createdBy: "owner", createdAt: now, updatedAt: now });
  let consultations = 0;
  const original = h.linguisticServices.semantic.runCheckOnSegment.bind(h.linguisticServices.semantic);
  h.linguisticServices.semantic.runCheckOnSegment = async (...args) => { consultations++; return original(...args); };
  const task = h.runtime.create(member, h.request("semantic-fidelity-subagent"));
  assert.equal((await h.runtime.execute(member, task.id)).status, "FAILED");
  assert.equal(consultations, 0);
  assert.equal(h.runtime.get(member, task.id).result, undefined);
});

test("central translation provider retries fail safely without changing content or exposing credentials", async (t) => {
  const h = await harness(t, true);
  // Keep retry/redaction coverage under deterministic fake transport only.
  h.linguisticServices.provider.requireFinancialDispatch = () => {};
  const keys = ["AI_EXTERNAL_PROCESSING_ENABLED", "OPENAI_API_KEY", "ANTHROPIC_API_KEY"];
  const saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  const fetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = fetch;
    for (const key of keys) {
      if (saved[key] === undefined) delete process.env[key]; else process.env[key] = saved[key];
    }
  });
  process.env.AI_EXTERNAL_PROCESSING_ENABLED = "true";
  process.env.OPENAI_API_KEY = "isolated-test-key";
  delete process.env.ANTHROPIC_API_KEY;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return new Response(JSON.stringify({ error: { message: "isolated-test-key confidential upstream error" } }), { status: 503 });
  };
  const before = h.db.select("document_segments");
  await assert.rejects(h.linguisticServices.translations.generateAiProposal({ ...member, permissions: ["translation:write"] }, {
    segmentId: "segment", explicitExternalProcessingAuthorization: true
  }), (error) => {
    assert.match(error.message, /temporarily unavailable/u);
    assert.doesNotMatch(error.message, /isolated-test-key|confidential upstream error/u);
    return true;
  });
  assert.equal(calls, 2);
  assert.deepEqual(h.db.select("document_segments"), before);
  const usage = h.db.select("ai_usage_records");
  assert.equal(usage.length, 1);
  assert.equal(usage[0].status, "FAILED");
  assert.doesNotMatch(JSON.stringify(usage), /isolated-test-key|La connaissance|confidential upstream error/u);
  // This exercises the legacy provider path, not a paid runtime execution/reservation.
  assert.equal(h.db.select("ai_execution_records").length, 0);
});
