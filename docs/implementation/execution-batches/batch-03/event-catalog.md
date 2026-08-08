# Event Catalog

The canonical event envelope is `CanonicalEventEnvelope` in
`packages/shared/src/canonical-data.ts`.

## Canonical Event Schema

Fields:

- `event_id`
- `event_name`
- `event_version`
- `occurred_at`
- `producer`
- `organization_id`
- `actor_id`
- `correlation_id`
- `causation_id`
- `subject_type`
- `subject_id`
- `payload`
- `metadata`

## Initial Event Contracts

| event_name | version | producer | subject_type | consumers | delivery |
| --- | --- | --- | --- | --- | --- |
| `IdentityCreated` | 1.0.0 | Auth | Identity | Audit, Workspace, Security | AT_LEAST_ONCE planned |
| `ProjectCreated` | 1.0.0 | Projects | Project | Workflow, Workspace, Rights | AT_LEAST_ONCE planned |
| `ManuscriptCreated` | 1.0.0 | Author Studio | Manuscript | Documents, Workflow | AT_LEAST_ONCE planned |
| `TranslationStarted` | 1.0.0 | Translations | Translation | Workflow, Review, QA | AT_LEAST_ONCE planned |
| `RevisionCompleted` | 1.0.0 | Review / Editorial Decisions | Revision | Workflow, Quality | AT_LEAST_ONCE planned |
| `EditionApproved` | 1.0.0 | Library / Commerce | Edition | Public Portal, Distribution | AT_LEAST_ONCE planned |
| `PublicationCreated` | 1.0.0 | Layout Publishing / Public Portal | Publication | Library, Commerce, Public Portal | AT_LEAST_ONCE planned |
| `RightsValidated` | 1.0.0 | Rights Provenance | RightsRecord | Workflow, Publishing, Quality | AT_LEAST_ONCE planned |

## Outbox Evaluation

No transactional outbox is implemented in Batch 03. Critical future candidates:

- publication approval;
- public release approval;
- rights validation;
- export artifact generation;
- identity/role security changes.

