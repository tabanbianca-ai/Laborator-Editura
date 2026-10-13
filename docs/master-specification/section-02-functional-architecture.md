# Master Specification — Section 2

## Functional Architecture and General Platform Structure

Document status: Draft for owner review  
Specification target: Laborator Editura v1.0  
Scope: Product and functional architecture  
Last consolidated: 2026-09-04

## 2.1 Purpose

This section defines how Laborator Editura functions as one editorial platform,
how its functional areas cooperate, and how editorial content moves from source
material to an official publication.

It consolidates decisions already established by the Manifesto, the fundamental
platform principles, the architecture suite, the domain model, and the existing
editorial-core contracts. It does not create a second architecture or authorize
parallel implementations.

The central product rule is:

> One editorial work has one canonical structured source. Every workflow,
> version, translation, correction, layout, media adaptation, publication, and
> distribution record must preserve an explicit relationship to that source.

## 2.2 Unified Product Model

Laborator Editura is one ecosystem with three product surfaces:

1. **Public Website** — presents the platform and exposes approved public
   catalog, magazine, author, news, article, and authentication experiences.
2. **Editorial Application** — provides the private workspace in which users
   create, import, translate, correct, review, approve, design, produce, and
   publish editorial works.
3. **Central API** — is the only official application access path to platform
   data and coordinates domain services, permissions, workflows, AI, files,
   events, and external integrations.

The three surfaces share the same identity, authorization, organization,
library, localization, audit, storage, configuration, versioning, and security
foundations. A feature exposed in more than one surface must reuse the same
domain capability and must not create a separate source of truth.

## 2.3 Functional Layers

The platform is organized into six functional layers. These are responsibility
boundaries, not independent products.

### 2.3.1 Experience Layer

Provides the editorial application and public experiences for desktop, tablet,
and mobile. It owns presentation, interaction, accessibility, and interface
localization. It does not own editorial truth or authorization decisions.

### 2.3.2 Workspace and Coordination Layer

Provides dashboard, Agenda, projects, assignments, collaboration, notifications,
workflow visibility, and human decision points. It coordinates work but does not
duplicate the records owned by functional modules.

### 2.3.3 Editorial Core Layer

Owns Document Master, immutable versions, structured content, translation
alignment, correction findings, editorial review, comments, suggestions,
approvals, and official-version selection.

### 2.3.4 Production Layer

Transforms an approved Document Master version into layout, PDF, EPUB, audio,
video, magazine, children's-book, accessibility, and other production
derivatives. It may add format-specific instructions but must not silently
change canonical editorial content.

### 2.3.5 Publication and Distribution Layer

Creates the official edition, publishes approved artifacts, exposes catalog
records, and tracks distribution and promotion. Distribution consumes the
official edition; it never becomes an alternate editorial source.

### 2.3.6 Platform Services Layer

Provides shared identity, permissions, library, storage, workflow engine, AI
orchestration, audit, observability, localization, search, configuration,
backup, recovery, and integrations. Functional modules must reuse these
services.

## 2.4 Canonical Editorial Backbone

The mandatory reference flow for a textual work is:

```text
Library
  -> Project
  -> Manuscript / Imported Source
  -> Document Master
  -> Working Version
  -> Translation (optional)
  -> Translation Review (when applicable)
  -> Correction
  -> Editorial Review
  -> Final Validation
  -> Approved Master Version
  -> Layout and Production
  -> Publication
  -> Official Edition
  -> Distribution and Promotion
```

Workflow Engine may configure stages by project type, but it may not bypass
rights, provenance, required quality checks, version-specific approval, or the
authorized human decision that makes a version official.

## 2.5 Document Master v1

### 2.5.1 Definition

Document Master is the canonical, structured, format-independent representation
of an editorial work. It is the shared content backbone for authoring,
translation, correction, approval, layout, media, publication, accessibility,
and preservation.

DOCX, PDF, EPUB, HTML, Markdown, plain text, audio, video, print files, and
external layout files are imports, exports, or derivatives. They are not the
canonical working source after ingestion unless an authorized and audited
migration explicitly promotes one.

### 2.5.2 v1 Identity and Scope

Each Document Master v1 record must include:

- stable master document identifier;
- organization and project scope;
- optional work identity from the Library;
- canonical title;
- source language;
- schema version;
- current working version reference;
- current approved version reference when one exists;
- lifecycle status;
- structured content;
- editorial and rights metadata references;
- creator and timestamps;
- complete audit linkage.

The existing `StructuredMasterDocument` contract is the implementation baseline.
Its evolution must be additive and migration-controlled. A new parallel master
document type must not be introduced.

