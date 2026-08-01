# Canonical Localization Key Conventions

## Purpose

This document defines naming rules for localization keys under Standard 11.

## Key Language

Localization keys are written in English.

Keys describe meaning, not visual location.

## Correct Key Examples

```text
library.actions.create_book
authentication.errors.invalid_credentials
publishing.status.ready_for_publication
work_table.tasks.assigned_to_me
```

## Incorrect Key Examples

```text
button_1
label_left
text_final
romanian_title
```

## Stability Rules

- Published keys must not be renamed without compatibility analysis.
- Key removal requires usage analysis and migration planning.
- Duplicate keys with different meanings are not allowed.
- Different keys with identical meaning should be consolidated after review.
- Keys must remain stable across web, PWA, tablet, and future mobile clients.

## Key Structure

Recommended structure:

```text
namespace.area.intent.variant
```

Examples:

- `authentication.actions.login`.
- `authentication.errors.invalid_credentials`.
- `project.identity.rights_status`.
- `publishing.preflight.blocked`.
- `media.subtitles.generate`.

## Dynamic Values

Localized strings with variables must:

- Use named placeholders.
- Preserve placeholder names across locales.
- Support pluralization rules.
- Avoid concatenating partial sentences in UI code.
- Be validated for missing or extra variables.

## Forbidden Patterns

- UI labels embedded directly in components.
- Raw backend messages displayed to users.
- Translation keys shown in production.
- Keys named after layout position.
- Locale-specific terms embedded in key names.

