# Observability Audit

## Purpose

Audit proves what happened, who did it, when it happened, what changed, and
which authority or policy governed the action.

Observability provides correlation and read models for audit, but source
modules continue to create their own business audit records.

## Audit vs Observability

Audit answers:

- Who acted?
- What action occurred?
- Which resource changed?
- What was the result?
- What was the previous state?
- What is the new state?
- Which approval or policy governed the action?

Observability answers:

- How did the system behave?
- How long did it take?
- Which services participated?
- Which error or latency occurred?
- Which operational signal changed?

Both are required.

## Current Repository Baseline

Broad audit coverage exists across:

- Auth.
- Foundation modules.
- Workflow.
- Translation Memory.
- Terminology.
- QA.
- Semantic Fidelity.
- Editorial Decisions.
- Layout and Publishing.
- Rights.
- Security Governance.
- Policy Engine.
- Gateway and Integrations.
- Workspace.
- Launch Essentials.
- AI Cost Governance.
- Backup.
- Observability.
- Library.
- Author Studio.
- Research.
- Collaboration.
- Public Portal.
- Commerce.
- Scheduling.

Runtime backup includes these audit tables.

## Required Audit Fields

Audit records should include:

- `auditEventId`.
- `organizationId`.
- `workspaceId` when available.
- `actorId`.
- `action`.
- `resourceType`.
- `resourceId`.
- `result`.
- `beforeState`.
- `afterState`.
- `reason`.
- `policyRef`.
- `approvalRef`.
- `correlationId`.
- `traceId`.
- `ipAddress`.
- `createdAt`.

## Immutable Audit

Audit must be immutable.

Future durable storage must prevent:

- In-place modification.
- Silent deletion.
- Unauthorized retention reduction.
- Loss during backup/restore.

## Current Gaps

- Unified audit query/read model is not implemented.
- Correlation ID and trace ID are not consistent across all audit records.
- Workspace references are not consistent across all audit records.
- Immutable durable audit storage guarantees are not fully implemented.
- Alerting on suspicious audit patterns is not centralized.

## AI Rules

AI may:

- Summarize audit trails.
- Detect suspicious patterns.
- Suggest investigation steps.

AI may not:

- Alter audit records.
- Delete audit records.
- Hide errors.
- Suppress alerts automatically.
- Approve administrative changes.
