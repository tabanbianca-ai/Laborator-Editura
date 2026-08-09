import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = join(__dirname, "..", "..", "..");
const batchDir = join(
  repositoryRoot,
  "docs",
  "implementation",
  "execution-batches",
  "batch-10"
);

const requiredDocuments = [
  "overview.md",
  "operational-inventory.md",
  "telemetry-architecture.md",
  "logging-metrics-tracing.md",
  "dashboard-catalog.md",
  "alert-registry.md",
  "runbook-registry.md",
  "incident-response.md",
  "backup-coverage.md",
  "rpo-rto-assessment.md",
  "restore-evidence.md",
  "disaster-recovery.md",
  "business-continuity.md",
  "degraded-modes.md",
  "devsecops-hardening.md",
  "supply-chain-security.md",
  "sbom.md",
  "build-provenance.md",
  "deployment-strategy.md",
  "rollback-validation.md",
  "security-test-evidence.md",
  "resilience-test-evidence.md",
  "operational-ownership.md",
  "compliance-evidence.md",
  "rc1-readiness.md",
  "changed-files.md",
  "rollback-plan.md",
  "compliance-report.md",
  "next-batch-proposal.md"
];

function readRepositoryFile(...pathSegments) {
  return readFileSync(join(repositoryRoot, ...pathSegments), "utf8");
}

function readBatchDocument(fileName) {
  return readRepositoryFile("docs", "implementation", "execution-batches", "batch-10", fileName);
}

test("Batch 10 required operational readiness documentation deliverables exist", () => {
  for (const fileName of requiredDocuments) {
    const filePath = join(batchDir, fileName);
    assert.equal(existsSync(filePath), true, `${fileName} must exist`);
    assert.ok(readFileSync(filePath, "utf8").trim().length > 0, `${fileName} must not be empty`);
  }
});

test("Batch 10 documentation defines RC1 operational readiness gates", () => {
  const overview = readBatchDocument("overview.md");
  const inventory = readBatchDocument("operational-inventory.md");
  const telemetry = readBatchDocument("telemetry-architecture.md");
  const logging = readBatchDocument("logging-metrics-tracing.md");
  const alerts = readBatchDocument("alert-registry.md");
  const runbooks = readBatchDocument("runbook-registry.md");
  const restore = readBatchDocument("restore-evidence.md");
  const rc1 = readBatchDocument("rc1-readiness.md");

  assert.match(overview, /does not add editorial functionality/);
  assert.match(inventory, /No critical service may be unowned/);
  assert.match(telemetry, /Public request -> Web -> API -> Workflow\/Module service/);
  assert.match(telemetry, /must never log secrets, tokens, cookies, passwords, raw editorial documents/);
  assert.match(logging, /span_id/);
  assert.match(logging, /organization_id/);
  assert.match(alerts, /Alerts without an owner, runbook, destination, action, condition, or version are not actionable/);
  assert.match(runbooks, /Every Critical or High alert must link to one runbook/);
  assert.match(restore, /corrupted backup is rejected/);
  assert.match(rc1, /Status: BLOCKED/);
});

test("shared operational readiness package exposes canonical operations contract", () => {
  const source = readRepositoryFile("packages", "shared", "src", "operational-readiness.ts");
  const index = readRepositoryFile("packages", "shared", "src", "index.ts");
  const packageJson = readRepositoryFile("packages", "shared", "package.json");
  const esmRewrite = readRepositoryFile(
    "packages",
    "shared",
    "scripts",
    "ensure-esm-file-exports.mjs"
  );

  for (const symbol of [
    "OPERATIONAL_READINESS_SCHEMA_VERSION",
    "OperationalComponentInventoryItem",
    "REQUIRED_STRUCTURED_LOG_FIELDS",
    "OperationalAlertDefinition",
    "OperationalBackupCoverageRecord",
    "OperationalRestoreEvidence",
    "OperationalDeploymentArtifactCandidate",
    "RC1_BLOCKING_CONDITIONS",
    "validateOperationalInventory",
    "evaluateAlertQuality",
    "evaluateBackupCoverage",
    "assessRpoRto",
    "validateRestoreEvidence",
    "canPromoteImmutableArtifact",
    "evaluateRc1Readiness"
  ]) {
    assert.match(source, new RegExp(symbol), `${symbol} must exist`);
  }

  assert.match(index, /export \* from "\.\/operational-readiness"/);
  assert.match(packageJson, /"\.\/operational-readiness"/);
  assert.match(esmRewrite, /operational-readiness\.js/);
});

test("structured logging includes distributed tracing and tenant fields with sensitive redaction", () => {
  const source = readRepositoryFile("packages", "shared", "src", "structured-logging.ts");

  for (const field of [
    "timestamp",
    "severity",
    "environment",
    "service",
    "module",
    "event_name",
    "correlation_id",
    "trace_id",
    "span_id",
    "actor_id",
    "organization_id",
    "resource_id",
    "message",
    "metadata"
  ]) {
    assert.match(source, new RegExp(field), `${field} must be represented`);
  }

  for (const redaction of [
    "authorization",
    "password",
    "secret",
    "token",
    "prompt",
    "raw_document",
    "document_text",
    "media_payload",
    "voice_sample"
  ]) {
    assert.match(source, new RegExp(redaction), `${redaction} must be redacted`);
  }
});

test("existing CI and staging workflows include operational validation controls", () => {
  const ci = readRepositoryFile(".github", "workflows", "ci.yml");
  const stagingDeploy = readRepositoryFile(".github", "workflows", "staging-deploy.yml");
  const stagingOperations = readRepositoryFile(".github", "workflows", "staging-operations.yml");

  for (const required of [
    "scan-secrets.sh",
    "validate-configuration.mjs",
    "docker compose",
    "systemd-analyze verify",
    "validate-nginx-template.sh",
    "pnpm typecheck",
    "pnpm test",
    "pnpm build",
    "trivy-action"
  ]) {
    assert.match(ci, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(stagingDeploy, /deploy-staging\.sh --ref/);
  assert.match(stagingOperations, /backup-dry-run/);
  assert.match(stagingOperations, /restore-dry-run/);
  assert.match(stagingOperations, /rollback/);
});

test("infrastructure pack contains validators, backup restore scripts, monitoring, and runbooks", () => {
  for (const pathSegments of [
    ["infrastructure", "validation", "validate-infrastructure.sh"],
    ["infrastructure", "validation", "validate-nginx-template.sh"],
    ["infrastructure", "validation", "scan-secrets.sh"],
    ["infrastructure", "backup", "backup-laborator.sh"],
    ["infrastructure", "backup", "restore-dry-run.sh"],
    ["infrastructure", "backup", "verify-backup.sh"],
    ["infrastructure", "monitoring", "monitor-laborator.sh"],
    ["infrastructure", "docs", "BACKUP_RESTORE_RUNBOOK.md"],
    ["infrastructure", "docs", "DEPLOYMENT_RUNBOOK.md"],
    ["infrastructure", "docs", "DISASTER_RECOVERY_RUNBOOK.md"],
    ["infrastructure", "docs", "MONITORING_RUNBOOK.md"],
    ["infrastructure", "docs", "SECURITY_HARDENING_RUNBOOK.md"]
  ]) {
    assert.equal(existsSync(join(repositoryRoot, ...pathSegments)), true, pathSegments.join("/"));
  }
});

