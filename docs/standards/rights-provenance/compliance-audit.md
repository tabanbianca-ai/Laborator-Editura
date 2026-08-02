# Canonical Rights, Licensing and Provenance Baseline Audit

## Purpose

This audit inventories the current repository baseline against Standard 13:
Canonical Rights, Licensing and Provenance.

It is a documentation and governance audit. It does not change runtime
behavior, APIs, database schema, Docker, staging, frontend behavior, or
application logic.

## Audit Date

2026-08-01.

## Static Inventory

| Area | Current count or evidence |
| --- | --- |
| Rights module documents | 11 files under `docs/modules/rights` |
| Runtime rights module | `apps/api/src/modules/rights-provenance` exists |
| Related API source files | 40 files across rights, publishing, commerce, media, authoring, translation, and public portal areas |
| Searchable rights/provenance documentation and source candidates | 257 matching files across `apps`, `packages`, and `docs` before classification |
| Existing rights entities | Collaboration agreements, translation authorizations, publishing authorizations, provenance records, rights audit events |
| Existing integrations | Publishing warnings, Distribution Center warnings, backup/restore, frontend Rights workspace |
| Existing tests | Module registration, authenticated endpoints, rights metadata, provenance, AI limits, persistence, backup/restore, frontend workspace |

## Current Strengths

- Rights and Provenance backend module exists.
- Collaboration agreements exist.
- Translation authorizations exist.
- Publishing authorizations exist.
- Provenance records exist.
- Rights audit events exist.
- Rights workspace frontend exists.
- Publishing and Distribution Center consume rights warnings.
- Runtime database and backup/restore include rights tables.
- Human Final Authority is explicitly preserved.

## Current Gaps

- Canonical `RightsRecord` aggregate is not yet implemented as the generalized
  rights source.
- Rights holder registry is not yet first-class.
- Generalized rights type model is not yet complete.
- Versioned License records are not yet complete.
- Contract lifecycle, parties, amendments, renewals, and expiry workflow are
  incomplete.
- Provenance is lightweight and not yet fully Library Item scoped, versioned,
  or acquisition-method aware.
- Unified restriction model is not complete.
- Reusable canonical rights verification endpoint is missing.
- Immutable legal-history timeline is incomplete.
- Expiration and revocation monitoring are incomplete.

## Baseline Compliance Classification

| Compliance area | Status | Notes |
| --- | --- | --- |
| Rights records | Partial foundation | Split authorizations exist; canonical aggregate future |
| Rights holders | Early foundation | String metadata exists; registry future |
| Contracts and licenses | Partial foundation | Contracts/agreements exist; versioned lifecycle future |
| Language, territory, format, channel | Partial foundation | Some fields exist; unified gate future |
| Public domain validation | Early foundation | Requirements documented; structured validation future |
| Provenance | Partial foundation | Records exist; complete source/version chain future |
| Derived assets | Early foundation | Media/publishing links exist; inheritance map future |
| Translation rights | Partial foundation | Translation authorization exists |
| Media and voice rights | Early foundation | Media metadata exists; consent and voice rights future |
| AI content rights | Early foundation | AI limits documented; policy/version metadata future |
| Publication gate | Partial foundation | Rights warnings exist; canonical gate future |
| Audit | Partial foundation | Rights audit events exist; full legal timeline future |

## Baseline Conclusion

The repository has a strong Rights and Provenance foundation but must
converge toward a canonical, generalized, language/territory/format/channel
rights model before high-volume publication and distribution.

No existing rights record, identifier, document, version, approval, or audit
history should be deleted during baseline standardization. Duplicates and
conflicts must be mapped before canonical records are proposed.

