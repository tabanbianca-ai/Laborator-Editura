# Accessibility

## Purpose

This document defines the accessibility architecture for the frontend.

The target standard is WCAG 2.2 AA.

## Required Capabilities

The frontend must support:

- Keyboard navigation.
- Visible focus.
- Screen reader compatibility.
- Semantic headings and landmarks.
- ARIA labels where semantic HTML is insufficient.
- Accessible forms.
- Accessible tables.
- Accessible dialogs.
- Accessible tabs.
- Caption and subtitle support for media.
- Alternative descriptions for visual assets.
- Scalable text.
- Adequate contrast in all themes.

## Current Baseline

Current strengths:

- AppShell includes a skip link to main content.
- Main content has an identifiable `main` region.
- Sidebar navigation uses `aria-current` for active links.
- Several panels and controls include `aria-label`.
- Tabs use `tablist`, `tab`, and `tabpanel` roles.
- Tables are wrapped in shared table components.
- CSS includes focus-visible rules for many interactive elements.
- Loading, empty, and error states are shared in several routes.

## Current Gaps

- WCAG 2.2 AA has not yet been validated through a complete audit.
- Some user-visible strings remain hardcoded, including labels used by
  assistive technology.
- Dialog focus trapping and restoration need a formal component contract.
- Form validation messages need a standard accessible pattern.
- Media captions and descriptions are architecture requirements but not yet
  fully implemented across media surfaces.
- Color contrast needs automated and manual validation after token expansion.

## Accessibility Rules

- Prefer semantic HTML over ARIA when possible.
- Every icon-only button must have an accessible label.
- Every form control must have an associated label.
- Disabled actions must expose why they are unavailable when the reason is
  not obvious.
- Error messages must be associated with the relevant control or region.
- Keyboard users must be able to reach every available action.
- Focus order must follow visual and workflow order.
- Dynamic status updates should use appropriate live regions where needed.

## Testing Strategy

Accessibility validation should include:

- Static checks where tooling is available.
- Keyboard-only manual testing.
- Screen reader smoke testing.
- Color contrast verification.
- Mobile and tablet interaction review.
- Form validation review.
- Modal/dialog focus review.

## Governance

Accessibility regressions are release blockers when they prevent:

- Authentication.
- Navigation.
- Editing.
- Saving.
- Review.
- Approval.
- Export.
- Publication readiness.
