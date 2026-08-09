# Public Website Integration Baseline

Status: ARCHITECTURE_ANALYSIS_CREATED  
Owner: Product Governance

## Purpose

This document evaluates integration of `laboratoreditorial.com` with the
internal Laborator Editura platform for v1.1 planning.

## Target Architecture

The public website remains an independent public-facing application. The
internal platform remains the canonical editorial source of truth.

```text
Laborator Editura internal platform
        |
        | Canonical governed public APIs
        v
laboratoreditorial.com
        |
        +-- Catalog
        +-- Publications
        +-- Authors
        +-- Reader
        +-- Store
```

## Existing Repository Foundation

- `public-portal` backend foundation exists.
- `commerce` backend foundation exists.
- `library` and reader experience foundations exist.
- `rights-provenance` foundation exists.
- `gateway` and integration registry foundations exist.

## v1.1 Candidate Scope

- Define public API read models for catalog, publication pages, authors, reader
  metadata, and store metadata.
- Keep editorial publishing approval inside the internal platform.
- Expose only approved public records.
- Preserve rights, provenance, language, publication lineage, and audit.
- Keep website deployment independent from the internal application.

## Non-Goals

- Do not merge the public website into the internal editorial app.
- Do not duplicate the editorial source of truth.
- Do not expose private manuscripts, internal comments, rights negotiations, or
  administration data.
- Do not add payment provider execution without a separate approved commerce
  requirement.

## Readiness Gates

- Certified v1.0 baseline exists.
- Public API contract is defined.
- Rights/publication visibility rules are validated.
- Security and privacy review passes.
- Rollback strategy is documented.

