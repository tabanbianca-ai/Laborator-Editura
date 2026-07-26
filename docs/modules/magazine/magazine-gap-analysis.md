# Magazine Gap Analysis

## Purpose

This document compares the current repository baseline with the official
Magazine Module Architecture.

## Current Strengths

- Magazine is supported as a project publication type.
- Flipbook is supported as a magazine-only project capability.
- Library supports Magazine and Article concepts.
- Author Studio supports Magazine Article manuscripts.
- Magazine Digital Experience UI exists.
- Magazine issue list and issue detail routes exist.
- Existing UI reuses Projects, Documents, Rights, and language metadata.
- Layout Publishing supports magazine layout planning.
- Publishing/Distribution Center has magazine flipbook readiness.
- Public Portal supports Magazine and Article catalog item types.
- Rights warnings are integrated into magazine UI.
- Contract tests cover magazine digital experience behavior.

## Gap Table

| Area | Current State | Gap | Risk |
| --- | --- | --- | --- |
| Magazine aggregate | Project `MAGAZINE` exists | Dedicated `Magazine` entity missing | Medium |
| Volume model | Editorial classification volume exists | First-class `MagazineVolume` missing | Medium |
| Issue model | Frontend maps project to issue | Dedicated `MagazineIssue` missing | High |
| Section/rubric model | Not first-class | Configurable section model missing | Medium |
| Article assignment | Documents inferred by project | Assignment/order records missing | High |
| Article reuse | Library supports articles | Reuse across issues not modeled | High |
| Issue versioning | Not first-class | Issue version model missing | High |
| Issue layout | Layout plan supports magazine | Issue-specific layout placement missing | Medium |
| Publication handoff | Publishing exists | Canonical issue-to-Publishing handoff missing | Medium |
| Archive | Not modeled | Issue archive state missing | Medium |
| APIs | No dedicated backend routes | `/magazines`, `/issues`, `/articles` missing | High |
| Events | Distributed audit exists | Magazine events missing | Medium |
| Performance | Frontend read model exists | Full-text article/issue indexing missing | Medium |

## Risk Evaluation

High-risk gaps:

- Articles must remain reusable Library Items with no duplicated issue content.
- Issue identity and article assignment must become first-class before
  production-scale magazine workflows.
- Issue versioning is required before official publication and archive.

Medium-risk gaps:

- Section/rubric configuration and layout placement need explicit models.
- Magazine-specific APIs and events should wrap existing services without
  breaking current Library, Publishing, Rights, Translation, or Review flows.
- Full-text search and parallel publication generation need performance
  planning.

## Implementation Constraint

All remediation must be:

- Additive.
- Auditable.
- Backward-compatible with current Magazine Digital Experience.
- Integrated with Library, Translation, Editorial Review, Rights and
  Provenance, Layout Publishing, Publishing, Public Portal, Workflow, and
  Audit.
- Protective of Phase 7 Step 16 publishing/preflight/distribution behavior.
