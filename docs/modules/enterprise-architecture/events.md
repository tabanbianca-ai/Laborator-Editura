# Enterprise Architecture Events

Enterprise Architecture events define the official event vocabulary for
capabilities, ADRs, technology standards, roadmap updates, technical debt,
architecture reviews, and governance policies.

## Event Rules

- Events are typed.
- Events are versioned.
- Events are auditable.
- Events do not contain secrets.
- Events preserve actor and correlation metadata where available.
- Events must respect IAM and Need-to-Know visibility.

## Official Events

### ArchitectureDecisionCreated

Payload:

- `adrId`.
- `title`.
- `createdBy`.
- `createdAt`.
- `impactedCapabilities`.

### ArchitectureDecisionApproved

Payload:

- `adrId`.
- `approvedBy`.
- `approvedAt`.
- `reviewers`.
- `implementationStatus`.

### CapabilityRegistered

Payload:

- `capabilityId`.
- `name`.
- `businessOwnerId`.
- `technicalOwnerId`.
- `lifecycleStatus`.

### CapabilityUpdated

Payload:

- `capabilityId`.
- `changedFields`.
- `updatedBy`.
- `updatedAt`.

### TechnologyApproved

Payload:

- `technologyStandardId`.
- `name`.
- `category`.
- `approvedBy`.
- `approvedAt`.
- `constraints`.

### TechnologyDeprecated

Payload:

- `technologyStandardId`.
- `name`.
- `deprecatedBy`.
- `deprecatedAt`.
- `migrationPlanReference`.

### RoadmapUpdated

Payload:

- `roadmapItemId`.
- `objective`.
- `milestone`.
- `updatedBy`.
- `updatedAt`.
- `impactedCapabilities`.

### TechnicalDebtRegistered

Payload:

- `technicalDebtId`.
- `component`.
- `priority`.
- `ownerId`.
- `targetRelease`.

### ArchitectureReviewCompleted

Payload:

- `architectureReviewId`.
- `decision`.
- `reviewers`.
- `completedAt`.
- `relatedAdrIds`.

### GovernancePolicyUpdated

Payload:

- `policyId`.
- `policyName`.
- `updatedBy`.
- `updatedAt`.
- `effectiveFrom`.

## Event Consumers

Events are consumed by:

- Workflow Engine for approval processes.
- DevSecOps for release and platform operations constraints.
- Quality Assurance for compliance gates.
- Analytics for strategic governance metrics.
- Observability for traceability.
- Configuration for standard propagation.
- IAM for governance permission visibility.

## Current Gap

The repository currently documents governance decisions in Markdown. A typed
event system for Enterprise Architecture events is not yet implemented.
