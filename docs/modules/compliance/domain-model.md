# Compliance Domain Model

This document defines the conceptual domain model for Compliance, Legal
Governance and Risk Management. It does not authorize database schema changes
by itself. Runtime implementation must be scheduled through a future approved
phase.

## Ownership

Compliance owns:

- Policies.
- Policy versions.
- Risks.
- Controls.
- Compliance assessments.
- Privacy governance records.
- Consent governance records.
- Retention governance records.
- Legal holds.
- Audit engagements.
- Audit findings.
- Exceptions.
- Corrective actions.
- Compliance audit events.

Compliance does not own user identities, editorial content, legal source
documents, runtime logs, AI outputs, or publication artifacts. It references
those records through stable identifiers and governs compliance obligations,
risk, controls, evidence, and audit state.

## Policy

Fields:

- `id`.
- `title`.
- `category`.
- `ownerId`.
- `version`.
- `effectiveDate`.
- `reviewDate`.
- `approvalStatus`.
- `lifecycleState`.
- `createdAt`.
- `updatedAt`.

Rules:

- Policies are versioned.
- Approved policy versions must remain auditable.
- Policy changes require impact assessment and approval.

## Risk

Fields:

- `id`.
- `category`.
- `description`.
- `probability`.
- `impact`.
- `riskScore`.
- `mitigationPlan`.
- `ownerId`.
- `status`.
- `linkedControls`.
- `createdAt`.
- `updatedAt`.

Rules:

- Every risk must have an owner.
- High and critical risks require mitigation plans.
- Risk acceptance requires approval and review date.

## Control

Fields:

- `id`.
- `objective`.
- `controlType`.
- `frequency`.
- `ownerId`.
- `executionMode`.
- `effectiveness`.
- `linkedRisks`.
- `linkedPolicies`.
- `evidenceRequirements`.
- `createdAt`.
- `updatedAt`.

Rules:

- Controls must link to risks or policies.
- Control effectiveness must be reviewed.
- Manual controls require evidence.

## Compliance Assessment

Fields:

- `id`.
- `scope`.
- `policyIds`.
- `controlIds`.
- `assessorId`.
- `status`.
- `result`.
- `findings`.
- `evidence`.
- `startedAt`.
- `completedAt`.

Rules:

- Assessments must preserve evidence.
- Failed assessments must create findings or corrective actions.

## Privacy Governance Record

Fields:

- `id`.
- `dataCategory`.
- `classification`.
- `processingPurpose`.
- `lawfulBasis`.
- `retentionRuleId`.
- `consentRequired`.
- `ownerId`.
- `status`.

Rules:

- Privacy records must link to Data Governance classification where possible.
- Retention and logical deletion requirements must be traceable.

## Legal Hold

Fields:

- `id`.
- `scope`.
- `reason`.
- `requestedBy`.
- `approvedBy`.
- `startDate`.
- `endDate`.
- `status`.
- `affectedRecords`.

Rules:

- Legal hold overrides retention deletion.
- Legal hold changes require audit.
- Legal hold release requires authorized approval.

## Audit Engagement

Fields:

- `id`.
- `type`.
- `scope`.
- `auditorId`.
- `status`.
- `startedAt`.
- `completedAt`.
- `findings`.
- `evidence`.

Audit types:

- Internal audit.
- External audit.
- Regulatory audit.
- Security audit.
- AI governance audit.
- Privacy audit.

## Exception

Fields:

- `id`.
- `policyId`.
- `controlId`.
- `justification`.
- `riskAcceptance`.
- `requestedBy`.
- `approvedBy`.
- `expiresAt`.
- `status`.
- `monitoringPlan`.

Rules:

- Exceptions are time-limited.
- Exceptions require approval.
- Exceptions must be monitored and audited.

## Corrective Action

Fields:

- `id`.
- `findingId`.
- `description`.
- `ownerId`.
- `dueDate`.
- `status`.
- `resolutionEvidence`.
- `closedBy`.
- `closedAt`.

Rules:

- Corrective actions must have owners and due dates.
- Closure requires evidence.

## Compliance Audit Event

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

- Policy published or updated.
- Risk registered or mitigated.
- Control validated.
- Compliance assessment completed.
- Audit started or completed.
- Exception approved.
- Corrective action closed.
- Legal hold applied or released.
