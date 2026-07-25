# AI Capability Catalog

## Purpose

The AI Capability Catalog defines provider-independent capabilities that
platform modules may request from the AI Orchestration Service.

Modules request capabilities. They do not request provider SDK methods.

## Capability Request Contract

Every capability request should include:

- `capabilityId`.
- `callingModule`.
- `organizationId`.
- `workspaceId` when available.
- `projectId` when available.
- `documentId` when available.
- `manuscriptId` when available.
- `segmentId` when available.
- `inputReferences`.
- `contextReferences`.
- `sourceLanguage` when applicable.
- `targetLanguage` when applicable.
- `platformLanguage`.
- `privacyClassification`.
- `promptId` when explicitly required.
- `expectedOutputType`.
- `humanApprovalRequired`.
- `budgetScope`.
- `idempotencyKey` when required.

## Approved Capability Families

### Text Generation

Used for controlled drafting, summaries, explanations, metadata drafts, and
workflow assistance.

### Translation

Used for translation proposals, alternatives, back-translation checks, and
language-pair assistance.

### Proofreading

Used for spelling, grammar, punctuation, fluency, and editorial correction
suggestions.

### Terminology Validation

Used for terminology checks, forbidden variant warnings, glossary conflicts,
and terminology explanations.

### Semantic Analysis

Used for meaning drift, omitted meaning, added meaning, context mismatch, and
semantic risk explanations.

### Summarization

Used for source summaries, project summaries, review summaries, rights
summaries, and publication readiness summaries.

### Classification

Used for domain classification, publication classification, content type
classification, and risk classification.

### OCR

Used for extracting text from images or scanned documents.

### Image Generation

Used for draft images, illustration concepts, cover concepts, and visual
ideation.

### Image Editing

Used for draft localized image variants, correction proposals, and editorial
image adjustments.

### Illustration Assistance

Used for illustration briefs, consistency checks, style guidance, and visual
asset recommendations.

### Speech-to-Text

Used for transcripts, subtitle source generation, and audio review support.

### Text-to-Speech

Used for preview narration and draft audio generation.

### Voice Cloning

Used only where rights, consent, and policy allow it.

### Audio Enhancement

Used for draft audio cleanup recommendations and quality diagnostics.

### Video Generation

Used for preview video drafts and controlled production assistance.

### Video Editing

Used for draft timing, subtitle, and simple localization assistance.

### Metadata Extraction

Used for extracting structured metadata from documents, manuscripts, media,
research sources, and publishing artifacts.

### Embedding Generation

Used for semantic search, similarity, research discovery, and knowledge
relationships.

### Recommendation

Used for workflow next actions, quality issues, publication readiness, and
resource recommendations.

### Workflow Assistance

Used for schedule suggestions, task suggestions, status summaries, and
blocker detection.

## Module Capability Mapping

| Module | Capabilities |
| --- | --- |
| Translation | Translation, Terminology Validation, Semantic Analysis |
| Review | Proofreading, Semantic Analysis, Recommendation |
| Terminology | Terminology Validation, Semantic Analysis |
| Lexicographic Intelligence | Classification, Metadata Extraction, Semantic Analysis |
| Research | Summarization, Classification, Embedding Generation, Metadata Extraction |
| Author Studio | Text Generation, Recommendation, Summarization |
| Layout and Publishing | Recommendation, Metadata Extraction, Image Editing |
| Multimedia | Image Generation, Text-to-Speech, Speech-to-Text, Video Generation |
| Media Localization | OCR, Speech-to-Text, Translation, Text-to-Speech, Video Editing |
| Quality Agent | Classification, Metadata Extraction, Recommendation |
| Workflow | Workflow Assistance, Recommendation |

## Capability Result Contract

Every normalized AI result should include:

- `resultId`.
- `capabilityId`.
- `callingModule`.
- `provider`.
- `model`.
- `promptId`.
- `promptVersion`.
- `routingPolicyVersion`.
- `recommendation`.
- `alternatives`.
- `rationale`.
- `confidenceScore`.
- `evidenceSources`.
- `warnings`.
- `humanApprovalRequired`.
- `approvalStatus`.
- `auditEventId`.
- `createdAt`.

## Non-Authoritative Rule

AI capability results are advisory unless a specific domain rule defines a
validated automated check. Even then, final editorial approval belongs to
authorized humans.
