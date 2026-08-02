# Backup Resource Classification

## Purpose

Resource classification defines how data and services are protected, restored,
retained, and tested according to criticality and recoverability.

## Criticality Tiers

Minimum resource tiers are:

- `TIER_0`: Identity, security, and critical keys.
- `TIER_1`: Master editorial data and rights.
- `TIER_2`: Publications, assets, and operational configurations.
- `TIER_3`: Search indexes, caches, and regenerable data.
- `TIER_4`: Temporary data.

## Examples

| Resource | Tier | Notes |
| --- | --- | --- |
| User identity and permissions | `TIER_0` | Must recover before dependent services |
| Critical secret metadata and key references | `TIER_0` | Raw secrets require specialized handling |
| Master document | `TIER_1` | Must restore with metadata, rights, provenance, versions, and approvals |
| Rights registry | `TIER_1` | Required before publication and distribution recovery |
| Published edition records | `TIER_2` | Must preserve package, metadata, and channel references |
| Search index | `TIER_3` | May be rebuilt if source data and indexing profile survive |
| Temporary rendering files | `TIER_4` | May be discarded when regeneration is possible |

## Derived Asset Recoverability

Every derived asset must be classified as one of:

- `BACKUP_REQUIRED`.
- `REGENERABLE`.
- `ARCHIVE_REQUIRED`.
- `TEMPORARY`.

Regenerable assets must preserve all source versions, generator versions,
configuration profiles, rights records, and validation evidence needed for
exact regeneration.

## Classification Rules

- Master records and audit records must not be classified as temporary.
- Rights and provenance records must not be treated as regenerable.
- Search indexes may be regenerable only when source records and index
  configuration are protected.
- Publicly distributed publication artifacts may require direct archive even
  when technically regenerable.
- Resource classification changes must be approved and audited.

