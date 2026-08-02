# CIMP Release Plan

## Document Control

| Field | Value |
| --- | --- |
| Identifier | CODEX-CIMP-RELEASE-PLAN |
| Version | 1.0.0 |
| Status | Official release plan baseline |
| Owner | Codex Release Governance |
| Related plan | `docs/implementation/master-plan.md` |

## Purpose

This document defines the Release Candidate path for the Codex implementation
program.

## Release Sequence

```text
CIMP Execution
-> RC1
-> RC2
-> Final Release Candidate
-> Codex v1.0
```

## RC1 Objective

RC1 proves that the end-to-end platform can be built, tested, deployed to
staging, validated through core workflows, backed up, restored, monitored, and
documented with no Critical blockers.

## RC2 Objective

RC2 proves that RC1 findings have been resolved or formally accepted, High
issues are closed or explicitly deferred, traceability evidence is complete
enough, and user-facing flows are ready for controlled launch.

## Final Release Candidate Objective

Final RC proves that Codex v1.0 is ready for final certification, operational
handover, and release approval.

## Release Gates

| Gate | Required result |
| --- | --- |
| Build | API, web, shared packages, and workspace builds pass where configured. |
| Typecheck | Typecheck passes for configured workspaces. |
| Tests | Required backend, frontend, contract, integration, DB, backup, and fixture tests pass. |
| Security | No Critical security blockers remain. |
| Data | Backup and restore dry-run evidence is present. |
| Workflow | Editorial Production Pipeline smoke test passes. |
| Publishing | Export, preflight, rights, and distribution readiness are validated. |
| UX | Main routes load and localization/accessibility smoke checks pass. |
| Operations | Health, logs, monitoring, rollback, and runbooks are validated. |
| Documentation | CEMI, CIMP, standards, roadmap, and release docs are updated. |
| Audit | Required audit paths are verified or tracked as accepted gaps. |

## Release Decision States

| State | Meaning |
| --- | --- |
| GO | Release may proceed. |
| GO_WITH_RECOMMENDATIONS | Release may proceed with accepted non-blocking findings. |
| NO_GO | Release must not proceed until blockers are resolved. |

## Non-Goals

CIMP release planning does not:

- Add new architecture standards.
- Add new product modules.
- Modify runtime behavior by itself.
- Bypass Human Final Authority.
- Bypass security, rights, audit, testing, or compliance gates.
