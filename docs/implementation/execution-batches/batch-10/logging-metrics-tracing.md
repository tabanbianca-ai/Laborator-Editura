# Logging, Metrics, and Tracing

Status: Canonical minimum defined  
Owner: Platform Operations

## Structured Log Fields

Required fields:

- timestamp;
- severity;
- environment;
- service;
- module;
- event_name;
- correlation_id;
- trace_id;
- span_id;
- actor_id;
- organization_id;
- resource_id;
- message;
- metadata.

## Metrics

Required service metrics:

- uptime;
- request count;
- error count;
- latency;
- queue depth where applicable;
- database/runtime persistence status;
- backup status;
- build/deployment status.

Required functional metrics:

- manuscript created;
- translation saved;
- review proposal created;
- export created;
- publication gate blocked;
- backup completed;
- restore tested;
- AI execution blocked by governance.

## Tracing

Trace context must follow the critical path across public request, API, workflow, database, AI orchestration, publishing/export, and external provider boundaries.

## Current Evidence

- `packages/shared/src/structured-logging.ts` provides structured log creation and redaction.
- `packages/shared/src/operational-readiness.ts` records operational readiness contracts.
- `apps/api/src/modules/observability/` provides metadata storage for observability records.

