# AI Orchestration Migration Plan

## Purpose

This document defines the incremental path from the current AI governance
metadata foundation to the official AI Orchestration and Editorial Agents
Module.

The migration must be additive and must preserve all validated functionality
from Phase 7 Step 16 and Chapters 0-15.

## Constraints

- Do not add direct provider calls inside functional modules.
- Do not hardcode production prompts in modules.
- Do not bypass Human Final Authority.
- Do not weaken RBAC, tenant isolation, Need-to-Know access, security,
  audit, or workflow gates.
- Do not introduce provider SDKs before orchestration contracts and adapter
  contracts are approved.
- Preserve existing AI Governance, Marketplace, Observability, Gateway,
  Editorial Decision, Translation, Rights, Publishing, Magazine, and Quality
  behavior.

## Phase 1 - Baseline Mapping

Status: current documentation phase.

Deliverables:

- Inventory AI-related services.
- Document existing agent profiles.
- Document provider and cost governance baseline.
- Document existing API coverage.
- Document gaps and risks.

## Phase 2 - Orchestration Contracts

Define:

- `AITask`.
- `AIOrchestrationRequest`.
- `AIOrchestrationResponse`.
- `AIAgentDefinition`.
- `AIAgentChain`.
- `AIContextPackage`.
- `AIPromptVersion`.
- `AIModelRoute`.
- `AIExecutionRecord`.
- `AIValidationReport`.
- `AIAuditEvent`.

No external provider execution in this phase.

## Phase 3 - API Skeleton

Add authenticated, additive endpoints:

- `POST /ai/tasks`.
- `GET /ai/tasks/{id}`.
- `GET /ai/agents`.
- `POST /ai/context/build`.
- `POST /ai/prompts/preview`.

Endpoints may return deterministic metadata until provider execution is
approved.

## Phase 4 - Context Builder Foundation

Implement:

- Authorized context source selection.
- Need-to-Know filtering.
- Sensitive data redaction.
- Context hashes.
- Context source references.
- Context audit.

Start with read-only preview behavior.

## Phase 5 - Prompt Registry Foundation

Implement:

- Prompt records.
- Prompt versions.
- Prompt statuses.
- Prompt input and output contracts.
- Prompt preview.
- Prompt audit.

Production prompts must be `ACTIVE` before execution.

## Phase 6 - Model Router Foundation

Implement:

- Provider-independent route selection.
- Routing policy versioning.
- Cost and quota pre-checks.
- OpenAI primary and Anthropic fallback metadata integration.
- Fallback and recovery audit.

No provider SDKs are required until adapter contracts are approved.

## Phase 7 - Validation Engine Foundation

Implement:

- AI output schema validation.
- Completeness checks.
- Human review requirement checks.
- Terminology, QA, Semantic Fidelity, Rights, and Workflow validation reuse.
- Validation report audit.

## Phase 8 - Agent Chain Runtime

Implement:

- Ordered chain execution.
- Step dependency handling.
- Retry policy.
- Idempotency.
- Step-level audit and observability.
- Human review gates.

## Phase 9 - Provider Adapter Integration

Only after Phases 2-8 are stable:

- Add provider adapter interface.
- Add provider health checks.
- Add normalized provider request/response mapping.
- Add controlled OpenAI adapter.
- Add controlled Anthropic fallback adapter.

Functional modules must remain provider-agnostic.

## Phase 10 - Module Adoption

Adopt orchestration module-by-module:

1. Editorial Decision preview.
2. Translation advisory support.
3. Terminology and Lexicographic support.
4. Semantic Fidelity explanations.
5. Review proposals.
6. Publishing and Quality readiness summaries.
7. Magazine advisory support.
8. Audio and Video future execution support.

## Testing Requirements

Each phase requires:

- Contract tests.
- Tenant isolation tests.
- Need-to-Know tests.
- Human Final Authority tests.
- Audit tests.
- Cost governance tests.
- Provider fallback tests when adapters exist.
- Regression tests for Phase 7 Step 16 publishing/preflight/distribution.

## Next Recommended Module

Module 8 - Audio and Narration Module Architecture is now documented as the
next Phase II specification after AI Orchestration and Editorial Agents.

Module 9 - Video and Multimedia Module Architecture is now documented after
Audio and Narration.

Module 10 - Workflow Engine and Business Process Automation Module
Architecture is now documented after Video and Multimedia.

Module 11 - Notification and Communication Module Architecture is now
documented after Workflow Engine and Business Process Automation.

Module 12 - Identity, Access Management and Security Module Architecture is
now documented after Notification and Communication.

Module 13 - Observability, Monitoring and Audit Module Architecture is now
documented after Identity, Access Management and Security.

Module 14 - Backup, Disaster Recovery and Business Continuity Module
Architecture is now documented after Observability, Monitoring and Audit.

Module 15 - Search, Indexing and Knowledge Graph Module Architecture is now
documented after Backup, Disaster Recovery and Business Continuity.

Module 16 - Integration, API Gateway and External Connectors Module
Architecture is now documented after Search, Indexing and Knowledge Graph.

The next recommended module specification after Integration, API Gateway and
External Connectors is Module 17 - Configuration, Feature Flags and Platform
Administration Module Architecture.
