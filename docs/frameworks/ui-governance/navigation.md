# Navigation Standards

## Purpose

Navigation Standards define how users move through Laborator Editura without
duplicated menus, hidden dead ends, or role-inappropriate destinations.

## Current Baseline

Current implementation:

- `apps/web/components/layout/app-shell.tsx`.
- `apps/web/components/layout/sidebar-nav.tsx`.
- `apps/web/components/layout/top-nav.tsx`.
- `apps/web/components/layout/navigation.ts`.
- `apps/web/lib/module-registry.ts`.
- `apps/web/lib/workspace-client.ts`.
- `apps/web/lib/workspace-types.ts`.

Current navigation is workspace-driven and uses backend navigation metadata.
Visible modules are filtered before rendering.

## Official Navigation Surfaces

The official navigation model supports:

- Sidebar.
- Top navigation.
- Breadcrumb.
- Search.
- Global command palette.
- Context navigation.

Not every surface must be implemented at once. When implemented, each surface
must use the same module registry, permissions model, localization rules, and
workspace visibility rules.

## Sidebar

Purpose:

- Primary authenticated navigation.
- Access to workspaces and tools visible to the current user.

Rules:

- Pipeline and Editorial Workspace should be primary production entry points.
- Administration must remain a configuration center, not a daily production
  workspace.
- Sidebar items must use localized labels.
- Hidden or unauthorized modules must not be rendered.
- Sidebar order must be controlled by workspace metadata and governance.

## Top Navigation

Purpose:

- Current route context.
- Account/session controls.
- Workspace status.
- Secondary global actions.

Rules:

- Top navigation must not duplicate the full sidebar.
- Labels must be localized.
- Session and profile actions must be clear and accessible.

## Breadcrumb

Purpose:

- Hierarchical context inside projects, manuscripts, documents, dossiers, and
  publishing flows.

Rules:

- Breadcrumbs must reflect user-visible hierarchy.
- Breadcrumb items must not expose hidden or unauthorized ancestors.
- Breadcrumbs must be localizable.

Status:

- Not yet canonicalized as a shared component.

## Search

Purpose:

- Fast access to projects, documents, library items, research, and assigned
  work.

Rules:

- Search results must respect Need-to-Know access.
- Search labels and empty states must be localized.
- Search must not reveal restricted metadata.

Status:

- Search exists in module contexts, but a global search surface is not yet
  canonicalized.

## Global Command Palette

Purpose:

- Keyboard-first access to common actions.

Rules:

- Command visibility must respect role, task, project, and permissions.
- Destructive or critical actions must require confirmation.
- Commands must be localized.

Status:

- Future standard component.

## Context Navigation

Purpose:

- Local tabs, section links, editor panels, right panels, and workflow-specific
  shortcuts.

Rules:

- Context navigation must be subordinate to the current workspace.
- It must not create alternate module entry points that bypass governance.
- It must preserve Human Final Authority for approval flows.

## Navigation Gap Analysis

Current strengths:

- AppShell exists.
- Sidebar and TopNav are centralized.
- Navigation metadata is access-aware.
- Pipeline has been promoted as a primary entry point.

Current gaps:

- Breadcrumb is not yet standardized.
- Global search is not yet standardized.
- Command palette is not yet implemented.
- Context navigation patterns vary by page.
- Navigation audit reporting is not yet standardized.

## Standardization Plan

1. Keep AppShell, SidebarNav, and TopNav as canonical.
2. Document the route registry as the source for frontend route labels and
   ordering.
3. Add a canonical Breadcrumb component in a future UI phase.
4. Add a SearchField and global search governance when backend search is ready.
5. Add command palette only after permissions and Need-to-Know checks can be
   enforced server-side.
6. Add navigation consistency checks to frontend tests.
