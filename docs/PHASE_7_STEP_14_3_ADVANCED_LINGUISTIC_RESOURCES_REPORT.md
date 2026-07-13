# Phase 7 Step 14.3 - Advanced Linguistic Resources & Translation Memory

## Summary

Phase 7 Step 14.3 extends the existing Linguistic Knowledge Base, Translation,
Terminology & Lexicography, Semantic Fidelity, Review, AI Governance, and Audit
systems. It does not introduce a new enterprise module.

## Implemented

- Project-configurable linguistic source priority with drag/drop-ready ordering
  metadata.
- Default consultation order:
  official normative source, project glossary, specialized glossary,
  Translation Memory, bilingual dictionary, explanatory dictionary, and
  corpus/examples.
- Runtime database persistence and backup/restore coverage for source priority.
- Translation Memory entries enriched with source segment, translated segment,
  language pair, project/document/segment references, domain, context, author,
  reviewer, approval date, confidence, and version.
- Translation Memory exact, fuzzy, and context proposal matching.
- Translation Memory remains proposal-only and never replaces text
  automatically.
- Translation flow stores TM entries only when the submitted translation is
  validated by the existing validation pipeline.
- Glossary hierarchy: Project Glossary > Platform Glossary > Personal Glossary.
- Personal glossary entries remain optional suggestions only.
- Glossary conflict detection with required human review.
- Linguistic proposal explanation containing confidence score, consulted
  sources, glossary used, Translation Memory match, terminology status,
  semantic validation, and rationale.
- Audit events for glossary created/updated/conflict, TM entry added/reused,
  source priority changed, and confidence recalculated.
- Frontend visibility in Administration and Translation Workspace for source
  priority, glossary hierarchy, TM proposals, and confidence explanations.

## Guardrails

- No Docker or staging configuration changes.
- No breaking API changes.
- No automatic replacement from Translation Memory.
- No AI or system bypass of validated glossary priority or human final
  authority.
- No duplication of linguistic resources outside the existing Lexicographic,
  Terminology, Translation Memory, and Knowledge Base infrastructure.

## Validation Targets

- Glossary priority.
- Translation Memory exact, fuzzy, and context match.
- Source priority.
- Confidence score.
- Conflict detection.
- Proposal explanation.
- Audit coverage.
