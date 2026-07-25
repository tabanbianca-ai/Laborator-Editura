# Accessibility Testing

## Purpose

Accessibility testing verifies that the platform remains usable by people with
different accessibility needs and supports WCAG 2.2 AA targets.

## Required Accessibility Checks

- Keyboard navigation.
- Focus visibility.
- Focus order.
- ARIA labels and roles.
- Semantic headings.
- Form labels.
- Table accessibility.
- Contrast.
- Text sizing.
- Screen reader landmarks.
- Mobile and touch targets.

## Current Baseline

Current frontend tests cover route shells, UI contracts, i18n, navigation,
workspace states, and launch readiness. Frontend architecture documentation
defines WCAG 2.2 AA as the target.

Automated accessibility testing with a dedicated engine is not yet configured.

## Required Future Coverage

- Add automated accessibility checks for main routes.
- Add keyboard navigation smoke tests.
- Add color contrast validation.
- Add manual accessibility checklist for release.
- Add regression tests for critical accessibility bugs.

## Acceptance Criteria

- Critical accessibility failures block release.
- All main workflows remain keyboard accessible.
- User-visible labels are localizable and screen-reader safe.
- Mobile touch targets are usable.
