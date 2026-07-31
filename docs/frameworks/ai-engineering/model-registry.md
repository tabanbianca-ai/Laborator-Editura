# Model Registry

## Purpose

The Model Registry is the authoritative catalog of AI models, model versions,
provider relationships, capabilities, costs, latency, approval status, and
supported domains.

No model may be used by platform AI workflows unless it is registered,
evaluated, approved where required, and governed by policy.

## Model Independence

Functional modules request capabilities. They must not depend on:

- Provider SDKs.
- Provider-specific request formats.
- Provider-specific response formats.
- Provider-specific error shapes.
- Provider-specific model identifiers.

The AI Orchestrator resolves providers and models through the Model Registry,
Provider Registry, policy, cost, and evaluation data.

## Model Record

Each model must define:

- UUID.
- Provider.
- Model name.
- Model version.
- Capabilities.
- Supported modalities.
- Supported languages.
- Supported domains.
- Context window.
- Pricing.
- Latency profile.
- Privacy profile.
- Data residency metadata.
- Risk profile.
- Approval status.
- Lifecycle state.
- Owner.
- Created by.
- Created at.
- Updated by.
- Updated at.

## Supported Model Categories

The registry must support:

- Large language models.
- Embedding models.
- OCR models.
- Speech-to-text models.
- Text-to-speech models.
- Image generation models.
- Image recognition models.
- Translation models.
- Classification models.
- Summarization models.
- Multimedia generation models.

## Provider Baseline

Current v1.0 provider policy:

- OpenAI is the primary provider.
- Anthropic is the fallback provider.

Fallback may activate on:

- Timeout.
- Provider outage.
- Service unavailability.
- API error.
- Configured outage.

Fallback activation and recovery must be audited.

## Model Lifecycle

Lifecycle states:

- `CANDIDATE`.
- `EVALUATION`.
- `APPROVED`.
- `ACTIVE`.
- `DEPRECATED`.
- `RETIRED`.

Rules:

- New models start as `CANDIDATE`.
- Evaluation is required before approval.
- Approved models may become active through authorized configuration.
- Deprecated models may remain available for historical reproducibility.
- Retired models must not be selected for new production executions.
- Historical execution records must preserve model version used.

## Current Baseline Assessment

Strengths:

- Provider registry documentation exists.
- AI Governance stores provider status metadata.
- AI usage records store provider and model metadata.
- OpenAI primary and Anthropic fallback are documented.

Gaps:

- No runtime model registry table is complete.
- No model approval workflow is complete.
- No model capability matrix is complete.
- No benchmark-linked model selection policy exists.
- No deprecation and retirement runtime workflow exists.

## Standardization Plan

1. Treat provider status metadata as current baseline.
2. Define canonical model registry schema.
3. Map models to capabilities and approved domains.
4. Link models to evaluation results.
5. Link models to cost policies.
6. Add model deprecation and retirement audit in a future approved phase.
