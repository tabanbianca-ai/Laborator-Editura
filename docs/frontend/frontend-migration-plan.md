# Frontend Migration Plan

## Purpose

This document defines the incremental path from the current frontend baseline
to the full Chapter 11 Frontend and Design System Architecture.

## Constraints

- Preserve validated Phase 7 Step 16 behavior.
- Do not rewrite the frontend globally.
- Do not change backend behavior in this documentation phase.
- Do not change API contracts, database schema, Docker, or security model in
  this documentation phase.
- Do not introduce hardcoded user-visible text.
- Do not weaken Need-to-Know navigation visibility.

## Phase 0 - Documentation Baseline

Status: Current.

Deliverables:

- `docs/ARCHITECTURE_CHAPTER_11.md`.
- `docs/frontend/frontend-architecture.md`.
- `docs/frontend/design-system.md`.
- `docs/frontend/component-catalog.md`.
- `docs/frontend/layouts.md`.
- `docs/frontend/accessibility.md`.
- `docs/frontend/i18n.md`.
- `docs/frontend/frontend-gap-analysis.md`.
- `docs/frontend/frontend-migration-plan.md`.

Outcome:

- Official Frontend and Design System architecture exists.

## Phase 1 - Design System Contract Freeze

Define stable contracts for:

- Foundation tokens.
- Button.
- Input.
- Select.
- Badge.
- Card.
- Table.
- DataTable.
- EmptyState.
- LoadingState.
- ErrorState.
- Tabs.
- Modal shell.
- PageHeader.

No visual redesign occurs in this phase.

## Phase 2 - i18n Completeness Pass

Tasks:

- Inventory hardcoded user-visible text.
- Add missing i18n keys.
- Replace hardcoded labels in loading states, editor panels, options, ARIA
  labels, empty states, errors, and action labels.
- Add route-level i18n completeness tests.

## Phase 3 - Accessibility Baseline

Tasks:

- Define WCAG 2.2 AA checklist.
- Add accessible form field pattern.
- Add modal focus management contract.
- Add color contrast checks after token expansion.
- Add keyboard navigation smoke tests.

## Phase 4 - Responsive Layout Consolidation

Tasks:

- Define official breakpoints.
- Document desktop, tablet, and mobile behavior per layout.
- Normalize overflow behavior.
- Ensure editor, pipeline, library, research, publishing, and administration
  remain usable on tablet and mobile.

## Phase 5 - Theme Tokenization

Tasks:

- Expand token model.
- Implement Light, Dark, and System token maps.
- Migrate repeated literal values into tokens.
- Validate contrast in every theme.

## Phase 6 - PWA Foundation

Tasks:

- Add manifest.
- Add install metadata.
- Define service worker strategy.
- Define offline-safe cache policy.
- Define deferred sync rules.
- Define push notification permission model.

PWA work must preserve Chapter 9 security and data classification rules.

## Phase 7 - Frontend Observability

Tasks:

- Define frontend event model.
- Track load time.
- Track JavaScript errors.
- Track component performance where practical.
- Track feature usage without exposing restricted content.
- Connect diagnostics to Observability.

## Phase 8 - Performance Standards

Tasks:

- Define route performance budgets.
- Identify large lists.
- Introduce virtualization patterns where needed.
- Audit unnecessary renders.
- Preserve accessible loading states.

## Phase 9 - Full Frontend Validation

Validation must include:

- Design System contract tests.
- i18n completeness tests.
- Accessibility tests and manual checklist.
- Responsive review.
- PWA checks when implemented.
- Frontend typecheck.
- Next production build.
- Frontend tests.
- Full available suite.

## Acceptance Criteria

Migration is complete when:

- All UI uses the Design System.
- All user-visible text uses i18n.
- All main routes are responsive.
- WCAG 2.2 AA acceptance checks pass.
- PWA foundation is available.
- Frontend API communication is centralized.
- Frontend observability exists.
- Performance budgets are defined and checked.
- Phase 7 Step 16 behavior remains intact.
