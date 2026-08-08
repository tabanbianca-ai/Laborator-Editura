import { JSON_MASTER_FORMAT_VERSION } from "./types";

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
    masterDocuments: {
      type: "array",
      items: {
        $ref: "#/$defs/editorialRecord"
      }
    },
    editorialVersions: {
      type: "array",
      items: {
        $ref: "#/$defs/editorialRecord"
      }
    },
    editorialComments: {
      type: "array",
      items: {
        $ref: "#/$defs/editorialRecord"
      }
    },
    editorialSuggestions: {
      type: "array",
      items: {
        $ref: "#/$defs/editorialRecord"
      }
    },
    correctionFindings: {
      type: "array",
      items: {
        $ref: "#/$defs/editorialRecord"
      }
    },
    editorialApprovals: {
      type: "array",
      items: {
        $ref: "#/$defs/editorialRecord"
      }
    },
    editorialAiExecutions: {
      type: "array",
      items: {
        $ref: "#/$defs/editorialRecord"
      }
    },
    mediaLocalization: {
      $ref: "#/$defs/mediaLocalization"
    },
    layout: {
      $ref: "#/$defs/layout"
    },
    pageTemplates: {
      type: "array",
      items: {
        $ref: "#/$defs/pageTemplate"
      }
    },
    printProfiles: {
      type: "array",
      items: {
        $ref: "#/$defs/printProfile"
      }
    },
    illustrations: {
      type: "array",
      items: {
        $ref: "#/$defs/illustration"
      }
    },
    audioTracks: {
      type: "array",
      items: {
        $ref: "#/$defs/productionAudioTrack"
      }
    },
    videoAssets: {
      type: "array",
      items: {
        $ref: "#/$defs/productionVideoAsset"
      }
    },
    publicationProfiles: {
      type: "array",
      items: {
        $ref: "#/$defs/publicationProfile"
      }
    },
    mediaAssets: {
      type: "array",
      items: {
        $ref: "#/$defs/creationMediaAsset"
      }
    },
    illustrationProjects: {
      type: "array",
      items: {
        $ref: "#/$defs/illustrationProject"
      }
    },
    audioProjects: {
      type: "array",
      items: {
        $ref: "#/$defs/audioProject"
      }
    },
    videoProjects: {
      type: "array",
      items: {
        $ref: "#/$defs/videoProject"
      }
    },
    voiceProfiles: {
      type: "array",
      items: {
        $ref: "#/$defs/voiceProfile"
      }
    },
    subtitleTracks: {
      type: "array",
      items: {
        $ref: "#/$defs/productionSubtitleTrack"
      }
    },
    localizedIllustrations: {
      type: "array",
      items: {
        $ref: "#/$defs/localizedIllustration"
      }
    },
    localizedVideos: {
      type: "array",
      items: {
        $ref: "#/$defs/localizedVideo"
      }
    },
    localizedAudio: {
      type: "array",
      items: {
        $ref: "#/$defs/localizedAudio"
      }
    },
    voiceOverTracks: {
      type: "array",
      items: {
        $ref: "#/$defs/localizedAudio"
      }
    },
    dubbingProjects: {
      type: "array",
      items: {
        $ref: "#/$defs/dubbingProject"
      }
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
    editorialRecord: {
      type: "object",
      additionalProperties: true
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
        originalLanguage: {
          $ref: "#/$defs/languageCode"
        },
        originalLocale: {
          $ref: "#/$defs/languageCode"
        },
        targetLanguages: {
          type: "array",
          items: {
            $ref: "#/$defs/languageCode"
          }
        },
        targetLocales: {
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
        originalLanguage: {
          $ref: "#/$defs/languageCode"
        },
        originalLocale: {
          $ref: "#/$defs/languageCode"
        },
        authoringLanguage: {
          $ref: "#/$defs/languageCode"
        },
        authoringLocale: {
          $ref: "#/$defs/languageCode"
        },
        targetLanguage: {
          $ref: "#/$defs/languageCode"
        },
        targetLocale: {
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
        targetLanguage: {
          $ref: "#/$defs/languageCode"
        },
        targetLocale: {
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
        },
        localizedIllustrations: {
          type: "array",
          items: {
            $ref: "#/$defs/localizedIllustration"
          }
        },
        localizedVideos: {
          type: "array",
          items: {
            $ref: "#/$defs/localizedVideo"
          }
        },
        localizedAudio: {
          type: "array",
          items: {
            $ref: "#/$defs/localizedAudio"
          }
        },
        dubbingProjects: {
          type: "array",
          items: {
            $ref: "#/$defs/dubbingProject"
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
    },
    layout: {
      type: "object",
      additionalProperties: false,
      required: ["id", "layoutVersion", "styleRevision", "publicationKind", "approvalStatus"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        layoutVersion: {
          type: "integer",
          minimum: 1
        },
        styleRevision: {
          type: "integer",
          minimum: 1
        },
        publicationKind: {
          enum: ["book", "magazine"]
        },
        documentRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        pageTemplateRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        printProfileRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        publicationProfileRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        approvedBy: {
          $ref: "#/$defs/id"
        },
        approvedAt: {
          $ref: "#/$defs/timestamp"
        },
        approvalStatus: {
          enum: ["pending_human_approval", "approved", "rejected"]
        }
      }
    },
    pageTemplate: {
      type: "object",
      additionalProperties: false,
      required: ["id", "name"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        name: {
          type: "string"
        },
        pageSize: {
          type: "string"
        },
        margins: {
          type: "string"
        },
        columns: {
          type: "integer",
          minimum: 1
        },
        bleed: {
          type: "string"
        }
      }
    },
    printProfile: {
      type: "object",
      additionalProperties: false,
      required: ["id", "name", "format"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        name: {
          type: "string"
        },
        format: {
          enum: ["pdf_x", "hardcover", "paperback", "print_on_demand"]
        },
        colorProfile: {
          type: "string"
        },
        bleed: {
          type: "string"
        },
        cropMarks: {
          type: "boolean"
        }
      }
    },
    illustration: {
      type: "object",
      additionalProperties: false,
      required: ["id", "uri"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        uri: {
          type: "string"
        },
        caption: {
          type: "string"
        },
        altText: {
          type: "string"
        },
        documentRef: {
          $ref: "#/$defs/id"
        },
        segmentRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        }
      }
    },
    productionAudioTrack: {
      type: "object",
      additionalProperties: false,
      required: ["id", "language", "uri", "type"],
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
        type: {
          enum: ["audio_chapter", "synchronized_narration"]
        },
        chapterRef: {
          $ref: "#/$defs/id"
        },
        syncQualityScore: {
          type: "number",
          minimum: 0,
          maximum: 100
        }
      }
    },
    productionVideoAsset: {
      type: "object",
      additionalProperties: false,
      required: ["id", "uri", "type"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        uri: {
          type: "string"
        },
        type: {
          enum: ["video_asset", "trailer", "gallery_video"]
        },
        language: {
          $ref: "#/$defs/languageCode"
        },
        documentRef: {
          $ref: "#/$defs/id"
        }
      }
    },
    publicationProfile: {
      type: "object",
      additionalProperties: false,
      required: ["id", "name", "formats", "humanApprovalRequired"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        name: {
          type: "string"
        },
        formats: {
          type: "array",
          items: {
            enum: ["json_master", "pdf", "epub", "mobi", "hardcover", "paperback", "print_on_demand"]
          }
        },
        humanApprovalRequired: {
          const: true
        },
        approvedBy: {
          $ref: "#/$defs/id"
        },
        approvedAt: {
          $ref: "#/$defs/timestamp"
        }
      }
    },
    creationMediaAsset: {
      type: "object",
      additionalProperties: false,
      required: ["id", "type", "approvalStatus"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        type: {
          enum: ["image", "audio", "video", "subtitle"]
        },
        uri: {
          type: "string"
        },
        language: {
          $ref: "#/$defs/languageCode"
        },
        sourceRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        rights: {
          type: "object",
          additionalProperties: true
        },
        versionRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        approvalStatus: {
          enum: ["pending_human_approval", "approved", "rejected"]
        }
      }
    },
    illustrationProject: {
      type: "object",
      additionalProperties: false,
      required: ["id", "title", "language", "humanApprovalRequired", "approvalStatus"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        title: {
          type: "string"
        },
        language: {
          $ref: "#/$defs/languageCode"
        },
        projectRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        documentRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        stylePresets: {
          type: "array",
          items: {
            type: "string"
          }
        },
        mediaAssetRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        humanApprovalRequired: {
          const: true
        },
        approvalStatus: {
          enum: ["pending_human_approval", "approved", "rejected"]
        }
      }
    },
    audioProject: {
      type: "object",
      additionalProperties: false,
      required: ["id", "title", "language", "humanApprovalRequired", "approvalStatus"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        title: {
          type: "string"
        },
        language: {
          $ref: "#/$defs/languageCode"
        },
        projectRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        documentRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        voiceProfileRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        mediaAssetRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        exportTargets: {
          type: "array",
          items: {
            enum: ["mp3", "wav", "flac"]
          }
        },
        humanApprovalRequired: {
          const: true
        },
        approvalStatus: {
          enum: ["pending_human_approval", "approved", "rejected"]
        }
      }
    },
    videoProject: {
      type: "object",
      additionalProperties: false,
      required: ["id", "title", "language", "humanApprovalRequired", "approvalStatus"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        title: {
          type: "string"
        },
        language: {
          $ref: "#/$defs/languageCode"
        },
        projectRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        documentRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        subtitleTrackRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        mediaAssetRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        humanApprovalRequired: {
          const: true
        },
        approvalStatus: {
          enum: ["pending_human_approval", "approved", "rejected"]
        }
      }
    },
    voiceProfile: {
      type: "object",
      additionalProperties: false,
      required: ["id", "name", "language"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        name: {
          type: "string"
        },
        language: {
          $ref: "#/$defs/languageCode"
        },
        profileRef: {
          type: "string"
        },
        approvalStatus: {
          enum: ["pending_human_approval", "approved", "rejected"]
        }
      }
    },
    productionSubtitleTrack: {
      type: "object",
      additionalProperties: false,
      required: ["id", "language", "format"],
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
        mediaAssetRef: {
          $ref: "#/$defs/id"
        },
        segmentRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        syncStatus: {
          enum: ["draft", "aligned", "human_review_required", "approved"]
        }
      }
    },
    localizedIllustration: {
      type: "object",
      additionalProperties: false,
      required: ["id", "language", "approvalStatus"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        sourceIllustrationRef: {
          $ref: "#/$defs/id"
        },
        language: {
          $ref: "#/$defs/languageCode"
        },
        uri: {
          type: "string"
        },
        textRegionRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        typographyStyle: {
          type: "string"
        },
        approvalStatus: {
          enum: ["pending_human_approval", "approved", "rejected"]
        }
      }
    },
    localizedVideo: {
      type: "object",
      additionalProperties: false,
      required: ["id", "language", "approvalStatus"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        sourceVideoRef: {
          $ref: "#/$defs/id"
        },
        language: {
          $ref: "#/$defs/languageCode"
        },
        uri: {
          type: "string"
        },
        subtitleTrackRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        audioTrackRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        approvalStatus: {
          enum: ["pending_human_approval", "approved", "rejected"]
        }
      }
    },
    localizedAudio: {
      type: "object",
      additionalProperties: false,
      required: ["id", "language", "type", "approvalStatus"],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        sourceAudioRef: {
          $ref: "#/$defs/id"
        },
        language: {
          $ref: "#/$defs/languageCode"
        },
        uri: {
          type: "string"
        },
        type: {
          enum: ["voice_over", "dubbing", "localized_audio"]
        },
        synchronizationMetadata: {
          type: "object",
          additionalProperties: {
            type: "string"
          }
        },
        approvalStatus: {
          enum: ["pending_human_approval", "approved", "rejected"]
        }
      }
    },
    dubbingProject: {
      type: "object",
      additionalProperties: false,
      required: [
        "id",
        "title",
        "sourceLanguage",
        "targetLanguage",
        "humanApprovalRequired",
        "approvalStatus"
      ],
      properties: {
        id: {
          $ref: "#/$defs/id"
        },
        title: {
          type: "string"
        },
        sourceLanguage: {
          $ref: "#/$defs/languageCode"
        },
        targetLanguage: {
          $ref: "#/$defs/languageCode"
        },
        narratorProfileRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        voiceTrackRefs: {
          type: "array",
          items: {
            $ref: "#/$defs/id"
          }
        },
        synchronizationMetadata: {
          type: "object",
          additionalProperties: {
            type: "string"
          }
        },
        humanApprovalRequired: {
          const: true
        },
        approvalStatus: {
          enum: ["pending_human_approval", "approved", "rejected"]
        }
      }
    }
  }
} as const;
