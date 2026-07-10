# Project Specification

## Architecture Freeze & Governance Requirements

Status: Frozen for phased MVP implementation.

The project architecture is now frozen. New major features must not be added
unless explicitly approved through the architecture and roadmap process.
Implementation must proceed in phases and remain aligned with `SPEC.md`,
`AGENTS.md`, and `ROADMAP.md`.

### MVP Scope

The MVP is limited to:

- Auth.
- Documents.
- Segment Editor.
- Basic Translation Memory.
- Basic QA.
- Basic TCPS/TLCG.
- Export.

### MVP Stabilization Requirements

Current implementation priorities:

1. Translation Memory.
2. Terminology & Glossary System.
3. QA Engine.
4. Semantic Fidelity Engine.
5. Workflow Engine.

End-to-end MVP workflow:

Authentication -> Project -> Document -> Segments -> Translation -> Translation
Memory -> Terminology Validation -> QA Validation -> Semantic Fidelity
Validation -> Review Workflow -> Versioning -> Audit -> Export.

Success criteria:

- End-to-end workflow is operational.
- No critical architecture changes are introduced.
- No new major features are introduced.
- Existing modules are integrated and tested together.

### Platform Support Requirements

The platform must support the approved MVP workflow across the following
platforms:

- Windows.
- macOS.
- Linux.
- Android.
- iOS.
- iPadOS.

Supported form factors:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

UI requirements:

- Responsive UI design.
- Touch support.
- Mobile navigation.
- Mobile-optimized layouts.
- Tablet-optimized editor layouts.
- Desktop keyboard shortcuts.

Application requirements:

- PWA support.
- Installable application support and application-like experience.
- Offline-first capabilities where already supported by the approved
  architecture.

These requirements define delivery and compatibility expectations for the
approved platform. They do not introduce new modules, new MVP scope, or future
feature expansion.

### JSON Master Format Governance

JSON Master Format is the canonical structure for:

- Projects.
- Language-specific manuscripts.
- Documents.
- Segments.
- Metadata.
- Terminology.
- QA.
- Workflow.
- Versions.
- Future media localization.
- Future digital magazine publications and reading experiences.

All platform data that must survive export, backup, audit, migration, or
publishing must be representable in JSON Master Format.

### Manuscript Language Organization

A book or project may contain multiple language-specific manuscripts linked to
the same original work.

Example:

- Book project: one original work.
- Original manuscript: French.
- Romanian manuscript.
- Spanish manuscript.

Rules:

- Each language manuscript must have a stable `manuscriptId`.
- Each manuscript must declare its `language`.
- A translated manuscript must store `sourceManuscriptId` pointing to the
  manuscript from which it was translated.
- The original manuscript must not require `sourceManuscriptId`.
- Each manuscript must include its own `title`, `chapters`, `segments`,
  translation status, workflow status, and language-specific export artifacts.
- Each language manuscript must be exportable separately.
- All language manuscripts must remain linked to the same original work and
  project.
- Translation alignment between source and target segments must be preserved
  through stable source segment references or alignment keys.
- Export artifacts must be tracked per manuscript language.
- This requirement is documentation-only until explicitly scheduled for
  implementation.

### Magazine Platform Vision

Status: Future platform vision. Documentation only. Do not implement now.

The platform reserves a future magazine publishing and reading experience for
multilingual digital publications. This vision extends the publishing layer
after beta without changing the current MVP implementation scope.

#### Original Language Flexibility

Original language must be configurable per publication.

Examples:

- English.
- Romanian.
- Spanish.
- French.
- Italian.
- Portuguese.
- German.
- Any supported language.

Rules:

- Original language is never hard-coded.
- Every translation must remain linked to the original publication.
- Audio versions remain linked to the same original publication.
- Translation alignment must remain auditable through JSON Master references.

#### M1 - Digital Magazine MVP

Status: `PLANNED`.

Priority: `POST-BETA`.

Features:

- Flipbook reader.
- Interactive table of contents.
- Fullscreen mode.
- Zoom controls.
- Full-text search.
- Responsive desktop, tablet, and mobile layout.
- Multi-language reading.
- Language switcher.
- Audio per article.
- PDF export.
- HTML export.
- Link to original article or manuscript.
- Accessibility baseline.

#### M2 - Advanced Reading

Status: `PLANNED`.

Priority: `POST-BETA`.

Features:

- Bookmarks.
- Reading history.
- Favorites.
- Text highlighting.
- Personal notes.
- Offline PWA support.
- Reading progress tracking.

#### M3 - Interactive Magazine

Status: `PLANNED`.

Priority: `FUTURE`.

Features:

- Text/audio synchronization.
- Embedded video.
- Image galleries.
- Podcasts.
- Interactive editorial content.
- Rich media articles.

#### M4 - Enterprise Magazine

Status: `FUTURE`.

Priority: `LONG_TERM`.

Features:

- Original vs translation comparison.
- Edition comparison.
- Semantic analysis.
- AI recommendations.
- Advanced analytics.
- Mobile applications.
- Cross-publication knowledge linking.

#### Non-Implementation Rule

Magazine Platform Vision is specification-only until explicitly scheduled. No
application code, UI creation, database schema changes, API changes, migrations,
AI endpoints, or infrastructure changes are authorized by this section.

### Phase 2 Planning Foundation - Editorial Intelligence & Production Agents

Status: Planned post-MVP architecture foundation. Documentation and
architecture scaffolding only. Do not implement now.

Phase 2 reserves the next layer of specialized editorial agents for
lexicographic intelligence, production layout, visual creation, audio
narration, platform coordination, and AI orchestration. These agents extend the
approved platform direction after the operational MVP and closed beta are
stable.

#### Governance Rules

- Phase 2 does not change current Phase 1 behavior.
- Phase 2 does not authorize runtime API changes, database schema changes,
  migrations, UI work, staging Docker changes, or modifications to Auth,
  Projects, Documents, Segments, Translations, QA, Semantic Fidelity, Workflow,
  or Export logic.
- AI may suggest, automate drafts, prepare artifacts, and coordinate work, but
  authorized human roles keep final approval authority.
- Every Phase 2 agent action must be auditable, including input references,
  output references, dependencies, execution order, cost metadata when
  available, approval status, rejection status, and artifact links.
- Phase 2 outputs must remain traceable through JSON Master Format.
- Validated platform glossary decisions remain authoritative over documented
  editorial decisions, dictionaries, and AI suggestions according to glossary
  priority rules.

#### Lexicographic Intelligence Agent

Purpose: provide structured dictionary and lexical-source intelligence for
terminology, translation decisions, semantic fidelity, QA, and editorial review.

Planned source coverage:

- Dictionary sources.
- Bilingual dictionaries.
- Monolingual dictionaries.
- DEX, DOOM, and DLR.
- Spanish-Romanian and Romanian-Spanish dictionary by Alexandru Calciu and
  Zaira Samharadze.
