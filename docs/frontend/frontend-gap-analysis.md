# Frontend Gap Analysis

## Purpose

This document compares the current repository baseline with Chapter 11 -
Frontend and Design System Architecture.

## Summary

The frontend already has a strong launch-oriented foundation: Next.js App
Router, AppShell, access-aware workspace navigation, shared UI primitives,
module screens, centralized API clients, partial i18n, responsive CSS, and
contract tests.

The target architecture requires this foundation to mature into a complete
Design System, full i18n externalization, WCAG 2.2 AA validation, PWA
capability, theme-token coverage, frontend observability, and performance
standards.

## Current Strengths

- AppShell exists and centralizes authenticated layout.
- Sidebar and TopNav consume workspace navigation metadata.
- Pipeline is visually promoted as a primary production entry point.
- Shared UI primitives and composites exist.
- Central API client uses server-side cookies and Authorization bearer tokens.
- Module-specific clients keep many backend calls out of visual components.
- Responsive CSS includes multiple breakpoints.
- Loading, empty, and error states exist across many routes.
- i18n supports seven platform languages at the type level.
- Frontend contract tests cover the main workspaces and launch readiness.

## Gaps

### Complete Design System Enforcement

Gap:

- Design tokens are present but not yet the only source of visual values.

Required alignment:

- Expand token coverage and migrate repeated literal styles into tokens.

### Full i18n Coverage

Gap:

- Some labels, loading text, editor labels, option text, ARIA labels, and
  helper text remain hardcoded.

Required alignment:

- Replace user-visible text with i18n keys and add completeness tests.

### PWA Implementation

Gap:

- No manifest, service worker, offline caching strategy, deferred sync, or push
  notification implementation is currently visible in `apps/web`.

Required alignment:

- Add PWA infrastructure in a dedicated implementation phase.

### Accessibility Validation

Gap:

- Accessibility foundations exist, but WCAG 2.2 AA is not yet validated
  platform-wide.

Required alignment:

- Add accessibility checks, keyboard testing, contrast validation, and manual
  review criteria.

### Theme Tokenization

Gap:

- Theme metadata exists, but Light, Dark, and System are not fully implemented
  through tokens across all components.

Required alignment:

- Implement full tokenized theme support.

### Frontend Observability

Gap:

- Frontend load time, JavaScript error, component performance, and interaction
  monitoring are not centralized.

Required alignment:

- Introduce privacy-aware frontend observability.

### Performance Standards

Gap:

- Code splitting comes from Next.js, but large-list virtualization and explicit
  performance budgets are not standardized.

Required alignment:

- Define budgets, add route-level performance checks, and introduce
  virtualization where data volume requires it.

## Risk Assessment

Current risk: Medium.

Reason:

- The frontend is already functional and broad.
- The largest risks are consistency and completeness rather than missing
  fundamental structure.
- Broad UI rewrites would be higher risk than incremental consolidation.

## Recommended Priority

1. Freeze Design System component contracts.
2. Complete i18n key migration for visible text.
3. Add accessibility acceptance checks.
4. Tokenize theme and visual values.
5. Add PWA foundation.
6. Add frontend observability.
7. Add performance budgets and virtualization patterns.
