# Alert Registry

Status: Canonical alert rules defined  
Owner: Platform Operations

## Alert Quality Rules

Every alert must define:

- id;
- name;
- severity;
- owner;
- signal;
- condition;
- duration;
- runbook id;
- notification target;
- enabled flag;
- version;
- action.

Alerts without an owner, runbook, destination, action, condition, or version are not actionable and must not count as RC1 evidence.

## Initial Alerts

| ID | Severity | Signal | Condition | Runbook |
| --- | --- | --- | --- | --- |
| ALERT-API-HEALTH | CRITICAL | API health | status != ok for 5m | RUNBOOK-API-HEALTH |
| ALERT-WEB-HEALTH | CRITICAL | Web health | critical route fails | RUNBOOK-WEB-HEALTH |
| ALERT-BACKUP-FAILED | CRITICAL | Backup | last backup failed | RUNBOOK-BACKUP |
| ALERT-RESTORE-UNTESTED | HIGH | Restore | no current restore evidence | RUNBOOK-RESTORE |
| ALERT-SECRET-SCAN | CRITICAL | Secret scan | committed secret detected | RUNBOOK-SECURITY |
| ALERT-RPO-RTO | HIGH | Recovery objectives | measured objective exceeds threshold | RUNBOOK-DR |
| ALERT-PUBLISHING-BLOCKED | HIGH | Publication gate | final gate blocked | RUNBOOK-PUBLISHING |

## Noise Control

Duplicate alerts with identical signal, condition, duration, and severity must be consolidated.

