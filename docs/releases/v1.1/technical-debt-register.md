# v1.1 Technical Debt Register

Status: INITIAL_REGISTER_CREATED  
Owner: Platform Engineering

## Purpose

This register tracks technical debt retained during v1.0 stabilization. It does
not authorize broad refactoring.

## Debt Model

Each item records:

- impact;
- risk;
- effort;
- dependencies;
- removal_version;
- owner.

## Register

| ID | Item | Impact | Risk | Effort | Dependencies | Removal version | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TD-V11-001 | Missing root dependency lockfile or formal lockfile exception | Dependency reproducibility is weaker than desired | Supply-chain drift | Medium | Package manager decision | v1.0.x or v1.1.0 | DevSecOps | OPEN |
| TD-V11-002 | Final artifact-bound SBOM automation missing | Release provenance must be assembled manually | Artifact integrity evidence gap | Medium | Canonical build pipeline | v1.0.x or v1.1.0 | DevSecOps | OPEN |
| TD-V11-003 | Final restore evidence not attached to release artifact | Recoverability cannot be proven for final candidate | Recovery confidence gap | Medium | Staging restore rehearsal | v1.0.x or v1.1.0 | Platform Operations | OPEN |
| TD-V11-004 | Rollback and redeploy rehearsal evidence missing | Production recovery path remains unproven | Deployment risk | Medium | Staging deployment rehearsal | v1.0.x or v1.1.0 | Platform Operations | OPEN |
| TD-V11-005 | Staging performance baseline missing | Optimization cannot be evidence-based | Performance regression may be missed | Medium | Staging metrics capture | v1.1.0 | Platform Operations | OPEN |
| TD-V11-006 | Next.js ESLint plugin warning during web build | Lint signal is incomplete | Missed web lint guidance | Low | ESLint configuration review | v1.1.0 | Frontend Engineering | OPEN |
| TD-V11-007 | Several advanced modules are metadata foundations only | Users may expect external provider execution | Scope confusion | Medium | Roadmap classification | v1.1.x | Product Governance | OPEN |

## Refactoring Rule

Technical debt remediation must be minimal, tested, and tied to a tracked item.
No broad cleanup is allowed before v1.0 certification unless it fixes a blocker.

