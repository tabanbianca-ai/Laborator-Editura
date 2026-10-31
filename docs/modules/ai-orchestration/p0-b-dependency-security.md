# P0-B Dependency Security Remediation

Date: 2026-10-31. Branch: `codex/gap-02-4-4-p0-b-atomic-reservations`.
Local implementation only; existing uncommitted financial work is preserved.

## Findings and Reachability

| Package | Before | Advisory | Severity | Dependency chain | Published secure version |
| --- | --- | --- | --- | --- | --- |
| minimatch | 3.1.5 | GHSA-g3hv-75wg-m249 | Moderate | root ESLint 9.39.4, including config-array/eslintrc; also Nest CLI checker plugin | 11.0.1 |
| minimatch | 10.2.5 | GHSA-g3hv-75wg-m249 | Moderate | typescript-eslint 8.62.0 -> typescript-estree; Nest CLI -> glob | 11.0.1 |
| glob | 13.0.6 | GHSA-3g3m-2fjr-6pw4 | Moderate | @nestjs/cli 11.0.23 -> glob | 14.0.2 |
| deepmerge | 4.3.1 | GHSA-gcqx-w48m-w2h4 | Low | @nestjs/cli -> fork-ts-checker-webpack-plugin 9.1.0 -> deepmerge | None reported by audit |

The audit counts three moderate occurrences: two minimatch versions and one glob.
The minimatch advisory concerns excessive pattern preprocessing; glob concerns
filesystem traversal continuing after cancellation; deepmerge concerns prototype
poisoning during object merging.

These chains originate in declared development dependencies. `pnpm why -r --prod`
finds none of these packages; application/provider/financial source does not
import them. The audit JSON's aggregate dev flags do not accurately describe the
manifest ownership. No normal API/manuscript input path into these tools was
identified. That is not proof of universal unreachability: untrusted patterns,
file trees and configuration in development/CI remain relevant attack surfaces.
All reported moderate versions are removed rather than exempted.

## Choice of Remediation

Registry inspection found no compatible upstream-parent update that removes all
findings: ESLint 9.39.5 still requests minimatch 3; typescript-eslint 8.72.1 still
requests minimatch 10; Nest CLI 11.0.24 still pins glob 13.0.6. The latest checker
plugin 9.1.0 still invokes minimatch's old callable CommonJS export.

Two overrides are therefore used:

- `minimatch: 11.0.1`, removing vulnerable versions 3.1.5 and 10.2.5.
- `@nestjs/cli@11.0.23>glob: 14.0.2`, scoped to the actual installed consumer.

These are transitive major-version changes, not untested API-compatible patches.
A plain minimatch override would break the checker plugin. The pnpm patch adds
only a callable CommonJS export using the upstream secure `minimatch` function
and its existing named exports. ESM and matching/security algorithms are unchanged.
It neither pretends the old library is patched nor changes advisory metadata.
The patch and package integrity are bound in the frozen lockfile.

No parent-tool migration or unrelated upgrade is performed. Related lockfile
changes are glob/path-scurry, minimatch/nonrecursive-glob-match and removal of
the unused old matcher/brace-expansion dependencies. Existing P0-B pg additions
are preserved, not introduced by this remediation.

## Build and Release Compatibility

The two source-build Dockerfiles copy the patch before frozen installation.
Canonical RC packaging includes `patches/`, so artifact-based runtime image
construction also receives the same dependency patch. These are dependency-input
changes only: no deployment workflow, approval, runtime setting or VPS is changed.
No RC artifact or Docker image is produced by this task.

`dependency-tooling-security.test.mjs` verifies:

- The resolved matcher is 11.0.1 and supports callable CommonJS, named exports,
  ESM, dotfiles, braces, negation, matchBase, defaults and the Minimatch class.
- The actual checker plugin's issue predicate still handles include/exclude and
  severity matching, rather than replacing the consumer with a mock.
- Glob 14.0.2 preserves the actual Nest AssetsManager's recursive asset copying
  and exclusion behavior, and stops reads after a controlled cancellation.
- Patch inputs precede container installation and remain in RC packaging.

Validation targets Node 22.23.3/pnpm 10.12.1, matching the repository's Node 22
CI/container baseline. Compatibility on unrelated unsupported Node majors is
not claimed. No Docker daemon build is executed; Docker input coverage is a
contract test, not evidence of an actual container build.

## Validation Evidence

Final validation on Node 22.23.3/pnpm 10.12.1:

| Check | Result |
| --- | --- |
| Frozen workspace installation | PASS |
| Isolated production-only frozen installation with the copied manifests/patch | PASS |
| Dedicated consumer/security tests | 4/4 PASS |
| API | 637/637 PASS |
| DB, including real PostgreSQL | 81/81 PASS |
| Shared | 62/62 PASS |
| Web | 134/134 PASS |
| Full uncached lint | PASS |
| Production build, followed by sequential typecheck | PASS |
| Nest CLI --version | PASS, unchanged 11.0.23 |
| git diff --check | PASS |
| Audit critical/high/moderate/low | 0/0/0/1 |

No tests skipped. Plain `pnpm audit` returns exit 1 for the unsuppressed low
deepmerge advisory; the separate moderate-level target check returns exit 0.
No audit exception or threshold reduction is configured.

An initial restricted-network installation failed fetching cached dependencies
and interrupted a local build. After that process exited, frozen installation
with registry access succeeded; the full suites, build and typecheck were rerun
successfully. No dependency version adjustment was used to hide this failure.

PostgreSQL 17.10 used only disposable localhost databases and a role without
superuser/BYPASSRLS. Full migrations through 0016, source projection, stale
rejection, authorization, concurrent reservations, rollback, audit and financial
dump/restore passed. The ten restored financial table snapshots matched and the
source test database remained unchanged. Native backup client version: 17.11.
Final regression backup SHA-256:
`9132aa9e152181c797daabf6465d710348d8b2a2bd9477056e261fb107011315`.

SHA-256 preservation checks passed for migration 0016, projection/reservation
repositories, runtime database implementation, spending service, execution runtime
and central translation provider. Paid dispatch remains disabled. The temporary
PostgreSQL cluster was stopped after validation. No commit, push, deploy, VPS
access, live restore or live payment/provider connection occurred.

## Remaining Risk and Maintenance

Deepmerge remains an unsuppressed low finding with no patched release reported.
It is not exposed as a production financial/provider dependency. Reassess when
the Nest checker chain is updated; do not claim it is harmless in every context.

The matcher compatibility export is local maintenance responsibility. Remove it
only when all consumers use the upstream named API and regression tests pass.
Future Nest CLI versions outside the scoped override require a fresh dependency
review. Frozen install and audit gates remain mandatory; neither is weakened.

## Files in This Security Change

- `pnpm-workspace.yaml`
- `pnpm-lock.yaml`
- `patches/minimatch@11.0.1.patch`
- `apps/api/tests/dependency-tooling-security.test.mjs`
- `deploy/staging/Dockerfile.api`
- `deploy/staging/Dockerfile.web`
- `scripts/create-rc1-artifact.mjs`
- `docs/modules/ai-orchestration/p0-b-dependency-security.md`
- `docs/modules/ai-orchestration/atomic-budget-reservations.md`

No financial/AI implementation, migration 0016, runtime state, provider activation
gate or existing test assertion is modified by this security remediation.
