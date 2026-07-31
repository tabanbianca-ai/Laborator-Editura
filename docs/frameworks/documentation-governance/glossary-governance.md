# Glossary Governance

## Document Control

- Title: Glossary Governance.
- Identifier: FRAMEWORK-08-GLOSSARY-GOVERNANCE.
- Version: 1.0.
- Status: Active specification.
- Owner: Documentation Governance.
- Reviewers: Terminology Governance, Product Architecture, Editorial
  Governance.
- Approval: Project owner approval required for canonical changes.
- Dependencies: `docs/frameworks/documentation-governance/overview.md`,
  `docs/domain/domain-glossary.md`, Terminology Governance v2.
- References: `docs/DEVELOPMENT_CONVENTIONS.md`,
  `docs/frameworks/data-engineering/data-catalog.md`.
- Change history:
  - 1.0: Initial glossary governance baseline.

## Purpose

This document defines the official governance model for documentation
terminology and the canonical glossary used across technical, functional,
architectural, operational, and AI documentation.

## Canonical Term Record

Every official term must define:

- UUID.
- Canonical name.
- Definition.
- Aliases.
- Domain.
- Owner.
- Approval status.
- Version.
- Usage examples.

Recommended additional metadata:

- Related modules.
- Related frameworks.
- Language.
- Deprecated names.
- Source authority.
- Approval date.
- Change history.

## Approval Status

Allowed glossary approval statuses are:

- Proposed.
- Under Review.
- Approved.
- Deprecated.
- Archived.

Proposed terms may appear in draft documents. Approved terms are canonical.
Deprecated and archived terms must remain searchable for migration and audit.

## Term Ownership

Each term must have one owner. Ownership prevents competing definitions for the
same concept.

Examples:

- Authentication terms are owned by IAM and Security Governance.
- Translation terms are owned by Translation, Terminology, and Semantic
  Fidelity governance.
- Documentation terms are owned by Framework 08.
- UI terminology is governed by Development Conventions and UI Governance.

## Terminology Source Rules

Official documentation terminology must follow:

1. Canonical platform glossary.
2. Approved module glossary.
3. Approved framework glossary.
4. Development Conventions.
5. Standard localization terminology for user-facing UI labels.

When sources conflict, the conflict must be documented and escalated for
authorized human review.

## Duplicate Term Rules

Duplicate definitions are not allowed. If two documents use the same term with
different meanings, the documentation owner must:

- Identify the canonical definition.
- Record aliases or deprecated names.
- Link dependent documents.
- Update affected references.
- Preserve historical context.

## Relationship to Product Terminology

Platform-specific product terms must not duplicate standard UI terms. Standard
terms should use established localization sources. Platform-specific terms
must be approved in the platform terminology dictionary.

## AI Rules

AI may suggest glossary candidates, aliases, conflicts, and usage examples.
AI must not approve terms, change canonical definitions, or treat AI output as
source authority.

## Audit Requirements

Audit must cover:

- Term proposed.
- Term approved.
- Term changed.
- Alias added.
- Term deprecated.
- Term archived.
- Conflict detected.
- Human override.
- Source authority changed.

## Current Baseline Assessment

The repository contains `docs/domain/domain-glossary.md` and extensive module
terminology across `docs/modules`. These provide a strong starting point, but
the canonical term record fields are not consistently present for every term.

The migration plan must normalize key terms before attempting broad automated
documentation validation.
