# JSON Master Format Documentation

Status: Documentation only. Do not implement code from this document until the
corresponding backend phase is explicitly approved.

## Manuscript Language Organization

A book project may contain multiple language-specific manuscripts linked to the
same original work.

Example:

- Book project: shared original work.
- Original manuscript: French.
- Romanian manuscript.
- Spanish manuscript.

## Required Manuscript Fields

Each manuscript must contain:

- `manuscriptId`: stable manuscript identifier.
- `language`: manuscript language.
- `sourceManuscriptId`: required when the manuscript is a translation.
- `title`: language-specific manuscript title.
- `chapters`: ordered chapter structure for that language.
- `segments`: ordered manuscript segments for that language.
- `translationStatus`: translation lifecycle state for the manuscript.
- `workflowStatus`: workflow state for the manuscript.
- `exportArtifacts`: language-specific export outputs.
- `ruleVersionRefs`: translation rule versions used by the manuscript.

## Rules

- Each language manuscript must be exportable separately.
- All manuscripts for a book must remain linked to the same original work and
  project.
- The original manuscript does not require `sourceManuscriptId`.
- Translated manuscripts must preserve `sourceManuscriptId`.
- Translation alignment between source and target segments must be preserved.
- Segment alignment must use stable `sourceSegmentId` references or alignment
  keys.
- Export artifacts must be tracked per manuscript language.
- Each manuscript and export artifact must record the translation rule version
  or versions used.
- Original language must be configurable per publication and must never be
  hard-coded.
- Future magazine translations, article audio, and magazine exports must remain
  linked to the same original publication.
- Magazine article alignment must remain auditable through source manuscript,
  source article, source segment, or stable alignment references.
- Future media localization must preserve configurable original language,
  language-specific media versions, original media links, and source
  manuscript/article/book/project links.

## Magazine Publication Representation

Magazine Platform Vision is a future documentation-only requirement. JSON
Master must be able to represent future magazine publication data without making
PDF, HTML, flipbook, audio, or mobile application outputs the source of truth.

Required future representation concepts:

- `publicationId`: stable magazine publication identifier.
- `originalLanguage`: configurable original language for the publication.
- `originalPublicationRef`: reference to the original publication or source
  manuscript.
- `articleId`: stable article identifier.
- `sourceArticleId`: required when an article is translated.
- `language`: article language.
- `sourceManuscriptId`: manuscript source when the article derives from a
  manuscript.
- `sourceSegmentRefs`: segment or alignment references used for auditability.
- `audioRefs`: article-level audio versions linked to the same original
  publication.
- `exportArtifacts`: language-specific PDF, HTML, and future flipbook exports.

Rules:

- The original language may be English, Romanian, Spanish, French, Italian,
  Portuguese, German, or any supported language.
- Original language is never hard-coded in JSON Master.
- Every translated article remains linked to the original publication.
- Every audio version remains linked to the original publication.
- Translation alignment remains auditable across source articles, translated
  articles, manuscripts, and segments.
- Magazine reader features such as flipbook reading, search, language switching,
  article audio, bookmarks, notes, and rich media are future consumers of JSON
  Master data, not sources of truth.
- This section does not change runtime validators, database schema, APIs, UI, or
  migrations.

## Media Localization Studio Representation

Media Localization Studio is a future documentation-only requirement for basic
editorial media localization. It is not a full Adobe Premiere replacement and is
not a professional non-linear video editing, compositing, transition, visual
effects, or color-grading system.

Required future representation concepts:

- `mediaAssetId`: stable video or audio asset identifier.
- `originalMediaAssetId`: required for localized media derived from source
  media.
- `originalLanguage`: configurable original language for the media asset.
- `language`: language of the transcript, subtitle, voice-over, dubbing track,
  audio export, or localized video export.
