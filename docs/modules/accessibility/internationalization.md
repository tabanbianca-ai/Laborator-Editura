# Internationalization

## Purpose

Internationalization defines the engineering rules that make the platform
language-independent and capable of adding languages without changing core
application architecture.

## Required Capabilities

The platform must support:

- Externalized UI strings.
- Locale-aware formatting.
- Direction-aware layouts.
- Localized ARIA labels.
- Localized errors, empty states, and loading states.
- Localized navigation and workflow names.
- Localized AI/user-facing explanations.
- Locale-aware publication metadata.
- Translation completeness reporting.

## Current Repository Baseline

The frontend includes:

- `UiLocale` for `en`, `ro`, `es`, `fr`, `pt`, `it`, and `de`.
- `resolveUiLocale`.
- `createUiTranslator`.
- `translateRouteLabel`.
- `translateModuleTitle`.
- `translateRoleName`.
- `translateWorkflowName`.
- `translateAgentName`.
- Platform Language propagation through AppShell, TopNav, Sidebar, Dashboard,
  Pipeline, Projects, and other routes.

## Required Engineering Rules

- Internal code remains English.
- User-visible text uses localization resources.
- Components do not hardcode visible labels, aria labels, messages, buttons,
  notifications, placeholders, or helper text.
- Every localization key has an English fallback.
- Romanian remains the primary platform language.
- New languages are added through resources, not architecture changes.

## Test Requirements

Future i18n tests should verify:

- Every main route renders with every supported Platform Language.
- Missing labels fall back correctly.
- ARIA labels use localized strings.
- Locale-specific formatting is consistent.
- Platform Language never changes editorial language metadata.
- Mixed-language UI does not occur for translated surfaces.
