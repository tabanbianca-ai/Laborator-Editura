# Canonical AI Assets, Prompt and Model Migration Plan

## Purpose

This migration plan defines the safe path for aligning all AI agents, prompts,
models, embedding models, RAG collections, knowledge bases, evaluation
datasets, AI workflows, and AI policies with Standard 04.

It is incremental and governance-first. It does not authorize external
provider SDK integrations, real AI calls, runtime prompt persistence, runtime
model registry persistence, runtime RAG indexing, database migrations, Docker
changes, UI changes, or breaking API changes by itself.

## Phase 1 - Activate the Standard

Deliverables:

- Reference Standard 04 from `SPEC.md`.
- Reference Standard 04 from `ROADMAP.md`.
- Add Standard 04 directive to `AGENTS.md`.
- Add Standard 04 to the Manifest and Codex catalog.
- Preserve existing AI Governance and AI Orchestration behavior.

Acceptance criteria:

- Standard 04 is discoverable as the canonical AI asset standard.
- Existing AI documents remain valid as local registries and implementation
  guidance.
- No runtime changes are introduced.

## Phase 2 - AI Asset Inventory

Deliverables:

- Inventory all documented AI agents.
- Inventory all provider metadata.
- Inventory all prompt management documents.
- Inventory all model registry documents.
- Inventory all RAG and knowledge base references.
- Inventory all AI policies, evaluations, usage records, cost policies, and
  observability records.
- Map every asset to owner, lifecycle, version, dependencies, permissions, and
  audit requirements.

Acceptance criteria:

- Every AI asset family has an owner.
- Duplicate or overlapping AI asset definitions are mapped to the canonical
  asset model.

## Phase 3 - Prompt Registry Design

Deliverables:

- Define prompt template schema.
- Define prompt version schema.
- Define system prompt schema.
- Define prompt input and output schema rules.
- Define prompt approval workflow metadata.
- Define prompt evaluation requirements.
- Define prompt-to-agent and prompt-to-model compatibility records.

Acceptance criteria:

- Production-critical prompts cannot become active without version,
  evaluation, and authorized human approval metadata.

## Phase 4 - Model Registry Design

Deliverables:

- Define model registry schema.
- Define embedding model registry schema.
- Define provider-to-model compatibility metadata.
- Define model lifecycle.
- Define model capability matrix.
- Define model evaluation records.
- Define model deprecation and retirement rules.

Acceptance criteria:

- AI Orchestration can select by capability without exposing provider-specific
  implementation details to functional modules.

## Phase 5 - Agent Registry Alignment

Deliverables:

- Map principal agents to canonical agent records.
- Map specialized subagents to parent agents.
- Define agent permissions.
- Define allowed models and prompt versions.
- Define accessible knowledge bases.
- Define escalation and human approval requirements.
- Define agent evaluation records.

Acceptance criteria:

- Agents cannot expand their own access.
- Agents cannot bypass Human Final Authority.
- Agent behavior is reproducible from recorded prompt, model, policy, and
  context versions.

## Phase 6 - RAG Governance Foundation

Deliverables:

- Define RAG collection schema.
- Define knowledge base schema.
- Define source and license metadata rules.
- Define chunking strategy metadata.
- Define embedding model metadata.
- Define access policy.
- Define RAG evaluation metadata.

Acceptance criteria:

- RAG sources are license-aware, citation-aware, access-controlled, and
  auditable before runtime indexing is implemented.

## Phase 7 - Evaluation and Reproducibility

Deliverables:

- Define evaluation dataset records.
- Define prompt evaluation records.
- Define model evaluation records.
- Define agent evaluation records.
- Define RAG evaluation records.
- Define AI execution lineage metadata.
- Link evaluation results to approval decisions.

Acceptance criteria:

- AI outputs can be traced to prompt version, model version, provider,
  context version, RAG sources, policy versions, cost metadata, actor,
  organization, and audit records where applicable.

## Phase 8 - Continuous Compliance

Deliverables:

- Add repository checks for unmanaged AI asset documents.
- Add review checklist for prompt, model, agent, RAG, policy, and evaluation
  changes.
- Add release readiness checks before provider runtime integration.
- Require architecture exceptions for unmanaged AI assets.

Acceptance criteria:

- New AI assets cannot bypass Standard 04.
- Exceptions require explicit architecture approval.
- Documentation remains the source of truth until runtime registries are
  implemented.

## Non-Goals

This plan does not implement:

- External provider SDK integrations.
- Real provider calls.
- Runtime prompt registry.
- Runtime model registry.
- Runtime RAG indexing.
- Runtime evaluation engine.
- Database migrations.
- UI changes.
- Docker or staging changes.

