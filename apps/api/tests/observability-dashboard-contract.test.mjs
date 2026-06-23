import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleDir = join(__dirname, "..", "src", "modules", "observability");
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

test("observability module is registered with health dashboard endpoints", () => {
  const controller = readSource("observability.controller.ts");
  const moduleSource = readSource("observability.module.ts");

  assert.match(appModule, /ObservabilityModule/);
  assert.match(moduleSource, /DatabaseObservabilityRepository/);
  assert.match(moduleSource, /ObservabilityService/);
  assert.match(controller, /@Controller\("observability"\)/);
  assert.match(controller, /@Get\("health"\)/);
  assert.match(controller, /@Get\("metrics"\)/);
  assert.match(controller, /@Get\("logs"\)/);
  assert.match(controller, /@Get\("traces"\)/);
  assert.match(controller, /@Get\("agent-executions"\)/);
  assert.match(controller, /CurrentActor/);
});

test("system health exposes uptime module runtime database and backup status", () => {
  const service = readSource("observability.service.ts");
  const types = readSource("observability.types.ts");

  assert.match(types, /apiUptimeSeconds/);
  assert.match(types, /runtimeDatabaseStatus/);
  assert.match(types, /backupStatus/);
  assert.match(types, /moduleHealth/);
  assert.match(types, /externalApmIntegration: "NOT_CONFIGURED"/);
  assert.match(service, /process\.uptime\(\)/);
  assert.match(service, /runtimeDatabaseStatus: "AVAILABLE"/);
  assert.match(service, /backupStatus: "CONFIGURED"/);
  assert.match(service, /OBSERVABILITY_HEALTH_READ/);
});

