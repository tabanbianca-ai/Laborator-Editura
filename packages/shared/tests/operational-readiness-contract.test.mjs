import assert from "node:assert/strict";
import test from "node:test";

import {
  OPERATIONAL_READINESS_SCHEMA_VERSION,
  RC1_BLOCKING_CONDITIONS,
  REQUIRED_STRUCTURED_LOG_FIELDS,
  assessRpoRto,
  canPromoteImmutableArtifact,
  evaluateAlertQuality,
  evaluateBackupCoverage,
  evaluateRc1Readiness,
  isActionableAlert,
  validateOperationalInventory,
  validateRestoreEvidence
} from "../dist/operational-readiness.js";
import { createStructuredLogEvent } from "../dist/structured-logging.js";

test("operational readiness contract exports canonical schema and log fields", () => {
  assert.equal(OPERATIONAL_READINESS_SCHEMA_VERSION, "1.0.0");

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
    assert.ok(REQUIRED_STRUCTURED_LOG_FIELDS.includes(field));
  }

  assert.ok(RC1_BLOCKING_CONDITIONS.includes("UNTESTED_CRITICAL_RESTORE"));
});

test("critical operational inventory requires ownership, health, telemetry, and RPO/RTO", () => {
  const issues = validateOperationalInventory([
    {
      id: "api",
      name: "API",
      type: "APPLICATION",
      environment: "STAGING",
      owner: "OWNER_UNRESOLVED",
      runtime: "Node.js",
      dependencies: [],
      dataStores: ["runtime-db"],
      externalDependencies: [],
      healthChecks: [],
      loggingStatus: "MISSING",
      metricsStatus: "MISSING",
      tracingStatus: "PARTIAL",
      backupClassification: "BACKUP_REQUIRED",
      criticality: "CRITICAL"
    }
  ]);

  assert.deepEqual(issues.map((issue) => issue.code), [
    "UNOWNED_CRITICAL_SERVICE",
    "CRITICAL_HEALTH_CHECK_REQUIRED",
    "LOGGING_REQUIRED",
    "METRICS_REQUIRED",
    "RPO_RTO_REQUIRED"
  ]);
});

test("alerts must be actionable and duplicate-free", () => {
  assert.equal(
    isActionableAlert({
      id: "alert-1",
      name: "API down",
      severity: "CRITICAL",
      owner: "Platform Operations",
      signal: "api_health",
      condition: "status != ok",
      duration: "5m",
      runbookId: "RUNBOOK-API-HEALTH",
      notificationTarget: "staging-ops",
      enabled: true,
      version: "1.0.0",
      action: "Check API container and health endpoint."
    }),
    true
  );

  const issues = evaluateAlertQuality([
    {
      id: "alert-1",
      name: "API down",
      severity: "CRITICAL",
      owner: "",
      signal: "api_health",
      condition: "status != ok",
      duration: "5m",
      runbookId: "",
      notificationTarget: "",
      enabled: true,
      version: "1.0.0",
      action: ""
    },
    {
      id: "alert-2",
      name: "API down duplicate",
      severity: "CRITICAL",
      owner: "Platform Operations",
      signal: "api_health",
      condition: "status != ok",
      duration: "5m",
      runbookId: "RUNBOOK-API-HEALTH",
      notificationTarget: "staging-ops",
      enabled: true,
      version: "1.0.0",
      action: "Check API container and health endpoint."
    }
  ]);

  assert.deepEqual(issues.map((issue) => issue.code), ["NON_ACTIONABLE_ALERT", "DUPLICATE_ALERT"]);
});

test("backup coverage requires policy and restore evidence for critical resources", () => {
  const issues = evaluateBackupCoverage([
    {
      resourceId: "runtime-db",
      resourceName: "Runtime database",
      criticality: "CRITICAL",
      classification: "BACKUP_REQUIRED",
      owner: "Platform Operations",
      includedInBackup: true,
      latestRestoreStatus: "NOT_TESTED"
    }
  ]);

  assert.deepEqual(issues.map((issue) => issue.code), [
    "BACKUP_POLICY_REQUIRED",
    "RESTORE_EVIDENCE_REQUIRED"
  ]);
});

