# Canonical Workflow and Business Rules Baseline Audit

## Purpose

This audit inventories the current repository baseline against Standard 07:
Canonical Workflow, Process and Business Rules.

It is a documentation and governance audit. It does not change runtime
workflow behavior, APIs, database schema, Docker, infrastructure, or UI
behavior.

## Audit Date

2026-08-01.

## Baseline Inventory

| Area | Current count or evidence |
| --- | --- |
| Workflow-specific documentation | 17 documents under `docs/modules/workflow` and `docs/workflow` |
| Related process and governance documentation | 54 documents across publishing, quality assurance, AI orchestration, scheduling, platform engineering, enterprise integration, and AI engineering |
| Backend workflow and process runtime files inspected | 47 files across Workflow, QA, Semantic Fidelity, Scheduling, Policy Engine, Platform Engineering, Editorial Decisions, Export, and Layout Publishing modules |
| Searchable workflow/process documentation | 47 matching documentation files across `docs` |
| Canonical standards before Standard 07 | Standard 01 through Standard 06 |
| Canonical standards after Standard 07 | Standard 01 through Standard 07 |

## Workflow Inventory Summary

Current workflow and process foundations include:

- Editorial Production Pipeline.
- Workflow Engine v1.
- Translation workflow.
- Editorial Review workflow.
- QA validation workflow.
- Semantic Fidelity validation workflow.
- Terminology validation workflow.
- Publishing workflow.
- Export workflow.
- Preflight and Distribution readiness workflow.
- Rights and Provenance warning and authorization flow.
- AI orchestration workflow.
- Editorial Decision workflow.
- Scheduling and agenda workflow.
- Platform Engineering planning workflow.
- Backup and restore planning workflow.
- Policy evaluation and exception workflow.
- Marketplace agent enable/disable workflow.
- Administration and invitation workflows.
- Integration and webhook delivery workflow foundations.

## Business Rule Validation

Current strengths:

- Workflow v1 documents transition order and blocking rules.
- QA, Semantic Fidelity, Terminology Governance, Export, and Workflow gates
  are documented.
- Human Final Authority is consistently documented across editorial, AI,
  publication, rights, administration, policy, marketplace, media, and
  security areas.
- Rule Engine documentation already identifies that many rules are currently
  service-level rules and that configurable rule runtime is a future target.

Current gaps:

- Business rules are not yet represented in one central canonical rule
  catalog.
- Some blocking and approval rules are repeated across module documents.
- Rule priority across security, rights, quality, publication, AI cost, and
  workflow gates is not yet machine-enforced through a single rule registry.
- Rule impact analysis is documented in several areas but not uniformly tied
  to workflow versions.

## State Machine Validation

Current strengths:

- Workflow v1 defines statuses: `DRAFT`, `IN_TRANSLATION`, `IN_QA`,
  `IN_SEMANTIC_REVIEW`, `IN_REVIEW`, `APPROVED`, `READY_FOR_EXPORT`,
  `EXPORTED`, and `BLOCKED`.
- Workflow v1 defines deterministic transition order.
- Workflow v1 documents blocking rules for QA, Semantic Fidelity,
  terminology, approval, and export readiness.
- Approval state and Human Final Authority are consistently represented.

Current gaps:

- Module-level workflows use related but not always standardized lifecycle
  states.
- The canonical platform state model was not previously defined as a
  platform-wide standard.
- Terminal states such as `Rejected`, `Cancelled`, `Failed`, `Rolled Back`,
  and `Archived` are not uniformly mapped across all workflows.
- Existing state machine definitions are not yet centrally versioned.

## Dependency Analysis

Workflow dependencies currently span:

- Auth, IAM, RBAC, Need-to-Know, Founder Protection, and Platform Creator.
- Projects, Documents, Author Studio, Segments, Translations, and JSON Master.
- Translation Memory, Terminology, Lexicographic Intelligence, and Semantic
  Fidelity.
