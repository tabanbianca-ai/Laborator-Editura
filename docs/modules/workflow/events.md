# Workflow Engine Events

## Purpose

This document defines official events for the Workflow Engine and Business
Process Automation Module.

Events coordinate reactions across modules. They do not replace audit records
or domain state.

## Official Events

Required events:

- `WorkflowCreated`.
- `WorkflowStarted`.
- `TaskCreated`.
- `TaskAssigned`.
- `TaskCompleted`.
- `ApprovalGranted`.
- `ApprovalRejected`.
- `WorkflowCompleted`.
- `WorkflowFailed`.

Recommended additional events:

- `WorkflowVersioned`.
- `WorkflowBlocked`.
- `WorkflowUnblocked`.
- `StateEntered`.
- `StateExited`.
- `TransitionExecuted`.
- `TaskOverdue`.
- `ApprovalRequested`.
- `ApprovalVetoed`.
- `DeadlineExceeded`.
- `EscalationTriggered`.
- `AutomationTriggered`.
- `AutomationCompleted`.
- `AutomationFailed`.

## Event Envelope

Each event should include:

- `eventId`.
- `eventName`.
- `eventVersion`.
- `organizationId`.
- `workflowDefinitionId`.
- `workflowVersionId`.
- `workflowInstanceId`.
- `stateId`.
- `transitionId`.
- `taskId`.
- `approvalId`.
- `actorId`.
- `correlationId`.
- `traceId`.
- `occurredAt`.
- `payload`.
- `auditEventId`.

## Current Event and Audit Baseline

Current support:

- Workflow v1 records transitions and audit events.
- `docs/workflow/workflow-events.md` defines target event architecture using
  lowercase dot notation.
- Scheduling has task, event, reminder, agent run, approval, and audit events.
- Many modules record local approval and status events.

Gaps:

- No complete workflow event bus runtime was identified.
- No versioned workflow event payload contracts are implemented.
- Workflow events are not yet the primary automation trigger across modules.

## Event Rules

- Events are append-only.
- Event payloads are versioned.
- Events must not contain secrets.
- Events must not bypass authorization.
- State-changing events must reference audit records.
- Automation consumers must be idempotent.
- AI workflow events must reference AI Orchestration records.

## AI Workflow Events

AI-related workflow events may include:

- `AIExecutionRequested`.
- `AIExecutionCompleted`.
- `AIExecutionFailed`.
- `AIExecutionBlockedByPolicy`.
- `AIExecutionRequiresHumanReview`.

These events must never represent direct provider calls from Workflow Engine.

