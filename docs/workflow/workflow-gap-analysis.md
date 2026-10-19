# Workflow Architecture Gap Analysis

## Purpose

This document compares the current repository workflow baseline with the
official Workflow Engine architecture defined in Chapter 8.

## Summary

The repository has a functional MVP Workflow v1 for document and segment
states. It enforces important gates for QA, Semantic Fidelity, terminology,
approval, ready-for-export, and export.

The additive configurable foundation now provides versioned definitions,
immutable activated versions, version-bound instances, stages, transitions,
structured conditions, role-based approvals, persistence, and audit. Tasks,
assignments, notifications, deadlines, events, automation execution,
escalation, and workflow-specific observability remain incremental gaps.

## Current Strengths

- Workflow v1 exists and is integrated with QA and Semantic Fidelity checks.
- Workflow v1 supports document and segment scopes.
- Workflow v1 records transitions and audit events.
- Workflow v1 enforces Human Final Authority for approval and export gates.
- Export checks workflow status before creating artifacts.
- Layout and Publishing consumes workflow status for publication readiness.
- Scheduling supports tasks, events, reminders, AI task scheduling metadata,
  human approval, and audit.
- Many modules already enforce human approval and audit locally.
- Runtime backup tables include workflow and scheduling state.

## Gaps

### Implemented Configurable Foundation

- `WorkflowDefinition` and numbered `WorkflowVersion` records are persisted.
- Activated workflow versions are immutable and carry a configuration digest
  in PostgreSQL.
- New instances retain the governing version identifier for their lifecycle.
- Stage transitions, approvals, evaluated rules, and configuration actions are
  tenant-scoped and auditable.
- The legacy Workflow v1 repository also remains file-backed and durable.
- Existing fixed editorial gates and APIs remain unchanged during incremental
  adoption.

### Task Management

Gap:

- Scheduling has tasks and reminders, but Workflow Engine does not yet generate
  workflow tasks from stage definitions.

Impact:

- Work Table cannot yet be fully driven by Workflow Engine task definitions.

### Automation Execution

Gap:

- Structured transition conditions are configurable.
- Workflow-triggered automation execution is not implemented.

Impact:

- External automation remains unavailable and cannot bypass domain validation.

### Advanced Approval Model

Gap:

- Configurable stages support role-based minimum human approval counts.
- Existing approval logic still exists across multiple modules.
- Parallel, sequential, and veto orchestration are not yet centralized.

Impact:

- Human Final Authority is preserved, but approval orchestration is dispersed.

### Event Architecture

Gap:

- Workflow transitions and audit are recorded, but a complete documented event
  bus or workflow event contract was not identified.

Impact:

- Cross-module automation remains local and ad hoc.

### Notifications and Escalations

Gap:

- Scheduling/reminder metadata exists, but workflow-driven notification and
  escalation rules are not yet centralized.

Impact:

- Deadline and SLA behavior cannot yet be configured globally.

### Observability

Gap:

- Observability foundation exists, but workflow-specific metrics such as stage
  duration, bottlenecks, approval latency, and SLA status are not fully wired
  to Workflow Engine.

Impact:

- Management visibility into workflow health remains incomplete.

### AI Execution

Gap:

- AI task scheduling metadata exists, but Workflow Engine does not yet request
  AI execution through the AI Orchestration Service.

Impact:

- AI-assisted workflow remains planned rather than fully orchestrated.

## Dispersed Workflow Logic

Workflow-like logic is currently present in:

- Workflow module.
- Scheduling module.
- Export module.
- Layout and Publishing module.
- Author Studio submission flow.
- Editorial Decisions approvals.
- Public Portal release approvals.
- Commerce release approvals.
- Multimedia and Media Localization approvals.
- Marketplace enable/disable approvals.
- Platform Engineering approvals.
- Policy Engine exceptions.
- Collaboration moderation.
- Terminology and Translation Memory validation/approval.

These areas should be consolidated gradually into Workflow Engine where the
logic is generic process coordination rather than module-owned domain logic.

## Risk Assessment

Current risk: Medium.

Reason:

- MVP workflow gates exist and protect core publishing/export behavior.
- Workflow rules are partly hardcoded and partly dispersed.
- Immediate broad refactoring could destabilize validated Phase 7 Step 16
  behavior.

## Recommended Priority

Before structural workflow changes:

1. Define workflow contracts.
2. Map existing status and approval logic.
3. Add workflow definition/version models.
4. Add durable workflow repository alignment.
5. Introduce task generation behind existing APIs.
6. Add event contracts.
7. Migrate module approvals incrementally.
