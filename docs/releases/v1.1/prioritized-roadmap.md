# v1.1 Prioritized Roadmap

Status: INITIAL_PRIORITIZATION_CREATED  
Owner: Product Governance

## Priority Model

- `P0`: critical issues discovered after release.
- `P1`: essential improvements.
- `P2`: high-value capabilities.
- `P3`: optimizations and extensions.
- `P4`: future ideas.

## Roadmap

| Priority | Item | Canonical backlog ID | Rationale | Gate |
| --- | --- | --- | --- | --- |
| P0 | Resolve v1.0 certification blockers before v1.1 execution | V11-BL-001 | v1.1 must not start from an uncertified baseline | v1.0 certified baseline |
| P1 | Dependency reproducibility and lockfile decision | V11-BL-002 | Supply-chain evidence is required for stable releases | DevSecOps decision |
| P1 | Restore evidence and rollback rehearsal automation | V11-BL-003, V11-BL-004 | Recovery evidence is mandatory for release confidence | staging rehearsal |
| P1 | Public website integration through governed public APIs | V11-BL-005 | High business value and clear separation from internal app | public API design |
| P2 | Advanced AI editorial automation under governance | V11-BL-010 | Improves productivity while preserving human final authority | AI governance review |
| P2 | Semantic editorial search | V11-BL-011 | Improves editorial discovery and research use | data/search design |
| P2 | Extended accessibility tooling and validation | V11-BL-018 | Improves inclusiveness and certification evidence | accessibility review |
| P2 | Commerce and distribution expansion | V11-BL-006, V11-BL-007 | Valuable after public integration is stable | provider decision |
| P3 | Advanced magazine and collaboration improvements | V11-BL-008, V11-BL-009 | Useful productivity improvements after core integration | UX validation |
| P3 | Observability/APM and cloud backup providers | V11-BL-020, V11-BL-021 | Operational expansion after local evidence is stable | provider selection |
| P4 | Marketing automation, social publishing, native mobile, interactive books | V11-BL-013, V11-BL-014, V11-BL-016, V11-BL-019 | Future ideas requiring separate approval | owner decision |

## Rule

Incremental improvements are preferred over destabilizing changes. Items may
move later if they do not meet Definition of Ready.