- `projectId`: project linked to the media asset.
- `bookId`: book or original work linked to the media asset when applicable.
- `manuscriptId`: manuscript linked to the media asset when applicable.
- `articleId`: article linked to the media asset when applicable.
- `transcripts`: source, corrected, translated, and approved transcript
  references.
- `subtitleTracks`: SRT, VTT, and ASS subtitle tracks per language.
- `audioTracks`: multilingual voice-over and simple AI dubbing tracks.
- `mediaVersions`: language-specific media versions linked to original media.
- `localizedVideoExports`: generated localized video outputs.
- `syncRefs`: text/audio/video synchronization references.

Included future capabilities:

- Video and audio upload.
- Automatic transcript generation.
- Transcript correction.
- Transcript translation.
- Subtitle generation.
- Subtitle formats: SRT, VTT, and ASS.
- Multilingual subtitles.
- Multilingual voice-over.
- Simple AI dubbing.
- Audio export.
- Transcript export.
- Localized video export.
- Text, audio, and video synchronization.

Excluded capabilities:

- Advanced video editing.
- Color grading.
- Complex timeline editing.
- Visual effects.
- Advanced transitions.
- Professional compositing.

Rules:

- Original language must be configurable and never hard-coded.
- Every transcript, subtitle, audio track, dubbing track, and localized video
  export must remain linked to the original media asset.
- Media assets must remain linked to the original manuscript, article, book, or
  project when applicable.
- Language-specific media versions must preserve auditable alignment to the
  original media and source text.
- Transcript and subtitle translations must follow terminology, QA, Semantic
  Fidelity, and global translation rules.
- Human final authority remains required for localized media release approval.
- This section does not change runtime validators, database schema, APIs, UI, or
  migrations.

## Phase 2 Future Agent Representation

Phase 2 Planning Foundation is a future documentation-only requirement for
editorial intelligence, layout production, visual creation, audio narration,
platform coordination, and AI orchestration.

Reserved future top-level fields:

- `dictionaries`: dictionary sources, bilingual dictionaries, monolingual
  dictionaries, DEX, DOOM, DLR, the Spanish-Romanian and Romanian-Spanish
  dictionary by Alexandru Calciu and Zaira Samharadze, specialized spiritist
  dictionaries, dictionary entries, lexical senses, examples, sources, and
  citations.
- `layout`: book layout, magazine layout, print finishing, typography checks,
  page geometry, margins, bleed, crop marks, widows and orphans, PDF/X, EPUB,
  MOBI, and flipbook production references.
- `visualAssets`: generated or edited images, covers, illustrations, trailers,
  visual localization assets, source references, rights metadata, approval
  state, and audit references.
- `audioTracks`: audiobook chapters, text-to-speech outputs, voice profiles,
  multilingual narration, MP3, WAV, and FLAC export references.
- `videoAssets`: text-to-video outputs, image-to-video outputs, trailer
  outputs, subtitle-linked video assets, and visual localization outputs.
- `productionProfiles`: European default production formats, optional American
  formats, print profiles, digital profiles, PDF/X profiles, EPUB, MOBI, and
  flipbook profiles.
- `agentExecutions`: AI Orchestrator and agent execution records, including
  agent type, input refs, output refs, dependencies, execution order, cost
  metadata when available, status, human approval state, and audit refs.

Reserved Phase 2 agent types:

- Lexicographic Intelligence Agent.
- Layout & Editorial Production Agent.
- AI Video & Visual Creation Agent.
- Audio Narration Agent.
- Platform Engineering, Optimization & Coordination Agent.
- AI Orchestrator.

Glossary priority rules for dictionary intelligence:

1. Validated platform glossary.
2. Documented editorial decision.
3. Specialized dictionary.
4. Academic dictionary.
5. AI suggestion.

Rules:

- AI may suggest and automate drafts, but authorized human roles keep final
  approval authority.
- Every Phase 2 agent action must be auditable.
- Agent outputs must remain linked to source manuscripts, articles, books,
  projects, media assets, language versions, production profiles, or dictionary
  sources as applicable.
