# Codex Governance Events

Codex Governance events define the official event vocabulary for Codex
versions, modules, dependencies, reference models, governance policies,
architecture reviews, audits, and exceptions.

## Event Rules

- Events are typed.
- Events are versioned.
- Events are auditable.
- Events do not contain secrets.
- Events preserve actor and correlation metadata where available.
- Events must respect IAM and Need-to-Know visibility.

## Official Events

### CodexVersionPublished

Payload:

- `codexVersion`.
- `publishedBy`.
- `publishedAt`.
- `includedDocuments`.
- `compatibilityNotes`.

### ModuleApproved

Payload:

- `moduleId`.
- `moduleName`.
- `approvedBy`.
- `approvedAt`.
- `version`.

### ModuleDeprecated

Payload:

- `moduleId`.
- `moduleName`.
- `deprecatedBy`.
- `deprecatedAt`.
- `migrationPlan`.

### ArchitectureReviewStarted

Payload:

- `reviewId`.
- `scope`.
- `requestedBy`.
- `startedAt`.

### ArchitectureReviewCompleted

Payload:

- `reviewId`.
- `decision`.
- `reviewers`.
- `completedAt`.
- `conditions`.

### DependencyUpdated

Payload:

- `dependencyId`.
- `source`.
- `target`.
- `dependencyType`.
- `updatedBy`.
- `updatedAt`.

### ReferenceModelChanged

Payload:

- `referenceModelId`.
- `version`.
- `changedBy`.
- `changedAt`.
- `compatibilityImpact`.

### GovernancePolicyChanged

Payload:

- `policyId`.
- `version`.
- `changedBy`.
- `changedAt`.

### CodexAuditCompleted

Payload:

- `auditId`.
- `scope`.
- `result`.
- `completedAt`.
- `findings`.

### ArchitectureExceptionApproved

Payload:

- `exceptionId`.
- `scope`.
- `approvedBy`.
- `approvedAt`.
- `expiresAt`.

## Consumers

Codex events may be consumed by:

- Enterprise Architecture.
- Compliance.
- Quality Assurance.
- DevSecOps.
- Observability.
- Analytics.
- Workflow Engine.
- IAM.
