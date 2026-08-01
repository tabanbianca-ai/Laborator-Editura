# Canonical Test Case Model

## Purpose

This document defines the canonical structure, lifecycle, ownership,
versioning, priority, risk, and audit requirements for test cases.

## Canonical Test Case Fields

Every test case must contain:

| Field | Requirement |
| --- | --- |
| `id` | Unique test case identifier. |
| `canonicalIdentifier` | Stable canonical identifier. |
| `title` | Short official test title. |
| `description` | Test purpose and expected behavior. |
| `requirementIds` | Requirements or acceptance criteria covered by the test. |
| `module` | Module, framework, standard, service, or artifact under test. |
| `testType` | Canonical test type. |
| `priority` | Execution priority. |
| `riskLevel` | Risk addressed by the test. |
| `preconditions` | Required state before execution. |
| `testData` | Test data references or fixtures. |
| `executionSteps` | Steps required to execute the test. |
| `expectedResult` | Expected result. |
| `automationStatus` | Automation status. |
| `owner` | Accountable owner. |
| `version` | Immutable test case version. |
| `lifecycleState` | Current lifecycle state. |
| `createdAt` | Creation timestamp. |
| `updatedAt` | Last update timestamp. |

## Test Types

Canonical test types include:

- `UNIT`.
- `INTEGRATION`.
- `CONTRACT`.
- `API`.
- `EVENT`.
- `END_TO_END`.
- `REGRESSION`.
- `PERFORMANCE`.
- `LOAD`.
- `STRESS`.
- `RESILIENCE`.
- `SECURITY`.
- `ACCESSIBILITY`.
- `COMPATIBILITY`.
- `LOCALIZATION`.
- `AI_VALIDATION`.
- `MIGRATION`.
- `BACKUP_RESTORE`.
- `SMOKE`.
- `MANUAL_VALIDATION`.

## Priority

Canonical priorities:

- `P0`.
- `P1`.
- `P2`.
- `P3`.

`P0` and `P1` tests are release-gating when mapped to critical or high-risk
requirements.

## Risk Level

Canonical risk levels:

- `CRITICAL`.
- `HIGH`.
- `MEDIUM`.
- `LOW`.
- `INFORMATIONAL`.

Risk level controls required automation, execution frequency, evidence, and
quality gate impact.

## Automation Status

Canonical automation statuses:

- `AUTOMATED`.
- `MANUAL`.
- `PARTIALLY_AUTOMATED`.
- `PLANNED`.
- `NOT_AUTOMATABLE`.
- `DEPRECATED`.

Manual and non-automated tests must include evidence requirements and an
owner.

## Lifecycle States

Canonical lifecycle states:

- `DRAFT`.
- `ACTIVE`.
- `SUSPENDED`.
- `DEPRECATED`.
- `ARCHIVED`.

Active test cases cannot be overwritten. A material change creates a new test
case version.

## Ownership

Each test case must have one accountable owner.

The owner is responsible for:

- Test correctness.
- Requirement mapping.
- Fixture ownership.
- Evidence expectations.
- Automation status.
- Versioning.
- Maintenance.

## Audit

Audit must record:

- Test case created.
- Test case versioned.
- Test case activated.
- Test case suspended.
- Test case deprecated.
- Test case archived.
- Requirement mapping changed.
- Automation status changed.
- Test data reference changed.
