# DevOps Gap Analysis

## Purpose

This document records the Chapter 13 DevOps and Infrastructure Baseline Audit
gaps.

Each gap includes:

- Gap ID.
- Area.
- Current State.
- Required State.
- Risk.
- Affected Components.
- Dependencies.
- Recommended Action.
- Migration Phase.
- Acceptance Criteria.

## Gaps

### DEVOPS-GAP-001

Area: Artifact registry.

Current State: Docker images are built during staging deployment and CI build
validation, but immutable image publication to a registry is not configured.

Required State: Builds publish immutable artifacts traceable to Git commits.

Risk: Medium.

Affected Components: CI, CD, Dockerfiles, staging deployment, future
production deployment.

Dependencies: GitHub Actions secrets, registry choice, artifact retention
policy.

Recommended Action: Select registry and add artifact publication after
staging pipeline remains stable.

Migration Phase: Phase 2 - artifact publishing.

Acceptance Criteria: Each deployable release references immutable artifacts.

### DEVOPS-GAP-002

Area: Production deployment.

Current State: Staging deployment workflow exists; production deployment is not
implemented.

Required State: Production deployment is automated, approved, health-checked,
and rollback-capable.

Risk: High.

Affected Components: GitHub Actions, infrastructure deploy scripts, secrets,
runbooks.

Dependencies: Production host, DNS, TLS, secret management, backup policy.

Recommended Action: Finalize production environment values and implement
production deployment only after staging validation.

Migration Phase: Phase 5 - production deployment.

Acceptance Criteria: Production deployment can run from approved immutable
release artifacts and rollback is documented.

### DEVOPS-GAP-003

Area: Blue/green and rolling deployment.

Current State: Docker Compose staging supports rebuild and restart, but not
blue/green or rolling updates.

Required State: Deployment architecture supports zero-downtime rollout where
production availability requires it.

Risk: Medium.

Affected Components: Production orchestration, reverse proxy, health checks.

Dependencies: Load balancer or orchestration platform.

Recommended Action: Keep Compose for staging and design production for
blue/green before public high-traffic launch.

Migration Phase: Phase 6 - zero-downtime deployment.

Acceptance Criteria: New versions can be introduced and removed without
planned downtime.

### DEVOPS-GAP-004

Area: Secret management.

Current State: GitHub environment secrets and host `/etc/laborator` config are
used; no external central secret manager is connected.

Required State: Secrets are centrally controlled, rotated, audited, and never
stored in source.

Risk: High.

Affected Components: CI/CD, staging, production, provider integrations,
backup encryption.

Dependencies: Secret management provider or approved internal mechanism.

Recommended Action: Keep current safe no-secret-in-repo model and schedule
central secret manager integration before production provider activation.

Migration Phase: Phase 4 - secret management hardening.

Acceptance Criteria: Secrets can be rotated and audited without code changes.

### DEVOPS-GAP-005

Area: Backup encryption and offsite policy.

Current State: Backup scripts, dry-run, verification, and runbooks exist.
Encryption is recommended but not enforced by a managed key policy.

Required State: Backups are encrypted, monitored, retained, and periodically
restore-tested.

Risk: High.

Affected Components: Backup scripts, retention policy, DR, production
operations.

Dependencies: Key management, storage location, retention requirements.

Recommended Action: Add encryption enforcement and offsite backup policy after
operator key procedure is approved.

Migration Phase: Phase 4 - backup hardening.

Acceptance Criteria: Backups are encrypted and restore dry-runs are scheduled.

### DEVOPS-GAP-006

Area: RPO/RTO.

Current State: Disaster recovery scripts and runbooks exist, but final
environment-specific RPO/RTO values are not set.

Required State: Every controlled environment defines RPO, RTO, owners, and
validation procedure.

Risk: Medium.

Affected Components: DR runbook, backup policy, release checklist.

Dependencies: Business availability requirements.

Recommended Action: Define staging and production RPO/RTO before public
launch.

Migration Phase: Phase 3 - DR objectives.

Acceptance Criteria: Restore testing proves the documented RPO/RTO can be met.

### DEVOPS-GAP-007

Area: Observability stack.

Current State: Health scripts, metadata modules, and runbooks exist; external
metrics/log aggregation/APM is not connected.

Required State: Central monitoring, logs, metrics, alerts, and dashboards
exist for production operations.

Risk: Medium.

Affected Components: Observability, monitoring scripts, infrastructure, API,
Web.

Dependencies: Monitoring provider or self-hosted observability stack.

Recommended Action: Keep lightweight staging monitoring and select production
observability stack before public launch.

Migration Phase: Phase 7 - observability stack.

Acceptance Criteria: Alerts exist for health, resources, backups, deployment,
and critical application errors.

### DEVOPS-GAP-008

Area: Release automation.

Current State: Release checklists exist; semantic versioning and changelog
generation are manual.

Required State: Releases have semantic versions, changelogs, artifact links,
and rollback references.

Risk: Low.

Affected Components: Release checklist, Git tags, CI/CD summary, deployment
records.

Dependencies: Artifact registry and branch protection.

Recommended Action: Introduce release tagging and changelog automation after
production deployment path is designed.

Migration Phase: Phase 8 - release automation.

Acceptance Criteria: Every release is traceable from version to commit to
artifact to deployment.

### DEVOPS-GAP-009

Area: Artifact signing.

Current State: Vulnerability scanning exists; artifact signing is not
implemented.

Required State: Release artifacts should be signed where supported.

Risk: Low.

Affected Components: Docker images, release artifacts, CI.

Dependencies: Registry and signing tool selection.

Recommended Action: Add signing after registry is selected.

Migration Phase: Phase 9 - supply chain hardening.

Acceptance Criteria: Production artifacts include verifiable signatures.
