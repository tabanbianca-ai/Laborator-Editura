# Codex v1.0 Duplication Analysis

## Purpose

This document identifies overlapping, redundant, or duplicated Codex
information for certification. It maps duplication to canonical owners without
performing destructive consolidation.

## Consolidation Principle

No information is removed before mapping, validation, owner review, approval,
history preservation, dependency preservation, and audit.

## Major Duplication Patterns

| Area | Observed duplication | Canonical owner |
| --- | --- | --- |
| Human Final Authority | Repeated in AI, workflow, review, rights, publishing, backup, security, and governance documents. | `docs/codex/canonical-definitions.md`, AI Engineering, Governance Framework |
| Need-to-Know and server-side authorization | Repeated across IAM, security, workspace, search, AI context, administration, and modules. | Standard 05 and Security Engineering |
| JSON Master and data ownership | Repeated across data governance, export, backup, publishing, integrations, and JSON docs. | Standard 02 and `docs/JSON_MASTER_FORMAT.md` |
| API, events, connectors, webhooks | Repeated across module contracts, integration docs, gateway docs, and API governance docs. | Standard 03 |
| AI assets, prompts, models, agents | Repeated across AI Governance, AI Engineering, Marketplace, Observability, and agent docs. | Standard 04 |
| Documentation as Code and traceability | Repeated across Documentation Governance, standards, reports, and root governance docs. | Standard 18 |
| Lifecycle, maturity, deprecation, retirement | Repeated across roadmap, operations, DevSecOps, release, and platform engineering docs. | Standard 19 |
| Governance, policy, risk, exceptions | Repeated across governance, compliance, quality, security, AI, and release docs. | Standard 16 |
| Architecture, dependencies, ownership | Repeated across architecture chapters, module docs, dependency registry, and data models. | Standard 17 |

## Acceptable Repetition

Safety-critical reminders may remain repeated locally when they preserve the
canonical meaning:

- AI cannot approve, publish, grant rights, change security, or bypass
  workflow.
- Authorized humans retain final authority.
- Protected data requires server-side authorization.
- Need-to-Know must be enforced.
- Tenant isolation must be preserved.
- Audit is mandatory for governance-relevant actions.
- Documentation-only phases do not authorize runtime implementation.
- Validated functionality must not be broken by cleanup.

## Non-Compliant Duplication

Future consolidation must flag:

- Competing definitions for the same role, lifecycle, status, data owner,
  workflow gate, access rule, or certification rule.
- Duplicate runtime modules with overlapping ownership.
- Similar APIs that perform the same command without a shared contract.
- Workflow definitions that duplicate state machines without referencing
  Standard 07.
- Documentation that repeats canonical rules without linking to canonical
  owners.

## Certification Conclusion

The current repository has many intentional local reminders and repeated
document structures. The canonical definition registry and Standards 01
through 20 provide the consolidation path. No destructive consolidation is
authorized by this analysis.

