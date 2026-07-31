# Kubernetes Platform

## Purpose

Kubernetes is the target container orchestration platform for future
production-scale deployments. It is not required for the current staging
baseline.

## Current Baseline

Current staging deployment uses Docker Compose:

- `deploy/staging/docker-compose.staging.yml`.
- `deploy/staging/Dockerfile.api`.
- `deploy/staging/Dockerfile.web`.

This remains valid for staging and closed beta validation.

## Target Kubernetes Components

Future Kubernetes architecture should include:

- Namespaces per environment or workload boundary.
- Deployments for application services.
- StatefulSets or managed services for stateful workloads where appropriate.
- Services.
- Ingress.
- ConfigMaps.
- Secrets or external secret references.
- Horizontal Pod Autoscalers.
- Pod disruption budgets.
- Network policies.
- Resource requests and limits.
- Liveness and readiness probes.
- Job and CronJob definitions.
- Observability sidecars or agents where appropriate.

## Workload Groups

Target workload groups:

- Web application.
- API application.
- AI service.
- Background workers.
- Integration workers.
- Scheduled jobs.
- Monitoring agents.
- Backup jobs.

## Kubernetes Rules

- Kubernetes manifests must be generated or maintained through approved IaC.
- Secrets must not be committed.
- Containers must expose health probes.
- Resource requests and limits are required.
- Workloads must support graceful shutdown.
- Deployments must preserve migration compatibility windows.
- Production namespaces must enforce least privilege.
- Network policies must restrict traffic.
- Logs and metrics must be collected.

## Deployment Strategies

Future Kubernetes deployment strategies may include:

- Rolling updates.
- Blue/green deployment.
- Canary deployment.
- Job-based migration execution.
- Worker drain before shutdown.

## Current Gaps

- No Kubernetes manifests exist.
- No Helm charts exist.
- No cluster definition exists.
- No service mesh exists.
- No Kubernetes secret manager integration exists.

## Migration Readiness

Before Kubernetes migration:

- Container images must be registry-published.
- Image signing strategy should be defined.
- Secret manager integration must be defined.
- Health probes must be production-ready.
- Persistent storage strategy must be defined.
- Database and object storage targets must be defined.
- Observability stack must be selected.

## Non-Goals

This document does not authorize immediate Kubernetes implementation.
