# AI Explainability

## Purpose

Explainability records the information required to understand, reproduce, and
audit AI outputs.

Explainability is mandatory for AI results used in editorial, translation,
rights, publishing, accessibility, analytics, search, audio, video, or
administration workflows.

## Explainability Record

For every governed AI output, the platform must preserve:

- `model`.
- `modelVersion`.
- `prompt`.
- `promptVersion`.
- `parameters`.
- `sourcesUsed`.
- `temperature`.
- `provider`.
- `timestamp`.
- `user`.
- `workflow`.
- `cost`.
- `tokens`.
- `contextReferences`.
- `limitations`.
- `confidenceScore`.
- `humanReviewRequired`.

## Source References

Source references may include:

- Library items.
- Manuscripts.
- Segments.
- Translation Memory entries.
- Terminology entries.
- Lexicographic entries.
- Research sources.
- Rights records.
- Workflow records.
- QA and Semantic Fidelity reports.
- Analytics datasets and reports.

AI outputs must not cite hidden or unauthorized data to users who cannot see
that data.

## Current Repository Baseline

Current foundations:

- Translation, Terminology, Semantic Fidelity, Lexicographic, Editorial
  Decision, Quality Agent, and AI Governance records include evidence,
  provider metadata, cost metadata, agent metadata, or human authority flags.
- Observability records agent execution metadata.
- AI Orchestration documentation defines prompt version, context version,
  model route, validation report, cost, and audit references.

Current gaps:

- No centralized explainability record store exists.
- No universal AI execution ID links all evidence.
- No complete prompt and context snapshot store exists.
- No explainability completeness score exists.
- No user-facing explainability API exists.

## Responsible AI Requirements

Explainability must support:

- Human review.
- Audit inspection.
- Model evaluation.
- Benchmark comparison.
- Risk review.
- Reproducibility.
- Data Governance lineage.
- Rights and privacy compliance.

## AI Rules

AI may:

- Explain its reasoning at a high level.
- Identify evidence sources.
- Summarize limitations.

AI may not:

- Fabricate sources.
- Hide uncertainty.
- Expose restricted context.
- Claim human approval.
