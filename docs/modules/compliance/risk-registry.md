# Compliance Risk Registry

The Risk Registry centralizes operational, technology, AI, editorial, legal,
privacy, publication, and security risks.

## Risk Record

Each risk contains:

- `id`.
- `category`.
- `description`.
- `probability`.
- `impact`.
- `riskScore`.
- `mitigationPlan`.
- `owner`.
- `status`.
- `linkedControls`.

## Risk Categories

Recommended categories:

- Operational risk.
- Technology risk.
- AI risk.
- Editorial risk.
- Legal risk.
- Privacy risk.
- Security risk.
- Publication risk.
- Data governance risk.
- Integration risk.
- Infrastructure risk.
- Business continuity risk.

## Risk Scoring

Risk score should be derived from:

- Probability.
- Impact.
- Control effectiveness.
- Exposure duration.
- Regulatory sensitivity.
- Publication or user impact.

Recommended score bands:

- `LOW`.
- `MEDIUM`.
- `HIGH`.
- `CRITICAL`.

## Risk Statuses

Recommended statuses:

- `IDENTIFIED`.
- `ASSESSED`.
- `MITIGATION_PLANNED`.
- `MITIGATING`.
- `ACCEPTED`.
- `TRANSFERRED`.
- `MITIGATED`.
- `CLOSED`.

## Current Baseline

Risk information currently appears in:

- `docs/operations/risk-management.md`.
- Production readiness reports.
- Staging validation reports.
- Module gap analyses.
- Security documentation.
- Backup and disaster recovery documentation.
- AI Governance documentation.

The repository does not yet contain a centralized structured risk registry.

## Governance Rules

- Every risk must have an owner.
- High and critical risks require mitigation plans.
- Accepted risk requires authorized approval and review date.
- AI may identify and summarize risks but may not accept or close risks.
- Risk changes must be auditable.

## Migration Guidance

Future implementation should:

1. Convert known risk items into registry records.
2. Link risks to controls and policies.
3. Link risks to modules, capabilities, and roadmap items.
4. Add risk trend reporting through Analytics.
5. Add risk evidence through Observability and Quality Assurance.
