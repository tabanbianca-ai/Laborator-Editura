# Workflow Architecture Baseline

## Purpose

This document records the current workflow baseline and target architecture
for Laborator Editura.

It supports `docs/ARCHITECTURE_CHAPTER_8.md` and must be used before any
structural Workflow Engine refactoring.

## Current Repository Baseline

The repository already contains a `workflow` module with document-level and
segment-level workflow state.

Current workflow statuses:

- `DRAFT`.
- `IN_TRANSLATION`.
- `IN_QA`.
- `IN_SEMANTIC_REVIEW`.
- `IN_REVIEW`.
- `APPROVED`.
- `READY_FOR_EXPORT`.
- `EXPORTED`.
- `BLOCKED`.

Current workflow capabilities:

- Start workflow.
- Get workflow status.
- Advance workflow through fixed transitions.
- Block workflow.
- Unblock workflow.
- Approve document.
- Mark ready for export.
- Mark exported.
- Write workflow transitions.
- Write workflow audit events.

Current blocking checks:

- QA High or Critical issues block movement to review.
- Semantic Fidelity High or Critical issues block approval.
- Terminology High or Critical issues block ready-for-export and exported
  states.
- Export requires `READY_FOR_EXPORT`.

Current human authority rule:

- AI may suggest and validation engines may check, but only authorized humans
  may approve.

## Current Supporting Modules

Supporting modules already relevant to workflow:

- Scheduling manages tasks, events, reminders, AI task calendar metadata, and
  human approval for schedules.
- Layout and Publishing consumes workflow status when checking publication
  readiness and enforces publishing state transitions.
- Export checks workflow status before generating export artifacts.
- Author Studio records manuscript submission events and a pending editorial
  workflow marker.
- Editorial Decisions manages AI recommendations, human approval, rejection,
  audit trail, and versioning.
- Public Portal, Commerce, Media Localization, Multimedia, Marketplace,
  Platform Engineering, Policy Engine, Collaboration, Terminology, and
  Translation Memory each contain local approval or status logic.

## Current Persistence Baseline

Runtime database table names include:

- `workflow_states`.
- `workflow_transitions`.
- `workflow_audit_events`.
- `scheduling_tasks`.
- `scheduling_events`.
- `scheduling_reminders`.
- `scheduling_agent_runs`.
- `scheduling_audit_events`.

The current Workflow repository implementation is in-memory. Runtime database
tables exist for backup/restore and broader runtime state alignment, but the
current workflow service does not yet use a full database-backed repository in
the inspected implementation.

## Target Architecture

Target workflow architecture:

```text
WorkflowDefinition
  -> WorkflowVersion
  -> WorkflowInstance
  -> WorkflowStage
  -> WorkflowTask
  -> WorkflowAssignment
  -> WorkflowApproval
  -> WorkflowTransition
  -> WorkflowEvent
  -> WorkflowHistory
```

Functional modules provide domain signals. Workflow Engine coordinates process
movement, task generation, assignment, deadlines, approvals, automation, and
history.

## Work Table Role

Work Table is the user-facing execution surface for workflow tasks. It is not
a separate workflow engine.

The Work Table must show only tasks, actions, documents, comments, and
workflow information that the user is authorized to see.

## Consolidation Rule

Workflow rules must be centralized gradually.

Modules may keep domain-specific validation rules. They must not own generic
workflow concerns such as:

- Stage sequencing.
- Cross-module approvals.
- Task orchestration.
- Assignment routing.
- Deadline escalation.
- Workflow event publication.
- Process versioning.

## Non-Goals for This Baseline

This document does not implement:

- New runtime workflow tables.
- Database migrations.
- API changes.
- UI changes.
- Event bus changes.
- Notification delivery.
- AI Orchestration calls.
- Docker or staging changes.
