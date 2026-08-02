# Recovery Point and Recovery Time Objectives

## Purpose

RPO and RTO define the maximum acceptable data loss and maximum acceptable
service recovery time for each resource category.

## Definitions

- RPO: Maximum acceptable data loss.
- RTO: Maximum acceptable time to resume operation.

## Indicative Baseline

| Tier | Indicative RPO | Indicative RTO |
| --- | --- | --- |
| `TIER_0` | Maximum 15 minutes | Maximum 1 hour |
| `TIER_1` | Maximum 1 hour | Maximum 4 hours |
| `TIER_2` | Maximum 24 hours | Maximum 24 hours |

Final values must be approved according to real infrastructure, operating
cost, legal duties, customer commitments, and platform maturity.

## RPO/RTO Rules

- Every service and data category must have approved RPO and RTO.
- Missed RPO or RTO must be recorded as a governed incident.
- RPO and RTO must inform backup frequency, replication, storage topology,
  restore testing, monitoring, and alerting.
- RPO and RTO exceptions must be approved and audited.
- RPO and RTO values must be reviewed after incidents and restore exercises.

## Monitoring

Monitoring must detect:

- Failed backups.
- Delayed backups.
- Missing replication.
- Failed restore tests.
- RPO breach.
- RTO breach.
- Storage capacity risk.
- Policy expiration.
- Unusual deletion activity.

