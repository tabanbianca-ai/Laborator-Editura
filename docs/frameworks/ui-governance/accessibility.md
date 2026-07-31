# Accessibility

## Purpose

Accessibility is mandatory for Laborator Editura interfaces. Every user must
be able to navigate, understand, and operate the platform as far as the product
workflow allows.

## Baseline Standard

Target accessibility baseline:

- WCAG 2.2 AA for production user interfaces.
- Keyboard navigation for all interactive controls.
- Screen reader compatible semantics.
- Visible focus indicators.
- Sufficient color contrast.
- Non-color-only status communication.
- Reduced motion support.
- Responsive layouts that preserve reading order.
- Accessible form labels and errors.

## Current Baseline

Current strengths:

- Shared UI primitives exist.
- AppShell includes a skip-to-content pattern through localization keys.
- Loading, empty, and error components exist.
- Many pages use semantic headings through PageHeader.
- Navigation is centralized.
- Responsive behavior has been implemented across main workspaces.

Current gaps:

- Platform-wide WCAG validation has not yet been automated.
- Component-level accessibility contracts are not fully documented.
- Some ARIA labels and helper text may still need localization and review.
- Complex tables need consistent caption, header, and keyboard expectations.
- Modal focus trapping and restoration should be validated.
- Reduced-motion behavior should be formalized.
- Color contrast should be measured after token expansion.

## Component Requirements

Buttons:

- Must have visible text or accessible label.
- Icon-only buttons must include accessible labels.

Inputs and forms:

- Must have labels.
- Error messages must be associated with controls.
- Required fields must be clear.

Tables:

- Must use semantic headers.
- Complex tables should include captions or accessible summaries when needed.
- Sorting and filtering controls must be keyboard accessible.

Navigation:

- Must expose landmarks.
- Current route should be identifiable.
- Hidden modules must not be present for unauthorized users.

Modals:

- Must trap focus.
- Must restore focus on close.
- Must support Escape where appropriate.
- Critical confirmations must be explicit.

Editors:

- Must support keyboard workflows.
- Save state must be perceivable.
- Source and target text relationships must be clear.
- Right panels must not trap users.

Status and warnings:

- Must include text labels.
- Must not rely on color alone.
- Critical and blocking states must be clearly announced.

## Accessibility Audit Areas

Future accessibility validation should cover:

- AppShell.
- Navigation.
- Dashboard.
- Editorial Pipeline.
- Editorial Workspace.
- Project Identity.
- Author Studio.
- Translation Workspace.
- Review Workspace.
- Publishing and Distribution.
- Rights and Provenance.
- Research.
- Library.
- Administration.
- Authentication.

## Accessibility Governance

Any new or changed UI must document:

- Keyboard behavior.
- Screen reader behavior.
- Focus behavior.
- Contrast considerations.
- Motion considerations.
- Responsive behavior.
- Known limitations.

## Standardization Plan

1. Add component-level accessibility contracts.
2. Add automated accessibility smoke checks where tooling allows.
3. Add manual WCAG review checklist for critical workflows.
4. Tokenize focus, contrast, and status colors.
5. Add reduced-motion support to motion tokens.
6. Validate modal and editor keyboard behavior.