test("metrics recording covers request counts errors latency module health and DB backup metadata", () => {
  const service = readSource("observability.service.ts");
  const repository = readSource("observability.repository.ts");
  const types = readSource("observability.types.ts");

  for (const field of [
    "requestCount",
    "errorCount",
    "latencyMs",
    "runtimeDatabaseStatus",
    "backupStatus",
    "metricType",
    "moduleName"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  assert.match(service, /recordMetric/);
  assert.match(service, /api\.requests\.total/);
  assert.match(service, /api\.errors\.total/);
  assert.match(service, /api\.latency\.p95/);
  assert.match(repository, /observability_metrics/);
  assert.match(service, /OBSERVABILITY_METRIC_RECORDED/);
});

test("structured logs include severity module correlation actor tenant request path and metadata", () => {
  const service = readSource("observability.service.ts");
  const repository = readSource("observability.repository.ts");
  const types = readSource("observability.types.ts");

  for (const severity of ["DEBUG", "INFO", "WARN", "ERROR", "CRITICAL"]) {
    assert.match(types, new RegExp(`"${severity}"`));
  }

  for (const field of [
    "correlationId",
    "actorId",
    "organizationId",
    "requestPath",
    "message",
    "metadata"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  assert.match(service, /recordLog/);
  assert.match(repository, /observability_logs/);
  assert.match(service, /OBSERVABILITY_LOG_RECORDED/);
});

test("traces include trace correlation span module duration status and parent span placeholder", () => {
  const service = readSource("observability.service.ts");
  const repository = readSource("observability.repository.ts");
  const types = readSource("observability.types.ts");

  for (const field of [
    "traceId",
    "correlationId",
    "spanName",
    "moduleName",
    "durationMs",
    "status",
    "parentSpanId"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  assert.match(service, /recordTrace/);
  assert.match(service, /parentSpanPlaceholder/);
  assert.match(repository, /observability_traces/);
  assert.match(service, /OBSERVABILITY_TRACE_RECORDED/);
});

test("agent execution tracking covers AI workflow visibility cost tokens dependencies and audit link", () => {
  const service = readSource("observability.service.ts");
  const repository = readSource("observability.repository.ts");
  const types = readSource("observability.types.ts");

  for (const field of [
    "agentName",
    "executionType",
    "projectId",
    "documentId",
    "durationMs",
    "estimatedCost",
    "tokenUsageMetadata",
    "dependencies",
    "auditLink"
  ]) {
    assert.match(types + service, new RegExp(`${field}`));
  }

  assert.match(service, /recordAgentExecution/);
  assert.match(repository, /observability_agent_executions/);
  assert.match(service, /OBSERVABILITY_AGENT_EXECUTION_RECORDED/);
});

test("observability preserves tenant isolation through server-derived context and repository access", () => {
  const controller = readSource("observability.controller.ts");
  const repository = readSource("observability.repository.ts");
  const service = readSource("observability.service.ts");

  assert.match(controller, /AuthenticatedRequestContext/);
  assert.match(service, /actor\.organizationId/);
  assert.match(service, /Authenticated observability context is required/);
  assert.match(repository, /selectForTenant<ObservabilityMetric>/);
  assert.match(repository, /selectForTenant<ObservabilityLogRecord>/);
  assert.match(repository, /selectForTenant<ObservabilityTrace>/);
  assert.match(repository, /selectForTenant<ObservabilityAgentExecution>/);
  assert.doesNotMatch(controller + service, /x-user-id|x-organization-id|x-user-roles/);
});

test("human final authority is preserved and AI cannot hide or delete observability records", () => {
  const service = readSource("observability.service.ts");
  const types = readSource("observability.types.ts");

  assert.match(types, /aiMayDiagnose: true/);
  assert.match(types, /aiMaySummarizeIncidents: true/);
  assert.match(types, /aiMaySuggestRemediation: true/);
  assert.match(types, /aiMayAutoExecuteInfrastructureActions: false/);
  assert.match(types + service, /humanFinalAuthority: true/);
  assert.doesNotMatch(
    service,
    /\b(deleteLog|deleteMetric|deleteTrace|hideError|suppressError|executeInfrastructureAction|restartContainer)\s*\(/i
  );
});

test("observability audit trail and backup restore include all dashboard data", () => {
  const repository = readSource("observability.repository.ts");
  const service = readSource("observability.service.ts");
  const types = readSource("observability.types.ts");

  assert.match(repository, /observability_audit_events/);
  assert.match(types, /ObservabilityAuditEvent/);

  for (const action of [
    "OBSERVABILITY_HEALTH_READ",
    "OBSERVABILITY_METRIC_RECORDED",
    "OBSERVABILITY_LOG_RECORDED",
    "OBSERVABILITY_TRACE_RECORDED",
    "OBSERVABILITY_AGENT_EXECUTION_RECORDED"
  ]) {
    assert.match(service + types, new RegExp(`${action}`));
  }

  for (const tableName of [
    "observability_metrics",
    "observability_logs",
    "observability_traces",
    "observability_agent_executions",
    "observability_audit_events"
  ]) {
    assert.match(runtimeDatabase, new RegExp(`"${tableName}"`));
    assert.match(runtimeBackup, new RegExp(`"${tableName}"`));
    assert.match(backupRestoreTest, new RegExp(`${tableName}`));
  }

  assert.match(runtimeDatabase, /"observability_audit_events",\s*"metricId",\s*"observability_metrics"/);
  assert.match(runtimeBackup, /"observability_audit_events",\s*"agentExecutionId",\s*"observability_agent_executions"/);
  assert.match(backupRestoreTest, /observability-metric-a/);
  assert.match(backupRestoreTest, /observability-agent-a/);
});

test("observability remains provider-free without external APM integration", () => {
  const service = readSource("observability.service.ts");
  const repository = readSource("observability.repository.ts");

  assert.match(service, /externalApmIntegration: "NOT_CONFIGURED"/);
  assert.doesNotMatch(service + repository, /prom-client|grafana|datadog|newrelic|sentry|opentelemetry|fetch\(|axios/i);
});
