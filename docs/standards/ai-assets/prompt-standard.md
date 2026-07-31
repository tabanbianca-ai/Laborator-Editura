# Prompt Standard

## Purpose

This document defines the canonical rules for prompt templates, system
prompts, prompt versions, prompt evaluation, prompt lifecycle, prompt
security, and prompt audit.

## Required Prompt Fields

Every prompt template or system prompt must define:

- `uuid`.
- `promptName`.
- `canonicalName`.
- `purpose`.
- `promptVersion`.
- `promptType`.
- `supportedModels`.
- `inputSchema`.
- `outputSchema`.
- `constraints`.
- `safetyRules`.
- `evaluationMetrics`.
- `owner`.
- `lifecycleState`.
- `approvalStatus`.
- `classification`.
- `auditInformation`.

## Prompt Types

Canonical prompt types:

- `SYSTEM_PROMPT`.
- `PROMPT_TEMPLATE`.
- `INSTRUCTION_PROMPT`.
- `EVALUATION_PROMPT`.
- `RAG_PROMPT`.
- `TOOL_USE_PROMPT`.
- `SAFETY_PROMPT`.

## Prompt as Code

Prompt assets must be treated as versioned artifacts:

- Prompt changes create new versions.
- Previous versions remain auditable.
- Prompt dependencies must be recorded.
- Prompt usage must reference exact prompt version.
- Prompt outputs must be validated against output schema where applicable.
- Prompt approval requires authorized human review for production-critical
  prompts.

## Input and Output Schemas

Prompt input schemas must define:

- Required input fields.
- Optional input fields.
- Accepted data types.
- Maximum input size.
- Classification constraints.
- Need-to-Know constraints.
- Language and locale constraints where applicable.

Prompt output schemas must define:

- Required output fields.
- Optional output fields.
- Structured output format.
- Error and refusal format when applicable.
- Confidence metadata where applicable.
- Evidence and citation requirements where applicable.

## Safety Rules

Every production prompt must define safety constraints for:

- Human Final Authority.
- Rights and provenance.
- Need-to-Know access.
- Tenant isolation.
- Data minimization.
- Prompt injection risk.
- Citation integrity.
- Terminology priority.
- AI non-approval rules.
- Safe error handling.

## Evaluation Metrics

Prompt evaluation should include:

- Accuracy.
- Precision.
- Recall.
- Hallucination rate.
- Response consistency.
- Schema compliance.
- Safety score.
- Latency.
- Cost.
- Human review score.

High-risk prompt versions must not become active without evaluation evidence
and authorized approval.

## Prompt Lifecycle

Canonical lifecycle:

- `DRAFT`.
- `UNDER_REVIEW`.
- `APPROVED`.
- `ACTIVE`.
- `SUSPENDED`.
- `DEPRECATED`.
- `ARCHIVED`.

Prompt versions must not be overwritten. New changes create new versions.

## Audit

Audit must record:

- Prompt created.
- Prompt version created.
- Prompt evaluated.
- Prompt approved.
- Prompt activated.
- Prompt suspended.
- Prompt deprecated.
- Prompt archived.
- Prompt dependency changed.
- Prompt exception approved.

## Current Baseline

Prompt governance is documented in `docs/ai/prompt-management.md`,
`docs/frameworks/ai-engineering/prompt-registry.md`, and
`docs/modules/ai-governance/prompt-registry.md`. A complete runtime prompt
registry and approval workflow are not yet implemented.

