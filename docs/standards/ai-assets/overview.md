# Canonical AI Assets, Prompt and Model Standard

## Document Control

| Field | Value |
| --- | --- |
| Standard | Standard 04 |
| Identifier | STANDARD-04-AI-ASSETS |
| Version | 1.0.0 |
| Status | Active specification |
| Owner | AI Governance |
| Applies to | AI agents, prompts, models, RAG, knowledge bases, evaluations, policies |
| Related standards | Standard 01, Standard 02, Standard 03, Framework 04 |

## Purpose

This standard defines the mandatory canonical rules for designing,
identifying, documenting, versioning, evaluating, securing, auditing, and
governing all artificial intelligence assets used in Laborator Editura.

It establishes the canonical model for:

- AI agents.
- AI models.
- Embedding models.
- Prompts.
- Prompt templates.
- System prompts.
- AI workflows.
- Knowledge bases.
- RAG collections.
- AI evaluations.
- AI policies.
- AI configurations.

No AI asset may exist outside this standard unless an approved architecture
exception exists.

## Relationship to Other Standards

This standard complements:

- `docs/standards/naming-versioning/overview.md`, which defines canonical
  identity, naming, versioning, lifecycle, metadata, traceability, and audit.
- `docs/standards/data-model/overview.md`, which defines canonical data
  object shape, metadata, relationships, classification, schema evolution,
  and AI readiness.
- `docs/standards/api-governance/overview.md`, which defines API, event,
  webhook, connector, and service contract governance for AI interfaces.
- `docs/frameworks/ai-engineering/overview.md`, which defines AI engineering,
  prompt governance, model governance, RAG, evaluation, cost, safety, and
  automation governance.
- `docs/modules/ai-governance/ai-governance-overview.md`, which defines the
  AI Governance module.
- `docs/modules/ai-orchestration/ai-orchestration-overview.md`, which defines
  the AI Orchestration boundary.

## Principles

All AI assets must follow:

- Prompt as code.
- AI by governance.
- Model independence.
- Human oversight.
- Explainability by default.
- Reproducibility.
- Version first.
- Security by design.
- Cost awareness.
- Continuous evaluation.
- Minimum necessary data access.
- Human Final Authority.

## Canonical AI Asset Model

Every governed AI asset must define:

- `uuid`.
- `canonicalName`.
- `displayName`.
- `assetType`.
- `version`.
- `status`.
- `owner`.
- `lifecycleState`.
- `description`.
- `dependencies`.
- `metadata`.
- `auditInformation`.

AI assets must also preserve links to prompt versions, model versions, provider
metadata, policy versions, evaluation datasets, RAG collections, cost policy,
permissions, and audit records where applicable.

## Canonical AI Asset Types

| Asset type | Purpose | Canonical document |
| --- | --- | --- |
| `AI_AGENT` | Governed AI role or automated assistant capability | `agent-standard.md` |
| `PROMPT_TEMPLATE` | Reusable prompt template with typed inputs and outputs | `prompt-standard.md` |
| `SYSTEM_PROMPT` | System-level behavior and safety instruction set | `prompt-standard.md` |
| `AI_MODEL` | LLM, multimodal model, or task model metadata | `model-standard.md` |
| `EMBEDDING_MODEL` | Embedding model metadata and compatibility | `model-standard.md` |
| `RAG_COLLECTION` | Retrieval collection and source package | `rag-standard.md` |
| `KNOWLEDGE_BASE` | Governed knowledge source used by AI | `rag-standard.md` |
| `EVALUATION_DATASET` | Benchmark or regression evaluation dataset | `asset-catalog.md` |
| `AI_WORKFLOW` | Governed AI execution workflow | `asset-catalog.md` |
| `AI_POLICY` | AI usage, safety, access, cost, or approval rule | `asset-catalog.md` |

## Canonical Supporting Documents

1. `docs/standards/ai-assets/overview.md`.
2. `docs/standards/ai-assets/asset-catalog.md`.
3. `docs/standards/ai-assets/prompt-standard.md`.
4. `docs/standards/ai-assets/model-standard.md`.
5. `docs/standards/ai-assets/agent-standard.md`.
6. `docs/standards/ai-assets/rag-standard.md`.
7. `docs/standards/ai-assets/compliance-audit.md`.
8. `docs/standards/ai-assets/migration-plan.md`.

## Governance Boundary

AI may assist, recommend, draft, explain, summarize, evaluate, classify, and
coordinate when authorized.

AI must not:

- Approve content automatically.
- Publish automatically.
- Grant rights.
- Grant access.
- Modify security.
- Change governance.
- Approve its own budget increase.
- Hide audit history.
- Bypass workflow, policy, rights, Need-to-Know, or Human Final Authority.

## Non-Goals

This standard does not implement:

- External provider SDK integrations.
- Real AI calls.
- Runtime prompt registry persistence.
- Runtime model registry persistence.
- Runtime RAG indexing.
- Runtime evaluation engine.
- New API contracts.
- Database migrations.
- UI changes.
- Docker or staging changes.

Runtime implementation requires separately approved implementation phases.

