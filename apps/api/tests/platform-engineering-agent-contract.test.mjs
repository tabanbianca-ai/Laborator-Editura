import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "platform-engineering");
const appModule = readFileSync(join(__dirname, "..", "src", "modules", "app.module.ts"), "utf8");
const runtimeDatabase = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "src", "runtime-database.ts"),
  "utf8"
);
const runtimeBackup = readFileSync(
  join(__dirname, "..", "..", "..", "packages", "db", "scripts", "runtime-backup-lib.mjs"),
  "utf8"
);

function readSource(name) {
  return readFileSync(join(moduleDir, name), "utf8");
}

test("platform engineering agent is registered with authenticated endpoints", () => {
  const controller = readSource("platform-engineering.controller.ts");
  const moduleSource = readSource("platform-engineering.module.ts");

  assert.match(appModule, /PlatformEngineeringModule/);
  assert.match(moduleSource, /DatabasePlatformEngineeringRepository/);
  assert.match(moduleSource, /PlatformEngineeringService/);
  assert.match(controller, /@Controller\("platform-engineering"\)/);
  assert.match(controller, /@Get\("health"\)/);
  assert.match(controller, /@Post\("optimization-plans"\)/);
  assert.match(controller, /@Post\("upgrade-plans"\)/);
  assert.match(controller, /@Post\("backup-plans"\)/);
  assert.match(controller, /@Post\("restore-plans"\)/);
  assert.match(controller, /@Post\("healing-plans"\)/);
  assert.match(controller, /@Post\("agent-coordination-runs"\)/);
  assert.match(controller, /@Post\("plans\/:id\/approve"\)/);
  assert.match(controller, /@Post\("plans\/:id\/reject"\)/);
  assert.match(controller, /CurrentActor/);
  assert.doesNotMatch(controller, /x-user-id/);
  assert.doesNotMatch(controller, /x-organization-id/);
});

test("health diagnostics cover API web runtime DB backup modules and agents", () => {
  const service = readSource("platform-engineering.service.ts");
  const types = readSource("platform-engineering.types.ts");

  for (const field of [
    "apiHealth",
    "webHealth",
    "runtimeDatabaseStatus",
    "backupStatus",
    "moduleReadiness",
    "agentReadiness",
    "destructiveActionsExecuted"
  ]) {
    assert.match(types, new RegExp(`${field}:`));
    assert.match(service, new RegExp(`${field}:`));
  }

  assert.match(service, /PLATFORM_HEALTH_DIAGNOSTIC_RUN/);
});

test("optimization plan creation stores recommended optimization categories", () => {
  const service = readSource("platform-engineering.service.ts");
  const types = readSource("platform-engineering.types.ts");

  for (const field of [
    "backendOptimizationRecommendations",
    "databaseIndexOptimizationRecommendations",
    "cacheRecommendations",
    "dockerResourceRecommendations",
    "aiCostOptimizationRecommendations"
  ]) {
    assert.match(types, new RegExp(`${field}:`));
    assert.match(service, new RegExp(`${field}:`));
  }

  assert.match(types, /"OPTIMIZATION"/);
  assert.match(service, /OPTIMIZATION_PLAN_CREATED/);
});

test("upgrade plan creation stores dependency metadata risk rollback and platform stack plans", () => {
  const service = readSource("platform-engineering.service.ts");
  const types = readSource("platform-engineering.types.ts");

  for (const field of [
    "dependencyUpgradePlanMetadata",
    "nodePlan",
    "nestjsPlan",
    "nextjsPlan",
    "dockerPlan",
    "postgresqlPlan",
    "redisPlan",
    "rollbackPlan"
  ]) {
    assert.match(types, new RegExp(`${field}\\??:`));
    assert.match(service, new RegExp(`${field}:`));
  }

  assert.match(types, /"UPGRADE"/);
  assert.match(types, /PlatformEngineeringRiskLevel/);
  assert.match(service, /UPGRADE_PLAN_CREATED/);
});

