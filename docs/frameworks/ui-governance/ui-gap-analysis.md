# UI Governance Baseline Gap Analysis

## Purpose

This document records the baseline UI/UX governance audit for Framework 02:
User Experience, Design System and UI Governance.

It consolidates findings from the current frontend implementation and existing
frontend architecture documentation.

## Audit Scope

Inspected areas:

- `apps/web/app`.
- `apps/web/components/ui`.
- `apps/web/components/layout`.
- `apps/web/components/editor`.
- `apps/web/components/pages`.
- `apps/web/components/projects`.
- `apps/web/lib/design-tokens.ts`.
- `apps/web/lib/ui-i18n.ts`.
- `apps/web/lib/module-registry.ts`.
- `docs/frontend`.
- `SPEC.md`.
- `ROADMAP.md`.
- `AGENTS.md`.
- `docs/MANIFEST.md`.
- `docs/codex/module-catalog.md`.

No application code was modified for this baseline.

## Executive Summary

The current frontend has a strong foundation for a unified editorial platform:
AppShell, centralized navigation, broad workspace coverage, shared UI
primitives, route-level pages, localization helpers, basic tokens, and
contract-test-oriented architecture.

The main risk is not missing UI coverage. The main risk is governance drift:
tokens are incomplete, some component families are not canonicalized, some UI
strings may still be hardcoded, accessibility validation is not automated
platform-wide, and repeated page-level patterns should become shared
composites.

Risk level: Medium.

## Component Inventory

Canonical current shared components:

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

Canonical current layout components:

- AppShell.
- SidebarNav.
- TopNav.
- Navigation mapping.

Canonical current editor components:

- EditorToolbar.
- RightPanelContainer.
- SaveStatusIndicator.
- SegmentList.
- SourceSegmentPanel.
- TargetTranslationEditor.
- TranslationEditorWorkbench.
- WorkflowStatusIndicator.

Canonical current project components:

- ProjectIdentityForm.

## Design System Assessment

Strengths:

- The project already has an explicit Design System concept.
- Shared primitives and composites exist.
- PageHeader, EmptyState, LoadingState, ErrorState, Badge, Button, Card,
  DataTable, Table, Select, and Tabs provide a usable foundation.
- Existing Chapter 11 documentation provides frontend architecture guidance.

Gaps:

- Component contracts are not yet versioned formally.
- Several repeated page-level patterns should be promoted to composites.
- Required component families such as breadcrumbs, uploaders, notifications,
  charts, tree views, tooltips, and command palette are not yet canonical.
- Design System compliance is not yet checked automatically.

## Design Token Review

Strengths:

- `apps/web/lib/design-tokens.ts` exists.
- Color, radius, and spacing are already represented.

Gaps:

- Typography tokens are missing.
- Shadow and elevation tokens are missing.
- Motion tokens are missing.
- Breakpoint tokens are missing.
- Status, severity, risk, and workflow state tokens are incomplete.
- Global CSS likely still contains many literal values.

## Interface Consistency

Strengths:

- Main workspaces use common UI components.
- AppShell standardizes authenticated layout.
- Pipeline and Editorial Workspace provide unified production direction.
- Loading, empty, and error components exist.

Gaps:

- Warning banners are not yet a formal shared component.
- Filter rows and search inputs vary by page.
- Metadata panels and dashboard cards could be consolidated.
- Some pages may still implement local variants of common patterns.

## Layout and Responsiveness

Strengths:

- Responsive behavior exists across many pages.
- Translation Editor has dedicated desktop, tablet, and mobile layout
  concepts.
- AppShell centralizes layout.

Gaps:

- Large-screen layout standards need stronger governance.
- Tablet optimized editor behavior should be validated visually.
- Mobile tab patterns should be standardized for complex workspaces.
- Responsive visual regression tests are not yet visible as a standard.

## Accessibility Review

Strengths:

- Shared state components support consistent status messaging.
- AppShell and navigation are centralized.
- PageHeader improves semantic page structure.

Gaps:

- WCAG 2.2 AA validation is not yet automated.
- Modal focus behavior should be verified.
- Complex table semantics should be reviewed.
- Icon-only controls need a consistent accessible-label rule.
- Contrast should be validated after token expansion.

## Localization Assessment

Strengths:

- `apps/web/lib/ui-i18n.ts` centralizes a substantial dictionary baseline.
- Seven platform languages are represented.
- Navigation labels are routed through translation helpers.

Gaps:

- Some page-level strings may still be hardcoded.
- Translation completeness reporting is not yet formalized.
- Localization resources may need a scalable file structure.
- ARIA labels, placeholders, validation errors, and helper text need complete
  i18n coverage.

## Performance Review

Strengths:

- Next.js provides route-level code splitting.
- Static shell components and page composition are modular.
- Existing clients keep API access centralized.

Gaps:

- Performance budgets are not documented as UI gates.
- Large data tables do not yet have a standard virtualization policy.
- Image optimization rules for UI assets need stronger governance.
- Frontend observability for load time and interaction errors is not yet
  standardized.

## Duplicate Component Assessment

Potential duplication areas:

- Warning banners.
- Dashboard cards.
- Metadata panels.
- Filter/search rows.
- Approval gate displays.
- Status summary panels.
- Page-specific table wrappers.

Recommended canonical components:

- StatusBanner.
- WidgetCard.
- MetadataList.
- FilterBar.
- SearchField.
- ApprovalGate.
- RouteStateBoundary.

## Standardization Roadmap

1. Freeze component contracts for existing shared components.
2. Expand Design Tokens.
3. Promote repeated page-level patterns into composites.
4. Complete i18n coverage.
5. Add accessibility acceptance checks.
6. Add responsive visual QA for critical routes.
7. Add performance budgets and large-list rules.
8. Add UI governance reporting to release readiness.

## Non-Goals

This audit does not:

- Change runtime UI.
- Change API contracts.
- Add modules.
- Add routes.
- Change Docker or staging configuration.
- Replace Chapter 11 architecture.
