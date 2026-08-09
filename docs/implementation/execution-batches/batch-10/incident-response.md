# Incident Response

Status: Canonical incident model defined  
Owner: Platform Operations

## Incident Lifecycle

Detected -> Triage -> Owner assigned -> Mitigation -> Recovery -> Evidence captured -> Postmortem -> Corrective actions -> Closed.

## Required Incident Fields

- incident id;
- severity;
- service;
- environment;
- detected at;
- owner;
- status;
- customer impact;
- affected organizations when known;
- correlation ids;
- actions taken;
- rollback decision;
- postmortem link.

## Severity

- Critical: service unavailable, data integrity risk, security exposure, failed critical restore.
- High: degraded critical workflow, missed RPO/RTO, failed backup, repeated auth failures.
- Medium: partial degradation with workaround.
- Low: minor operational issue.

## Postmortem Rule

Critical and High incidents require postmortem records. AI may summarize evidence but cannot close incidents or approve corrective actions.