### 2.5.3 Structured Content

Document Master v1 must represent, at minimum:

- front matter and back matter;
- chapters and sections;
- titles and subtitles;
- paragraphs;
- ordered and unordered lists;
- bold and italic inline meaning;
- quotations;
- footnotes and editorial notes;
- tables;
- images and captions;
- references and links;
- accessibility metadata;
- extensible metadata required by specific publication types.

Every addressable block must have a stable identifier. Reordering or editing a
block must preserve its identity whenever its semantic identity is unchanged.
This enables version comparison, comments, translation alignment, corrections,
layout mapping, and derivative invalidation.

### 2.5.4 Version Model

A mutable working state and immutable version snapshots have different roles:

- **Working state** supports autosave and active collaboration.
- **Canonical version** is an immutable snapshot used for comparison, review,
  approval, production, or restoration.
- **Approved version** is a canonical version with explicit, authorized,
  version-specific approval.
- **Published version** is the approved source snapshot referenced by an
  official edition.

Approval of one version never approves a later version. Restoring an older
version creates a new traceable version; it does not erase intervening history.
Published snapshots are immutable.

### 2.5.5 Source Change and Derivative Validity

Every translation and production derivative must record the exact source
version it consumes.

When a source version changes, the system must calculate affected blocks and
mark dependent work according to impact:

- unaffected derivatives remain current;
- derivatives with changed source blocks become `OUTDATED` or equivalent;
- affected translations return to review at the required severity;
- affected layout or media outputs require controlled regeneration;
- already published editions remain immutable and retain their provenance;
- a corrected publication creates a new official version or edition.

Invalidation must be explicit, auditable, and reversible where the domain
allows. It must never silently overwrite an official artifact.

### 2.5.6 Import Contract

Import is a staged, non-destructive process:

```text
Upload
  -> Security and file validation
  -> Format detection
  -> Content extraction
  -> Structure analysis
  -> Import preview and warnings
  -> Human confirmation
  -> Document Master creation
```

DOCX is the primary v1 manuscript import target. Import must preserve all
supported semantics and report unsupported or ambiguous content before a master
is created. The original file remains linked as provenance evidence.

PDF import is not presumed to preserve editable structure. OCR or structural
reconstruction must be identified as inferred content and require human review.

### 2.5.7 Editing Contract

The internal editor operates directly on Document Master structures. It must:

- preserve stable block identity;
- support semantic rather than presentation-only formatting;
- autosave without generating official versions;
- allow explicit version creation;
- support comments and suggestions without changing approved content directly;
- expose comparison and restoration;
- enforce permissions and collaborative conflict controls;
- record human and AI provenance;
- remain keyboard-operable and accessible.

### 2.5.8 Human Authority and AI

AI may analyze, translate, correct, classify, summarize, propose, or generate
derivatives within its assigned permissions. AI output is a proposal or
traceable execution result until an authorized human accepts it.

AI must not:

- make a version official without the required human approval;
- bypass rights, provenance, quality, or publication gates;
- alter published snapshots;
- create an untracked copy of canonical content;
- call external providers outside the shared AI orchestration layer.

## 2.6 Core Functional Areas and Their Relationship to Document Master

### 2.6.1 Library

The Library is the platform-level Single Source of Truth for work identity,
official editions, publication versions, files, rights references, provenance,
and long-term preservation.

It references Document Master and its approved versions; it does not replace
their structured editorial content. A project may exist before a Library work
is formalized, but publication requires a stable work identity.

### 2.6.2 Projects and Manuscripts

A Project defines participants, languages, profile, workflow, deadlines,
rights context, and enabled production capabilities. A manuscript is source
material within that project. After confirmed import or native creation, its
editable canonical representation is Document Master.

### 2.6.3 Translation

Translation is aligned to stable source block identifiers and an exact source
version. Each target language has an independent controlled lifecycle.

Translation Memory, terminology, dictionaries, and AI suggestions provide
evidence and assistance. They do not replace the translation record or human
validation. Source changes must identify and reopen only the affected target
segments whenever possible.

### 2.6.4 Correction and Editorial Review

Correction findings, comments, and suggestions reference a resource version
and, where applicable, a stable content block. Findings use controlled severity
and status. Accepting a change creates or contributes to a new version; it does
not rewrite the reviewed snapshot.

Final approval is explicit, attributed, timestamped, and version-specific.

### 2.6.5 Layout and Export

