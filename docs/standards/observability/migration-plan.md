# Canonical Observability Migration Plan

## Purpose

This plan defines a safe, incremental path for aligning logging, audit
correlation, metrics, distributed tracing, health checks, alerting,
dashboards, telemetry, and monitoring with Standard 09.

It is a documentation and governance plan. It does not authorize runtime
behavior changes by itself.

## Migration Principles

- Preserve existing health, observability, staging, CI, and infrastructure
  behavior.
- Do not expose secrets or restricted content through telemetry.
- Do not treat logs as audit records.
- Keep audit immutable and independently reviewable.
- Keep observability tenant-safe and Need-to-Know aware.
- Avoid duplicate telemetry systems.
- Introduce external providers only through approved integration phases.
- Preserve operational evidence and release history.

## Phase 1 - Activate Standard 09

Actions:

1. Adopt `docs/standards/observability/overview.md` as the canonical
   observability governance entry point.
2. Reference Standard 09 from `SPEC.md`, `ROADMAP.md`, `AGENTS.md`, the
   Manifest, and Codex canonical catalogs.
3. Treat existing Observability, Platform Engineering, Security, DevSecOps,
   Backup, Workflow, AI Governance, Gateway, and Infrastructure Pack
   documents as local operational guidance.
4. Require future observability work to cite Standard 09.

Exit criteria:

- Standard 09 is referenced by central governance documents.
- No runtime changes are required.

## Phase 2 - Logging Inventory and Alignment

Actions:

1. Inventory all log sources.
2. Map log severity levels.
3. Define required structured fields.
4. Define redaction and tenant safety requirements.
5. Define log retention and export rules.
6. Identify routes, workers, scripts, and integrations without structured
   logging.

Exit criteria:

- Every log source has an owner, category, severity mapping, redaction rule,
  retention policy, and access rule.

## Phase 3 - Metrics Inventory and Dimensions

Actions:

1. Inventory all metrics.
2. Map metrics to canonical metric families.
3. Define dimensions and allowed values.
4. Define retention and aggregation windows.
5. Define alert thresholds for critical metrics.

Exit criteria:

- Metric sources and dimensions are standardized.

## Phase 4 - Trace and Correlation Propagation

Actions:

1. Define trace ID and correlation ID creation rules.
2. Define propagation through APIs, events, workflows, AI executions, scripts,
   and future workers.
3. Map spans to canonical span families.
4. Link audit records to trace and correlation identifiers.

Exit criteria:

- Trace and correlation rules are documented across request, event, job, and
  workflow boundaries.

## Phase 5 - Health Check Standardization

Actions:

1. Map existing health endpoints and scripts.
2. Define liveness, readiness, startup, dependency, database, AI provider,
   and queue health expectations.
3. Ensure health responses remain minimal and safe.
4. Define deployment verification health evidence.

Exit criteria:

- Health check requirements are canonical and safe.

## Phase 6 - Alerting and Dashboards

Actions:

1. Define alert families.
2. Define alert lifecycle.
3. Define acknowledgement, suppression, escalation, and resolution policies.
4. Map alert delivery to Notification and Communication.
5. Define dashboard categories and Need-to-Know visibility rules.

Exit criteria:

- Alerting and dashboard governance are ready for future runtime
  implementation.

## Phase 7 - Retention, Compliance and Continuous Review

Actions:

1. Define retention matrix for logs, metrics, traces, health records, alerts,
   dashboards, and audit.
2. Link observability retention to Backup, Disaster Recovery, Preservation,
   Security, and Compliance.
3. Define periodic observability coverage audits.
4. Document architecture exceptions for any component without full
   observability.

Exit criteria:

- Observability compliance becomes continuous.
- No component can bypass logging, monitoring, traceability, and audit
  requirements without approved exception.

## Non-Goals

This migration plan does not authorize:

- External APM provider integration.
- Prometheus, Grafana, Sentry, or SIEM integration.
- Runtime telemetry collector implementation.
- Alert manager runtime implementation.
- Dashboard runtime implementation.
- Database migrations.
- API changes.
- UI changes.
- Docker or staging changes.
