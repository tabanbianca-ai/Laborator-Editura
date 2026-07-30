# UI Accessibility

## Purpose

UI Accessibility ensures the Laborator Editura interface remains usable by
keyboard users, screen reader users, low-vision users, color-blind users, users
with motor impairments, and users with cognitive or reading differences.

## Required Capabilities

The interface must support:

- Keyboard navigation.
- Visible focus.
- Screen reader compatibility.
- Semantic headings and landmarks.
- ARIA labels where semantic HTML is insufficient.
- Accessible forms.
- Accessible tables.
- Accessible dialogs.
- Accessible tabs.
- Caption and subtitle support for media UI.
- Alternative descriptions for visual assets.
- Scalable text.
- Adequate contrast in all themes.
- Touch targets usable on mobile and tablet.

## Current Repository Baseline

Current strengths:

- AppShell includes a skip link to main content.
- Main content has an identifiable `main` region.
- Sidebar navigation uses `aria-current`.
- Sidebar and top navigation use localized labels.
- Several panels and controls include `aria-label`.
- Tabs use `tablist`, `tab`, and `tabpanel` roles.
- Shared UI primitives exist for key controls and states.
- CSS includes focus-visible rules.
- Main routes include loading, empty, and error states.

Current gaps:

- WCAG 2.2 AA has not been validated through a complete automated and manual
  audit.
- Some user-visible strings and assistive labels remain hardcoded.
- Dialog focus trapping and restoration require a formal component contract.
- Form validation messages need a standard accessible pattern.
- Dynamic status updates need consistent live region policy.
- Contrast validation is not yet automated across all themes and states.

## Rules

- Prefer semantic HTML over ARIA.
- Every icon-only button must have an accessible label.
- Every form control must have an associated label.
- Disabled actions must expose the reason when it is not obvious.
- Error messages must be associated with the relevant control or region.
- Keyboard users must be able to reach every available action.
- Focus order must follow visual and workflow order.
- Dynamic status updates should use live regions where appropriate.
- UI text, ARIA labels, loading messages, and error messages must use the i18n
  system.

## Release Blocking Criteria

Accessibility regressions block release when they prevent:

- Authentication.
- Navigation.
- Editing.
- Saving.
- Review.
- Approval.
- Export.
- Publication readiness.
