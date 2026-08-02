# Disaster Recovery Standard

## Purpose

Disaster recovery restores the platform after major incidents that affect
infrastructure, data, identity, services, providers, regions, or security.

## Required DR Plan Fields

Each disaster recovery plan must define:

- Disaster scenarios.
- Critical services.
- Recovery order.
- Dependencies.
- Responsible owners.
- Communication channels.
- Alternative infrastructure.
- Emergency access.
- Activation criteria.
- Return criteria.
- Validation procedures.
- Security measures.

## Recommended Recovery Order

1. Identity and access.
2. Secrets and keys.
3. Network and base infrastructure.
4. Critical databases.
5. Master documents and rights.
6. Core services.
7. Library and publishing.
8. Integrations and notifications.
9. Search and analytics.
10. Regenerable assets.

The effective order must be validated through the dependency map.

## DR Rules

- DR must be tested periodically.
- DR must restore security before dependent business services.
- DR must not expose secrets in reports or logs.
- DR must validate data and application compatibility.
- DR activation and return must be approved and audited.
- AI may recommend DR steps but must not execute production recovery or alter
  security controls automatically.