- Specialized spiritist dictionaries.
- Dictionary entries, lexical senses, examples, sources, and citations.

Glossary priority rules:

1. Validated platform glossary.
2. Documented editorial decision.
3. Specialized dictionary.
4. Academic dictionary.
5. AI suggestion.

AI suggestions cannot become source authority or validated terminology without
authorized human approval.

#### Layout & Editorial Production Agent

Purpose: reserve professional editorial production support for print and
digital outputs.

Planned capabilities:

- Book layout.
- Magazine layout.
- Print finishing.
- PDF/X, EPUB, MOBI, and flipbook production guidance.
- European formats by default.
- American formats as optional production profiles.
- Bleed, crop marks, margins, widows and orphans, and typography checks.

Layout production must remain downstream from approved manuscripts, workflow
state, export readiness, terminology governance, QA, and semantic fidelity.

#### AI Video & Visual Creation Agent

Purpose: reserve AI-assisted visual production for editorial assets and future
media localization.

Planned capabilities:

- Image generation.
- Cover generation.
- Illustration generation.
- Image editing.
- Text-to-video.
- Image-to-video.
- Trailer generation.
- Subtitle and visual localization.

Generated or edited visual assets must preserve source links, rights metadata,
human approval status, and audit references.

#### Audio Narration Agent

Purpose: reserve multilingual narration and audiobook production support.

Planned capabilities:

- Audiobook generation by chapters.
- Text-to-speech.
- Voice profiles.
- MP3, WAV, and FLAC export.
- Multilingual narration.

Narration outputs must remain linked to source manuscripts, chapters, segments,
language versions, voice profiles, approval state, and audit events.

#### Platform Engineering, Optimization & Coordination Agent

Purpose: reserve an operational planning agent for platform maintenance and
release discipline without granting it uncontrolled runtime authority.

Planned responsibilities:

- Software update and upgrade planning.
- Dependency monitoring.
- Docker optimization.
- Backup and restore coordination.
- Auto-healing planning.
- Performance optimization.
- AI cost coordination.
- System maintenance audit.

This agent may prepare recommendations and plans, but implementation remains
subject to authorized engineering review and the existing governance order.

#### AI Orchestrator

Purpose: coordinate approved agents once Phase 2 implementation is explicitly
scheduled.

Planned responsibilities:

- Coordinate all Phase 2 agents.
- Determine execution order.
- Track dependencies.
- Control cost and resource usage.
- Preserve audit trails.
- Enforce human approval gates.

The AI Orchestrator must not bypass security, tenant isolation, RBAC,
terminology governance, workflow gates, source authority requirements, or human
final approval.

### Translation Rules Versioning & Impact Analysis

Every translation rule must be versioned and auditable.

Rules:

- Translation rules cannot be overwritten.
- Every rule change must create a new rule version.
- Previous rule versions must remain auditable.
- Each manuscript must record the translation rule version or versions used.
- Each export artifact must record the translation rule version or versions used
  at export time.
- The system must be able to identify publications, manuscripts, and exports
  translated under older rule versions.

Before approving a rule change, the system must calculate an impact report
covering:

- Affected books.
- Affected manuscripts.
- Affected languages.
- Affected chapters.
- Affected segments.
- Affected terminology entries.
- Affected exports.

Change approval rules:

- Rule changes affecting existing publications must require authorized human
  approval.
- Rule change audit records must store the previous rule version, new rule
  version, approver, date/time, and impact report.
- Impact analysis and approval records must be preserved in JSON Master Format.
- This requirement is documentation-only until explicitly scheduled for
  implementation.

### Rule Source Authority

Every translation rule, terminology rule, editorial rule, semantic fidelity
rule, and exception must have at least one documented authority source.

Required source authority fields:

- `ruleId`.
- `ruleVersion`.
- `sourceType`.
- `sourceReference`.
- `sourceDetails`.
- `sourceLanguage`.
- `sourcePublicationYear`.
- `sourcePageOrSection`.
- `approvalAuthority`.
- `approvalDate`.
- `authorityConfidenceLevel`.

Allowed source types:

- `Original Author`.
- `Original Publication`.
- `Editorial Board Decision`.
- `Approved Editorial Glossary`.
- `Approved Specialized Glossary`.
- `Academic Reference`.
- `Historical Reference`.
- `Regulatory Reference`.
- `Internal Editorial Standard`.

Rules:

- A rule cannot become `VALIDATED` without a source authority.
- Exceptions must also contain a source authority.
- Rule version history must preserve source authority references.
- Impact analysis reports must include affected source authorities.
- AI-generated rules cannot be treated as source authority.
- Source authority references must be auditable and immutable.

Example:

- Rule: `Esprit -> Spirit`.
- Source type: `Original Author`.
- Source reference: `Allan Kardec`.
- Source details: `Le Livre des Esprits, 1860 edition`.
- Source language: `French`.
- Source page or section: `Chapter I`.

This requirement is documentation-only until explicitly scheduled for
implementation.

### Authority Confidence Levels

Authority confidence levels allow the platform to rank source authorities when
translation rules, terminology rules, editorial rules, semantic fidelity rules,
or exceptions have conflicting sources.

Levels:

- `PRIMARY_AUTHORITY`: original author, original publication, canonical edition,
  or validated primary source.
- `SECONDARY_AUTHORITY`: academic reference, recognized dictionary, or
  specialized published reference.
- `EDITORIAL_AUTHORITY`: editorial board decision, approved editorial glossary,
  or approved internal standard.
- `TEMPORARY_AUTHORITY`: provisional editorial decision, unresolved source
  conflict, or temporary beta rule.

Priority rules:

- `PRIMARY_AUTHORITY` has priority over `SECONDARY_AUTHORITY`.
- `SECONDARY_AUTHORITY` has priority over `EDITORIAL_AUTHORITY`.
- `EDITORIAL_AUTHORITY` has priority over `TEMPORARY_AUTHORITY`.
- `TEMPORARY_AUTHORITY` cannot validate a permanent rule.
- Conflicting authorities must be flagged for authorized human review.
- AI output cannot be a source authority or authority confidence level.
- Authority confidence must be auditable and immutable per rule version.
- Impact Analysis reports must include authority confidence levels.

This requirement is documentation-only until explicitly scheduled for
implementation.

### Data Governance & GDPR

The platform must govern:

- Personal data.
- Copyright.
- Corpus licensing.
- Dictionary sources.
- Auditability.
- Compliance.

Required rules:

- Personal data must be stored only when necessary for platform operation,
  workflow accountability, audit, security, or legal compliance.
- Copyright and licensing status must be tracked for documents, corpora,
  dictionaries, glossaries, and external sources.
- Corpus and dictionary usage must preserve source attribution.
- Audit logs must support compliance review without exposing unnecessary
  personal data.
- Export and deletion workflows must respect applicable data protection duties.

### Multi-Tenant Model

The platform must support isolated access for:

- Organizations.
- Teams.
- Projects.
- Users.
- Roles.

Rules:

