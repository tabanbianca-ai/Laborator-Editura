# Workflow State Machine

## Purpose

The State Machine controls allowed workflow states and transitions.

It must reject invalid transitions, preserve current state, record transition
history, and keep every transition auditable.

## Current Workflow v1 State Machine

Current statuses:

- `DRAFT`.
- `IN_TRANSLATION`.
- `IN_QA`.
- `IN_SEMANTIC_REVIEW`.
- `IN_REVIEW`.
- `APPROVED`.
- `READY_FOR_EXPORT`.
- `EXPORTED`.
- `BLOCKED`.

Current transition order:

```text
DRAFT
  -> IN_TRANSLATION
  -> IN_QA
  -> IN_SEMANTIC_REVIEW
  -> IN_REVIEW
  -> APPROVED
  -> READY_FOR_EXPORT
  -> EXPORTED
```

`BLOCKED` is a temporary state that preserves the previous state.

## Target State Model

Future workflow definitions may define custom states for:

- Book workflows.
- Magazine workflows.
- Translation workflows.
- Review workflows.
- Illustration workflows.
- Audio workflows.
- Video workflows.
- Rights workflows.
- Publishing workflows.
- Accessibility workflows.

States must be configurable without code after the full engine is
implemented.

## Transition Rules

Each transition must define:

- Source state.
- Target state.
- Required permissions.
- Required roles.
- Conditions.
- Blocking rules.
- Audit action.
- Optional events.
- Optional automation triggers.

## Blocking Rules

Current blocking rules include:

- QA High or Critical issues block movement to review.
- Semantic Fidelity High or Critical issues block approval.
- Rejected terminology and High/Critical terminology issues block ready for
  export and exported states.
- Ready for export requires document approval.
- Export requires `READY_FOR_EXPORT`.

Future blocking rules must consume domain verdicts through public contracts.
They must not duplicate domain validation logic.

## Idempotency

State transitions should be idempotent where possible.

Rules:

- Repeating an already completed start request returns the existing workflow
  state.
- Retried automation must not duplicate transitions.
- Retried task generation must not duplicate tasks.
- Retried notifications must use delivery idempotency keys.

## Audit Requirements

Every transition must record:

- Actor.
- Organization.
- Workflow instance.
- From state.
- To state.
- Action.
- Rule applied.
- Result.
- Duration when available.
- Timestamp.

