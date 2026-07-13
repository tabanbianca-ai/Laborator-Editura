import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "ai-governance");
const appModule = readFileSync(join(__dirname, "..", "src", "modules", "app.module.ts"), "utf8");
const runtimeDatabase = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "src", "runtime-database.ts"),
  "utf8"
);
const runtimeBackup = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "scripts", "runtime-backup-lib.mjs"),
  "utf8"
);
const backupRestoreTest = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "tests", "runtime-backup-restore.test.mjs"),
  "utf8"
);

function readSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

test("AI governance module is registered with required authenticated admin endpoints", () => {
  const controller = readSource("ai-governance.controller.ts");
  const moduleSource = readSource("ai-governance.module.ts");
  const service = readSource("ai-governance.service.ts");

  assert.match(appModule, /AiGovernanceModule/);
  assert.match(moduleSource, /DatabaseAiGovernanceRepository/);
  assert.match(moduleSource, /AiGovernanceService/);
  assert.match(controller, /@Controller\("ai-governance"\)/);
  assert.match(controller, /@Get\("providers"\)/);
  assert.match(controller, /@Post\("providers\/:provider\/status"\)/);
  assert.match(controller, /@Get\("cost-summary"\)/);
  assert.match(controller, /@Get\("usage"\)/);
  assert.match(controller, /@Post\("usage"\)/);
  assert.match(controller, /@Get\("budgets"\)/);
  assert.match(controller, /@Post\("budgets"\)/);
  assert.match(controller, /@Get\("quotas"\)/);
  assert.match(controller, /@Post\("quotas"\)/);
  assert.match(controller, /@Get\("policies"\)/);
  assert.match(controller, /@Post\("policies"\)/);
  assert.match(controller, /@Post\("override-requests"\)/);
  assert.match(controller, /@Post\("override-requests\/:id\/approve"\)/);
  assert.match(controller, /@Post\("override-requests\/:id\/reject"\)/);
  assert.match(controller, /@Get\("audit"\)/);
  assert.match(controller, /CurrentActor/);
  assert.match(service, /AI governance endpoints require an authorized admin/);
});

