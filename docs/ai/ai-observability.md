# AI Observability

## Purpose

This document defines how AI execution must be measured, traced, diagnosed,
and reported across the platform.

## Observability Records

AI observability must capture:

- Request count.
- Response time.
- Error count.
- Error type.
- Retry count.
- Fallback events.
- Circuit breaker status.
- Queue depth.
- Provider health.
- Model usage.
- Capability usage.
- Cost.
- Token or unit usage when available.
- Usage by module.
- Usage by project.
- Usage by user.
- Usage by organization.

## Logging

AI logs must be structured and must include:

- Timestamp.
- Correlation ID.
- Trace ID.
- Organization ID.
- Actor ID.
- Calling module.
- Capability.
- Provider.
- Model.
- Prompt ID.
- Prompt version.
- Status.
- Duration.
- Cost estimate.
- Error code when applicable.
- Redaction marker when content is filtered.

Logs must not include provider secrets or unrestricted sensitive content.

## Tracing

AI traces should include spans for:

- Request validation.
- Context assembly.
- Sensitive data filtering.
- Prompt resolution.
- Routing decision.
- Cost and quota check.
- Provider execution.
- Response normalization.
- Audit creation.
- Approval workflow handoff.

Traces must support investigation without exposing restricted content.

## Metrics

Required metric dimensions:

- Organization.
- Module.
- Capability.
- Provider.
- Model.
- Prompt version.
- Result status.
- Error category.
- Fallback status.

Metrics must support dashboards for:

- Operational health.
- Provider reliability.
- Capability performance.
- Cost consumption.
- Budget threshold monitoring.
- Agent execution visibility.

## Audit vs Observability

Audit records prove what happened and who authorized it.

Observability records explain how the system behaved.

Both are required. Observability does not replace audit, and audit does not
replace metrics, logs, or traces.

## Current Repository Baseline

The existing Observability module stores metrics, logs, traces, and agent
execution metadata. AI Governance stores usage, cost, provider status, budgets,
quotas, and audit events.

The missing piece is a centralized AI execution telemetry pipeline that links
orchestration requests, prompt versions, provider adapters, normalized
responses, and human approval states into these existing observability
foundations.
