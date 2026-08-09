export const OPERATIONAL_READINESS_SCHEMA_VERSION = "1.0.0" as const;

export type OperationalEnvironment =
  | "CI"
  | "DISASTER_RECOVERY"
  | "LOCAL"
  | "PRODUCTION"
  | "STAGING";

export type OperationalCriticality = "CRITICAL" | "HIGH" | "LOW" | "MEDIUM";

export type OperationalComponentType =
  | "APPLICATION"
  | "BACKGROUND_WORKER"
  | "DATABASE"
  | "EXTERNAL_PROVIDER"
  | "INFRASTRUCTURE"
  | "SCRIPT"
  | "WORKFLOW";

export type OperationalTelemetryStatus =
  | "IMPLEMENTED"
  | "MISSING"
  | "NOT_APPLICABLE"
  | "PARTIAL";

export type OperationalBackupClassification =
  | "ARCHIVE_REQUIRED"
  | "BACKUP_REQUIRED"
  | "REGENERABLE"
  | "TEMPORARY";

export type OperationalReadinessSeverity = "CRITICAL" | "HIGH" | "LOW" | "MEDIUM";

export type OperationalRestoreResult = "FAILED" | "NOT_TESTED" | "PASSED" | "UNKNOWN";

export type OperationalRc1GateStatus = "FAIL" | "NOT_TESTED" | "PASS" | "WARN";

export type OperationalRc1ReadinessStatus =
  | "BLOCKED"
  | "NOT_READY"
  | "READY_FOR_RC1"
  | "READY_WITH_WARNINGS";

export interface OperationalReadinessIssue {
  readonly code: string;
  readonly severity: OperationalReadinessSeverity;
  readonly message: string;
  readonly resourceId?: string;
}

