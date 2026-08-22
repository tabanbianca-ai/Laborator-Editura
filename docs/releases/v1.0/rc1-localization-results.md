# RC1 Localization Results

Status: LIVE_ACTION_REQUIRED
Generated: 2026-08-22

## Supported Platform Languages

The shared localization and web tests cover the required first-stage platform
languages:

- Romanian.
- English.
- Spanish.
- French.
- Portuguese.
- Italian.
- German.

Repository-defined locales:

- `ro-RO`.
- `en-US`.
- `en-GB`.
- `es-ES`.
- `fr-FR`.
- `pt-PT`.
- `pt-BR`.
- `it-IT`.
- `de-DE`.

## Automated Evidence Passed

| Area                         | Result | Evidence                                                                                |
| ---------------------------- | ------ | --------------------------------------------------------------------------------------- |
| Shared localization keys     | PASS   | `pnpm --filter @laborator/shared test` confirms complete common keys                    |
| Seven-language UI support    | PASS   | Web tests confirm auth and navigation labels for seven languages                        |
| Platform Language separation | PASS   | Tests confirm Platform Language does not mutate Original, Authoring, or Target Language |
| Centralized language model   | PASS   | Shared and API tests cover centralized language metadata                                |
| Language policy              | PASS   | Shared tests confirm assisted translation target language policy                        |
| Frontend language display    | PASS   | Web tests cover language metadata display in major workspaces                           |

## Evidence Missing

| Area                              | Result  | Evidence Gap                                                    |
| --------------------------------- | ------- | --------------------------------------------------------------- |
| Full browser crawl for Romanian   | MISSING | No live UI crawl verified every route in Romanian               |
| Full browser crawl for English    | MISSING | No live UI crawl verified every route in English                |
| Full browser crawl for Spanish    | MISSING | No live UI crawl verified every route in Spanish                |
| Full browser crawl for French     | MISSING | No live UI crawl verified every route in French                 |
| Full browser crawl for Portuguese | MISSING | No live UI crawl verified every route in Portuguese             |
| Full browser crawl for Italian    | MISSING | No live UI crawl verified every route in Italian                |
| Full browser crawl for German     | MISSING | No live UI crawl verified every route in German                 |
| Mixed-language scan               | MISSING | No browser-level scan confirmed each active locale is exclusive |

## Blocker 08 Closure Attempt

Blocker 08 was evaluated against the centralized localization model in
`packages/shared/src/localization.ts` and the locale files under
`packages/shared/locales`. The repository defines seven platform language
families and nine installed locales. Static and contract tests prove key
coverage and Platform Language separation, but they do not prove browser-level
route rendering for every active locale.

## P1-03 Implementation and Live Baseline

Branch `blocker08/p1-03-localization` adds a dedicated Playwright crawl and a
manual, read-only GitHub Actions workflow. The crawl covers public auth pages,
protected-route locale preservation, an authenticated route set, common
navigation, forms, error rendering, fallback, language switching, document
`lang`, localized metadata, missing-key leakage, and cross-page locale
preservation for all nine locales.

The live staging baseline was inspected read-only on 2026-08-22 at
`https://app.laboratoreditorial.com/login`. The observed page rendered Romanian
auth UI and `lang="ro"`, but its description metadata remained the English text
`Translation platform workspace`, and no nine-locale switcher was present. No
other locale was marked PASS from that single baseline observation.

| Locale  | Live result  | Evidence                                                                             |
| ------- | ------------ | ------------------------------------------------------------------------------------ |
| `ro-RO` | PARTIAL      | Romanian login rendered; document used language-family `ro`; metadata leaked English |
| `en-US` | NOT_EXECUTED | Updated locale routing is not deployed to staging                                    |
| `en-GB` | NOT_EXECUTED | Updated locale routing is not deployed to staging                                    |
| `es-ES` | NOT_EXECUTED | Updated locale routing is not deployed to staging                                    |
| `fr-FR` | NOT_EXECUTED | Updated locale routing is not deployed to staging                                    |
| `pt-PT` | NOT_EXECUTED | Updated locale routing is not deployed to staging                                    |
| `pt-BR` | NOT_EXECUTED | Updated locale routing is not deployed to staging                                    |
| `it-IT` | NOT_EXECUTED | Updated locale routing is not deployed to staging                                    |
| `de-DE` | NOT_EXECUTED | Updated locale routing is not deployed to staging                                    |

These results are intentionally not PASS evidence for P1-03.

## Required Browser Crawl Matrix

| Locale  | `/login`             | `/dashboard`         | `/pipeline`          | `/projects/new`      | `/translation`       | `/review`            | `/publishing`        | `/distribution`      | `/rights`            | `/research`          | `/library`           | `/administration`    |
| ------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- |
| `ro-RO` | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED |
| `en-US` | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED |
| `en-GB` | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED |
| `es-ES` | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED |
| `fr-FR` | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED |
| `pt-PT` | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED |
| `pt-BR` | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED |
| `it-IT` | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED |
| `de-DE` | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED | LIVE_ACTION_REQUIRED |

## Required Live Actions

After the branch is reviewed, merged, and deployed through the separately
approved release process, configure the `staging` environment secret
`P1_03_SESSION_TOKEN` with a temporary least-privilege test session and manually
run `P1-03 Staging Localization Crawl`. The workflow is browser-only and does
not deploy or access the VPS.

```bash
gh workflow run p1-03-localization.yml \
  --ref main \
  -f base_url=https://app.laboratoreditorial.com
```

Then perform a browser crawl for each repository-defined locale and each route
in the matrix. Record whether each page loads, the locale switch persists, no
critical UI key is missing, no wrong-language fallback appears, menus and forms
use the active Platform Language, special characters render correctly, and no
critical text overflow or truncation appears on desktop or mobile.

## Localization Decision

P1-03 remains LIVE_ACTION_REQUIRED. The runner and remediation are prepared,
but PASS requires a successful post-deployment GitHub Actions crawl with
authenticated evidence for every locale. P1-04 has not been started.
