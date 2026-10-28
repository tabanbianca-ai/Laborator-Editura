# AI Orchestration API Contracts

GAP-02.4.2 extends task inputs with descriptor-specific resource references and
protects persisted report reads with fresh resource authorization. Legacy Quality
requests remain valid. See [Local Handler Contract](local-handler-contract.md).

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

## Operational Registry API (GAP-02.2)

These additive routes require a server-authenticated human ADMIN or
PLATFORM_CREATOR. All configuration and audit records are tenant scoped.

| Method | Route | Response |
| --- | --- | --- |
| GET | `/ai/agents` | 24 canonical identity views with configuration and availability |
| GET | `/ai/agents/:id` | Canonical identity view; aliases resolved explicitly |
| GET | `/ai/agents/:id/versions` | Tenant configuration history, ordered by version |
| POST | `/ai/agents/:id/versions` | New draft with monotonic version and SHA-256 |
| PATCH | `/ai/agents/:id/versions/:versionId` | Updated draft, incremented revision |
| POST | `/ai/agents/:id/versions/:versionId/approve` | Frozen, human-approved version |
| POST | `/ai/agents/:id/versions/:versionId/activate` | Updated tenant agent view |
| POST | `/ai/agents/:id/disable` | Disabled view; historical versions retained |

Draft bodies contain only `reason` and `bindings`. Each binding requires
`capabilityId`, `operationId`, `handlerKey`, `inputSchemaRef`, `outputSchemaRef`,
and non-empty `requiredPermissions`. Operation IDs must be unique. Unknown
fields are rejected. Drafts may contain zero bindings and remain unavailable.
Approval/activation bodies contain only `configurationSha256` and `reason`;
disable bodies contain only `reason`. Actors and tenants cannot be supplied.

Version responses include `id`, `organizationId`, `registryId`, `version`,
`revision`, `governanceVersion`, `configurationSha256`, `bindings`, `status`,
creation/update actors/times, and approval/activation actors/times when present.
Agent responses include the GAP-02.1 identity, configuration `status`,
`activeVersion`, `activeVersionId`, and computed `availability`.

Malformed or ambiguous identities return 400, unauthorized callers 403,
missing/cross-tenant versions 404, and stale digests or immutable edits 409.
Activation before approval returns 403. Current availability always denies
execution because execution runtime is outside GAP-02.2. Existing governance
and Marketplace APIs retain their existing responses and behavior.

## Future Execution Endpoints

GAP-02.3 implements controlled task creation, retrieval, explicit background run,
and cancellation as documented in [Execution Runtime](execution-runtime.md).
General capability routing, external-provider handlers, and the agent execute
convenience endpoint below remain future capabilities.

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

