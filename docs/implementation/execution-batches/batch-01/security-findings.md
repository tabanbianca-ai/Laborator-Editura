# Batch 01 Security Findings

## Findings

| ID | Severity | Finding | Status |
| --- | --- | --- | --- |
| SEC-001 | High | Secret scanner previously used output that could include matched secret values. | Fixed in Batch 01. |
| SEC-002 | High | Tracked generated caches exist in Git history/current index: `.swift-module-cache/**` and `.pnpm-store/v11/index.db`. | Open; owner-approved cleanup required. |
| SEC-003 | Medium | Pattern-based scan cannot prove historical credential absence. | Open; rotate any suspected real credentials discovered by repository owners. |

## Secret Rotation Guidance

No concrete secret values are reproduced in this report. If the hardened scanner reports
any suspected files, owners must inspect them locally and rotate any real exposed
credentials before release.

