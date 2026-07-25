# Test Catalog

## Purpose

This catalog inventories current automated tests and classifies them by area.

## Test Counts

| Location | Count | Primary Category |
| --- | ---: | --- |
| `apps/api/tests` | 55 | API/module contract and integration |
| `apps/web/tests` | 30 | Frontend contract and UI shell |
| `packages/db/tests` | 10 | Database, migration, runtime persistence |
| `packages/shared/tests` | 2 | Shared contract tests |

Total current test files: 97.

## API Test Areas

API tests cover:

- Authentication, authorization, localization foundation.
- Auth context security.
- Founder protection.
- Foundation audit and persistence.
- MVP foundation and end-to-end integration.
- Projects, project identity, publication types, taxonomy, dossiers.
- Documents, segments, translations, Translation Memory.
- Terminology, terminology governance, QA, Semantic Fidelity.
- Workflow.
- Lexicographic and linguistic knowledge.
- AI governance, AI agent governance, roles, functional workflows.
- Editorial decision agent.
- Layout publishing and publishing workflow/preflight/distribution.
- Public launch essentials.
- Author Studio.
- Research.
- Library and intelligent editorial library.
- Rights & Provenance.
- Collaboration and Community.
- Commerce and Public Portal.
- Multimedia and Media Localization.
- Scheduling.
- Platform Engineering.
- Gateway and integrations.
- Observability.
- Security governance and security hardening.
- Policy engine.
- Marketplace.
- Enterprise admin.
- Need-to-Know access.

## Web Test Areas

Web tests cover:

- Frontend shell.
- Core module screens.
- Auth localization foundation.
- UI internationalization.
- Editorial pipeline.
- Editorial production validation.
- Manuscript editor.
- Translation workspace.
- Review workspace.
- Publishing workspace.
- Distribution Center.
- Research workspace.
- Library workspace.
- Rights & Provenance workspace.
- Magazine digital experience.
- Marketplace, admin, entitlements, organization/team/platform creator UI.
- Unified language management UI.
- Advanced linguistic resources UI.
- Project identity, taxonomy, dossiers, publication capabilities.
- Launch readiness polish.
- Parallel review interface.
- Editorial workspace final.
- Intelligent editorial library UI.

## Database and Shared Test Areas

Database tests cover:

- Runtime database contract.
- Runtime backup and restore.
- MVP foundation migration.
- Translation Memory migration.
- Terminology migration.
- QA migration.
- Semantic Fidelity migration.
- Workflow migration.
- Security hardening migration.
- Founder protection migration.

Shared tests cover:

- JSON Master Format contract.
- Language policy contract.

## Fixture Data

Versioned fixture files exist under:

- `apps/api/fixtures`.
- `packages/shared/fixtures`.

These fixtures cover MVP workflows, QA, Semantic Fidelity, Terminology,
Translation Memory, Workflow, JSON Master, and language policy.

## Catalog Maintenance

Every new module or major workflow must add its tests to this catalog or to an
automated generated equivalent.
