# AI Architecture Migration Plan

## Purpose

This document defines the incremental path from the current AI governance
metadata foundation to the full provider-agnostic AI Orchestration
architecture.

## Constraints

- Preserve Phase 7 Step 16 validated publishing, preflight, distribution,
  Library, Rights, Workflow, Export, Quality, Backup, and audit behavior.
- Do not add direct provider calls inside functional modules.
- Do not hardcode production prompts in modules.
- Do not bypass Human Final Authority.
- Do not weaken security, tenant isolation, Need-to-Know access, or audit.
- Do not introduce provider SDKs before adapter and orchestration contracts are
  approved.

## Phase 0 - Documentation Baseline

Status: Current.

Deliverables:

- `docs/ARCHITECTURE_CHAPTER_7.md`.
- `docs/ai/ai-architecture.md`.
- `docs/ai/provider-registry.md`.
- `docs/ai/capability-catalog.md`.
- `docs/ai/prompt-management.md`.
- `docs/ai/ai-security.md`.
- `docs/ai/ai-observability.md`.
- `docs/ai/ai-gap-analysis.md`.
- `docs/ai/ai-migration-plan.md`.

Outcome:

- Official AI architecture standard and baseline audit exist.

## Phase 1 - Orchestration Contracts

Define:

- `AIOrchestrationRequest`.
- `AIOrchestrationResponse`.
- `AICapabilityId`.
- `AIContextReference`.
- `AIProviderAdapter`.
- `NormalizedAIResponse`.
- `AIRoutingPolicy`.
- `AIAuditRecord`.

No external provider SDK integration in this phase.

## Phase 2 - Prompt Registry Foundation

Implement:

- Prompt records.
- Prompt versions.
- Prompt statuses.
- Prompt input and output contracts.
- Prompt audit.

Migrate production-ready prompts into the registry before provider execution.

## Phase 3 - Capability Router

Implement:

- Capability lookup.
- Provider suitability rules.
- Model selection policy.
- Fallback policy.
- Privacy policy checks.
- Cost policy checks.
- Routing policy versioning.

## Phase 4 - Context Management and Security Filtering

Implement:

- Central context assembly.
- Need-to-Know filtering.
- Sensitive data filtering.
- Provider data policy checks.
- Tenant isolation verification.
- Context reference audit.

## Phase 5 - Observability and Audit Wiring

Connect AI execution to:

- Existing audit infrastructure.
- Observability metrics.
- Structured logs.
- Traces.
- AI Governance usage and cost records.
- Provider fallback audit events.

## Phase 6 - Provider Adapter Implementations

Implement adapters incrementally:

1. OpenAI adapter.
2. Anthropic adapter.
3. Additional approved providers only when scheduled.

Each adapter must pass:

- Capability support tests.
- Response normalization tests.
- Error normalization tests.
- Cost estimation tests.
- Provider health tests.
- Security redaction tests.

## Phase 7 - Module Migration

Migrate AI-enabled modules to call AI Orchestration only.

Order:

1. Translation.
2. Terminology.
3. Semantic Fidelity.
4. Review.
5. Research.
6. Author Studio.
7. Quality Agent.
8. Layout and Publishing.
9. Multimedia and Media Localization.
10. Workflow and Scheduling.

Each module migration must preserve current public API behavior unless an
additive optional field is explicitly approved.

## Phase 8 - Production Provider Enablement

Enable external provider execution only after:

- Orchestration contracts are stable.
- Prompt registry is active.
- Provider adapters are tested.
- Security filtering is active.
- Cost enforcement is active.
- Observability is active.
- Audit is complete.
- Human approval gates are preserved.

## Acceptance Criteria

The migration is complete when:

- No functional module imports provider SDKs directly.
- Every AI request uses AI Orchestration.
- Provider adapters are interchangeable.
- Prompts are centralized and versioned.
- Context is filtered and auditable.
- Provider usage is observable.
- Cost limits are enforced.
- Human approval remains mandatory.
