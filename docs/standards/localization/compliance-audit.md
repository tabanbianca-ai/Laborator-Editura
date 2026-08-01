# Canonical Localization Baseline Audit

## Purpose

This audit inventories the current repository baseline against Standard 11:
Canonical Internationalization, Localization and Terminology.

It is a documentation and governance audit. It does not change runtime
behavior, APIs, database schema, Docker, staging, frontend behavior, or
application logic.

## Audit Date

2026-08-01.

## Static Inventory

| Area | Current count or evidence |
| --- | --- |
| Web source files scanned | 152 TypeScript/TSX files under `apps/web`, excluding `.next` |
| API source files scanned | 245 TypeScript/MJS files under `apps/api`, excluding `dist` |
| Central UI localization source | `apps/web/lib/ui-i18n.ts` |
| Shared language policy source | `packages/shared/src/language-policy.ts` |
| Frontend localization tests | `apps/web/tests/auth-localization-foundation-contract.test.mjs`, `apps/web/tests/language-policy-ui-contract.test.mjs`, `apps/web/tests/unified-language-management-ui-contract.test.mjs` |
| Backend/shared language policy tests | `apps/api/tests/language-model-policy-contract.test.mjs`, `apps/api/tests/unified-language-management-contract.test.mjs`, `packages/shared/tests/language-policy-contract.test.mjs` |
| Current web locale family support | `en`, `ro`, `es`, `fr`, `pt`, `it`, `de` in `apps/web/lib/ui-i18n.ts` |
| Current canonical resource directory | Not yet present as `locales/{ro,en,es,fr,pt,it,de}` |
| Source string literal candidates | 5,957 string literal matches in web source before classification |
| Backend generated message candidates | 386 exception/error constructor matches in API source before classification |
| Separate mobile resource set | No separate mobile application resource tree identified |
| PWA resource set | No separate PWA localization resource tree identified; current baseline is web-centered |

## Current Strengths

- The web application already has a central `ui-i18n.ts` localization helper.
- The seven v1.0 language families are represented in the current web helper.
- Language policy exists in the shared package.
- Platform Language, Original Language, Authoring Language, and Target
  Language separation is already represented in shared policy tests.
- Existing documentation strongly defines internal English and localized UI
  requirements.

## Current Gaps

- Canonical resource files under `locales/{ro,en,es,fr,pt,it,de}` are not yet
  present.
- UI translations are currently stored inline in a TypeScript helper rather
  than in canonical resource files.
- Full hardcoded text classification has not yet been completed.
- Full missing-key and unused-key reports are not yet available.
- Full mixed-language detection for every locale is not automated.
- Backend-generated user messages require mapping to stable localized error
  codes.
- Regional formatting validation is not yet fully inventoried.
- Multimedia localization resources are documented but not yet centralized as
  canonical localization records.
- Terminology registry coverage for interface terms needs a dedicated
  catalog.

## Compliance Classification

| Compliance area | Status | Notes |
| --- | --- | --- |
| Supported language set | Mostly compliant baseline | Seven locale families exist in web helper |
| Canonical resource model | Early foundation | Model now defined by Standard 11; runtime storage future |
| Key conventions | Partially compliant | Existing keys are semantic but stored inline |
| No hardcoded UI text | Needs inventory | Candidate scan exists; classification required |
| Mixed-language prevention | Early foundation | Tests exist, automated full scan future |
| Regional formatting | Early foundation | Shared language policy exists; display audit future |
| Terminology governance | Partially compliant | Terminology systems exist; UI term catalog future |
| Multimedia localization | Early foundation | Media localization modules exist; canonical localization resource linkage future |
| AI-assisted localization | Documented baseline | AI rules now defined; evaluation workflow future |
| Audit | Partially compliant | Module audit exists; localization-specific audit events future |

## Baseline Conclusion

The repository has a strong language policy and centralized web helper
foundation, but it has not yet converged to Standard 11 canonical resource
files or complete localization compliance automation.

No existing localization source should be deleted during baseline
standardization. Inline resources, tests, and language policies must be mapped
before consolidation.

