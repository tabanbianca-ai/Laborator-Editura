# Forms and Validation

## Purpose

Forms are the main interface for creating, editing, validating, and approving
platform data. They must be consistent, accessible, localized, and safe.

## Current Baseline

Current form surfaces include:

- Login.
- Password reset.
- Change password.
- User profile.
- Session management actions.
- Project Identity.
- Project Dossiers.
- Author Studio manuscript and section creation.
- Translation target editor.
- Research source creation.
- Library progress, bookmarks, highlights, and notes.
- Rights and Provenance forms.
- Administration configuration surfaces.

Current shared inputs:

- `Input`.
- `Select`.
- `Button`.
- `ErrorState`.
- `LoadingState`.
- `EmptyState`.
- `ModalShell`.

## Form Principles

- Validate on client when helpful.
- Validate on server as authority.
- Use uniform error messages.
- Use localized labels and validation messages.
- Use accessible labels and descriptions.
- Support keyboard navigation.
- Preserve user input when validation fails.
- Use safe confirmation for critical changes.
- Do not auto-submit, auto-approve, or auto-publish.
- Autosave may be configurable, but must expose save state clearly.

## Required Form Patterns

### Field Structure

Each field must support:

- Label.
- Control.
- Help text when needed.
- Error text.
- Required indicator.
- Disabled state.
- Read-only state.
- Accessible description linkage.

### Validation

Validation must support:

- Required fields.
- Type checks.
- Length checks.
- Enumeration values.
- ISO language metadata where relevant.
- Role and permission constraints.
- Server-side business rules.

### Errors

Error messages must be:

- Localized.
- Specific enough to guide correction.
- Safe, without leaking sensitive data.
- Associated with the field or action that caused the error.

### Autosave

Autosave must expose:

- Pending state.
- Saved state.
- Failed state.
- Last saved metadata when available.

Autosave must not replace explicit approval or publication actions.

### Critical Actions

Critical actions include:

- Approval.
- Publication.
- Rights authorization.
- Role assignment.
- Security setting changes.
- API key or secret changes.
- Restore operations.

Rules:

- Critical actions require clear confirmation.
- Critical actions must be audited.
- AI cannot perform critical approvals automatically.

## Form Accessibility

Forms must support:

- Keyboard-only operation.
- Visible focus.
- Screen reader labels.
- Error summaries for complex forms.
- Logical tab order.
- Non-color-only validation cues.

## Form Localization

All labels, placeholders, helper text, errors, buttons, and confirmations must
use localization resources. Manuscript content and translation content must not
be altered by Platform Language.

## Current Gaps

- A canonical FormField wrapper is not yet visible.
- Textarea, Checkbox, Switch, and Tooltip are not yet canonical primitives.
- Error summaries are not standardized across complex forms.
- Real-time validation patterns are not yet consistently documented per form.
- Autosave metadata patterns exist in editor contexts but are not yet
  standardized platform-wide.

## Standardization Plan

1. Add FormField, Textarea, Checkbox, Switch, and Tooltip primitives in an
   approved frontend phase.
2. Normalize validation and error handling across all form pages.
3. Add i18n completeness checks for form text.
4. Add accessibility smoke tests for required form flows.
5. Document critical action confirmation patterns.
