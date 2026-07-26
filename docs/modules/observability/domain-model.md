# Observability Domain Model

## Purpose

This document defines the conceptual domain model for the Observability,
Monitoring and Audit Module.

The model is technology-independent and describes the telemetry entities
required for a centralized operational visibility layer.

## Aggregate Ownership

Observability owns:

- Log Entry.
- Metric.
- Trace.
- Span.
- Alert Rule.
- Alert.
- Alert Acknowledgement.
- Dashboard.
- Dashboard Panel.
- Health Check Record.
- Telemetry Retention Reference.
- Observability Audit Event.

Domain modules own their own business audit event creation. Observability owns
correlation, querying, diagnostics, operational dashboards, alerting, and
telemetry read models.

## Log Entry

Represents a structured diagnostic record.

Fields:

- `logId`.
- `organizationId`.
- `timestamp`.
- `service`.
- `module`.
- `severity`.
- `actorId`.
- `message`.
- `correlationId`.
- `traceId`.
- `requestPath`.
- `metadata`.

Severity levels:

- `TRACE`.
- `DEBUG`.
- `INFO`.
- `WARN`.
- `ERROR`.
- `FATAL`.

The current implementation uses `DEBUG`, `INFO`, `WARN`, `ERROR`, and
`CRITICAL`; future alignment should support the official severity set through
compatibility mapping.

## Metric

Represents a numeric or status signal.

Fields:

- `metricId`.
- `organizationId`.
- `name`.
- `value`.
- `unit`.
- `type`.
- `source`.
- `module`.
- `dimensions`.
- `timestamp`.

Metric types:

- `COUNTER`.
- `GAUGE`.
- `HISTOGRAM`.
- `STATUS`.

## Trace

Represents one end-to-end execution path.

Fields:

- `traceId`.
- `organizationId`.
- `correlationId`.
- `rootSpanId`.
- `status`.
- `startedAt`.
- `completedAt`.
- `durationMs`.
- `metadata`.

## Span

Represents a step within a trace.

Fields:

- `spanId`.
- `traceId`.
- `parentSpanId`.
- `service`.
- `module`.
- `operation`.
- `status`.
- `startedAt`.
- `completedAt`.
- `durationMs`.
- `metadata`.

## Audit Event Read Model

Represents a queryable, immutable view of operational and functional audit
events.

Fields:

- `auditEventId`.
- `organizationId`.
- `actorId`.
- `action`.
- `resourceType`.
- `resourceId`.
- `result`.
- `ipAddress`.
- `correlationId`.
- `traceId`.
- `createdAt`.
- `sourceAuditTable`.

Audit ownership remains with source modules. Observability may provide a
unified read model and correlation index.

## Alert Rule

Represents a configurable alert condition.

Fields:

- `alertRuleId`.
- `organizationId`.
- `name`.
- `description`.
- `signalType`.
- `condition`.
- `threshold`.
- `severity`.
- `deduplicationKey`.
- `escalationPolicyId`.
- `enabled`.
- `createdBy`.
- `createdAt`.

## Alert

Represents a triggered alert.

Fields:

- `alertId`.
- `organizationId`.
- `alertRuleId`.
- `severity`.
- `status`.
- `signalRef`.
- `message`.
- `triggeredAt`.
- `acknowledgedBy`.
- `acknowledgedAt`.
- `resolvedAt`.

Statuses:

- `TRIGGERED`.
- `ACKNOWLEDGED`.
- `RESOLVED`.
- `SUPPRESSED`.

## Dashboard

Represents a saved operational view.

Fields:

- `dashboardId`.
- `organizationId`.
- `name`.
- `description`.
- `visibility`.
- `panels`.
- `createdBy`.
- `createdAt`.
- `updatedAt`.

## Current Implementation Mapping

Current runtime entities:

- `observability_metrics`.
- `observability_logs`.
- `observability_traces`.
- `observability_agent_executions`.
- `observability_audit_events`.

Future entities may add alert and dashboard persistence when implementation is
explicitly scheduled.

## Security Rules

- Telemetry is tenant-scoped.
- Logs must not contain secrets, tokens, passwords, full confidential content,
  or unnecessary personal data.
- Audit records must be immutable.
- AI may diagnose and summarize incidents, but may not delete logs, hide
  errors, alter audit, or execute infrastructure actions automatically.
