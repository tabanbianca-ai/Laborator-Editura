# API Inventory

API endpoint contracts are represented by `ApiEndpointContract` in
`packages/shared/src/canonical-data.ts`.

## Controller Inventory

The repository contains 36 controller files under `apps/api/src/modules`.

| owning_module | base_path | classification | authentication | repository_path |
| --- | --- | --- | --- | --- |
| Health | `/health` | PUBLIC | public health only | `apps/api/src/modules/health.controller.ts` |
| Auth | `/auth` | MIXED | public login/reset/verify, otherwise authenticated | `apps/api/src/modules/auth/auth.controller.ts` |
| Projects | `/projects` | AUTHENTICATED | required | `apps/api/src/modules/projects/projects.controller.ts` |
| Documents | `/documents` | AUTHENTICATED | required | `apps/api/src/modules/documents/documents.controller.ts` |
| Segments | `/segments` | AUTHENTICATED | required | `apps/api/src/modules/segments/segments.controller.ts` |
| Translations | `/translations` | AUTHENTICATED | required | `apps/api/src/modules/translations/translations.controller.ts` |
| Translation Memory | `/translation-memory` | AUTHENTICATED | required | `apps/api/src/modules/translation-memory/translation-memory.controller.ts` |
| Terminology | `/terminology` | AUTHENTICATED | required | `apps/api/src/modules/terminology/terminology.controller.ts` |
| QA | `/qa` | AUTHENTICATED | required | `apps/api/src/modules/qa/qa.controller.ts` |
| Semantic Fidelity | `/semantic-fidelity` | AUTHENTICATED | required | `apps/api/src/modules/semantic-fidelity/semantic-fidelity.controller.ts` |
| Workflow | `/workflow` | AUTHENTICATED | required | `apps/api/src/modules/workflow/workflow.controller.ts` |
| Export | `/export` | AUTHENTICATED | required | `apps/api/src/modules/export/export.controller.ts` |
| Lexicographic | `/lexicographic` | AUTHENTICATED | required | `apps/api/src/modules/lexicographic/lexicographic.controller.ts` |
| Editorial Decisions | `/editorial-decisions` | AUTHENTICATED | required | `apps/api/src/modules/editorial-decisions/editorial-decisions.controller.ts` |
| Layout Publishing | `/layout-publishing` | AUTHENTICATED | required | `apps/api/src/modules/layout-publishing/layout-publishing.controller.ts` |
| Multimedia | `/multimedia` | AUTHENTICATED | required | `apps/api/src/modules/multimedia-creation/multimedia-creation.controller.ts` |
| Media Localization | `/media-localization` | AUTHENTICATED | required | `apps/api/src/modules/media-localization/media-localization.controller.ts` |
| Platform Engineering | `/platform-engineering` | AUTHENTICATED | required | `apps/api/src/modules/platform-engineering/platform-engineering.controller.ts` |
| Scheduling | `/scheduling` | AUTHENTICATED | required | `apps/api/src/modules/scheduling/scheduling.controller.ts` |
| Public Portal Admin | `/public-portal` | ADMINISTRATIVE | required | `apps/api/src/modules/public-portal/public-portal.controller.ts` |
| Public Catalog | `/public/catalog` | PUBLIC | public read projection | `apps/api/src/modules/public-portal/public-portal.controller.ts` |
| Commerce | `/commerce` | ADMINISTRATIVE | required | `apps/api/src/modules/commerce/commerce.controller.ts` |
| Public Store | `/public/store` | PUBLIC | public read projection | `apps/api/src/modules/commerce/commerce.controller.ts` |
| Library | `/library` | AUTHENTICATED | required | `apps/api/src/modules/library/library.controller.ts` |
| Collaboration | `/collaboration` | AUTHENTICATED | required | `apps/api/src/modules/collaboration/collaboration.controller.ts` |
| Community | `/community` | AUTHENTICATED | required for mutation | `apps/api/src/modules/collaboration/collaboration.controller.ts` |
| Public Community | `/public/community` | PUBLIC | approved public read projection | `apps/api/src/modules/collaboration/collaboration.controller.ts` |
| Research | `/research` | AUTHENTICATED | required | `apps/api/src/modules/research/research.controller.ts` |
| Gateway | `/gateway` | AUTHENTICATED | required | `apps/api/src/modules/gateway/gateway.controller.ts` |
| Integrations | `/integrations` | AUTHENTICATED | required | `apps/api/src/modules/gateway/gateway.controller.ts` |
| Webhooks | `/webhooks` | AUTHENTICATED | required | `apps/api/src/modules/gateway/gateway.controller.ts` |
| Observability | `/observability` | AUTHENTICATED | required | `apps/api/src/modules/observability/observability.controller.ts` |
| Security Governance | `/security` | ADMINISTRATIVE | required | `apps/api/src/modules/security-governance/security-governance.controller.ts` |
| Backup Governance | `/backup` | ADMINISTRATIVE | required | `apps/api/src/modules/backup-governance/backup-governance.controller.ts` |
| AI Governance | `/ai-governance` | ADMINISTRATIVE | required | `apps/api/src/modules/ai-governance/ai-governance.controller.ts` |
| Policy Engine | `/policies` | ADMINISTRATIVE | required | `apps/api/src/modules/policy-engine/policy-engine.controller.ts` |
| Enterprise Admin | `/admin` | ADMINISTRATIVE | required | `apps/api/src/modules/enterprise-admin/enterprise-admin.controller.ts` |
| Marketplace | `/marketplace` | AUTHENTICATED | required | `apps/api/src/modules/marketplace/marketplace.controller.ts` |
| Workspace | `/workspace` | AUTHENTICATED | required | `apps/api/src/modules/workspace/workspace.controller.ts` |
| Rights Provenance | `/rights` | AUTHENTICATED | required | `apps/api/src/modules/rights-provenance/rights-provenance.controller.ts` |
| Launch Essentials | `/launch-essentials` | AUTHENTICATED | required | `apps/api/src/modules/launch-essentials/launch-essentials.controller.ts` |
| Author Studio | `/author-studio` | AUTHENTICATED | required | `apps/api/src/modules/author-studio/author-studio.controller.ts` |

## Unversioned APIs

Current route paths do not include `/v1`. Compatibility is preserved by
documenting all current endpoints as `version = v1` in the contract catalog.
A future gateway/API versioning batch may add explicit path or header
versioning without breaking these routes.

