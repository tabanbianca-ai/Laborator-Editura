# Enterprise Architecture Domain Model

This document defines the conceptual domain model for Enterprise Architecture,
Portfolio and Strategic Governance. It does not authorize database schema
changes by itself. Runtime implementation must be scheduled through a future
approved phase.

## Ownership

Enterprise Architecture owns:

- Capability catalog records.
- Architecture Decision Records.
- Technology standards.
- Technology lifecycle records.
- Strategic roadmap records.
- Portfolio items.
- Architecture reviews.
- Technical debt records.
- Governance policies.
- Architecture audit events.

Enterprise Architecture does not own module runtime data, editorial content,
security identities, deployment artifacts, AI outputs, test results, or master
data records. It references those records through stable identifiers and
governs their architectural classification and compliance.

## Capability

Fields:

- `id`.
- `name`.
- `description`.
- `businessOwnerId`.
- `technicalOwnerId`.
- `maturity`.
- `strategicPriority`.
- `dependentModules`.
- `lifecycleStatus`.
- `domain`.
- `createdAt`.
- `updatedAt`.

Rules:

- Every platform module should map to one or more capabilities.
- Every capability must have a business owner and technical owner.
- Capability maturity should be reviewed periodically.

## Architecture Decision Record

Fields:

- `id`.
- `title`.
- `context`.
- `decision`.
- `alternatives`.
- `consequences`.
- `approvalDate`.
- `reviewers`.
- `implementationStatus`.
- `supersedesAdrId`.
- `createdAt`.
- `updatedAt`.

Rules:

- Major architecture decisions require ADRs.
- ADRs are append-only after approval except for status and supersession
  metadata.
- Superseded ADRs remain auditable.

## Technology Standard

Fields:

- `id`.
- `name`.
- `category`.
- `approvedUsage`.
- `constraints`.
- `status`.
- `ownerId`.
- `effectiveFrom`.
- `effectiveUntil`.
- `version`.

Rules:

- New technologies require architecture approval.
- Preferred technologies should be used before alternatives.
- Restricted, deprecated, and retired technologies require migration plans.

## Technology Lifecycle Record

Fields:

- `id`.
- `technologyStandardId`.
- `status`.
- `reason`.
- `approvedBy`.
- `approvedAt`.
- `reviewDate`.
- `migrationPlanReference`.

Lifecycle statuses:

- `PROPOSED`.
- `APPROVED`.
- `PREFERRED`.
- `RESTRICTED`.
- `DEPRECATED`.
- `RETIRED`.

## Portfolio Item

Fields:

- `id`.
- `name`.
- `type`.
- `description`.
- `ownerId`.
- `capabilityIds`.
- `roadmapReference`.
- `status`.
- `investmentPriority`.
- `riskLevel`.
- `createdAt`.
- `updatedAt`.

Portfolio item types:

- Product.
- Module.
- Service.
- Application.
- Reusable component.
- Infrastructure component.
- AI agent.

## Strategic Roadmap Item

Fields:

- `id`.
- `objective`.
- `initiative`.
- `milestone`.
- `dependencies`.
- `risks`.
- `budgetMetadata`.
- `successIndicators`.
- `targetDate`.
- `status`.
- `createdAt`.
- `updatedAt`.

Rules:

- Roadmap items must be versioned.
- Roadmap changes require audit.
- Roadmap items should link to capabilities and portfolio items.

## Technical Debt Item

Fields:

- `id`.
- `component`.
- `description`.
- `impact`.
- `priority`.
- `remediationPlan`.
- `estimatedEffort`.
- `ownerId`.
- `targetRelease`.
- `status`.
- `createdAt`.
- `updatedAt`.

Rules:

- High-risk debt must be linked to remediation plans.
- Deferred debt requires explicit owner and target release.

## Architecture Review

Fields:

- `id`.
- `requestType`.
- `scope`.
- `requestedBy`.
- `reviewers`.
- `decision`.
- `conditions`.
- `relatedAdrIds`.
- `createdAt`.
- `completedAt`.

Rules:

- Review decisions must be auditable.
- Conditional approvals require follow-up validation.

## Governance Audit Event

Fields:

- `id`.
- `organizationId`.
- `actorId`.
- `eventType`.
- `entityType`.
- `entityId`.
- `beforeState`.
- `afterState`.
- `createdAt`.

Audited actions include:

- Capability registered or updated.
- ADR created or approved.
- Technology approved, restricted, deprecated, or retired.
- Roadmap updated.
- Technical debt registered or resolved.
- Architecture review completed.
- Governance policy updated.
- Standard exception approved or rejected.
