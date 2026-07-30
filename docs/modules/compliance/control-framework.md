# Compliance Control Framework

The Control Framework defines internal controls, objectives, frequency,
owners, execution mode, effectiveness, and risk linkage.

## Control Record

Each control defines:

- `id`.
- `objective`.
- `controlType`.
- `frequency`.
- `owner`.
- `executionMode`.
- `effectiveness`.
- `linkedRisks`.
- `linkedPolicies`.
- `evidenceRequirements`.

## Control Types

Recommended control types:

- Preventive.
- Detective.
- Corrective.
- Compensating.
- Manual.
- Automated.

## Control Frequency

Recommended frequencies:

- Continuous.
- Per request.
- Daily.
- Weekly.
- Monthly.
- Quarterly.
- Annually.
- Event-driven.

## Current Baseline

Current controls are distributed across:

- IAM and RBAC.
- Need-to-Know access.
- DevSecOps CI and deployment controls.
- Quality Assurance quality gates.
- Security hardening controls.
- Data Governance classification and retention rules.
- Backup validation controls.
- AI Governance approval constraints.
- Rights and provenance publication checks.

These controls are real but not yet centrally cataloged with control
objectives, owners, frequency, effectiveness, and evidence.

## Control Effectiveness

Recommended effectiveness statuses:

- `EFFECTIVE`.
- `PARTIALLY_EFFECTIVE`.
- `INEFFECTIVE`.
- `NOT_TESTED`.
- `NOT_APPLICABLE`.

## Governance Rules

- Controls must link to policies or risks.
- Automated controls should produce machine-readable evidence.
- Manual controls require reviewer evidence.
- Ineffective controls must create corrective actions.
- Control validation must be auditable.

## Migration Guidance

Future implementation should:

1. Inventory controls from IAM, DevSecOps, QA, Security, Data Governance, and
   AI Governance.
2. Register control owners.
3. Link controls to policies and risks.
4. Capture evidence and effectiveness.
5. Feed compliance dashboards.
