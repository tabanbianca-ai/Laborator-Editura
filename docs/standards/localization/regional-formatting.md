# Canonical Regional Formatting Standard

## Purpose

This document defines regional formatting rules for localized display under
Standard 11.

## Required Regional Categories

Every localization must handle:

- Date.
- Time.
- Time zone.
- Numbers.
- Decimal separators.
- Currency.
- Measurement units.
- Pluralization.
- Personal name order.
- Alphabetical sorting.
- Text direction.

## Canonical Storage Rule

Values must be stored internally in canonical formats and formatted only for
display.

Examples:

- Dates are stored as ISO-compatible values.
- Currency values preserve amount and currency code separately.
- Locale-specific separators are applied at display time.
- Time zone conversion is explicit and auditable where relevant.

## Display Rules

- Formatting must use the active Platform Language or explicitly selected
  content locale.
- Editorial content formatting must not be silently changed by UI language.
- Export formatting must use the export target locale and publication rules.
- Accessibility metadata must preserve localized formatting when read by
  assistive technology.

## Validation Rules

Regional formatting validation must check:

- Locale-aware date and time display.
- Numeric display and separators.
- Currency display.
- Unit display.
- Plural forms.
- Sorting behavior.
- Layout impact on mobile and tablet.
- Right-to-left readiness for future languages.

