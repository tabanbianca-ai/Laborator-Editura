# Rights and Provenance Gap Analysis

## Purpose

This document compares the current implementation with the official Rights and
Provenance Module Architecture.

## Current Strengths

- Rights and Provenance backend module exists.
- Collaboration agreements exist.
- Translation authorizations exist.
- Publishing authorizations exist.
- Provenance records exist.
- Rights audit events exist.
- Rights workspace frontend exists.
- Publishing and Distribution Center consume rights warnings.
- Runtime database and backup/restore include rights tables.
- Tests cover module registration, authenticated endpoints, rights metadata,
  provenance, AI limits, persistence, backup/restore, and frontend workspace.
- Human Final Authority is explicitly preserved.

## Gap Table

| Area | Current State | Gap | Risk |
| --- | --- | --- | --- |
| Rights Record | Split authorizations | Canonical `RightsRecord` aggregate missing | High |
| Rights holder | String metadata | First-class rights holder registry missing | High |
| Rights types | Translation/publishing flags | Generalized rights type model missing | High |
| Licenses | Metadata only | Versioned License entity missing | High |
| Contracts | Collaboration agreements | Contract lifecycle, parties, amendments, renewals, expiry workflow incomplete | High |
| Provenance | Lightweight records | Library Item scope, validation status, versioning, acquisition method missing | Medium |
| Restrictions | Publishing flags and Library restrictions | Unified restriction model missing | High |
| Validation | Rights warnings and preflight | Reusable canonical verification endpoint missing | High |
| Legal history | Audit on create | Full immutable legal timeline missing | Medium |
| Workflow | Status fragments | Full legal workflow state missing | Medium |
| Search | List endpoints | Search by holder, contract, author, license missing | Medium |
| Expiration checks | Client warning for translation expiry | Async expiration checks missing | Medium |

## Risk Evaluation

High-risk gaps:

- Publication safety depends on a complete rights validation model.
- Licenses and contracts must become versioned records before large-scale
  legal reuse.
- Rights holders and rights types must become first-class to avoid ambiguous
  legal ownership.

Medium-risk gaps:

- Provenance should become Library Item scoped and versioned.
- Expiration checks and rights search are needed before high-volume use.
- Workflow integration should move from warnings toward reusable legal
  validation contracts.

## Implementation Constraint

All remediation must be:

- Additive.
- Auditable.
- Backward-compatible with current rights APIs.
- Integrated with Library, Translation, Publishing, Audio, Video, Workflow,
  Audit, and Notifications.
- Protective of Phase 7 Step 16 publishing/preflight/distribution behavior.
- Centralized so no other module creates its own rights system.