- Organization boundaries must be enforced at data, API, workflow, and audit
  levels.
- Users may belong to multiple organizations or teams, but access must be scoped
  explicitly.
- Projects, documents, Translation Memory, glossaries, QA results, workflow
  states, audit logs, and exports must not leak across tenants.

### Human Final Authority

AI may suggest and the system may validate, but final editorial decisions belong
to authorized humans.

Rules:

- AI cannot approve final translations.
- AI cannot grant certifications.
- AI cannot override terminology governance.
- AI cannot publish documents or localized media.
- Authorized human reviewers remain responsible for final editorial approval.

### Terminology Governance v2

Status: Approved MVP stabilization enhancement for the existing Terminology &
Glossary System. This is not a new major module.

Purpose: prevent incorrect, invented, misspelled, or non-diacritic terms from
contaminating terminology, Translation Memory, QA, Semantic Fidelity, workflow
approval, exports, and future translations.

Rules:

- AI must never automatically create `VALIDATED` terminology.
- New terminology entries must start as `PROPOSED`.
- Terms not found in approved sources must become `UNDER_REVIEW`.
- Romanian terms must pass diacritics and orthographic validation.
- Terms with missing or incorrect Romanian diacritics must be flagged as High
  severity terminology issues.
- Rejected terms must be treated as Critical terminology issues.
- Terminology Quality Score must be calculated from:
  - spelling correctness.
  - diacritics correctness.
  - approved source presence.
  - glossary presence.
  - reference sources.
  - editorial approval.
  - historical usage.
- Terminology Quality Score levels:
  - `90-100 TRUSTED`.
  - `75-89 ACCEPTABLE`.
  - `50-74 REVIEW_REQUIRED`.
  - `0-49 REJECTED`.
- Only authorized human users may validate, suspend, archive, or reject
  terminology.
- Documents with rejected terms or unresolved High/Critical terminology issues
  cannot move to `READY_FOR_EXPORT` or `EXPORTED`.
- Every terminology governance action must be audited.

Authority rules:

- `VALIDATED` terminology remains authoritative over Translation Memory and AI
  suggestions.
- AI suggestions may be evaluated, explained, or proposed, but they cannot
  validate terminology.
- Repeated usage cannot auto-promote a term to `VALIDATED`.
- Human final authority remains mandatory for validation, suspension, archival,
  and rejection.

### Benchmark & Evaluation Protocol

The platform must define and preserve measurement rules for:

- Semantic fidelity.
- Terminology accuracy.
- Fluency.
- QA.
- Semantic risk.

Evaluation outputs must be explainable, auditable, and comparable across
documents, projects, translators, AI suggestions, and benchmark suites.

### Backup, Export & Exit Strategy

The platform must support full export of:

- Projects.
- Translation Memory.
- Glossaries.
- Audit logs.
- Versions.
- JSON Master data.

Exit strategy rules:

- Users and organizations must be able to retrieve their canonical project data.
- Export must preserve IDs, metadata, terminology, QA, workflow, audit, and
  version references.
- Backup and export must not depend on proprietary runtime state alone.

## JSON Master Format v1.0

Status: Official platform specification. Documentation only. Do not implement
code yet.

JSON Master Format v1.0 is the single source of truth for the platform. Every
project, language-specific manuscript, document, segment, translation, term, QA
result, workflow event, audit entry, version snapshot, and future media
localization asset must be representable from this format.

No exported file format can become the source of truth. PDF, EPUB, HTML, print,
subtitle files, dubbed media, voice-over tracks, and localized videos must be
generated from, or traced back to, JSON Master Format.

### Scope

JSON Master Format v1.0 supports:

- Projects and project metadata.
- Language-specific manuscripts for the same original work.
- Documents and document metadata.
- Segment-based source text.
- Translations per target language.
- Versioned translation rules and rule impact reports.
- Terminology and glossary references.
- Translation Memory references and matches.
- QA results and semantic fidelity checks.
- Workflow state, assignments, approvals, and review status.
- Audit logs.
- Version history and immutable snapshots.
- Future basic editorial media localization for transcripts, subtitles,
  voice-over, simple dubbing, audio export, transcript export, and localized
  video exports.
- Future magazine publications, article language variants, article audio assets,
  and links to original articles or manuscripts.
- Future Phase 2 planning fields for dictionaries, layout production, visual
  assets, audio narration tracks, video assets, production profiles, and agent
  executions.

### Core Rules

- `formatVersion` must be `1.0`.
- `project.id`, `manuscripts[].manuscriptId`, `documents[].id`, and
  `segments[].id` must be stable IDs.
- A project may contain one or more language-specific manuscripts.
- Translated manuscripts must preserve `sourceManuscriptId`.
- Segment alignment between source and translated manuscripts must be preserved
  through `sourceSegmentId` or stable alignment keys.
- Each manuscript language must be exportable independently.
- Each manuscript and export artifact must record the translation rule version
  or versions used.
- Translation rules cannot be overwritten; rule changes must create new versions.
- Rule changes affecting existing publications must include impact analysis and
  authorized approval before activation.
- Every rule version and exception must retain at least one non-AI source
  authority reference.
- Source authority references must include immutable authority confidence levels.
- Impact reports must include affected source authorities.
- Impact reports must include affected authority confidence levels.
- Source content must never be overwritten by target translations.
- Each translation must keep language, status, author, timestamps, QA, and
  provenance metadata.
- Segment order must be explicit.
- Terminology decisions must be traceable to glossary, dictionary, corpus,
  editorial decision, or AI suggestion.
- Workflow and audit events must be append-only.
- Version history must preserve immutable snapshots or snapshot references.
- Media localization data is optional in v1.0 but reserved in the schema for
  transcript generation/correction, transcript translation, subtitle,
  multilingual voice-over, simple dubbing, synchronization, audio export,
  transcript export, and localized video export.
- Media localization is a Future/Post-Beta basic editorial localization
  workflow, not a full professional video editor or Adobe Premiere replacement.
- Media original language must be configurable and never hard-coded.
- Every transcript, subtitle, audio track, dubbing track, and localized video
  export must remain linked to the original media asset.
- Media assets must remain linked to the original manuscript, article, book, or
  project when applicable.
- Media translations must follow terminology, QA, Semantic Fidelity, and global
  translation rules.
- Magazine publication data is optional in v1.0 but reserved conceptually for
  future flipbook reading, article audio, language switching, search, PDF/HTML
  magazine export, and links back to original articles or manuscripts.
- Phase 2 planning data is optional in v1.0 and reserved conceptually for
  dictionary intelligence, editorial layout, visual creation, audio narration,
  video assets, production profiles, and auditable agent execution records.
- Phase 2 agent execution records must preserve human approval gates and audit
  references.

### Top-Level Structure

Required top-level keys:

- `formatVersion`
- `project`
- `manuscripts`
- `documents`
- `terminology`
- `translationMemory`
- `translationRules`
- `qa`
- `workflow`
- `audit`
- `versionHistory`

