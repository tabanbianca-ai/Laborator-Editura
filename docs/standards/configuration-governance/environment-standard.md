# Canonical Environment Standard

## Purpose

This document defines canonical runtime environments, environment isolation,
promotion paths, protected environment rules, and environment audit
requirements.

## Canonical Environments

The platform defines only these canonical environments:

```text
Local
  -> Development
  -> Integration
  -> Testing
  -> Staging
  -> Production
  -> Disaster Recovery
```

No additional environment may be created without approved architecture
exception.

## Environment Definitions

| Environment | Purpose |
| --- | --- |
| `Local` | Individual developer workstation or isolated local execution. |
| `Development` | Shared development validation before integration. |
| `Integration` | Cross-module and cross-service integration validation. |
| `Testing` | Automated, QA, security, compatibility, and release validation. |
| `Staging` | Production-like validation before production release. |
| `Production` | Live user-facing runtime. |
| `Disaster Recovery` | Recovery, continuity, failover, and restoration runtime. |

## Environment Isolation

Each environment must isolate:

- Runtime configuration.
- Databases.
- Secrets.
- Storage.
- API origins.
- Network exposure.
- Feature flags.
- Deployment targets.
- Monitoring and alerting profiles.
- Backup and restore policies.
- AI provider usage where applicable.
- Cost limits where applicable.

## Protected Environments

Protected environments are:

- `Staging`.
- `Production`.
- `Disaster Recovery`.

Protected environments require:

- Strong secrets.
- Explicit `APP_ENV`.
- Standard `NODE_ENV` values.
- Health checks.
- Backup configuration.
- Rollback plan.
- Deployment verification.
- Audit.
- Human approval for production-impacting changes.

## Runtime Environment Variables

Environment variables must be:

- Documented.
- Typed where possible.
- Validated before startup.
- Scoped to environment.
- Non-secret unless delivered through approved secret handling.
- Never logged when sensitive.

Staging and production Node.js runtimes must use standard `NODE_ENV`
semantics. Staging-specific meaning should be represented by `APP_ENV` or an
equivalent approved environment metadata variable.

## Environment Promotion Policy

Promotion follows only this path:

```text
Development
  -> Integration
  -> Testing
  -> Staging
  -> Production
```

Direct promotion to Production is not allowed without a formal, audited
exception and emergency approval.

## Promotion Requirements

Promotion requires:

- Configuration validation.
- Secret reference validation.
- Test evidence.
- Security checks.
- Health check plan.
- Backup or restore readiness where relevant.
- Rollback plan.
- Human approval for production-impacting changes.
- Audit.

## Environment Drift

Environment drift occurs when runtime state differs from the documented,
versioned configuration.

Drift handling must include:

- Detection.
- Classification.
- Impact analysis.
- Correction plan.
- Audit event.

## Environment Audit

Audit must record:

- Environment created.
- Environment changed.
- Environment validated.
- Environment promoted.
- Environment drift detected.
- Environment rollback executed.
- Protected environment exception approved.
- Secret validation failure.
- Deployment validation result.
