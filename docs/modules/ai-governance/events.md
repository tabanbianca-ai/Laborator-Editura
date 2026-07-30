# AI Governance Events

## Purpose

AI Governance events define the official event vocabulary for model
registration, prompt publishing, agent registration, execution, evaluation,
cost thresholding, policy violations, human review, and provider availability.

Events must be typed, tenant-scoped, traceable, auditable, and compatible with
AI Orchestration and Observability.

## Official Events

### ModelRegistered

Emitted when a model is added to the registry.

Payload:

- `modelId`.
- `providerId`.
- `modelName`.
- `modelVersion`.
- `registeredBy`.
- `registeredAt`.

### ModelApproved

Emitted when an authorized human approves a model.

Payload:

- `modelId`.
- `approvedBy`.
- `approvedAt`.
- `approvalStatus`.

### ModelDeprecated

Emitted when a model is deprecated.

Payload:

- `modelId`.
- `deprecatedBy`.
- `deprecatedAt`.
- `replacementModelId`.
- `reason`.

### PromptPublished

Emitted when a prompt version becomes active.

Payload:

- `promptId`.
- `promptVersionId`.
- `publishedBy`.
- `publishedAt`.
- `applicableAgents`.
- `applicableModels`.

### PromptUpdated

Emitted when a new prompt version is created.

Payload:

- `promptId`.
- `previousVersion`.
- `newVersion`.
- `createdBy`.
- `createdAt`.

### AgentRegistered

Emitted when an AI agent definition is registered.

Payload:

- `agentId`.
- `name`.
- `agentKind`.
- `registeredBy`.
- `registeredAt`.

### AgentExecuted

Emitted when an agent execution is recorded.

Payload:

- `executionId`.
- `agentId`.
- `modelId`.
- `promptVersionId`.
- `workflowId`.
- `status`.
- `durationMs`.
- `cost`.
- `tokenUsage`.
- `createdAt`.

### EvaluationCompleted

Emitted when an evaluation completes.

Payload:

- `evaluationId`.
- `subjectType`.
- `subjectId`.
- `scores`.
- `completedAt`.

### CostThresholdExceeded

Emitted when usage reaches or exceeds a configured cost threshold.

Payload:

- `scope`.
- `scopeRef`.
- `threshold`.
- `currentConsumption`.
- `currency`.
- `detectedAt`.

### PolicyViolationDetected

Emitted when an AI request violates policy.

Payload:

- `policyId`.
- `resourceType`.
- `resourceId`.
- `actorId`.
- `violationType`.
- `detectedAt`.

### HumanReviewRequired

Emitted when an AI request or output requires human review.

Payload:

- `resourceType`.
- `resourceId`.
- `reviewReason`.
- `requiredRole`.
- `createdAt`.

### AIProviderUnavailable

Emitted when an AI provider is unavailable.

Payload:

- `providerId`.
- `status`.
- `fallbackProviderId`.
- `detectedAt`.

## Current Runtime Audit Actions

Current AI Governance audit covers provider changes, fallback activation,
fallback recovery, usage recording, budget creation, quota creation, cost
policy creation, budget warnings, budget exceeded events, AI action blocked,
subscription changes, and budget override decisions.

## Event Rules

- Events must include organization scope where applicable.
- Events must include actor identity or service identity.
- Events must not include secrets.
- Events must preserve model, prompt, provider, and policy version references.
- Events must be observable and auditable.
- Human review events must not imply approval.