Optional top-level key reserved for future phases:

- `mediaLocalization`
- `dictionaries`
- `layout`
- `visualAssets`
- `audioTracks`
- `videoAssets`
- `productionProfiles`
- `agentExecutions`

### JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://laboratorul-editurii.local/schemas/json-master-format-1.0.schema.json",
  "title": "JSON Master Format v1.0",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "formatVersion",
    "project",
    "manuscripts",
    "documents",
    "terminology",
    "translationMemory",
    "translationRules",
    "qa",
    "workflow",
    "audit",
    "versionHistory"
  ],
  "properties": {
    "formatVersion": {
      "const": "1.0"
    },
    "project": {
      "$ref": "#/$defs/project"
    },
    "manuscripts": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/manuscript"
      },
      "minItems": 1
    },
    "documents": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/document"
      }
    },
    "terminology": {
      "$ref": "#/$defs/terminology"
    },
    "translationMemory": {
      "$ref": "#/$defs/translationMemory"
    },
    "translationRules": {
      "$ref": "#/$defs/translationRules"
    },
    "qa": {
      "$ref": "#/$defs/projectQa"
    },
    "workflow": {
      "$ref": "#/$defs/workflow"
    },
    "audit": {
      "$ref": "#/$defs/audit"
    },
    "versionHistory": {
      "$ref": "#/$defs/versionHistory"
    },
    "mediaLocalization": {
      "$ref": "#/$defs/mediaLocalization"
    },
    "dictionaries": {
      "$ref": "#/$defs/futurePhaseObject"
    },
    "layout": {
      "$ref": "#/$defs/futurePhaseObject"
    },
    "visualAssets": {
      "$ref": "#/$defs/futurePhaseArray"
    },
    "audioTracks": {
      "$ref": "#/$defs/futurePhaseArray"
    },
    "videoAssets": {
      "$ref": "#/$defs/futurePhaseArray"
    },
    "productionProfiles": {
      "$ref": "#/$defs/futurePhaseArray"
    },
    "agentExecutions": {
      "$ref": "#/$defs/futurePhaseArray"
    }
  },
  "$defs": {
    "id": {
      "type": "string",
      "minLength": 1
    },
    "futurePhaseObject": {
      "type": "object",
      "additionalProperties": true
    },
    "futurePhaseArray": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": true
      }
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "languageCode": {
      "type": "string",
      "pattern": "^[a-z]{2,3}(-[A-Za-z0-9]+)?$"
    },
    "project": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "name",
        "sourceLanguage",
        "targetLanguages",
        "status",
        "createdAt",
        "updatedAt"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "sourceLanguage": {
          "$ref": "#/$defs/languageCode"
        },
        "targetLanguages": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/languageCode"
          }
        },
        "domain": {
          "type": "string"
        },
        "status": {
          "enum": [
            "draft",
            "active",
            "in_review",
            "approved",
            "published",
            "archived"
          ]
        },
        "createdAt": {
          "$ref": "#/$defs/timestamp"
        },
        "updatedAt": {
          "$ref": "#/$defs/timestamp"
        },
        "metadata": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "manuscript": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "manuscriptId",
        "projectId",
        "language",
        "title",
        "chapters",
        "segments",
        "ruleVersionRefs",
        "translationStatus",
        "workflowStatus",
        "exportArtifacts"
      ],
      "properties": {
        "manuscriptId": {
          "$ref": "#/$defs/id"
        },
        "projectId": {
          "$ref": "#/$defs/id"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "sourceManuscriptId": {
          "$ref": "#/$defs/id"
        },
        "title": {
          "type": "string"
        },
        "chapters": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/manuscriptChapter"
          }
        },
        "segments": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/manuscriptSegment"
          }
        },
        "ruleVersionRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "translationStatus": {
          "enum": [
            "original",
            "not_started",
            "in_translation",
            "translated",
            "in_review",
            "approved",
            "ready_for_export",
            "exported"
          ]
        },
        "workflowStatus": {
          "enum": [
            "DRAFT",
            "IN_TRANSLATION",
            "IN_QA",
            "IN_SEMANTIC_REVIEW",
            "IN_REVIEW",
            "APPROVED",
            "READY_FOR_EXPORT",
            "EXPORTED",
            "BLOCKED"
          ]
        },
        "exportArtifacts": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/manuscriptExportArtifact"
          }
        },
        "metadata": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "manuscriptChapter": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "chapterId",
        "order",
        "title",
        "segmentIds"
      ],
      "properties": {
        "chapterId": {
          "$ref": "#/$defs/id"
        },
        "order": {
          "type": "integer",
          "minimum": 0
        },
        "title": {
          "type": "string"
        },
        "sourceChapterId": {
          "$ref": "#/$defs/id"
        },
        "segmentIds": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        }
      }
    },
    "manuscriptSegment": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "segmentId",
        "order",
        "text",
        "status"
      ],
      "properties": {
        "segmentId": {
          "$ref": "#/$defs/id"
        },
        "sourceSegmentId": {
          "$ref": "#/$defs/id"
        },
        "alignmentKey": {
          "type": "string"
        },
        "order": {
          "type": "integer",
          "minimum": 0
        },
        "text": {
          "type": "string"
        },
        "status": {
          "enum": [
            "new",
            "in_translation",
            "translated",
            "in_review",
            "approved",
            "locked"
          ]
        },
        "workflowStatus": {
          "type": "string"
        },
        "metadata": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "manuscriptExportArtifact": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "artifactId",
        "language",
        "format",
        "uri",
        "ruleVersionRefs",
        "createdAt"
      ],
      "properties": {
        "artifactId": {
          "$ref": "#/$defs/id"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "format": {
          "enum": [
            "json_master",
            "pdf",
            "epub",
            "mobi",
            "html",
            "docx",
            "txt",
            "print",
            "srt",
            "vtt",
            "ass",
            "localized_video"
          ]
        },
        "uri": {
          "type": "string"
        },
        "checksum": {
          "type": "string"
        },
        "workflowStatusAtExport": {
          "type": "string"
        },
        "ruleVersionRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "createdAt": {
          "$ref": "#/$defs/timestamp"
        }
      }
    },
    "document": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "projectId",
        "title",
        "sourceLanguage",
        "segments"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "projectId": {
          "$ref": "#/$defs/id"
        },
        "title": {
          "type": "string"
        },
        "sourceLanguage": {
          "$ref": "#/$defs/languageCode"
        },
        "documentType": {
          "enum": [
            "book",
            "article",
            "technical_document",
            "subtitle_script",
            "media_transcript",
            "other"
          ]
        },
        "sourceFile": {
          "$ref": "#/$defs/sourceFile"
        },
        "segments": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/segment"
          }
        },
        "versions": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/versionReference"
          }
        },
        "metadata": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "sourceFile": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "name": {
          "type": "string"
        },
        "mimeType": {
          "type": "string"
        },
        "checksum": {
          "type": "string"
        },
        "uri": {
          "type": "string"
        }
      }
    },
    "segment": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "order",
        "source",
        "translations",
        "status"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "order": {
          "type": "integer",
          "minimum": 0
        },
        "source": {
          "$ref": "#/$defs/sourceSegment"
        },
        "translations": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/translation"
          }
        },
        "terminologyRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "translationMemoryRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "qaRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "workflowState": {
          "type": "string"
        },
        "status": {
          "enum": [
            "new",
            "in_translation",
            "translated",
            "in_review",
            "approved",
            "locked"
          ]
        },
        "mediaTiming": {
          "$ref": "#/$defs/mediaTiming"
        },
        "metadata": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "sourceSegment": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "text"
      ],
      "properties": {
        "text": {
          "type": "string"
        },
        "normalizedText": {
          "type": "string"
        },
        "notes": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "structuralPath": {
          "type": "string"
        }
      }
    },
    "translation": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "language",
        "text",
        "status",
        "createdAt",
        "updatedAt"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "text": {
          "type": "string"
        },
        "status": {
          "enum": [
            "draft",
            "machine_suggested",
            "human_edited",
            "reviewed",
            "approved",
            "rejected"
          ]
        },
        "translatorId": {
          "$ref": "#/$defs/id"
        },
        "reviewerId": {
          "$ref": "#/$defs/id"
        },
        "qa": {
          "$ref": "#/$defs/segmentQa"
        },
        "provenance": {
          "$ref": "#/$defs/provenance"
        },
        "createdAt": {
          "$ref": "#/$defs/timestamp"
        },
        "updatedAt": {
          "$ref": "#/$defs/timestamp"
        }
      }
    },
    "provenance": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "source": {
          "enum": [
            "human",
            "ai",
            "translation_memory",
            "glossary",
            "dictionary",
            "corpus",
            "editorial_decision"
          ]
        },
        "sourceRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "confidence": {
          "type": "number",
          "minimum": 0,
          "maximum": 1
        },
        "explanation": {
          "type": "string"
        }
      }
    },
    "terminology": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "terms"
      ],
      "properties": {
        "terms": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/term"
          }
        }
      }
    },
    "term": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "sourceTerm",
        "language",
        "status"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "sourceTerm": {
          "type": "string"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "approvedTranslations": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/termTranslation"
          }
        },
        "forbiddenTranslations": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "domain": {
          "type": "string"
        },
        "definition": {
          "type": "string"
        },
        "source": {
          "enum": [
            "dictionary",
            "glossary",
            "translation_memory",
            "corpus",
            "editorial_decision",
            "ai"
          ]
        },
        "status": {
          "enum": [
            "proposed",
            "under_review",
            "validated",
            "suspended",
            "archived_historically"
          ]
        }
      }
    },
    "termTranslation": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "language",
        "text"
      ],
      "properties": {
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "text": {
          "type": "string"
        }
      }
    },
    "translationMemory": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "entries"
      ],
      "properties": {
        "entries": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/translationMemoryEntry"
          }
        }
      }
    },
    "translationMemoryEntry": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "sourceText",
        "targetText",
        "sourceLanguage",
        "targetLanguage"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "sourceText": {
          "type": "string"
        },
        "targetText": {
          "type": "string"
        },
        "sourceLanguage": {
          "$ref": "#/$defs/languageCode"
        },
        "targetLanguage": {
          "$ref": "#/$defs/languageCode"
        },
        "domain": {
          "type": "string"
        },
        "qualityScore": {
          "type": "number",
          "minimum": 0,
          "maximum": 100
        },
        "sourceDocumentId": {
          "$ref": "#/$defs/id"
        }
      }
    },
    "translationRules": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "rules",
        "sourceAuthorities",
        "impactReports",
        "changeApprovals",
        "exceptions"
      ],
      "properties": {
        "rules": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/translationRule"
          }
        },
        "sourceAuthorities": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/ruleSourceAuthority"
          }
        },
        "impactReports": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/translationRuleImpactReport"
          }
        },
        "changeApprovals": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/translationRuleChangeApproval"
          }
        },
        "exceptions": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/ruleException"
          }
        }
      }
    },
    "translationRule": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "ruleId",
        "currentVersionId",
        "versions"
      ],
      "properties": {
        "ruleId": {
          "$ref": "#/$defs/id"
        },
        "name": {
          "type": "string"
        },
        "scope": {
          "enum": [
            "global",
            "language",
            "domain",
            "project",
            "manuscript",
            "terminology"
          ]
        },
        "currentVersionId": {
          "$ref": "#/$defs/id"
        },
        "versions": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/translationRuleVersion"
          },
          "minItems": 1
        }
      }
    },
    "translationRuleVersion": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "ruleVersionId",
        "ruleId",
        "versionNumber",
        "status",
        "content",
        "sourceAuthorityRefs",
        "createdBy",
        "createdAt"
      ],
      "properties": {
        "ruleVersionId": {
          "$ref": "#/$defs/id"
        },
        "ruleId": {
          "$ref": "#/$defs/id"
        },
        "previousRuleVersionId": {
          "$ref": "#/$defs/id"
        },
        "versionNumber": {
          "type": "integer",
          "minimum": 1
        },
        "status": {
          "enum": [
            "draft",
            "pending_impact_analysis",
            "pending_approval",
            "approved",
            "validated",
            "active",
            "superseded",
            "rejected"
          ]
        },
        "content": {
          "type": "object",
          "additionalProperties": true
        },
        "sourceAuthorityRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          },
          "minItems": 1
        },
        "createdBy": {
          "$ref": "#/$defs/id"
        },
        "createdAt": {
          "$ref": "#/$defs/timestamp"
        },
        "approvedBy": {
          "$ref": "#/$defs/id"
        },
        "approvedAt": {
          "$ref": "#/$defs/timestamp"
        }
      }
    },
    "ruleSourceAuthority": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "ruleId",
        "ruleVersion",
        "sourceType",
        "sourceReference",
        "sourceDetails",
        "sourceLanguage",
        "sourcePublicationYear",
        "sourcePageOrSection",
        "approvalAuthority",
        "approvalDate",
        "authorityConfidenceLevel"
      ],
      "properties": {
        "sourceAuthorityId": {
          "$ref": "#/$defs/id"
        },
        "ruleId": {
          "$ref": "#/$defs/id"
        },
        "ruleVersion": {
          "type": "string"
        },
        "sourceType": {
          "enum": [
            "Original Author",
            "Original Publication",
            "Editorial Board Decision",
            "Approved Editorial Glossary",
            "Approved Specialized Glossary",
            "Academic Reference",
            "Historical Reference",
            "Regulatory Reference",
            "Internal Editorial Standard"
          ]
        },
        "sourceReference": {
          "type": "string"
        },
        "sourceDetails": {
          "type": "string"
        },
        "sourceLanguage": {
          "$ref": "#/$defs/languageCode"
        },
        "sourcePublicationYear": {
          "type": "integer"
        },
        "sourcePageOrSection": {
          "type": "string"
        },
        "approvalAuthority": {
          "type": "string"
        },
        "approvalDate": {
          "$ref": "#/$defs/timestamp"
        },
        "authorityConfidenceLevel": {
          "enum": [
            "PRIMARY_AUTHORITY",
            "SECONDARY_AUTHORITY",
            "EDITORIAL_AUTHORITY",
            "TEMPORARY_AUTHORITY"
          ]
        },
        "immutable": {
          "const": true
        },
        "aiGenerated": {
          "const": false
        }
      }
    },
    "ruleException": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "exceptionId",
        "ruleId",
        "ruleVersion",
        "reason",
        "sourceAuthorityRefs",
        "status"
      ],
      "properties": {
        "exceptionId": {
          "$ref": "#/$defs/id"
        },
        "ruleId": {
          "$ref": "#/$defs/id"
        },
        "ruleVersion": {
          "type": "string"
        },
        "reason": {
          "type": "string"
        },
        "sourceAuthorityRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          },
          "minItems": 1
        },
        "status": {
          "enum": [
            "proposed",
            "under_review",
            "validated",
            "rejected",
            "archived"
          ]
        },
        "approvedBy": {
          "$ref": "#/$defs/id"
        },
        "approvedAt": {
          "$ref": "#/$defs/timestamp"
        }
      }
    },
    "translationRuleImpactReport": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "impactReportId",
        "ruleId",
        "newRuleVersionId",
        "generatedAt",
        "affectedBooks",
        "affectedManuscripts",
        "affectedLanguages",
        "affectedChapters",
        "affectedSegments",
        "affectedTerminologyEntries",
        "affectedSourceAuthorities",
        "affectedAuthorityConfidenceLevels",
        "affectedExports"
      ],
      "properties": {
        "impactReportId": {
          "$ref": "#/$defs/id"
        },
        "ruleId": {
          "$ref": "#/$defs/id"
        },
        "previousRuleVersionId": {
          "$ref": "#/$defs/id"
        },
        "newRuleVersionId": {
          "$ref": "#/$defs/id"
        },
        "generatedAt": {
          "$ref": "#/$defs/timestamp"
        },
        "affectedBooks": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "affectedManuscripts": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "affectedLanguages": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/languageCode"
          }
        },
        "affectedChapters": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "affectedSegments": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "affectedTerminologyEntries": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "affectedSourceAuthorities": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "affectedAuthorityConfidenceLevels": {
          "type": "array",
          "items": {
            "enum": [
              "PRIMARY_AUTHORITY",
              "SECONDARY_AUTHORITY",
              "EDITORIAL_AUTHORITY",
              "TEMPORARY_AUTHORITY"
            ]
          }
        },
        "affectedExports": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        }
      }
    },
    "translationRuleChangeApproval": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "approvalId",
        "ruleId",
        "newRuleVersionId",
        "approverId",
        "approvedAt",
        "impactReportId"
      ],
      "properties": {
        "approvalId": {
          "$ref": "#/$defs/id"
        },
        "ruleId": {
          "$ref": "#/$defs/id"
        },
        "previousRuleVersionId": {
          "$ref": "#/$defs/id"
        },
        "newRuleVersionId": {
          "$ref": "#/$defs/id"
        },
        "sourceAuthorityRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          },
          "minItems": 1
        },
        "approverId": {
          "$ref": "#/$defs/id"
        },
        "approvedAt": {
          "$ref": "#/$defs/timestamp"
        },
        "impactReportId": {
          "$ref": "#/$defs/id"
        },
        "decision": {
          "enum": [
            "approved",
            "rejected",
            "approved_with_conditions"
          ]
        }
      }
    },
    "projectQa": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "checks"
      ],
      "properties": {
        "checks": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/qaCheck"
          }
        },
        "scores": {
          "$ref": "#/$defs/qaScores"
        }
      }
    },
    "segmentQa": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "checks": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/qaCheck"
          }
        },
        "scores": {
          "$ref": "#/$defs/qaScores"
        }
      }
    },
    "qaCheck": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "type",
        "severity",
        "status"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "type": {
          "enum": [
            "semantic_fidelity",
            "terminology",
            "numbers",
            "dates",
            "units",
            "proper_names",
            "punctuation",
            "formatting",
            "missing_segment",
            "duplicate_segment",
            "subtitle_timing",
            "audio_sync",
            "reading_speed"
          ]
        },
        "severity": {
          "enum": [
            "info",
            "warning",
            "error",
            "blocking"
          ]
        },
        "message": {
          "type": "string"
        },
        "status": {
          "enum": [
            "open",
            "resolved",
            "accepted_risk",
            "false_positive"
          ]
        }
      }
    },
    "qaScores": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "semanticFidelity": {
          "type": "number",
          "minimum": 0,
          "maximum": 100
        },
        "terminology": {
          "type": "number",
          "minimum": 0,
          "maximum": 100
        },
        "consistency": {
          "type": "number",
          "minimum": 0,
          "maximum": 100
        },
        "fluency": {
          "type": "number",
          "minimum": 0,
          "maximum": 100
        },
        "overall": {
          "type": "number",
          "minimum": 0,
          "maximum": 100
        }
      }
    },
    "workflow": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "state",
        "events"
      ],
      "properties": {
        "state": {
          "enum": [
            "draft",
            "translation",
            "review",
            "approved",
            "published",
            "archived"
          ]
        },
        "assignments": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/assignment"
          }
        },
        "events": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/workflowEvent"
          }
        }
      }
    },
    "assignment": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "userId",
        "role"
      ],
      "properties": {
        "userId": {
          "$ref": "#/$defs/id"
        },
        "role": {
          "enum": [
            "admin",
            "translator",
            "reviewer",
            "viewer",
            "expert"
          ]
        }
      }
    },
    "workflowEvent": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "type",
        "createdAt"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "type": {
          "type": "string"
        },
        "actorId": {
          "$ref": "#/$defs/id"
        },
        "createdAt": {
          "$ref": "#/$defs/timestamp"
        },
        "payload": {
          "type": "object",
          "additionalProperties": true
        }
      }
    },
    "audit": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "events"
      ],
      "properties": {
        "events": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/auditEvent"
          }
        }
      }
    },
    "auditEvent": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "action",
        "timestamp"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "actorId": {
          "$ref": "#/$defs/id"
        },
        "action": {
          "type": "string"
        },
        "entityType": {
          "type": "string"
        },
        "entityId": {
          "$ref": "#/$defs/id"
        },
        "before": {
          "type": [
            "object",
            "null"
          ],
          "additionalProperties": true
        },
        "after": {
          "type": [
            "object",
            "null"
          ],
          "additionalProperties": true
        },
        "timestamp": {
          "$ref": "#/$defs/timestamp"
        }
      }
    },
    "versionHistory": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "versions"
      ],
      "properties": {
        "versions": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/versionReference"
          }
        }
      }
    },
    "versionReference": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "createdAt",
        "createdBy",
        "snapshotRef"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "createdAt": {
          "$ref": "#/$defs/timestamp"
        },
        "createdBy": {
          "$ref": "#/$defs/id"
        },
        "summary": {
          "type": "string"
        },
        "snapshotRef": {
          "type": "string"
        },
        "checksum": {
          "type": "string"
        }
      }
    },
    "mediaLocalization": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "mediaAssets": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/mediaAsset"
          }
        },
        "transcripts": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/mediaTranscript"
          }
        },
        "subtitleTracks": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/subtitleTrack"
          }
        },
        "voiceOverTracks": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/audioTrack"
          }
        },
        "dubbingTracks": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/audioTrack"
          }
        },
        "mediaVersions": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/languageSpecificMediaVersion"
          }
        },
        "localizedVideoExports": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/localizedVideoExport"
          }
        }
      }
    },
    "mediaAsset": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "type",
        "uri"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "type": {
          "enum": [
            "video",
            "audio",
            "subtitle",
            "transcript"
          ]
        },
        "uri": {
          "type": "string"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "originalLanguage": {
          "$ref": "#/$defs/languageCode"
        },
        "originalMediaAssetId": {
          "$ref": "#/$defs/id"
        },
        "projectId": {
          "$ref": "#/$defs/id"
        },
        "bookId": {
          "$ref": "#/$defs/id"
        },
        "manuscriptId": {
          "$ref": "#/$defs/id"
        },
        "articleId": {
          "$ref": "#/$defs/id"
        },
        "durationMs": {
          "type": "integer",
          "minimum": 0
        },
        "checksum": {
          "type": "string"
        }
      }
    },
    "mediaTranscript": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "mediaAssetId",
        "language",
        "status",
        "segmentRefs"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "mediaAssetId": {
          "$ref": "#/$defs/id"
        },
        "sourceTranscriptId": {
          "$ref": "#/$defs/id"
        },
        "originalMediaAssetId": {
          "$ref": "#/$defs/id"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "status": {
          "enum": [
            "generated",
            "corrected",
            "translated",
            "approved",
            "exported"
          ]
        },
        "segmentRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        }
      }
    },
    "mediaTiming": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "startMs": {
          "type": "integer",
          "minimum": 0
        },
        "endMs": {
          "type": "integer",
          "minimum": 0
        },
        "speakerId": {
          "$ref": "#/$defs/id"
        }
      }
    },
    "subtitleTrack": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "language",
        "format",
        "segmentRefs"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "format": {
          "enum": [
            "srt",
            "vtt",
            "ass"
          ]
        },
        "mediaAssetId": {
          "$ref": "#/$defs/id"
        },
        "originalMediaAssetId": {
          "$ref": "#/$defs/id"
        },
        "sourceTranscriptId": {
          "$ref": "#/$defs/id"
        },
        "sourceSubtitleTrackId": {
          "$ref": "#/$defs/id"
        },
        "segmentRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        }
      }
    },
    "audioTrack": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "language",
        "type",
        "uri"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "type": {
          "enum": [
            "voice_over",
            "dubbing"
          ]
        },
        "uri": {
          "type": "string"
        },
        "mediaAssetId": {
          "$ref": "#/$defs/id"
        },
        "originalMediaAssetId": {
          "$ref": "#/$defs/id"
        },
        "sourceAudioTrackId": {
          "$ref": "#/$defs/id"
        },
        "sourceSegmentRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "syncQualityScore": {
          "type": "number",
          "minimum": 0,
          "maximum": 100
        }
      }
    },
    "languageSpecificMediaVersion": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "originalMediaAssetId",
        "language",
        "mediaAssetRefs"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "originalMediaAssetId": {
          "$ref": "#/$defs/id"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "transcriptId": {
          "$ref": "#/$defs/id"
        },
        "subtitleTrackIds": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "audioTrackIds": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        },
        "mediaAssetRefs": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/id"
          }
        }
      }
    },
    "localizedVideoExport": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "language",
        "uri",
        "createdAt"
      ],
      "properties": {
        "id": {
          "$ref": "#/$defs/id"
        },
        "language": {
          "$ref": "#/$defs/languageCode"
        },
        "uri": {
          "type": "string"
        },
        "originalMediaAssetId": {
          "$ref": "#/$defs/id"
        },
        "mediaVersionId": {
          "$ref": "#/$defs/id"
        },
        "transcriptId": {
          "$ref": "#/$defs/id"
        },
        "subtitleTrackId": {
          "$ref": "#/$defs/id"
        },
        "audioTrackId": {
          "$ref": "#/$defs/id"
        },
        "createdAt": {
          "$ref": "#/$defs/timestamp"
        }
      }
    }
  }
}
```

## AI Agent Governance, Subagents & Parallel Review

Status: Governance refinement. No new enterprise module.

All AI agents follow one governance model. For every agent the platform records
or exposes:

- ID.
- Name.
- Parent agent ID where applicable.
- Mission.
- Responsibilities.
- Collaboration rules.
- Limits.
- Authority.
- Enabled state.
- Version.
- Last update timestamp.

### Collaboration

All agents may collaborate freely. Agents may exchange information, request
assistance, reuse results, notify other agents, and coordinate through the
Coordinator Agent. There are no communication restrictions between agents.

All agent invocations, subagent invocations, generated proposals,
accepted/rejected proposals, responsibility transfers, quality statuses, final
agent decisions, and human overrides must remain auditable.

### Responsibility

Each agent has final AI responsibility only within its own specialization:

- Translation Agent: translation suggestions and translation decision support.
- Review Agent: editorial corrections and review recommendations.
- Layout Agent: page layout recommendations.
- Illustration Agent: illustration drafts and visual consistency.
- Audio Agent: audiobook draft support and audio readiness.
- Video Agent: video draft support and video readiness.
- Quality Agent: quality verification.

Principal agents retain final responsibility for their subagents' results.

### Human Final Authority

Human approval always overrides every AI decision. No AI agent may publish
automatically, approve automatically, grant rights, bypass workflow, modify
security, or change governance.

### Current Agents

The current governed agents are:

1. Coordinator Agent.
2. Projects Agent.
3. Manuscripts Agent.
4. Documentation Agent.
5. Translation Agent.
6. Review Agent.
7. Layout Agent.
8. Publishing Agent.
9. Distribution Agent.
10. Library Agent.
11. Rights & Provenance Agent.
12. Illustration Agent.
13. Audio Agent.
14. Video Agent.
15. Magazine Agent.
16. Administration Agent.
17. Evolution Agent.
18. Quality Agent.

### Specialized Subagents

The approved subagents are:

1. Terminology & Lexicography Subagent.
   Parent: Translation Agent.
   Responsibilities: validated glossaries, terminology consistency,
   specialized terms, terminology status, source tracking, alternatives that do
   not silently replace validated terms.
2. Semantic Fidelity Subagent.
   Parent: Translation Agent.
   Responsibilities: sentence-by-sentence source/translation comparison,
   omissions, additions, meaning shifts, tone, intent, verbal tense, semantic
   divergence reports.
3. Editorial Decision Subagent.
   Parent: Review Agent.
   Responsibilities: competing editorial variants, stylistic differences,
   normative differences, preferred-variant recommendations, no automatic
   application.
4. Planning & Coordination Subagent.
   Parent: Coordinator Agent.
   Responsibilities: deadlines, priorities, dependencies, workload balancing,
   milestones, scheduling conflicts, AI task scheduling.
5. Media Localization Subagent.
   Parents: Audio Agent and Video Agent.
   Responsibilities: multilingual subtitles, localized narration,
   pronunciation, timing and synchronization, regional variants, accessible
   localized media.
6. Platform Engineering Subagent.
   Parent: Evolution Agent.
   Responsibilities: architecture compatibility, dependency analysis, upgrade
   plans, migrations, rollback plans, technical risk assessment.

### Quality Agent

Mission: verify that an editorial project is ready for publication.

Responsibilities:

- Editorial completeness.
- Editorial consistency.
- Metadata validation.
- Missing assets.
- Links verification.
- Accessibility verification.
- Export validation.
- Rights status.
- Workflow completion.
- Publication readiness.
- Distribution readiness.

Quality Agent reports issues only. It does not correct the project and may not
translate, review, edit, illustrate, publish, or approve.

Quality Agent statuses:

- `READY`.
- `READY_WITH_WARNINGS`.
- `BLOCKED`.

### Review Agent Proposal Model

Review proposals must store:

- `proposalId`.
- `projectId`.
- `documentId`.
- `segmentId`.
- `sourceText`.
- `currentTranslation`.
- `proposedText`.
- `language`.
- `issueType`.
- `explanation`.
- `confidence`.
- `status`: `PENDING`, `ACCEPTED`, or `REJECTED`.
- `createdByAgent`.
- `reviewedBy`.
- `createdAt`.
- `resolvedAt`.

Review Agent identifies each issue, explains it, proposes one or more
replacement variants when available, never imposes the proposed change,
preserves current text until a proposal is accepted, supports individual accept
or reject actions, does not alter original meaning, and does not replace
validated terminology without justification and traceability.

### Parallel Translation & Review Interface

The original text and translation must remain visible in parallel.

Default display:

- Two columns.
- Column 1: original text.
- Column 2: current translation and proposed replacement variants attached to
  relevant translated sentences.

Required behavior:

- Sentence and paragraph alignment.
- Synchronized scrolling can be enabled or disabled.
- Original text remains immutable.
- Translation remains unchanged until a proposal is accepted.
- Differences are highlighted.
- Accepted and rejected proposals are audited.
- Version history is preserved.
- User may resize or temporarily hide columns.

Optional display modes:

- Three columns: original, translation, and another language, version, or
  comparison text.
- Four columns: simultaneous comparison of up to four languages or versions.

For optional columns, language or version can be selected independently while
alignment is preserved.

## Future Phase - Media Localization Studio

Status: Future Phase. Do not implement now.

The platform will include a future basic editorial media localization subsystem
for translating, adapting, dubbing, subtitling, synchronizing, and exporting
localized audio/video content. This module extends the translation platform into
multimedia localization workflows while preserving the same principles of
semantic fidelity, terminology control, traceability, and professional review.

Media Localization Studio is not a full Adobe Premiere replacement and is not a
professional non-linear video editing suite.

### Capabilities

- Video and audio upload: import source media for editorial localization.
- Automatic transcript generation: transcribe source audio/video into editable
  text.
- Transcript correction: allow humans to correct generated transcripts before
  translation or export.
- Transcript translation: translate transcript segments under the same
  terminology, QA, Semantic Fidelity, and global translation rules as document
  translation.
- Subtitle generation: create subtitles from transcript or translated segments.
- Subtitle formats: export and manage SRT, VTT, and ASS.
- Multilingual subtitles: maintain subtitle tracks per target language.
- Multilingual voice-over: generate or manage localized narration tracks.
- Simple AI dubbing: produce basic localized dialogue aligned with speaker timing
  and intent.
- Audio export: export localized voice-over or dubbing audio.
- Transcript export: export source and translated transcripts.
- Localized video export: export localized video with selected subtitle,
  voice-over, dubbing, and audio settings.
- Text/audio/video synchronization: align transcripts, subtitles, audio, timing,
  and visual cues.
- Source linking: link media assets to the original manuscript, article, book,
  or project.
- Language-specific media versions: preserve separate media versions per target
  language while keeping alignment to the original media.
- Media Localization QA: detect subtitle timing issues, missing subtitles,
  terminology violations, reading-speed problems, audio drift, and sync errors.
- Workflow Integration: connect media localization tasks with projects, roles,
  review, audit, terminology, Translation Memory, and publishing workflows.

### Explicit Exclusions

- Advanced video editing.
- Color grading.
- Complex timeline editing.
- Visual effects.
- Advanced transitions.
- Professional compositing.

### Rules

- Original language must be configurable and never hard-coded.
- Every transcript, subtitle, audio version, dubbing version, and localized
  video export must remain linked to the original media asset.
- Media assets must remain linked to the original manuscript, article, book, or
  project when applicable.
- Language-specific media versions must preserve auditable alignment to the
  original media and source text.
- Transcript and subtitle translations must follow terminology, QA, Semantic
  Fidelity, and global translation rules.
- Human final authority remains required for release approval.

### Architectural Position

Media Localization Studio is a future subsystem, not part of the current
MVP. It must integrate with:

- Translation Editor.
- Terminology and glossary systems.
- Semantic Fidelity Engine.
- Quality Assurance Engine.
- Translation Memory.
- Global Editorial Memory.
- Workflow and review pipelines.
- Audit and source traceability.
- Export and publishing systems.

### Non-Implementation Rule

This phase is specification-only until explicitly scheduled. No application code,
database migrations, AI endpoints, UI routes, or infrastructure changes should be
implemented for this module yet.

## Future Phase - Magazine Platform Vision

Status: Planned future phase. Do not implement now.

Magazine Platform Vision defines a future digital magazine layer for publishing,
reading, audio, export, and rich editorial experiences. It is downstream from
the core translation workflow and must preserve JSON Master traceability,
language alignment, semantic fidelity, terminology governance, workflow review,
audit, and human final authority.

### Cross-References

- `ROADMAP.md`: Future Phase - Magazine Platform Vision.
- `FUTURE_MODULES.md`: Future Phase - Magazine Platform Vision.
- `docs/JSON_MASTER_FORMAT.md`: Magazine publication representation guidance.
- `AGENTS.md`: Magazine Platform Vision Directive.

### Non-Implementation Rule

This phase is specification-only until explicitly scheduled. No application
code, UI routes, database migrations, API endpoints, AI endpoints, or
infrastructure changes should be implemented for this module yet.
