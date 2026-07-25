# DevOps Architecture Baseline

## Purpose

This document defines the current DevOps and infrastructure baseline for
Chapter 13.

It must be reviewed before infrastructure redesign, production deployment
automation, container orchestration changes, secret management changes,
backup/restore changes, or operational monitoring changes.

## Target Architecture

The official DevOps path is:

```text
Git
  -> Pull Request
  -> CI validation
  -> Build
  -> Artifact publication
  -> Staging deployment
  -> Staging validation
  -> Human approval
  -> Production deployment
  -> Monitoring
  -> Backup / rollback / recovery
```

## Current Infrastructure Inventory

Current repository infrastructure includes:

- GitHub Actions CI in `.github/workflows/ci.yml`.
- Manual staging deployment workflow in
  `.github/workflows/staging-deploy.yml`.
- Manual staging operations workflow in
  `.github/workflows/staging-operations.yml`.
- Staging Docker Compose configuration in
  `deploy/staging/docker-compose.staging.yml`.
- API and Web Dockerfiles in `deploy/staging`.
- Staging helper scripts in `deploy/staging/scripts`.
- Infrastructure Pack v1.0 under `infrastructure`.
- Backup, restore, verification, and dry-run scripts under
  `infrastructure/backup`.
- Deployment and rollback scripts under `infrastructure/deploy`.
- Disaster recovery bootstrap and restore orchestration under
  `infrastructure/disaster-recovery`.
- Nginx templates under `infrastructure/nginx`.
- Monitoring scripts under `infrastructure/monitoring`.
- Validation scripts under `infrastructure/validation`.
- Systemd units under `infrastructure/systemd`.
- Operational runbooks under `infrastructure/docs`.

## Current Dependency Map

| Area | Current Components | Dependency |
| --- | --- | --- |
| CI | GitHub Actions, Node 22, pnpm, Docker Compose | GitHub hosted runners |
| Build | pnpm workspace, TypeScript, Next.js, NestJS | npm registry/package access |
| API container | `deploy/staging/Dockerfile.api` | Node 22, pnpm, shared/db/api builds |
| Web container | `deploy/staging/Dockerfile.web` | Node 22, pnpm, Next production build |
| Staging runtime | Docker Compose | VPS Docker engine |
| Health checks | Container health checks, `/health`, web root | API/Web availability |
| Backup | Infrastructure backup scripts, runtime database path | Host filesystem permissions |
| Restore | Restore dry-run and restore scripts | Backup archive integrity |
| Reverse proxy | Nginx templates | Host Nginx and TLS setup |
| Scheduling | systemd timers | Host systemd |
| Monitoring | monitor script and runbook | Host logs and health endpoints |
| Secrets | GitHub Actions secrets, `.env` examples, `/etc/laborator` | Manual secret provisioning |

## Current Strengths

- CI validates contracts, runtime database tests, shared tests, fixtures,
  infrastructure syntax, Docker Compose configuration, secret scan, and Nginx
  templates.
- Typecheck, lint, test, build, and audit run when dependencies are available.
- Staging deployment is manual, gated, and uses SSH with GitHub environment
  secrets.
- Staging deployment script includes backup and health check support.
- Staging operations include health, backup, backup dry-run, restore dry-run,
  and rollback.
- Infrastructure Pack provides UTC logging, validation, backup, restore,
  monitoring, firewall, SSH hardening, logrotate, systemd, Nginx, and runbooks.
- Docker Compose uses standard `NODE_ENV=production` and `APP_ENV=staging`.

## Current Gaps

- Artifact registry publication is not yet implemented.
- Production deployment workflow is not yet implemented.
- Blue/green and rolling deployment are planned but not implemented.
- Semantic versioning and changelog release automation are not yet formalized.
- Central secret manager integration is not yet implemented.
- Backup encryption is recommended but not yet enforced by a managed key
  system.
- RPO/RTO targets are documented conceptually but not finalized per
  environment.
- Operational metrics are script-based and metadata-based; external APM or
  metrics backend is not connected.
- Artifact signing is not yet implemented.

## Required Alignment

Future DevOps work must converge toward:

- Immutable artifacts.
- Commit-addressed deployments.
- Environment-specific configuration without application code changes.
- Automated staging validation before production approval.
- Production deployment with rollback.
- Backup encryption and routine restore tests.
- Formal RPO/RTO per environment.
- Centralized logs, metrics, alerts, and incident runbooks.
- Controlled release versioning and changelog generation.
