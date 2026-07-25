# Platform Governance

## Purpose

Platform governance defines decision authority, operational control, and the
approval model for long-term platform evolution.

## Authority Model

The platform follows the existing governance hierarchy:

1. Manifest.
2. Development Conventions.
3. Chapter 0 fundamental principles.
4. Architecture Chapters 1-15.
5. `SPEC.md`.
6. `AGENTS.md`.
7. `ROADMAP.md`.
8. Implementation.

Architecture, security, rights, quality, and operations standards take
precedence over implementation convenience.

## Governance Bodies

Operational governance may involve:

- Project owner.
- System Architect.
- Software Engineer.
- Platform Creator.
- Administrator.
- Security owner.
- Release owner.
- Monitoring owner.
- Backup and recovery owner.

The same person may hold multiple roles in early operation, but
responsibilities must remain explicit.

## Controlled Change Process

Structural changes require:

- Problem statement.
- Impact analysis.
- Risk analysis.
- Compatibility review.
- Quality Gate review.
- Rollback plan.
- Approval.
- Documentation update.

## Architecture Decision Records

Architecture Decision Records are required for:

- Major module boundaries.
- Database strategy changes.
- Authentication or authorization changes.
- Deployment architecture changes.
- External provider changes.
- AI governance changes.
- Security model changes.
- Backward-incompatible changes.

## Operational Audit

Audit must cover:

- Configuration changes.
- Role and permission changes.
- Feature lifecycle changes.
- Provider changes.
- Release approvals.
- Deployment events.
- Backup and restore actions.
- Incident actions.

## Human Final Authority

AI may summarize, detect, recommend, and draft governance artifacts.

AI must not:

- Approve releases.
- Approve architecture changes.
- Grant rights.
- Modify security.
- Bypass workflow.
- Hide operational risk.
