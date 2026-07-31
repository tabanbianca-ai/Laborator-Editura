# Infrastructure as Code

## Purpose

Infrastructure as Code defines and versions infrastructure configuration,
deployment processes, operational scripts, validation scripts, security
configuration, monitoring configuration, backup procedures, and runbooks.

## IaC Rule

All infrastructure must be represented in version-controlled files unless a
temporary manual exception is explicitly documented, approved, time-bounded,
and audited.

## Current Baseline

Current infrastructure-as-code assets include:

- `.github/workflows`.
- `deploy/staging`.
- `infrastructure/backup`.
- `infrastructure/deploy`.
- `infrastructure/disaster-recovery`.
- `infrastructure/docs`.
- `infrastructure/inventory`.
- `infrastructure/monitoring`.
- `infrastructure/nginx`.
- `infrastructure/scripts`.
- `infrastructure/security`.
- `infrastructure/systemd`.
- `infrastructure/validation`.

## Governed Infrastructure Areas

IaC must cover:

- Networking.
- Compute.
- Storage.
- Security.
- Monitoring.
- Backups.
- Deployment.
- Scaling.
- Certificates.
- Secrets references.
- Health checks.
- Runbooks.

## Versioning

Every infrastructure change must preserve:

- Git commit.
- Change reason.
- Affected environment.
- Affected services.
- Rollback path.
- Validation evidence.
- Approval where required.

## Validation Requirements

Infrastructure changes must validate:

- Shell script syntax.
- Node script syntax where `.mjs` scripts are used.
- Nginx template correctness in the right context.
- Docker Compose configuration.
- Secret scanning.
- Backup dry-run.
- Health checks.
- Environment variable completeness.

## Current Strengths

- Infrastructure Pack v1.0 exists.
- Validation scripts exist.
- Nginx templates exist.
- Systemd units exist.
- Backup and restore scripts exist.
- Security hardening scripts exist.
- Operational runbooks exist.

## Current Gaps

- Terraform or equivalent cloud resource IaC is not yet implemented.
- Kubernetes manifests or Helm charts are not yet implemented.
- Managed secret references are not yet integrated.
- Infrastructure drift detection is not yet implemented.
- Environment inventory is template-based rather than centrally governed.

## Manual Exceptions

Manual infrastructure actions must document:

- Actor.
- Environment.
- Reason.
- Commands or changes.
- Risk.
- Rollback path.
- Expiration if temporary.
- Audit reference.

## Standardization Plan

1. Keep current shell, Docker Compose, Nginx, systemd, and runbook assets as
   the staging IaC baseline.
2. Add cloud resource IaC in a future approved production phase.
3. Add Kubernetes manifests only after the Kubernetes migration is approved.
4. Add drift detection after production infrastructure exists.
5. Add infrastructure change audit reporting.
