# Canonical Runtime Configuration Standard

## Purpose

This document defines rules for runtime parameters, environment variables,
service discovery, secret references, operational paths, validation, drift
detection, and runtime configuration audit.

## Runtime Configuration Categories

Runtime configuration includes:

- Environment variables.
- Service ports.
- API origins.
- Database paths and connection references.
- Runtime database file paths.
- Backup directories.
- Log directories.
- Health check URLs.
- Monitoring endpoints.
- Public frontend configuration.
- Internal service discovery metadata.
- AI provider configuration references.
- Secret references.
- Feature flag references.

## Runtime Parameter Rules

Runtime parameters must be:

- External to source code.
- Documented.
- Typed where possible.
- Validated before startup.
- Scoped to environment.
- Reproducible.
- Auditable when changed.
- Safe by default.

Business-critical runtime behavior must not depend on undocumented
hardcoded constants.

## Secret References

Secrets must be represented as references, not plain configuration values.

Rules:

- Secret values must not be committed.
- Secret values must not be logged.
- Secret values must not be exposed to frontend bundles.
- Protected environments must reject weak, demo, placeholder, or default
  secret values.
- Secret rotation metadata must be auditable.
- Configuration diffs must not reveal secret values.

## Service Discovery

Service discovery metadata must define:

- Service name.
- Environment.
- Internal URL or endpoint reference.
- Public URL where applicable.
- Health endpoint.
- Required authentication.
- Owner.
- Version.
- Status.

Service discovery must not expose private infrastructure details to
unauthorized users or frontend clients.

## Operational Paths

Operational paths must be configurable.

Examples:

- `PROJECT_ROOT`.
- `CONFIG_DIR`.
- `LOG_DIR`.
- `BACKUP_DIR`.
- `NGINX_DIR`.
- `SYSTEMD_DIR`.
- `DOCKER_COMPOSE_PATH`.
- Runtime database path.

Scripts and services should use validated defaults and environment overrides
where practical.

## Runtime Validation

Runtime validation must verify:

- Required parameters exist.
- Values use allowed formats.
- Paths are valid and safe.
- Required directories exist or can be created safely.
- Ports do not conflict.
- URLs and origins are valid.
- Secret references are present.
- Protected environment constraints are satisfied.
- Public frontend variables are safe for exposure.

## Runtime Drift

Runtime drift must be detected when:

- Running values differ from approved configuration.
- Environment variables differ from expected values.
- Deployment artifacts use unexpected versions.
- Feature flags differ from approved rollout state.
- Service endpoints differ from approved registry values.

Runtime drift must be classified, reviewed, corrected, and audited.

## Public Frontend Configuration

Frontend runtime configuration must expose only safe public values.

Frontend code must not receive:

- Secret values.
- Private service URLs.
- Internal credentials.
- Tenant data outside authorized scope.
- Security-sensitive policy details.

## Runtime Audit

Audit must record:

- Runtime parameter changed.
- Runtime validation passed.
- Runtime validation failed.
- Secret reference changed.
- Public configuration changed.
- Service discovery changed.
- Drift detected.
- Drift corrected.
- Protected environment exception.
