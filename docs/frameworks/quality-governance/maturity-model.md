# Maturity Model

## Document Control

- Title: Maturity Model.
- Identifier: FRAMEWORK-09-MATURITY-MODEL.
- Version: 1.0.
- Status: Active specification.
- Owner: Quality Governance.
- Reviewers: Platform Architecture, Engineering Governance, Operations,
  Documentation Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/frameworks/quality-governance/overview.md`,
  `docs/frameworks/quality-governance/quality-metrics.md`.
- References: `docs/codex/meta-architecture.md`.
- Change history:
  - 1.0: Initial maturity model baseline.

## Purpose

This document defines the five-level maturity model used to evaluate the
readiness and continuous improvement state of modules, frameworks, workflows,
operations, AI capabilities, documentation, and governance processes.

## Maturity Levels

| Level | Name | Description |
| ---: | --- | --- |
| 1 | Initial | Capability exists or is proposed, but structure, repeatability, or evidence is incomplete. |
| 2 | Managed | Capability has owner, basic process, basic documentation, and controlled execution. |
| 3 | Standardized | Capability follows canonical standards, has tests or validation, and is repeatable across teams. |
| 4 | Optimized | Capability is measured, improved, automated where practical, and integrated with quality signals. |
| 5 | Continuous Excellence | Capability is continuously monitored, audited, improved, and used as a reference pattern. |

## Assessment Dimensions

Maturity is assessed across:

- Architecture alignment.
- Process clarity.
- Documentation quality.
- Test and validation coverage.
- Security and privacy integration.
- AI governance integration.
- Operational readiness.
- Auditability.
- Automation.
- Continuous improvement.

## Level Requirements

### Level 1 - Initial

- Capability is identifiable.
- Owner may be unclear.
- Documentation may be draft or partial.
- Validation is incomplete.
- Risks may be unknown.

### Level 2 - Managed

- Owner is identified.
- Basic process exists.
- Basic documentation exists.
- Manual validation exists.
- Major risks are tracked.

### Level 3 - Standardized

- Capability follows Codex standards.
- Interfaces and responsibilities are clear.
- Documentation is complete enough for reuse.
- Tests or equivalent validation exist.
- Audit and security requirements are addressed.

### Level 4 - Optimized

- Metrics are collected.
- Improvement actions are tracked.
- Automation supports repeatability.
- Operational performance is monitored.
- Technical debt is actively reduced.

### Level 5 - Continuous Excellence

- Continuous monitoring and governance are active.
- Lessons learned feed standards.
- Quality trends are improving or stable.
- The capability can serve as a reference pattern.
- Certification evidence is complete.

## Maturity Record

Every maturity assessment must record:

- UUID.
- Evaluated object.
- Current maturity level.
- Target maturity level.
- Evidence.
- Gaps.
- Improvement actions.
- Owner.
- Reviewer.
- Review date.

## Target Baseline

Recommended targets:

- Active architecture frameworks: Level 3 or higher.
- Production-ready runtime modules: Level 3 or higher.
- Security-critical capabilities: Level 4 target.
- Release and operations capabilities: Level 4 target.
- Experimental or future planned capabilities: Level 1 or Level 2 acceptable.

## AI Rules

AI may help compare evidence against maturity criteria and propose draft
levels. Authorized human reviewers assign final maturity levels.
