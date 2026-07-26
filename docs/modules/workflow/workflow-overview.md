# Workflow Engine and Business Process Automation Module Overview

## Purpose

Workflow Engine and Business Process Automation is the tenth Phase II module
specification for Laborator Editura.

The module coordinates platform processes from manuscript creation to
publication, distribution, archive, and operational follow-up. It manages
workflow definitions, workflow instances, states, transitions, tasks,
approvals, business rules, notifications, scheduler hooks, SLA metadata,
escalations, automation, and process audit.

Workflow Engine is a coordination layer. Domain modules keep their domain
validation rules and domain state, but they must not implement independent
workflow engines.

## Scope

The module owns:

- Workflow definitions.
- Workflow versions.
- Workflow instances.
- State machines.
- Transition rules.
- Workflow tasks.
- Assignments.
- Approval orchestration.
- Rule evaluation.
- Automation execution metadata.
- Scheduler and retry metadata.
- SLA and escalation metadata.
- Workflow events.
- Workflow audit and process history.

The module does not own:

- Domain validation logic owned by modules such as QA, Semantic Fidelity,
  Rights and Provenance, Terminology, Publishing, Audio, or Video.
- Notification delivery infrastructure, which belongs to the future
  Notification and Communication Module.
- AI provider execution, which must pass through AI Orchestration.
- User interface execution surfaces such as Work Table, which consume workflow
  tasks but do not own workflow logic.

## Principles

The module follows:

- Workflow as Code.
- State Machine.
- Event Driven.
- Human in the Loop.
- Configurable without Code.
- Idempotent Execution.
- Audit by Default.
- Retry by Design.
- Versioned Workflow Definitions.
- Centralized Process Coordination.

## Current Repository Baseline

The repository already contains an MVP Workflow v1:

- `apps/api/src/modules/workflow` supports document-level and segment-level
  workflow state.
- Current statuses are `DRAFT`, `IN_TRANSLATION`, `IN_QA`,
  `IN_SEMANTIC_REVIEW`, `IN_REVIEW`, `APPROVED`, `READY_FOR_EXPORT`,
  `EXPORTED`, and `BLOCKED`.
- Current APIs start workflows, get workflow status, advance workflows, block
  and unblock workflows, approve documents, mark ready for export, and mark
  exported.
- Workflow v1 records transitions and audit events.
- Workflow v1 enforces QA, Semantic Fidelity, terminology, approval, and
  export gates.
- `docs/workflow` already documents the broader Chapter 8 workflow baseline,
  definitions, events, permissions, gap analysis, and migration direction.
- `apps/api/src/modules/scheduling` supports tasks, events, reminders,
  scheduled agent run metadata, approvals, and audit.
- The Editorial Pipeline frontend orchestrates many module pages around a
  production flow.

The repository does not yet contain a complete configurable Workflow Engine
with versioned workflow definitions, immutable workflow versions, generated
workflow tasks, unified approvals, IF/THEN rule configuration, centralized
automation, SLA escalation, or versioned event contracts.

## Target Architecture

```text
Workflow Definition
  -> Workflow Version
  -> Workflow Instance
  -> State Machine
  -> Rule Engine
  -> Task Manager
  -> Approval Engine
  -> Notification Hooks
  -> Scheduler
  -> Audit Service
```

## Standard Workflow Families

The platform must support workflow definitions for:

- Books.
- Magazines.
- Translations.
- Proofreading and Editorial Review.
- Illustrations.
- Audio.
- Video.
- Publishing.
- Rights.
- Accessibility.
- Quality preflight.

Administrators may create new workflow definitions without application code
changes after the full engine is implemented.

## Dependency Map

Workflow Engine integrates with:

- Library.
- Translation.
- Editorial Review.
- Rights and Provenance.
- Magazine.
- AI Orchestration.
- Audio.
- Video.
- Publishing.
- Notifications.
- Audit.
- Scheduling.
- Observability.
- Workspace and Work Table.

## Acceptance Criteria

The module is aligned when:

- All platform business processes are coordinated through Workflow Engine.
- Workflow definitions are versioned and configurable without code.
- Workflow instances reference immutable workflow versions.
- Every transition is validated, idempotent, and auditable.
- Tasks, approvals, deadlines, notifications, and escalations are integrated.
- Automation rules are reusable and audited.
- AI-triggered workflow actions use AI Orchestration only.
- Existing Phase 7 Step 16 publishing/preflight/distribution behavior is
  preserved.

## Related Documents

- `docs/ARCHITECTURE_CHAPTER_8.md`.
- `docs/workflow/workflow-architecture.md`.
- `docs/modules/workflow/domain-model.md`.
- `docs/modules/workflow/state-machine.md`.
- `docs/modules/workflow/rule-engine.md`.
- `docs/modules/workflow/task-management.md`.
- `docs/modules/workflow/approval-engine.md`.
- `docs/modules/workflow/scheduler.md`.
- `docs/modules/workflow/api-contracts.md`.
- `docs/modules/workflow/events.md`.
- `docs/modules/workflow/workflow-gap-analysis.md`.
- `docs/modules/workflow/workflow-migration-plan.md`.

