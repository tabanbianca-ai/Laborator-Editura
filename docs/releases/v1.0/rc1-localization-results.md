# RC1 Localization Results

Status: PARTIAL_BLOCKED  
Generated: 2026-08-09

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

## Localization Decision

The implementation has strong automated localization coverage. RC1 localization
is still blocked for pilot certification until browser-level route review proves
there is no mixed-language UI for the seven platform languages.

