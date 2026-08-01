# Canonical Test Execution Model

## Purpose

This document defines the canonical model for test execution records,
results, evidence, defects, environments, source commits, and correlation.

## Canonical Execution Fields

Every test execution must contain:

| Field | Requirement |
| --- | --- |
| `executionId` | Unique execution identifier. |
| `testCaseId` | Test case identifier. |
| `testCaseVersion` | Version of the test case executed. |
| `environment` | Canonical environment from Standard 08. |
| `applicationVersion` | Application, package, image, or release version. |
| `sourceCommit` | Source control commit reference. |
| `executedBy` | User, service, CI job, or automation identity. |
| `startedAt` | Start timestamp. |
| `completedAt` | Completion timestamp where applicable. |
| `result` | Canonical result. |
| `evidence` | Evidence references. |
| `defectIds` | Related defects. |
| `correlationId` | Observability correlation identifier. |

## Allowed Results

Allowed execution results:

- `PASSED`.
- `FAILED`.
- `BLOCKED`.
- `SKIPPED`.
- `NOT_EXECUTED`.

`SKIPPED` and `BLOCKED` are not equivalent to `PASSED`.

## Environment Rules

Tests execute in Standard 08 environments:

- `Development`.
- `Integration`.
- `Testing`.
- `Staging`.
- `Production`.

Production may run only:

- Health checks.
- Controlled smoke tests.
- Synthetic checks.
- Non-destructive checks.
- Explicitly approved validations.

## Evidence

Execution evidence may include:

- Reports.
- Logs.
- Screenshots.
- API responses.
- Generated files.
- Visual comparisons.
- Metrics.
- Distributed traces.
- Human approvals.
- CI job URLs.
- Deployment records.

Evidence must be associated with the execution record and retained according
to retention policy.

## Defect Linkage

Failed, blocked, skipped, or unstable executions must link to:

- Defect record.
- Risk acceptance record.
- Waiver record.
- Follow-up action.

Open critical defects block release.

## Reproducibility

Execution records must preserve:

- Test case version.
- Source commit.
- Environment.
- Application version.
- Test data version.
- Runtime configuration where relevant.
- Correlation ID.

This allows the result to be reproduced or investigated.

## Audit

Audit must record:

- Execution started.
- Execution completed.
- Result changed.
- Evidence attached.
- Defect linked.
- Test skipped.
- Skip reason approved.
- Blocker added.
- Execution rerun.
