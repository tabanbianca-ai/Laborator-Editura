# Component Library

## Purpose

The Component Library is the official inventory of reusable UI building blocks.
It translates Design Tokens into consistent interaction patterns.

All production interfaces must use the Component Library or approved derived
feature components.

## Current Component Inventory

### UI Primitives and Shared Components

Current files:

- `apps/web/components/ui/badge.tsx`.
- `apps/web/components/ui/button.tsx`.
- `apps/web/components/ui/card.tsx`.
- `apps/web/components/ui/data-table.tsx`.
- `apps/web/components/ui/empty-state.tsx`.
- `apps/web/components/ui/error-state.tsx`.
- `apps/web/components/ui/input.tsx`.
- `apps/web/components/ui/loading-state.tsx`.
- `apps/web/components/ui/modal-shell.tsx`.
- `apps/web/components/ui/page-header.tsx`.
- `apps/web/components/ui/select.tsx`.
- `apps/web/components/ui/table.tsx`.
- `apps/web/components/ui/tabs.tsx`.
- `apps/web/components/ui/index.ts`.

Canonical shared components:

- Badge.
- Button.
- Card.
- DataTable.
- EmptyState.
- ErrorState.
- Input.
- LoadingState.
- ModalShell.
- PageHeader.
- Select.
- Table.
- Tabs.

### Layout Components

Current files:

- `apps/web/components/layout/app-shell.tsx`.
- `apps/web/components/layout/navigation.ts`.
- `apps/web/components/layout/sidebar-nav.tsx`.
- `apps/web/components/layout/top-nav.tsx`.

Canonical layout components:

- AppShell.
- SidebarNav.
- TopNav.
- Navigation mapping.

### Editor Components

Current files:

- `apps/web/components/editor/editor-toolbar.tsx`.
- `apps/web/components/editor/right-panel-container.tsx`.
- `apps/web/components/editor/save-status-indicator.tsx`.
- `apps/web/components/editor/segment-list.tsx`.
- `apps/web/components/editor/source-segment-panel.tsx`.
- `apps/web/components/editor/target-translation-editor.tsx`.
- `apps/web/components/editor/translation-editor-workbench.tsx`.
- `apps/web/components/editor/workflow-status-indicator.tsx`.

Canonical editor component family:

- EditorToolbar.
- RightPanelContainer.
- SaveStatusIndicator.
- SegmentList.
- SourceSegmentPanel.
- TargetTranslationEditor.
- TranslationEditorWorkbench.
- WorkflowStatusIndicator.

### Project Components

Current files:

- `apps/web/components/projects/project-identity-form.tsx`.

Canonical project component family:

- ProjectIdentityForm.

### Page Components

Current route and page families include:

- Authentication pages.
- Dashboard.
- Projects.
- Documents.
- Author Studio.
- Translation Editor.
- Translation Workspace.
- Review Workspace.
- Publishing Workspace.
- Distribution Center.
- Research Workspace.
- Library Workspace.
- Rights Workspace.
- Magazine Digital Experience.
- Marketplace.
- Administration.
- Reports.
- QA Center.
- Semantic Fidelity.
- Workflow Center.
- Export Center.
- Translation Memory.
- Terminology Manager.
- Editorial Pipeline.
- Editorial Workspace.

Page components are orchestration surfaces. They must compose official
components instead of becoming independent component libraries.

## Required Standard Component Families

The official library must cover:

- Buttons.
- Inputs.
- Tables.
- Cards.
- Dialogs.
- Navigation.
- Menus.
- Breadcrumbs.
- Editors.
- Trees.
- Uploaders.
- Notifications.
- Dashboards.
- Charts.

## Current Missing or Partial Families

The following families are not yet fully canonicalized:

- Breadcrumb.
- Menus.
- Global command palette.
- Context navigation.
- Tree view.
- Uploaders.
- Notification/toast system.
- Chart components.
- Tooltip.
- IconButton.
- Textarea.
- Checkbox.
- Switch.
- FormField.
- StatusBanner.
- Wizard or stepper.
- Pagination.
- FilterBar.
- SearchField.

These should be added only through approved implementation phases and must
reuse tokens, i18n, accessibility rules, and component tests.

## Component Rules

- Components must be written in TypeScript with explicit props.
- Components must not contain business logic.
- Components must not fetch data unless they are explicitly documented as
  data-aware composites.
- Components must expose accessible labels and semantic roles.
- Components must support localization for all user-visible text.
- Components must support keyboard navigation where interactive.
- Components must avoid layout shift.
- Components must be reusable across modules where the interaction pattern is
  the same.
- New components must not duplicate existing components.

## Versioning

Each canonical component should eventually have:

- Component name.
- Purpose.
- Props contract.
- States.
- Accessibility notes.
- Localization notes.
- Responsive behavior.
- Token dependencies.
- Examples.
- Tests.
- Change history.

## Duplicate Component Assessment

Current risk: Medium.

Reason:

- The project has many page-level patterns that appear similar: page headers,
  status cards, tables, warning banners, filters, and detail panels.
- Shared primitives exist, but several composite patterns are still repeated
  at the page level.

Recommended consolidation:

- Promote repeated warning banners to a canonical StatusBanner.
- Promote repeated filter/search rows to FilterBar and SearchField.
- Promote repeated card-grid dashboard sections to DashboardGrid or
  WidgetCard.
- Promote repeated review/approval states to an ApprovalGate component.
- Promote repeated metadata panels to MetadataList.
