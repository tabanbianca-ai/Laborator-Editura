# Data Quality

## Purpose

Data Quality ensures that platform data is complete, unique, consistent,
valid, traceable, correctly classified, and compliant with canonical models.

## Quality Dimensions

Framework 03 requires quality controls for:

- Completeness.
- Uniqueness.
- Consistency.
- Validity.
- Referential integrity.
- Traceability.
- Timeliness.
- Provenance completeness.
- Classification correctness.
- Retention compliance.
- Canonical model conformance.

## Quality Severity

Standard severity levels:

- `INFO`.
- `WARNING`.
- `ERROR`.
- `BLOCKING`.

Domain engines may use equivalent severity or risk labels such as `LOW`,
`MEDIUM`, `HIGH`, and `CRITICAL`, but mapping to the standard severity model
must be documented.

## Existing Quality Engines

Current domain-specific quality controls include:

- QA Engine.
- Semantic Fidelity Engine.
- Terminology Governance.
- Translation Memory approval rules.
- Workflow gates.
- Rights and Provenance warnings.
- Publishing preflight.
- Distribution readiness.
- Security validation.
- Backup validation.
- JSON Master validation.

These engines remain authoritative for their domains. Framework 03 coordinates
shared data quality and does not replace domain rules.

## Required Quality Rules

### Identity and Access

- Users must have stable identifiers.
- Sessions must expire.
- Roles and permissions must be auditable.
- Client-provided identity must not be trusted.

### Projects and Editorial Data

- Projects must have required identity metadata.
- Original language must be preserved.
- Publication type must be exactly one supported value.
- Editorial domain must be present.
- Manuscripts must preserve authoring language metadata.
- Translations must preserve target language metadata.

### Translation and Linguistic Data

- Validated terminology must have documented authority.
- Rejected terminology must block publication readiness.
- Translation Memory suggestions must be approved before authoritative reuse.
- Lexicographic evidence must remain non-authoritative unless converted
  through human decision.

### Rights and Publication

- Publication cannot proceed with unresolved blocking rights warnings.
- Public records must preserve provenance.
- Export artifacts must reference source document and version.
- Distribution records must preserve approval and release metadata.

### AI Data

- AI outputs must be marked as AI-generated or AI-assisted.
- AI decisions cannot override human approvals.
- AI usage must preserve cost and model metadata where available.
- AI data access must obey Need-to-Know.

### Audit Data

- Audit events must preserve actor, action, resource, timestamp, organization,
  and before or after state where applicable.
- Audit records must not be mutable by normal workflows.

## Quality Score

Entities may receive quality scores derived from:

- Completeness.
- Validity.
- Consistency.
- Uniqueness.
- Provenance.
- Timeliness.
- Authority level.
- Approval state.

Quality scores do not override blocking rules.

## Baseline Assessment

Strengths:

- Multiple quality engines exist.
- Publication readiness has explicit preflight concepts.
- Rights warnings and semantic/QA issues already gate workflows.
- Terminology Governance protects authoritative language data.

Gaps:

- Shared quality scoring is not centralized.
- Cross-domain quality issue registry does not yet exist.
- Quality rules are not yet fully linked to catalog entries.
- Automated quality reporting across all data assets is not yet implemented.

## Standardization Plan

1. Map existing domain checks to the standard quality dimensions.
2. Add quality rule metadata to catalog entries.
3. Define standard severity mapping across engines.
4. Add quality issue lineage to source records.
5. Add cross-domain quality report generation in a future approved phase.
