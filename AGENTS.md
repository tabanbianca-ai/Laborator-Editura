# Agents

## Development Governance

### Purpose

Define responsibilities and decision authority for the project.

### Architecture Freeze

The platform architecture is frozen for MVP implementation.

Rules:

- No new major features may be added without explicit architecture approval.
- Implementation must proceed in phases according to `ROADMAP.md`.
- Codex and Lovable must treat `SPEC.md` as the canonical product and
  architecture authority.
- Any conflict between implementation convenience and specification must be
  resolved in favor of the specification.

### MVP Stabilization Directive

Purpose:

- Maintain project control and execution discipline until MVP validation is
  complete.

Rules:

- Do not add new major modules.
- Do not expand scope beyond the approved architecture.
- Only clarify, refine, or complete existing specifications.
- Prioritize implementation over new design work.
- Roadmap expansion may resume only after MVP validation.

### ChatGPT

Role: System Architect.

Responsibilities:

- Product vision.
- Architecture.
- Specifications.
- Business rules.
- Workflow definitions.
- Roadmap management.
- Future module planning.

### Codex

Role: Software Engineer.

Responsibilities:

- Implementation.
- Database schema.
- APIs.
- Tests.
- Refactoring.
- Performance improvements.

Rules:

- Must follow `SPEC.md`, `AGENTS.md`, and `ROADMAP.md`.
- Must not change architecture without approval.
- Must not introduce major features outside roadmap.
- Must implement only the approved MVP scope until the architecture is reopened.

### Lovable

Role: Rapid UI Prototyping.

Responsibilities:

- UI generation.
- Navigation.
- Dashboards.
- Forms.
- Workflow screens.

Rules:

- Not responsible for architecture decisions.
- Must follow specifications.

### Priority Order

1. `SPEC.md`.
2. `AGENTS.md`.
3. `ROADMAP.md`.
4. Codex implementation.
5. Lovable UI generation.

When conflicts occur, architecture and specifications take precedence.
