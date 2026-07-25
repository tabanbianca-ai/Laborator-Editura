# Backend Dependency Map

## Purpose

This document inventories current backend modules, route families, and
observed dependencies for the Chapter 12 baseline audit.

## Module Inventory

| Module | Main Route Family | Current Files | Primary Responsibility |
| --- | --- | --- | --- |
| `auth` | `auth` | controller, module, repository, service, types, middleware, decorator | IAM, sessions, profiles, founder protection |
| `projects` | `projects` | controller, module, repository, service, types | Projects, identity, dossiers |
| `documents` | `documents` | controller, module, repository, service, types | Documents |
| `segments` | `segments` | controller, module, repository, service, types | Segment persistence |
| `translations` | `translations` | controller, module, repository, service, types | Translation submission and validation orchestration |
| `translation-memory` | `translation-memory` | controller, module, repository, service, types, utils | Translation Memory proposals and approval |
| `terminology` | `terminology` | controller, module, repository, service, types, utils | Glossary, terminology governance, checks |
| `qa` | `qa` | controller, module, repository, service, types, utils | QA reports and issues |
| `semantic-fidelity` | `semantic-fidelity` | controller, module, repository, service, types, utils | Semantic fidelity checks |
| `workflow` | `workflow` | controller, module, repository, service, types | Workflow state and gates |
| `export` | `export` | controller, module, repository, service, types | Export artifacts and JSON Master export |
| `lexicographic` | `lexicographic` | controller, module, repository, service, types | Dictionary sources, entries, evidence |
| `editorial-decisions` | `editorial-decisions` | controller, module, repository, service, types | Editorial recommendations |
| `layout-publishing` | `layout-publishing` | controller, module, repository, service, types | Layout plans, preflight, publishing, distribution tracking |
| `library` | `library` | controller, module, repository, service, types | Library, publications, reader state |
| `rights-provenance` | `rights` | controller, module, repository, service, types | Rights, authorizations, provenance |
| `research` | `research` | controller, module, repository, service, types | Research sources, notes, entities, collections |
| `collaboration` | `collaboration`, `community`, `public/community` | controller, module, repository, service, types | Collaboration and community moderation |
| `public-portal` | `public-portal`, `public` | controller, module, repository, service, types | Public catalog and distribution metadata |
| `commerce` | `commerce`, `public` | controller, module, repository, service, types | Editions, channels, print profiles, store metadata |
| `author-studio` | `author-studio` | controller, module, repository, service, types | Manuscripts, sections, drafts, notes |
| `multimedia-creation` | `multimedia` | controller, module, repository, service, types | Media projects and assets |
| `media-localization` | `media-localization` | controller, module, repository, service, types | Media localization projects and assets |
| `workspace` | `workspace` | controller, module, repository, service, types | Navigation, dashboard, preferences, Need-to-Know |
| `enterprise-admin` | `admin` | controller, module, repository, service, types | Organization, teams, users, roles |
| `ai-governance` | `ai-governance` | controller, module, repository, service, types | Providers, usage, budgets, quotas |
| `policy-engine` | `policies` | controller, module, repository, service, types | Policies, compliance, exceptions |
| `security-governance` | `security` | controller, module, repository, service, types | Security policies, access reviews, security events |
| `backup-governance` | `backup` | controller, module, repository, service, types | Backup jobs, restore events, retention, DR plans |
| `observability` | `observability` | controller, module, repository, service, types | Metrics, logs, traces, agent executions |
| `gateway` | `gateway`, `integrations`, `webhooks` | controller, module, repository, service, types | Route registry, API keys, integrations, webhooks |
| `platform-engineering` | `platform-engineering` | controller, module, repository, service, types | Health diagnostics and planning records |
| `scheduling` | `scheduling` | controller, module, repository, service, types | Agenda, tasks, events, reminders |
| `marketplace` | `marketplace` | controller, module, repository, service, types | AI agents and extension registry |
| `launch-essentials` | `launch-essentials` | controller, module, repository, service, types | MFA, GDPR, secret metadata, attribution metadata |
| `security` | middleware/utilities | middleware, environment security | Headers, rate limits, environment validation |
| `health.controller` | `health` | controller | Minimal public health check |

## Observed Cross-Module Dependencies

| Consumer | Dependencies | Purpose |
| --- | --- | --- |
| `documents` | `projects` | Validate project context for documents |
| `segments` | `documents` | Validate document context for segments |
| `translations` | `segments`, `lexicographic`, `translation-memory`, `terminology`, `qa`, `semantic-fidelity` | Submit translation and attach validation evidence |
| `qa` | `terminology` | Run terminology-aware QA checks |
| `semantic-fidelity` | `lexicographic`, `terminology`, `translation-memory`, `qa` | Run semantic checks with supporting evidence |
| `workflow` | `qa`, `semantic-fidelity` | Enforce review and approval gates |
| `export` | `auth`, `projects`, `documents`, `segments`, `translations`, `workflow` | Build export artifacts from approved project data |
| `editorial-decisions` | `lexicographic`, `terminology`, `translation-memory`, `semantic-fidelity` | Generate editorial recommendations |
| `layout-publishing` | `export`, `library`, `rights-provenance`, `workflow` | Publish, preflight, and track distribution |
| `media-localization` | `layout-publishing`, `lexicographic`, `multimedia-creation`, `semantic-fidelity`, `terminology`, `translations` | Attach localization evidence to media projects |

## Shared Dependencies

Most protected controllers depend on:

- `CurrentActor`.
- `AuthenticatedRequestContext`.

Most persisted modules depend on:

- `runtimeDatabaseProvider`.
- `RuntimeDatabase`.

## Dependency Risks

- High-dependency services currently import concrete service implementations.
- Public contracts are not yet extracted from private module internals.
- Runtime database table ownership is central but should remain controlled by
  repository boundaries.
- Future provider integrations must be routed through Gateway or AI
  Orchestration adapters.

## Required Follow-Up

Before structural implementation, create public contract boundaries for the
highest dependency modules:

1. Auth.
2. Projects.
3. Documents.
4. Segments.
5. Translations.
6. Translation Memory.
7. Terminology.
8. QA.
9. Semantic Fidelity.
10. Workflow.
11. Library.
12. Rights & Provenance.
13. Export.