Native layout consumes an approved Document Master version and adds a separate
presentation model containing templates, page geometry, styles, headers,
footers, numbering, text flow, image placement, typography, and output profiles.

Presentation instructions must remain separate from canonical semantic content.
PDF print, PDF digital, and EPUB are generated artifacts with source-version,
generator, approval, accessibility, integrity, and preflight evidence.

InDesign or IDML may be supported for interoperability, but cannot be mandatory
for the v1 native production path.

### 2.6.6 Magazine

A magazine issue is a structured publication aggregate containing cover,
editorial, table of contents, general material, and ordered articles. Each
article uses the common editorial core:

- text is mandatory;
- images are supported;
- audio and video are optional derivatives;
- correction is mandatory;
- translation is optional by issue or article;
- layout and publication consume approved versions.

Magazine-specific orchestration may coordinate issue-level state, but it must
not implement a parallel document, review, version, media, or publication
system.

### 2.6.7 Audio and Video

Audio production consumes an approved source version and manages narration,
voice, SSML, pronunciation, chapters, timing, transcript, regeneration, and
export metadata.

Video production consumes an approved source or transcript version and manages
audio, subtitles, synchronization, images or footage, accessibility, rendering,
and export metadata.

Text changes in media workflows must return through Document Master review;
media modules cannot silently fork the canonical text.

### 2.6.8 Children's Books

Children's-book production uses Document Master for text and a linked scene
model for illustration briefs, character identity, visual continuity, image
versions, page composition, and optional audio or video. Generated images are
versioned assets with rights, provenance, human approval, and explicit scene or
block relationships.

### 2.6.9 Publication

Publication selects one approved master version and its approved production
artifacts, executes preflight, and creates an immutable publication snapshot.
That snapshot becomes the content basis of the official edition.

Publication must fail closed when required rights, provenance, accessibility,
quality, integrity, or approval evidence is missing.

### 2.6.10 Public Application, Distribution, and Promotion

The public application exposes only approved publication records and permitted
assets. Reader accounts and commerce may add access or transaction state but
must not own editorial content.

Distribution and promotion use derivatives of the official edition. Channel
metadata, campaigns, links, excerpts, and analytics remain traceable to that
edition and cannot alter it.

### 2.6.11 Agenda and Collaboration

Agenda coordinates tasks, deadlines, assignments, approvals, alerts, and
workflow transitions. Collaboration provides scoped comments, mentions,
presence, and notifications. Neither owns editorial content or approval rules.

## 2.7 Shared Platform Capabilities

All functional areas must use the shared capabilities below:

| Capability | Mandatory responsibility |
| --- | --- |
| Identity and access | Authentication, server-side authorization, roles, permissions, and Need-to-Know isolation |
| Workflow Engine | Configurable stages, transitions, gates, assignments, and escalation |
| Digital Library | Work identity, official editions, files, rights, provenance, and preservation |
| Storage | Controlled binary storage, integrity, retention, and access |
| Versioning | Immutable snapshots, comparison, restoration, and dependency tracking |
| Audit | Who acted, what changed, when, why, and under which authority |
| Localization | Platform language separated from source, authoring, and target languages |
| Accessibility | Accessible application and accessible output requirements from creation onward |
| AI orchestration | Provider-neutral execution, permissions, cost control, evidence, and human review |
| Search and indexing | Permission-aware discovery without becoming a source of truth |
| Observability | Health, performance, errors, traces, and operational behavior |
| Backup and recovery | Tested restoration of data, files, configuration, and release state |

## 2.8 Language Model

The platform must distinguish:

- **Platform Language** — interface and system messages;
- **Original Language** — language of the source work;
- **Authoring Language** — language in which a user is currently creating;
- **Target Language** — language of a translation;
- **Publication Language** — language declared by an official edition.

Changing Platform Language must never change editorial content. Language
metadata is versioned where it affects meaning, translation, or publication.

## 2.9 Rights, Provenance, Audit, and Reversibility

Every significant object must preserve organization scope, owner, origin,
creation actor, modification actor, version, timestamps, rights context, and
relationships to source and derivatives.

Sensitive actions require server-side authorization and audit, including:

- importing or promoting canonical content;
- accepting AI-generated editorial changes;
- approving a version;
- regenerating an approved derivative;
- changing rights or provenance;
- publishing, withdrawing, or superseding an edition;
- restoring or archiving content.

Deletion must follow retention and legal rules. Editorial history and published
provenance must not disappear through ordinary user deletion.

## 2.10 v1 Boundaries

### Required for Editorial Core Complete

