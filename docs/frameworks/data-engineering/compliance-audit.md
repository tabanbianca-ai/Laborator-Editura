# Compliance Audit

## Purpose

Compliance Audit defines how Framework 03 conformity is measured and how data
architecture exceptions, quality violations, migrations, schema changes, and
lineage gaps are tracked.

## Audit Scope

Audit must cover:

- Model changes.
- Schema changes.
- Migration execution.
- Data validations.
- Rule violations.
- Data quality issues.
- Lineage creation.
- Catalog updates.
- Retention changes.
- Classification changes.
- AI data access.
- Import and export events.
- Backup and restore events.
- Human overrides.

## Compliance Criteria

A data asset is compliant when it:

- Maps to a canonical model.
- Has an owner and steward.
- Has a documented schema.
- Has versioning rules where required.
- Has validation rules.
- Has quality rules.
- Has lineage expectations.
- Has retention policy.
- Has classification and sensitivity.
- Has audit coverage.
- Has backup and restore handling.
- Preserves tenant isolation where applicable.

## Baseline Compliance Assessment

### Strengths

- Canonical data model documentation exists.
- Logical aggregate documentation exists.
- Physical database standards exist.
- Runtime database table names are centrally enumerated.
- Backup and restore format includes metadata.
- Domain-specific audit event tables are widespread.
- JSON Master provides structured publication and editorial data exchange.

### Gaps

- Machine-readable Data Catalog is missing.
- Central lineage registry is missing.
- Data quality is distributed rather than centrally reported.
- Schema registry is not fully implemented.
- Runtime persistence table ownership is not yet represented in a formal
  catalog.
- Some audit patterns are module-specific and should be mapped to a common
  audit model.

## Data Governance Audit Questions

For every model or table:

- What canonical model owns it?
- Which aggregate owns writes?
- Which modules consume it?
- Is it tenant scoped?
- Is it classified?
- Is it sensitive?
- Is it versioned?
- Is it audited?
- Is it retained or preserved?
- Is it included in backup and restore?
- Does it expose lineage?
- Does it have validation rules?
- Does it have quality rules?
- Does it support schema evolution?

## AI Data Audit Questions

For every AI data flow:

- What data was provided?
- Was the data scoped by Need-to-Know?
- What model/provider was used?
- What prompt or prompt version was used?
- What output was produced?
- Was output advisory or authoritative?
- Was human approval required?
- Was the action audited?
- Was cost metadata captured?

## Migration Compliance

Every migration must be audited for:

- Purpose.
- Scope.
- Affected canonical models.
- Affected tables.
- Affected APIs.
- Affected events.
- Affected exports.
- Affected AI flows.
- Rollback or recovery plan.
- Test evidence.
- Approval.

## Exception Handling

Architectural exceptions require:

- Exception id.
- Reason.
- Affected models.
- Risk assessment.
- Temporary or permanent status.
- Approval authority.
- Expiration date where temporary.
- Remediation plan.
- Audit trail.

No exception may silently weaken audit, tenant isolation, lineage, retention,
rights, security, or Human Final Authority.

## Reporting

Future reports should include:

- Catalog completeness.
- Canonical model coverage.
- Runtime table coverage.
- Lineage coverage.
- Quality issue summary.
- Migration status.
- Schema version status.
- Retention compliance.
- AI data access summary.
- Exceptions and remediation status.