- The AI Orchestrator must preserve execution order, dependencies, cost
  metadata when available, audit trails, and human approval gates.
- Phase 2 data is optional future JSON Master data and does not authorize
  runtime validators, database schema, APIs, UI, migrations, or staging
  infrastructure changes.

## Integrated Linguistic Knowledge Base Representation

Phase 7 Step 11 extends the existing dictionary and lexicographic data model
into a project-level linguistic knowledge base. JSON Master consumers should be
able to preserve linguistic source metadata, searchable lexical entries when
licensed, source consultation references, conflict reports, and human decisions.

Recommended optional fields:

- `linguisticKnowledgeBase`: project-level linguistic resource registry.
- `linguisticResources`: monolingual dictionaries, bilingual dictionaries,
  orthographic/orthoepic/morphological dictionaries, grammar and punctuation
  rules, idiom and phraseological resources, specialized glossaries,
  terminology databases, editorial guides, corpora, and usage examples.
- `linguisticEntries`: licensed searchable entries containing headword,
  definition, senses, grammatical category, inflection, pronunciation, usage
  labels, examples, idioms, synonyms, antonyms, etymology, bilingual
  equivalents, source reference, and exact edition.
- `linguisticSourceConsultations`: source IDs, entry IDs, edition references,
  authority level, language, language pair, project/document/segment refs, and
  agent action that consulted the source.
- `linguisticConflicts`: conflicting definitions, source authorities, affected
  terms, required human review, and final human decision refs.
- `linguisticAuditRefs`: audit event references for resource added, resource
  updated, license changed, entry imported, source consulted, terminology
  decision, dictionary conflict, human override, and resource disabled.

Resource metadata fields:

- `resourceId`.
- `projectId`.
- `language`.
- `languagePair`.
- `title`.
- `publisherOrInstitution`.
- `edition`.
- `publicationYear`.
- `version`.
- `sourceUrl`.
- `importedDocumentRef`.
- `licenseStatus`.
- `copyrightHolder`.
- `redistributionPermission`.
- `authorityLevel`.
- `domain`.
- `effectiveDate`.
- `lastVerificationDate`.
- `enabled`.
- `accessMode`.
- `authorizedApiIntegration`.
- `officialLink`.
- `permittedExcerpts`.
- `accessRestrictions`.
- `licenseNotes`.

Access rules:

- `INTEGRATED_CONTENT` may include searchable linguistic entries only when
  ingestion and internal use are documented as permitted.
- `EXTERNAL_CONTROLLED_ACCESS` must preserve metadata, official links,
  authorized integration references, permitted excerpts, restrictions, and
  notes only.
- Full copyrighted dictionary content must not be stored in JSON Master unless
  authorization is documented.

Authority levels:

1. `OFFICIAL_NORMATIVE`.
2. `ACADEMIC`.
3. `VALIDATED_SPECIALIZED`.
4. `EDITORIAL_GUIDE`.
5. `DESCRIPTIVE`.
6. `INFORMATIVE`.

Conflict handling:

- Normative sources take priority for orthography and grammar.
- Validated specialized sources may take priority for domain terminology.
- Conflicts must remain auditable and require authorized human review.
- AI output is never source authority and cannot silently replace a validated
  glossary, rule, or human-approved decision.

## Translation Rules Versioning

Every translation rule must be versioned.

Rules:

- Rules cannot be overwritten.
- Every rule change creates a new version.
- Previous rule versions remain auditable.
- Manuscripts must record the rule versions used during translation.
- Export artifacts must record the rule versions used at export time.
- The platform should be able to identify publications translated under older
  rule versions.

## Rule Change Impact Analysis

Before approving a rule change, the system must calculate an impact report
covering:

- Affected books.
- Affected manuscripts.
- Affected languages.
- Affected chapters.
- Affected segments.
- Affected terminology entries.
- Affected exports.

