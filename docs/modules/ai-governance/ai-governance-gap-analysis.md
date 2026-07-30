# AI Governance Gap Analysis

## Executive Summary

Laborator Editura already has a meaningful AI Governance runtime foundation:
provider status metadata, OpenAI primary and Anthropic fallback metadata, AI
usage records, budgets, quotas, cost policies, override requests, agent
governance profiles, and cost audit events.

The platform does not yet have the complete Module 21 architecture for model
registry, prompt registry, model lifecycle management, prompt approval,
evaluation, benchmarking, Responsible AI risk management, explainability
records, and full policy validation across all AI requests.

The main risk is future fragmentation: without Module 21, modules could
gradually introduce unmanaged prompts, provider assumptions, model choices, or
AI outputs that cannot be reproduced or audited. The migration must centralize
registries and policy checks while preserving existing AI Governance and AI
Orchestration behavior.

## Current Model Inventory

Current explicit provider/model metadata:

- OpenAI is modeled as primary provider metadata.
- Anthropic is modeled as fallback provider metadata.
- Provider records contain supported models and default model metadata.
- Usage records contain provider and model metadata.

No direct external provider SDK integration was identified in the existing
baseline documentation and source inspection.

Gaps:

- No runtime model registry.
- No explicit model lifecycle states.
- No model approval workflow.
- No model deprecation and retirement workflow.
- No model capability matrix.

## Current AI Agent Inventory

Current principal agents:

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

Current specialized subagents:

- Terminology and Lexicography Subagent.
- Semantic Fidelity Subagent.
- Editorial Decision Subagent.
- Planning and Coordination Subagent.
- Media Localization Subagent.
- Platform Engineering Subagent.

Gaps:

- Agent registry is static source metadata.
- No runtime agent lifecycle management.
- No agent-to-model assignment records.
- No agent-to-prompt assignment records.
- No agent benchmark history.

## Current Prompt Management Review

Current foundations:

- AI Orchestration documents prompt building and prompt version resolution.
- `docs/ai/prompt-management.md` exists.
- Some AI-adjacent modules preserve evidence and advisory behavior.

Gaps:

- No runtime prompt registry.
- No prompt version persistence.
- No prompt approval workflow.
- No prompt benchmark records.
- No prompt retention governance.

## AI Policy Analysis

Current foundations:

- Cost policies, budgets, quotas, warning thresholds, override requests, and
  provider fallback status are implemented.
- Enterprise Policy Engine and Security Governance provide broader policy
  foundations.

Gaps:

- No comprehensive AI policy engine.
- No model allowlist or denylist policy.
- No prompt allowlist or denylist policy.
- No data classification policy specific to AI requests.
- No autonomy level enforcement.
- No prompt and response retention enforcement.

## Evaluation and Benchmarking Assessment

Current foundations:

- AI usage, cost, provider, and status records can feed evaluation.
- Observability agent executions capture duration and status.
- Analytics can later consume AI evaluation KPIs.

Gaps:

- No model evaluation engine.
- No benchmark engine.
- No evaluation dataset registry.
- No reproducible benchmark snapshots.
- No model quality score history.

## Explainability Review

Current foundations:

- AI Orchestration documentation requires prompt version, context version,
  model route, validation report, cost, and audit references.
- Several modules preserve evidence sources and human final authority flags.

Gaps:

- No central explainability record.
- No universal AI execution ID linking all evidence.
- No prompt and context snapshot persistence.
- No explainability completeness validation.

## Cost Analysis

Current strengths:

- AI usage records exist.
- Budgets, quotas, policies, and override requests exist.
- Cost summary exists.
- Warning and exceeded budget audit actions exist.
- AI cannot approve its own budget increase.

Gaps:

- Cost data is not yet linked to model evaluation and benchmarking.
- Actual provider billing reconciliation is not implemented.
- Media-specific consumption units are metadata, not full runtime accounting.

## Security Review

Current strengths:

- Authenticated server-derived request context is the foundation.
- Provider status and AI usage endpoints are authenticated.
- Audit events exist for cost and provider governance.
- AI agent limits preserve Human Final Authority.

Gaps:

- No model/prompt registry permission model yet.
- No prompt content sensitivity policy.
- No AI-specific data classification enforcement in runtime requests.
- No centralized explainability access policy.

## Identified Risks

High:

- Future modules could introduce unmanaged prompts or model choices if Module
  21 registries are not implemented before new provider integration.
- AI results may become hard to reproduce without prompt and context version
  persistence.
- Model changes may affect output quality without benchmark history.

Medium:

- Provider fallback may alter cost and quality without model-level evaluation.
- Agent definitions are static and not lifecycle-managed.
- AI policy scope is currently cost-focused.

Low:

- Current direct provider coupling risk is low because no direct provider SDK
  integration was identified.

## Prioritized Risk Register

P0:

- Formalize AI Governance as mandatory for all models, prompts, providers,
  agents, and AI policies.
- Preserve existing `/ai-governance/*` APIs.

P1:

- Add model registry.
- Add prompt registry.
- Add policy validation contracts.
- Add model/prompt/version references to AI execution records.

P2:

- Add model evaluation and benchmark records.
- Add explainability records.
- Connect Analytics to AI evaluation KPIs.

P3:

- Add Responsible AI risk register.
- Add lifecycle management and deprecation workflows.
- Add provider-independent model routing enforcement.

## Incremental Migration Plan

1. Preserve current AI Governance runtime behavior.
2. Document model, prompt, agent, policy, evaluation, cost, explainability, and
   event contracts.
3. Add registries incrementally without removing existing provider, cost, and
   agent metadata.
4. Connect AI Orchestration policy validation to registries.
5. Add explainability and reproducibility evidence for every AI execution.
6. Add evaluation and benchmark history.
7. Add Analytics integration for AI governance KPIs.

No Docker, staging, frontend, or source module behavior change is authorized
by this baseline audit.
