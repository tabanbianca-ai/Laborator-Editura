# Style Validation

## Purpose

Style validation verifies whether the reviewed text follows project,
collection, publication, author, and editorial style requirements.

## Validation Areas

The target style layer supports:

- Repetition.
- Pleonasm.
- Cacophony.
- Ambiguous phrasing.
- Unclear sentence structure.
- Sentence length.
- Paragraph flow.
- Register consistency.
- Tone consistency.
- Terminology uniformity.
- Author style consistency.
- Project-specific editorial rules.

## Current Baseline

Current implementation provides partial foundations:

- Semantic Fidelity can identify drift, added meaning, omitted meaning,
  reinterpretation, terminology meaning conflict, and context mismatch.
- Editorial Decisions can generate recommendations, alternatives, rationale,
  confidence scores, and evidence sources.
- Review workspace displays semantic, terminology, lexicographic, and
  editorial recommendation panels.
- Translation quality documentation already identifies grammar and style as a
  future expansion area.

## Target Behavior

Style validation should:

- Run against segments, sections, chapters, and whole documents.
- Use project and publication style profiles.
- Distinguish hard errors from editorial preferences.
- Produce observations rather than automatically rewriting text.
- Explain why a style issue was detected.
- Provide alternative phrasings when appropriate.
- Preserve Human Final Authority.

## Project-Specific Rules

Each project may define:

- Preferred register.
- Sentence length guidance.
- Forbidden constructions.
- Collection-specific style.
- Author profile expectations.
- Doctrinal or terminology-sensitive style notes.

## AI Assistance

AI may:

- Suggest clearer formulations.
- Explain style risk.
- Detect repetition or ambiguity.
- Compare style with project rules.

AI may not:

- Replace text automatically.
- Approve style compliance.
- Override terminology or doctrinal rules.
- Publish or mark a document ready for publication.

## Gaps

- There is no dedicated style validation service yet.
- Project style profiles are not yet a canonical data model.
- Cacophony, pleonasm, repetition, and ambiguity checks are not first-class
  backend checks.
- Style observations are not yet unified under an `EditorialReview` aggregate.
