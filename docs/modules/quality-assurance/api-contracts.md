# Quality Assurance API Contracts

This document defines the target API contract surface for the Quality
Assurance, Testing and Validation Module. These contracts are documentation
for future implementation and do not replace the existing QA Engine APIs.

## Contract Rules

- QA APIs are authenticated.
- QA APIs are versioned.
- QA APIs are tenant-aware.
- QA APIs enforce IAM and Need-to-Know permissions server-side.
- QA APIs return safe errors.
- QA APIs preserve audit metadata for all mutations.
- AI may summarize QA state but may not approve gates or releases.

## Existing QA Engine Boundary

The current platform already has a QA Engine for editorial segment and
document validation. Its behavior must not be weakened or replaced by this
module.

The Quality Assurance module is broader: it governs test planning, execution,
defects, coverage, and release validation across the whole platform.

## Planned Endpoints

### Test Plans

`GET /qa/test-plans`

Returns test plans visible to the authenticated actor.

`POST /qa/test-plans`

Creates a test plan.

Required fields:

- `scope`.
- `ownerId`.
- `objectives`.
- `environment`.
- `acceptanceCriteria`.

### Test Cases

`GET /qa/test-cases`

Returns test cases by scope, module, category, plan, or requirement.

`POST /qa/test-cases`

Creates a test case.

Required fields:

- `testPlanId`.
- `category`.
- `preconditions`.
- `executionSteps`.
- `expectedResult`.
- `priority`.
- `automationStatus`.

### Test Executions

`POST /qa/test-executions`

Records a test execution.

Required fields:

- `testPlanId`.
- `environment`.
- `executorId`.
- `result`.
- `evidence`.

### Coverage

`GET /qa/coverage`

Returns coverage snapshots by scope, release candidate, environment, module,
or coverage type.

### Defects

`GET /qa/defects`

Returns defects visible to the authenticated actor.

Future mutation endpoints should support defect creation, assignment,
resolution, reopening, waiver, and verification through explicit contracts.

### Quality Gates

`POST /qa/quality-gates`

Evaluates or records a quality gate result.

Required fields:

- `gateId`.
- `scope`.
- `releaseCandidateId`.
- `evidenceReferences`.

## Error Contract

QA APIs should use safe error responses:

- `400` for invalid input.
- `401` for missing authenticated context.
- `403` for unauthorized access.
- `404` for unavailable or hidden records.
- `409` for state conflicts.
- `422` for validation rule failures.
- `500` for internal errors without sensitive details.

## Audit

All QA API mutations must emit audit events with:

- Actor.
- Organization.
- Entity type.
- Entity identifier.
- Action.
- Before and after state where appropriate.
- Timestamp.
- Correlation ID where available.

## Future OpenAPI

Future implementation should publish OpenAPI definitions and contract tests
for this API surface before enabling runtime use.
