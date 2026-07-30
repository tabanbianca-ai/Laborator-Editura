# Quality Assurance Domain Model

This document defines the conceptual domain model for the Quality Assurance,
Testing and Validation Module. It does not authorize database schema changes
by itself. Physical persistence must be scheduled through a future
implementation phase.

## Ownership

Quality Assurance owns validation planning, execution evidence, quality gate
records, coverage snapshots, defect tracking metadata, and release validation
metadata.

Quality Assurance does not own application source code, editorial content,
module domain records, security policies, deployment workflows, AI models, or
runtime observability logs. It references those records through stable
identifiers and preserves validation evidence for them.

## Test Plan

Fields:

- `id`.
- `organizationId`.
- `scope`.
- `ownerId`.
- `objectives`.
- `schedule`.
- `environment`.
- `acceptanceCriteria`.
- `status`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

Rules:

- Every release candidate must reference at least one active test plan.
- Acceptance criteria changes are audited.
- Test plans may cover product modules, infrastructure, AI agents, workflows,
  publications, or operational processes.

## Test Case

Fields:

- `id`.
- `testPlanId`.
- `category`.
- `module`.
- `requirementReference`.
- `preconditions`.
- `executionSteps`.
- `expectedResult`.
- `priority`.
- `automationStatus`.
- `riskLevel`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

Rules:

- Test cases must be traceable to requirements where requirements exist.
- Automated test cases must reference the automation suite or command.
- Manual test cases must define required evidence.

## Test Suite

Fields:

- `id`.
- `name`.
- `category`.
- `scope`.
- `command`.
- `environment`.
- `includedTestCases`.
- `ownerId`.
- `status`.

Rules:

- Test suites group executable validations.
- Suite membership must not hide individual test case traceability.

## Test Execution

Fields:

- `id`.
- `testPlanId`.
- `testSuiteId`.
- `environment`.
- `executorId`.
- `startedAt`.
- `completedAt`.
- `result`.
- `evidence`.
- `commitSha`.
- `releaseCandidateId`.

Rules:

- Executions are immutable after completion except for auditable annotation.
- Evidence must be sufficient to reproduce the validation result.

## Test Result

Fields:

- `id`.
- `testExecutionId`.
- `testCaseId`.
- `status`.
- `durationMs`.
- `logsReference`.
- `evidenceReference`.
- `defectId`.
- `createdAt`.

Rules:

- Failed results must either link to a defect or be explicitly waived through
  an approved exception.

## Defect

Fields:

- `id`.
- `organizationId`.
- `module`.
- `severity`.
- `priority`.
- `status`.
- `ownerId`.
- `summary`.
- `description`.
- `reproductionSteps`.
- `resolution`.
- `createdBy`.
- `createdAt`.
- `resolvedAt`.

Rules:

- Critical defects block promotion.
- High defects block promotion when assigned to mandatory quality gates.
- Defect status changes are audited.

## Quality Gate

Fields:

- `id`.
- `name`.
- `scope`.
- `requiredSuites`.
- `coverageThresholds`.
- `blockingSeverities`.
- `requiredApprovals`.
- `status`.
- `lastEvaluationId`.

Rules:

- Quality gates are mandatory for release promotion.
- Gate definitions are versioned and auditable.
- Gates may be configured by environment, module, risk, or release type.

## Coverage Snapshot

Fields:

- `id`.
- `scope`.
- `environment`.
- `codeCoverage`.
- `apiCoverage`.
- `workflowCoverage`.
- `uiCoverage`.
- `aiCoverage`.
- `accessibilityCoverage`.
- `regressionCoverage`.
- `capturedAt`.

Rules:

- Coverage thresholds are configurable through Configuration.
- Coverage trends must remain auditable across release candidates.

## Validation Evidence

Fields:

- `id`.
- `testExecutionId`.
- `type`.
- `uri`.
- `checksum`.
- `metadata`.
- `createdAt`.

Rules:

- Evidence may include logs, screenshots, reports, coverage files, scan
  outputs, accessibility reports, AI evaluation outputs, or manual sign-off.
- Evidence should be immutable once attached to completed execution.

## Release Validation

Fields:

- `id`.
- `releaseCandidateId`.
- `qualityGateId`.
- `qualityGateVersion`.
- `status`.
- `approvedBy`.
- `approvedAt`.
- `blockingDefects`.
- `evidenceReferences`.

Rules:

- Release approval depends on quality gate status.
- Authorized humans retain final release authority.
- AI may summarize validation but may not approve release.

## QA Audit Event

Fields:

- `id`.
- `organizationId`.
- `actorId`.
- `eventType`.
- `entityType`.
- `entityId`.
- `beforeState`.
- `afterState`.
- `createdAt`.

Audited actions include:

- Test plan created or updated.
- Test case created or updated.
- Test execution started or completed.
- Test result recorded.
- Defect created, updated, resolved, or reopened.
- Quality gate evaluated.
- Coverage snapshot recorded.
- Release validation approved or rejected.
- Acceptance criteria changed.
