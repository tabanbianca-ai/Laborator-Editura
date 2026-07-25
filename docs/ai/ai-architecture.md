# AI Architecture Baseline

## Purpose

This document records the baseline audit and target architecture for AI
integration in Laborator Editura.

It supports `docs/ARCHITECTURE_CHAPTER_7.md` and must be used before any
future implementation of provider adapters, AI orchestration runtime behavior,
or provider-specific integrations.

## Current Repository Baseline

The current repository contains AI-related governance and metadata foundations,
but it does not contain a complete AI Orchestration Service.

Observed implementation areas:

- `apps/ai` contains a minimal AI service with a health endpoint only.
- `apps/api/src/modules/ai-governance` stores AI provider status metadata,
  usage records, budgets, quotas, cost policies, provider fallback metadata,
  agent governance profiles, and audit records.
- `apps/api/src/modules/marketplace` stores AI agent and extension registry
  metadata.
- `apps/api/src/modules/observability` stores metrics, logs, traces, and agent
  execution metadata.
- `apps/api/src/modules/gateway` stores API keys, integration provider
  metadata, webhook metadata, and audit records.
- `apps/api/src/modules/editorial-decisions`, `semantic-fidelity`,
  `lexicographic`, `terminology`, `translations`, and related modules include
  AI-adjacent advisory behavior and evidence metadata.

No external provider SDK integration was identified in the inspected API, AI
service, or shared package source. The current code references OpenAI and
Anthropic as provider governance metadata, not as direct runtime SDK calls.

## Current Direct Provider Coupling

Baseline search did not identify direct backend calls to provider SDKs such as
OpenAI, Anthropic, Google AI, ElevenLabs, Azure AI, or Ollama.

The main external request usage identified in application source is the web
frontend API client calling the platform API, which is not an AI provider
integration.

This means current direct provider coupling risk is low, but future provider
work must be routed through a dedicated orchestration layer from the first
implementation.

## Target Architecture

All AI-enabled modules must use the following flow:

```text
Module
  -> AI Orchestration Service
  -> Capability Router
  -> Provider Adapter
  -> External Provider
  -> Normalized AI Response
  -> Audit + Versioning + Approval
  -> Module
```

The module asks for a capability. It does not select provider SDKs or consume
provider-specific response shapes directly.

## AI Orchestration Responsibilities

The orchestration layer owns:

- Request intake.
- Context assembly.
- Permission and Need-to-Know checks.
- Sensitive data filtering.
- Prompt lookup and prompt version selection.
- Capability routing.
- Provider and model selection.
- Cost and quota checks.
- Retry and fallback handling.
- Provider error normalization.
- Response normalization.
- Audit event creation.
- Version references.
- Observability records.
- Human approval metadata.

## Module Responsibilities

Functional modules own domain decisions.

Modules may:

- Request AI assistance.
- Supply domain references to the orchestration layer.
- Display normalized AI recommendations.
- Accept or reject normalized results through authorized human workflows.

Modules may not:

- Call provider SDKs directly.
- Store provider credentials.
- Hardcode production prompts.
- Trust AI output as final approval.
- Bypass domain rules or workflow gates.

## Existing Foundations to Reuse

Future implementation should reuse:

- AI Governance for provider status, budgets, quotas, usage, and audit.
- Observability for metrics, logs, traces, and agent execution visibility.
- Marketplace for registered agents and extension metadata.
- Gateway for integration metadata where applicable.
- Audit infrastructure for AI execution and approval records.
- Need-to-Know access model for context minimization.
- Policy Engine for compliance checks.

## Non-Goals for This Baseline

This document does not implement:

- Provider SDK adapters.
- Real AI calls.
- Prompt registry runtime.
- Provider credential storage changes.
- New database migrations.
- API contract changes.
- UI changes.
- Docker or staging changes.
