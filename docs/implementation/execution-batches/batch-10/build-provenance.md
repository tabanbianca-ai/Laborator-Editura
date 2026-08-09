# Build Provenance

Status: Provenance requirement defined; final artifact evidence pending  
Owner: DevSecOps

## Required Provenance Fields

- source repository;
- source commit;
- branch or tag;
- workflow run id;
- build timestamp;
- builder identity;
- package manager version;
- dependency lockfile digest;
- container image digest where applicable;
- artifact digest;
- test results;
- security scan results.

## Rule

The artifact promoted to staging and production must be the same immutable artifact or must have reproducible digest evidence proving equivalence.

## Current Gap

The current staging deployment builds on the VPS. RC1 must record digest/provenance evidence or explicitly approve this as an RC1 exception.

