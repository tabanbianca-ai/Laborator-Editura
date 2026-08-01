# Canonical Workflow and Business Rules Migration Plan

## Purpose

This plan defines a safe, incremental path for aligning all workflows,
business rules, state machines, approval chains, exception policies, and
observability records with Standard 07.

It is a documentation and governance plan. It does not authorize runtime
behavior changes by itself.

## Migration Principles

- Preserve validated runtime behavior.
- Do not rename existing workflow statuses without an approved compatibility
  migration.
- Do not centralize rules by breaking module ownership.
- Use public contracts, events, or read models for cross-module dependencies.
- Keep Human Final Authority mandatory.
- Keep AI advisory unless explicitly approved and bounded by governance.
- Maintain audit history and version history.
- Avoid duplicate workflow engines.

## Phase 1 - Activate Standard 07

Actions:

1. Adopt `docs/standards/workflow-governance/overview.md` as the canonical
   workflow governance entry point.
2. Reference Standard 07 from `SPEC.md`, `ROADMAP.md`, `AGENTS.md`, the
   Manifest, and Codex canonical catalogs.
3. Treat existing module workflow documents as local operational guidance.
4. Require future workflow work to cite Standard 07.

Exit criteria:

- Standard 07 is referenced by central governance documents.
- No runtime changes are required.

## Phase 2 - Workflow Inventory and Ownership Map

Actions:

1. Inventory all editorial, AI, administrative, integration, quality,
   scheduling, backup, and approval workflows.
2. Assign one accountable owner to each workflow.
3. Record canonical identifier, version, status, trigger, input, output,
   dependencies, state machine, business rules, exceptions, and audit events.
4. Identify duplicate or overlapping workflow definitions.

Exit criteria:

- Every workflow has an owner and canonical inventory record.
- Duplicate workflow definitions have a consolidation recommendation.

## Phase 3 - Business Rule Catalog

Actions:

1. Inventory service-level and documentation-level rules.
2. Classify rules by type, scope, priority, owner, version, and exception
   policy.
3. Map rules to workflow versions.
4. Define decision tables where multi-condition logic exists.
5. Document rule impact analysis requirements for publication, rights,
   security, access, cost, and governance changes.

Exit criteria:

- Rule catalog exists.
- Critical blocking and approval rules have canonical records.

## Phase 4 - State Machine Alignment

Actions:

1. Map module-specific states to the canonical state model.
2. Identify terminal states and reopening rules.
3. Define versioned state machine records.
4. Preserve existing `DRAFT`, `IN_TRANSLATION`, `IN_QA`,
   `IN_SEMANTIC_REVIEW`, `IN_REVIEW`, `APPROVED`, `READY_FOR_EXPORT`,
   `EXPORTED`, and `BLOCKED` behavior until an approved runtime migration.

Exit criteria:

- Every workflow state has a canonical mapping.
- State machine gaps are documented.

## Phase 5 - Exception and Rollback Policies

Actions:

1. Define retry policy per workflow.
2. Define timeout policy per workflow.
3. Define compensation actions per workflow.
4. Define rollback strategy per workflow.
5. Define escalation and human intervention policy per workflow.

Exit criteria:

- Every workflow has an exception policy.
- Published and rights-sensitive workflows preserve corrective history.

## Phase 6 - Observability and Audit Linkage

Actions:

1. Define workflow execution record schema.
2. Link execution records to audit events.
3. Record decision path, rule versions, state machine versions, AI asset
   versions, event references, metrics, errors, and duration.
4. Define dashboards for stuck workflows, approvals, failures, exceptions,
   and publication blockers.

Exit criteria:

- Workflow execution observability is standardized.
- Audit remains separate and authoritative.

## Phase 7 - Continuous Compliance

Actions:

1. Add Standard 07 review to future workflow-related implementation plans.
2. Require architecture exception records for non-conforming workflows.
3. Periodically audit workflow inventory, rule catalog, state machine
   mappings, and exception policies.
4. Update module docs to reference Standard 07 during normal maintenance.

Exit criteria:

- Workflow governance becomes continuous.
- New workflows cannot bypass canonical documentation.

## Non-Goals

This migration plan does not authorize:

- Immediate database migrations.
- API changes.
- UI changes.
- Docker or staging changes.
- Workflow engine replacement.
- Removal of existing module workflow documents.
- Runtime consolidation without approved implementation scope.
