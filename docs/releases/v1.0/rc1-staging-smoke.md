# RC1 Staging Smoke Validation

Status: VERIFIED_LIVE  
Generated: 2026-08-09  
Scope: RC1 Blocker 04

## Required Smoke Coverage

| Flow | Status | Notes |
| --- | --- | --- |
| Public/web application loads | PASS | Operator-reported live staging smoke |
| API responds | PASS | Operator-reported live staging smoke |
| Authentication endpoint responds safely | PASS | Operator-reported live staging smoke |
| Authenticated context ignores spoofed identity headers | PASS | Covered by staging smoke script |
| Projects/documents/segments basic path | PASS | Covered by staging smoke script |
| Translation Memory proposal path | PASS | Covered by staging smoke script |
| Terminology validation path | PASS | Covered by staging smoke script |
| QA and Semantic Fidelity segment checks | PASS | Covered by staging smoke script |
| Workflow approval/export path | PASS | Covered by staging smoke script |
| JSON Master export artifact creation | PASS | Covered by staging smoke script |

## Repository-Supported Command

```bash
pnpm staging:smoke
```

The smoke script creates controlled closed-beta validation data through the API.
It should be run only against the intended staging environment with real staging
configuration loaded.

## Local Execution Limitation

The live smoke test was executed on the VPS and reported PASS. It was not
executed from this local Codex environment because no staging target
configuration or credentials are present.

The smoke project payload includes the current Project API contract:

```js
projectIdentity: {
  projectOrigin: "ORIGINAL_CREATION",
  rightsStatus: "ORIGINAL_CREATION"
}

publicationType: "BOOK"
```

Final live `validate-staging` result:

```json
{
  "status": "ok",
  "action": "validate-staging",
  "results": [
    {"name": "environment", "status": "ok"},
    {"name": "health", "status": "ok"},
    {"name": "bootstrap-admin-reviewer", "status": "ok"},
    {"name": "smoke-test", "status": "ok"},
    {"name": "monitoring-hook", "status": "ok"}
  ]
}
```

## Completion Signals

SMOKE_TESTS = PASS  
CONTROLLED_DATA_ONLY = PASS  
DATABASE_CONNECTIVITY = PASS
