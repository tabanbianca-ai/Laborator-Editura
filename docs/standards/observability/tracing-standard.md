# Canonical Distributed Tracing Standard

## Purpose

This document defines canonical distributed tracing requirements for requests,
workflows, AI operations, integrations, jobs, infrastructure scripts, and
future worker processes.

## Trace Fields

Every trace must define:

- `traceId`.
- `correlationId`.
- `rootSpanId`.
- `source`.
- `environment`.
- `startedAt`.
- `endedAt` where applicable.
- `durationMs` where applicable.
- `status`.
- `metadata`.

## Span Fields

Every span must define:

- `spanId`.
- `traceId`.
- `parentSpanId` where applicable.
- `serviceName`.
- `component`.
- `operation`.
- `startedAt`.
- `endedAt` where applicable.
- `durationMs` where applicable.
- `dependencies`.
- `status`.
- `safeErrorMetadata` where applicable.
- `metadata`.

## Required Span Families

Span families should exist for:

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
- RAG retrieval.
- Export generation.
- Audio/video rendering.
- Backup and restore step.
- Integration call.
- Deployment validation step.
- Infrastructure health check.

## Propagation Rules

Tracing must follow these propagation rules:

- Trace ID is created at request, job, event, or script entry.
- Correlation ID is preserved through events, logs, metrics, and audit where
  applicable.
- Child operations reference parent spans where possible.
- Asynchronous work preserves trace context through metadata.
- External provider calls record safe provider metadata.
- Trace failures must not break business execution unless policy requires it.

## Audit Correlation

Audit records should reference:

- `correlationId`.
- `traceId`.
- Source event ID.
- Source module.
- Workflow execution ID where applicable.
- Deployment ID where applicable.

This allows investigations to connect who acted, what changed, and how the
system behaved.

## Privacy Rules

Traces must not contain:

- Raw secrets.
- Raw tokens.
- Private keys.
- Full confidential documents.
- Full prompt payloads when confidential.
- Full private notes.
- Unnecessary personal data.

Trace metadata must use safe summaries and references.

## Tracing Audit

Audit must record:

- Trace policy changed.
- Trace sampling policy changed.
- Trace export created.
- Restricted trace accessed.
- Trace collection disabled or restored.
- Trace correlation failure detected.
