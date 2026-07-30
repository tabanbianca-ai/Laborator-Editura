# Compliance Policy Registry

The Policy Registry centralizes internal policies, procedures, standards,
regulatory obligations, lifecycle status, ownership, approval, and review
metadata.

## Policy Record

Each policy contains:

- `id`.
- `title`.
- `category`.
- `owner`.
- `version`.
- `effectiveDate`.
- `reviewDate`.
- `approvalStatus`.
- `lifecycleState`.

## Policy Categories

Recommended categories:

- Privacy.
- Security.
- AI governance.
- Publishing.
- Editorial governance.
- Rights and provenance.
- Data retention.
- Access control.
- DevSecOps.
- Quality assurance.
- Backup and disaster recovery.
- Integration and API governance.
- Financial or commercial controls.
- Human review and approval.

## Approval Statuses

Recommended statuses:

- `DRAFT`.
- `UNDER_REVIEW`.
- `APPROVED`.
- `REJECTED`.
- `SUPERSEDED`.
- `ARCHIVED`.

## Lifecycle States

Recommended states:

- `PROPOSED`.
- `ACTIVE`.
- `SUSPENDED`.
- `DEPRECATED`.
- `RETIRED`.

## Current Baseline

The repository currently documents policies across:

- `AGENTS.md`.
- `SPEC.md`.
- `docs/DEVELOPMENT_CONVENTIONS.md`.
- `docs/security/security-policies.md`.
- `docs/security/compliance.md`.
- `docs/modules/data-governance`.
- `docs/modules/ai-governance`.
- `docs/modules/quality-assurance`.
- `docs/modules/devsecops`.
- `docs/modules/enterprise-architecture`.

Policies are not yet centralized as versioned policy registry records.

## Governance Rules

- Policies are versioned.
- Policy changes require impact assessment.
- Approved versions remain auditable.
- Superseded policies remain visible for historical compliance.
- AI may summarize policies but may not approve them.
- Policy exceptions must be documented, approved, time-limited, and audited.

## Migration Guidance

Future implementation should:

1. Inventory existing policies from documentation.
2. Register policy records with owner and version.
3. Link policies to controls, risks, and evidence.
4. Add review reminders.
5. Add policy lifecycle events.
