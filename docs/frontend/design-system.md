# Design System

## Purpose

The Design System is the official source of visual and interaction standards
for Laborator Editura.

No production screen should invent isolated visual patterns when an existing
Design System primitive, composite, token, or layout rule can be used.

## Design System Layers

### Foundation

Foundation includes:

- Color tokens.
- Typography tokens.
- Spacing tokens.
- Radius tokens.
- Shadow tokens.
- Grid rules.
- Focus states.
- Motion tokens.
- Iconography rules.

Current baseline:

- `apps/web/lib/design-tokens.ts` defines a small token set for color, radius,
  and spacing.
- `apps/web/app/globals.css` contains the main CSS implementation and
  responsive behavior.

Target:

- Move repeated literal CSS values into named tokens.
- Keep all themes token-driven.
- Maintain accessible contrast in every theme.

### Primitive Components

Current primitive and base UI components:

- `Button`.
- `Input`.
- `Badge`.
- `Card`.
- `Table`.
- `EmptyState`.
- `LoadingState`.
- `ErrorState`.
- `Select`.

Target additions:

- Label.
- Checkbox.
- Switch.
- Avatar.
- Textarea.
- Tooltip.
- IconButton.
- FormField.

### Composite Components

Current composite components:

- `DataTable`.
- `Tabs`.
- `ModalShell`.
- `PageHeader`.
- Sidebar navigation.
- Top navigation.
- Editor toolbar.

Target additions:

- Breadcrumb.
- Toolbar standard.
- Wizard.
- Pagination.
- FilterBar.
- SearchField.
- StatusBanner.
- Stepper.

### Feature Components

Current feature component families:

- Translation Editor.
- Editorial Pipeline.
- Editorial Workspace.
- Project Identity and Dossiers.
- Author Studio.
- Review Workspace.
- Publishing and Distribution.
- Research Workspace.
- Library Workspace.
- Rights Workspace.
- Magazine Digital Experience.
- Administration.
- Reports and QA/Semantic pages.

Feature components must use shared primitives and composites.

## Visual Consistency Rules

- Use PageHeader for page titles and primary actions.
- Use Card only for discrete grouped content, not as nested page sections.
- Use Button variants consistently.
- Use Badge for status, severity, risk, and metadata labels.
- Use EmptyState, LoadingState, and ErrorState for all asynchronous views.
- Use DataTable or Table for structured tabular data.
- Use Tabs for mutually exclusive local views.
- Use the same warning banner pattern for rights, workflow, and publication
  blockers.

## Theme Rules

Supported themes:

- Light.
- Dark.
- System.

Theme implementation must use tokens. Components must not hardcode theme
specific values independently.

## Accessibility Rules

Design System components must provide:

- Keyboard support.
- Visible focus.
- Accessible labels.
- Correct semantic roles.
- State announcements where needed.
- Sufficient contrast.

## Governance

Design System changes require:

- Reason.
- Affected components.
- Accessibility impact.
- i18n impact if text is involved.
- Responsive impact.
- Migration notes.
