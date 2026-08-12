# RC1 Localization Results

Status: LIVE_ACTION_REQUIRED
Generated: 2026-08-12

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

| Area | Result | Evidence |
| --- | --- | --- |
| Shared localization keys | PASS | `pnpm --filter @laborator/shared test` confirms complete common keys |
| Seven-language UI support | PASS | Web tests confirm auth and navigation labels for seven languages |
| Platform Language separation | PASS | Tests confirm Platform Language does not mutate Original, Authoring, or Target Language |
| Centralized language model | PASS | Shared and API tests cover centralized language metadata |
| Language policy | PASS | Shared tests confirm assisted translation target language policy |
| Frontend language display | PASS | Web tests cover language metadata display in major workspaces |

## Evidence Missing

| Area | Result | Evidence Gap |
| --- | --- | --- |
| Full browser crawl for Romanian | MISSING | No live UI crawl verified every route in Romanian |
| Full browser crawl for English | MISSING | No live UI crawl verified every route in English |
| Full browser crawl for Spanish | MISSING | No live UI crawl verified every route in Spanish |
| Full browser crawl for French | MISSING | No live UI crawl verified every route in French |
| Full browser crawl for Portuguese | MISSING | No live UI crawl verified every route in Portuguese |
| Full browser crawl for Italian | MISSING | No live UI crawl verified every route in Italian |
| Full browser crawl for German | MISSING | No live UI crawl verified every route in German |
| Mixed-language scan | MISSING | No browser-level scan confirmed each active locale is exclusive |

## Blocker 08 Closure Attempt

Blocker 08 was evaluated against the centralized localization model in
`packages/shared/src/localization.ts` and the locale files under
`packages/shared/locales`. The repository defines seven platform language
families and nine installed locales. Static and contract tests prove key
coverage and Platform Language separation, but they do not prove browser-level
route rendering for every active locale.

## Required Browser Crawl Matrix

| Locale | `/login` | `/dashboard` | `/pipeline` | `/projects/new` | `/translation` | `/review` | `/publishing` | `/distribution` | `/rights` | `/research` | `/library` | `/administration` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
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

Run the repository validation first:

```bash
cd /opt/laborator-editura
set -a
. deploy/staging/.env.staging
set +a
export STAGING_ENV_FILE=/opt/laborator-editura/deploy/staging/.env.staging
export STAGING_COMPOSE_FILE=/opt/laborator-editura/deploy/staging/docker-compose.artifact.yml
pnpm install --frozen-lockfile
pnpm --filter @laborator/shared test
pnpm --filter @laborator/web test
pnpm staging:health
pnpm staging:validate
```

Then perform a browser crawl for each repository-defined locale and each route
in the matrix. Record whether each page loads, the locale switch persists, no
critical UI key is missing, no wrong-language fallback appears, menus and forms
use the active Platform Language, special characters render correctly, and no
critical text overflow or truncation appears on desktop or mobile.

## Localization Decision

The implementation has strong automated localization coverage. RC1 localization
is still LIVE_ACTION_REQUIRED until browser-level route review proves there is
no mixed-language UI for the seven platform languages and nine installed
locales.
