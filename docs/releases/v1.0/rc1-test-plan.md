# RC1 Test Plan

Status: EXECUTED_WITH_BLOCKERS  
Candidate date: 2026-08-09  
Scope: Laborator Editura v1.0 RC1 pre-production validation

## Objective

Validate the current repository state as the RC1 candidate and decide whether it
is ready for pilot use and certification.

This plan does not add functionality, start v1.1 work, or change application
behavior. It records evidence only.

## Candidate Identification

Required RC1 identity fields:

| Field | Required Evidence |
| --- | --- |
| Source commit | `git rev-parse HEAD` |
| Branch | `git branch --show-current` |
| Application version | Root and workspace `package.json` versions |
| Database migration version | Ordered migration inventory |
| Build artifact or digest | Immutable artifact digest or formal missing-evidence record |
| Environment | Local validation and staging configuration status |
| Enabled modules | API module inventory from `AppModule` |
| Feature flags | Active runtime flag inventory or explicit none-found statement |

## Automated Test Gates

The automated gate includes:

- Workspace typecheck.
- API typecheck.
- Web typecheck.
- DB build.
- API build.
- Web production build.
- Workspace tests.
- DB tests.
- Shared package tests.
- Web frontend tests.
- API contract and integration tests.
- Format check.
- Lint.
- Configuration validation.
- Infrastructure validation.
- Secret scan.
- Runtime backup/restore validation.
- Dependency vulnerability audit.

## Critical Workflow Gates

Critical workflows must be validated by repository tests and, before RC1
approval, by a live staging smoke run:

- Create manuscript.
- Automatic analysis.
- Editing.
- Translation.
- Editorial review.
- Editorial validation.
- Layout.
- Export.
- Technical validation.
- Final approval.
- Publication.
- Optional audiobook.
- Optional video.
- Optional magazine digital outputs.
- Distribution Center.

## Security Gates

Mandatory security validation:

- Cross-organization isolation.
- RBAC and Need-to-Know restrictions.
- Privilege escalation denial.
- IDOR denial.
- Session expiration and idle controls.
- Secret scanning.
- Unauthorized AI, tool, document, and resource access denial.
- Public endpoints limited to approved public surfaces.
- Dependency vulnerability audit.
- SAST or equivalent static security scan where available.
- Container/runtime checks where available.

Any confirmed authorization or cross-organization bypass is a release blocker.

## Data Integrity Gates

Validate traceability across:

Project -> Master Document -> Version -> Translation/Correction -> Work ->
Edition -> Publication -> Distribution.

Also validate:

- Rights and Provenance.
- Assets.
- Export artifacts.
- Audit trail.
- Tenant boundaries.
- Backup/restore inclusion.

## Localization Gates

Validate platform UI localization for:

- Romanian.
- English.
- Spanish.
- French.
- Portuguese.
- Italian.
- German.

Platform Language must affect UI text only. It must not change Original
Language, Authoring Language, Target Language, manuscripts, or translations.

## Accessibility Gates

Validate critical workflows for:

- Keyboard navigation.
- Focus management.
- Semantic headings.
- Form labels.
- Error state clarity.
- Color contrast.
- Responsive/mobile use.

Repository contract coverage is not enough for final RC1 approval; browser-level
evidence is required.

## Operations Gates

Validate:

- API health.
- Web health.
- Logs.
- Metrics.
- Traces.
- Queues where applicable.
- Backup.
- Isolated restore.
- Deployment.
- Rollback.
- Provider failure and fallback.

Backup readiness cannot be approved only because backup jobs or scripts exist.
An isolated restore must be executed where infrastructure permits.

## Migration Gates

Validate:

- Clean migration path.
- Existing database path.
- Upgrade path.
- Runtime backup compatibility.
- Tenant-preserving restore.

## Performance Gates

Record baseline values for:

- Build time.
- Test time.
- First-load bundle sizes.
- API health latency where a live API is available.
- Critical workflow latency where staging is available.

## Status Definitions

| Status | Meaning |
| --- | --- |
| `RC1_PASS` | All required evidence passed. |
| `RC1_PASS_WITH_NON_BLOCKING_ISSUES` | No P0/P1 blockers remain. |
| `RC1_REMEDIATION_REQUIRED` | Blocking fixes are required before pilot. |
| `RC1_BLOCKED` | Required environment, artifact, restore, or security evidence is missing or failed. |

