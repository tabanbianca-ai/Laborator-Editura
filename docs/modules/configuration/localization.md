# Localization Configuration

## Purpose

Localization Configuration centralizes platform language, regional settings,
fallback policy, UI translation completeness, and organization-level language
configuration.

## Current Repository Baseline

The repository already includes substantial localization foundations:

- `docs/DEVELOPMENT_CONVENTIONS.md` defines English-only implementation and
  localized user interface rules.
- `docs/frontend/i18n.md` documents frontend i18n expectations.
- `apps/web/lib/ui-i18n.ts` contains UI dictionaries for Romanian, English,
  Spanish, French, Portuguese, Italian, and German.
- Workspace preferences include `platformLanguage`.
- Shared language policy supports Original Language, Authoring Language, and
  Target Language separation.
- Frontend routes pass `platformLanguage` from workspace preferences into page
  components.

## Supported Initial UI Languages

The first-stage platform UI languages are:

- Romanian.
- English.
- Spanish.
- French.
- Portuguese.
- Italian.
- German.

Romanian remains the primary platform language.

## Localization Profile

Each profile should include:

- `id`.
- `organizationId`.
- `platformLanguage`.
- `fallbackLanguage`.
- `enabledLanguages`.
- `dateFormat`.
- `timezone`.
- `currency`.
- `measurementUnits`.
- `translationCompleteness`.
- `dictionaryVersion`.
- `status`.
- `version`.

## Language Separation

Configuration must preserve the official language model:

- Platform Language controls UI text only.
- Original Language identifies the original work.
- Authoring Language identifies the manuscript currently being edited.
- Target Language identifies translation output.

Changing Platform Language must not change Original Language, Authoring
Language, Target Language, manuscript content, or translation content.

## Rules

- User-facing text must come from the i18n system.
- Mixed-language UI is not allowed.
- Missing labels must fall back to approved fallback language behavior.
- Platform-specific terminology must come from the official terminology
  dictionary.
- Localization settings must be auditable when changed.

## Future Migration

The current frontend dictionary can remain the runtime source until a managed
Localization Profile and translation-completeness registry are implemented.
Future Administration should allow authorized users to view language status
without editing source code.
