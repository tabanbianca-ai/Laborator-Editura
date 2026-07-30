# Quality Assurance Events

Quality Assurance events define the official event vocabulary for test plans,
test executions, quality gates, coverage updates, defects, regression runs,
and release validation.

## Event Rules

- Events are typed.
- Events are versioned.
- Events are tenant-aware.
- Events preserve actor and correlation metadata where available.
- Events do not contain secrets.
- Events do not expose hidden information to unauthorized subscribers.
- Events are auditable.

## Official Events

### TestPlanCreated

Emitted when a test plan is created.

Payload:

- `testPlanId`.
- `scope`.
- `ownerId`.
- `createdBy`.
- `createdAt`.

### TestExecutionStarted

Emitted when a test execution starts.

Payload:

- `testExecutionId`.
- `testPlanId`.
- `testSuiteId`.
- `environment`.
- `executorId`.
- `startedAt`.

### TestExecutionCompleted

Emitted when a test execution completes.

Payload:

- `testExecutionId`.
- `result`.
- `completedAt`.
- `evidenceReferences`.

### QualityGatePassed

Emitted when a quality gate passes.

Payload:

- `qualityGateId`.
- `qualityGateVersion`.
- `scope`.
- `releaseCandidateId`.
- `evidenceReferences`.

### QualityGateFailed

Emitted when a quality gate fails.

Payload:

- `qualityGateId`.
- `qualityGateVersion`.
- `scope`.
- `releaseCandidateId`.
- `blockingReasons`.
- `blockingDefects`.

### CoverageUpdated

Emitted when a coverage snapshot is recorded.

Payload:

- `coverageSnapshotId`.
- `scope`.
- `environment`.
- `coverageType`.
- `value`.
- `capturedAt`.

### DefectCreated

Emitted when a defect is created.

Payload:

- `defectId`.
- `module`.
- `severity`.
- `priority`.
- `createdBy`.
- `createdAt`.

### DefectResolved

Emitted when a defect is resolved.

Payload:

- `defectId`.
- `resolution`.
- `resolvedBy`.
- `resolvedAt`.

### RegressionCompleted

Emitted when a regression suite completes.

Payload:

- `regressionRunId`.
- `scope`.
- `result`.
- `completedAt`.
- `evidenceReferences`.

### ReleaseValidated

Emitted when a release candidate receives validation status.

Payload:

- `releaseCandidateId`.
- `qualityGateId`.
- `status`.
- `approvedBy`.
- `approvedAt`.
- `evidenceReferences`.

## Integration

Quality Assurance events are consumed by:

- DevSecOps for release and deployment promotion.
- Workflow for approval state.
- Observability for operational traceability.
- Analytics for quality reporting.
- Audit for immutable history.
- Notifications for validation status updates.
- Policy Engine for compliance checks.

## Current Gap

The repository currently uses executable tests and CI workflow outcomes as
validation evidence. A typed event bus for QA events is not yet implemented.
Future migration should register these events before enabling runtime event
publication.