test("usage records capture agent execution provider tokens cost currency and status metadata", () => {
  const types = readSource("ai-governance.types.ts");
  const service = readSource("ai-governance.service.ts");

  for (const field of [
    "agentName",
    "executionType",
    "projectId",
    "documentId",
    "userId",
    "providerMetadata",
    "inputTokens",
    "outputTokens",
    "totalTokens",
    "estimatedCost",
    "actualCost",
    "currency",
    "status",
    "createdAt"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  assert.match(service, /createUsageRecord/);
  assert.match(service, /AI_USAGE_RECORDED/);
  assert.match(service, /externalBillingIntegration: "NOT_CONFIGURED"/);
});

test("budgets support organization project user agent monthly and per-run limits", () => {
  const types = readSource("ai-governance.types.ts");
  const service = readSource("ai-governance.service.ts");

  for (const scope of ["ORGANIZATION", "PROJECT", "USER", "AGENT", "MONTHLY", "PER_RUN"]) {
    assert.match(types, new RegExp(`"${scope}"`));
  }

  for (const field of ["monthlyBudget", "perRunLimit", "amount", "currency", "period"]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  assert.match(service, /createBudget/);
  assert.match(service, /AI_BUDGET_CREATED/);
  assert.match(service, /AI cannot approve or create its own budget increase/);
});

test("quotas support token cost run daily monthly agent and project limits", () => {
  const types = readSource("ai-governance.types.ts");
  const service = readSource("ai-governance.service.ts");

  for (const field of [
    "maxTokensPerRun",
    "maxCostPerRun",
    "maxRunsPerDay",
    "maxRunsPerMonth",
    "agentSpecific",
    "projectSpecific"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  assert.match(service, /createQuota/);
  assert.match(service, /AI_QUOTA_CREATED/);
  assert.match(service, /AI cannot change quotas automatically/);
});

test("cost policies include soft warnings hard limit metadata approvals and human overrides", () => {
  const types = readSource("ai-governance.types.ts");
  const service = readSource("ai-governance.service.ts");

  for (const field of [
    "softLimitWarningThreshold",
    "hardLimitMetadata",
    "approvalRequiredOverThreshold",
    "warningThresholds",
    "humanOverrideAllowed",
    "costPolicyEvaluation"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  assert.match(service, /evaluatePolicy/);
  assert.match(service, /softLimitWarning/);
  assert.match(service, /hardLimitReached/);
  assert.match(service, /approvalRequiredOverThreshold/);
  assert.match(service, /AI_BUDGET_WARNING_THRESHOLDS: AiBudgetWarningThreshold\[\] = \[80, 90, 100\]/);
  assert.match(service, /AI_BUDGET_WARNING/);
  assert.match(service, /AI_BUDGET_EXCEEDED/);
  assert.match(service, /AI_ACTION_BLOCKED/);
  assert.match(service, /dataDeleted: false/);
  assert.match(service, /recoveryOptions: \["wait until quota reset", "upgrade subscription"\]/);
  assert.match(service, /AI_COST_POLICY_CREATED/);
});

test("provider management uses OpenAI primary with Anthropic fallback and audited recovery", () => {
  const types = readSource("ai-governance.types.ts");
  const service = readSource("ai-governance.service.ts");
  const repository = readSource("ai-governance.repository.ts");
  const controller = readSource("ai-governance.controller.ts");

  for (const marker of [
    '"OPENAI"',
    '"ANTHROPIC"',
    '"PRIMARY"',
    '"FALLBACK"',
    '"TIMEOUT"',
    '"UNAVAILABLE"',
    '"API_ERROR"',
    '"CONFIGURED_OUTAGE"',
    '"FALLBACK_ACTIVE"',
    '"USING_PRIMARY"',
    "AiProviderStatusRecord",
    "AiProviderSummary"
  ]) {
    assert.match(types + service, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(service, /const PRIMARY_AI_PROVIDER = "OPENAI" satisfies AiProviderName/);
  assert.match(service, /const FALLBACK_AI_PROVIDER = "ANTHROPIC" satisfies AiProviderName/);
  assert.match(service, /PROVIDER_UNAVAILABLE_STATUSES/);
  assert.match(service, /fallbackToProvider: FALLBACK_AI_PROVIDER/);
  assert.match(service, /AI_FALLBACK_ACTIVATED/);
  assert.match(service, /AI_FALLBACK_RECOVERED/);
  assert.match(service, /AI_PROVIDER_CHANGED/);
  assert.match(repository, /ai_provider_statuses/);
  assert.match(controller, /updateProviderStatus/);
});

test("model selection defaults to automatic and manual choice requires role and subscription", () => {
  const types = readSource("ai-governance.types.ts");
  const service = readSource("ai-governance.service.ts");

  assert.match(types, /export type AiModelSelectionMode = "AUTOMATIC" \| "MANUAL"/);
  assert.match(service, /modelSelectionMode: "AUTOMATIC"/);
  assert.match(service, /defaultModel: "automatic"/);
  assert.match(service, /automaticModelSelection: true/);
  assert.match(service, /manualModelSelectionRequiresRoleAndSubscription: true/);
  assert.match(service, /extensibleProviderArchitecture: true/);
});

test("cost summary monitors monthly budget consumption agents and projects", () => {
  const types = readSource("ai-governance.types.ts");
  const service = readSource("ai-governance.service.ts");
  const controller = readSource("ai-governance.controller.ts");

  assert.match(types, /interface AiCostSummary/);
  assert.match(types, /monthlyBudget/);
  assert.match(types, /monthlyConsumption/);
  assert.match(types, /remainingBudget/);
  assert.match(types, /consumptionByAgent/);
  assert.match(types, /consumptionByProject/);
  assert.match(service, /getCostSummary/);
  assert.match(service, /groupUsageByAgent/);
  assert.match(service, /groupUsageByProject/);
  assert.match(controller, /@Get\("cost-summary"\)/);
});

test("Platform Creator has unrestricted AI access independent of subscription limits", () => {
  const service = readSource("ai-governance.service.ts");

  assert.match(service, /roles\.has\("PLATFORM_CREATOR"\)/);
  assert.match(service, /isPlatformCreator/);
  assert.match(service, /platformCreatorUnlimited: true/);
  assert.match(service, /hardLimitReached: false/);
  assert.match(service, /blockedActionOnly: false/);
});

test("AI agent integration registry includes approved Phase 2 and Phase 3 agents", () => {
  const types = readSource("ai-governance.types.ts");

  for (const agentName of [
    "Translation AI",
    "Lexicographic AI",
    "Semantic Fidelity",
    "Editorial Decision Agent",
    "Layout Publishing Agent",
    "Multimedia Creation Agent",
    "Media Localization Agent",
    "Platform Engineering Agent",
    "Scheduling Agent",
    "Author Studio AI",
    "Research AI"
  ]) {
    assert.match(types, new RegExp(`"${agentName}"`));
  }
});

test("override requests require authorized human approval and support rejection", () => {
  const service = readSource("ai-governance.service.ts");
  const repository = readSource("ai-governance.repository.ts");
  const types = readSource("ai-governance.types.ts");

  assert.match(types + service, /AiBudgetOverrideRequest/);
  assert.match(service, /createOverrideRequest/);
  assert.match(service, /approveOverrideRequest/);
  assert.match(service, /rejectOverrideRequest/);
  assert.match(service, /AI cannot approve its own budget increase/);
  assert.match(service, /AI-initiated override requests require separate human review/);
  assert.match(service, /finalAuthority: "AUTHORIZED_HUMAN"/);
  assert.match(repository, /ai_budget_override_requests/);
  assert.match(service, /AI_BUDGET_OVERRIDE_REQUEST_CREATED/);
  assert.match(service, /AI_BUDGET_OVERRIDE_APPROVED/);
  assert.match(service, /AI_BUDGET_OVERRIDE_REJECTED/);
});

test("human final authority and cost history protections are explicit", () => {
  const types = readSource("ai-governance.types.ts");
  const service = readSource("ai-governance.service.ts");

  assert.match(types + service, /humanApprovalRequired: true/);
  assert.match(types + service, /humanFinalAuthority: true/);
  assert.match(types, /aiMayEstimateCost: true/);
  assert.match(types, /aiMaySuggestOptimizations: true/);
  assert.match(types, /aiMayWarnBudgetRisk: true/);
  assert.match(types, /aiMayRecommendQuotaChanges: true/);
  assert.match(types, /aiCannotApproveOwnBudgetIncrease: true/);
  assert.match(types, /aiCannotBypassHardLimits: true/);
  assert.match(types, /aiCannotAlterCostHistory: true/);
  assert.match(types, /aiCannotDeleteUsageRecords: true/);
  assert.doesNotMatch(service, /\b(deleteUsage|alterCostHistory|bypassHardLimit|approveOwnBudgetIncrease)\s*\(/i);
});

test("AI governance preserves tenant isolation through admin context and tenant-scoped repositories", () => {
  const controller = readSource("ai-governance.controller.ts");
  const repository = readSource("ai-governance.repository.ts");
  const service = readSource("ai-governance.service.ts");

  assert.match(controller, /AuthenticatedRequestContext/);
  assert.match(service, /roles\.has\("ADMIN"\)/);
  assert.match(service, /actor\.organizationId/);
  assert.match(repository, /selectForTenant<AiUsageRecord>/);
  assert.match(repository, /selectForTenant<AiBudget>/);
  assert.match(repository, /selectForTenant<AiQuota>/);
  assert.match(repository, /selectForTenant<AiCostPolicy>/);
  assert.match(repository, /findByIdForTenant<AiBudgetOverrideRequest>/);
  assert.doesNotMatch(controller + service, /x-user-id|x-organization-id|x-user-roles/);
});

test("AI cost audit trail and backup restore include all AI governance tables", () => {
  const repository = readSource("ai-governance.repository.ts");
  const service = readSource("ai-governance.service.ts");
  const types = readSource("ai-governance.types.ts");

  assert.match(repository, /ai_cost_audit_events/);
  assert.match(types, /AiCostAuditEvent/);

  for (const action of [
    "AI_PROVIDER_CHANGED",
    "AI_FALLBACK_ACTIVATED",
    "AI_FALLBACK_RECOVERED",
    "AI_USAGE_RECORDED",
    "AI_BUDGET_CREATED",
    "AI_QUOTA_CREATED",
    "AI_COST_POLICY_CREATED",
    "AI_BUDGET_WARNING",
    "AI_BUDGET_EXCEEDED",
    "AI_ACTION_BLOCKED",
    "AI_SUBSCRIPTION_UPGRADED",
    "AI_SUBSCRIPTION_DOWNGRADED",
    "AI_BUDGET_OVERRIDE_REQUEST_CREATED",
    "AI_BUDGET_OVERRIDE_APPROVED",
    "AI_BUDGET_OVERRIDE_REJECTED"
  ]) {
    assert.match(types + service, new RegExp(`${action}`));
  }

  for (const tableName of [
    "ai_usage_records",
    "ai_provider_statuses",
    "ai_budgets",
    "ai_quotas",
    "ai_cost_policies",
    "ai_budget_override_requests",
    "ai_cost_audit_events"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`));
    assert.match(runtimeBackup, new RegExp(`"${tableName}"`));
    assert.match(backupRestoreTest, new RegExp(`${tableName}`));
  }

  assert.match(runtimeDatabase, /"ai_budget_override_requests",\s*"budgetId",\s*"ai_budgets"/);
  assert.match(runtimeBackup, /"ai_cost_audit_events",\s*"overrideRequestId",\s*"ai_budget_override_requests"/);
  assert.match(backupRestoreTest, /ai-usage-a/);
  assert.match(backupRestoreTest, /ai-override-a/);
});

test("AI governance remains metadata-only without external billing integration", () => {
  const service = readSource("ai-governance.service.ts");
  const repository = readSource("ai-governance.repository.ts");

  assert.match(service, /externalBillingIntegration: "NOT_CONFIGURED"/);
  assert.match(service, /providerCostApiConnected: false/);
  assert.doesNotMatch(service + repository, /stripe|paypal|billingProvider|providerCostApiClient|fetch\(|axios/i);
});
