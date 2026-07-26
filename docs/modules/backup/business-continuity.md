# Business Continuity

## Purpose

Business continuity defines how editorial operations continue during degraded
service, infrastructure failures, provider outages, backup incidents, and
recovery procedures.

## Continuity Principles

- Preserve editorial work.
- Preserve audit and version history.
- Preserve rights, security, and Need-to-Know restrictions.
- Prefer safe degraded operation over unsafe automation.
- Never delete data to recover service.
- Keep Human Final Authority in place.
- Document all temporary mitigations.

## Continuity Scenarios

The platform must plan for:

- API outage.
- Web outage.
- Runtime database failure.
- Backup failure.
- Restore validation failure.
- Deployment failure.
- Reverse proxy or TLS issue.
- AI provider outage.
- External integration outage.
- Media processing failure.
- Publication export failure.

## Service Priorities

Priority 1:

- Authentication and authorization.
- Runtime database.
- Audit.
- Backup and restore.
- API health.

Priority 2:

- Projects.
- Documents.
- Author Studio.
- Translation.
- Workflow.
- Rights and Provenance.
- Publishing and Export.

Priority 3:

- AI assistance.
- Multimedia generation.
- Marketplace metadata.
- Optional public distribution surfaces.

## Current Repository Baseline

Current continuity assets include:

- `docs/operations/business-continuity.md`.
- `infrastructure/docs/DISASTER_RECOVERY_RUNBOOK.md`.
- Staging validation scripts.
- Health checks.
- Backup/restore dry-run support.
- CI validation workflow.
- Production readiness and launch readiness reports.

## Continuity Procedures

Each continuity plan should define:

- Incident type.
- Affected services.
- Temporary operating mode.
- Communication owner.
- Recovery owner.
- Manual fallback steps.
- Data integrity checks.
- Resumption procedure.
- Audit requirements.

## Communication

Notification and Communication owns delivery. Backup and Continuity provide
the event, severity, affected services, recommended action, and audit
reference.

## Gaps

- Continuity plans are documented conceptually but not represented as a
  dedicated runtime entity.
- Formal continuity drill schedule is not finalized.
- Communication escalation paths are not fully configured.
- Degraded mode UI behavior is not complete.
