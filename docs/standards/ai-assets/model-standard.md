# Model Standard

## Purpose

This document defines the canonical model metadata, lifecycle, compatibility,
evaluation, cost, and audit rules for AI models and embedding models.

## Required Model Fields

Every AI model record must define:

- `uuid`.
- `provider`.
- `modelIdentifier`.
- `modelVersion`.
- `modelFamily`.
- `contextWindow`.
- `tokenLimits`.
- `costProfile`.
- `latencyProfile`.
- `supportedLanguages`.
- `supportedModalities`.
- `compatibilityMatrix`.
- `capabilities`.
- `limitations`.
- `safetyProfile`.
- `evaluationResults`.
- `owner`.
- `lifecycleState`.
- `approvalStatus`.
- `auditInformation`.

## Model Families

Canonical model families:

- `LLM`.
- `MULTIMODAL`.
- `EMBEDDING`.
- `OCR`.
- `SPEECH_TO_TEXT`.
- `TEXT_TO_SPEECH`.
- `IMAGE_GENERATION`.
- `IMAGE_RECOGNITION`.
- `TRANSLATION`.
- `CLASSIFICATION`.
- `SUMMARIZATION`.

## Provider Independence

Functional modules must request capabilities, not provider SDK methods or
provider-specific payload shapes.

The AI Orchestration and AI Governance layers own provider selection, model
selection, fallback, cost governance, and policy checks.

## Model Metadata

Model records must preserve:

- Provider.
- Provider role.
- Model identifier.
- Model version.
- Supported modalities.
- Supported languages.
- Context window.
- Input token limit.
- Output token limit.
- Pricing metadata where available.
- Latency profile where available.
- Region or data residency metadata where applicable.
- Safety constraints.
- Deprecation status.

## Compatibility Matrix

Every governed model must define compatibility with:

- Prompt versions.
- Agent versions.
- AI workflow versions.
- Output schemas.
- RAG collections.
- Tool use capabilities.
- Cost policies.
- Safety policies.
- Tenant restrictions where applicable.

## Evaluation

Model evaluation should include:

- Accuracy.
- Precision.
- Recall.
- Hallucination rate.
- Response consistency.
- Latency.
- Cost.
- Safety score.
- Human review score.
- Regression status against prior model version.

Model promotion requires evaluation evidence and authorized human approval for
production-critical use.

## Lifecycle

Canonical lifecycle:

- `DRAFT`.
- `UNDER_REVIEW`.
- `APPROVED`.
- `ACTIVE`.
- `SUSPENDED`.
- `DEPRECATED`.
- `RETIRED`.

Deprecated models must keep compatibility records until all active consumers
are migrated.

## Audit

Audit must record:

- Model registered.
- Model evaluated.
- Model approved.
- Model activated.
- Model suspended.
- Model deprecated.
- Model retired.
- Compatibility changed.
- Provider fallback activated.
- Provider fallback recovered.
- Model exception approved.

## Current Baseline

OpenAI is documented as primary provider metadata and Anthropic as fallback
provider metadata. Current runtime foundations include provider status, usage,
budget, quota, and cost policy records. A complete runtime model registry,
model approval workflow, model evaluation engine, and provider adapter layer
are not yet implemented.

