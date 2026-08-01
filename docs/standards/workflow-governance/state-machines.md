# Canonical State Machines Standard

## Purpose

This document defines canonical workflow states, transition rules, state
machine governance, and the mapping between existing module states and the
platform-wide workflow model.

## Canonical State Flow

All workflow state machines must map to the canonical flow:

```text
Created
  -> Pending
  -> In Progress
  -> Waiting Approval
  -> Approved
  -> Executing
  -> Completed
```

Alternative states:

- `Rejected`.
- `Cancelled`.
- `Failed`.
- `Rolled Back`.
- `Archived`.

## Canonical State Definitions

| State | Meaning |
| --- | --- |
| `Created` | Workflow definition or instance exists but has not started. |
| `Pending` | Workflow is ready to start after trigger or prerequisites. |
| `In Progress` | Work is actively being performed. |
| `Waiting Approval` | Workflow is paused until authorized human approval. |
| `Approved` | Required approval has been granted. |
| `Executing` | Approved automated or operational execution is running. |
| `Completed` | Workflow completed successfully. |
| `Rejected` | Required approval or validation was rejected. |
| `Cancelled` | Workflow was intentionally stopped before completion. |
| `Failed` | Workflow ended because of an unrecovered error. |
| `Rolled Back` | Workflow was reverted through approved rollback or compensation. |
| `Archived` | Workflow is closed and preserved for history. |

## Current Workflow v1 Mapping

Current Workflow v1 statuses map to the canonical state model as follows:

| Current status | Canonical state |
| --- | --- |
| `DRAFT` | `Created` or `Pending` |
| `IN_TRANSLATION` | `In Progress` |
| `IN_QA` | `In Progress` |
| `IN_SEMANTIC_REVIEW` | `In Progress` |
| `IN_REVIEW` | `Waiting Approval` |
| `APPROVED` | `Approved` |
| `READY_FOR_EXPORT` | `Approved` |
| `EXPORTED` | `Completed` |
| `BLOCKED` | `Failed` or `Waiting Approval`, depending on blocker type |

This mapping is documentation guidance only. It does not rename existing
runtime statuses.

## Transition Requirements

Each transition must define:

- Source state.
- Target state.
- Required actor.
- Required role or permission.
- Required Need-to-Know scope.
- Preconditions.
- Business rules evaluated.
- Blocking rules.
- Events emitted.
- Audit action.
- Idempotency behavior.
- Rollback or compensation behavior.

## Transition Invariants

Every state machine must follow these invariants:

- Invalid transitions are rejected.
- Current state is preserved after rejected transitions.
- Transition order is deterministic.
- Approval states require authorized human action.
- AI cannot approve, publish, grant rights, bypass gates, or change security.
- Terminal states are explicit.
- Reopened workflows require a documented transition.
- Every transition is auditable.

## Blocking States

Blocking states must preserve:

- Previous state.
- Blocking reason.
- Blocking source.
- Required resolution action.
- Severity.
- Actor or system that created the blocker.
- Timestamp.
- Audit event.

Blocking examples:

- QA High or Critical issues.
- Semantic Fidelity High or Critical issues.
- Rejected terminology.
- Missing rights.
- Missing publishing authorization.
- Missing required metadata.
- Failed preflight.
- Export generation error.
- Integration provider outage.

## Terminal States

Terminal states include:

- `Completed`.
- `Rejected`.
- `Cancelled`.
- `Failed`.
- `Rolled Back`.
- `Archived`.

Terminal states must not be mutated silently. Reopening requires a new
workflow version, a documented transition, or an approved exception depending
on the process.

## Versioned State Machines

State machine definitions must be versioned.

Rules:

- Active state machines cannot be overwritten.
- New transitions create a new state machine version.
- Existing workflow instances retain the state machine version used at start.
- State machine changes affecting published or approved outputs require
  impact analysis and authorized approval.

## State Machine Audit

Audit must record:

- State machine created.
- State machine versioned.
- State machine activated.
- State machine suspended.
- Transition attempted.
- Transition accepted.
- Transition rejected.
- Blocker created.
- Blocker resolved.
- Manual intervention.
- Rollback or compensation.
