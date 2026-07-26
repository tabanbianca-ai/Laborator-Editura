# AI Orchestration Gap Analysis

## Purpose

This document compares the current repository baseline with the official AI
Orchestration and Editorial Agents Module specification.

## Summary

The repository has strong AI governance, provider metadata, agent profiles,
marketplace metadata, observability records, cost controls, and deterministic
agent workflow tests.

The repository does not yet contain a complete central AI Orchestrator runtime
that owns AI task intake, context building, prompt building, model routing,
provider execution, output validation, event emission, and human review
handoff.

## Gap Table

| Area | Current baseline | Required target | Risk |
| --- | --- | --- | --- |
| AI task lifecycle | Not centralized | `AITask` lifecycle through `/ai/tasks` | High |
| Agent registry | Governance profiles and Marketplace metadata exist | Canonical execution registry linked to orchestration | Medium |
| Agent chains | Deterministic tests and governance only | Runtime chain execution with step audit | High |
| Context builder | Source modules exist; no central builder | Versioned context packages with Need-to-Know filtering | High |
| Prompt builder | Prompt governance docs exist | Runtime prompt registry and preview | High |
| Model router | Provider metadata exists | Runtime route selection and fallback | High |
| Provider adapters | Not implemented | Provider-agnostic adapter contract | High |
| Validation engine | Domain validators exist | Central AI output validation report | Medium |
| Observability | Agent execution records exist | Full traces for orchestration steps | Medium |
| Events | AI-adjacent audits exist | Official orchestration event stream | Medium |
| API | Governance endpoints exist | `/ai/tasks`, `/ai/agents`, `/ai/context`, `/ai/prompts` | High |
| Security | Auth/RBAC/Need-to-Know foundation exists | AI-specific context enforcement in runtime | High |
| Cost control | AI Governance exists | Pre-execution router enforcement | Medium |

## Current Strengths

- No direct provider SDK coupling was identified.
- OpenAI primary and Anthropic fallback are represented as governance
  metadata.
- Agent profiles include mission, responsibilities, limits, collaboration, and
  authority.
- Human Final Authority restrictions are explicit.
- Cost governance supports budgets, quotas, warning thresholds, and
  Platform Creator unrestricted access.
- Observability can store agent execution records.
- Marketplace can store agent and extension metadata.
- Functional workflow tests cover principal agents and subagents.

## Key Risks

### Direct Provider Drift

Risk:

- Future module work could accidentally call providers directly before an
  orchestrator exists.

Mitigation:

- Require all provider SDK work to happen only behind AI Orchestration
  contracts.

### Context Leakage

Risk:

- Without a central Context Builder, modules may include excessive or
  unauthorized context.

Mitigation:

- Implement context package generation before external provider execution.

### Prompt Duplication

Risk:

- Production prompts may become embedded in module code.

Mitigation:

- Add prompt registry and prompt preview before production AI execution.

### Cost Overrun

Risk:

- Provider execution without pre-flight budget and quota checks can exceed
  organizational limits.

Mitigation:

- Model Router must consult AI Governance before execution.

### Non-Reproducible Results

Risk:

- AI decisions cannot be reproduced without prompt version, context hash,
  model version, routing policy, and validation report.

Mitigation:

- Record these references in every execution record and audit event.

## Acceptance Gaps

The module is not complete until:

- Every AI request routes through AI Orchestrator.
- Context and prompts are versioned and auditable.
- Agents are executable through a central registry.
- Model selection is policy-driven.
- External provider adapters are replaceable.
- AI outputs are validated before module handoff.
- Human review remains mandatory for approvals.
- Observability includes complete task traces.

