# AI Governance Domain Model

## Purpose

This document defines the conceptual domain model for the AI Governance, Model
Management and Responsible AI Module.

The model is technology-independent and describes the entities required to
govern AI models, providers, prompts, agents, policies, evaluations,
benchmarks, costs, risks, explanations, approvals, and audit evidence.

## Aggregate Ownership

AI Governance owns:

- AI Model.
- Model Version.
- AI Provider.
- Provider Capability.
- Prompt Template.
- Prompt Version.
- AI Agent Definition.
- Agent Model Assignment.
- AI Policy.
- Policy Evaluation.
- Model Evaluation.
- Benchmark Run.
- AI Usage Record.
- AI Cost Record.
- AI Budget.
- AI Quota.
- AI Risk Record.
- Explainability Record.
- Human Review Requirement.
- AI Governance Audit Event.

AI Orchestration owns execution coordination and runtime request flow. AI
Governance owns the policies, registries, approvals, and evidence that AI
Orchestration must consult.

## AI Model

Represents a governed model identity.

Fields:

- `modelId`.
- `providerId`.
- `modelName`.
- `modelVersion`.
- `capabilities`.
- `supportedLanguages`.
- `supportedModalities`.
- `deploymentStatus`.
- `ownerId`.
- `approvalStatus`.
- `lifecycleState`.
- `riskProfile`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

Deployment statuses:

- `NOT_CONFIGURED`.
- `AVAILABLE`.
- `DISABLED`.
- `DEGRADED`.
- `DEPRECATED`.

Lifecycle states:

- `CANDIDATE`.
- `EVALUATION`.
- `APPROVED`.
- `ACTIVE`.
- `DEPRECATED`.
- `RETIRED`.

Approval statuses:

- `PENDING_REVIEW`.
- `APPROVED`.
- `REJECTED`.
- `SUSPENDED`.

## AI Provider

Represents a governed external or local AI provider.

Fields:

- `providerId`.
- `name`.
- `displayName`.
- `providerType`.
- `status`.
- `priority`.
- `fallbackPriority`.
- `supportedModels`.
- `supportedCapabilities`.
- `dataProcessingProfile`.
- `retentionPolicyRef`.
- `costProfile`.
- `configuredBy`.
- `configuredAt`.
- `updatedAt`.

## Prompt Template

Represents a reusable prompt family.

Fields:

- `promptId`.
- `name`.
- `ownerId`.
- `description`.
- `purpose`.
- `language`.
- `applicableModels`.
- `applicableAgents`.
- `riskLevel`.
- `approvalStatus`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

## Prompt Version

Represents an immutable prompt version.

Fields:

- `promptVersionId`.
- `promptId`.
- `version`.
- `template`.
- `variables`.
- `evaluationStatus`.
- `approvalStatus`.
- `approvedBy`.
- `approvedAt`.
- `supersededBy`.
- `createdBy`.
- `createdAt`.

Prompt versions cannot be overwritten.

## AI Agent Definition

Represents a governed AI agent or subagent.

Fields:

- `agentId`.
- `name`.
- `purpose`.
- `agentKind`.
- `parentAgentId`.
- `assignedModels`.
- `assignedPrompts`.
- `workflows`.
- `permissions`.
- `policies`.
- `monitoringProfile`.
- `ownerId`.
- `status`.
- `limits`.
- `authority`.

## AI Policy

Represents an AI governance policy.

Fields:

- `policyId`.
- `organizationId`.
- `name`.
- `description`.
- `allowedModels`.
- `forbiddenModels`.
- `costLimits`.
- `tokenLimits`.
- `dataClassificationRules`.
- `requiredApprovals`.
- `autonomyLevel`.
- `providerUsageRules`.
- `promptRetentionRules`.
- `responseRetentionRules`.
- `status`.
- `version`.
- `createdBy`.
- `approvedBy`.
- `createdAt`.
- `updatedAt`.

## Model Evaluation

Represents an evaluation result for a model, prompt, provider, or agent.

Fields:

- `evaluationId`.
- `modelId`.
- `promptVersionId`.
- `agentId`.
- `datasetRef`.
- `qualityScore`.
- `accuracyScore`.
- `latencyMs`.
- `cost`.
- `stabilityScore`.
- `availabilityScore`.
- `userSatisfactionScore`.
- `acceptanceRate`.
- `humanInterventionRate`.
- `evaluatedBy`.
- `evaluatedAt`.

## Benchmark Run

Represents a reproducible comparison between models, prompts, providers, or
agents.

Fields:

- `benchmarkId`.
- `organizationId`.
- `benchmarkType`.
- `subjects`.
- `datasetRefs`.
- `metrics`.
- `results`.
- `ranking`.
- `createdBy`.
- `createdAt`.

## AI Usage Record

Represents one governed AI usage event.

Current runtime implementation already stores:

- `agentName`.
- `executionType`.
- `projectId`.
- `documentId`.
- `userId`.
- `organizationId`.
- `providerMetadata`.
- `inputTokens`.
- `outputTokens`.
- `totalTokens`.
- `estimatedCost`.
- `actualCost`.
- `currency`.
- `status`.
- `costPolicyEvaluation`.
- `createdAt`.

## Explainability Record

Represents the reproducibility and explanation metadata for an AI result.

Fields:

- `explainabilityId`.
- `executionId`.
- `modelId`.
- `modelVersion`.
- `promptVersionId`.
- `parameters`.
- `sourcesUsed`.
- `temperature`.
- `providerId`.
- `timestamp`.
- `userId`.
- `workflowId`.
- `cost`.
- `tokenUsage`.
- `resultSummary`.
- `limitations`.

## AI Governance Audit Event

Represents an immutable governance audit event.

Fields:

- `auditEventId`.
- `organizationId`.
- `actorId`.
- `action`.
- `resourceType`.
- `resourceId`.
- `beforeState`.
- `afterState`.
- `humanFinalAuthority`.
- `createdAt`.

## Current Implementation Mapping

Current runtime entities:

- `ai_provider_statuses`.
- `ai_usage_records`.
- `ai_budgets`.
- `ai_quotas`.
- `ai_cost_policies`.
- `ai_budget_override_requests`.
- `ai_cost_audit_events`.
- Static `AI_AGENT_GOVERNANCE_PROFILES` in API source.

Future entities may add model registry, prompt registry, evaluation,
benchmarking, explainability, Responsible AI risk, approval workflow, and
lifecycle records when implementation is explicitly scheduled.
