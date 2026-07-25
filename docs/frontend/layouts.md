# Layouts

## Purpose

This document defines official frontend layout patterns.

Layouts must remain reusable, responsive, accessible, and powered by the
shared Design System.

## Official Layouts

### Authentication Layout

Purpose:

- Login.
- Password reset.
- Password change.
- Email verification.

Rules:

- Minimal navigation.
- Clear error and validation states.
- i18n-only visible text.
- Accessible forms.

Current baseline:

- `auth-shell` exists in AppShell for login and reset routes.

### Dashboard Layout

Purpose:

- Workspace overview.
- Launch readiness.
- Widgets.
- Recent activity.

Rules:

- Widget cards use shared components.
- Empty/loading/error states use shared primitives.
- Navigation remains access-aware.

### Editorial Workspace Layout

Purpose:

- Primary production environment for manuscript, translation, review, layout,
  publishing, distribution, and collaboration.

Rules:

- The manuscript remains the central object.
- Tools appear based on role, project, task, and workflow state.
- Do not duplicate specialized workspaces inside this layout.

### Reader Layout

Purpose:

- Reading content.
- Library access.
- Bookmarks, highlights, notes, and progress.

Rules:

- Reader content must not expose private or restricted data.
- Reading controls must be keyboard accessible.
- Typography must support long-form reading.

### Administration Layout

Purpose:

- Platform configuration.
- Organization, users, roles, policies, security, audit, backup, integrations,
  AI agents, and system health.

Rules:

- Maximum two navigation levels.
- Editors and production users should not work daily in Administration.
- Critical changes require confirmation.

### Public Website Layout

Purpose:

- Public catalog.
- Public reader/distribution portal.
- Public community surfaces where approved.

Rules:

- Public layout never exposes private editorial content.
- Public content must be explicitly approved for publication.
- Accessibility and responsive behavior are mandatory.

## Current Routing Baseline

The current app includes routes for:

- `/`.
- `/dashboard`.
- `/login`.
- `/reset-password`.
- `/change-password`.
- `/profile`.
- `/sessions`.
- `/projects`.
- `/projects/new`.
- `/projects/[projectId]`.
- `/documents`.
- `/workspace`.
- `/pipeline`.
- `/pipeline/[projectId]`.
- `/author-studio`.
- `/author-studio/new`.
- `/author-studio/[id]`.
- `/translation`.
- `/review`.
- `/publishing`.
- `/distribution`.
- `/research`.
- `/library`.
- `/rights`.
- `/magazine`.
- `/magazine/[issueId]`.
- `/marketplace`.
- `/admin`.
- `/administration`.
- `/editor`.
- `/translation-memory`.
- `/terminology`.
- `/qa-center`.
- `/semantic-fidelity`.
- `/workflow-center`.
- `/export-center`.
- `/reports-center`.

## Responsive Layout Rules

- Desktop may use multi-column layouts.
- Tablet may reduce to two columns or split panels.
- Mobile should use stacked or tabbed layouts.
- Business logic must not be duplicated for breakpoints.
- Horizontal overflow must be intentional and accessible.

## Navigation Rules

- Pipeline remains the primary production entry point.
- Modules remain accessible but secondary.
- Navigation labels must use i18n.
- Hidden modules must not be shown.
- Keyboard navigation must work across primary navigation.
