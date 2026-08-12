# RC1 Rollback Baseline

Status: VERIFIED_BASELINE
Generated: 2026-08-11
Scope: RC1 Blocker 06

## Decision

The historical `c1b6958` artifact is preserved as release evidence, but it is
not a valid executable rollback target for RC1 certification because runtime
image construction from that artifact cannot use frozen dependency resolution.

The safest canonical remediation is to establish a new verified rollback
baseline from the first lockfile-backed, artifact-based, source-identified RC1
state: `30b39ec0034f335bdbda210f09c8ad66a26a25a2`.

This does not resolve Blocker 06 by itself. A live rollback rehearsal still
requires a forward deployment target followed by rollback to this verified
baseline and redeploy validation through the artifact path.

The prepared forward rehearsal candidate is documented in
`docs/releases/v1.0/rc1-forward-rehearsal-candidate.md`. It is based on source
commit `add6e73221d70fbc07d0f724a8322d5aa3b503d9` and artifact SHA-256
`05ec1fb248aceb8b88efd66b6309a6ba928e24152ad83997fd549c5da26d66a4`. It was
live deployed, rolled back to this `30b39ec` baseline, and redeployed as part
of the Blocker 06 rehearsal.

## Historical c1b6958 Evidence

| Field | Value |
| --- | --- |
| Artifact | `laborator-editura-1.0.0-rc.1-c1b6958.tar.gz` |
| SHA-256 | `41a15a58b747dfcf48881d3d9557ef6b9fab7ef8065305867c96b2922a1ac285` |
| Source commit | `c1b6958c0c8c92e3946addfcab48bc695962ca98` |
| Artifact SHA verification on VPS | PASS |
| Runtime image construction | FAIL |
| Failure | `ERR_PNPM_NO_LOCKFILE` |
| Cause | `pnpm-lock.yaml` is absent from the historical artifact |
| Certification status | PRESERVED_HISTORICAL_EVIDENCE_NOT_EXECUTABLE_ROLLBACK_BASELINE |

The failure must not be remediated with `--no-frozen-lockfile`. The artifact
must not be modified, and provenance must not be fabricated retroactively.

## Legacy Docker Images

| Image | Image ID | Created | Status |
| --- | --- | --- | --- |
| `staging-api:latest` | `sha256:890aeea9b31b8d1e2c31a3572d40ec38598ed4046de07e3f89fe9a51dc0bd0c1` | `2026-07-25T08:37:03Z` | REJECTED_FOR_RC_ROLLBACK |
| `staging-web:latest` | `sha256:a8cc4868fd0c1ca0232da9d9a722355906e1b3f5d5716ab553c81dc9b0f156af` | `2026-07-25T08:38:09Z` | REJECTED_FOR_RC_ROLLBACK |

The legacy images contain only Docker Compose project/service/version labels.
They do not expose independently verifiable artifact SHA-256, source commit,
release version, deployment ID, or build provenance. They must not be treated
as verified rollback targets.

## New Verified Rollback Baseline

| Field | Value |
| --- | --- |
| Baseline type | LOCKFILE_BACKED_RC1_ARTIFACT_BASELINE |
| Artifact | `laborator-editura-1.0.0-rc.1-30b39ec.tar.gz` |
| Artifact path | `artifacts/releases/v1.0/rc1/laborator-editura-1.0.0-rc.1-30b39ec.tar.gz` |
| SHA-256 | `9665892b4600387326d4e569de9fbf3a7f08f9ffb565bfda71664fa89f8c792e` |
| Source commit | `30b39ec0034f335bdbda210f09c8ad66a26a25a2` |
| Migration | `0008_security_hardening_phase_1.sql` |
| API image | `laborator-rc1-api:30b39ec` |
| API image ID | `sha256:e89836ad49f4770a60a921423ea910f8654b1f98254a98acb2d0c7c0ddf6b451` |
| WEB image | `laborator-rc1-web:30b39ec` |
| WEB image ID | `sha256:d941cfe6bc427f529ac20a9d7b1ff33c140eee1fa80551e2bfab141f0adfa42e` |
| Frozen dependency resolution | PASS: artifact contains `pnpm-lock.yaml` |
| Rollback baseline eligibility | PASS locally through `infrastructure/validation/validate-rollback-baseline.sh` |

## Repository Mechanism

| Mechanism | Purpose |
| --- | --- |
| `infrastructure/deploy/build-runtime-images-from-artifact.sh` | Fails early if artifact lacks `pnpm-lock.yaml`; never falls back to unfrozen installs |
| `infrastructure/validation/validate-rollback-baseline.sh` | Validates artifact SHA-256, source commit, migration, build outputs, `pnpm-lock.yaml`, and immutable API/WEB image IDs without deploying |
| `infrastructure/validation/validate-artifact-deploy.sh` | Runs rollback baseline eligibility validation as part of artifact deployment tooling checks |

## Live Use

The current verified RC1 must remain untouched. To close Blocker 06, the VPS
must rehearse a rollback from a later verified forward deployment back to this
baseline, then redeploy the intended RC1 state through the canonical artifact
deployment path.

Blocker 06 remains open until the live rehearsal records:

- pre-rollback state;
- verified forward deployment state;
- rollback execution to the baseline above;
- rollback health and data integrity;
- redeploy execution;
- final RC1 artifact digest, source commit, API image ID, WEB image ID;
- post-redeploy health, data integrity, and staging validation.
