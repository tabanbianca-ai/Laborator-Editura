# Quality Metrics

## Document Control

- Title: Quality Metrics.
- Identifier: FRAMEWORK-09-QUALITY-METRICS.
- Version: 1.0.
- Status: Active specification.
- Owner: Quality Governance.
- Reviewers: Engineering Governance, Operations, Security Governance,
  Documentation Governance, AI Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/frameworks/quality-governance/overview.md`.
- References: `docs/ARCHITECTURE_CHAPTER_14.md`,
  `docs/modules/quality-assurance/qa-overview.md`.
- Change history:
  - 1.0: Initial quality metrics baseline.

## Purpose

This document defines the official measurable quality indicators used to
evaluate platform components, modules, frameworks, documentation, AI behavior,
security, operations, and release readiness.

## Score Model

Quality scores use a 0-100 scale:

- 90-100: Excellent.
- 75-89: Good.
- 60-74: Acceptable with actions.
- 40-59: At risk.
- 0-39: Blocked or non-compliant.

Scores must be supported by evidence. Unsupported scores are not valid.

## Core Indicators

The official quality indicators are:

- Architecture compliance.
- Documentation completeness.
- Code quality.
- AI quality.
- Operational stability.
- Security posture.
- Performance.
- Maintainability.
- Reuse rate.
- Automation level.

## Indicator Definitions

| Indicator | Definition | Evidence |
| --- | --- | --- |
| Architecture compliance | Alignment with Codex architecture, module boundaries, dependency rules, and governance. | Architecture review, dependency registry, module docs. |
| Documentation completeness | Presence and quality of required documentation, metadata, references, and change history. | Framework 08 compliance audit. |
| Code quality | Type safety, tests, modularity, lint/build health, maintainability, and low defect rate. | CI, typecheck, tests, code review. |
| AI quality | Prompt governance, evaluation, explainability, safety, cost awareness, and Human Final Authority. | AI engineering records and agent evaluations. |
| Operational stability | Health, deployment reliability, backup/restore readiness, observability, and incident readiness. | DevOps reports, staging validation, monitoring records. |
| Security posture | Authentication, authorization, tenant isolation, data protection, vulnerability management, and audit. | Security reviews, scans, access tests. |
| Performance | Latency, resource usage, build time, response time, and scalability evidence. | Benchmarks, observability, load tests where available. |
| Maintainability | Clear ownership, low coupling, predictable structure, readable code/docs, and safe migration paths. | Architecture review and code review. |
| Reuse rate | Use of canonical services, shared components, and governed abstractions instead of duplicates. | Dependency review and module review. |
| Automation level | Repeatable tests, CI, deployment validation, backup validation, and monitoring automation. | CI/CD and operational evidence. |

## Required Metric Record

Each metric entry must record:

- UUID.
- Metric name.
- Evaluated object.
- Category.
- Measurement date.
- Score.
- Evidence.
- Reviewer.
- Trend.
- Related findings.
- Follow-up actions.

## Release Thresholds

Recommended thresholds:

- Production release requires no Critical findings.
- Production release requires no unresolved High findings unless an approved
  exception exists.
- Architecture compliance should be at least 75.
- Security posture should be at least 85.
- Documentation completeness should be at least 75 for active specifications.
- Operational stability should be at least 80 for deployable components.

## Trend Management

Metrics must track:

- Current score.
- Previous score.
- Direction of change.
- Reason for change.
- Corrective actions.
- Owner.

Declining quality trends must trigger review even when absolute scores remain
above thresholds.

## AI Rules

AI may calculate draft scores, summarize evidence, identify missing metrics,
and recommend improvements. AI must not certify metrics or hide poor scores.
