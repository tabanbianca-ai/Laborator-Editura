# Data Modeling Standards

## Purpose

Data Modeling Standards define how platform data structures are designed,
documented, evolved, validated, and integrated.

## Mandatory Model Fields

All durable models should define:

- UUID primary identifier.
- Version.
- Created timestamp.
- Updated timestamp.
- Created by.
- Updated by where applicable.
- Lifecycle state.
- Ownership metadata.
- Tenant scope where applicable.
- Classification.
- Sensitivity.
- Provenance.
- Audit strategy.
- Retention policy.
- Localization metadata where relevant.
- Controlled extensibility metadata.

## Identifier Standards

Identifiers must be:

- Stable.
- Globally unique within the platform scope.
- Opaque to users.
- Never reused.
- Preserved during migrations.
- Mapped explicitly when legacy or module-specific identifiers exist.

UUID remains the default identifier strategy.

## Versioning Standards

Versioned data must preserve:

- Current version.
- Previous versions.
- Change reason.
- Actor.
- Timestamp.
- Approval state where relevant.
- Source version references.
- Restoration rules.

Editorial, publication, rights, terminology, rule, audit, and governance data
must never lose historical context.

## Lifecycle Standards

Every durable entity must define lifecycle states appropriate to its domain.

Lifecycle state must not be confused with permissions, visibility, or
publication state.

Examples:

- Draft.
- Active.
- Under Review.
- Approved.
- Suspended.
- Archived.
- Published.
- Withdrawn.

## Ownership Standards

Each entity must have exactly one canonical owner aggregate.

Rules:

- Owner aggregate controls writes.
- Other modules reference the entity through identifiers, contracts, events,
  or read models.
- Cross-aggregate direct ownership is not allowed.
- Shared metadata must not become duplicate master data.

## Tenant Scope

Tenant-scoped data must preserve `organizationId` or the approved tenant
identifier.

Rules:

- Tenant isolation must be enforced server-side.
- Client-provided tenant identifiers must not be trusted.
- Public data must still preserve source organization and release authority.
- Backup and restore must preserve tenant boundaries.

## Localization Support

Models involving language must separate:

- Platform Language.
- Original Language.
- Original Locale.
- Authoring Language.
- Authoring Locale.
- Target Language.
- Target Locale.

Platform Language must not alter content language metadata.

## Extensibility Standards

Controlled extensibility may use metadata fields when:

- The canonical model remains stable.
- Metadata schema is documented.
- Unknown fields do not bypass validation.
- Metadata does not store secrets.
- Metadata does not replace typed fields required for governance.

## Relationship Standards

Relationships must be explicit.

Rules:

- Many-to-many relationships require associative entities in physical design.
- Cross-aggregate references must use identifiers or public contracts.
- Derived records must reference their source records and source versions.
- Publication outputs must reference the canonical master and generator
  context.

## Event Consistency

Events must preserve:

- Event id.
- Event type.
- Source aggregate.
- Source id.
- Source version.
- Actor.
- Organization.
- Timestamp.
- Correlation id.
- Payload schema version.

Events must not become ungoverned shadow data stores.

## AI Ready Data

AI-facing data must be:

- Classified.
- Scoped by Need-to-Know.
- Traceable.
- Versioned where derived.
- Audited when consulted or transformed.
- Marked as AI-generated, AI-assisted, or human-approved.

AI output must not overwrite validated human decisions.

## Current Baseline Assessment

Strengths:

- Logical aggregate ownership is documented.
- Physical database standards exist.
- Runtime table names are centrally enumerated.
- Backup format includes schema metadata.
- Language policy fields are documented.

Gaps:

- Field-level modeling standards are not yet applied uniformly to every
  runtime table family.
- Model ownership is documented but not yet enforced by a machine-readable
  registry.
- Metadata schemas are not yet centrally versioned.
- Event schema registry is not yet implemented.
