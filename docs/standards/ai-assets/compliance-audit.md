# Canonical AI Assets, Prompt and Model Baseline Audit

## Purpose

This audit inventories the current repository baseline against Standard 04:
Canonical AI Assets, Prompt and Model.

It is a documentation and governance audit. It does not change runtime AI
behavior, providers, prompt execution, model routing, RAG indexing, APIs,
database schema, Docker, or UI behavior.

## Audit Date

2026-07-31.

## Baseline Inventory

| Area | Current count or evidence |
| --- | --- |
| AI architecture documents | 8 documents under `docs/ai` |
| AI Engineering framework documents | 9 documents under `docs/frameworks/ai-engineering` |
| AI Governance module documents | 13 documents under `docs/modules/ai-governance` |
| AI Orchestration module documents | 12 documents under `docs/modules/ai-orchestration` |
| AI Governance runtime module | `apps/api/src/modules/ai-governance` |
| Marketplace agent metadata module | `apps/api/src/modules/marketplace` |
| Observability agent execution metadata module | `apps/api/src/modules/observability` |
| Editorial decision advisory module | `apps/api/src/modules/editorial-decisions` |
| Canonical standards before Standard 04 | Standard 01, Standard 02, and Standard 03 |
| Canonical standards after Standard 04 | Standard 01, Standard 02, Standard 03, and Standard 04 |

## AI Asset Inventory Summary

Current AI-related asset families include:

- Principal AI agents.
- Specialized subagents.
- AI provider metadata.
- AI provider fallback metadata.
- AI usage records.
- AI budgets.
- AI quotas.
- AI cost policies.
- AI budget override requests.
- Marketplace agent metadata.
- Marketplace extension metadata.
- Observability agent execution records.
- Editorial decision recommendations.
- Lexicographic evidence.
- Terminology dictionary evidence.
- Semantic fidelity references.
- AI governance documentation.
- AI orchestration documentation.
- Prompt management documentation.
- Model registry documentation.
- RAG architecture documentation.

## Prompt Validation Summary

Current strengths:

- Prompt management direction is documented in `docs/ai/prompt-management.md`.
- Prompt registry requirements are documented in AI Engineering and AI
  Governance documentation.
- AI Orchestration documents prompt building and prompt version resolution.
- Functional modules are instructed not to embed production prompts directly.

Current gaps:

- No complete runtime Prompt Registry exists.
- No prompt version persistence exists.
- No prompt approval workflow exists.
- No prompt evaluation records exist.
- No prompt-to-agent assignment registry exists.
- No prompt benchmark workflow exists.

## Model Compatibility Assessment

Current strengths:

- OpenAI is modeled as primary provider metadata.
- Anthropic is modeled as fallback provider metadata.
- AI Governance includes provider status, usage, budgets, quotas, and cost
  policies.
- No direct external provider SDK coupling was identified in the documented
  baseline.

Current gaps:

- No complete runtime Model Registry exists.
- No model lifecycle management workflow exists.
- No model approval workflow exists.
- No model capability matrix exists.
- No model-to-prompt compatibility matrix exists.
- No model evaluation engine exists.
- No production provider adapter contract is implemented yet.

## Agent Evaluation Summary

Current strengths:

- The 18 principal agents are documented.
- Specialized subagents are documented under parent agents.
- Human Final Authority is consistently documented.
- Quality Agent responsibilities and limits are documented.
- Marketplace and AI Governance foundations support agent metadata.

Current gaps:

- No complete runtime agent execution engine exists.
- Agent-to-model and agent-to-prompt assignment records are incomplete.
- Agent evaluation history is not yet centrally recorded.
- Agent readiness, cost, risk, and quality scores are not yet unified.

## RAG Analysis

Current strengths:

- RAG architecture is documented in AI Engineering.
- Integrated Linguistic Knowledge Base rules exist.
- Source authority and license governance are documented.
- Need-to-Know and data minimization are established platform rules.

Current gaps:

- No runtime RAG Engine exists.
- No central RAG collection registry exists.
- No embedding store is implemented.
- No unified citation packaging for AI prompts is implemented.
- No RAG evaluation dataset exists.

## AI Policy Review

Current strengths:

- AI Governance, Policy Engine, Security Governance, Need-to-Know, and Cost
  Governance foundations exist.
- AI cannot approve, publish, grant rights, grant access, modify security, or
  change governance.
- Cost policy, budget, quota, override, provider fallback, and audit
  foundations exist.

Current gaps:

- No AI asset policy matrix exists across prompts, models, agents, RAG, and
  workflows.
- No prompt allowlist or denylist policy is centrally enforced.
- No model allowlist or denylist policy is centrally enforced.
- No RAG source allowlist or denylist policy is centrally enforced.
- No unified Responsible AI risk register exists.

## Duplicate Asset Risks

Potential duplicate or overlapping AI asset definitions exist across:

- `docs/ai`.
- `docs/frameworks/ai-engineering`.
- `docs/modules/ai-governance`.
- `docs/modules/ai-orchestration`.
- `AGENTS.md`.
- Marketplace agent metadata.
- Observability agent execution metadata.
- Policy Engine records.

Standard 04 becomes the canonical owner for AI asset structure and governance.
Existing documents remain local registries, module contracts, catalogs,
implementation guidance, or framework guidance and must reference Standard 04
instead of creating conflicting asset models.

## Compliance Classification

| Compliance area | Status | Notes |
| --- | --- | --- |
| AI asset model | Partially compliant | Strong documentation exists; canonical model now added |
| Prompt governance | Partially compliant | Documentation exists; runtime registry missing |
| Model governance | Partially compliant | Provider metadata exists; model registry missing |
| Agent governance | Partially compliant | Agents documented; runtime assignment registry incomplete |
| RAG governance | Partially compliant | Architecture exists; runtime RAG missing |
| Evaluation | Partially compliant | Evaluation rules exist; runtime evaluation engine missing |
| Cost governance | Mostly compliant baseline | Runtime cost metadata foundations exist |
| Human Final Authority | Compliant baseline | Strongly represented across governance docs |
| Direct provider coupling | Compliant baseline | No direct provider SDK coupling identified in documentation |

## Immediate Standardization Priorities

1. Treat Standard 04 as canonical owner for AI asset rules.
2. Preserve existing AI Governance, AI Orchestration, Marketplace,
   Observability, Policy, and Cost Governance behavior.
3. Build an AI asset inventory mapped to owner, version, status, lifecycle,
   dependencies, policies, prompts, models, RAG collections, evaluations, and
   audit records.
4. Define prompt, model, agent, RAG, evaluation, and policy registries before
   connecting real providers or production prompt execution.
5. Add compatibility and reproducibility metadata for every production AI
   execution when runtime execution is approved.