- project and participant configuration;
- native Document Master creation and editing;
- DOCX import with preview and human confirmation;
- immutable versions, comparison, and restoration;
- translation linked to source blocks and versions;
- correction, review, comments, and suggestions;
- explicit version-specific approval;
- dependency tracking and outdated-state propagation;
- shared audit, permissions, localization, and accessibility.

### Required for Book Production Complete

- native layout model;
- reusable templates and page styles;
- print and digital preflight;
- PDF print, PDF digital, and EPUB generation;
- artifact integrity, provenance, and approval;
- official edition creation and Library registration.

### Deferred Until the Backbone Is Stable

Advanced audio/video automation, advanced children's-book generation,
distribution automation, promotion automation, reader commerce, and native
mobile packaging may evolve after the common editorial backbone is stable.
Their architecture remains supported and they must still consume canonical
versions.

## 2.11 Document Master v1 Acceptance Criteria

Document Master v1 is complete only when a controlled end-to-end test proves
that an authorized user can:

1. create a project and import a representative DOCX;
2. inspect warnings and confirm the structured import;
3. edit semantic content without Word as a runtime dependency;
4. create and compare immutable versions;
5. translate selected content while preserving source alignment;
6. correct and review through version-specific findings and suggestions;
7. approve one exact version through an authorized human gate;
8. change the source and observe correct affected-derivative invalidation;
9. restore a prior version without losing history;
10. produce a complete audit and provenance trail.

The test must include headings, paragraphs, lists, emphasis, quotation,
footnote, table, image with caption, special characters, and at least two
languages. It must validate permissions, accessibility, concurrent editing or
conflict handling, failure recovery, and responsive use of the principal flow.

## 2.12 Implementation Alignment and Known Gaps

The repository already contains the initial canonical contract in
`packages/shared/src/editorial-core.ts`, validation rules, JSON Master
integration, editorial workflow contracts, and distributed runtime capabilities
for projects, documents, segments, translations, review, workflow, library,
layout, export, and publication.

This is a foundation, not proof of end-to-end completion. The v1 implementation
must consolidate existing distributed behavior around the current canonical
contract. The principal gaps are:

- complete semantic coverage of structured and inline content;
- a production DOCX importer with preview and fidelity reporting;
- a native structured editor connected to the canonical contract;
- durable persistence and concurrency behavior for the unified master;
- source-to-translation and source-to-derivative impact propagation;
- end-to-end approval and official-version selection;
- native professional layout and PDF/EPUB production;
- integrated browser-level validation of the full editorial path.

Implementation must use incremental migrations and compatibility adapters where
needed. Existing validated APIs or data must not be destructively replaced.

## 2.13 Parallel Release-Certification Track

RC1 Blocker 08 is a separate, parallel certification track. It validates the
current platform foundation through live adversarial security, browser
accessibility, authenticated localization, staging performance, and real
PostgreSQL migration evidence.

Closing RC1 does not mean the full editorial product is complete. Conversely,
Document Master development must not bypass or weaken the RC1 release gates.

The two tracks converge before a real editorial pilot:

```text
Master Specification Section 2 -> Document Master v1 -> Editorial Core
                                      +
                    RC1 Blocker 08 -> RC1 GO
                                      |
                                      v
                         Controlled editorial pilot
```

## 2.14 Decisions Frozen by This Section

The following decisions are normative for v1.0:

1. Laborator Editura remains one platform, not a suite of duplicated products.
2. The Library remains the platform-level Single Source of Truth for works and
   official editions.
3. Document Master is the canonical structured editorial source.
4. DOCX and InDesign are interoperability formats, not mandatory internal
   engines.
5. Translation, correction, layout, media, and publication reference exact
   source versions.
6. Approved and published snapshots are immutable.
7. AI actions remain permission-bound, auditable, and subject to human
   editorial authority.
8. Publication creates the official edition; distribution and promotion only
   consume its approved derivatives.
9. Magazine, children's books, audio, and video reuse the common editorial
   core.
10. RC1 certification and product development remain separate but coordinated
    workstreams.

## 2.15 Next Specification Step

After owner review and approval of this section, the next specification work is
to define the implementation-ready Document Master v1 package:

- complete semantic schema and extension rules;
- lifecycle and state-transition table;
- import and fidelity contract;
- editor command and collaboration contract;
- version, comparison, and restoration contract;
- translation alignment and invalidation contract;
- derivative dependency graph;
- permissions and audit matrix;
- API and event boundaries;
- migration map from current distributed records;
- end-to-end acceptance fixtures and quality gates.

No new editorial module should introduce its own document or version model
while this package is being completed.
