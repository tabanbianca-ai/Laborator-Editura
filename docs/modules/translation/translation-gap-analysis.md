# Translation Gap Analysis

## Purpose

This document compares the current implementation with the Phase II
Translation Module Architecture specification.

## Current Strengths

- Segment persistence exists.
- Translation persistence exists.
- Translation target language policy is enforced through shared language
  policy.
- Translation Memory exists with exact, fuzzy, and context proposal concepts.
- Terminology governance v2 exists.
- Lexicographic evidence is integrated into translation and terminology.
- QA Engine exists.
- Semantic Fidelity Engine exists.
- Workflow Engine exists with blocking rules.
- Translation workspace frontend exists.
- Runtime database and backup/restore include translation-related tables.
- Contract tests exist for TM, terminology, QA, semantic fidelity, workflow,
  lexicographic integration, and translation UI.

## Gap Table

| Area | Current State | Gap | Risk |
| --- | --- | --- | --- |
| Library linkage | Translation references project/document/segment | Direct canonical Library Item linkage is not mandatory | High |
| Translation project aggregate | Segments and translations exist | Top-level Translation Project is not explicit | Medium |
| Segment versioning | Multiple translations can exist | Immutable segment version lineage is not formalized | High |
| Context schema | Metadata supports context | Chapter, paragraph, author, edition, neighbors are not standardized | Medium |
| AI orchestration | Translation service gathers evidence | Dedicated AI translation orchestration contract is not explicit | Medium |
| Grammar/style checks | QA and terminology checks exist | Full language-specific grammar/style checks are incomplete | Medium |
| Version comparison | Not a backend service | Segment/document diff and restore are not implemented | Medium |
| Review flow | Workflow and review UI exist | Translation-specific review proposal states need consolidation | Medium |
| API versioning | Authenticated routes exist | Public versioning scheme is not visible in route paths | Low |
| Performance | Runtime search and lookup exist | Million-segment TM/search needs dedicated indexing | High |

## Risk Evaluation

High-risk gaps:

- Translation must not drift away from Library as source of truth.
- Segment and translation version history must become immutable and
  restorable.
- Translation Memory and search performance need scale planning before large
  production corpora.

Medium-risk gaps:

- Context model, grammar/style validation, and review proposals need deeper
  formalization.
- AI orchestration is integrated as service calls but not yet a dedicated
  translation AI execution record.

## Implementation Constraint

All remediation must be additive and preserve:

- Current segment and translation APIs.
- Existing Translation Memory behavior.
- Terminology Governance v2 priority.
- QA and Semantic Fidelity checks.
- Workflow blocking behavior.
- Phase 7 Step 16 publishing, preflight, and distribution behavior.
- Backup/restore compatibility.
