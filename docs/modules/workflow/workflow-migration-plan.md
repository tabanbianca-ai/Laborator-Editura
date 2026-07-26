# Workflow Engine Migration Plan

## Purpose

This document defines the incremental path from the current Workflow v1
implementation to the official Workflow Engine and Business Process
Automation Module.

Migration must be additive and must preserve validated Phase 7 Step 16
publishing, final preflight, distribution, Library, Rights, Workflow, Export,
Quality, Backup, AI Orchestration, Audio, Video, and audit behavior.

## Constraints

- Do not destabilize existing Workflow v1 APIs.
- Do not duplicate workflow engines inside modules.
- Do not move domain validation ownership into Workflow.
- Do not weaken Human Final Authority.
- Do not bypass RBAC, tenant isolation, Need-to-Know access, security,
  subscription entitlements, or audit.
- Do not trigger AI directly from Workflow outside AI Orchestration.
- Do not implement notification delivery before Module 11 is defined.

## Phase 1 - Baseline Mapping

Status: current documentation phase.

Deliverables:

- Inventory Workflow v1 endpoints and statuses.
- Inventory existing state machines and approval flows.
- Inventory Scheduling tasks and reminders.
- Identify dispersed workflow-like logic.
- Document gaps and migration risks.

## Phase 2 - Workflow Contracts

Define:

- `WorkflowDefinition`.
- `WorkflowVersion`.
- `WorkflowInstance`.
- `WorkflowState`.
- `WorkflowTransition`.
- `WorkflowRule`.
- `WorkflowTask`.
- `WorkflowApproval`.
- `WorkflowAutomation`.
- `WorkflowSlaRule`.
- `WorkflowAuditEvent`.

No behavior migration occurs in this phase.

## Phase 3 - Definition and Version Foundation

Implement metadata-first workflow definitions and immutable workflow versions.

Rules:

- Existing Workflow v1 APIs continue to work.
- Existing active flows keep current behavior.
- New definitions are additive metadata.
- Activated versions cannot be changed.

## Phase 4 - Durable Repository Alignment

Align Workflow repository with durable runtime persistence.

Rules:

- Preserve current workflow state, transition, and audit behavior.
- Preserve backup/restore compatibility.
- Add compatibility tests before replacing repository internals.
- No destructive migration.

## Phase 5 - Configurable State Machine

Introduce configurable state machine behavior behind compatibility adapters.

Rules:

- Existing status names remain supported.
- Existing transitions remain valid.
- New workflow versions may define custom state sequences.
- Invalid transitions are rejected and audited.

## Phase 6 - Rule Engine Foundation

Implement rule records and safe evaluation.

Rules:

- Rules coordinate domain verdicts.
- Rules do not duplicate domain validation.
- Rule versions are immutable after activation.
- Rule changes affecting publication, rights, permissions, or governance
  require authorized approval.

## Phase 7 - Task Generation

Generate workflow tasks from workflow stages.

Rules:

- Reuse Scheduling for deadlines and reminders.
- Work Table consumes tasks.
- Need-to-Know filtering applies server-side.
- Existing module actions remain until task-driven equivalents are validated.

## Phase 8 - Approval Consolidation

Move generic approval orchestration into Workflow Engine.

Rules:

- Domain modules keep validation ownership.
- Workflow coordinates individual, multiple, sequential, parallel,
  conditional, and veto approvals.
- Human Final Authority remains mandatory.

## Phase 9 - Events and Automation

Introduce versioned workflow events and safe automation rules.

Rules:

- Events are append-only and versioned.
- Automation is idempotent.
- Automation cannot approve, publish, grant rights, modify permissions, or
  bypass workflow.
- AI automation requests use AI Orchestration.

## Phase 10 - Scheduler, SLA, and Escalation

Integrate workflow with scheduling:

- Deadlines.
- Reminders.
- Retry policies.
- SLA warnings.
- SLA breaches.
- Escalations.
- Overdue tasks.

## Phase 11 - Observability and Process Analytics

Add:

- Stage duration.
- Approval latency.
- Task backlog.
- Overdue tasks.
- Bottlenecks.
- SLA breaches.
- Automation failures.
- Blocked workflow counts.

## Phase 12 - Module Adoption

Adopt Workflow Engine incrementally across:

1. Publishing and final preflight.
2. Translation and Review.
3. Rights and Provenance.
4. Magazine.
5. Audio.
6. Video.
7. AI Orchestration.
8. Public Portal and Distribution.

## Testing Requirements

Each phase requires:

- Contract tests.
- Transition tests.
- Rule evaluation tests.
- Approval tests.
- Task generation tests.
- Tenant isolation tests.
- Need-to-Know tests.
- Human Final Authority tests.
- Audit tests.
- Backup/restore tests when persistence changes.
- Regression tests for Phase 7 Step 16 publishing/preflight/distribution.

## Next Recommended Module

Module 11 - Notification and Communication Module Architecture is now
documented after Workflow Engine and Business Process Automation.

The next recommended module specification after Notification and Communication
is Module 12 - Identity, Access Management and Security Module Architecture.
