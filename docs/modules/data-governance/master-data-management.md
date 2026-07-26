# Master Data Management

## Purpose

Master Data Management provides the processes and records needed to govern
shared platform entities as canonical, versioned, traceable master data.

## Responsibilities

MDM is responsible for:

- Canonical entity definitions.
- Stable identifiers.
- Source system registration.
- Source priority metadata.
- Deduplication.
- Entity Resolution.
- Golden Records.
- Conflict preservation.
- Approval metadata.
- Version history.
- Data quality status.
- Classification and retention metadata.

## Current Repository Baseline

Current source-of-truth ownership is distributed by module:

- IAM owns users, credentials, sessions, roles, and access state.
- Enterprise Administration owns organization administration, teams,
  memberships, invitations, and administrative audit metadata.
- Projects owns project identity, taxonomy, capabilities, and dossiers.
- Author Studio owns manuscripts, sections, drafts, notes, and submissions.
- Documents and Segments own document metadata and source segments.
- Translation owns segment translations.
- Translation Memory owns validated reusable translation evidence.
- Terminology owns glossary and terminology governance.
- Lexicographic Intelligence owns dictionary sources, entries, senses, and
  citations.
- Rights and Provenance owns rights, authorizations, provenance, and legal
  metadata.
- Library owns publication records, editions, versions, files, and reading
  state.
- Publishing, Export, Public Portal, Commerce, Multimedia, Media Localization,
  Research, Collaboration, and other modules own their specialized records.

No central MDM hub currently reconciles shared entities across all modules.

## MDM Workflow

```text
Data Created or Imported
  -> Schema Validation
  -> Normalization
  -> Classification
  -> Quality Validation
  -> Duplicate Detection
  -> Steward Review
  -> Golden Record Update
  -> Catalog and Lineage Update
  -> Audit Record
```

## Rules

- Source module records are preserved.
- Golden Records reference all contributing source records.
- Conflicting values are retained with provenance and decision metadata.
- Automatic merge is allowed only for low-risk, pre-approved rules.
- Human review is required for editorial, legal, rights, identity, and
  publication-impacting merges.
- AI may propose matches but cannot approve Golden Records.

## Data Stewardship

Roles:

- Data Owner.
- Data Steward.
- Data Custodian.
- Data Consumer.

Responsibilities must be explicit per data domain and approval scope.
