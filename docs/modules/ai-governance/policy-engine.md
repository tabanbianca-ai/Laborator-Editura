# AI Policy Engine

## Purpose

The AI Policy Engine defines the rules that govern model usage, prompt usage,
provider routing, data classification, autonomy, cost limits, token limits,
approvals, retention, and human oversight.

AI Orchestration must validate every AI request against active AI policies
before execution.

## Policy Scope

Policies may define:

- Allowed models.
- Forbidden models.
- Allowed providers.
- Forbidden providers.
- Cost limits.
- Token limits.
- Data classification rules.
- Required approvals.
- Autonomy levels.
- External provider usage.
- Prompt retention.
- Response retention.
- Evaluation requirements.
- Benchmark requirements.
- Human review requirements.

## Policy Record

Each policy must include:

- `policyId`.
- `organizationId`.
- `name`.
- `description`.
- `policyType`.
- `version`.
- `status`.
- `scope`.
- `rules`.
- `createdBy`.
- `approvedBy`.
- `effectiveFrom`.
- `effectiveUntil`.
- `createdAt`.
- `updatedAt`.

Statuses:

- `DRAFT`.
- `ACTIVE`.
- `SUSPENDED`.
- `ARCHIVED`.

## Policy Validation Flow

```text
AI Request
  -> Actor and Tenant Context
  -> Data Classification Check
  -> Model and Provider Policy Check
  -> Prompt Policy Check
  -> Cost and Quota Check
  -> Human Review Requirement Check
  -> Execution Allowed or Blocked
  -> Audit
```

## Current Repository Baseline

Current implementation:

- AI Governance stores cost policies with soft warnings, hard-limit metadata,
  approval thresholds, warning thresholds, and override rules.
- Budgets, quotas, usage records, and override requests are persisted and
  audited.
- AI Provider fallback and recovery status is represented.
- Policy Engine and Enterprise Policy documentation define broader compliance
  foundations.

Current gaps:

- No complete AI policy runtime model exists.
- No model allow/deny policy exists.
- No prompt allow/deny policy exists.
- No data classification AI usage policy exists.
- No AI autonomy level policy exists.
- No retention policy enforcement exists for prompts and responses.

## Human in the Loop

Policies may require:

- Editorial approval.
- Legal approval.
- Human review.
- Double validation.
- Mandatory justification.
- Security review.

AI cannot satisfy its own approval requirement.

## Audit Events

Audit:

- Policy created.
- Policy activated.
- Policy updated.
- Policy suspended.
- Policy archived.
- Policy evaluated.
- Policy violation detected.
- Human review required.
- AI request blocked.

## AI Rules

AI may:

- Suggest policy changes.
- Explain policy impact.
- Detect policy conflicts.

AI may not:

- Activate policies.
- Approve exceptions.
- Disable restrictions.
- Bypass hard limits.
