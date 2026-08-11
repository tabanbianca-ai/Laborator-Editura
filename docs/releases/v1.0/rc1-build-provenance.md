# RC1 Build Provenance

Status: VERIFIED_NOT_DEPLOYED
Generated: 2026-08-09  
Release candidate: `1.0.0-rc.1`

BUILD_PROVENANCE = VERIFIED

## Source

| Field | Value |
| --- | --- |
| Source commit | `30b39ec0034f335bdbda210f09c8ad66a26a25a2` |
| Branch | `main` |
| Repository state at packaging | Release evidence script updates pending; no application source changes recorded in the artifact metadata |
| Previous artifact source | `c1b6958c0c8c92e3946addfcab48bc695962ca98` |
| Previous artifact status | Historical and superseded for certification |

## Build Environment

| Field | Value |
| --- | --- |
| Build command | `pnpm build` |
| Node.js | `v24.14.0` |
| pnpm executable used | `11.16.0` |
| Declared package manager | `pnpm@10.12.1` |
| Platform | `darwin arm64` |
| Builder | Local Codex validation environment |
| Build timestamp | `2026-08-09T09:25:28.947Z` |

## Artifact

| Field | Value |
| --- | --- |
| Artifact reference | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz` |
| Artifact metadata | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.artifact.json` |
| Artifact checksum file | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz.sha256` |
| Size | `1897172` bytes |
| SHA-256 | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e` |

## SBOM

| Field | Value |
| --- | --- |
| SBOM reference | `docs/releases/v1.0/rc1-sbom.json` |
| SBOM format | CycloneDX JSON |
| SBOM spec version | `1.5` |
| SBOM SHA-256 | `bdf24e911f70c4609e5ac1beb210e57dcbda8d44d9f19f5aef67c1d8095bd82a` |
| Component count | `25` |
| Dependency graph entries | `6` |
| Lockfile status | Present |
| Lockfile SHA-256 | `569b71350933f1f2e6028bbc6480b9b385dfe267929b136ca3bdc353f3d1b075` |

## Database Version

| Field | Value |
| --- | --- |
| Runtime DB schema version | `1.0` |
| Latest migration | `0008_security_hardening_phase_1.sql` |
| Migration set | `0000_mvp_foundation_v1.sql` through `0008_security_hardening_phase_1.sql` |

## Test Evidence References

| Evidence | Result |
| --- | --- |
| `pnpm install --frozen-lockfile` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS |
| `pnpm test` | PASS |
| `pnpm build` | PASS |
| `git diff --check` | PASS |
| `node scripts/validate-rc1-release-evidence.mjs` | PASS after release evidence update |

## Integrity Verification

The release evidence validator verifies:

- artifact file exists;
- artifact SHA-256 matches artifact metadata;
- checksum file matches artifact SHA-256;
- SBOM references the same artifact path, source commit, lockfile, and SHA-256;
- provenance references the same source commit, artifact, SBOM, and SHA-256;
- artifact documentation contains the required completion signals.

Validation command:

```bash
node scripts/validate-rc1-release-evidence.mjs
```

## Staging Deployment Status

The artifact-based staging deployment mechanism is present and validated
locally. No live staging deployment ID or deployed digest is recorded yet.

Artifact deployment validation:

```bash
bash infrastructure/validation/validate-artifact-deploy.sh
```

Validation confirms the selected artifact checksum, the runtime image dry-run
path, absence of source rebuild directives in the RC compose file, and failure
on checksum mismatch.

## Blocker 04 Staging Runtime Identity

The following live staging identity was provided for Blocker 04 validation and
must be verified on the VPS before RC1 can proceed:

| Field | Value |
| --- | --- |
| Deployment ID | `rc1-30b39ec-20260809` |
| Release | `1.0.0-rc.1` |
| Source commit | `30b39ec0034f335bdbda210f09c8ad66a26a25a2` |
| Artifact SHA-256 | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e` |
| API image ID | `sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451` |
| Web image ID | `sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e` |
| Migration version | `0008_security_hardening_phase_1.sql` |
| Independent live verification | NOT_EXECUTED_FROM_THIS_ENVIRONMENT |
