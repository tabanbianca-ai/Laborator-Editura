# Backend Observability

## Purpose

Backend observability explains runtime behavior through health checks, logs,
metrics, traces, audit correlation, and operational diagnostics.

## Required Signals

The backend must expose or record:

- Liveness.
- Readiness.
- Dependency health.
- Request counts.
- Error counts.
- Latency.
- Runtime database status.
- Cache status.
- Queue and job status.
- Integration status.
- AI usage and cost metadata.
- Module health.
- Correlation IDs.

## Current Baseline

Current observability foundations include:

- `GET /health` with minimal public response.
- `observability` module endpoints for health, metrics, logs, traces, and
  agent executions.
- `platform-engineering` health and diagnostics planning endpoints.
- `gateway` health, route registry, and module registry metadata.
- Runtime database state for observability records.
- Module audit events across most state-changing foundations.
- Staging validation and infrastructure validation scripts in the repository.

## Required Logging Standard

Structured logs should include:

- `timestamp`.
- `level`.
- `service`.
- `module`.
- `operation`.
- `requestId`.
- `correlationId`.
- `userId`.
- `workspaceId`.
- `result`.
- `duration`.

Logs must not contain secrets, tokens, full confidential content, or
unnecessary personal data.

## Current Gaps

- Correlation ID propagation is not yet standardized across all requests,
  events, and future jobs.
- Metrics are metadata-backed but not yet connected to a production metrics
  exporter.
- Health checks are not yet split into formal liveness, readiness, and
  dependency endpoints.
- Central structured logging middleware is not yet documented as implemented.

## Acceptance Criteria

- Health checks are safe and minimal.
- Operational diagnostics are available without exposing sensitive data.
- Audit and observability remain separate but correlatable.
- Future jobs and integrations carry correlation IDs.
