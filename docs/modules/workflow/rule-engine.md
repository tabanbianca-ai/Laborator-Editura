# Workflow Rule Engine

## Purpose

The Rule Engine evaluates configurable business process rules for transitions,
tasks, approvals, deadlines, escalations, notifications, and automation.

Rules coordinate domain signals. They do not replace domain validation.

## Supported Rule Logic

The Rule Engine must support:

- `IF`.
- `THEN`.
- `ELSE`.
- `AND`.
- `OR`.
- `NOT`.
- Multiple conditions.
- Configurable expressions.
- Validation outcomes.
- Module-provided facts.

Example:

```text
IF Translation Completed
AND Editorial Review Approved
THEN Allow Publishing
```

## Current Repository Baseline

Current rules are primarily hardcoded in services:

- Workflow transition order is defined in code.
- QA blockers are checked through QA service.
- Semantic blockers are checked through Semantic Fidelity service.
- Terminology blockers are checked through QA terminology issue types.
- Export readiness checks are enforced in Workflow and Export modules.
- Many modules contain local human approval and status logic.

No configurable rule engine runtime was identified.

## Rule Sources

Future rules may reference:

- QA verdicts.
- Semantic Fidelity verdicts.
- Terminology status.
- Rights and Provenance verdicts.
- Publishing preflight readiness.
- Export readiness.
- Quality Agent readiness.
- Audio/video render readiness.
- Magazine issue readiness.
- User role and permissions.
- Team assignment.
- SLA state.

Rules must use public contracts and read models. They must not read private
module internals directly.

## Rule Record

Each rule should include:

- `ruleId`.
- `name`.
- `version`.
- `category`.
- `expression`.
- `inputFacts`.
- `outputDecision`.
- `ownerModule`.
- `status`.
- `approvedBy`.
- `approvedAt`.

## Governance Rules

- Rules cannot be overwritten after activation.
- Rule changes create new versions.
- Workflow versions record the rule versions used.
- AI may suggest rules but may not activate rules.
- Human approval is required for rule changes affecting publication,
  permissions, rights, security, cost, or governance.

## Audit Requirements

Audit must record:

- Rule created.
- Rule versioned.
- Rule activated.
- Rule suspended.
- Rule evaluated.
- Rule result.
- Human override.

