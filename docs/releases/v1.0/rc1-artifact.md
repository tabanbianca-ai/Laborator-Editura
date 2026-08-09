# RC1 Artifact Identity

Status: VERIFIED  
Generated: 2026-08-09  
Release candidate: `1.0.0-rc.1`

## Completion Signals

RC1_ARTIFACT = VERIFIED  
ARTIFACT_IMMUTABILITY = VERIFIED  
SHA256_DIGEST = VERIFIED  
SBOM = GENERATED_AND_LINKED  
BUILD_PROVENANCE = VERIFIED  
SOURCE_COMMIT = VERIFIED  
RELEASE_VALIDATION = PASS

## Artifact

| Field | Value |
| --- | --- |
| Artifact file | `laborator-editura-1.0.0-rc.1-c1b6958.tar.gz` |
| Artifact path | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-c1b6958.tar.gz` |
| Artifact metadata | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-c1b6958.artifact.json` |
| Checksum file | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-c1b6958.tar.gz.sha256` |
| Size | `1716081` bytes |
| SHA-256 | `41a15a58b747dfcf48881d3d9557ef6b9fab7ef8065305867c96b2922a1ac285` |
| Created at | `2026-08-09T08:38:11.021Z` |
| Source commit | `c1b6958c0c8c92e3946addfcab48bc695962ca98` |
| Source branch | `main` |

## Build Inputs

| Field | Value |
| --- | --- |
| Canonical build command | `pnpm build` |
| Node.js | `v24.14.0` |
| pnpm executable used | `11.16.0` |
| Declared package manager | `pnpm@10.12.1` |
| Platform | `darwin arm64` |
| Runtime DB schema version | `1.0` |
| Latest migration | `0008_security_hardening_phase_1.sql` |

## Package Versions

| Package | Version |
| --- | --- |
| `laboratorul-editurii` | `0.1.0` |
| `@laborator/api` | `0.1.0` |
| `@laborator/web` | `0.1.0` |
| `@laborator/ai` | `0.1.0` |
| `@laborator/db` | `0.1.0` |
| `@laborator/shared` | `0.1.0` |

## Immutability Rules

- The artifact was produced after the canonical `pnpm build` command.
- The artifact must be promoted by reference and digest only.
- The artifact must not be rebuilt silently after approval.
- Any replacement artifact requires a new filename, new digest, new SBOM, new
  provenance, and a new approval record.
- Digest verification command:

```bash
shasum -a 256 artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-c1b6958.tar.gz
```

## SBOM and Provenance

| Evidence | Path |
| --- | --- |
| SBOM | `docs/releases/v1.0/rc1-sbom.json` |
| SBOM SHA-256 | `5c35c3d2d4961a8e4de6df801f1aa86e460b7ad192e42dbf004cd4ddca51ba04` |
| Build provenance | `docs/releases/v1.0/rc1-build-provenance.md` |
| Release evidence validator | `scripts/validate-rc1-release-evidence.mjs` |

## Notes

The artifact metadata records the repository state observed by the packaging
tool. At packaging time, only release evidence tooling was untracked; no
application source, API contract, database schema, UI behavior, or Docker
configuration was changed for Blocker 01.

