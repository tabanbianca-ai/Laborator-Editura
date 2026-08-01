# Canonical Metrics Standard

## Purpose

This document defines canonical metric families, metric types, dimensions,
retention, aggregation, privacy rules, and metrics governance.

## Required Standard Metrics

All applicable services must publish:

- CPU usage.
- Memory usage.
- Disk usage.
- Network usage.
- Request rate.
- Error rate.
- Response time.
- Queue length.
- AI cost.
- Token consumption.
- Availability.

## Metric Types

Supported metric types are:

- `COUNTER`.
- `GAUGE`.
- `HISTOGRAM`.
- `STATUS`.

## Canonical Metric Families

The platform must support metric families for:

- API uptime.
- API request count.
- API error count.
- API latency.
- Database availability.
- Backup status.
- Restore dry-run status.
- Authentication attempts.
- Failed access events.
- Workflow throughput.
- Active workflow count.
- Task backlog.
- Notification delivery rate.
- Notification failure rate.
- AI execution count.
- AI error count.
- AI provider fallback.
- AI cost.
- AI token usage.
- Publishing readiness.
- Export status.
- Distribution readiness.
- Storage usage.
- Infrastructure CPU, memory, disk, network, and container health.

## Metric Fields

Each metric should include:

- `metricId`.
- `timestamp`.
- `name`.
- `type`.
- `value`.
- `unit`.
- `source`.
- `component`.
- `environment`.
- `organizationId` where applicable.
- `dimensions`.
- `correlationId` where applicable.
- `metadata`.

## Metric Dimensions

Metrics may use dimensions such as:

- Environment.
- Organization.
- Workspace.
- Module.
- Service.
- Route.
- Method.
- Status code.
- Project.
- Document.
- Workflow stage.
- AI provider.
- AI model.
- Capability.
- Channel.
- Region.

Dimensions must not expose confidential content, raw secrets, or private user
data.

## Aggregation

Metrics should support:

- Recent high-resolution metrics.
- Aggregated historical metrics.
- Long-term summary archives.
- Compliance-relevant snapshots.
- Release and deployment evidence.

Aggregation must preserve enough context for diagnostics and compliance.

## Retention

Metric retention must be governed by:

- Operational needs.
- Compliance requirements.
- Backup and preservation policy.
- Storage cost.
- Privacy and tenant isolation rules.

High-volume metrics may be aggregated after the operational window if
governance permits.

## Metrics Audit

Audit must record:

- Metric collection policy changed.
- Metric retention changed.
- Metric export created.
- Sensitive metric access granted.
- Metrics collection disabled.
- Alert threshold changed.
- Compliance metric snapshot created.