test("backup and restore plan creation is simulation-only and non-destructive", () => {
  const service = readSource("platform-engineering.service.ts");
  const types = readSource("platform-engineering.types.ts");

  assert.match(types, /BackupRestorePlanProfile/);
  assert.match(types, /simulationModeOnly: true/);
  assert.match(types, /destructiveExecutionAllowed: false/);
  assert.match(service, /BACKUP_PLAN_CREATED/);
  assert.match(service, /RESTORE_PLAN_CREATED/);
  assert.match(service, /simulationModeOnly: true/);
  assert.match(service, /destructiveExecutionAllowed: false/);
  assert.match(service, /non-destructive-simulation/);
});

test("healing plan creation records recommendations without automatic restart", () => {
  const service = readSource("platform-engineering.service.ts");
  const types = readSource("platform-engineering.types.ts");

  for (const field of [
    "restartRecommendations",
    "recoveryRecommendations",
    "serviceHealthRemediationPlans"
  ]) {
    assert.match(types, new RegExp(`${field}:`));
    assert.match(service, new RegExp(`${field}:`));
  }

  assert.match(types, /automaticExecution: false/);
  assert.match(service, /HEALING_PLAN_CREATED/);
  assert.match(service, /automaticExecution: false/);
});

test("agent coordination runs track dependencies execution order cost estimates and audit", () => {
  const repository = readSource("platform-engineering.repository.ts");
  const service = readSource("platform-engineering.service.ts");
  const types = readSource("platform-engineering.types.ts");

  for (const field of [
    "agentExecutionPlans",
    "dependenciesBetweenAgents",
    "executionOrder",
    "costEstimates"
  ]) {
    assert.match(types, new RegExp(`${field}:`));
    assert.match(service, new RegExp(`${field}:`));
  }

  assert.match(repository, /agent_coordination_runs/);
  assert.match(service, /AGENT_COORDINATION_RUN_CREATED/);
});

test("platform engineering preserves human final authority and blocks AI auto approval", () => {
  const service = readSource("platform-engineering.service.ts");
  const types = readSource("platform-engineering.types.ts");

  assert.match(types, /humanApprovalRequired: true/);
  assert.match(types, /approvalStatus: PlatformEngineeringApprovalStatus/);
  assert.match(types, /executionMode: "PLANNING_ONLY"/);
  assert.match(service, /humanApprovalRequired: true/);
  assert.match(service, /approvalStatus: "PENDING_HUMAN_APPROVAL"/);
  assert.match(service, /executionMode: "PLANNING_ONLY"/);
  assert.match(service, /assertAuthorizedHuman/);
  assert.match(service, /Only authorized humans may approve platform operations/);
  assert.match(service, /finalAuthority: "AUTHORIZED_HUMAN"/);
});

test("platform engineering audit trail is preserved for plans approval rejection health and coordination", () => {
  const repository = readSource("platform-engineering.repository.ts");
  const service = readSource("platform-engineering.service.ts");
  const types = readSource("platform-engineering.types.ts");

  assert.match(repository, /platform_engineering_plans/);
  assert.match(repository, /platform_engineering_audit_events/);
  assert.match(types, /PlatformEngineeringAuditTrailItem/);
  assert.match(types, /PLATFORM_HEALTH_DIAGNOSTIC_RUN/);
  assert.match(types, /PLATFORM_PLAN_APPROVED/);
  assert.match(types, /PLATFORM_PLAN_REJECTED/);
  assert.match(service, /auditTrail/);
  assert.match(service, /repository\.appendAuditEvent/);
});

test("platform engineering performs planning only and avoids real infrastructure execution", () => {
  const service = readSource("platform-engineering.service.ts");

  assert.match(service, /noRealExecution: true/);
  assert.match(service, /destructiveActionsExecuted: false/);
  assert.doesNotMatch(service, /child_process/);
  assert.doesNotMatch(service, /spawnSync/);
  assert.doesNotMatch(service, /execFile/);
  assert.doesNotMatch(service, /restoreRuntimeDatabase\(/);
});

test("runtime persistence and backup include platform engineering data", () => {
  for (const tableName of [
    "platform_engineering_plans",
    "platform_engineering_audit_events",
    "agent_coordination_runs"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`));
    assert.match(runtimeBackup, new RegExp(`"${tableName}"`));
  }

  assert.match(runtimeDatabase, /"platformEngineeringPlanId"/);
  assert.match(runtimeBackup, /"agentCoordinationRunId"/);
});