- QA, Quality Agent, Preflight, Publishing, Export, Distribution, and Public
  Portal.
- Rights and Provenance.
- AI Governance, AI Orchestration, Marketplace, and Platform Engineering.
- Scheduling, Policy Engine, Backup, Observability, Security Governance, and
  Integrations.

Current strengths:

- Most dependencies are documented at module, framework, or standard level.
- API, event, and integration governance exists through Standard 03 and the
  Enterprise Integration Framework.

Current gaps:

- Dependency chains are not yet represented as one canonical workflow
  dependency graph.
- Cross-module workflow dependencies should be mapped to public contracts,
  events, or read models before any central orchestration expansion.

## Exception Handling Review

Current strengths:

- Workflow documentation mentions blocking, idempotency, audit, and future
  engine behavior.
- Integration, Platform Engineering, Backup, Security, and Observability
  foundations include retry, health, diagnostics, and resilience concepts.

Current gaps:

- Retry, timeout, compensation, rollback, escalation, and human intervention
  policies are not uniformly documented per workflow.
- Rollback behavior for published, distributed, rights-sensitive, or legally
  relevant records must be treated as corrective history rather than silent
  mutation.
- Exception metrics are not yet unified.

## Observability Assessment

Current strengths:

- Observability foundation exists.
- Audit foundations exist.
- Workflow transitions and approvals are documented as audit events.
- Platform Engineering includes health and planning concepts.

Current gaps:

- Workflow execution records are not yet standardized across all workflow
  families.
- Decision path, rule versions, state machine versions, AI asset versions, and
  event references are not yet uniformly captured.
- Observability and audit are conceptually separated but still need runtime
  linkage in later implementation phases.

## Duplicate and Redundant Workflow Risk

Potential overlap exists across:

- Editorial Pipeline and Workflow Engine.
- Publishing workflow, Export workflow, Preflight, Distribution, and Quality
  Agent readiness.
- AI Orchestration, Platform Engineering agent coordination, Scheduling agent
  runs, and Marketplace agent governance.
- Rights and Provenance warnings, Publishing authorization, Public Portal
  release approval, and Commerce release metadata.
- Backup Governance, Platform Engineering backup planning, and runtime backup
  scripts.

Standard 07 becomes the canonical owner for process model, state machine,
business rule, approval, exception, execution observability, and workflow
audit rules. Existing module documents remain operational guidance and must
reference Standard 07 instead of creating conflicting workflow models.

## Compliance Classification

| Compliance area | Status | Notes |
| --- | --- | --- |
| Canonical workflow model | Partially compliant | Workflow docs exist; platform-wide Standard 07 now defines canonical model |
| Business rule separation | Partially compliant | Rule Engine docs exist; many runtime rules remain service-level |
| State machines | Partially compliant | Workflow v1 is explicit; cross-module state mapping future |
| Approval flows | Mostly compliant baseline | Human Final Authority is consistently documented |
| Exception handling | Partially compliant | Concepts exist; per-workflow policies need standardization |
| Observability | Partially compliant | Observability foundations exist; execution record linkage future |
| Audit | Mostly compliant baseline | Audit is a consistent platform principle; workflow audit mapping should be completed |
| Duplicate workflow reduction | Early foundation | Standard 07 assigns canonical ownership and future migration path |

## Immediate Standardization Priorities

1. Treat Standard 07 as canonical owner for workflow, process, business rule,
   state machine, approval, exception, observability, and workflow audit
   rules.
2. Preserve existing validated Workflow, QA, Semantic Fidelity, Terminology,
   Publishing, Export, Rights, AI Governance, Scheduling, Policy, Backup,
   Observability, and Editorial Pipeline behavior.
3. Inventory every workflow and map it to canonical workflow fields.
4. Inventory every blocking, approval, routing, eligibility, and compliance
   rule and map it to canonical business rule fields.
5. Map every workflow state to the canonical state model.
6. Define exception policies per workflow before runtime consolidation.
7. Link workflow execution records to observability and audit records.
