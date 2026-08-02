# Canonical Accessible Forms and Errors Standard

## Purpose

This document defines form, validation, and error messaging rules under
Standard 12.

## Form Requirements

Forms must include:

- Persistent labels.
- Instructions before data entry.
- Explicit required-field identification.
- Textual error descriptions.
- Error summary when needed.
- Programmatic association between error and field.
- Preservation of entered data after validation errors.
- Correction without progress loss.
- Confirmation for irreversible operations.

Placeholder text must not replace a field label.

## Error Requirements

Every user-facing error must:

- Be localized through Standard 11 resources.
- Identify the affected field or action.
- Explain the problem in plain language.
- Provide a recommended correction.
- Be announced to assistive technology when relevant.
- Include a correlation identifier when needed for support.

## Validation Timing

Validation should avoid unnecessary interruption while the user is still
entering data.

Errors should be presented when:

- The user leaves a field after invalid input.
- The user submits a form.
- A server-side validation failure occurs.
- A critical irreversible action needs confirmation.

## Critical Form Flows

Mandatory validation applies to:

- Login.
- Password reset.
- Profile management.
- Project creation.
- Document upload.
- Translation save.
- Review approval.
- Rights and publication authorization.
- Export and distribution readiness.

