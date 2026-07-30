# Localization

## Purpose

Localization governs locale-specific UI, metadata, captions, subtitles,
transcripts, publication metadata, dates, currencies, timezones, numeric
systems, text direction, and regional preferences.

## Current Repository Baseline

Current strengths:

- Platform Language is separated from Original Language, Authoring Language,
  and Target Language.
- Workspace preferences expose Platform Language.
- `apps/web/lib/ui-i18n.ts` includes initial dictionaries for Romanian,
  English, Spanish, French, Portuguese, Italian, and German.
- `docs/frontend/i18n.md` defines frontend internationalization rules.
- Shared language policy validates assisted translation target languages and
  locale separation.
- UI tests verify that Platform Language does not mutate editorial language
  metadata.

Current gaps:

- Localization resources are not stored in a central versioned runtime
  registry.
- Translation completeness is documented but not enforced for every route.
- Some ARIA labels, progress labels, page labels, placeholders, and helper
  text remain hardcoded.
- Some non-English dictionaries are fallback-style rather than complete
  translations.
- Locale-specific formatting policy is not centrally configured for every
  date, number, currency, and measurement value.

## Supported Initial Languages

Initial UI languages:

- Romanian.
- English.
- French.
- Spanish.
- Portuguese.
- Italian.
- German.

The architecture must allow additional languages without application
architecture changes.

## Locale Settings

Localization should govern:

- Platform Language.
- Fallback language.
- Date format.
- Timezone.
- Currency.
- Numeric system.
- Text direction.
- Measurement system.
- Regional preferences.

## Rules

- Platform Language controls UI only.
- Original Language, Authoring Language, and Target Language remain editorial
  metadata and are not changed by UI localization.
- User content, manuscript text, source text, target translation, quotes, and
  imported documents are not translated as UI text.
- UI localization resources must be versioned and auditable.
- Missing localization keys fall back according to approved fallback policy.
