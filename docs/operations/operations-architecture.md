# Operations Architecture

## Purpose

This document records the operational architecture baseline required by
Chapter 15.

It defines how Laborator Editura is operated, monitored, maintained,
validated, released, recovered, and evolved without changing product behavior.

## Current Operational Inventory

Current repository operations include:

- GitHub Actions CI in `.github/workflows/ci.yml`.
- Manual staging deployment in `.github/workflows/staging-deploy.yml`.
- Manual staging operations in `.github/workflows/staging-operations.yml`.
- Staging Docker Compose and Dockerfiles under `deploy/staging`.
- Staging validation, health, backup, restore, smoke, and bootstrap scripts
  under `deploy/staging/scripts`.
- Infrastructure Pack v1.0 under `infrastructure`.
- Backup, restore, verification, and restore dry-run scripts under
  `infrastructure/backup`.
- Deployment and rollback scripts under `infrastructure/deploy`.
- Monitoring script under `infrastructure/monitoring`.
- Nginx templates under `infrastructure/nginx`.
- Systemd units under `infrastructure/systemd`.
- Operational runbooks under `infrastructure/docs`.
- DevOps baseline documentation under `docs/devops`.
- Quality baseline documentation under `docs/quality`.

## Official Operational Flow

```text
Plan
  -> Implement
  -> Validate
  -> Release
  -> Deploy
  -> Monitor
  -> Maintain
  -> Improve
```

Each step must be traceable to an owner, version, validation result, and audit
record where implementation support exists.

## Operational Control Principles

- Operational changes must be reviewed.
- Runtime configuration must be externalized.
- Deployment must be repeatable.
- Rollback must be documented.
- Backup must precede risky operations.
- Monitoring must confirm service health after change.
- Human approval is required for production-impacting actions.

## Current Strengths

- Infrastructure Pack v1.0 provides a concrete operational foundation.
- Staging deploy and operations workflows exist.
- Health checks, smoke tests, backup, restore dry-run, and rollback scripts
  exist.
- Nginx, systemd, security, monitoring, and disaster recovery runbooks exist.
- CI already validates infrastructure syntax and secret hygiene.

## Current Gaps

- Production deployment workflow is not yet active.
- Artifact registry publication is not implemented.
- Formal ADR storage is not yet present.
- Operational KPIs are defined conceptually but not collected centrally.
- External APM, metrics backend, and alert routing are not connected.
- Production RPO/RTO values are not finalized per environment.

## Required Future Alignment

Future operations must converge toward:

- Immutable release artifacts.
- Environment-specific configuration without code changes.
- Centralized logs, metrics, alerts, and dashboards.
- Routine restore validation.
- Formal incident records and post-incident reviews.
- Architecture Decision Records for structural changes.
- Controlled feature lifecycle and deprecation records.