test("RPO/RTO assessment requires measured evidence and detects breaches", () => {
  assert.equal(
    assessRpoRto({
      resourceId: "runtime-db",
      approvedRpoMinutes: 60,
      approvedRtoMinutes: 120
    }).status,
    "UNMEASURED"
  );

  assert.equal(
    assessRpoRto({
      resourceId: "runtime-db",
      approvedRpoMinutes: 60,
      approvedRtoMinutes: 120,
      measuredRpoMinutes: 90,
      measuredRtoMinutes: 60
    }).status,
    "BREACHED"
  );
});

test("restore evidence must prove isolated restore, integrity, tenant safety, and corrupted backup rejection", () => {
  const issues = validateRestoreEvidence({
    id: "restore-1",
    backupId: "backup-1",
    environment: "STAGING",
    executedAt: "2026-08-09T00:00:00Z",
    executedBy: "Platform Operations",
    isolatedEnvironment: true,
    integrityVerified: true,
    dataRelationshipsVerified: true,
    crossTenantIsolationVerified: true,
    applicationStartVerified: true,
    criticalJourneyVerified: false,
    corruptedBackupRejected: false,
    result: "PASSED"
  });

  assert.deepEqual(issues.map((issue) => issue.code), [
    "CRITICAL_JOURNEY_RESTORE_REQUIRED",
    "CORRUPTED_BACKUP_REJECTION_REQUIRED"
  ]);
});

test("immutable artifact promotion requires exact artifact reuse and supply-chain evidence", () => {
  assert.equal(
    canPromoteImmutableArtifact({
      id: "artifact-1",
      sourceCommit: "abc",
      buildDigest: "sha256:build",
      stagingDigest: "sha256:build",
      artifactImmutable: true,
      testsPassed: true,
      securityScanPassed: true,
      sbomGenerated: true,
      provenanceCaptured: true,
      environmentParityChecked: true
    }),
    true
  );

  assert.equal(
    canPromoteImmutableArtifact({
      id: "artifact-2",
      sourceCommit: "abc",
      buildDigest: "sha256:build",
      stagingDigest: "sha256:rebuilt",
      artifactImmutable: true,
      testsPassed: true,
      securityScanPassed: true,
      sbomGenerated: true,
      provenanceCaptured: true,
      environmentParityChecked: true
    }),
    false
  );
});

test("RC1 readiness blocks on untested critical gates", () => {
  const result = evaluateRc1Readiness({
    gates: [
      {
        gate: "UNTESTED_CRITICAL_RESTORE",
        status: "NOT_TESTED",
        evidence: "No isolated restore evidence yet.",
        blocker: true
      },
      {
        gate: "DASHBOARD_COVERAGE",
        status: "WARN",
        evidence: "Dashboards are canonical docs only.",
        blocker: false
      }
    ]
  });

  assert.equal(result.status, "BLOCKED");
  assert.equal(result.blockers[0].gate, "UNTESTED_CRITICAL_RESTORE");
});

test("structured logging carries distributed trace fields and redacts sensitive editorial metadata", () => {
  const event = createStructuredLogEvent({
    timestamp: "2026-08-09T00:00:00Z",
    severity: "INFO",
    service: "api",
    module: "translation",
    environment: "staging",
    eventName: "translation.requested",
    correlationId: "corr-1",
    traceId: "trace-1",
    spanId: "span-1",
    actorId: "user-1",
    organizationId: "org-1",
    resourceId: "segment-1",
    message: "Translation request accepted.",
    metadata: {
      nested: {
        apiToken: "secret-token",
        prompt: "full prompt",
        mediaPayload: "binary"
      },
      safe: "value"
    }
  });

  assert.equal(event.span_id, "span-1");
  assert.equal(event.organization_id, "org-1");
  assert.deepEqual(event.metadata, {
    nested: {
      apiToken: "[REDACTED]",
      prompt: "[REDACTED]",
      mediaPayload: "[REDACTED]"
    },
    safe: "value"
  });
});
