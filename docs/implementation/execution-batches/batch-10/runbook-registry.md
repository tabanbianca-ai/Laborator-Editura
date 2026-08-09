# Runbook Registry

Status: Canonical runbook registry established  
Owner: Platform Operations

## Current Runbooks

| Runbook ID | File | Purpose |
| --- | --- | --- |
| RUNBOOK-BACKUP | `infrastructure/docs/BACKUP_RESTORE_RUNBOOK.md` | backup and restore operations |
| RUNBOOK-DEPLOYMENT | `infrastructure/docs/DEPLOYMENT_RUNBOOK.md` | staging deployment and rollback |
| RUNBOOK-DR | `infrastructure/docs/DISASTER_RECOVERY_RUNBOOK.md` | disaster recovery orchestration |
| RUNBOOK-DOMAIN-SSL | `infrastructure/docs/DOMAIN_SSL_RUNBOOK.md` | domain and SSL operations |
| RUNBOOK-MAINTENANCE | `infrastructure/docs/MAINTENANCE_RUNBOOK.md` | routine platform maintenance |
| RUNBOOK-MONITORING | `infrastructure/docs/MONITORING_RUNBOOK.md` | monitoring and health checks |
| RUNBOOK-SECURITY | `infrastructure/docs/SECURITY_HARDENING_RUNBOOK.md` | staging server hardening |
| RUNBOOK-TROUBLESHOOTING | `infrastructure/docs/TROUBLESHOOTING_RUNBOOK.md` | operational troubleshooting |

## Rule

Every Critical or High alert must link to one runbook. Every runbook must define owner, symptoms, diagnostic commands, response steps, rollback or escalation, and evidence capture.

