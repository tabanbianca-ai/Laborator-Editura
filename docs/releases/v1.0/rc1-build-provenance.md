# RC1 Build Provenance

Status: VERIFIED  
Generated: 2026-08-09  
Release candidate: `1.0.0-rc.1`

BUILD_PROVENANCE = VERIFIED

## Source

| Field | Value |
| --- | --- |
| Source commit | `c1b6958c0c8c92e3946addfcab48bc695962ca98` |
| Branch | `main` |
| Repository state at packaging | Release evidence tooling untracked; no application source changes |

## Build Environment

| Field | Value |
| --- | --- |
| Build command | `pnpm build` |
| Node.js | `v24.14.0` |
| pnpm executable used | `11.16.0` |
| Declared package manager | `pnpm@10.12.1` |
| Platform | `darwin arm64` |
| Builder | Local Codex validation environment |
| Build timestamp | `2026-08-09T08:38:11.021Z` |

## Artifact

| Field | Value |
| --- | --- |
| Artifact reference | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-c1b6958.tar.gz` |
| Artifact metadata | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-c1b6958.artifact.json` |
| Artifact checksum file | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-c1b6958.tar.gz.sha256` |
| Size | `1716081` bytes |
| SHA-256 | `41a15a58b747dfcf48881d3d9557ef6b9fab7ef8065305867c96b2922a1ac285` |

## SBOM

| Field | Value |
| --- | --- |
| SBOM reference | `docs/releases/v1.0/rc1-sbom.json` |
| SBOM format | CycloneDX JSON |
| SBOM spec version | `1.5` |
| SBOM SHA-256 | `5c35c3d2d4961a8e4de6df801f1aa86e460b7ad192e42dbf004cd4ddca51ba04` |
| Component count | `25` |
| Dependency graph entries | `6` |
| Lockfile status | Missing; remains covered by RC1 Blocker 02 / supply-chain remediation |

## Database Version

| Field | Value |
| --- | --- |
| Runtime DB schema version | `1.0` |
| Latest migration | `0008_security_hardening_phase_1.sql` |
| Migration set | `0000_mvp_foundation_v1.sql` through `0008_security_hardening_phase_1.sql` |

## Test Evidence References

| Evidence | Result |
| --- | --- |
| `git diff --check` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test` | PASS |
| `pnpm build` | PASS |
| `node scripts/validate-rc1-release-evidence.mjs` | PASS |

## Integrity Verification

The release evidence validator verifies:

- artifact file exists;
- artifact SHA-256 matches artifact metadata;
- checksum file matches artifact SHA-256;
- SBOM references the same artifact path, source commit, and SHA-256;
- provenance references the same source commit, artifact, SBOM, and SHA-256;
- artifact documentation contains the required Blocker 01 completion signals.

Validation command:

```bash
node scripts/validate-rc1-release-evidence.mjs
```

