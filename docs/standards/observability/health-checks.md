# Canonical Health Checks Standard

## Purpose

This document defines canonical health check types, health response rules,
dependency checks, safety requirements, and health audit requirements.

## Required Health Check Types

Every applicable service should expose or report:

- Liveness.
- Readiness.
- Startup.
- Dependency health.
- Database health.
- AI provider health.
- Queue health.

## Health Check Definitions

| Health check | Purpose |
| --- | --- |
| Liveness | Confirms the process is running and not irrecoverably stuck. |
| Readiness | Confirms the service is ready to receive traffic. |
| Startup | Confirms startup completed successfully. |
| Dependency health | Confirms required internal dependencies are reachable. |
| Database health | Confirms database connectivity and required read/write mode where safe. |
| AI provider health | Confirms configured AI provider availability where applicable. |
| Queue health | Confirms queue connectivity and backlog risk where applicable. |

## Health Response Requirements

Health responses must be:

- Minimal.
- Safe.
- Non-sensitive.
- Environment-aware.
- Fast.
- Machine-readable.
- Compatible with deployment and monitoring automation.

Health responses must not expose:

- Secrets.
- Private infrastructure topology.
- Tenant data.
- User data.
- Internal credentials.
- Stack traces.
- Confidential operational details.

## Health Status Values

Canonical health statuses:

- `OK`.
- `DEGRADED`.
- `UNHEALTHY`.
- `UNKNOWN`.

## Dependency Health

Dependency health checks may include:

- Runtime database.
- External database.
- Storage.
- Message queue.
- AI provider.
- Gateway.
- Backup destination.
- Search/index service.
- Email or notification provider.
- Public portal dependency.

Dependency failures should be classified by severity and impact.

## Deployment Integration

Deployment verification must use health checks for:

- API health.
- Web health.
- Database connectivity.
- Runtime configuration validity.
- Backup/restore readiness where relevant.
- Monitoring hook status.
- Smoke test readiness.

## Health Audit

Audit must record:

- Health policy changed.
- Health check disabled.
- Protected health endpoint changed.
- Health status changed where operationally significant.
- Deployment health verification failed.
- Dependency health exception approved.

## Current Baseline Guidance

The repository already contains a minimal public API health endpoint and
staging health check scripts. Future implementation should preserve minimal,
safe health responses while expanding canonical health metadata through
observability records rather than exposing sensitive data on public endpoints.
