# Localization Baseline

## Supported First-Stage Platform Locales

| Language | Locale files |
| --- | --- |
| Romanian | `packages/shared/locales/ro-RO/common.json` |
| English | `packages/shared/locales/en-US/common.json`, `packages/shared/locales/en-GB/common.json` |
| Spanish | `packages/shared/locales/es-ES/common.json` |
| French | `packages/shared/locales/fr-FR/common.json` |
| Portuguese | `packages/shared/locales/pt-PT/common.json`, `packages/shared/locales/pt-BR/common.json` |
| Italian | `packages/shared/locales/it-IT/common.json` |
| German | `packages/shared/locales/de-DE/common.json` |

## Canonical Rules

- Technical keys remain English.
- Romanian is the primary platform locale.
- English is the fallback locale for missing values.
- Platform Language controls UI text only.
- Original Language, Authoring Language, Target Language, manuscript content, and
  translation content are not changed by UI localization.

## Known Gap

Existing frontend screens still contain hardcoded UI labels from earlier phases. Batch
01 creates the localization foundation and validates common resources; full migration is
a later dedicated UI cleanup.

