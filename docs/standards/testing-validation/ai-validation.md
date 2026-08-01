# Canonical AI Validation Standard

## Purpose

This document defines mandatory validation rules for AI agents, prompts,
models, RAG behavior, editorial recommendations, cost, latency, safety, and
Human Final Authority.

## AI Validation Scope

AI validation must cover:

- Instruction compliance.
- Terminology.
- Consistency.
- Structure.
- Accuracy.
- Factual error rate.
- Safety.
- Cost.
- Latency.
- Reproducibility.
- Human intervention need.

## Evaluation Assets

Every AI agent or AI-assisted workflow must be validated using:

- Versioned evaluation sets.
- Positive examples.
- Negative examples.
- Edge cases.
- Terminology rules.
- Editorial criteria.
- Reference outputs.
- Automated evaluation.
- Human evaluation where risk requires it.

## AI Test Case Requirements

AI test cases must define:

- Agent or model under test.
- Prompt or instruction version.
- Input dataset version.
- Expected behavior.
- Prohibited behavior.
- Evaluation metric.
- Acceptance threshold.
- Human review requirement.
- Cost and latency expectations.
- Safety constraints.

## Prohibited AI Self-Validation

AI cannot definitively validate:

- Publication.
- Rights.
- Permissions.
- Legal compliance.
- Final editorial decisions.
- Security policy.
- Governance changes.
- Budget increases.

AI output remains advisory until reviewed through the applicable workflow and
approved by authorized humans where approval is required.

## AI Metrics

AI validation may measure:

- Pass/fail.
- Accuracy.
- Terminology compliance.
- Semantic fidelity.
- Hallucination or factual error rate.
- Policy compliance.
- Latency.
- Token usage.
- Estimated cost.
- Human acceptance rate.
- Regression rate.

## AI Evidence

AI validation evidence may include:

- Input references.
- Prompt version.
- Model version.
- RAG source version.
- Output.
- Evaluation result.
- Human review.
- Cost metadata.
- Trace ID.
- Audit event.

Sensitive prompt and content data must be protected according to security,
privacy, and Need-to-Know rules.

## Audit

Audit must record:

- AI validation dataset created.
- AI validation dataset versioned.
- AI evaluation executed.
- AI validation failed.
- Human review required.
- Human approval granted or rejected.
- AI regression detected.
- AI cost threshold exceeded.
