# Localization and Internationalization

## Purpose

Localization governs all user-facing interface text. It ensures that the
Platform Language controls the interface without changing editorial content,
manuscript languages, original languages, authoring languages, or target
translation languages.

## Official Platform Languages

The first-stage official UI languages are:

- Romanian.
- English.
- Spanish.
- French.
- Portuguese.
- Italian.
- German.

The current frontend type baseline supports:

- `ro`.
- `en`.
- `es`.
- `fr`.
- `pt`.
- `it`.
- `de`.

Current implementation:

- `apps/web/lib/ui-i18n.ts`.

## Language Model Separation

Platform Language:

- Controls menus, buttons, labels, dialogs, notifications, administration,
  dashboard, editorial workspace, and AI conversation UI.

Original Language:

- Language of the original work.
- Must remain preserved.

Authoring Language:

- Language of the manuscript currently being edited.

Target Language:

- Language into which a translation project is translated.

Rules:

- Changing Platform Language must not change Original Language.
- Changing Platform Language must not change Authoring Language.
- Changing Platform Language must not change Target Language.
- Interface localization must not translate manuscript or publication content.

## UI Text Rules

- User-facing strings must be loaded through localization resources.
- Hardcoded UI labels, messages, menu text, button text, and notifications are
  not allowed.
- Mixed-language UI is not allowed.
- Missing keys must fall back safely to English while being tracked as a
  localization gap.
- Standard UI terminology should follow recognized localization sources first.
- Platform-specific terminology belongs to the platform terminology
  dictionary.

## Current Baseline Assessment

Strengths:

- A centralized UI i18n helper exists.
- The primary seven language codes are represented.
- Navigation labels are localized through helper functions.
- Many workflow, pipeline, dashboard, distribution, auth, role, and language
  labels already have dictionary entries.

Gaps:

- Some page-level labels, helper text, placeholder text, ARIA labels, table
  headings, and option labels may still be hardcoded.
- Translation completeness per language is not yet exposed as a governed
  report.
- Localization resource files are currently concentrated in a TypeScript
  helper rather than a dedicated resource structure.
- Automated i18n coverage checks are not yet comprehensive.

## AI Agent Localization

AI agent interfaces must use Platform Language for:

- Explanations.
- Recommendations.
- Warnings.
- Summaries.
- Conversational UI.

Translation tasks must still respect source and target language metadata.

AI output must not be treated as an official localization source without human
review.

## Localization Governance

Localization changes require:

- Key name.
- Source language value.
- Target language values.
- Standard terminology source when applicable.
- Platform terminology source when applicable.
- Context.
- Affected components.
- Review status.

## Standardization Plan

1. Extract localization resources into a scalable structure if needed.
2. Add i18n completeness tests for the seven official platform languages.
3. Replace remaining hardcoded UI strings.
4. Add a report for missing keys and fallback usage.
5. Align role labels, agent names, workflow names, and administration labels
   with the platform terminology dictionary.
