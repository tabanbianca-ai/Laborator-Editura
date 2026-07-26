# AI Validation Engine

## Purpose

The AI Validation Engine validates AI outputs before they are accepted by
calling modules or presented for human review.

Validation protects completeness, structure, terminology, consistency,
security, rights, workflow, and output contract compliance.

## Validation Checks

Required checks include:

- Output schema validation.
- Completeness.
- Required field presence.
- Language compliance.
- Terminology compliance.
- Glossary precedence.
- Semantic consistency.
- Rights and provenance restrictions.
- Workflow gate compliance.
- Human approval requirement.
- Prompt output contract compliance.
- Unsafe or unauthorized instruction detection.
- Cost and usage metadata completeness.

## Current Repository Baseline

Several domain validation systems already exist:

- QA Engine validates segment and document issues.
- Terminology validates glossary and forbidden variants.
- Semantic Fidelity validates meaning drift and semantic risk.
- Rights and Provenance validates publication and translation warnings.
- Workflow blocks high-risk transitions.
- Quality Agent governance defines readiness statuses.
- Editorial Decision recommendations require human approval.

No central AI output validation engine was identified. Current validation is
distributed across domain modules and contract tests.

## Validation Report

Each validation report should include:

- `validationReportId`.
- `aiTaskId`.
- `executionId`.
- `status`.
- `checks`.
- `issues`.
- `requiresHumanReview`.
- `validatedAt`.

Statuses:

- `PASSED`.
- `PASSED_WITH_WARNINGS`.
- `FAILED`.
- `MANUAL_REVIEW_REQUIRED`.

## Human Review Handoff

If validation indicates human review is required, the AI task must not apply
changes automatically.

The system may:

- Present a recommendation.
- Explain evidence.
- Show alternatives.
- Mark issues.
- Request authorized review.

The system must not:

- Approve.
- Publish.
- Grant rights.
- Modify security.
- Override validated terminology.
- Bypass workflow.

## Failure Handling

Invalid outputs may be:

- Rejected.
- Retried with the same prompt version.
- Retried with a different route if policy allows.
- Sent to human review.
- Marked failed with audit evidence.

Retries must not duplicate side effects.

## Future Implementation Path

1. Define shared validation report contracts.
2. Validate prompt output schema.
3. Reuse Terminology, QA, Semantic Fidelity, Rights, and Workflow checks.
4. Add audit and observability for validation.
5. Add human review handoff.
6. Expand to agent chains after single-agent validation is stable.

