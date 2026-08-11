# RC1 Staging Smoke Validation

Status: NOT_EXECUTED_LIVE  
Generated: 2026-08-09  
Scope: RC1 Blocker 04

## Required Smoke Coverage

| Flow | Status | Notes |
| --- | --- | --- |
| Public/web application loads | NOT_VERIFIED | Requires live staging web endpoint |
| API responds | NOT_VERIFIED | Requires live staging API endpoint |
| Authentication endpoint responds safely | NOT_VERIFIED | Requires live staging API endpoint |
| Authenticated context ignores spoofed identity headers | NOT_VERIFIED | Covered by script, not executed here |
| Projects/documents/segments basic path | NOT_VERIFIED | Covered by staging smoke script |
| Translation Memory proposal path | NOT_VERIFIED | Covered by staging smoke script |
| Terminology validation path | NOT_VERIFIED | Covered by staging smoke script |
| QA and Semantic Fidelity segment checks | NOT_VERIFIED | Covered by staging smoke script |
| Workflow approval/export path | NOT_VERIFIED | Covered by staging smoke script |
| JSON Master export artifact creation | NOT_VERIFIED | Covered by staging smoke script |

## Repository-Supported Command

```bash
pnpm staging:smoke
```

The smoke script creates controlled closed-beta validation data through the API.
It should be run only against the intended staging environment with real staging
configuration loaded.

## Local Execution Limitation

The live smoke test was not executed from this environment because no staging
target configuration or credentials are present. Running the script locally
would target localhost defaults rather than the live VPS.

## Completion Signals

SMOKE_TESTS = NOT_VERIFIED  
CONTROLLED_DATA_ONLY = NOT_VERIFIED  
DATABASE_CONNECTIVITY = NOT_VERIFIED
