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
- Documents.
- Segments.
- Metadata.
- Terminology.
- QA.
- Workflow.
- Versions.
- Future media localization.

All platform data that must survive export, backup, audit, migration, or
publishing must be representable in JSON Master Format.

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
project, document, segment, translation, term, QA result, workflow event, audit
entry, version snapshot, and future media localization asset must be representable
from this format.

No exported file format can become the source of truth. PDF, EPUB, HTML, print,
subtitle files, dubbed media, voice-over tracks, and localized videos must be
generated from, or traced back to, JSON Master Format.

### Scope

JSON Master Format v1.0 supports:

- Projects and project metadata.
- Documents and document metadata.
- Segment-based source text.
- Translations per target language.
- Terminology and glossary references.
- Translation Memory references and matches.
- QA results and semantic fidelity checks.
- Workflow state, assignments, approvals, and review status.
- Audit logs.
- Version history and immutable snapshots.
- Future subtitle translation, voice-over, dubbing, and localized video exports.

### Core Rules

- `formatVersion` must be `1.0`.
- `project.id`, `documents[].id`, and `segments[].id` must be stable IDs.
- Source content must never be overwritten by target translations.
- Each translation must keep language, status, author, timestamps, QA, and
  provenance metadata.
- Segment order must be explicit.
- Terminology decisions must be traceable to glossary, dictionary, corpus,
  editorial decision, or AI suggestion.
- Workflow and audit events must be append-only.
- Version history must preserve immutable snapshots or snapshot references.
- Media localization data is optional in v1.0 but reserved in the schema for
  subtitle, voice-over, dubbing, synchronization, and localized video export.

### Top-Level Structure

Required top-level keys:

- `formatVersion`
- `project`
- `documents`
- `terminology`
- `translationMemory`
- `qa`
- `workflow`
- `audit`
- `versionHistory`

Optional top-level key reserved for future phases:

- `mediaLocalization`

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
    "documents",
    "terminology",
    "translationMemory",
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
    }
  },
  "$defs": {
    "id": {
      "type": "string",
      "minLength": 1
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
        "durationMs": {
          "type": "integer",
          "minimum": 0
        },
        "checksum": {
          "type": "string"
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

## Future Phase - Video Localization & Media Studio

Status: Future Phase. Do not implement now.

The platform will include a future media localization subsystem for translating,
adapting, dubbing, subtitling, synchronizing, and exporting localized video
content. This module extends the translation platform into multimedia workflows
while preserving the same principles of semantic fidelity, terminology control,
traceability, and professional review.

### Capabilities

- Automatic Speech-to-Text: transcribe source audio and video into editable text.
- Subtitle Management: create, import, edit, validate, and export subtitles in
  SRT, VTT, and ASS formats.
- Subtitle Translation: translate subtitle segments while preserving timing,
  context, terminology, and reading speed.
- AI Voice-Over: generate localized narration from translated scripts.
- AI Dubbing: produce localized dialogue aligned with speaker timing and intent.
- Audio-Video Synchronization: align translated audio, subtitles, timing, and
  visual cues.
- Localized Video Export: export localized video with selected subtitle, dubbing,
  voice-over, and audio settings.
- Media Localization QA: detect subtitle timing issues, missing subtitles,
  terminology violations, reading-speed problems, audio drift, and sync errors.
- Workflow Integration: connect media localization tasks with projects, roles,
  review, audit, terminology, Translation Memory, and publishing workflows.

### Architectural Position

Video Localization & Media Studio is a future subsystem, not part of the current
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
