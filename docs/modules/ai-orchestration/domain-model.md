# AI Orchestration Domain Model

## Purpose

This document defines the conceptual domain model for the AI Orchestration and
Editorial Agents Module.

The model is implementation-ready, but it does not authorize database schema,
API, or runtime changes by itself.

## Core Aggregates

### AITask

Represents one AI capability request from a platform module.

Fields:

- `aiTaskId`.
- `organizationId`.
- `workspaceId`.
- `projectId`.
- `documentId`.
- `manuscriptId`.
- `segmentId`.
- `callingModule`.
- `capabilityId`.
- `agentId`.
- `status`.
- `priority`.
- `idempotencyKey`.
- `humanApprovalRequired`.
- `createdBy`.
- `createdAt`.
- `completedAt`.

Statuses:

- `CREATED`.
- `CONTEXT_BUILDING`.
- `PROMPT_GENERATING`.
- `MODEL_SELECTING`.
- `EXECUTING`.
- `VALIDATING`.
- `WAITING_FOR_HUMAN_REVIEW`.
- `COMPLETED`.
- `FAILED`.
- `CANCELLED`.

### AIAgentDefinition

Represents a registered editorial agent or specialized subagent.

Fields:

- `agentId`.
- `name`.
- `kind`.
- `parentAgentIds`.
- `mission`.
- `responsibilities`.
- `limits`.
- `authority`.
- `supportedCapabilities`.
- `permissionsRequired`.
- `enabled`.
- `version`.
- `updatedAt`.

### AIAgentChain

Represents an ordered chain of agent executions.

Fields:

- `chainId`.
- `name`.
- `taskType`.
- `steps`.
- `dependencyRules`.
- `retryPolicy`.
- `humanReviewGates`.
- `version`.
- `status`.

Example:

```text
Translation Agent
  -> Terminology and Lexicography Subagent
  -> Semantic Fidelity Subagent
  -> Review Agent
  -> Editorial Decision Subagent
```

### AIContextPackage

Represents the authorized context assembled for an AI task.

Fields:

- `contextPackageId`.
- `aiTaskId`.
- `sourceReferences`.
- `includedResourceTypes`.
- `excludedResourceTypes`.
- `privacyClassification`.
- `needToKnowScope`.
- `languageMetadata`.
- `rightsConstraints`.
- `permissionSnapshot`.
- `contextHash`.
- `version`.
- `createdAt`.

The context package stores references and metadata. Full sensitive content must
be minimized and redacted according to security and Need-to-Know rules.

### AIPromptVersion

Represents the exact prompt version used for execution.

Fields:

- `promptId`.
- `version`.
- `capabilityId`.
- `agentId`.
- `language`.
- `inputContract`.
- `outputContract`.
- `systemInstructions`.
- `template`.
- `variables`.
- `status`.
- `approvedBy`.
- `approvedAt`.
- `createdAt`.

Prompts cannot be overwritten. New changes create new versions.

### AIModelRoute

Represents the selected provider and model route.

Fields:

- `routeId`.
- `aiTaskId`.
- `providerId`.
- `modelId`.
- `routingPolicyVersion`.
- `fallbackProviderId`.
- `selectionReason`.
- `costEstimate`.
- `latencyTarget`.
- `qualityTarget`.
- `selectedAt`.

### AIExecutionRecord

Represents a concrete execution attempt.

Fields:

- `executionId`.
- `aiTaskId`.
- `agentId`.
- `providerId`.
- `modelId`.
- `modelVersion`.
- `promptId`.
- `promptVersion`.
- `contextPackageId`.
- `startedAt`.
- `completedAt`.
- `durationMs`.
- `inputTokens`.
- `outputTokens`.
- `totalTokens`.
- `estimatedCost`.
- `resultStatus`.
- `errorCode`.
- `normalizedOutputReference`.

### AIValidationReport

Represents validation of AI output before it is exposed to a module.

Fields:

- `validationReportId`.
- `aiTaskId`.
- `executionId`.
- `checks`.
- `status`.
- `issues`.
- `requiresHumanReview`.
- `validatedAt`.

Statuses:

- `PASSED`.
- `PASSED_WITH_WARNINGS`.
- `FAILED`.
- `MANUAL_REVIEW_REQUIRED`.

### AIAuditEvent

Represents immutable audit evidence for AI orchestration.

Actions include:

- `AI_TASK_CREATED`.
- `AI_CONTEXT_BUILT`.
- `AI_PROMPT_GENERATED`.
- `AI_MODEL_SELECTED`.
- `AI_AGENT_EXECUTED`.
- `AI_VALIDATION_COMPLETED`.
- `AI_TASK_COMPLETED`.
- `AI_TASK_FAILED`.
- `AI_HUMAN_REVIEW_REQUESTED`.
- `AI_HUMAN_OVERRIDE_RECORDED`.

## Current Baseline Mapping

Current repository components map to the future domain model as follows:

| Future concept | Current baseline |
| --- | --- |
| `AIAgentDefinition` | `AI_AGENT_GOVERNANCE_PROFILES` in AI Governance |
| Provider metadata | AI Governance provider status records |
| Cost and quota records | AI Governance usage, budgets, quotas, policies |
| Agent marketplace metadata | Marketplace agent records |
| Execution observability | Observability agent execution records |
| Prompt architecture | `docs/ai/prompt-management.md`; no runtime registry yet |
| Context builder | Documented architecture only; no runtime builder yet |
| Model router | Provider status metadata exists; no router runtime yet |
| Validation engine | Domain validators exist in QA, Semantic Fidelity, Terminology; no central AI output validation engine yet |
| External provider adapters | Not implemented |

## Ownership Rules

- AI Orchestration owns AI task lifecycle and execution records.
- AI Governance owns provider status, cost, quota, budget, and policy records.
- Marketplace owns installable agent and extension metadata.
- Observability owns runtime metrics, logs, traces, and operational views.
- Workflow owns editorial workflow state.
- Audit owns immutable accountability records.
- Functional modules own their domain data and final human decisions.

