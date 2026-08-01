# Canonical Business Rules Standard

## Purpose

This document defines the canonical model for business rules, decision tables,
rule ownership, rule versioning, rule evaluation, and rule audit.

## Business Rule Separation

Business rules must be separated from workflow structure whenever practical.

Rules:

- Workflows define process order and state.
- Business rules define conditions, decisions, blockers, priorities, and
  exceptions.
- Controllers and UI components must not become hidden owners of business
  rules.
- AI prompts may reference business rules, but they are not the canonical
  source of business rules.
- Rule changes require versioning and audit.

## Canonical Business Rule Fields

Every business rule must define:

| Field | Requirement |
| --- | --- |
| `uuid` | Immutable globally unique identifier. |
| `ruleName` | Official rule name. |
| `description` | Human-readable purpose and behavior. |
| `scope` | Module, workflow, process, project type, tenant, or policy scope. |
| `condition` | Evaluated condition or decision table reference. |
| `action` | Required outcome when the condition is met. |
| `priority` | Evaluation order when multiple rules apply. |
| `exceptionPolicy` | Allowed exceptions and approval requirements. |
| `owner` | Accountable module or governance owner. |
| `version` | Immutable rule version. |

## Rule Types

Canonical rule types include:

- Validation rules.
- Eligibility rules.
- Transition rules.
- Approval rules.
- Blocking rules.
- Calculation rules.
- Prioritization rules.
- Routing rules.
- Notification rules.
- Escalation rules.
- Compliance rules.
- Access and Need-to-Know rules.
- AI governance and cost rules.

## Decision Tables

Decision tables must be used when a rule depends on multiple conditions.

Decision tables must define:

- Inputs.
- Allowed values.
- Rule rows.
- Priority.
- Default result.
- Exception result.
- Owner.
- Version.
- Approval status.
- Audit requirements.

## Rule Priority

Rule priority must be explicit.

Default priority order:

1. Security, identity, and Need-to-Know rules.
2. Legal, rights, and provenance rules.
3. Human Final Authority rules.
4. Workflow gate and approval rules.
5. Quality, QA, semantic fidelity, and preflight rules.
6. Publishing, export, and distribution rules.
7. AI governance, cost, and provider rules.
8. Notification and scheduling rules.

The most restrictive applicable rule wins unless an approved exception exists.

## Human Final Authority

Human Final Authority is mandatory.

AI may:

- Suggest rules.
- Explain rule effects.
- Detect possible conflicts.
- Propose decision table updates.
- Summarize impact analysis.

AI may not:

- Activate rules.
- Approve exceptions.
- Override workflow gates.
- Grant rights.
- Publish.
- Modify security or governance rules.

## Rule Versioning

Rules cannot be overwritten after activation.

Requirements:

- Rule changes create a new version.
- Prior versions remain auditable.
- Workflow executions record the rule versions used.
- Published outputs record rule versions where relevant.
- Rule impact analysis is required before changes affecting publications,
  rights, access, security, cost, or governance.

## Rule Audit

Audit must record:

- Rule created.
- Rule updated as a new version.
- Rule activated.
- Rule suspended.
- Rule archived.
- Rule evaluated.
- Rule result.
- Rule exception requested.
- Rule exception approved or rejected.
- Human override.
- AI suggestion used as evidence.

## Current Baseline Guidance

Existing service-level rules may remain in place until migration is approved,
but they must be documented and mapped to canonical rule records.

Examples include:

- QA High or Critical issues blocking movement to review.
- Semantic Fidelity High or Critical issues blocking approval.
- Rejected terminology or High/Critical terminology issues blocking export.
- Rights warnings affecting publishing readiness.
- Workflow readiness gates for export and publication.
- Human approval requirements for public release, AI decisions, policies,
  marketplace agents, media, and publication outputs.
