# Observability Metrics

## Purpose

Metrics provide numeric and status signals for platform health, performance,
capacity, reliability, AI usage, workflow throughput, and operational risk.

## Metric Types

Supported metric types:

- `COUNTER`.
- `GAUGE`.
- `HISTOGRAM`.
- `STATUS`.

## Required Metric Families

The platform must collect metrics for:

- API uptime.
- API request count.
- API error count.
- API latency.
- Database availability.
- Backup status.
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
- AI cost and token usage.
- Audio/video rendering duration.
- Publishing and distribution state.
- Storage usage.
- Infrastructure CPU, memory, disk, and container health.

## Current Repository Baseline

Implemented foundations:

- Observability module records metrics with metric name, type, module, value,
  unit, request count, error count, latency, runtime database status, backup
  status, metadata, and timestamp.
- Baseline metrics are created for API uptime, requests, errors, latency,
  runtime database status, and backup status.
- AI Governance records AI usage, budgets, quotas, provider status, cost, and
  audit events.
- Infrastructure documentation defines operational signals for uptime, CPU,
  memory, disk, container health, API response times, database status, AI
  failures, workflow failures, backup failures, TLS, and deployment failures.

Current gaps:

- No production metrics exporter is connected.
- No Prometheus/Grafana or external APM provider is configured.
- Metric dimensions are not standardized platform-wide.
- Alert rules are not yet connected to metrics.

## Metric Dimensions

Metrics should support dimensions:

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

Dimensions must not expose confidential content.

## Retention

Metrics retention should be configurable:

- High-resolution recent metrics.
- Aggregated historical metrics.
- Long-term summary archives.

Retention must integrate with Backup, Disaster Recovery, and compliance
policies when scheduled.
