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
  }
}
```

This document defines the canonical organization requirement only. It does not
change runtime validators, database schema, APIs, or UI.
