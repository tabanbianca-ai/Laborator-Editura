# Workflow Permissions

## Purpose

This document defines the permission model for Workflow Engine.

All workflow actions must be authorized through central RBAC, subscription
entitlements where applicable, and Need-to-Know scope.

## Baseline Permissions

Core permissions:

- `workflow.view`.
- `workflow.view_history`.
- `workflow.start`.
- `workflow.pause`.
- `workflow.resume`.
- `workflow.cancel`.
- `workflow.configure`.
- `workflow.assign`.
- `workflow.reassign`.
- `workflow.advance`.
- `workflow.block`.
- `workflow.unblock`.
- `workflow.approve`.
- `workflow.reject`.
- `workflow.escalate`.
- `workflow.override`.
- `workflow.run_automation`.
- `workflow.request_ai_execution`.

## Task Permissions

Task permissions:

- `workflow.task.view`.
- `workflow.task.create`.
- `workflow.task.assign`.
- `workflow.task.reassign`.
- `workflow.task.complete`.
- `workflow.task.block`.
- `workflow.task.cancel`.

## Approval Permissions

Approval permissions:

- `workflow.approval.request`.
- `workflow.approval.grant`.
- `workflow.approval.reject`.
- `workflow.approval.veto`.
- `workflow.approval.override`.

AI may recommend approval but may not hold approval permissions.

## Configuration Permissions

Workflow configuration permissions:

- `workflow.definition.create`.
- `workflow.definition.update`.
- `workflow.definition.activate`.
- `workflow.definition.suspend`.
- `workflow.definition.archive`.
- `workflow.version.create`.
- `workflow.version.approve`.

Configuration changes must be audited and versioned.

## Suggested Role Mapping

Administrator:

- May configure workflow definitions.
- May view workflow history.
- May intervene when policies allow.

Project Manager:

- May start workflows.
- May assign and reassign tasks.
- May escalate blockers.

Editor:

- May advance editorial workflow stages within assigned scope.
- May approve editorial work when role and Need-to-Know scope allow it.

Reviewer:

- May review, approve, or reject assigned review tasks.

Translator:

- May complete assigned translation tasks.
- May not approve final editorial publication.

Designer:

- May complete layout, illustration, or design tasks within assigned scope.

Audio Narrator:

- May complete assigned audio tasks within assigned scope.

Author:

- May submit manuscripts and respond to assigned revision tasks.

Collaborator:

- May complete explicitly assigned scoped tasks.

Reader and Guest:

- Must not receive internal workflow execution permissions unless explicitly
  granted by a future approved flow.

Platform Creator:

- Retains protected unrestricted access according to the Platform Creator
  governance directive.

## Need-to-Know Rule

Even when a role has a permission, the action is allowed only when the user has
scope access to the project, document, manuscript, chapter, section, segment,
task, or workflow instance.

The most restrictive valid rule wins.

## Current Baseline Finding

The current workflow implementation checks authorized human roles for approval.
Several modules check permissions locally for approvals.

Future consolidation should move generic workflow authorization checks into a
shared Workflow Engine authorization layer while preserving module-owned domain
permissions.
