# Workflow Architecture Gap Analysis

## Purpose

This document compares the current repository workflow baseline with the
official Workflow Engine architecture defined in Chapter 8.

## Summary

The repository has a functional MVP Workflow v1 for document and segment
states. It enforces important gates for QA, Semantic Fidelity, terminology,
approval, ready-for-export, and export.

The target architecture requires a broader configurable Workflow Engine with
versioned workflow definitions, immutable workflow versions, workflow
instances, stages, tasks, assignments, approvals, conditions, notifications,
deadlines, events, automation, escalation, and observability.

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

### Workflow Definitions

Gap:

- No versioned `WorkflowDefinition` or `WorkflowVersion` runtime was identified.

Impact:

- Process models are not yet configurable without code.

### Workflow Instances

Gap:

- Current workflow state acts as a lightweight instance for document or segment
  scope, but it does not reference an immutable workflow definition version.

Impact:

- Existing workflows cannot prove which process version governed execution.

### Repository Persistence

Gap:

- The inspected Workflow repository is in-memory, while runtime database table
  names exist for workflow state, transitions, and audit.

Impact:

- Workflow v1 behavior works as a contract foundation, but a future database
  repository alignment is required for production-grade durability.

### Task Management

Gap:

- Scheduling has tasks and reminders, but Workflow Engine does not yet generate
  workflow tasks from stage definitions.

Impact:

- Work Table cannot yet be fully driven by Workflow Engine task definitions.

### Conditions and Automation

Gap:

- Transition conditions are hardcoded in service logic.
- No configurable condition or automation model was identified.

Impact:

- Workflow changes currently require code changes.

### Approval Model

Gap:

- Approval logic exists across multiple modules.
- There is no unified workflow approval model for single, multiple, parallel,
  sequential, or veto approval.

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
