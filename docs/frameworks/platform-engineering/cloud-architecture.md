# Cloud Architecture

## Purpose

Cloud Architecture defines the target environment model, platform components,
availability expectations, and scalability direction for Laborator Editura.

## Environment Model

The platform should support:

- Local development.
- CI validation.
- Staging.
- Production.
- Disaster recovery environment.

Each environment must define:

- Purpose.
- Owner.
- Access policy.
- Configuration source.
- Secret source.
- Backup policy.
- Monitoring policy.
- Deployment policy.
- Data classification.
- RPO and RTO where applicable.

## Target Cloud Components

Target components:

- Global Load Balancer.
- API Gateway.
- Kubernetes Cluster.
- Container Registry.
- Identity Provider.
- Message Broker.
- Object Storage.
- Database Cluster.
- Search Cluster.
- Cache Cluster.
- Monitoring Platform.
- Backup Platform.
- Certificate Management.
- Secret Management.

## Current Baseline

Current staging uses:

- VPS host.
- Docker Compose.
- API container.
- Web container.
- Nginx templates.
- Host-managed volumes.
- Host-managed backup and restore scripts.
- GitHub Actions for CI and staging workflows.
- Infrastructure Pack scripts and runbooks.

This is accepted for staging and early operational validation. It is not the
final production high-availability target.

## Availability Model

Production should eventually support:

- Redundant compute.
- Redundant database services.
- Redundant object storage.
- Health-checked routing.
- Automated failover where appropriate.
- Routine restore testing.
- Observability and alerting.

Staging may remain single-node while it is clearly documented as a
non-production environment.

## Scalability Model

The target platform must support:

- Horizontal scaling.
- Vertical scaling.
- Auto scaling.
- Load balancing.
- Geographic expansion.
- Capacity forecasting.

Scaling must not bypass:

- Tenant isolation.
- Data governance.
- Audit requirements.
- Cost controls.
- Security policies.

## Service Grouping

Target service groups:

- Application services.
- AI services.
- Editorial services.
- Background workers.
- Integration services.
- Monitoring stack.
- Backup and recovery services.

## Single Points of Failure

Current staging single points of failure:

- VPS host.
- Docker engine.
- Local runtime data storage.
- Local Nginx.
- Local backup destination if offsite backup is not configured.

These are acceptable for staging only. Production planning must address them.

## Standardization Plan

1. Keep Docker Compose as the accepted staging baseline.
2. Define production cloud reference architecture.
3. Define managed database and object storage targets.
4. Define load balancer and TLS termination model.
5. Define Kubernetes migration prerequisites.
6. Define high-availability and failover requirements.
7. Define production RPO and RTO.