Rule changes affecting existing publications must require authorized approval.

Audit records for rule changes must store:

- Previous rule version.
- New rule version.
- Approver.
- Date/time.
- Impact report.

## Rule Source Authority

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

## Authority Confidence Levels

Authority confidence levels rank source authorities when rules or exceptions
have conflicting sources.

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

## Documentation Schema Shape

```json
{
  "project": {
    "id": "book-project-001",
    "name": "Example Book Project",
    "sourceLanguage": "fr",
    "targetLanguages": ["ro", "es"]
  },
  "manuscripts": [
    {
      "manuscriptId": "manuscript-fr-original",
      "language": "fr",
      "title": "Original French Manuscript",
      "chapters": [],
      "segments": [],
      "translationStatus": "original",
      "workflowStatus": "APPROVED",
      "ruleVersionRefs": ["rule-version-fidelity-001"],
      "exportArtifacts": []
    },
    {
      "manuscriptId": "manuscript-ro",
      "language": "ro",
      "sourceManuscriptId": "manuscript-fr-original",
      "title": "Romanian Manuscript",
      "chapters": [],
      "segments": [
        {
          "segmentId": "segment-ro-001",
          "sourceSegmentId": "segment-fr-001",
          "alignmentKey": "chapter-1.segment-1",
          "order": 0,
          "text": "Text tradus in romana.",
          "status": "translated"
        }
      ],
      "translationStatus": "translated",
      "workflowStatus": "IN_REVIEW",
      "ruleVersionRefs": ["rule-version-fidelity-001"],
      "exportArtifacts": [
        {
          "artifactId": "export-ro-json-001",
          "language": "ro",
          "format": "json_master",
          "uri": "exports/ro/book.json",
          "ruleVersionRefs": ["rule-version-fidelity-001"]
        }
      ]
    },
    {
      "manuscriptId": "manuscript-es",
      "language": "es",
      "sourceManuscriptId": "manuscript-fr-original",
      "title": "Spanish Manuscript",
      "chapters": [],
      "segments": [],
      "translationStatus": "in_translation",
      "workflowStatus": "IN_TRANSLATION",
      "ruleVersionRefs": ["rule-version-fidelity-001"],
      "exportArtifacts": []
    }
  ],
  "translationRules": {
    "rules": [
      {
        "ruleId": "rule-semantic-fidelity",
        "currentVersionId": "rule-version-fidelity-002",
        "versions": [
          {
            "ruleVersionId": "rule-version-fidelity-001",
            "versionNumber": 1,
            "status": "superseded",
            "sourceAuthorityRefs": ["authority-esprit-spirit-kardec-1860"],
            "content": {
              "principle": "Preserve meaning, intent, context, and terminology."
            }
          },
          {
            "ruleVersionId": "rule-version-fidelity-002",
            "previousRuleVersionId": "rule-version-fidelity-001",
            "versionNumber": 2,
            "status": "active",
            "sourceAuthorityRefs": ["authority-esprit-spirit-kardec-1860"],
            "content": {
              "principle": "Preserve meaning, intent, context, terminology, and authorized editorial decisions.",
              "rule": "Esprit -> Spirit"
            }
          }
        ]
      }
    ],
    "sourceAuthorities": [
      {
        "sourceAuthorityId": "authority-esprit-spirit-kardec-1860",
        "ruleId": "rule-semantic-fidelity",
        "ruleVersion": "2",
        "sourceType": "Original Author",
        "sourceReference": "Allan Kardec",
        "sourceDetails": "Le Livre des Esprits, 1860 edition",
        "sourceLanguage": "fr",
        "sourcePublicationYear": 1860,
        "sourcePageOrSection": "Chapter I",
        "approvalAuthority": "Editorial Board",
        "approvalDate": "2026-06-14T00:00:00.000Z",
        "authorityConfidenceLevel": "PRIMARY_AUTHORITY",
        "immutable": true,
        "aiGenerated": false
      }
    ],
    "impactReports": [
      {
        "impactReportId": "impact-rule-fidelity-002",
        "ruleId": "rule-semantic-fidelity",
        "previousRuleVersionId": "rule-version-fidelity-001",
        "newRuleVersionId": "rule-version-fidelity-002",
        "affectedBooks": ["book-project-001"],
        "affectedManuscripts": ["manuscript-ro", "manuscript-es"],
        "affectedLanguages": ["ro", "es"],
        "affectedChapters": [],
        "affectedSegments": ["segment-ro-001"],
        "affectedTerminologyEntries": [],
        "affectedSourceAuthorities": ["authority-esprit-spirit-kardec-1860"],
        "affectedAuthorityConfidenceLevels": ["PRIMARY_AUTHORITY"],
        "affectedExports": ["export-ro-json-001"]
      }
    ],
    "changeApprovals": [
      {
        "approvalId": "approval-rule-fidelity-002",
        "ruleId": "rule-semantic-fidelity",
        "previousRuleVersionId": "rule-version-fidelity-001",
        "newRuleVersionId": "rule-version-fidelity-002",
        "sourceAuthorityRefs": ["authority-esprit-spirit-kardec-1860"],
        "approverId": "reviewer-001",
        "approvedAt": "2026-06-14T00:00:00.000Z",
        "impactReportId": "impact-rule-fidelity-002"
      }
    ],
    "exceptions": [
      {
        "exceptionId": "exception-esprit-contextual-001",
        "ruleId": "rule-semantic-fidelity",
        "ruleVersion": "2",
        "reason": "Contextual use requires preserving the author's intended spiritualist terminology.",
        "sourceAuthorityRefs": ["authority-esprit-spirit-kardec-1860"],
        "status": "validated",
        "approvedBy": "reviewer-001",
        "approvedAt": "2026-06-14T00:00:00.000Z"
      }
    ]
  },
  "mediaLocalization": {
    "mediaAssets": [
      {
        "mediaAssetId": "media-fr-video-001",
        "type": "video",
        "originalLanguage": "fr",
        "language": "fr",
        "projectId": "book-project-001",
        "bookId": "book-001",
        "manuscriptId": "manuscript-fr-original",
        "uri": "media/fr/original.mp4"
      }
    ],
    "transcripts": [
      {
        "transcriptId": "transcript-fr-001",
        "mediaAssetId": "media-fr-video-001",
        "originalMediaAssetId": "media-fr-video-001",
        "language": "fr",
        "status": "corrected",
        "segmentRefs": ["segment-fr-001"]
      },
      {
        "transcriptId": "transcript-ro-001",
        "mediaAssetId": "media-fr-video-001",
        "originalMediaAssetId": "media-fr-video-001",
        "sourceTranscriptId": "transcript-fr-001",
        "language": "ro",
        "status": "translated",
        "segmentRefs": ["segment-ro-001"]
      }
    ],
    "subtitleTracks": [
      {
        "subtitleTrackId": "subtitle-ro-srt-001",
        "originalMediaAssetId": "media-fr-video-001",
        "sourceTranscriptId": "transcript-ro-001",
        "language": "ro",
        "format": "srt",
        "segmentRefs": ["segment-ro-001"]
      }
    ],
    "audioTracks": [
      {
        "audioTrackId": "voiceover-ro-001",
        "originalMediaAssetId": "media-fr-video-001",
        "language": "ro",
        "type": "voice_over",
        "uri": "media/ro/voiceover.mp3",
        "sourceSegmentRefs": ["segment-ro-001"]
      }
    ],
    "mediaVersions": [
      {
        "mediaVersionId": "media-version-ro-001",
        "originalMediaAssetId": "media-fr-video-001",
        "language": "ro",
        "transcriptId": "transcript-ro-001",
        "subtitleTrackIds": ["subtitle-ro-srt-001"],
        "audioTrackIds": ["voiceover-ro-001"]
      }
    ],
    "localizedVideoExports": [
      {
        "exportId": "localized-video-ro-001",
        "originalMediaAssetId": "media-fr-video-001",
        "mediaVersionId": "media-version-ro-001",
        "language": "ro",
        "uri": "exports/ro/localized-video.mp4"
      }
    ]
  },
  "dictionaries": {
    "sources": [
      {
        "dictionarySourceId": "dict-calciu-samharadze-es-ro",
        "type": "bilingual_dictionary",
        "title": "Spanish-Romanian / Romanian-Spanish Dictionary",
        "authors": ["Alexandru Calciu", "Zaira Samharadze"],
        "sourceLanguages": ["es", "ro"],
        "citationRequired": true
      }
    ],
    "entries": [
      {
        "entryId": "dict-entry-es-ro-001",
        "dictionarySourceId": "dict-calciu-samharadze-es-ro",
        "term": "espiritu",
        "language": "es",
        "lexicalSenses": [],
        "examples": [],
        "citations": []
      }
    ]
  },
  "layout": {
    "layoutJobs": [
      {
        "layoutJobId": "layout-ro-print-001",
        "manuscriptId": "manuscript-ro",
        "productionProfileId": "profile-eu-book-print",
        "status": "planned",
        "auditRefs": []
      }
    ]
  },
  "visualAssets": [
    {
      "visualAssetId": "cover-ro-draft-001",
      "type": "cover",
      "sourceManuscriptId": "manuscript-ro",
      "status": "draft",
      "humanApprovalStatus": "pending"
    }
  ],
  "audioTracks": [
    {
      "audioTrackId": "audiobook-ro-chapter-001",
      "type": "audiobook_chapter",
      "language": "ro",
      "manuscriptId": "manuscript-ro",
      "chapterId": "chapter-ro-001",
      "voiceProfileId": "voice-profile-ro-001",
      "exportFormats": ["mp3", "wav", "flac"],
      "humanApprovalStatus": "pending"
    }
  ],
  "videoAssets": [
    {
      "videoAssetId": "trailer-ro-draft-001",
      "type": "trailer",
      "language": "ro",
      "sourceManuscriptId": "manuscript-ro",
      "subtitleTrackRefs": ["subtitle-ro-srt-001"],
      "humanApprovalStatus": "pending"
    }
  ],
  "productionProfiles": [
    {
      "productionProfileId": "profile-eu-book-print",
      "region": "europe",
      "format": "book_print",
      "outputFormats": ["pdfx", "epub", "mobi", "flipbook"],
      "bleedRequired": true,
      "cropMarksRequired": true
    }
  ],
  "agentExecutions": [
    {
      "agentExecutionId": "agent-execution-001",
      "agentType": "Lexicographic Intelligence Agent",
      "inputRefs": ["segment-ro-001"],
      "outputRefs": ["dict-entry-es-ro-001"],
      "dependencyRefs": [],
      "executionOrder": 1,
      "status": "planned",
      "humanApprovalStatus": "pending",
      "auditRefs": []
    }
  ],
  "needToKnowAccess": [
    {
      "accessGrantId": "workspace-grant-a",
      "userId": "user-translator-001",
      "role": "TRANSLATOR",
      "projectId": "project-001",
      "scope": {
        "manuscriptIds": ["manuscript-ro"],
        "documentIds": ["document-ro-001"],
        "chapterIds": ["chapter-ro-001"],
        "sectionIds": ["section-ro-001"],
        "segmentIds": ["segment-ro-001"]
      },
      "permittedTools": ["TRANSLATION", "LEXICOGRAPHIC", "COLLABORATION"],
      "confidentialClassification": "INTERNAL",
      "temporary": true,
      "startsAt": "2026-01-01T00:00:00.000Z",
      "expiresAt": "2026-02-01T00:00:00.000Z",
      "grantedBy": "user-admin-001",
      "mostRestrictiveRuleApplied": true,
      "hiddenDataLoadedThroughApi": false,
      "auditRefs": ["workspace-audit-need-to-know-001"]
    }
  ],
  "agentDataAccess": [
    {
      "agentDataAccessId": "agent-access-001",
      "agent": "Quality Agent",
      "task": "publication readiness validation",
      "accessScope": {
        "projectId": "project-001",
        "documentIds": ["document-ro-001"],
        "exportArtifactIds": ["export-ro-pdf-001"]
      },
      "accessedResources": ["document-ro-001", "export-ro-pdf-001"],
      "decision": "ALLOW",
      "result": "minimum necessary publication readiness data provided",
      "agentMayExpandOwnAccess": false,
      "timestamp": "2026-01-01T00:05:00.000Z",
      "auditRefs": ["workspace-audit-agent-access-001"]
    }
  ],
  "editorialWorkspace": {
    "workspaceVersion": "phase-7-step-13",
    "primaryEnvironment": true,
    "centralObject": "manuscript",
    "supportedPublicationTypes": [
      "Book",
      "Children's Book",
      "Magazine",
      "Poetry",
      "Dictionary",
      "Course",
      "Audiobook",
      "Video"
    ],
    "commonActionClickTarget": "2-3",
    "publicationFormat": {
      "formatFamily": "Custom",
      "formatName": "A5",
      "orientation": "portrait",
      "width": null,
      "height": null,
      "bleed": "3mm",
      "spine": "auto",
      "insideMargin": "20mm",
      "outsideMargin": "18mm",
      "topMargin": "18mm",
      "bottomMargin": "20mm",
      "gutter": "6mm",
      "safeArea": "configured",
      "columns": 1
    },
    "automaticFormatAdaptation": [
      "layout",
      "templates",
      "styles",
      "guides",
      "imagePlacement",
      "pageNumbering",
      "exportSettings",
      "previews"
    ],
    "productionTools": [
      "dragDrop",
      "pageThumbnails",
      "paragraphStyles",
      "characterStyles",
      "objectStyles",
      "masterPagesTemplates",
      "pageGuides",
      "rulers",
      "grids",
      "snapping",
      "alignment",
      "pageNumbering",
      "headers",
      "footers",
      "tableOfContents",
      "footnotes",
      "endnotes",
      "hyperlinks",
      "anchors",
      "imagePlacement",
      "imageFitting",
      "imageReplacement",
      "layers",
      "preflight",
      "packageProject",
      "livePreview"
    ],
    "reviewInterface": {
      "defaultColumns": 2,
      "optionalColumns": [3, 4],
      "sentenceAlignment": true,
      "paragraphAlignment": true,
      "synchronizedScrolling": true,
      "immutableOriginal": true,
      "acceptRejectProposals": true
    },
    "panelBehavior": {
      "collapsible": true,
      "dockable": true,
      "resizable": true,
      "restorable": true,
      "favorites": true,
      "universalSearch": true,
      "configurableShortcuts": true,
      "recentlyUsedTools": true
    },
    "collaboration": {
      "individualFirst": true,
      "instantCollaboration": true,
      "roleAssignment": true,
      "chapterAssignment": true,
      "segmentAssignment": true,
      "comments": true,
      "mentions": true,
      "suggestions": true,
      "acceptReject": true,
      "synchronizedUpdates": true,
      "audit": true,
      "versionHistory": true
    }
  }
}
```

Need-to-know access metadata is optional and records visibility scope,
temporary grants, AI data access, and audit references. It must not include
restricted content for unauthorized recipients.

Editorial Workspace metadata is optional and records the active production
workspace configuration. It does not duplicate manuscripts, translations,
review data, publishing artifacts, rights records, or audit records; it only
references and organizes existing canonical objects.

This document defines the canonical organization requirement only. It does not
change runtime validators, database schema, APIs, or UI.
