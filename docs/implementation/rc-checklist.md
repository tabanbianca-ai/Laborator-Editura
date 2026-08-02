# CIMP Release Candidate Checklist

## Document Control

| Field | Value |
| --- | --- |
| Identifier | CODEX-CIMP-RC-CHECKLIST |
| Version | 1.0.0 |
| Status | Official RC checklist baseline |
| Owner | Codex Release Governance |
| Related plan | `docs/implementation/release-plan.md` |

## Purpose

This checklist defines the minimum evidence required for RC1, RC2, and Final
Release Candidate readiness.

## RC1 Checklist

| Item | Required state | Status |
| --- | --- | --- |
| Dependency install | Reproducible install documented and validated | Pending |
| API typecheck | Passing or documented environment blocker | Pending |
| Web typecheck | Passing or documented environment blocker | Pending |
| Shared package build | Passing | Pending |
| API build | Passing | Pending |
| Web production build | Passing | Pending |
| Backend tests | Required tests pass | Pending |
| Frontend tests | Required tests pass where available | Pending |
| Runtime DB tests | Required tests pass | Pending |
| Backup/restore dry-run | Passing | Pending |
| Staging deployment | Clean deployment validated | Pending |
| Health checks | API and web healthy | Pending |
| Editorial pipeline smoke test | Passing | Pending |
| Rights and provenance checks | Passing | Pending |
| Language policy checks | Passing | Pending |
| Publishing and distribution checks | Passing | Pending |
| Monitoring/logging checks | Passing | Pending |
| Critical blockers | None open | Pending |

## RC2 Checklist

| Item | Required state | Status |
| --- | --- | --- |
| RC1 findings resolved or accepted | Complete | Pending |
| High issues | Closed or formally deferred | Pending |
| Traceability matrix | Updated | Pending |
| Compliance matrix | Updated | Pending |
| Release notes | Drafted | Pending |
| Rollback procedure | Validated | Pending |
| Backup restore evidence | Retained | Pending |
| Accessibility smoke review | Passing or accepted findings | Pending |
| Localization smoke review | Passing or accepted findings | Pending |
| Security review | No Critical blockers | Pending |

## Final Release Candidate Checklist

| Item | Required state | Status |
| --- | --- | --- |
| RC2 findings resolved or accepted | Complete | Pending |
| Final readiness report | Complete | Pending |
| Certification evidence | Complete enough for release decision | Pending |
| Release checklist | Complete | Pending |
| Deployment checklist | Complete | Pending |
| Post-release monitoring checklist | Complete | Pending |
| Human release approval | Recorded | Pending |
| Final decision | GO or GO_WITH_RECOMMENDATIONS | Pending |

## Checklist Rule

A checklist item may be marked complete only when evidence exists or the
blocker is explicitly accepted by the authorized owner.
