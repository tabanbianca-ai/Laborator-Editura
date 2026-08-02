# Canonical Data Ownership Standard

## Purpose

Data ownership ensures that every business entity has exactly one owning
module and one canonical modification path.

## Ownership Rule

Each data type has one owner.

Only the owning module may modify owned data.

Other modules must use:

- Approved APIs.
- Events.
- Authorized queries.
- Approved read models.
- Documented contracts.

## Data Ownership Record

Each data ownership record should preserve:

- Data entity.
- Owning module.
- Allowed writers.
- Allowed readers.
- Public API.
- Published events.
- Read models.
- Backup owner.
- Audit owner.
- Versioning policy.
- Retention policy.
- Classification.

## Ownership Rules

- No module may create a competing source of truth.
- Cross-module references must use stable identifiers.
- Derived views must be marked as derived.
- Synchronization must not overwrite canonical owner records without contract.
- Public APIs and event payloads must not redefine canonical data models
  inconsistently.
- Data ownership changes require migration plan, compatibility review, backup
  plan, and audit.

## Current Canonical Ownership Baseline

Existing canonical owners include:

- IAM owns identity, sessions, roles, and permissions.
- Projects owns project identity and taxonomy.
- Documents owns document metadata and document records.
- Segments owns segment persistence.
- Translations owns translation records.
- Translation Memory owns validated TM evidence.
- Terminology owns glossary and terminology decisions.
- Semantic Fidelity owns semantic reports and issues.
- Workflow owns workflow states and transitions.
- Library owns publication identity and lifecycle records.
- Publishing owns official release state and publication snapshots.
- Rights and Provenance owns rights, authorizations, and provenance records.
- Backup owns backup and restore governance metadata.
- Observability owns metrics, logs, traces, and monitoring records.
- Policy Engine and Compliance own policy and compliance records.

