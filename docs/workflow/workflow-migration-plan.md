# Workflow Migration Plan

## Purpose

This document defines the incremental path from the current Workflow v1
implementation to the full Workflow Engine architecture.

## Constraints

- Preserve validated Phase 7 Step 16 publishing, preflight, distribution,
  Library, Rights, Workflow, Export, Quality, Backup, and audit behavior.
- Do not duplicate workflow logic across modules.
- Do not weaken Human Final Authority.
- Do not bypass RBAC, Need-to-Know access, subscription entitlements, or tenant
  isolation.
- Do not introduce AI provider calls from Workflow Engine.
- Use AI Orchestration for all future AI-triggered workflow actions.
- Preserve existing public API behavior until additive replacements are proven.

## Phase 0 - Documentation Baseline

Status: Current.

Deliverables:

- `docs/ARCHITECTURE_CHAPTER_8.md`.
- `docs/workflow/workflow-architecture.md`.
- `docs/workflow/workflow-definitions.md`.
- `docs/workflow/workflow-events.md`.
- `docs/workflow/workflow-permissions.md`.
- `docs/workflow/workflow-gap-analysis.md`.
- `docs/workflow/workflow-migration-plan.md`.

Outcome:

- Official Workflow Engine architecture and baseline audit exist.

## Phase 1 - Workflow Contract Alignment

Define:

- `WorkflowDefinition`.
- `WorkflowVersion`.
- `WorkflowInstance`.
- `WorkflowStage`.
- `WorkflowTransition`.
- `WorkflowCondition`.
- `WorkflowTask`.
- `WorkflowAssignment`.
- `WorkflowApproval`.
- `WorkflowNotification`.
- `WorkflowDeadline`.
- `WorkflowHistory`.

No behavior migration occurs in this phase.

## Phase 2 - Status and Approval Mapping

Map existing module states into workflow concepts.

Inputs:

- Workflow v1 statuses.
- Document statuses.
- Author Studio submission statuses.
- Layout and Publishing states.
- Publishing preflight statuses.
- Export readiness.
- Public Portal release states.
- Commerce approval states.
- Multimedia approval states.
- Media Localization approval states.
- Scheduling approval states.
- Marketplace enablement states.
- Policy Engine exception states.

Outcome:

- Compatibility matrix between current statuses and target workflow stages,
  tasks, approvals, and events.

## Phase 3 - Workflow Definition and Version Foundation

Add a durable, additive model for workflow definitions and versions.

Rules:

- Existing workflow APIs continue to work.
- Existing active flows keep their current behavior.
- New workflow definitions are introduced as metadata first.
- Workflow versions are immutable after activation.

## Phase 4 - Durable Workflow Repository Alignment

Align Workflow repository with runtime database persistence.

Rules:

- Preserve current workflow state, transition, and audit behavior.
- Preserve backup/restore compatibility.
- Add compatibility tests before replacing in-memory behavior.
- No destructive migration.

## Phase 5 - Workflow Task Generation

Introduce task generation from workflow stages.

Rules:

- Reuse Scheduling for deadlines and reminders.
- Do not create a separate calendar.
- Work Table consumes generated tasks.
- Existing module actions remain available until task-driven equivalents are
  validated.

## Phase 6 - Event Contract and Automation

Introduce workflow events and safe automation rules.

Rules:

- Events are versioned.
- Automation cannot approve, publish, grant rights, or bypass workflow.
- Automation must be auditable.
- Module consumers migrate incrementally.

## Phase 7 - Approval Consolidation

Move generic approval orchestration into Workflow Engine.

Rules:

- Domain modules keep domain validation.
- Workflow Engine coordinates single, multiple, parallel, sequential, and veto
  approvals.
- Existing approval endpoints become adapters or callers where compatibility
  requires it.
- Human Final Authority remains mandatory.

## Phase 8 - Observability and SLA

Add workflow metrics:

- Stage duration.
- Average execution time.
- Pending tasks.
- Overdue tasks.
- Approval latency.
- Bottlenecks.
- SLA breaches.
- Escalations.
- Blocked workflows.
- AI usage triggered by workflow.

## Phase 9 - AI-Assisted Workflow

Allow Workflow Engine to request AI assistance only through AI Orchestration.

Examples:

- Summarize blockers.
- Suggest next actions.
- Classify tasks.
- Suggest assignments.
- Request Quality Agent readiness review.

AI must not approve, publish, or bypass workflow.

## Phase 10 - Full Work Table Integration

Make Work Table the primary interface for workflow execution.

Rules:

- Work Table displays only authorized tasks and actions.
- Need-to-Know filtering happens server-side.
- Existing module pages remain tools opened from the unified workflow context.

## Acceptance Criteria

Migration is complete when:

- Workflow definitions are configurable without code.
- Workflow versions are immutable.
- Workflow instances reference fixed workflow versions.
- Tasks are generated from workflow stages.
- Approvals are centrally orchestrated.
- Events are documented and versioned.
- Scheduling handles deadlines and reminders.
- AI execution is requested only through AI Orchestration.
- Workflow operations are auditable and observable.
- Existing Phase 7 Step 16 behavior is preserved.
