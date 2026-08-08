# Data Classification and Retention

The classification values are defined in `packages/shared/src/canonical-data.ts`:

- `PUBLIC`
- `INTERNAL`
- `CONFIDENTIAL`
- `RESTRICTED`

## Policy Matrix

| classification | retention_period | archive_policy | soft_delete_policy | hard_delete_policy | legal_hold_support | backup_tier | data_owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PUBLIC | publication lifecycle | archive public record on withdrawal | allowed when source remains | restricted | yes | TIER_1 | owning publication module |
| INTERNAL | project lifecycle plus audit retention | archive with project | allowed | restricted | yes | TIER_2 | owning module |
| CONFIDENTIAL | organization lifecycle plus legal/audit retention | archive with owner aggregate | allowed with audit | explicit approval only | yes | TIER_0/TIER_1 | owning module |
| RESTRICTED | legal/security retention | immutable audit archive | restricted | explicit legal/security approval only | yes | TIER_0 | security/rights owner |

Legal hold support is mandatory for confidential and restricted records and
must prevent permanent removal while the hold is active.

## Entity Defaults

- Identity: RESTRICTED
- Organization: CONFIDENTIAL
- Project: CONFIDENTIAL
- Manuscript: CONFIDENTIAL
- Work: INTERNAL
- Edition: INTERNAL
- Translation: CONFIDENTIAL
- Revision: CONFIDENTIAL
- Publication: INTERNAL or PUBLIC when released
- MagazineIssue: INTERNAL or PUBLIC when released
- Article: INTERNAL or PUBLIC when released
- DigitalAsset: CONFIDENTIAL until published
- RightsRecord: RESTRICTED
- Contract: RESTRICTED
- Workflow: CONFIDENTIAL
- Task: CONFIDENTIAL
- Notification: INTERNAL
- AuditRecord: RESTRICTED
- LocalizationResource: INTERNAL
- AIAsset: CONFIDENTIAL
