# Workflow Definitions

## Purpose

This document defines the target workflow definition model for Laborator
Editura.

Workflow definitions describe process templates. Workflow instances execute a
specific immutable version of a definition.

## Implemented Foundation

Migration `0009_workflow_definitions_versions_v1.sql` and the additive API
foundation implement:

- tenant-scoped workflow definitions and numbered versions;
- immutable activated version snapshots;
- ordered stages and explicit transitions;
- structured `IF`/`THEN`/`ELSE`, `AND`, `OR`, and `NOT` predicates without
  executable configuration code;
- role-restricted transitions and human approval requirements;
- instances bound to one active version for their full lifecycle;
- persisted transition, approval, and configuration audit evidence;
- project and document reference validation through existing module services.

Existing `/workflow/*` editorial gates remain authoritative and unchanged.
Configurable workflows coordinate process stages; they do not replace QA,
Semantic Fidelity, terminology, rights, export, or publishing validation.

## WorkflowDefinition

Required fields:

- `workflowDefinitionId`.
- `name`.
- `description`.
- `category`.
- `currentVersionId`.
- `status`.
- `createdBy`.
- `createdAt`.
- `updatedBy`.
- `updatedAt`.

Recommended statuses:

- `DRAFT`.
- `ACTIVE`.
- `SUSPENDED`.
- `ARCHIVED`.

## WorkflowVersion

Required fields:

- `workflowVersionId`.
- `workflowDefinitionId`.
- `version`.
- `status`.
- `stages`.
- `transitions`.
- `conditions`.
- `taskTemplates`.
- `approvalRules`.
- `notificationRules`.
- `deadlineRules`.
- `automationRules`.
- `createdBy`.
- `createdAt`.
- `approvedBy`.
- `approvedAt`.

Workflow versions are immutable after activation.

## WorkflowInstance

Required fields:

- `workflowInstanceId`.
- `workflowDefinitionId`.
- `workflowVersionId`.
- `organizationId`.
- `projectId`.
- `scopeType`.
- `scopeId`.
- `currentStageId`.
- `currentStatus`.
- `startedBy`.
- `startedAt`.
- `completedAt`.
- `blockedReason`.
- `metadata`.

The workflow version is fixed for the full instance lifecycle.

## WorkflowStage

A workflow stage must define:

- `stageId`.
- `name`.
- `order`.
- `responsibleRole`.
- `assignmentRule`.
- `permissionsRequired`.
- `entryConditions`.
- `exitConditions`.
- `estimatedDuration`.
- `sla`.
- `allowedActions`.
- `aiCapabilitiesAllowed`.
- `taskTemplates`.
- `approvalRules`.

## WorkflowTransition

A workflow transition must define:

- `transitionId`.
- `fromStageId`.
- `toStageId`.
- `action`.
- `conditions`.
- `permissionsRequired`.
- `blockingRules`.
- `eventName`.
- `auditAction`.

## WorkflowCondition

Supported logical operators:

- `IF`.
- `THEN`.
- `ELSE`.
- `AND`.
- `OR`.
- `NOT`.

Conditions may reference domain results such as QA status, Semantic Fidelity
status, rights status, export readiness, or publishing preflight status.

Conditions must not duplicate the domain validation logic.

## WorkflowTask Template

A workflow task template must define:

- `title`.
- `description`.
- `assignmentRule`.
- `defaultPriority`.
- `deadlineRule`.
- `allowedActions`.
- `completionConditions`.
- `visibilityRules`.

## Default Workflow Families

The architecture supports at least:

- Translation Workflow.
- Review Workflow.
- Publishing Workflow.
- Magazine Workflow.
- Children's Book Workflow.
- Audiobook Workflow.
- Video Workflow.
- Rights Review Workflow.
- Quality Preflight Workflow.

These are definition families, not hardcoded implementation branches.

## Configuration Without Code

Workflow definitions, stages, transitions, conditions, assignments, deadlines,
notifications, and automation rules must be configurable without code after the
Workflow Engine is fully implemented.

The current foundation makes definitions, stages, transitions, conditions, and
role approvals configurable. Task templates, assignments, deadlines,
notifications, escalations, and automation execution remain future incremental
work.
