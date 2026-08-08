# Terminology Model

Terminology uses the existing Terminology and Lexicographic modules and the canonical Batch 04 glossary
contract `EditorialGlossaryTerm`.

## Canonical Fields

- `term_id`
- `canonical_term`
- `source_language`
- `target_language`
- `translation`
- `definition`
- `domain`
- `context`
- `approved_variants`
- `rejected_variants`
- `source_reference`
- `status`
- `version`
- `owner`

## Approved Statuses

- `VALIDATED`
- `UNDER_REVIEW`
- `SPECIALIZED_TERM`
- `SUSPENDED`
- `ARCHIVED`

## Romanian Source References

The architecture supports controlled references to:

- DEX
- DOOM 1
- DOOM 2
- DOOM 3
- editorial glossary
- spiritual/spiritist glossary
- children's glossary
- risk terms
- false friends

External copyrighted sources must not be copied uncontrolled into local storage.

## Checker Severity

- `INFO`
- `WARNING`
- `ERROR`
- `BLOCKING`

Blocking terminology must be resolved before editorial approval when project policy requires it.
