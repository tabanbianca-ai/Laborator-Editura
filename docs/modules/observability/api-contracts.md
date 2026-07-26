# Observability API Contracts

## Purpose

This document defines current and target API contracts for the Observability,
Monitoring and Audit Module.

All APIs are versioned and must enforce authenticated, server-derived request
context unless explicitly approved as public.

## Current APIs

Public health:

```http
GET /health
```

Authenticated observability:

```http
GET /observability/health
GET /observability/metrics
GET /observability/logs
GET /observability/traces
GET /observability/agent-executions
```

Related APIs:

- Gateway health and route registry.
- Platform Engineering diagnostics.
- Security Governance events.
- Backup Governance jobs and audit.
- Policy Engine evaluations.

## Target APIs

Examples from the official specification:

```http
GET /logs
GET /metrics
GET /traces/{id}
GET /audit/events
GET /health
GET /alerts
POST /alerts/rules
```

Recommended module-scoped target APIs:

```http
GET  /observability/logs
POST /observability/logs
GET  /observability/metrics
POST /observability/metrics
GET  /observability/traces
GET  /observability/traces/:traceId
POST /observability/traces
GET  /observability/audit/events
GET  /observability/alerts
POST /observability/alerts/rules
POST /observability/alerts/:id/acknowledge
POST /observability/alerts/:id/resolve
GET  /observability/dashboards
POST /observability/dashboards
GET  /observability/health
```

## API Rules

- Public `/health` must remain minimal and unauthenticated.
- Detailed health, logs, metrics, traces, alerts, dashboards, and audit APIs
  require authenticated context.
- IAM controls observability access by role and permission.
- Logs and traces must be redacted before returning to users.
- Audit event APIs must not allow mutation or deletion.
- Alert acknowledgement requires authorized human roles.
- AI may diagnose and summarize but may not delete logs, hide errors, or
  execute infrastructure actions.

## Current Contract Gaps

- Alert APIs are not implemented.
- Dashboard APIs are not implemented.
- Trace lookup by trace ID is not implemented as a dedicated endpoint.
- Unified audit query endpoint is not implemented.
- Telemetry ingestion APIs are not public module contracts yet.

## Compatibility Rule

Existing Health, Observability, Platform Engineering, Backup, Security
Governance, IAM, Workflow, Notification, Publishing, Distribution, and Phase 7
Step 16 behavior must remain compatible during incremental migration.
