# Canonical Internationalization, Localization and Terminology Standard

## Document Control

| Field | Value |
| --- | --- |
| Standard | Standard 11 |
| Identifier | STANDARD-11-LOCALIZATION |
| Version | 1.0.0 |
| Status | Active specification |
| Owner | Localization, Terminology and Inclusive Experience Governance |
| Applies to | Internationalization, localization, terminology, regional formatting, multimedia localization, localized user messages |
| Related standards | Standard 01, Standard 02, Standard 03, Standard 04, Standard 05, Standard 06, Standard 07, Standard 08, Standard 09, Standard 10 |

## Purpose

This standard defines the mandatory canonical rules for
internationalization, localization, and terminology management in Laborator
Editura.

It establishes clear separation between:

- Source code and technical identifiers.
- User-facing text.
- Interface translations.
- Editorial terminology.
- Publication content.
- Regional formats.
- Multimedia localization assets.

Technical implementation remains English. The user interface must display the
active Platform Language only.

## Relationship to Other Standards and Frameworks

This standard complements:

- `docs/DEVELOPMENT_CONVENTIONS.md`, which defines internal English and
  localized UI rules.
- `docs/frameworks/ui-governance/localization.md`, which defines UI
  localization behavior.
- `docs/modules/accessibility/accessibility-overview.md`, which defines
  inclusive multilingual experience expectations.
- `docs/standards/data-model/overview.md`, which defines canonical metadata
  and schema rules.
- `docs/standards/digital-assets/overview.md`, which defines localized
  content and media asset relationships.
- `docs/standards/testing-validation/overview.md`, which defines release
  gates for localization and accessibility validation.

## Supported v1.0 Interface Languages

The v1.0 interface language set is:

| Language code | Language | Role |
| --- | --- | --- |
| `ro` | Romanian | Primary interface language |
| `en` | English | Supported interface language |
| `es` | Spanish | Supported interface language |
| `fr` | French | Supported interface language |
| `pt` | Portuguese | Supported interface language |
| `it` | Italian | Supported interface language |
| `de` | German | Supported interface language |

The architecture must allow additional languages without business logic
changes.

## Principles

Localization must follow:

- Separate Code from Display Text.
- English Technical Implementation.
- Centralized Linguistic Resources.
- No User-Facing Hardcoded Text.
- One Canonical Definition per Term.
- Reuse Established Operating System and Technical Terminology.
- Complete Web, Tablet, Mobile and PWA Localization.
- Regional Adaptation.
- Multilingual Accessibility.
- Translation Versioning.
- Traceability and Audit.

## Fundamental Interface Rule

A localized interface must display only the selected Platform Language.

Allowed exceptions:

- Proper names.
- Brands.
- Legal names.
- Technical standards or file formats without approved localized equivalent.
- Intentionally quoted content.

Forbidden patterns:

- Visible translation keys.
- Mixed-language labels.
- Raw technical error messages.
- User-facing hardcoded labels.
- Uncontrolled fallback to English or another language.

## Canonical Supporting Documents

1. `docs/standards/localization/overview.md`.
2. `docs/standards/localization/locale-policy.md`.
3. `docs/standards/localization/resource-model.md`.
4. `docs/standards/localization/key-conventions.md`.
5. `docs/standards/localization/terminology-governance.md`.
6. `docs/standards/localization/regional-formatting.md`.
7. `docs/standards/localization/multimedia-localization.md`.
8. `docs/standards/localization/ai-assisted-localization.md`.
9. `docs/standards/localization/compliance-audit.md`.
10. `docs/standards/localization/consolidation-plan.md`.

## Non-Goals

This standard does not implement:

- New runtime localization storage.
- New translation management software.
- New mobile application code.
- New database migrations.
- API contract changes.
- UI behavior changes.
- Docker or staging changes.

Runtime implementation requires separately approved implementation phases.

