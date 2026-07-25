# Risk Management

## Purpose

Risk management defines how operational, technical, security, AI, legal, and
editorial risks are identified, scored, mitigated, and tracked.

## Risk Categories

- Technical.
- Security.
- Operational.
- AI.
- Legal.
- Editorial.

## Risk Record

Each risk must record:

- ID.
- Category.
- Description.
- Probability.
- Impact.
- Severity.
- Owner.
- Mitigation.
- Status.
- Review date.

## Severity Model

| Severity | Meaning |
| --- | --- |
| Critical | Must block release or operation until mitigated |
| High | Requires owner and mitigation plan before release |
| Medium | Track and schedule mitigation |
| Low | Monitor or accept with rationale |

## Current Risk Baseline

Current known operational risks:

- Production deployment workflow is not active.
- Artifact registry and signing are not implemented.
- Centralized observability is not connected.
- Backup encryption is not enforced by managed keys.
- Incident register is not formalized.
- ADR process is not yet stored in a dedicated directory.

## Risk Review Cadence

Risks must be reviewed:

- Before each release.
- After incidents.
- Before architecture changes.
- Before adding external providers.
- Before public launch.
