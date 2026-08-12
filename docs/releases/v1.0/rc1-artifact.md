# RC1 Artifact Identity

Status: VERIFIED_DEPLOYED_AND_ROLLBACK_BASELINE
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

## Active RC1 Artifact

| Field | Value |
| --- | --- |
| Artifact file | `laborator-editura-1.0.0-rc.1-30b39ec.tar.gz` |
| Artifact path | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz` |
| Artifact metadata | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.artifact.json` |
| Checksum file | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz.sha256` |
| Size | `1897172` bytes |
| SHA-256 | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e` |
| Created at | `2026-08-09T09:25:28.947Z` |
| Source commit | `30b39ec0034f335bdbda210f09c8ad66a26a25a2` |
| Source branch | `main` |

## Historical Artifact

| Field | Value |
| --- | --- |
| Artifact file | `laborator-editura-1.0.0-rc.1-c1b6958.tar.gz` |
| Artifact path | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-c1b6958.tar.gz` |
| SHA-256 | `41a15a58b747dfcf48881d3d9557ef6b9fab7ef8065305867c96b2922a1ac285` |
| Source commit | `c1b6958c0c8c92e3946addfcab48bc695962ca98` |
| Certification status | Historical and superseded for certification by the remediated lockfile artifact |

## Build Inputs

| Field | Value |
| --- | --- |
| Canonical build command | `pnpm build` |
| Node.js | `v24.14.0` |
| pnpm executable used | `11.16.0` |
| Declared package manager | `pnpm@10.12.1` |
| Lockfile | `pnpm-lock.yaml` |
| Lockfile SHA-256 | `569b71350933f1f2e6028bbc6480b9b385dfe267929b136ca3bdc353f3d1b075` |
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
- The artifact includes `pnpm-lock.yaml` and `RELEASE_ARTIFACT_MANIFEST.json`.
- The artifact must be promoted by reference and digest only.
- The artifact must not be rebuilt silently after approval.
- Any replacement artifact requires a new filename, new digest, new SBOM, new
  provenance, and a new approval record.
- Digest verification command:

```bash
shasum -a 256 artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz
```

## SBOM and Provenance

| Evidence | Path |
| --- | --- |
| SBOM | `docs/releases/v1.0/rc1-sbom.json` |
| SBOM SHA-256 | `bdf24e911f70c4609e5ac1beb210e57dcbda8d44d9f19f5aef67c1d8095bd82a` |
| Build provenance | `docs/releases/v1.0/rc1-build-provenance.md` |
| Staging deployment evidence | `docs/releases/v1.0/rc1-staging-deployment.md` |
| Release evidence validator | `scripts/validate-rc1-release-evidence.mjs` |

## Deployment Status

The artifact-based staging deployment mechanism now exists, verifies this
artifact before deployment, and refuses the RC release path if staging would
rebuild from source. This artifact was deployed to live staging as deployment
`rc1-30b39ec-20260809` and later verified as the executable rollback baseline
for Blocker 06. The Blocker 06 forward rehearsal candidate is documented
separately and must not overwrite this artifact identity.

Artifact deployment tooling:

- `deploy/staging/docker-compose.artifact.yml`
- `infrastructure/deploy/deploy-staging-artifact.sh`
- `infrastructure/deploy/build-runtime-images-from-artifact.sh`
- `infrastructure/deploy/rollback-staging-artifact.sh`
- `infrastructure/validation/validate-artifact-deploy.sh`
