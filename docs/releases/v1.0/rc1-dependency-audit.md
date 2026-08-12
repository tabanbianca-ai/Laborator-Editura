# RC1 Dependency Lockfile and Supply-Chain Audit

Status: VERIFIED  
Generated: 2026-08-09  
Scope: RC1 Blocker 02 only

## Workspace Inspection

| Item | Result |
| --- | --- |
| Workspace manager | `pnpm` |
| Declared package manager | `pnpm@10.12.1` in root `package.json` |
| Local pnpm used for remediation | `11.16.0` |
| Lockfile version | `9.0` |
| Workspace definition | `pnpm-workspace.yaml` covers `apps/*` and `packages/*` |
| Workspace importers | root, `apps/ai`, `apps/api`, `apps/web`, `packages/db`, `packages/shared` |
| `.gitignore` status | `pnpm-lock.yaml` is not ignored |
| Previous install behavior | CI, staging deploy, Docker build, and documentation used `pnpm install --no-frozen-lockfile` |
| Remediated install behavior | CI, staging deploy, Docker build, and release guidance use `pnpm install --frozen-lockfile` |

## Root Cause

The workspace had no version-controlled `pnpm-lock.yaml`, and the operational
install paths explicitly used `--no-frozen-lockfile`. That made the RC1
dependency graph non-reproducible and prevented `pnpm audit` from running
against a canonical dependency state.

## Lockfile Evidence

| Evidence | Value |
| --- | --- |
| Lockfile | `pnpm-lock.yaml` |
| SHA-256 | `569b71350933f1f2e6028bbc6480b9b385dfe267929b136ca3bdc353f3d1b075` |
| Frozen install | PASS with `CI=true pnpm install --frozen-lockfile` |
| Workspace coverage | PASS |
| Manifest match | PASS |
| Version-controlled path | PASS |

## Targeted Security Remediation

The first audit after generating the lockfile found production-path High
vulnerabilities. The remediation was limited to dependency security fixes:

| Package | Change | Reason |
| --- | --- | --- |
| `next` | `apps/web` target raised to `^15.5.21`; lockfile resolved `15.5.23` | Patched High Next.js advisories affecting production web runtime |
| `multer` | Workspace override to `2.2.0` | Patched High production API transitive dependency through Nest platform Express |
| `sharp` | Workspace override to `0.35.0` | Patched High optional production image dependency through Next.js |
| `postcss` | Workspace override to `8.5.23` | Patched production PostCSS advisories through Next.js |
| `nanoid` | Workspace override to `3.3.17` | Patched production transitive dependency through PostCSS |
| `brace-expansion` | Workspace overrides to `1.1.18` and `5.0.9` | Patched dev-tooling High advisories |
| `js-yaml` | Workspace override to `4.3.1` | Patched dev-tooling High advisories |
| `fast-uri` | Workspace override to `3.1.5` | Patched dev-tooling High advisories |

No broad dependency upgrade was performed.

## Audit Results

### Before Targeted Remediation

| Audit | Critical | High | Moderate | Low |
| --- | ---: | ---: | ---: | ---: |
| Full workspace | 0 | 20 | 8 | 0 |
| Production only | 0 | 9 | 8 | 0 |

Production-path High findings included `next`, `multer`, `sharp`, `postcss`,
and `nanoid`.

### After Targeted Remediation

| Audit | Critical | High | Moderate | Low |
| --- | ---: | ---: | ---: | ---: |
| Full workspace | 0 | 0 | 0 | 0 |
| Production only | 0 | 0 | 0 | 0 |

`pnpm audit --audit-level high` passes after remediation.

## SBOM Status

`docs/releases/v1.0/rc1-sbom.json` was regenerated to include:

- `laborator:lockfile.status = present`
- `laborator:lockfile.path = pnpm-lock.yaml`
- `laborator:lockfile.sha256 = 569b71350933f1f2e6028bbc6480b9b385dfe267929b136ca3bdc353f3d1b075`
- `laborator:artifact.certificationStatus = verified-current-rc1-artifact`

The previous Blocker 01 artifact remains preserved as historical evidence, but
it no longer represents the remediated dependency source state.

## Validation Evidence

| Command | Result |
| --- | --- |
| `CI=true pnpm install --frozen-lockfile` | PASS |
| `pnpm audit --prod --json` | PASS, 0 findings |
| `pnpm audit --json` | PASS, 0 findings |
| `pnpm audit --audit-level high` | PASS |
| `node scripts/validate-rc1-release-evidence.mjs` | PASS, active lockfile-backed artifact verified and previous artifact preserved as historical evidence |

Full typecheck, lint, test, build, and diff validation are recorded in the final
Blocker 02 completion report.

## Previous Artifact Status

The immutable artifact produced during Blocker 01 remains valid historical
evidence for source commit `c1b6958c0c8c92e3946addfcab48bc695962ca98`:

`artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-c1b6958.tar.gz`

SHA-256:

`41a15a58b747dfcf48881d3d9557ef6b9fab7ef8065305867c96b2922a1ac285`

For pilot or certification, a new final RC1 artifact must be produced from the
remediated source state containing the lockfile and supply-chain fixes.
