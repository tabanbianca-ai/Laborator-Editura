# Rights and Provenance Migration Plan

## Purpose

This document defines the incremental path from the current implementation to
the official Rights and Provenance Module Architecture.

## Migration Principles

- Additive first.
- Preserve existing rights APIs until clients migrate.
- Preserve current Rights Workspace behavior.
- Preserve Publishing and Distribution Center rights warnings.
- Preserve Phase 7 Step 16 behavior.
- Preserve Library as the source of resource identity and contract assets.
- Preserve Human Final Authority.
- Preserve backup/restore compatibility.
- Do not allow independent rights management outside this module.

## Phase 1 - Baseline Mapping

Objectives:

- Map collaboration agreements, translation authorizations, publishing
  authorizations, provenance records, Library contract refs, Library license
  metadata, Library restrictions, Public Portal rights metadata, and Publishing
  preflight rights checks into the target Rights model.

Deliverables:

- Mapping table.
- Ownership boundary review.
- Contract test inventory.

## Phase 2 - Canonical Rights Record

Objectives:

- Introduce a canonical `RightsRecord` aggregate.
- Preserve existing translation and publishing authorization records as
  compatibility views or specialized records.

Deliverables:

- Rights record model.
- Rights type vocabulary.
- Status model.
- Audit events.

## Phase 3 - Rights Holder Registry

Objectives:

- Add rights holder records for authors, translators, illustrators,
  publishers, organizations, heirs, and literary agencies.
- Link rights holders to Rights Records.

Deliverables:

- Rights holder model.
- Holder search.
- Ownership transfer history plan.

## Phase 4 - Versioned License Management

Objectives:

- Add first-class versioned License records.
- Map Library/Public Portal license metadata into license references.

Deliverables:

- License entity.
- License version model.
- License compatibility validation.

## Phase 5 - Contract Lifecycle

Objectives:

- Add structured contract records that reference Library assets.
- Model parties, subject, territory, languages, formats, validity,
  restrictions, amendments, renewals, expiration, and termination.

Deliverables:

- Contract entity.
- Contract version/amendment model.
- Expiration validation.

## Phase 6 - Provenance Validation

Objectives:

- Link Provenance Records to Library Items and Library publications.
- Add validation status, acquisition method, source evidence references, and
  provenance versioning.

Deliverables:

- Provenance validation contract.
- Immutability rule.
- Correction-as-new-version behavior.

## Phase 7 - Compliance Validation Endpoint

Objectives:

- Add reusable validation for publication, translation, audio, video,
  adaptation, print, digital, and distribution actions.

Deliverables:

- `POST /rights/{id}/verify`.
- Validation verdict schema.
- Publishing gate tests.

## Phase 8 - Workflow and Expiration Automation

Objectives:

- Align rights states with Workflow Engine.
- Add asynchronous expiration checks and notification hooks.

Deliverables:

- Rights workflow mapping.
- Expiration job plan.
- Notification event plan.

## Phase 9 - Search and Performance Hardening

Objectives:

- Support millions of rights records.
- Add search by holder, contract, author, license, territory, language, and
  status.

Deliverables:

- Indexing plan.
- Search API.
- Performance baselines.

## Next Recommended Module

Module 6 - Magazine Module Architecture is now documented as the next Phase II
specification after Rights and Provenance.

Module 7 - AI Orchestration and Editorial Agents Module Architecture is now
documented after Magazine.

Module 8 - Audio and Narration Module Architecture is now documented after AI
Orchestration.

Module 9 - Video and Multimedia Module Architecture is now documented after
Audio and Narration.

The next recommended module specification after Video and Multimedia is
Module 10 - Workflow Engine and Business Process Automation Module
Architecture.
