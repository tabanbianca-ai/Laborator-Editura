# v1.1 Backlog Inventory

Status: PLANNING_BASELINE_CREATED  
Owner: Product Governance

## Purpose

This inventory consolidates deferred v1.1 candidates, non-blocking findings,
technical debt, performance opportunities, future integrations, and approved
candidate themes into one backlog source.

## Source Documents

- `docs/roadmap/v1.1-backlog.md`
- `docs/releases/v1.0/v1.1-backlog.md`
- `docs/implementation/execution-batches/batch-11/roadmap-v1.1.md`
- `docs/implementation/execution-batches/batch-11/known-issues.md`
- `docs/implementation/execution-batches/batch-11/defect-register.md`
- `docs/implementation/execution-batches/batch-11/risk-burndown.md`
- `docs/implementation/execution-batches/batch-11/final-implementation-inventory.md`

## Classification Model

- `ALREADY_SATISFIED`: implemented by the v1.0 foundation and not a v1.1 item.
- `EXTENSION`: expands an implemented foundation without creating a duplicate module.
- `DUPLICATE`: overlaps another item and should not remain separate.
- `CONSOLIDATE`: keep one canonical requirement and merge overlapping wording.
- `NEW_REQUIREMENT`: not represented by the existing foundation.
- `REJECTED`: not aligned with the roadmap or product rules.
- `NEEDS_DECISION`: requires owner decision before roadmap inclusion.

## Canonical Backlog

| ID | Candidate | Category | Repository evidence | Classification | Priority | Candidate wave | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| V11-BL-001 | Resolve v1.0 certification blockers before v1.1 execution | RELEASE_BLOCKER | v1.0 certification is `NOT_CERTIFIED`; RC1 evidence is blocked | CONSOLIDATE | P0 | Pre-Wave | REQUIRED_BEFORE_IMPLEMENTATION |
| V11-BL-002 | Dependency reproducibility and lockfile decision | TECHNICAL_DEBT | Batch 11 records missing root `pnpm-lock.yaml` | EXTENSION | P1 | Wave 1 | READY_FOR_ANALYSIS |
| V11-BL-003 | Final restore evidence automation | TECHNICAL_DEBT | Restore foundation exists; final candidate restore evidence missing | EXTENSION | P1 | Wave 1 | READY_FOR_ANALYSIS |
| V11-BL-004 | SBOM and build provenance automation | TECHNICAL_DEBT | SBOM/provenance documents exist but final artifact data is missing | EXTENSION | P1 | Wave 1 | READY_FOR_ANALYSIS |
| V11-BL-005 | Public website integration through governed public APIs | FUTURE_INTEGRATION | Public Portal foundation exists; independent public website is not integrated | EXTENSION | P1 | Wave 2 | NEEDS_DESIGN |
| V11-BL-006 | Advanced commerce and payment provider activation | FUTURE_INTEGRATION | Commerce foundation exists; payment providers are not connected | EXTENSION | P2 | Wave 5 | NEEDS_DECISION |
| V11-BL-007 | Additional distribution connectors | FUTURE_INTEGRATION | Gateway and integration registry foundations exist; provider execution is not connected | EXTENSION | P2 | Wave 5 | NEEDS_DECISION |
| V11-BL-008 | Advanced real-time collaboration | NEW_REQUIREMENT | Collaboration foundation exists without real-time transport | EXTENSION | P3 | Wave 3 | NEEDS_DECISION |
| V11-BL-009 | Advanced magazine production | UX_IMPROVEMENT | Magazine and publishing foundations exist; advanced production remains future work | EXTENSION | P3 | Wave 3 | NEEDS_DECISION |
| V11-BL-010 | Advanced AI editorial agent automation | AUTOMATION_OPPORTUNITY | AI governance and agent foundations exist; real provider execution remains governed | EXTENSION | P2 | Wave 4 | NEEDS_DECISION |
| V11-BL-011 | Semantic editorial search | NEW_REQUIREMENT | Research search exists; semantic editorial search is not proven as runtime behavior | EXTENSION | P2 | Wave 3 | NEEDS_DESIGN |
| V11-BL-012 | Advanced analytics and BI | FUTURE_INTEGRATION | Observability and reports foundations exist; advanced BI is not implemented | EXTENSION | P3 | Wave 4 | NEEDS_DECISION |
| V11-BL-013 | Marketing automation | NEW_REQUIREMENT | No dedicated marketing automation implementation found | NEW_REQUIREMENT | P4 | Later | NEEDS_DECISION |
| V11-BL-014 | Social media publishing | NEW_REQUIREMENT | No social publishing connector implementation found | NEW_REQUIREMENT | P4 | Later | NEEDS_DECISION |
| V11-BL-015 | Advanced audiobook production | UX_IMPROVEMENT | Multimedia/audio foundations exist; advanced production remains future work | EXTENSION | P3 | Wave 6 | NEEDS_DECISION |
| V11-BL-016 | Advanced children interactive books | NEW_REQUIREMENT | Children's book publication type exists; interactive reading is not implemented | EXTENSION | P4 | Later | NEEDS_DECISION |
| V11-BL-017 | Additional platform and translation languages | UX_IMPROVEMENT | Central language model exists; v1.0 translation language policy is intentionally limited | EXTENSION | P3 | Later | NEEDS_DECISION |
| V11-BL-018 | Extended accessibility tooling and validation | UX_IMPROVEMENT | Accessibility foundations exist; full external/device evidence remains pending | EXTENSION | P2 | Wave 6 | READY_FOR_ANALYSIS |
| V11-BL-019 | Mobile applications | NEW_REQUIREMENT | Responsive/PWA foundations exist; native mobile apps are not implemented | NEW_REQUIREMENT | P4 | Later | NEEDS_DECISION |
| V11-BL-020 | External APM provider integration | FUTURE_INTEGRATION | Observability foundation exists; external APM provider is not connected | EXTENSION | P3 | Wave 4 | NEEDS_DECISION |
| V11-BL-021 | Cloud backup provider integration | FUTURE_INTEGRATION | Backup governance exists; external cloud backup providers are not connected | EXTENSION | P3 | Wave 5 | NEEDS_DECISION |
| V11-BL-022 | Academy / Training Center | NEW_REQUIREMENT | No Academy runtime module exists; this is a future functional requirement only | NEW_REQUIREMENT | P4 | Later | NEEDS_DECISION |

## Rule

No backlog item becomes an implementation task until it satisfies the v1.1
Definition of Ready in `docs/releases/v1.1/v1.1-readiness.md`.

## Academy / Training Center Candidate

Academy / Training Center is an optional future module for training users of
the Laborator Editura platform. Romanian UI label: Centru de formare. It may
support courses, guided learning paths, progress tracking, assessments, scoring
or gamification, and possible certifications.

This backlog entry is documentation-only. It does not authorize runtime
implementation, UI creation, API changes, database changes, migrations, or
importing code from the legacy Lovable repository.
