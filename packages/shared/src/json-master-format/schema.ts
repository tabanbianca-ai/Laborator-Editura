import { JSON_MASTER_FORMAT_VERSION } from "./types.js";

export const JSON_MASTER_FORMAT_SCHEMA_ID =
  "https://laboratorul-editurii.local/schemas/json-master-format-1.0.schema.json";

export const jsonMasterFormatV1Schema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: JSON_MASTER_FORMAT_SCHEMA_ID,
  title: "JSON Master Format v1.0",
  type: "object",
  additionalProperties: false,
  required: [
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
  properties: {
    formatVersion: {
      const: JSON_MASTER_FORMAT_VERSION
    },
    project: {
      $ref: "#/$defs/project"
    },
    documents: {
      type: "array",
      items: {
        $ref: "#/$defs/document"
      }
    },
    terminology: {
      $ref: "#/$defs/terminology"
    },
    translationMemory: {
      $ref: "#/$defs/translationMemory"
    },
    qa: {
      $ref: "#/$defs/projectQa"
    },
    workflow: {
      $ref: "#/$defs/workflow"
    },
    audit: {
      $ref: "#/$defs/audit"
    },
    versionHistory: {
      $ref: "#/$defs/versionHistory"
    },
    mediaLocalization: {
      $ref: "#/$defs/mediaLocalization"
    }
  },
  $defs: {
    id: {
      type: "string",
      minLength: 1
    },
    timestamp: {
      type: "string",
      format: "date-time"
    },
    languageCode: {
      type: "string",
      pattern: "^[a-z]{2,3}(-[A-Za-z0-9]+)?$"
    },
    project: {
      type: "object",
      additionalProperties: false,
      required: [
        "id",
        "name",
        "sourceLanguage",
        "targetLanguages",
        "status",
        "createdAt",
        "updatedAt"
      ],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        name: {
          type: "string"
        },
        description: {
          type: "string"
        },
        sourceLanguage: {
          $ref: "#/$defs/languageCode"
        },
        targetLanguages: {
          type: "array",
          items: {
            $ref: "#/$defs/languageCode"
          }
        },
        domain: {
          type: "string"
        },
        status: {
          enum: ["draft", "active", "in_review", "approved", "published", "archived"]
        },
        createdAt: {
          $ref: "#/$defs/timestamp"
        },
        updatedAt: {
          $ref: "#/$defs/timestamp"
        },
        metadata: {
          type: "object",
          additionalProperties: true
        }
      }
    },
    document: {
      type: "object",
      additionalProperties: false,
      required: ["id", "projectId", "title", "sourceLanguage", "segments"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        projectId: {
          $ref: "#/$defs/id"
        },
        title: {
          type: "string"
        },
        sourceLanguage: {
          $ref: "#/$defs/languageCode"
        },
        documentType: {
          enum: [
            "book",
            "article",
            "technical_document",
            "subtitle_script",
            "media_transcript",
            "other"
          ]
        },
        segments: {
          type: "array",
          items: {
            $ref: "#/$defs/segment"
          }
        },
        metadata: {
          type: "object",
          additionalProperties: true
        }
      }
    },
    segment: {
      type: "object",
      additionalProperties: false,
      required: ["id", "order", "source", "translations", "status"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        order: {
          type: "integer",
          minimum: 0
        },
        source: {
          $ref: "#/$defs/sourceSegment"
        },
        translations: {
          type: "array",
          items: {
            $ref: "#/$defs/translation"
          }
        },
        terminologyRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        translationMemoryRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        qaRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        workflowState: {
          type: "string"
        },
        status: {
          enum: ["new", "in_translation", "translated", "in_review", "approved", "locked"]
        },
        mediaTiming: {
          $ref: "#/$defs/mediaTiming"
        },
        metadata: {
          type: "object",
          additionalProperties: true
        }
      }
    },
    sourceSegment: {
      type: "object",
      additionalProperties: false,
      required: ["text"],
      properties: {
        text: {
          type: "string"
        },
        normalizedText: {
          type: "string"
        },
        notes: {
          type: "array",
          items: {
            type: "string"
          }
        },
        structuralPath: {
          type: "string"
        }
      }
    },
    translation: {
      type: "object",
      additionalProperties: false,
      required: ["id", "language", "text", "status", "createdAt", "updatedAt"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        language: {
          $ref: "#/$defs/languageCode"
        },
        text: {
          type: "string"
        },
        status: {
          enum: [
            "draft",
            "machine_suggested",
            "human_edited",
            "reviewed",
            "approved",
            "rejected"
          ]
        },
        translatorId: {
          $ref: "#/$defs/id"
        },
        reviewerId: {
          $ref: "#/$defs/id"
        },
        qa: {
          $ref: "#/$defs/segmentQa"
        },
        provenance: {
          $ref: "#/$defs/provenance"
        },
        createdAt: {
          $ref: "#/$defs/timestamp"
        },
        updatedAt: {
          $ref: "#/$defs/timestamp"
        }
      }
    },
    provenance: {
      type: "object",
      additionalProperties: false,
      properties: {
        source: {
          enum: [
            "human",
            "ai",
            "translation_memory",
            "glossary",
            "dictionary",
            "corpus",
            "editorial_decision"
          ]
        },
        sourceRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        confidence: {
          type: "number",
          minimum: 0,
          maximum: 1
        },
        explanation: {
          type: "string"
        }
      }
    },
    terminology: {
      type: "object",
      additionalProperties: false,
      required: ["terms"],
      properties: {
        terms: {
          type: "array",
          items: {
            $ref: "#/$defs/term"
          }
        }
      }
    },
    term: {
      type: "object",
      additionalProperties: false,
      required: ["id", "sourceTerm", "language", "status"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        sourceTerm: {
          type: "string"
        },
        language: {
          $ref: "#/$defs/languageCode"
        },
        approvedTranslations: {
          type: "array",
          items: {
            $ref: "#/$defs/termTranslation"
          }
        },
        forbiddenTranslations: {
          type: "array",
          items: {
            type: "string"
          }
        },
        domain: {
          type: "string"
        },
        definition: {
          type: "string"
        },
        source: {
          enum: [
            "dictionary",
            "glossary",
            "translation_memory",
            "corpus",
            "editorial_decision",
            "ai"
          ]
        },
        status: {
          enum: [
            "proposed",
            "under_review",
            "validated",
            "suspended",
            "archived_historically"
          ]
        }
      }
    },
    termTranslation: {
      type: "object",
      additionalProperties: false,
      required: ["language", "text"],
      properties: {
        language: {
          $ref: "#/$defs/languageCode"
        },
        text: {
          type: "string"
        }
      }
    },
    translationMemory: {
      type: "object",
      additionalProperties: false,
      required: ["entries"],
      properties: {
        entries: {
          type: "array",
          items: {
            $ref: "#/$defs/translationMemoryEntry"
          }
        }
      }
    },
    translationMemoryEntry: {
      type: "object",
      additionalProperties: false,
      required: [
        "id",
        "sourceText",
        "targetText",
        "sourceLanguage",
        "targetLanguage"
      ],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        sourceText: {
          type: "string"
        },
        targetText: {
          type: "string"
        },
        sourceLanguage: {
          $ref: "#/$defs/languageCode"
        },
        targetLanguage: {
          $ref: "#/$defs/languageCode"
        },
        domain: {
          type: "string"
        },
        qualityScore: {
          type: "number",
          minimum: 0,
          maximum: 100
        },
        sourceDocumentId: {
          $ref: "#/$defs/id"
        }
      }
    },
    projectQa: {
      type: "object",
      additionalProperties: false,
      required: ["checks"],
      properties: {
        checks: {
          type: "array",
          items: {
            $ref: "#/$defs/qaCheck"
          }
        },
        scores: {
          $ref: "#/$defs/qaScores"
        }
      }
    },
    segmentQa: {
      type: "object",
      additionalProperties: false,
      properties: {
        checks: {
          type: "array",
          items: {
            $ref: "#/$defs/qaCheck"
          }
        },
        scores: {
          $ref: "#/$defs/qaScores"
        }
      }
    },
    qaCheck: {
      type: "object",
      additionalProperties: false,
      required: ["id", "type", "severity", "status"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        type: {
          enum: [
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
        severity: {
          enum: ["info", "warning", "error", "blocking"]
        },
        message: {
          type: "string"
        },
        status: {
          enum: ["open", "resolved", "accepted_risk", "false_positive"]
        }
      }
    },
    qaScores: {
      type: "object",
      additionalProperties: false,
      properties: {
        semanticFidelity: {
          type: "number",
          minimum: 0,
          maximum: 100
        },
        terminology: {
          type: "number",
          minimum: 0,
          maximum: 100
        },
        consistency: {
          type: "number",
          minimum: 0,
          maximum: 100
        },
        fluency: {
          type: "number",
          minimum: 0,
          maximum: 100
        },
        overall: {
          type: "number",
          minimum: 0,
          maximum: 100
        }
      }
    },
    workflow: {
      type: "object",
      additionalProperties: false,
      required: ["state", "events"],
      properties: {
        state: {
          enum: ["draft", "translation", "review", "approved", "published", "archived"]
        },
        assignments: {
          type: "array",
          items: {
            $ref: "#/$defs/assignment"
          }
        },
        events: {
          type: "array",
          items: {
            $ref: "#/$defs/workflowEvent"
          }
        }
      }
    },
    assignment: {
      type: "object",
      additionalProperties: false,
      required: ["userId", "role"],
      properties: {
        userId: {
          $ref: "#/$defs/id"
        },
        role: {
          enum: ["admin", "translator", "reviewer", "viewer", "expert"]
        }
      }
    },
    workflowEvent: {
      type: "object",
      additionalProperties: false,
      required: ["id", "type", "createdAt"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        type: {
          type: "string"
        },
        actorId: {
          $ref: "#/$defs/id"
        },
        createdAt: {
          $ref: "#/$defs/timestamp"
        },
        payload: {
          type: "object",
          additionalProperties: true
        }
      }
    },
    audit: {
      type: "object",
      additionalProperties: false,
      required: ["events"],
      properties: {
        events: {
          type: "array",
          items: {
            $ref: "#/$defs/auditEvent"
          }
        }
      }
    },
    auditEvent: {
      type: "object",
      additionalProperties: false,
      required: ["id", "action", "timestamp"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        actorId: {
          $ref: "#/$defs/id"
        },
        action: {
          type: "string"
        },
        entityType: {
          type: "string"
        },
        entityId: {
          $ref: "#/$defs/id"
        },
        before: {
          type: ["object", "null"],
          additionalProperties: true
        },
        after: {
          type: ["object", "null"],
          additionalProperties: true
        },
        timestamp: {
          $ref: "#/$defs/timestamp"
        }
      }
    },
    versionHistory: {
      type: "object",
      additionalProperties: false,
      required: ["versions"],
      properties: {
        versions: {
          type: "array",
          items: {
            $ref: "#/$defs/versionReference"
          }
        }
      }
    },
    versionReference: {
      type: "object",
      additionalProperties: false,
      required: ["id", "createdAt", "createdBy", "snapshotRef"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        createdAt: {
          $ref: "#/$defs/timestamp"
        },
        createdBy: {
          $ref: "#/$defs/id"
        },
        summary: {
          type: "string"
        },
        snapshotRef: {
          type: "string"
        },
        checksum: {
          type: "string"
        }
      }
    },
    mediaLocalization: {
      type: "object",
      additionalProperties: false,
      properties: {
        mediaAssets: {
          type: "array",
          items: {
            $ref: "#/$defs/mediaAsset"
          }
        },
        subtitleTracks: {
          type: "array",
          items: {
            $ref: "#/$defs/subtitleTrack"
          }
        },
        voiceOverTracks: {
          type: "array",
          items: {
            $ref: "#/$defs/audioTrack"
          }
        },
        dubbingTracks: {
          type: "array",
          items: {
            $ref: "#/$defs/audioTrack"
          }
        },
        localizedVideoExports: {
          type: "array",
          items: {
            $ref: "#/$defs/localizedVideoExport"
          }
        }
      }
    },
    mediaAsset: {
      type: "object",
      additionalProperties: false,
      required: ["id", "type", "uri"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        type: {
          enum: ["video", "audio", "subtitle", "transcript"]
        },
        uri: {
          type: "string"
        },
        durationMs: {
          type: "integer",
          minimum: 0
        },
        checksum: {
          type: "string"
        }
      }
    },
    mediaTiming: {
      type: "object",
      additionalProperties: false,
      properties: {
        startMs: {
          type: "integer",
          minimum: 0
        },
        endMs: {
          type: "integer",
          minimum: 0
        },
        speakerId: {
          $ref: "#/$defs/id"
        }
      }
    },
    subtitleTrack: {
      type: "object",
      additionalProperties: false,
      required: ["id", "language", "format", "segmentRefs"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        language: {
          $ref: "#/$defs/languageCode"
        },
        format: {
          enum: ["srt", "vtt", "ass"]
        },
        segmentRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        }
      }
    },
    audioTrack: {
      type: "object",
      additionalProperties: false,
      required: ["id", "language", "type", "uri"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        language: {
          $ref: "#/$defs/languageCode"
        },
        type: {
          enum: ["voice_over", "dubbing"]
        },
        uri: {
          type: "string"
        },
        sourceSegmentRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        syncQualityScore: {
          type: "number",
          minimum: 0,
          maximum: 100
        }
      }
    },
    localizedVideoExport: {
      type: "object",
      additionalProperties: false,
      required: ["id", "language", "uri", "createdAt"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        language: {
          $ref: "#/$defs/languageCode"
        },
        uri: {
          type: "string"
        },
        subtitleTrackId: {
          $ref: "#/$defs/id"
        },
        audioTrackId: {
          $ref: "#/$defs/id"
        },
        createdAt: {
          $ref: "#/$defs/timestamp"
        }
      }
    }
  }
} as const;
