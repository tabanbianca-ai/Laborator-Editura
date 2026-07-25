# Testing Strategy

## Purpose

This document defines the platform testing strategy that supports Chapter 14.

The strategy ensures that architecture, business rules, workflows, security,
accessibility, AI governance, publishing, and operations are validated before
release.

## Current Baseline

The repository currently includes automated tests in:

- `apps/api/tests` with 55 API, module, contract, integration, security, AI,
  workflow, publishing, and governance tests.
- `apps/web/tests` with 30 frontend contract, UI shell, workspace, i18n,
  navigation, and experience tests.
- `packages/db/tests` with 10 migration, runtime database, backup/restore, and
  persistence tests.
- `packages/shared/tests` with 2 shared JSON Master and language policy tests.

CI also validates selected JSON fixtures and infrastructure scripts.

## Test Strategy by Layer

| Layer | Test Focus | Current Coverage |
| --- | --- | --- |
| Domain | Business rules and invariants | Partially covered through contract tests |
| Application | Use cases, permissions, orchestration, audit | Broad API contract coverage |
| API | Requests, responses, auth, validation | Broad contract coverage |
| Database | Runtime persistence, migrations, backup/restore | Dedicated DB tests |
| Frontend | Route shells, UI contracts, i18n, workspaces | Frontend contract tests |
| Infrastructure | CI, Docker Compose, Nginx, scripts, secrets | CI validation and Infrastructure Pack |
| AI | Governance, cost, agents, fallback metadata | Contract and workflow tests |

## Testing Priorities

1. Critical business workflows.
2. Security and tenant isolation.
3. Human Final Authority.
4. Rights and provenance gates.
5. Publishing, preflight, distribution, and Library lifecycle.
6. Language policy and i18n.
7. Backup and restore.
8. AI governance and cost controls.
9. Accessibility and responsive behavior.
10. Performance and scalability.

## Acceptance Criteria

- Every release passes automated Quality Gates.
- Every new critical rule has a deterministic test.
- Every fixed defect receives a regression test.
- Test data remains versioned and independent from production.
