# Networking

## Purpose

Networking standards define how traffic reaches platform services and how
services communicate securely, observably, and reliably.

## Target Network Flow

```text
Users
  -> DNS
  -> Global Load Balancer
  -> TLS Termination
  -> API Gateway / Ingress
  -> Application Services
  -> Internal Services
```

## Current Baseline

Current staging networking includes:

- Host-level Docker networking.
- Docker Compose service network.
- API service port.
- Web service port.
- Nginx templates for reverse proxy configuration.
- Health check scripts.
- UFW baseline scripts.
- SSH hardening scripts.

## Network Zones

Target network zones:

- Public edge.
- Application zone.
- Internal service zone.
- Data zone.
- Management zone.
- Backup zone.
- Monitoring zone.

## Security Rules

- Public access must be limited to approved endpoints.
- Administrative access must use strong authentication.
- SSH must use keys and hardened configuration.
- Firewall policy must be explicit.
- Database and internal services must not be exposed publicly.
- Service-to-service access must be least privilege.
- Network changes must be audited.

## TLS and Certificates

Certificate management must define:

- Issuer.
- Domain coverage.
- Renewal process.
- Expiration monitoring.
- Rotation procedure.
- Emergency replacement procedure.
- Audit record.

## Service Mesh

Service mesh is a future production capability.

When implemented, it should support:

- Mutual TLS.
- Service identity.
- Traffic policy.
- Retries.
- Circuit breaking.
- Observability.
- Policy enforcement.

Service mesh is not required for current staging.

## Current Gaps

- No global load balancer exists.
- No production ingress architecture is implemented.
- No service mesh exists.
- Certificate lifecycle automation is not fully centralized.
- Network topology is not yet represented as structured IaC.

## Standardization Plan

1. Preserve existing staging network scripts and Nginx templates.
2. Define production DNS and TLS model.
3. Define ingress/API gateway model.
4. Define internal service access policy.
5. Define service mesh readiness criteria.
6. Add network change audit requirements.
