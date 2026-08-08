# Lifecycle State Catalog

Lifecycle definitions are represented by `LifecycleDefinition` in
`packages/shared/src/canonical-data.ts`.

| lifecycle_definition_id | entity_type | states | terminal_state | audit_policy |
| --- | --- | --- | --- | --- |
| `identity.lifecycle.v1` | Identity | INVITED, PENDING_VERIFICATION, ACTIVE, SUSPENDED, LOCKED, DISABLED, ARCHIVED | ARCHIVED | ALWAYS |
| `project.lifecycle.v1` | Project | DRAFT, ACTIVE, ARCHIVED | ARCHIVED | ALWAYS |
| `manuscript.lifecycle.v1` | Manuscript | DRAFT, SUBMITTED, APPROVED, ARCHIVED | ARCHIVED | ALWAYS |
| `translation.lifecycle.v1` | Translation | DRAFT, REVIEWED, APPROVED, ARCHIVED | ARCHIVED | ALWAYS |
| `revision.lifecycle.v1` | Revision | PENDING, ACCEPTED, REJECTED, ARCHIVED | ARCHIVED | ALWAYS |
| `publication.lifecycle.v1` | Publication | DRAFT, READY, PUBLISHED, WITHDRAWN, ARCHIVED | ARCHIVED | ALWAYS |
| `rights.lifecycle.v1` | RightsRecord | DRAFT, ACTIVE, EXPIRED, REVOKED, ARCHIVED | ARCHIVED | ALWAYS |
| `workflow.lifecycle.v1` | Workflow | DRAFT, IN_TRANSLATION, IN_QA, IN_REVIEW, APPROVED, READY_FOR_EXPORT, EXPORTED, BLOCKED | EXPORTED | ALWAYS |
| `audit.lifecycle.v1` | AuditRecord | RECORDED, RETAINED, ARCHIVED | ARCHIVED | CRITICAL_ONLY |

## Rules

- Persistent states use controlled values.
- Critical transitions are validated in backend services.
- Invalid transitions are rejected.
- Archiving is represented as lifecycle state, not uncontrolled deletion.
- Historical state names must be mapped, not silently replaced.

