# RC1 SBOM

Status: Missing for RC1 candidate  
Owner: DevSecOps

## Requirement

The RC1 SBOM must be bound to the exact RC1 artifact digest. A repository-generic SBOM is not sufficient.

## Required Fields

- release id;
- version;
- source commit;
- artifact digest;
- generated at;
- generator and version;
- package manager version;
- dependency lockfile digest or approved exception;
- container base image references where applicable.

## Current Status

No RC1 artifact-bound SBOM has been generated in this batch.

## RC1 Decision

BLOCKED until generated and linked to build provenance.

