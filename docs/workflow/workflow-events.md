# Workflow Events

## Purpose

This document defines the event architecture for Workflow Engine.

Workflow events describe what happened. They do not replace audit records or
domain state.

## Event Naming

Workflow event names use lowercase dot notation.

Examples:

- `workflow.started`.
- `task.created`.
- `approval.granted`.

## Core Workflow Events

Required baseline events:

- `workflow.definition.created`.
- `workflow.definition.versioned`.
- `workflow.started`.
- `workflow.paused`.
- `workflow.resumed`.
- `workflow.completed`.
- `workflow.failed`.
- `workflow.blocked`.
- `workflow.unblocked`.
- `workflow.cancelled`.
- `stage.entered`.
- `stage.exited`.
- `transition.executed`.

## Task Events

Task events:

- `task.created`.
- `task.assigned`.
- `task.reassigned`.
- `task.started`.
- `task.completed`.
- `task.blocked`.
- `task.unblocked`.
- `task.cancelled`.
- `task.overdue`.

## Approval Events

Approval events:

- `approval.requested`.
- `approval.granted`.
- `approval.rejected`.
- `approval.vetoed`.
- `approval.expired`.
- `approval.override_requested`.
- `approval.override_accepted`.
- `approval.override_rejected`.

## Deadline Events

Deadline events:

- `deadline.created`.
- `deadline.changed`.
- `deadline.exceeded`.
- `deadline.escalated`.

## Automation Events

Automation events:

- `automation.triggered`.
- `automation.completed`.
- `automation.failed`.
- `automation.skipped`.
- `automation.blocked`.

## AI Workflow Events

AI-related workflow events:

- `ai.execution.requested`.
- `ai.execution.completed`.
- `ai.execution.failed`.
- `ai.execution.blocked_by_policy`.
- `ai.execution.requires_human_review`.

These events must reference AI Orchestration execution records and must never
represent direct provider calls from Workflow Engine.

## Event Payload

Every workflow event should include:

- `eventId`.
- `eventName`.
- `eventVersion`.
- `organizationId`.
- `workflowInstanceId`.
- `workflowDefinitionId`.
- `workflowVersionId`.
- `stageId` when applicable.
- `taskId` when applicable.
- `approvalId` when applicable.
- `actorId`.
- `correlationId`.
- `occurredAt`.
- `metadata`.

## Event Versioning

Event contracts must be versioned when their payload structure changes.

Consumers must not rely on undocumented fields.

## Audit Relationship

Every state-changing workflow event must have an audit event or audit
reference.

Audit answers who authorized the action. Events coordinate reactions.
