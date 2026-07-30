# Enterprise Architecture Technology Lifecycle

Technology Lifecycle governs how technologies are proposed, approved,
preferred, restricted, deprecated, and retired.

## Lifecycle Statuses

`PROPOSED`:

- Technology is under evaluation.
- It may not be used in production without explicit approval.

`APPROVED`:

- Technology may be used in approved contexts.
- Usage constraints must be documented.

`PREFERRED`:

- Technology is the default choice for its category.
- New work should use it unless an approved exception exists.

`RESTRICTED`:

- Technology may be used only in limited approved contexts.
- New broad adoption is blocked.

`DEPRECATED`:

- Technology should not be used for new work.
- Existing usage requires migration planning.

`RETIRED`:

- Technology is no longer allowed.
- Remaining usage is a compliance issue unless an emergency exception exists.

## Current Lifecycle Baseline

Current preferred technologies are implicitly documented:

- TypeScript for application code.
- Node.js 22 for runtime and CI.
- pnpm for dependency management.
- NestJS for API.
- Next.js and React for Web.
- PostgreSQL as primary relational database standard.
- GitHub Actions for CI.
- Docker Compose for staging deployment.

No structured technology lifecycle registry currently exists.

## Lifecycle Review Inputs

Technology lifecycle decisions should evaluate:

- Security posture.
- Maintenance status.
- Ecosystem maturity.
- Team familiarity.
- Operational complexity.
- Cost.
- Compliance.
- Performance.
- Migration effort.
- Vendor lock-in risk.

## Approval Rules

- No new technology may become `APPROVED` without architecture review.
- No technology may become `PREFERRED` without documented rationale and
  migration impact analysis.
- `DEPRECATED` and `RETIRED` decisions require migration plans.
- Exceptions require authorized approval and audit.

## Integration

Technology lifecycle records feed:

- DevSecOps build and dependency governance.
- Quality Assurance compliance checks.
- Security governance.
- AI Governance provider and model lifecycle.
- Configuration and feature flags.
- Strategic roadmap and technical debt.
