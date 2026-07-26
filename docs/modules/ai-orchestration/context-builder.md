# AI Context Builder

## Purpose

The Context Builder assembles the minimum necessary, authorized context for
each AI task.

AI models must never receive direct database access. They receive a filtered,
versioned, auditable context package prepared by AI Orchestration.

## Context Sources

Context may be assembled from:

- Library resources.
- Projects.
- Documents.
- Manuscripts.
- Segments.
- Translation Memory.
- Glossaries.
- Terminology records.
- Lexicographic evidence.
- Semantic Fidelity reports.
- QA reports.
- Editorial decisions.
- Rights and Provenance metadata.
- Workflow state.
- User permissions.
- Need-to-Know grants.
- Platform Language.
- Original Language.
- Authoring Language.
- Target Language.
- Project policies.
- Organization policies.

## Security Rules

The Context Builder must:

- Use only server-derived authenticated request context.
- Enforce tenant isolation.
- Enforce RBAC and Need-to-Know access.
- Exclude unrelated project data.
- Exclude unrelated rights, contract, financial, security, and private reading
  data.
- Respect rights and provenance restrictions.
- Minimize source content.
- Prefer references and excerpts where possible.
- Redact sensitive fields before provider execution.
- Record a context hash and context source references for audit.

## Current Repository Baseline

The current repository has strong source systems for context:

- Translation Memory entries.
- Terminology and glossary entries.
- Lexicographic entries.
- Semantic Fidelity reports.
- QA reports.
- Rights and Provenance warnings.
- Project identity, language policy, publication types, capabilities, and
  dossiers.
- Workflow state.
- Need-to-Know governance documentation and tests.

However, no runtime central `ContextBuilder` was identified. Existing modules
assemble their own deterministic support metadata where needed, such as
lexicographic support in Translation and dictionary evidence in Terminology.

## Required Context Package

Each context package should include:

- `contextPackageId`.
- `aiTaskId`.
- `organizationId`.
- `resourceScope`.
- `sourceReferences`.
- `languageMetadata`.
- `rightsConstraints`.
- `workflowSnapshot`.
- `permissionSnapshot`.
- `includedFields`.
- `excludedFields`.
- `redactionSummary`.
- `contextHash`.
- `createdAt`.

## Prohibited Context Behavior

The Context Builder must not:

- Send full documents when excerpts are enough.
- Include cross-tenant data.
- Include secrets.
- Include unrelated contracts or rights negotiations.
- Include private user library history.
- Include security configuration unless explicitly required and authorized.
- Allow an AI agent to expand its own context.

## Future Implementation Path

The first runtime implementation should be additive:

1. Define typed context contracts.
2. Add read-only context package construction.
3. Connect one low-risk advisory capability.
4. Record context references and hashes.
5. Add Need-to-Know tests.
6. Expand module-by-module only after validation.

