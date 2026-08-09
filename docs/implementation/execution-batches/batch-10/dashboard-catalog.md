# Dashboard Catalog

Status: Canonical catalog defined  
Owner: Platform Operations

## Canonical Dashboards

| Dashboard | Purpose | Required Signals |
| --- | --- | --- |
| Executive Readiness | RC1 status and blockers | readiness gates, unresolved blockers, test status |
| API Health | API availability and errors | health, latency, error rate, request count |
| Web Health | web build and user entrypoint status | build status, route smoke tests |
| Database Runtime | persistence and backup status | runtime DB health, backup age, restore evidence |
| Security | security checks and secret hygiene | secret scan, vulnerability scan, auth failures |
| Publishing Operations | export and publication readiness | preflight, export status, rights blocks |
| AI Operations | AI execution and governance | cost, blocked executions, provider state |
| Incident Response | active incidents and postmortems | incidents, severity, owner, status |

## Rule

Dashboards must be derived from canonical telemetry and readiness records. Dashboards are not sources of truth.

