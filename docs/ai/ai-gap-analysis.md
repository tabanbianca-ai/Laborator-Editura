# AI Architecture Gap Analysis

## Purpose

This document compares the current repository baseline with the official AI
and integration architecture defined in Chapter 7.

## Summary

The repository already contains useful AI governance, cost, marketplace,
observability, gateway, and agent metadata foundations. It does not yet contain
a complete provider-agnostic AI Orchestration Service, Capability Router,
provider adapter layer, or central prompt registry.

No direct backend AI provider SDK coupling was identified during the baseline
inspection. This is positive because the future orchestration layer can be
introduced before real provider integrations are added.

## Current Strengths

- AI Governance models provider statuses, primary/fallback provider metadata,
  usage records, budgets, quotas, cost policies, override requests, and audit.
- OpenAI primary and Anthropic fallback are represented as governance metadata.
- Marketplace models AI agents and extensions as registry metadata.
- Observability models metrics, logs, traces, and agent execution records.
- Gateway models integration providers, API keys, webhooks, and audit.
- AI agent governance profiles and subagent boundaries are documented in code
  and governance reports.
- Current provider references are metadata-oriented rather than direct provider
  calls.
- Existing contract tests explicitly guard against accidental external provider
  calls in several modules.

## Gaps

### AI Orchestration Service

Gap:

- No complete central orchestration service currently owns AI execution.

Required future alignment:

- Add a dedicated orchestration layer that every AI-enabled module uses.

### Capability Router

Gap:

- No centralized capability-to-provider routing runtime was identified.

Required future alignment:

- Implement provider-independent capability routing with versioned policies.

### Provider Adapters

Gap:

- No provider adapter contract or concrete adapter runtime was identified.

Required future alignment:

- Add adapters for approved providers without changing functional modules.

### Prompt Management

Gap:

- No central runtime prompt registry was identified.
- AI-related instructions currently exist in documentation and governance
  metadata.

Required future alignment:

- Move production prompts into a versioned prompt management system.

### Context Management

Gap:

- No central context assembly service was identified for AI execution.

Required future alignment:

- Build context centrally using permissions, Need-to-Know access, language
  policy, terminology, Translation Memory, rights, and project metadata.

### Security and Privacy Filtering

Gap:

- Existing security foundations exist, but there is no AI-specific sensitive
  data filtering pipeline.

Required future alignment:

- Add AI request filtering before any external provider receives context.

### AI Execution Observability

Gap:

- Observability foundations exist, but AI execution is not yet connected to a
  complete orchestration telemetry pipeline.

Required future alignment:

- Link AI executions to metrics, logs, traces, costs, prompts, providers, and
  approval states.

### Runtime Cost Enforcement

Gap:

- AI cost governance exists as metadata and policy support, but no real
  provider execution pipeline exists where costs can be enforced against live
  provider calls.

Required future alignment:

- Enforce budgets and quotas inside orchestration before provider execution.

## Direct Provider Coupling Finding

The inspected source did not show direct backend imports or calls for provider
SDKs such as OpenAI, Anthropic, Google AI, ElevenLabs, Azure AI, or Ollama.

Future provider implementation must preserve this property by introducing
providers only through adapters.

## Risk Assessment

Current risk: Medium.

Reason:

- Direct provider coupling is currently low.
- The platform has governance foundations.
- The complete orchestration runtime is not yet implemented, so future AI
  provider work could accidentally bypass the intended architecture if Chapter
  7 is not enforced.

## Recommended Priority

Before any real AI provider connection is added, implement:

1. AI Orchestration Service contracts.
2. Capability Catalog runtime types.
3. Provider Adapter contract.
4. Prompt registry model.
5. Context filtering policy.
6. AI execution audit and observability wiring.

Do not connect external providers before these boundaries exist.
