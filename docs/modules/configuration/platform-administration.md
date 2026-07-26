# Platform Administration

## Purpose

Platform Administration is the centralized configuration surface for
organizations, users, modules, feature flags, linguistic resources, templates,
publishing, distribution, security, audit, backup, integrations, and system
health.

Administration is a configuration center, not a daily editorial workspace.

## Current Repository Baseline

The repository already includes:

- `apps/api/src/modules/enterprise-admin` for users, roles, permissions,
  organization metadata, teams, invitations, memberships, and audit events.
- `apps/web/components/pages/administration-page.tsx` for the simplified
  Administration UI.
- Administration simplification tests that enforce the approved section model.
- Workspace role filtering and Need-to-Know access metadata.
- Security Governance, Policy Engine, AI Governance, Backup Governance,
  Observability, Gateway, Marketplace, and Workspace modules with their own
  administration metadata.

## Approved Administration Sections

Administration should expose at most two navigation levels and group settings
into:

- Organization.
- Users.
- Roles and Permissions.
- AI Agents.
- Linguistic Resources.
- Editorial Templates.
- Publishing and Distribution.
- Security.
- Audit and Backup.
- Integrations.
- System.

## Access Rules

- Administrators may see all Administration sections.
- Editors and production users should work in production workspaces, not
  Administration.
- Permissions are enforced server-side.
- UI hiding is not authorization.
- Critical changes require confirmation and audit.
- Changes must be reversible where the underlying domain allows reversal.

## Configuration Responsibilities

Platform Administration should manage:

- Global and tenant configuration.
- Environment metadata.
- Feature flags.
- Module activation.
- Branding profiles.
- Localization profiles.
- AI provider and cost policy metadata.
- Security policy metadata.
- Integration metadata.
- Backup and retention policy metadata.
- Observability and diagnostics metadata.

## AI Rules

AI may:

- Suggest settings.
- Summarize audit events.
- Detect configuration drift.
- Identify risky combinations.

AI may not:

- Grant administrator access.
- Change security policy.
- Enable production-impacting features.
- Modify secrets.
- Approve configuration changes automatically.

## Future Migration

Existing Administration and Workspace foundations should become consumers of
Configuration Service rather than independent configuration stores for shared
platform concerns.
