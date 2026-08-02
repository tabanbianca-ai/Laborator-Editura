# Conflict Register

Status: Batch 01 baseline

## Purpose

This register records conflicts or tensions discovered before Batch 01 changes.

| ID | Conflict | Impact | Resolution path |
| --- | --- | --- | --- |
| CON-001 | Generated cache artifacts are tracked while ignore rules also imply generated artifacts should be excluded. | Repository size and review noise risk. | Document now; require explicit owner-approved cleanup in a later batch. |
| CON-002 | CI can skip typecheck when dependencies are unavailable, while release standards require typecheck evidence. | CI evidence may be incomplete during network/package outages. | Preserve fallback; require local or hosted successful typecheck before release candidate. |
| CON-003 | Formatting script exists as write-only, not check-only. | CI cannot enforce non-mutating formatting until a check command exists. | Add check command and CI step. |
| CON-004 | Localization requirement prohibits hardcoded UI text, but existing UI phases include many labels before full i18n migration. | Launch localization compliance is incomplete. | Record hardcoded text migration as future cleanup; Batch 01 creates baseline only. |

