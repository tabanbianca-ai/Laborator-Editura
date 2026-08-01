# Canonical Localization Resource Model

## Purpose

This document defines the canonical resource record for interface
localization.

## Canonical Resource Fields

Every localization resource must preserve:

| Field | Description |
| --- | --- |
| `id` | Stable resource identifier |
| `canonical_key` | Stable canonical translation key |
| `namespace` | Functional namespace such as `common`, `authentication`, `library`, or `publishing` |
| `source_locale` | Source locale of the source value |
| `target_locale` | Target locale of the translated value |
| `source_value` | Source text or source canonical wording |
| `translated_value` | Localized user-facing text |
| `context` | UI, workflow, domain, or usage context |
| `description` | Translator-facing explanation |
| `status` | Resource lifecycle state |
| `version` | Resource version |
| `owner` | Owning team or governance area |
| `reviewer` | Reviewer or approval authority |
| `created_at` | Creation timestamp |
| `updated_at` | Last update timestamp |

## Allowed Resource Statuses

- `DRAFT`.
- `UNDER_REVIEW`.
- `VALIDATED`.
- `PUBLISHED`.
- `SUSPENDED`.
- `ARCHIVED`.

## Canonical Resource Layout

Canonical resources should converge toward:

```text
locales/
  ro/
    common.json
    authentication.json
    library.json
    translation.json
    publishing.json
    magazine.json
    administration.json
  en/
  es/
  fr/
  pt/
  it/
  de/
```

Web, responsive PWA, tablet, and future mobile interfaces must consume the
same canonical keys and resources.

## Namespace Rules

- Namespaces must represent business or platform domains.
- Namespaces must not represent visual position.
- The same key must not have divergent meanings in different clients.
- Resource files must remain compatible across web, PWA, tablet, and future
  mobile surfaces.

## User-Facing Error Model

Technical errors must not be shown directly to users.

Every user-facing error must have:

- Stable error code.
- Localized message.
- Accessible explanation.
- Recommended action.
- Correlation identifier when needed.

Internal example:

```text
AUTH_INVALID_CREDENTIALS
```

Localized display values are stored through canonical resource keys, not in
exception constructors or UI components.

