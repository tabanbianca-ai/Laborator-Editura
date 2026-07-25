# Business Continuity

## Purpose

Business continuity defines how the platform preserves service, data, audit,
and editorial continuity when operational components fail.

## Continuity Scenarios

The platform must plan for:

- AI provider outage.
- API outage.
- Web outage.
- Runtime database failure.
- Backup failure.
- Restore validation failure.
- Deployment failure.
- Reverse proxy or TLS issue.
- External integration outage.

## Continuity Rules

- Never delete data to recover service.
- Preserve audit and version history.
- Preserve human final authority.
- Preserve rights and security restrictions.
- Prefer safe degraded operation over unsafe automation.
- Document all temporary mitigations.

## Backup and Restore Baseline

Current backup and restore support includes:

- Runtime backup scripts.
- Restore dry-run scripts.
- Backup verification scripts.
- Systemd backup timers.
- Disaster recovery runbooks.

## RPO and RTO

Each environment must define:

- Recovery Point Objective.
- Recovery Time Objective.
- Backup frequency.
- Restore validation frequency.
- Responsible owner.

## Current Gaps

- Production RPO/RTO targets are not finalized.
- Backup encryption is recommended but not centrally enforced.
- External storage provider integration is not configured.
- Business continuity drills are not yet scheduled.
