# E2E Publishing Validation

Status: Repository contract tests passed; immutable publication artifact evidence pending  
Owner: Publishing Operations

## Required Journey

Approved Edition -> Publication Readiness -> Build -> PDF -> EPUB -> Validation -> Approval -> Publication Package -> Library.

## Evidence

- Publishing engine tests cover publication build package, validation, approval gates, regeneration policy, and JSON Master extension points.
- Publishing workflow tests cover preflight, distribution records, official editions, immutable publication records, and audit.
- Export and library contract tests passed locally.

## Traceability Rule

Publication packages must trace back to `master_document_version_id` or the canonical equivalent source-version identifier.

## RC1 Gap

The exact RC1 publication package artifact, digest, SBOM link, provenance, and staging smoke evidence are pending.

