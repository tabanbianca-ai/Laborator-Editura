# Compliance Events

Compliance events define the official event vocabulary for policies, risks,
controls, assessments, audits, exceptions, corrective actions, retention, and
legal hold.

## Event Rules

- Events are typed.
- Events are versioned.
- Events are auditable.
- Events do not contain secrets.
- Events preserve actor and correlation metadata where available.
- Events must respect IAM and Need-to-Know visibility.

## Official Events

### PolicyPublished

Payload:

- `policyId`.
- `version`.
- `publishedBy`.
- `publishedAt`.
- `effectiveDate`.

### PolicyUpdated

Payload:

- `policyId`.
- `version`.
- `changedFields`.
- `updatedBy`.
- `updatedAt`.

### RiskRegistered

Payload:

- `riskId`.
- `category`.
- `riskScore`.
- `ownerId`.
- `registeredBy`.
- `registeredAt`.

### RiskMitigated

Payload:

- `riskId`.
- `mitigationPlan`.
- `mitigatedBy`.
- `mitigatedAt`.

### ControlValidated

Payload:

- `controlId`.
- `effectiveness`.
- `validatedBy`.
- `validatedAt`.
- `evidenceReferences`.

### ComplianceAssessmentCompleted

Payload:

- `assessmentId`.
- `scope`.
- `result`.
- `completedBy`.
- `completedAt`.
- `findings`.

### AuditStarted

Payload:

- `auditId`.
- `type`.
- `scope`.
- `auditorId`.
- `startedAt`.

### AuditCompleted

Payload:

- `auditId`.
- `result`.
- `completedAt`.
- `findings`.
- `recommendations`.

### ExceptionApproved

Payload:

- `exceptionId`.
- `policyId`.
- `approvedBy`.
- `approvedAt`.
- `expiresAt`.

### CorrectiveActionClosed

Payload:

- `correctiveActionId`.
- `closedBy`.
- `closedAt`.
- `evidenceReferences`.

## Future Events

Future implementation may add:

- `LegalHoldApplied`.
- `LegalHoldReleased`.
- `RetentionPolicyUpdated`.
- `PrivacyAssessmentCompleted`.
- `ConsentPolicyUpdated`.

## Event Consumers

Events are consumed by:

- IAM.
- Data Governance.
- AI Governance.
- DevSecOps.
- Quality Assurance.
- Analytics.
- Workflow Engine.
- Configuration.
- Observability.
- Functional modules with compliance obligations.