export interface OperationalComponentInventoryItem {
  readonly id: string;
  readonly name: string;
  readonly type: OperationalComponentType;
  readonly environment: OperationalEnvironment | string;
  readonly owner: string;
  readonly runtime: string;
  readonly dependencies: readonly string[];
  readonly dataStores: readonly string[];
  readonly externalDependencies: readonly string[];
  readonly healthChecks: readonly string[];
  readonly loggingStatus: OperationalTelemetryStatus;
  readonly metricsStatus: OperationalTelemetryStatus;
  readonly tracingStatus: OperationalTelemetryStatus;
  readonly backupClassification: OperationalBackupClassification;
  readonly criticality: OperationalCriticality;
  readonly rpoMinutes?: number;
  readonly rtoMinutes?: number;
  readonly runbookId?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export const REQUIRED_STRUCTURED_LOG_FIELDS = [
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
] as const;

export interface OperationalAlertDefinition {
  readonly id: string;
  readonly name: string;
  readonly severity: OperationalReadinessSeverity;
  readonly owner: string;
  readonly signal: string;
  readonly condition: string;
  readonly duration: string;
  readonly runbookId: string;
  readonly notificationTarget: string;
  readonly enabled: boolean;
  readonly version: string;
  readonly action: string;
}

export interface OperationalBackupCoverageRecord {
  readonly resourceId: string;
  readonly resourceName: string;
  readonly criticality: OperationalCriticality;
  readonly classification: OperationalBackupClassification;
  readonly owner: string;
  readonly policyId?: string;
  readonly includedInBackup: boolean;
  readonly restoreEvidenceId?: string;
  readonly latestRestoreStatus?: OperationalRestoreResult;
  readonly rpoMinutes?: number;
  readonly rtoMinutes?: number;
}

export interface OperationalRpoRtoAssessment {
  readonly resourceId: string;
  readonly approvedRpoMinutes: number;
  readonly approvedRtoMinutes: number;
  readonly measuredRpoMinutes?: number;
  readonly measuredRtoMinutes?: number;
}

export type OperationalObjectiveStatus = "AT_RISK" | "BREACHED" | "MEETS_OBJECTIVE" | "UNMEASURED";

export interface OperationalObjectiveAssessmentResult {
  readonly status: OperationalObjectiveStatus;
  readonly issues: readonly OperationalReadinessIssue[];
}

export interface OperationalRestoreEvidence {
  readonly id: string;
  readonly backupId: string;
  readonly environment: OperationalEnvironment | string;
  readonly executedAt: string;
  readonly executedBy: string;
  readonly isolatedEnvironment: boolean;
  readonly integrityVerified: boolean;
  readonly dataRelationshipsVerified: boolean;
  readonly crossTenantIsolationVerified: boolean;
  readonly applicationStartVerified: boolean;
  readonly criticalJourneyVerified: boolean;
  readonly corruptedBackupRejected: boolean;
  readonly result: OperationalRestoreResult;
  readonly evidenceUri?: string;
}

export interface OperationalDeploymentArtifactCandidate {
  readonly id: string;
  readonly sourceCommit: string;
  readonly buildDigest: string;
  readonly stagingDigest?: string;
  readonly productionDigest?: string;
  readonly artifactImmutable: boolean;
  readonly testsPassed: boolean;
  readonly securityScanPassed: boolean;
  readonly sbomGenerated: boolean;
  readonly provenanceCaptured: boolean;
  readonly environmentParityChecked: boolean;
}

export interface OperationalRc1Gate {
  readonly gate: string;
  readonly status: OperationalRc1GateStatus;
  readonly evidence: string;
  readonly blocker: boolean;
}

export interface OperationalRc1ReadinessInput {
  readonly gates: readonly OperationalRc1Gate[];
}

export interface OperationalRc1ReadinessResult {
  readonly status: OperationalRc1ReadinessStatus;
  readonly blockers: readonly OperationalRc1Gate[];
  readonly warnings: readonly OperationalRc1Gate[];
}

export const RC1_BLOCKING_CONDITIONS = [
  "UNOWNED_CRITICAL_SERVICE",
  "MISSING_TELEMETRY",
  "NON_ACTIONABLE_ALERTS",
  "MISSING_RUNBOOKS",
  "UNTESTED_CRITICAL_RESTORE",
  "RPO_RTO_UNMEASURED",
  "UNTESTED_ROLLBACK",
  "MISSING_SECRET_ROTATION",
  "MISSING_SECURITY_SCAN",
  "UNTESTED_CRITICAL_JOURNEY",
  "UNRESOLVED_CRITICAL_VULNERABILITY"
] as const;

export function validateOperationalInventory(
  items: readonly OperationalComponentInventoryItem[]
): readonly OperationalReadinessIssue[] {
  const issues: OperationalReadinessIssue[] = [];
  const seenIds = new Set<string>();

  if (items.length === 0) {
    issues.push({
      code: "OPERATIONAL_INVENTORY_EMPTY",
      severity: "CRITICAL",
      message: "Operational inventory must contain every executable service and critical dependency."
    });
  }

  for (const item of items) {
    if (seenIds.has(item.id)) {
      issues.push({
        code: "DUPLICATE_OPERATIONAL_COMPONENT",
        severity: "HIGH",
        message: "Operational component identifiers must be unique.",
        resourceId: item.id
      });
    }
    seenIds.add(item.id);

    if (item.criticality === "CRITICAL" && isMissing(item.owner)) {
      issues.push({
        code: "UNOWNED_CRITICAL_SERVICE",
        severity: "CRITICAL",
        message: "Critical operational components must have a named owner.",
        resourceId: item.id
      });
    }

    if (item.criticality === "CRITICAL" && item.healthChecks.length === 0) {
      issues.push({
        code: "CRITICAL_HEALTH_CHECK_REQUIRED",
        severity: "HIGH",
        message: "Critical operational components must have at least one health check.",
        resourceId: item.id
      });
    }

    for (const [status, code] of [
      [item.loggingStatus, "LOGGING_REQUIRED"],
      [item.metricsStatus, "METRICS_REQUIRED"]
    ] as const) {
      if (item.criticality === "CRITICAL" && status === "MISSING") {
        issues.push({
          code,
          severity: "HIGH",
          message: "Critical operational components require logging and metrics coverage.",
          resourceId: item.id
        });
      }
    }

    if (
      item.criticality === "CRITICAL" &&
      item.backupClassification === "BACKUP_REQUIRED" &&
      (item.rpoMinutes === undefined || item.rtoMinutes === undefined)
    ) {
      issues.push({
        code: "RPO_RTO_REQUIRED",
        severity: "HIGH",
        message: "Critical backup-required components must define RPO and RTO objectives.",
        resourceId: item.id
      });
    }
  }

  return issues;
}

export function isActionableAlert(alert: OperationalAlertDefinition): boolean {
  return (
    alert.enabled &&
    !isMissing(alert.owner) &&
    !isMissing(alert.runbookId) &&
    !isMissing(alert.notificationTarget) &&
    !isMissing(alert.condition) &&
    !isMissing(alert.action) &&
    !isMissing(alert.version)
  );
}

export function evaluateAlertQuality(
  alerts: readonly OperationalAlertDefinition[]
): readonly OperationalReadinessIssue[] {
  const issues: OperationalReadinessIssue[] = [];
  const signatures = new Map<string, string>();

  for (const alert of alerts) {
    if (!isActionableAlert(alert)) {
      issues.push({
        code: "NON_ACTIONABLE_ALERT",
        severity: "HIGH",
        message: "Alerts must have an owner, runbook, destination, condition, action, and version.",
        resourceId: alert.id
      });
    }

    const signature = `${alert.signal}|${alert.condition}|${alert.duration}|${alert.severity}`;
    const previousAlertId = signatures.get(signature);
    if (previousAlertId !== undefined) {
      issues.push({
        code: "DUPLICATE_ALERT",
        severity: "MEDIUM",
        message: `Alert duplicates ${previousAlertId} for the same signal, condition, duration, and severity.`,
        resourceId: alert.id
      });
    } else {
      signatures.set(signature, alert.id);
    }
  }

  return issues;
}

export function evaluateBackupCoverage(
  records: readonly OperationalBackupCoverageRecord[]
): readonly OperationalReadinessIssue[] {
  const issues: OperationalReadinessIssue[] = [];

  if (records.length === 0) {
    issues.push({
      code: "BACKUP_COVERAGE_EMPTY",
      severity: "CRITICAL",
      message: "Backup coverage inventory must include every critical resource."
    });
  }

  for (const record of records) {
    const requiresBackup =
      record.classification === "BACKUP_REQUIRED" || record.classification === "ARCHIVE_REQUIRED";

    if (!requiresBackup) {
      continue;
    }

    if (!record.includedInBackup) {
      issues.push({
        code: "RESOURCE_NOT_BACKED_UP",
        severity: severityForCriticality(record.criticality),
        message: "Backup-required resources must be included in a backup policy.",
        resourceId: record.resourceId
      });
    }

    if (isMissing(record.policyId)) {
      issues.push({
        code: "BACKUP_POLICY_REQUIRED",
        severity: "HIGH",
        message: "Backup-required resources must reference a backup policy.",
        resourceId: record.resourceId
      });
    }

    if (
      isMissing(record.restoreEvidenceId) ||
      record.latestRestoreStatus === undefined ||
      record.latestRestoreStatus !== "PASSED"
    ) {
      issues.push({
        code: "RESTORE_EVIDENCE_REQUIRED",
        severity: severityForCriticality(record.criticality),
        message: "Backup-required resources must have passing restore evidence.",
        resourceId: record.resourceId
      });
    }
  }

  return issues;
}

export function assessRpoRto(input: OperationalRpoRtoAssessment): OperationalObjectiveAssessmentResult {
  const issues: OperationalReadinessIssue[] = [];

  if (input.measuredRpoMinutes === undefined || input.measuredRtoMinutes === undefined) {
    issues.push({
      code: "RPO_RTO_UNMEASURED",
      severity: "HIGH",
      message: "RPO and RTO must be measured with restore evidence before RC1.",
      resourceId: input.resourceId
    });
    return { status: "UNMEASURED", issues };
  }

  if (
    input.measuredRpoMinutes > input.approvedRpoMinutes ||
    input.measuredRtoMinutes > input.approvedRtoMinutes
  ) {
    issues.push({
      code: "RPO_RTO_BREACHED",
      severity: "CRITICAL",
      message: "Measured recovery objectives exceed approved limits.",
      resourceId: input.resourceId
    });
    return { status: "BREACHED", issues };
  }

  const margin = 0.8;
  if (
    input.measuredRpoMinutes > input.approvedRpoMinutes * margin ||
    input.measuredRtoMinutes > input.approvedRtoMinutes * margin
  ) {
    issues.push({
      code: "RPO_RTO_AT_RISK",
      severity: "MEDIUM",
      message: "Measured recovery objectives are close to approved limits.",
      resourceId: input.resourceId
    });
    return { status: "AT_RISK", issues };
  }

  return { status: "MEETS_OBJECTIVE", issues };
}

export function validateRestoreEvidence(
  evidence: OperationalRestoreEvidence
): readonly OperationalReadinessIssue[] {
  const checks: Array<readonly [boolean, string, string]> = [
    [evidence.result === "PASSED", "RESTORE_RESULT_MUST_PASS", "Restore evidence must pass."],
    [evidence.isolatedEnvironment, "ISOLATED_RESTORE_REQUIRED", "Restore tests must run in isolation."],
    [evidence.integrityVerified, "BACKUP_INTEGRITY_REQUIRED", "Backup integrity must be verified."],
    [
      evidence.dataRelationshipsVerified,
      "DATA_RELATIONSHIP_RESTORE_REQUIRED",
      "Restored relationship integrity must be verified."
    ],
    [
      evidence.crossTenantIsolationVerified,
      "TENANT_ISOLATION_RESTORE_REQUIRED",
      "Restore validation must prove tenant boundaries."
    ],
    [
      evidence.applicationStartVerified,
      "APPLICATION_START_RESTORE_REQUIRED",
      "Restored state must start the application."
    ],
    [
      evidence.criticalJourneyVerified,
      "CRITICAL_JOURNEY_RESTORE_REQUIRED",
      "Restored state must support critical journeys."
    ],
    [
      evidence.corruptedBackupRejected,
      "CORRUPTED_BACKUP_REJECTION_REQUIRED",
      "Invalid or corrupted backups must be rejected."
    ]
  ];

  return checks
    .filter(([passed]) => !passed)
    .map(([, code, message]) => ({
      code,
      severity: "CRITICAL",
      message,
      resourceId: evidence.id
    }));
}

export function canPromoteImmutableArtifact(candidate: OperationalDeploymentArtifactCandidate): boolean {
  const exactStagingArtifact =
    candidate.stagingDigest !== undefined && candidate.stagingDigest === candidate.buildDigest;
  const exactProductionArtifact =
    candidate.productionDigest === undefined || candidate.productionDigest === candidate.buildDigest;

  return (
    candidate.artifactImmutable &&
    candidate.testsPassed &&
    candidate.securityScanPassed &&
    candidate.sbomGenerated &&
    candidate.provenanceCaptured &&
    candidate.environmentParityChecked &&
    exactStagingArtifact &&
    exactProductionArtifact
  );
}

export function evaluateRc1Readiness(
  input: OperationalRc1ReadinessInput
): OperationalRc1ReadinessResult {
  if (input.gates.length === 0) {
    return { status: "NOT_READY", blockers: [], warnings: [] };
  }

  const blockers = input.gates.filter(
    (gate) => gate.blocker && (gate.status === "FAIL" || gate.status === "NOT_TESTED")
  );
  const warnings = input.gates.filter(
    (gate) => gate.status === "WARN" || (!gate.blocker && gate.status === "NOT_TESTED")
  );

  if (blockers.length > 0) {
    return { status: "BLOCKED", blockers, warnings };
  }

  if (warnings.length > 0) {
    return { status: "READY_WITH_WARNINGS", blockers, warnings };
  }

  return { status: "READY_FOR_RC1", blockers, warnings };
}

function isMissing(value: string | undefined): boolean {
  if (value === undefined) {
    return true;
  }

  const normalized = value.trim().toUpperCase();
  return normalized.length === 0 || normalized === "TBD" || normalized === "OWNER_UNRESOLVED";
}

function severityForCriticality(criticality: OperationalCriticality): OperationalReadinessSeverity {
  return criticality === "CRITICAL" ? "CRITICAL" : "HIGH";
}
