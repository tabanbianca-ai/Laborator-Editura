# Canonical Workflow Model

## Purpose

This document defines the canonical model that every workflow, process,
automation, approval flow, and operational state machine must follow.

## Canonical Workflow Fields

Every workflow definition must contain:

| Field | Requirement |
| --- | --- |
| `uuid` | Immutable globally unique identifier. |
| `canonicalIdentifier` | Stable, human-readable canonical identifier. |
| `workflowName` | Official workflow name. |
| `workflowType` | Canonical workflow type. |
| `version` | Immutable workflow version. |
| `status` | Lifecycle status of the workflow definition. |
| `owner` | Accountable module, team, or governance area. |
| `trigger` | Event, schedule, user action, integration action, or system condition that starts the workflow. |
| `input` | Canonical input contract. |
| `output` | Canonical output contract. |
| `businessRules` | Referenced business rule versions. |
| `dependencies` | Required modules, data, APIs, events, permissions, AI assets, or external systems. |
| `lifecycleState` | Current lifecycle state of the workflow definition. |
| `metadata` | Classification, tags, scope, tenant, domain, and operational metadata. |
| `auditInformation` | Required audit events and audit references. |

## Workflow Definition Structure

Each workflow definition must document:

- Trigger.
- Preconditions.
- Input.
- Processing steps.
- Decision points.
- Business rules.
- Human tasks.
- AI tasks.
- Outputs.
- Completion conditions.
- Error handling.
- Rollback strategy.

## Canonical Workflow Types

| Type | Description |
| --- | --- |
| `EDITORIAL` | Workflows for manuscripts, translation, review, publishing, distribution, accessibility, and content production. |
| `AI` | Workflows for AI generation, AI review, AI validation, AI translation, agent orchestration, and AI cost-controlled execution. |
| `ADMINISTRATIVE` | Workflows for approvals, notifications, billing metadata, user provisioning, security governance, backup, and recovery. |
| `INTEGRATION` | Workflows for connectors, webhooks, imports, exports, synchronization, and provider handoff. |
| `QUALITY` | Workflows for QA, semantic fidelity, preflight, compliance checks, and Quality Agent readiness. |

## Versioning

Workflow definitions must be immutable after activation.

Rules:

- A workflow change creates a new workflow version.
- Previous workflow versions remain auditable.
- Running workflow instances retain the workflow version they started with.
- Published outputs must record the workflow version used where relevant.
- Business rule versions referenced by the workflow must also be recorded.

## Deterministic Execution

Workflow execution must be deterministic.

Requirements:

- The same workflow version, input, rules, and state must produce the same
  decision path unless an approved external dependency changes.
- External dependency changes must be recorded as execution evidence.
- AI results may contribute recommendations or evidence, but they must not
  silently alter deterministic workflow decisions.
- Human Final Authority decisions must be explicit and auditable.

## Idempotency

Operations that can be retried must support idempotency.

Examples:

- Starting an already existing workflow returns the existing workflow state.
- Repeating an already completed transition must not create duplicate state
  changes.
- Retried webhook delivery must use idempotency keys.
- Retried task generation must not duplicate tasks.
- Retried notifications must preserve delivery attempt metadata.

## Dependency Requirements

Workflow dependencies must be explicit and stable.

Dependencies may include:

- Project, document, manuscript, segment, asset, export, rights, and
  publication records.
- API contracts and event contracts.
- Business rule versions.
- Permission checks.
- Need-to-Know scopes.
- AI asset versions.
- External provider configuration.
- Observability and audit requirements.

## Workflow Ownership

Every workflow has one accountable owner.

The owner is responsible for:

- Workflow definition.
- Rule references.
- State machine mapping.
- Approval gates.
- Exception handling.
- Observability.
- Audit coverage.
- Migration readiness.

Cross-module workflow dependencies must use public contracts, events, or
read models. They must not access private module internals directly.
