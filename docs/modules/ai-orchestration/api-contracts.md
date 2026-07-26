# AI Orchestration API Contracts

## Purpose

This document defines the target public API contracts for the AI
Orchestration and Editorial Agents Module.

All endpoints require authenticated server-derived request context unless
explicitly approved otherwise. No endpoint may trust client-provided user,
role, permission, or tenant identifiers.

## Current API Baseline

Existing AI-related APIs:

- `GET /ai-governance/providers`.
- `POST /ai-governance/providers/:provider/status`.
- `GET /ai-governance/cost-summary`.
- `GET /ai-governance/agents`.
- `GET /ai-governance/usage`.
- `POST /ai-governance/usage`.
- `GET /ai-governance/budgets`.
- `POST /ai-governance/budgets`.
- `GET /ai-governance/quotas`.
- `POST /ai-governance/quotas`.
- `GET /ai-governance/policies`.
- `POST /ai-governance/policies`.
- `POST /ai-governance/override-requests`.
- `POST /ai-governance/override-requests/:id/approve`.
- `POST /ai-governance/override-requests/:id/reject`.
- `GET /ai-governance/audit`.
- `GET /marketplace/agents`.
- `POST /marketplace/agents`.
- `POST /marketplace/agents/:id/enable`.
- `POST /marketplace/agents/:id/disable`.
- `GET /observability/agent-executions`.
- `GET /gateway/health`.
- `GET /gateway/routes`.
- `GET /gateway/modules`.

The target AI Orchestration endpoints below are not currently implemented as
a complete orchestrator runtime.

## Target Endpoints

### Create AI Task

```text
POST /ai/tasks
```

Creates an AI task and routes it through orchestration.

Request fields:

- `capabilityId`.
- `callingModule`.
- `projectId`.
- `documentId`.
- `manuscriptId`.
- `segmentId`.
- `inputReferences`.
- `expectedOutputType`.
- `humanApprovalRequired`.
- `idempotencyKey`.

### Get AI Task

```text
GET /ai/tasks/{id}
```

Returns task status, execution metadata, validation status, and human review
requirements.

### Execute Agent

```text
POST /ai/agents/{id}/execute
```

Executes a registered agent through a controlled AI task.

This endpoint must still create or reference an `AITask`; it must not bypass
task lifecycle, context building, routing, validation, audit, or observability.

### List Agents

```text
GET /ai/agents
```

Returns registered AI agents available to the authenticated user according to
role, permissions, policies, subscriptions, and Need-to-Know scope.

### Preview Prompt

```text
POST /ai/prompts/preview
```

Builds a prompt preview from a prompt version and context references without
executing an external provider.

### Build Context

```text
POST /ai/context/build
```

Builds a context package preview from authorized sources without executing an
AI model.

## API Rules

- All AI APIs are versioned.
- All inputs use typed DTOs.
- All requests require authenticated context.
- All requests are tenant-scoped.
- AI execution requires cost and quota checks.
- Sensitive context must be filtered before provider execution.
- AI may not auto-approve, publish, grant rights, modify permissions, or
  bypass workflow.
- Response metadata must include audit references and human review status.

## Response Metadata

Every AI task response should include:

- `aiTaskId`.
- `status`.
- `agentId`.
- `capabilityId`.
- `promptId`.
- `promptVersion`.
- `contextPackageId`.
- `providerId`.
- `modelId`.
- `validationStatus`.
- `humanApprovalRequired`.
- `auditEventIds`.
- `observabilityTraceId`.

