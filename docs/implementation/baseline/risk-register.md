# Risk Register Baseline

Status: Batch 01 baseline

| ID | Risk | Severity | Status | Mitigation |
| --- | --- | --- | --- | --- |
| RISK-001 | Tracked generated artifacts under `.swift-module-cache` and `.pnpm-store`. | High | Open | Do not remove in Batch 01; add ignore coverage and schedule owner-approved cleanup. |
| RISK-002 | Secret scanner previously printed matched lines. | High | Mitigated in Batch 01 | Report only file paths and never matched values. |
| RISK-003 | Possible historical credentials in repository cannot be ruled out by pattern scan alone. | Medium | Open | Run expanded scan in CI and rotate any suspected credentials found by repository owners. |
| RISK-004 | Formatting enforcement may reveal older formatting drift. | Medium | Open | Add check gate; document any failure as release blocker rather than auto-formatting unrelated files. |
| RISK-005 | Existing UI hardcoded text may conflict with full i18n conventions. | Medium | Open | Batch 01 adds localization foundation; future migration required. |
| RISK-006 | CI dependency availability can skip full typecheck. | Medium | Open | Keep hosted CI plus local evidence; require green full suite before RC. |
| RISK-007 | Broad module surface increases regression risk. | Medium | Open | Batch 01 limits code changes to shared foundations, health checks, CI, and infrastructure validation. |

