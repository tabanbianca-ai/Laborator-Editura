# Observability Distributed Tracing

## Purpose

Distributed tracing reconstructs the execution path of a request, workflow,
AI operation, notification, export, render job, or infrastructure process.

Every request should receive a trace ID and correlation ID that can be
propagated across modules and future workers.

## Trace Requirements

Each trace should include:

- `traceId`.
- `correlationId`.
- Root span.
- Child spans.
- Service names.
- Module names.
- Operations.
- Parent span references.
- Duration.
- Status.
- Error metadata when safe.

## Current Repository Baseline

Implemented foundations:

- Observability module stores traces with trace ID, correlation ID, span name,
  module name, duration, status, parent span placeholder, metadata, and
  timestamp.
- Gateway route registry metadata requires correlation IDs and tracing.
- AI observability documentation defines AI trace spans.

Current gaps:

- Trace ID generation and propagation are not standardized across every
  request.
- Background workers and queues are not fully implemented yet.
- Cross-module trace context is not consistently attached to audit records.
- External tracing backend is not connected.

## Required Span Families

Spans should exist for:

- Request authentication.
- Authorization decision.
- Controller handling.
- Service execution.
- Repository access.
- Workflow transition.
- Rule evaluation.
- Task creation.
- Notification rendering.
- Notification delivery.
- AI context assembly.
- AI provider execution.
- Export generation.
- Audio/video rendering.
- Backup/restore step.
- Integration call.

## Propagation Rules

- Trace ID must be created at request or job entry.
- Correlation ID must be preserved through events and audit.
- Child operations must reference parent span where possible.
- Sensitive payloads must not be stored in traces.
- Trace failures must not break business execution unless policy requires it.

## Audit Correlation

Audit records should reference:

- `correlationId`.
- `traceId`.
- Source event ID.
- Source module.

This allows investigations to connect who acted, what changed, and how the
system behaved.
