# Editorial Review Gap Analysis

## Purpose

This document compares the current repository baseline with the official
Proofreading and Editorial Review Module Architecture.

## Current Strengths

- QA Engine exists.
- Semantic Fidelity Engine exists.
- Terminology Governance v2 exists.
- Lexicographic evidence exists.
- Editorial Decision Agent foundation exists.
- Collaboration and reviewer-note foundations exist.
- Workflow Engine exists with document approval gates.
- Review Workspace frontend exists.
- Parallel review interface contracts exist.
- Runtime persistence and backup/restore include supporting review-related
  tables.
- Human Final Authority is already a platform-wide rule.

## Gap Table

| Area | Current State | Gap | Risk |
| --- | --- | --- | --- |
| Editorial review aggregate | Not dedicated | Need first-class `EditorialReview` aggregate | High |
| Observations | Spread across QA, semantic issues, comments | Need unified observation statuses | High |
| Correction proposals | Frontend/generated and editorial-decision adjacent | Need persistent proposal accept/reject lifecycle | High |
| Non-destructive editing | Required by governance and UI contracts | Needs backend enforcement through proposal state | High |
| Linguistic validation | QA and terminology cover partial checks | Full grammar, agreement, inflection, conjugation, capitalization, spacing, quotes are incomplete | Medium |
| Style validation | Semantic and editorial decisions help | Dedicated style profiles and checks are missing | Medium |
| Doctrinal review | Terminology/domain support exists | Doctrinal rule configuration is not first-class | Medium |
| API | Supporting APIs exist | Canonical `/editorial-reviews` API is missing | Medium |
| Events | Supporting audit exists | Dedicated Editorial Review event stream is missing | Medium |
| Version comparison | Review UI has comparison concepts | Backend compare service is missing | Medium |
| Real-time collaboration | Comments exist | Real-time comments are not implemented | Medium |
| Performance | Runtime lookup exists | Observation/term search needs indexing for large documents | Medium |

## Risk Evaluation

High-risk gaps:

- Without a canonical aggregate, review state can remain fragmented across QA,
  semantic, terminology, workflow, comments, and editorial decisions.
- Correction proposals must become persistent and non-destructive before
  production review can safely change text.
- Observation state must be unified so that publishing gates can reason about
  review completeness.

Medium-risk gaps:

- Style and linguistic validation need language-specific rule configuration.
- Doctrinal review must be configurable per project without hardcoding domain
  rules.
- Version comparison and search need performance planning before large-scale
  editorial use.

## Implementation Constraint

Remediation must be:

- Additive.
- Versioned.
- Auditable.
- Backward-compatible with current clients.
- Integrated with Library, Translation, Terminology, QA, Semantic Fidelity,
  Workflow, Audit, and Publishing.
- Non-disruptive to Phase 7 Step 16 publishing, preflight, and distribution
  behavior.
