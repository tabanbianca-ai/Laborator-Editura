# AI Engineering Migration Plan

## Purpose

This plan defines how Laborator Editura should converge from the current AI
governance baseline toward full Framework 04 compliance.

## Migration Principles

- No direct provider coupling in functional modules.
- No production prompt embedded in module code.
- No AI execution without audit.
- No high-risk AI action without Human Final Authority.
- No AI context outside Need-to-Know.
- No cost-blind AI execution.
- No model or prompt promotion without evaluation evidence.
- Preserve validated Phase I-III behavior.

## Phase 0 - Framework Baseline

Status: Complete when Framework 04 documents are present.

Deliverables:

- `docs/frameworks/ai-engineering/overview.md`.
- `docs/frameworks/ai-engineering/agent-registry.md`.
- `docs/frameworks/ai-engineering/prompt-registry.md`.
- `docs/frameworks/ai-engineering/model-registry.md`.
- `docs/frameworks/ai-engineering/rag-architecture.md`.
- `docs/frameworks/ai-engineering/evaluation.md`.
- `docs/frameworks/ai-engineering/cost-management.md`.
- `docs/frameworks/ai-engineering/compliance-audit.md`.
- `docs/frameworks/ai-engineering/migration-plan.md`.

## Phase 1 - AI Asset Inventory

Goal:

- Inventory all AI-related assets.

Actions:

- Inventory principal agents and subagents.
- Inventory provider metadata.
- Inventory AI usage records.
- Inventory AI cost policies.
- Inventory AI-adjacent module recommendations and evidence.
- Inventory documentation-level prompts and AI instructions.
- Inventory knowledge bases used by AI.

Validation:

- Every AI asset has an owner candidate.
- Every AI asset has an authority boundary.
- Every AI asset maps to a governance category.

## Phase 2 - Canonical Agent Registry

Goal:

- Standardize the agent registry model.

Actions:

- Map AI Governance and Marketplace agent metadata.
- Define canonical agent record.
- Link agent to capabilities, permissions, prompts, models, cost policy,
  evaluation policy, and audit requirements.

Validation:

- No principal agent or approved subagent is unmapped.

## Phase 3 - Prompt Registry Foundation

Goal:

- Establish prompt versioning and governance.

Actions:

- Define prompt and prompt version schema.
- Identify production-critical prompts.
- Define approval workflow.
- Define output schema validation.
- Define prompt audit requirements.

Validation:

- Prompt usage can be traced to version, actor, model, provider, and context.

## Phase 4 - Model Registry Foundation

Goal:

- Establish model registration and approval.

Actions:

- Define model registry schema.
- Define model lifecycle.
- Define model capability matrix.
- Link provider metadata to model metadata.
- Link model selection to evaluation and cost data.

Validation:

- AI Orchestrator can select by capability without exposing provider details
  to functional modules in a future implementation phase.

## Phase 5 - RAG Governance Foundation

Goal:

- Standardize governed retrieval.

Actions:

- Inventory knowledge bases.
- Define retrieval source metadata.
- Define citation packaging.
- Define rights and license filters.
- Define Need-to-Know filters.
- Define source conflict reporting.

Validation:

- AI context is traceable, cited, licensed, and scoped.

## Phase 6 - Evaluation and Benchmarking

Goal:

- Make AI quality measurable and reproducible.

Actions:

- Define datasets and dataset versioning.
- Define metrics per capability.
- Define benchmark records.
- Link human acceptance and rejection outcomes.
- Link evaluation to prompt and model approval.

Validation:

- Prompt and model changes can be evaluated before production activation.

## Phase 7 - Cost and Quota Enforcement Alignment

Goal:

- Align execution routing with cost governance.

Actions:

- Link usage to prompt and model versions.
- Link fallback events to cost records.
- Add cost delta reporting.
- Add warning and blocked action reporting.

Validation:

- AI actions are cost-aware and do not delete data when limits are reached.

## Phase 8 - AI Compliance Reporting

Goal:

- Make Framework 04 compliance visible.

Actions:

- Report registered agents.
- Report prompt coverage.
- Report model coverage.
- Report evaluation coverage.
- Report RAG source usage.
- Report cost and quota status.
- Report exceptions.

Validation:

- Release readiness includes Framework 04 status.

## Non-Goals

This plan does not authorize:

- New provider SDK integrations.
- Real AI calls.
- New database migrations.
- New API contracts.
- UI changes.
- Docker or staging changes.
- AI auto-approval.

Runtime implementation must be scheduled separately.
