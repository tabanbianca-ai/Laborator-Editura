# Review Procedures

## Document Control

- Title: Review Procedures.
- Identifier: FRAMEWORK-09-REVIEW-PROCEDURES.
- Version: 1.0.
- Status: Active specification.
- Owner: Quality Governance.
- Reviewers: Platform Architecture, Engineering Governance, Security
  Governance, AI Governance, Documentation Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/frameworks/quality-governance/overview.md`,
  `docs/frameworks/quality-governance/architecture-review.md`.
- References: `docs/frameworks/documentation-governance/review-process.md`,
  `docs/codex/change-management.md`.
- Change history:
  - 1.0: Initial review procedure baseline.

## Purpose

This document defines the standard review procedures used by Framework 09 for
architecture, code, documentation, AI, security, operations, compliance, and
continuous improvement reviews.

## Review Types

Official review types:

- Architecture Review.
- Solution Review.
- Code Quality Review.
- Documentation Review.
- AI Quality Review.
- Security Review.
- Operational Review.
- Compliance Review.
- Release Readiness Review.
- Post-Incident or Lessons-Learned Review.

## Standard Review Workflow

```text
Review Trigger
  -> Scope Definition
  -> Evidence Collection
  -> Criteria Mapping
  -> Findings
  -> Score and Maturity Assignment
  -> Recommendations
  -> Follow-Up Actions
  -> Human Approval
  -> Audit Record
```

## Review Triggers

Reviews are triggered by:

- New module or framework.
- Significant feature addition.
- API or data model change.
- Security-sensitive change.
- AI behavior or model governance change.
- Infrastructure or deployment change.
- Release candidate.
- Incident or major defect.
- Documentation consolidation.
- Approved governance exception.

## Evidence Requirements

Review evidence may include:

- Architecture documents.
- Module documentation.
- API contracts.
- Data models.
- Tests and CI results.
- Security scans.
- Staging validation results.
- Production readiness reports.
- Audit records.
- AI evaluation records.
- Operational metrics.
- User or administrator documentation.

## Finding Classification

Findings are classified as:

- Critical.
- High.
- Medium.
- Low.
- Recommendation.

Critical findings block certification. High findings block release unless an
approved exception exists.

## Follow-Up Actions

Every required follow-up action must record:

- Owner.
- Target date or target version.
- Severity.
- Related finding.
- Validation method.
- Closure evidence.

## Review Cadence

Recommended cadence:

- Release candidates: every release.
- Security and access-sensitive areas: every major change.
- AI governance and cost controls: every major AI capability change.
- Documentation governance: every major framework or module documentation
  update.
- Operations and backup: every staging or production readiness cycle.
- Full architecture review: periodically and before major roadmap expansion.

## Human Final Authority

Review procedures may use AI assistance, but final approval, rejection,
exception acceptance, and certification decisions belong to authorized humans.

## Audit Requirements

Audit must cover:

- Review created.
- Evidence added.
- Finding recorded.
- Score changed.
- Maturity level changed.
- Exception requested.
- Exception approved or rejected.
- Finding closed.
- Certification granted or denied.
