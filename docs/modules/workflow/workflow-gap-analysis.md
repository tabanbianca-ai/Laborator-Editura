# Workflow Engine Gap Analysis

## Purpose

This document compares the current repository baseline with the official
Workflow Engine and Business Process Automation Module specification.

## Summary

The repository has a functional MVP Workflow v1 that protects core document,
segment, approval, ready-for-export, and export gates.

The target architecture requires a broader configurable Workflow Engine with
versioned workflow definitions, immutable workflow versions, workflow
instances, state machine configuration, task generation, unified approvals,
business rule configuration, notifications, scheduling, SLA escalation,
automation, events, observability, and process audit.

## Gap Table

| Area | Current baseline | Required target | Risk |
| --- | --- | --- | --- |
| Workflow definitions | Documented only | Runtime `WorkflowDefinition` | High |
| Workflow versions | Documented only | Immutable `WorkflowVersion` | High |
| Workflow instances | Lightweight `WorkflowState` | Version-bound `WorkflowInstance` | High |
| State machine | Hardcoded MVP transitions | Configurable state machine | Medium |
| Rule engine | Hardcoded service checks | Configurable IF/THEN rules | High |
| Task management | Scheduling tasks exist separately | Workflow-generated tasks | High |
| Approval orchestration | Dispersed across modules | Central approval engine | High |
| Scheduler | Scheduling module exists | Workflow-driven SLA/retry/escalation | Medium |
| Automation | Local module actions | Reusable auditable automation rules | High |
| Events | Transitions and audit only | Versioned workflow event contracts | Medium |
| Notifications | Not centralized in workflow | Module 11 integration needed | Medium |
| Observability | General observability exists | Workflow stage/SLA metrics | Medium |

## Current Strengths

- Workflow v1 exists and is integrated with QA and Semantic Fidelity.
- Workflow v1 supports document and segment scope.
- Workflow v1 records transitions and audit events.
- Human Final Authority is enforced for approval and export gates.
- Export checks workflow status before creating artifacts.
- Publishing and Distribution workflows are already protected by gates.
- Scheduling provides task, event, reminder, and agent scheduling primitives.
- Existing docs in `docs/workflow` define target architecture.

## Dispersed Workflow Logic

Workflow-like behavior exists in:

- Workflow module.
- Scheduling module.
- Export module.
- Publishing and Distribution.
- Author Studio submission flow.
- Editorial Decisions.
- Rights and Provenance.
- Public Portal release approval.
- Commerce release approval.
- Multimedia Creation.
- Media Localization.
- Marketplace enablement.
- Platform Engineering approvals.
- Policy Engine exceptions.
- Collaboration moderation.
- Terminology validation and approval.

These areas should be migrated incrementally only when the workflow concern is
generic process coordination rather than domain validation.

## Key Risks

### Destabilization Risk

Broad workflow refactoring could break validated Phase 7 Step 16 behavior.
Migration must be additive and compatibility-driven.

### Hardcoded Rule Risk

Hardcoded transitions and conditions limit configurability and require code
changes for process updates.

### Approval Fragmentation Risk

Approvals are consistent with Human Final Authority but dispersed across
modules, which makes process analytics and escalation harder.

### Automation Risk

Automation could accidentally approve, publish, grant rights, or bypass
workflow unless boundaries are explicit.

### Notification Dependency Risk

Workflow notifications depend on the future Notification and Communication
Module. Workflow should emit notification requests, not implement delivery.

## Acceptance Gaps

The module is incomplete until:

- Workflow definitions are runtime-configurable.
- Workflow versions are immutable.
- Workflow instances reference fixed versions.
- Tasks are generated from workflow stages.
- Approvals are centrally orchestrated.
- Business rules are configurable without code.
- Scheduler, SLA, and escalation integrate with workflow.
- Workflow events are versioned.
- Workflow observability is available.

