# AI Orchestration and Editorial Agents Module Overview

## Purpose

AI Orchestration and Editorial Agents is the seventh Phase II module
specification for Laborator Editura.

The module coordinates every artificial intelligence interaction in the
platform. It is the only approved runtime boundary through which platform
modules may request AI capabilities, build AI context, select models, execute
agents, validate AI results, monitor executions, and record audit evidence.

No functional module may communicate directly with an external AI provider.

## Scope

The module owns:

- AI task intake.
- Agent registry and agent chain coordination.
- Context building.
- Prompt building and prompt version resolution.
- Provider and model routing.
- AI execution monitoring.
- AI result validation.
- Human review handoff.
- AI execution audit.
- AI cost, quota, and usage coordination through AI Governance.

The module does not own editorial final approval, rights validation,
publication approval, permission management, or security governance. Those
responsibilities remain with their owning modules and authorized humans.

## Principles

The module follows:

- AI Gateway Pattern.
- Human in the Loop.
- Context First.
- Stateless Models.
- Centralized Orchestration.
- Explainable AI.
- Reproducible Results.
- Audit by Default.
- Need-to-Know data minimization.
- Provider independence.

## Current Repository Baseline

The repository already contains several AI-related foundations:

- `apps/ai` contains a minimal FastAPI service with a health endpoint only.
- `apps/api/src/modules/ai-governance` stores provider metadata, provider
  fallback status, budgets, quotas, cost policies, usage records, principal
  agent profiles, subagent profiles, and audit records.
- `apps/api/src/modules/marketplace` stores AI agent and extension registry
  metadata, enablement metadata, policy compliance metadata, and cost
  governance links.
- `apps/api/src/modules/observability` stores metrics, logs, traces, and
  agent execution records.
- `apps/api/src/modules/gateway` stores integration provider metadata, API
  keys, webhooks, route registry metadata, and audit records.
- `apps/api/src/modules/editorial-decisions`,
  `apps/api/src/modules/lexicographic`,
  `apps/api/src/modules/semantic-fidelity`,
  `apps/api/src/modules/terminology`, and translation modules include
  AI-adjacent recommendations, evidence, or advisory behavior.
- `docs/ai` already documents provider registry, capability catalog, prompt
  management, AI security, observability, gap analysis, and migration
  direction.

No complete `AI Orchestration Service` runtime was identified. No external AI
provider SDK integration was identified in the inspected source. Current
OpenAI and Anthropic references are governance and provider metadata, not
direct provider calls.

## Target Architecture

```text
Calling Module
  -> AI Orchestrator
  -> Context Builder
  -> Prompt Builder
  -> Agent Registry
  -> Model Router
  -> Provider Adapter
  -> External AI Provider
  -> Normalized Response
  -> Validation Engine
  -> Human Review when required
  -> Audit + Observability + Cost Tracking
  -> Calling Module
```

Functional modules request capabilities. They do not select provider SDKs,
construct unrestricted prompts, read secrets, or consume provider-specific
response formats.

## Editorial Agent Baseline

The current AI governance profile model defines the following principal
agents:

1. Coordinator Agent.
2. Projects Agent.
3. Manuscripts Agent.
4. Documentation Agent.
5. Translation Agent.
6. Review Agent.
7. Layout Agent.
8. Publishing Agent.
9. Distribution Agent.
10. Library Agent.
11. Rights and Provenance Agent.
12. Illustration Agent.
13. Audio Agent.
14. Video Agent.
15. Magazine Agent.
16. Administration Agent.
17. Evolution Agent.
18. Quality Agent.

Current specialized subagents are:

- Terminology and Lexicography Subagent.
- Semantic Fidelity Subagent.
- Editorial Decision Subagent.
- Planning and Coordination Subagent.
- Media Localization Subagent.
- Platform Engineering Subagent.

## Module Boundary

AI Orchestration integrates with:

- Library.
- Translation.
- Editorial Review.
- Publishing.
- Rights and Provenance.
- Magazine.
- Workflow Engine.
- Audit.
- Notifications.
- Observability.
- AI Governance.
- Marketplace.
- Gateway.

It must not duplicate those modules. It coordinates their AI requests through
public contracts only.

## Acceptance Criteria

The module is aligned when:

- Every AI request is routed through the AI Orchestrator.
- No module communicates directly with an AI provider.
- Agents are registered, reusable, versioned, and auditable.
- Context is built only from authorized sources.
- Prompt versions are recorded for every execution.
- Model routing is provider-independent and policy-driven.
- AI outputs are validated before use.
- Human final authority is preserved.
- Executions record model, token, cost, duration, result, errors, and audit
  references.

## Related Documents

- `docs/ARCHITECTURE_CHAPTER_7.md`.
- `docs/ai/ai-architecture.md`.
- `docs/ai/provider-registry.md`.
- `docs/ai/capability-catalog.md`.
- `docs/ai/prompt-management.md`.
- `docs/ai/ai-security.md`.
- `docs/ai/ai-observability.md`.
- `docs/modules/ai-orchestration/domain-model.md`.
- `docs/modules/ai-orchestration/ai-gap-analysis.md`.
- `docs/modules/ai-orchestration/ai-migration-plan.md`.

