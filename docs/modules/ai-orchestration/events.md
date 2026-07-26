# AI Orchestration Events

## Purpose

This document defines the official event model for AI orchestration.

Events support coordination, audit, observability, retries, human review, and
module integration.

## Official Events

Required orchestration events:

- `AITaskCreated`.
- `ContextBuilt`.
- `PromptGenerated`.
- `ModelSelected`.
- `AgentExecuted`.
- `ValidationCompleted`.
- `AITaskCompleted`.
- `AITaskFailed`.

Recommended additional events:

- `AgentChainStarted`.
- `AgentChainStepCompleted`.
- `AgentChainCompleted`.
- `AgentChainFailed`.
- `HumanReviewRequested`.
- `HumanOverrideRecorded`.
- `ProviderFallbackActivated`.
- `ProviderFallbackRecovered`.
- `AIBudgetWarningRaised`.
- `AIActionBlocked`.

## Event Envelope

Every event should include:

- `eventId`.
- `eventType`.
- `organizationId`.
- `workspaceId`.
- `projectId`.
- `documentId`.
- `aiTaskId`.
- `agentId`.
- `correlationId`.
- `traceId`.
- `actorId`.
- `occurredAt`.
- `payload`.
- `auditEventId`.

## Current Event and Audit Baseline

Existing AI-adjacent audit actions include:

- AI Governance provider, usage, budget, quota, policy, override, fallback,
  and block events.
- Marketplace agent and extension creation, enablement, disablement, install,
  and audit events.
- Observability metric, log, trace, and agent execution audit events.
- Editorial Decision recommendation, version, approval, and rejection audit.
- Policy Engine AI execution compliance and exception audit.

No complete AI orchestration event stream was identified.

## Event Rules

- Events must be append-only.
- Events must not contain provider secrets.
- Events must not contain unrestricted sensitive content.
- Events must include correlation and trace identifiers where available.
- Events must preserve prompt and context version references.
- Events must be emitted after successful state changes.
- Failed execution events must preserve error class and retry metadata.

## Integration Events

Functional modules may consume orchestration events to update local read
models, but they must not treat AI events as human approvals.

Example:

- Translation may display `ValidationCompleted`.
- Review may display `HumanReviewRequested`.
- Publishing may consume Quality Agent readiness, but it must still require
  workflow and human approval gates.

