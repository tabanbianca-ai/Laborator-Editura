# AI Model Registry

## Purpose

The Model Registry is the authoritative catalog of AI models allowed in
Laborator Editura.

No model may be used by platform modules unless it is registered, evaluated,
approved where required, and governed by policy.

## Governed Model Categories

The registry must support:

- LLM.
- OCR.
- Speech-to-Text.
- Text-to-Speech.
- Image Generation.
- Image Recognition.
- Embeddings.
- Translation Models.
- Classification Models.
- Summarization Models.

## Model Record

Each model must include:

- `modelId`.
- `provider`.
- `modelName`.
- `modelVersion`.
- `capabilities`.
- `supportedLanguages`.
- `supportedModalities`.
- `deploymentStatus`.
- `owner`.
- `approvalStatus`.
- `lifecycleState`.
- `riskProfile`.
- `costProfile`.
- `privacyProfile`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

## Lifecycle

Supported lifecycle states:

- `CANDIDATE`.
- `EVALUATION`.
- `APPROVED`.
- `ACTIVE`.
- `DEPRECATED`.
- `RETIRED`.

Lifecycle rules:

- New models start as `CANDIDATE`.
- Models require evaluation before approval.
- Approved models may become active through authorized configuration.
- Deprecated models may remain available for historical reproducibility.
- Retired models must not be selected for new executions.
- Historical records must preserve the model version used.

## Provider Independence

Model records must not force functional modules to know provider-specific API
details.

Functional modules request capabilities. AI Orchestration and AI Governance
resolve provider and model selection through approved policies.

## Current Repository Baseline

Current implementation:

- AI Governance stores provider status records with provider, supported
  models, default model, active flag, fallback target, and model selection
  mode.
- AI usage records store provider and model metadata.
- `docs/ai/provider-registry.md` defines provider-level architecture.

Current gaps:

- No runtime `ai_models` registry exists.
- No model lifecycle record exists.
- No model approval workflow exists.
- No explicit model capability matrix exists.
- No model deprecation and retirement audit exists.

## Audit Events

Audit:

- Model registered.
- Model approved.
- Model rejected.
- Model activated.
- Model deprecated.
- Model retired.
- Model provider changed.
- Model capability changed.

## AI Rules

AI may:

- Suggest model candidates.
- Summarize benchmark results.
- Recommend model routing changes.

AI may not:

- Approve models automatically.
- Activate models automatically.
- Hide model risks.
- Bypass policy validation.
