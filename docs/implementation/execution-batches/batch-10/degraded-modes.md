# Degraded Modes

Status: Canonical policy defined  
Owner: Platform Operations

## Dependency Failure Policy

| Dependency | Degraded Mode | User Impact |
| --- | --- | --- |
| AI provider | manual editorial work continues | AI suggestions unavailable |
| Export worker/script | editing and review continue | publication blocked until export recovers |
| Backup service | application may continue with alert | RC1/production approval blocked |
| Observability storage | application continues with local logs | incident response degraded |
| Public portal | internal work continues | public access unavailable |

## Rules

- No degraded mode may publish automatically.
- No degraded mode may approve automatically.
- No degraded mode may grant rights automatically.
- No degraded mode may hide audit failures.
- Critical degraded modes must create an incident.

