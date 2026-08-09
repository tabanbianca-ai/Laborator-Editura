# Operational Inventory

Status: Canonical inventory established  
Owner: Platform Operations

## Inventory Rules

Every executable service and critical dependency must define:

- service id and application id;
- owner;
- runtime;
- environment;
- dependencies;
- data stores;
- external dependencies;
- health checks;
- logging, metrics, and tracing status;
- backup classification;
- criticality;
- RPO and RTO when backup is required.

## Current Inventory

| Component | Type | Runtime | Criticality | Owner | Health | Backup |
| --- | --- | --- | --- | --- | --- | --- |
| api | application | Node.js/NestJS | CRITICAL | Platform Operations | GET /health | runtime database required |
| web | application | Next.js | CRITICAL | Platform Operations | web route/build validation | stateless artifact |
| runtime-db | database | Runtime DB/PostgreSQL path | CRITICAL | Platform Operations | repository/runtime tests | backup required |
| shared | package | TypeScript ESM | HIGH | Platform Engineering | build/typecheck | source controlled |
| ai | service placeholder | Python | HIGH | AI Operations | compile/test only | source controlled |
| staging-compose | infrastructure | Docker Compose | CRITICAL | Platform Operations | compose config validation | configuration backup |
| backup-scripts | script | Bash/Node | CRITICAL | Platform Operations | dry-run/restore tests | source controlled |
| monitoring-scripts | script | Bash | HIGH | Platform Operations | monitor-laborator.sh | source controlled |
| github-actions-ci | workflow | GitHub Actions | HIGH | DevSecOps | CI result | source controlled |
| nginx-template | infrastructure | Nginx | HIGH | Platform Operations | nginx -t validation | configuration backup |

## RC1 Gate

No critical service may be unowned. No critical service may lack a health check, logging coverage, metrics coverage, backup classification, or runbook reference.

