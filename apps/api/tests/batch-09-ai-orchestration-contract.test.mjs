import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(__dirname, "..", "..", "..");
const batchDir = join(repositoryRoot, "docs", "implementation", "execution-batches", "batch-09");

const requiredDocuments = [
  "overview.md",
  "ai-agent-registry.md",
  "ai-orchestrator.md",
  "model-registry.md",
  "provider-registry.md",
  "model-routing.md",
  "prompt-registry.md",
  "ai-execution-model.md",
  "knowledge-source-registry.md",
  "rag-architecture.md",
  "chunking-embedding.md",
  "retrieval-security.md",
  "prompt-injection-protection.md",
  "tool-registry.md",
  "human-review-policy.md",
  "evaluation-framework.md",
  "regression-suite.md",
  "cost-control.md",
  "budget-quota-policy.md",
  "data-protection.md",
  "ai-observability.md",
  "incident-response.md",
  "kill-switch.md",
  "legacy-ai-migration.md",
  "test-evidence.md",
  "changed-files.md",
  "migration-plan.md",
  "rollback-plan.md",
  "compliance-report.md",
  "next-batch-proposal.md"
];

const aiTables = [
  "ai_agent_registry",
  "ai_model_registry",
  "ai_provider_registry",
  "ai_prompt_registry",
  "ai_execution_records",
  "ai_knowledge_sources",
  "rag_collections",
  "rag_chunking_profiles",
  "rag_vector_records",
  "ai_tool_registry",
  "ai_tool_calls",
  "ai_evaluation_profiles",
  "ai_evaluation_datasets",
  "ai_regression_runs",
  "ai_shadow_evaluations",
  "ai_operational_cost_records",
  "ai_operational_budgets",
  "ai_usage_quotas",
  "ai_semantic_cache_entries",
  "ai_data_policies",
  "ai_provider_data_policies",
  "ai_operational_audit_events",
  "ai_quality_dashboard_snapshots",
  "ai_incidents",
  "ai_kill_switches",
  "ai_agent_messages",
  "ai_workflow_traces",
  "ai_change_records",
  "legacy_ai_assets"
];

function readRepositoryFile(...pathSegments) {
  return readFileSync(join(repositoryRoot, ...pathSegments), "utf8");
}

function readBatchDocument(fileName) {
  return readRepositoryFile("docs", "implementation", "execution-batches", "batch-09", fileName);
}

test("Batch 09 required AI orchestration documentation deliverables exist", () => {
  for (const fileName of requiredDocuments) {
    const filePath = join(batchDir, fileName);
    assert.equal(existsSync(filePath), true, `${fileName} must exist`);
    assert.ok(readFileSync(filePath, "utf8").trim().length > 0, `${fileName} must not be empty`);
  }
});

test("Batch 09 documents define the canonical governed AI execution flow", () => {
  const overview = readBatchDocument("overview.md");
  const orchestrator = readBatchDocument("ai-orchestrator.md");
  const provider = readBatchDocument("provider-registry.md");
  const routing = readBatchDocument("model-routing.md");
  const rag = readBatchDocument("rag-architecture.md");
  const retrieval = readBatchDocument("retrieval-security.md");
  const promptInjection = readBatchDocument("prompt-injection-protection.md");
  const tools = readBatchDocument("tool-registry.md");
  const humanReview = readBatchDocument("human-review-policy.md");
  const cost = readBatchDocument("cost-control.md");
  const dataProtection = readBatchDocument("data-protection.md");
  const killSwitch = readBatchDocument("kill-switch.md");

  assert.match(overview, /AI is not a source of truth/);
  assert.match(overview, /AI Orchestrator -> policy, permission, rights, and budget checks/);
  assert.match(orchestrator, /AI Orchestrator controls AI execution; the Workflow Engine controls business process/);
  assert.match(provider, /Provider credentials are secret references only/);
  assert.match(provider, /No fallback is allowed when data policy, rights, language, modality, or kill switch state disallows/);
  assert.match(routing, /cheapest model is not the primary criterion/i);
  assert.match(rag, /Cross-organization RAG is disabled by default/);
  assert.match(retrieval, /AI cannot retrieve data that the requesting user cannot access/);
  assert.match(promptInjection, /Retrieved documents and user-provided content must be treated as untrusted data/);
  assert.match(tools, /Agents cannot access databases, shell, storage, secrets, infrastructure, or external systems directly/);
  assert.match(humanReview, /Confidence never bypasses approval/);
  assert.match(cost, /Hard budget enforcement is server-side/);
  assert.match(dataProtection, /ALLOW, REDACT, PSEUDONYMIZE, LOCAL_MODEL_ONLY, and BLOCK_EXTERNAL_AI/);
  assert.match(killSwitch, /disable an individual model, provider, agent, tool, RAG source, or execution type/);
});

