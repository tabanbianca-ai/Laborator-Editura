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
const governance = load(join(moduleRoot, "ai-governance.types.ts"));
const identity = load(join(moduleRoot, "ai-agent-identity.ts"), { "./ai-governance.types": governance });
const dbModule = load(join(root, "packages/db/src/runtime-database.ts"));
const repoModule = load(join(moduleRoot, "ai-governance.repository.ts"), {
  "@laborator/db": dbModule,
  "../runtime-database.provider": { RUNTIME_DATABASE: "RUNTIME_DATABASE" }
});
const { AiAgentRegistryService } = load(join(moduleRoot, "ai-agent-registry.service.ts"), {
  "./ai-agent-identity": identity,
  "./ai-governance.repository": repoModule
});
const admin = { userId: "admin-a", organizationId: "org-a", roles: ["ADMIN"] };
const configuration = { reason: "Configure proposal support", bindings: [{
  capabilityId: "translation.proposal", operationId: "translation.propose",
  handlerKey: "translation.proposal.v1", inputSchemaRef: "translation.input.v1",
  outputSchemaRef: "translation.output.v1", requiredPermissions: ["translation.write"]
}] };
function harness(t) {
  const directory = mkdtempSync(join(tmpdir(), "agent-registry-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const path = join(directory, "db.json");
  const database = new dbModule.FileBackedRuntimeDatabase(path);
  database.insert("organizations", { id: "org-a", name: "Isolated organization" });
  const repository = new repoModule.DatabaseAiGovernanceRepository(database);
  return { path, directory, database, repository, service: new AiAgentRegistryService(repository) };
}
const decision = (version) => ({ configurationSha256: version.configurationSha256, reason: "Human review completed" });

test("catalog derives all 24 identities without creating tenant rows or exposing executable agents", (t) => {
  const { service, database } = harness(t);
  const agents = service.listAgents(admin);
  assert.equal(agents.length, 24);
  assert.equal(agents.filter((a) => a.kind === "PRINCIPAL").length, 18);
  assert.ok(agents.every((a) => !a.availability.executable));
  assert.equal(database.select("ai_agent_registry").length, 0);
  assert.equal(service.getAgent(admin, "Translation AI").agentId, "translation-agent");
  assert.throws(() => service.getAgent(admin, "Multimedia Creation Agent"), /ambiguous/u);
});

test("drafts can be edited, approved by digest and activated without granting execution authority", async (t) => {
  const { service, repository } = harness(t);
  const first = await service.createDraft(admin, "translation-agent", configuration);
  const edited = await service.updateDraft(admin, "translation-agent", first.id, {
    ...configuration, bindings: [], reason: "Remove unvalidated binding"
  });
  assert.equal(edited.revision, 2);
  assert.notEqual(first.configurationSha256, edited.configurationSha256);
  await assert.rejects(service.activateVersion(admin, "translation-agent", first.id, decision(edited)), /approval/u);
  await assert.rejects(service.approveVersion(admin, "translation-agent", first.id, decision(first)), /digest/u);
  await service.approveVersion(admin, "translation-agent", first.id, decision(edited));
  await assert.rejects(service.updateDraft(admin, "translation-agent", first.id, configuration), /Only draft/u);
  const active = await service.activateVersion(admin, "translation-agent", first.id, decision(edited));
  assert.equal(active.status, "ACTIVE");
  assert.equal(active.availability.executable, false);
  assert.equal(active.availability.validatedBindingCount, 0);
  const saved = service.listVersions(admin, "translation-agent")[0];
  assert.throws(() => repository.saveAgentVersion({ ...saved, bindings: configuration.bindings }), /immutable/u);
  const second = await service.createDraft(admin, "translation-agent", configuration);
  assert.equal(second.version, 2);
  assert.equal(service.getAgent(admin, "translation-agent").activeVersion, 1);
  await service.approveVersion(admin, "translation-agent", second.id, decision(second));
  const approved = service.listVersions(admin, "translation-agent")[1];
  assert.throws(() => repository.saveAgentVersion({
    ...approved, status: "ACTIVE", governanceVersion: "forged"
  }), /immutable/u);
  await service.activateVersion(admin, "translation-agent", second.id, decision(second));
  assert.equal(service.getAgent(admin, "translation-agent").activeVersion, 2);
  assert.equal(service.listVersions(admin, "translation-agent")[0].status, "ACTIVE");
  await service.disableAgent(admin, "translation-agent", { reason: "Maintenance" });
  assert.equal(service.getAgent(admin, "translation-agent").status, "DISABLED");
  assert.equal(service.listVersions(admin, "translation-agent").length, 2);
});

test("RBAC, AI denial, tenant isolation and strict validation fail closed", async (t) => {
  const { service } = harness(t);
  for (const roles of [["EDITOR"], ["ADMIN", "AI_AGENT"], ["SYSTEM"], []]) {
    assert.throws(() => service.listAgents({ ...admin, roles }), /human administrator/u);
    await assert.rejects(service.createDraft({ ...admin, roles }, "translation-agent", configuration), /human administrator/u);
  }
  const version = await service.createDraft(admin, "translation-agent", configuration);
  const other = { ...admin, organizationId: "org-b" };
  assert.deepEqual(service.listVersions(other, "translation-agent"), []);
  await assert.rejects(service.approveVersion(other, "translation-agent", version.id, decision(version)), /not found/u);
  await assert.rejects(service.approveVersion({ ...admin, roles: ["ADMIN", "AI_AGENT"] },
    "translation-agent", version.id, decision(version)), /human administrator/u);
  await assert.rejects(service.createDraft(admin, "translation-agent", { ...configuration, approvedBy: "forged" }), /Invalid/u);
  await assert.rejects(service.createDraft(admin, "translation-agent", {
    ...configuration, bindings: [configuration.bindings[0], configuration.bindings[0]]
  }), /unique/u);
});

test("version state, approvals and existing audit persist across reload and isolated restore", async (t) => {
  const { service, path, database, directory } = harness(t);
  const version = await service.createDraft(admin, "translation-agent", configuration);
  await service.approveVersion(admin, "translation-agent", version.id, decision(version));
  await service.activateVersion(admin, "translation-agent", version.id, decision(version));
  const reloaded = new AiAgentRegistryService(new repoModule.DatabaseAiGovernanceRepository(
    new dbModule.FileBackedRuntimeDatabase(path)));
  assert.equal(reloaded.listVersions(admin, "translation-agent")[0].approvedBy, admin.userId);
  const restoredDb = new dbModule.FileBackedRuntimeDatabase(join(directory, "restored.json"));
  restoredDb.restoreBackup(database.createBackup());
  const restored = new AiAgentRegistryService(new repoModule.DatabaseAiGovernanceRepository(restoredDb));
  assert.equal(restored.getAgent(admin, "translation-agent").activeVersionId, version.id);
  assert.deepEqual(restoredDb.select("ai_cost_audit_events").map((e) => e.action),
    ["AI_AGENT_DRAFT_CREATED", "AI_AGENT_VERSION_APPROVED", "AI_AGENT_VERSION_ACTIVATED"]);
});
