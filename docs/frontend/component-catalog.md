# Component Catalog

## Purpose

This document inventories the current frontend component baseline and assigns
each component family to the target Chapter 11 component hierarchy.

## Foundation

Current files:

- `apps/web/lib/design-tokens.ts`.
- `apps/web/app/globals.css`.

Current status:

- Basic tokens exist.
- Global CSS contains most layout and component styling.

Target:

- Expand tokens.
- Reduce duplicated literal values.
- Make theme behavior token-driven.

## Shared UI Components

Current shared UI files:

- `components/ui/badge.tsx`.
- `components/ui/button.tsx`.
- `components/ui/card.tsx`.
- `components/ui/data-table.tsx`.
- `components/ui/empty-state.tsx`.
- `components/ui/error-state.tsx`.
- `components/ui/input.tsx`.
- `components/ui/loading-state.tsx`.
- `components/ui/modal-shell.tsx`.
- `components/ui/page-header.tsx`.
- `components/ui/select.tsx`.
- `components/ui/table.tsx`.
- `components/ui/tabs.tsx`.

Target:

- Keep all shared UI text translatable where user-visible.
- Ensure every component has accessibility expectations.
- Add missing primitives incrementally when needed.

## Layout Components

Current layout files:

- `components/layout/app-shell.tsx`.
- `components/layout/sidebar-nav.tsx`.
- `components/layout/top-nav.tsx`.
- `components/layout/navigation.ts`.

Target:

- Keep AppShell as the primary authenticated application shell.
- Add breadcrumb/global search/favorites/recent history only through approved
  phases.
- Keep navigation visibility backend-driven and access-aware.

## Editor Components

Current editor files:

- `components/editor/editor-toolbar.tsx`.
- `components/editor/right-panel-container.tsx`.
- `components/editor/save-status-indicator.tsx`.
- `components/editor/segment-list.tsx`.
- `components/editor/source-segment-panel.tsx`.
- `components/editor/target-translation-editor.tsx`.
- `components/editor/translation-editor-workbench.tsx`.
- `components/editor/workflow-status-indicator.tsx`.

Target:

- Externalize remaining editor labels.
- Preserve desktop/tablet/mobile layouts.
- Keep save state, workflow state, TM, terminology, QA, semantic, workflow,
  and export panels modular.

## Page Components

Current page component families:

- Authentication pages.
- Dashboard.
- Projects and project identity.
- Documents.
- Author Studio.
- Translation workspace.
- Review workspace.
- Publishing workspace.
- Distribution Center.
- Research workspace.
- Library workspace.
- Rights workspace.
- Marketplace.
- Administration.
- Editorial Pipeline.
- Editorial Workspace.
- Magazine Digital Experience.
- QA, Semantic Fidelity, Workflow, Export, Reports, Terminology, and
  Translation Memory surfaces.

Target:

- Normalize PageHeader usage.
- Normalize loading, empty, and error states.
- Reduce repeated card/grid patterns through composite components.
- Ensure all user-visible text uses i18n.

## Client and Action Layer

Current files:

- `lib/api-client.ts`.
- `lib/*-client.ts`.
- `lib/*-actions.ts`.
- `lib/workspace-client.ts`.
- `lib/workspace-types.ts`.

Target:

- Keep backend communication out of visual primitives.
- Keep typed clients as the single frontend API boundary.
- Standardize error and result models.

## Test Coverage

Current frontend contract tests cover:

- Frontend shell.
- Core module screens.
- Authentication localization.
- UI internationalization.
- Editorial pipeline.
- Editorial workspace.
- Project identity and taxonomy.
- Rights, publishing, distribution, research, library, translation, review,
  magazine, administration, and launch readiness.

Target:

- Add design-system contract tests.
- Add i18n completeness tests.
- Add accessibility smoke tests.
- Add route responsiveness checks where tooling is available.