test("shared AI orchestration contract contains required registries and safeguards", () => {
  const source = readRepositoryFile("packages", "shared", "src", "ai-orchestration.ts");

  for (const symbol of [
    "AIAgentDefinition",
    "AIProviderDefinition",
    "AIModelDefinition",
    "PromptDefinition",
    "KnowledgeSourceDefinition",
    "RagCollection",
    "ChunkingProfile",
    "VectorRecord",
    "RetrievalPolicy",
    "ToolDefinition",
    "OrchestratorRequest",
    "OrchestratorDecision",
    "EvaluationProfile",
    "RegressionRun",
    "ShadowEvaluationRun",
    "AICostRecord",
    "AIBudget",
    "SemanticCacheEntry",
    "AIDataPolicy",
    "AIAuditEvent",
    "AIIncident",
    "KillSwitch",
    "AgentCommunicationContract",
    "AIWorkflowTrace",
    "AIChangeRecord",
    "LegacyAiAsset"
  ]) {
    assert.match(source, new RegExp(symbol), `${symbol} must be part of Batch 09`);
  }

  for (const safeguard of [
    "evaluateRagEligibility",
    "userHasAccess",
    "aiProcessingAllowed",
    "classificationPolicyPassed",
    "crossOrganizationAllowed: false",
    "preserveBlockIds: true",
    "detectOutdatedVectors",
    "authorizeToolCall",
    "canAutoAcceptAiOutput",
    "deterministicLowRiskPolicyApproved",
    "validateStructuredAiOutput",
    "selectModelForRequest",
    "canUseFallbackModel",
    "detectPromptInjection",
    "evaluateCostGate",
    "createSemanticCacheKey",
    "evaluateExternalAiDataPolicy",
    "isDisabledByKillSwitch",
    "assessDataPoisoning",
    "classifyLegacyAiAsset",
    "CODEX_KNOWLEDGE",
    "Project terminology"
  ]) {
    assert.match(source, new RegExp(safeguard), `${safeguard} must be represented`);
  }
});

test("runtime database and backup include Batch 09 AI operational tables", () => {
  const runtimeDatabase = readRepositoryFile("packages", "db", "src", "runtime-database.ts");
  const backupLibrary = readRepositoryFile("packages", "db", "scripts", "runtime-backup-lib.mjs");
  const inventory = readRepositoryFile(
    "docs",
    "implementation",
    "execution-batches",
    "batch-03",
    "data-store-inventory.md"
  );

  for (const tableName of aiTables) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`), `${tableName} must be a runtime table`);
    assert.match(backupLibrary, new RegExp(`"${tableName}"`), `${tableName} must be included in backup/restore`);
    assert.match(inventory, new RegExp(tableName), `${tableName} must be inventoried`);
  }

  for (const reference of [
    ["ai_model_registry", "providerId", "ai_provider_registry"],
    ["ai_prompt_registry", "agentId", "ai_agent_registry"],
    ["ai_execution_records", "modelId", "ai_model_registry"],
    ["rag_collections", "chunkingProfileId", "rag_chunking_profiles"],
    ["rag_vector_records", "collectionId", "rag_collections"],
    ["ai_tool_calls", "toolId", "ai_tool_registry"],
    ["ai_operational_cost_records", "executionId", "ai_execution_records"],
    ["ai_provider_data_policies", "providerId", "ai_provider_registry"],
    ["ai_agent_messages", "senderAgentId", "ai_agent_registry"],
    ["ai_change_records", "regressionRunId", "ai_regression_runs"]
  ]) {
    const referencePattern = new RegExp(reference.map((value) => `"${value}"`).join("[\\s\\S]*"));
    assert.match(runtimeDatabase, referencePattern, `${reference.join(" -> ")} must be tenant-validated`);
    assert.match(backupLibrary, referencePattern, `${reference.join(" -> ")} must be backup-validated`);
  }
});

test("JSON Master and shared package expose optional AI orchestration records", () => {
  const types = readRepositoryFile("packages", "shared", "src", "json-master-format", "types.ts");
  const schema = readRepositoryFile("packages", "shared", "src", "json-master-format", "schema.ts");
  const validation = readRepositoryFile("packages", "shared", "src", "json-master-format", "validation.ts");
  const index = readRepositoryFile("packages", "shared", "src", "index.ts");
  const packageJson = readRepositoryFile("packages", "shared", "package.json");
  const rewrite = readRepositoryFile("packages", "shared", "scripts", "ensure-esm-file-exports.mjs");

  for (const field of [
    "aiAgents",
    "aiProviders",
    "aiModels",
    "aiPrompts",
    "aiExecutions",
    "aiKnowledgeSources",
    "ragCollections",
    "ragVectors",
    "aiTools",
    "aiOperationalCostRecords",
    "aiDataPolicies",
    "aiKillSwitches",
    "legacyAiAssets"
  ]) {
    assert.match(types, new RegExp(`${field}\\?`), `${field} must be optional in JSON Master types`);
    assert.match(schema, new RegExp(`${field}`), `${field} must be in JSON Master schema`);
    assert.match(validation, new RegExp(`${field}`), `${field} must be validated as an optional array`);
  }

  assert.match(index, /export \* from "\.\/ai-orchestration"/);
  assert.match(packageJson, /"\.\/ai-orchestration"/);
  assert.match(rewrite, /ai-orchestration\.js/);
});

test("Batch 09 reuses existing governance modules instead of adding a parallel AI application", () => {
  const appModule = readRepositoryFile("apps", "api", "src", "modules", "app.module.ts");
  const aiGovernanceTypes = readRepositoryFile("apps", "api", "src", "modules", "ai-governance", "ai-governance.types.ts");
  const marketplaceTypes = readRepositoryFile("apps", "api", "src", "modules", "marketplace", "marketplace.types.ts");
  const observabilityTypes = readRepositoryFile("apps", "api", "src", "modules", "observability", "observability.types.ts");
  const platformEngineeringTypes = readRepositoryFile(
    "apps",
    "api",
    "src",
    "modules",
    "platform-engineering",
    "platform-engineering.types.ts"
  );

  assert.match(appModule, /AiGovernanceModule/);
  assert.match(aiGovernanceTypes, /AiProviderStatus|AiUsageRecord|AiBudget/);
  assert.match(marketplaceTypes, /MarketplaceAgent|MarketplaceExtension/);
  assert.match(observabilityTypes, /ObservabilityMetric|AgentExecution/);
  assert.match(platformEngineeringTypes, /AgentCoordinationRun|PlatformEngineeringPlan/);
});
