# Agents

## Development Governance

### Purpose

Define responsibilities and decision authority for the project.

### Architecture Freeze

The platform architecture is frozen for MVP implementation.

Rules:

- No new major features may be added without explicit architecture approval.
- Implementation must proceed in phases according to `ROADMAP.md`.
- Codex and Lovable must treat `SPEC.md` as the canonical product and
  architecture authority.
- Any conflict between implementation convenience and specification must be
  resolved in favor of the specification.

### MVP Stabilization Directive

Purpose:

- Maintain project control and execution discipline until MVP validation is
  complete.

Rules:

- Do not add new major modules.
- Do not expand scope beyond the approved architecture.
- Only clarify, refine, or complete existing specifications.
- Prioritize implementation over new design work.
- Roadmap expansion may resume only after MVP validation.

### Terminology Governance v2 Directive

Purpose:

- Protect terminology, Translation Memory, QA, Semantic Fidelity, workflow, and
  export from incorrect, invented, misspelled, or non-diacritic terms.

Rules:

- Treat Terminology Governance v2 as an approved stabilization enhancement of
  the existing Terminology & Glossary System, not as a new major module.
- AI must never automatically create `VALIDATED` terminology.
- New terminology entries must start as `PROPOSED`.
- Terms not found in approved sources must become `UNDER_REVIEW`.
- Romanian terms must pass diacritics and orthographic validation.
- Missing or incorrect Romanian diacritics must create High severity
  terminology issues.
- Rejected terms must create Critical terminology issues.
- Only authorized human users may validate, suspend, archive, or reject
  terminology.
- Repeated usage must not auto-promote terminology.
- `VALIDATED` terminology remains authoritative over Translation Memory and AI
  suggestions.
- Documents with rejected terminology or unresolved High/Critical terminology
  issues must not move to `READY_FOR_EXPORT` or `EXPORTED`.
- Every terminology governance action must be audited.

### Authority Confidence Level Directive

Purpose:

- Rank documented source authorities when translation rules, terminology rules,
  editorial rules, semantic fidelity rules, or exceptions have conflicting
  sources.

Rules:

- `PRIMARY_AUTHORITY` has priority over `SECONDARY_AUTHORITY`.
- `SECONDARY_AUTHORITY` has priority over `EDITORIAL_AUTHORITY`.
- `EDITORIAL_AUTHORITY` has priority over `TEMPORARY_AUTHORITY`.
- `TEMPORARY_AUTHORITY` cannot validate a permanent rule.
- Conflicting authorities must be flagged for authorized human review.
- AI output cannot be a source authority or authority confidence level.
- Authority confidence must be auditable and immutable per rule version.
- Impact Analysis must include authority confidence level.
- Backend implementation is not authorized until rule/source authority models
  are explicitly scheduled.

### Magazine Platform Vision Directive

Purpose:

- Reserve a future publication experience for digital magazines without
  expanding the current MVP implementation scope.

Rules:

- Magazine Platform Vision is documentation-only until explicitly promoted in
  `ROADMAP.md`.
- Original language must remain configurable per publication and must never be
  hard-coded.
- Every translated article, manuscript, audio version, and future magazine
  edition must remain linked to the same original publication.
- Translation alignment for magazine content must remain auditable through JSON
  Master references.
- M1 Digital Magazine MVP is `PLANNED` with `POST-BETA` priority.
- M2 Advanced Reading is `PLANNED` with `POST-BETA` priority.
- M3 Interactive Magazine is `PLANNED` with `FUTURE` priority.
- M4 Enterprise Magazine is `FUTURE` with `LONG_TERM` priority.
- No code, UI, API, database schema, migrations, or infrastructure work is
  authorized for Magazine Platform Vision until a later implementation phase is
  explicitly approved.

### Phase 2 Planning Foundation Directive

Purpose:

- Reserve the next editorial intelligence, production, media, narration, and
  platform coordination capabilities without changing Phase 1 runtime behavior.

Rules:

- Phase 2 Planning Foundation is documentation and architecture scaffolding
  only until individual modules are explicitly scheduled in `ROADMAP.md`.
- No runtime API, database schema, migration, UI, staging Docker, Auth,
  Projects, Documents, Segments, Translations, QA, Semantic Fidelity, Workflow,
  or Export logic changes are authorized by this directive.
- The approved Phase 2 planning modules are:
  - Lexicographic Intelligence Agent.
  - Layout & Editorial Production Agent.
  - AI Video & Visual Creation Agent.
  - Audio Narration Agent.
  - Platform Engineering, Optimization & Coordination Agent.
  - AI Orchestrator.
- AI may suggest, automate drafts, coordinate tasks, and prepare outputs, but
  authorized human roles keep final approval authority.
- Every Phase 2 agent action must be auditable, including inputs, outputs,
  dependencies, cost metadata when available, approvals, rejections, and
  generated artifacts.
- The AI Orchestrator may coordinate execution order, dependencies, cost
  controls, audit trails, and human approval gates, but it must not bypass
  security, tenant isolation, workflow gates, terminology governance, or human
  final authority.
- JSON Master Format may reserve future fields for dictionaries, layout,
  visual assets, audio tracks, video assets, production profiles, and agent
  executions, but those fields do not authorize runtime implementation by
  themselves.

### AI Agent Governance & Quality Agent Directive

Purpose:

- Define the final governance model for AI agents and add Quality Agent as a
  validation-only agent within the existing orchestration architecture.

Rules:

- Every AI agent must define mission, responsibilities, collaboration, limits,
  and authority.
- Agents may exchange information, request assistance, reuse results, notify
  other agents, and coordinate through the Coordinator Agent.
- There are no communication restrictions between agents.
- Each agent has final AI responsibility only within its own specialization.
- Human approval always overrides every AI decision.
- No AI agent may publish automatically, approve automatically, grant rights,
  bypass workflow, modify security, or change governance.
- Quality Agent verifies editorial consistency, metadata, missing assets,
  exports, accessibility, links, publication readiness, and distribution
  readiness.
- Quality Agent reports issues only. It must not translate, review, edit,
  illustrate, publish, approve, or correct the project.
- Quality Agent is a governance refinement in existing AI Governance,
  Marketplace, and Platform Engineering orchestration. It is not a new
  enterprise module.

### Complete AI Agent Roles, Subagents & Parallel Review Directive

Purpose:

- Complete AI agent role definitions, specialized subagent relationships, and
  the multilingual parallel review interface without creating new enterprise
  modules.

Rules:

- The 18 principal agents remain the only principal AI agent roles.
- Specialized subagents are scoped under their parent agents and do not replace
  parent responsibility.
- Approved subagents are:
  - Terminology & Lexicography Subagent under Translation Agent.
  - Semantic Fidelity Subagent under Translation Agent.
  - Editorial Decision Subagent under Review Agent.
  - Planning & Coordination Subagent under Coordinator Agent.
  - Media Localization Subagent under Audio Agent and Video Agent.
  - Platform Engineering Subagent under Evolution Agent.
- Review Agent must identify issues, explain them, propose replacement
  variants, and preserve current text until an authorized human accepts a
  proposal.
- Review proposals must support `PENDING`, `ACCEPTED`, and `REJECTED` states,
  individual accept/reject decisions, audit trail, and version history.
- The default review interface is two columns: original text and current
  translation.
- Optional comparison modes may show three or four columns for additional
  languages, versions, or comparison texts.
- Original text is immutable, translation is unchanged until acceptance, and
  accepted/rejected proposals must be auditable.
- Quality Agent readiness statuses are `READY`, `READY_WITH_WARNINGS`, and
  `BLOCKED`.
- No AI agent or subagent may bypass workflow, remove audit history, publish
  automatically, change rights/security outside authority, or perform another
  agent's specialized responsibility.

### Integrated Linguistic Knowledge Base Directive

Purpose:

- Provide a central, project-level linguistic knowledge base through existing
  Lexicographic Intelligence, Terminology, Semantic Fidelity, Translation,
  Review, Documentation, Rights, Quality, Audit, and AI Governance
  infrastructure.

Rules:

- This is not a new enterprise module and must not duplicate existing
  Lexicographic, Terminology, Research, Rights, or Quality infrastructure.
- Linguistic resources may include monolingual dictionaries, bilingual
  dictionaries, orthographic/orthoepic/morphological dictionaries, grammar and
  punctuation rules, idioms, phraseological expressions, specialized
  glossaries, terminology databases, editorial guides, corpora, and usage
  examples.
- Every resource must preserve language, language pair when bilingual, title,
  publisher or institution, edition, publication year, version, source URL or
  imported document reference, license status, copyright holder, redistribution
  permission, authority level, domain, effective date, last verification date,
  and enabled status.
- `INTEGRATED_CONTENT` may store searchable content only when license and
  redistribution metadata permit internal ingestion.
- `EXTERNAL_CONTROLLED_ACCESS` must store metadata, official links, authorized
  integration references, permitted excerpts, access restrictions, and license
  notes only.
- Full copyrighted dictionary content must never be ingested without documented
  authorization.
- Romanian linguistic sources such as DOOM, DEX-type explanatory resources,
  official grammar, orthographic and punctuation rules, bilingual dictionaries,
  phraseological dictionaries, and specialized dictionaries are configurable
  metadata sources. Copyrighted content must not be hardcoded.
- Source authority levels are `OFFICIAL_NORMATIVE`, `ACADEMIC`,
  `VALIDATED_SPECIALIZED`, `EDITORIAL_GUIDE`, `DESCRIPTIVE`, and
  `INFORMATIVE`.
- Normative sources take priority for orthography and grammar; validated
  specialized sources may take priority for domain terminology.
- Source conflicts must be reported for authorized human review. No silent
  replacement is allowed.
- Translation Agent, Review Agent, Documentation Agent, Rights & Provenance
  Agent, Quality Agent, Terminology & Lexicography Subagent, and Semantic
  Fidelity Subagent must use the knowledge base within their existing
  specialization and may not bypass human final authority.
- Audit must cover resource added, resource updated, license changed, entry
  imported, source consulted, terminology decision, dictionary conflict, human
  override, and resource disabled events.

### Advanced Linguistic Resources & Translation Memory Directive

Purpose:

- Complete the existing Linguistic Knowledge Base with configurable source
  priority, integrated Translation Memory, glossary hierarchy, transparent
  confidence scoring, and auditability.

Rules:

- This extends existing Linguistic Knowledge Base, Translation, Terminology &
  Lexicography, Semantic Fidelity, Review, AI Governance, and Audit
  infrastructure. It is not a new enterprise module.
- Each project may define source consultation priority. The default order is
  official normative source, project glossary, specialized glossary,
  Translation Memory, bilingual dictionary, explanatory dictionary, and
  corpus/examples.
- Source priority changes must be auditable.
- Translation Memory stores only validated translations as reusable proposal
  evidence.
- Translation Memory entries must preserve source segment, translated segment,
  language pair, project, domain, context, author, reviewer, approval date,
  confidence, and version.
- Translation Memory supports exact match, fuzzy match, and context match.
- Translation Memory must never replace text automatically. It always proposes.
- Glossary hierarchy is Project Glossary > Platform Glossary > Personal
  Glossary.
- Personal Glossary entries are optional suggestions only and must not override
  project or platform glossary decisions.
- Glossary conflicts require authorized human review and audit.
- Every linguistic proposal must expose confidence score, consulted sources,
  glossary used, Translation Memory match, terminology status, semantic
  validation, and explanation.
- Audit must cover glossary created, glossary updated, glossary conflict,
  Translation Memory entry added, Translation Memory reused, source priority
  changed, and confidence recalculated.

### Platform-Wide Need-to-Know Access Model Directive

Purpose:

- Apply contextual, role-based, task-based, and scope-based visibility across
  the entire platform while reusing existing IAM, RBAC, project roles, document
  permissions, audit, workspace, and AI governance.

Rules:

- This is a Workspace/IAM refinement, not a new enterprise module.
- Every user must see only information, documents, panels, tools, and actions
  required for the current role, project, assigned task, assigned document,
  manuscript, chapter, section, segment, workflow stage, explicit grant, and
  confidentiality classification.
- The most restrictive valid rule wins.
- Hidden data and restricted metadata must not be loaded or returned through
  APIs for unauthorized users.
- Collaborators receive access through an invitation flow that defines person,
  role, scope, permitted tools, expiry when temporary, reason, granting user,
  preview, and confirmation.
- Temporary access must expire automatically and revocation must be immediate
  across active sessions as implementation allows.
- Translators may see assigned source text, target translation fields,
  linguistic resources, glossaries, terminology decisions, and assigned
  comments.
- Reviewers may see assigned source text, translations, review proposals,
  comments, and relevant version history.
- Layout specialists may see validated text, styles, illustrations, layout
  assets, and publication specifications.
- Illustrators may see assigned fragments, briefs, approved references, and
  relevant assets.
- Audio/video collaborators may see validated text, assigned chapters,
  pronunciation/localization information, and approved media assets.
- Unrelated contracts, financial data, rights negotiations, administration
  data, distribution credentials, and private internal discussions must remain
  hidden unless explicitly authorized.
- Need-to-know enforcement must be server-side for projects, manuscripts,
  document sections, comments, versions, linguistic sources, rights records,
  media assets, exports, publishing, distribution, administration, and agent
  execution records.
- AI agents receive minimum necessary data only and may not expand their own
  access.
- Audit must cover invitation sent and accepted, access granted, changed,
  revoked, temporary access expired, restricted access attempt, document opened,
  confidential resource accessed, AI agent data access, and human override.

### Editorial Workspace Final Directive

Purpose:

- Make the Editorial Workspace the primary production environment while reusing
  existing modules and preserving a clean, individual-first workflow that can
  become collaborative instantly.

Rules:

- This is a frontend orchestration and workspace refinement, not a new
  enterprise backend module.
- The manuscript remains the central working object.
- The same Editorial Workspace must support Book, Children's Book, Magazine,
  Poetry, Dictionary, Course, Audiobook, and Video projects.
- Do not create separate production workspaces for writing, translation,
  review, illustration, layout, magazine production, publishing preparation, or
  distribution. Existing module pages may remain as tools opened from the
  unified workspace.
- Common editorial actions should be reachable in 2-3 clicks where practical.
- Only relevant tools should appear for the current role, project, assignment,
  task, and workflow state.
- Collaboration must activate through invitation, role assignment, chapter or
  segment scope, comments, mentions, suggestions, accept/reject, synchronized
  updates, audit, and version history without making individual work slower.
- Useful production functions inspired by Adobe InDesign may be modeled, but
  Adobe UI must not be reproduced.
- Publication format changes should adapt layout, templates, styles, guides,
  image placement, page numbering, export settings, and previews without manual
  reconstruction.
- Human Final Authority remains required. AI may suggest, preview, summarize,
  and detect blockers, but it must not approve, publish, grant rights, or
  bypass workflow.

### Administration Review and Simplification Directive

Purpose:

- Keep Administration as a platform configuration center, not a daily editorial
  workspace.

Rules:

- This is a frontend simplification and governance refinement, not a new
  enterprise module.
- Administration navigation must remain simple, logical, and limited to a
  maximum of two levels.
- Do not duplicate administration options across multiple admin surfaces.
- Administrator roles may see all administration sections.
- Editors and production users should work in production workspaces rather than
  Administration.
- Administration sections cover organization, users, roles and permissions, AI
  agents, linguistic resources, editorial templates, publishing and
  distribution, security, audit and backup, integrations, and system health.
- Each section must include short explanatory text.
- All administration changes must be reversible where possible and audited.
- Critical changes must require explicit confirmation.

### Roles, Permissions and Subscription Entitlements Directive

Purpose:

- Separate operational editorial authority from commercial subscription plans
  and finalize the effective access model.

Rules:

- Effective access is `Role permissions × Subscription entitlements ×
  Need-to-Know scope`.
- A user may perform an action only when the assigned role permits it, the
  subscription plan includes the required feature or quota, and the user has
  access to the relevant project, document, chapter, section, or segment.
- Editorial roles and subscription plans must never be treated as the same
  concept.
- Official roles are Administrator, Project Manager, Editor, Translator,
  Reviewer, Designer, Audio Narrator, Author, Collaborator, Reader, and Guest.
- Subscription plans are `FREE`, `BASIC`, `PREMIUM`, `BUSINESS`, and
  `ENTERPRISE_RESERVED`.
- `ENTERPRISE_RESERVED` remains disabled until explicitly activated later.
- Plan limits must not destroy data, remove existing work, or delete
  collaborators. They may block only restricted new actions.
- Downgrades preserve content, audit, versions, projects, files, and
  collaborators, and mark over-limit resources read-only where needed.
- Account owners may manage subscription and billing-related settings but may
  not bypass rights restrictions, workflow blocks, audit, security policies, or
  explicit legal restrictions.
- Administration must clearly separate Users and Roles from Subscription and
  Usage.
- Role assignments, subscription changes, quota exceeded events, feature
  blocks, upgrades, downgrades, temporary access changes, and permitted human
  overrides must be audited.

### Unified Language Management Directive

Purpose:

- Centralize platform language, original publication language, authoring
  language, target translation languages, language resources, AI conversation
  language, review comparison language columns, and language audit.

Rules:

- Every module must use one centralized Language Management model.
- No duplicate language settings may be introduced in Projects, Translation,
  Review, Workspace, AI Governance, Linguistic Knowledge Base,
  Administration, Audit, Publishing, Distribution, or Public Portal metadata.
- The four official language attributes are `platformLanguage`,
  `originalLanguage`, `authoringLanguage`, and `targetLanguage`.
- `platformLanguage` controls UI labels, menus, administration, dashboard,
  workflow names, AI conversations, notifications, dialogs, and workspace
  text.
- Changing `platformLanguage` must not change `originalLanguage`,
  `authoringLanguage`, or `targetLanguage`.
- `originalLanguage` is immutable after project creation unless an authorized
  user explicitly changes it.
- `authoringLanguage` supports multilingual manuscript authoring.
- Projects may have one Original Language, one Authoring Language, and one or
  more Target Languages.
- Translation uses Original Language to Target Language. Documentation and
  Review explanations use Platform Language.
- AI agents communicate with the user in Platform Language and may not change
  language configuration by themselves.
- Parallel review defaults to Original and Translation columns and may support
  three or four columns, each with independently selected language and version.
- The Linguistic Knowledge Base loads dictionaries, glossaries, terminology,
  phraseology, and linguistic resources by Source Language to Target Language.
- Administration owns installed languages, enabled languages, default Platform
  Language, fallback, translation completeness, linguistic resources,
  dictionaries, and glossaries as central configuration.
- Audit must cover Platform Language changed, Original Language changed,
  Authoring Language changed, Target Language added, Target Language removed,
  and language resources updated.

### Organization, Teams and Platform Creator Directive

Purpose:

- Finalize the organizational model with a simple, scalable structure that
  reuses Administration, Users, Roles, Permissions, Need-to-Know access, and
  Audit.

Rules:

- This is an Administration and access-governance refinement, not a new
  enterprise module.
- Supported organization types are `PERSOANA_FIZICA`, `EDITURA`,
  `ASOCIATIE_ONG`, `COMPANIE`, and `INSTITUTIE`.
- `PERSOANA_FIZICA` remains the default organization type.
- Organizations may create teams and sub-assign projects, tasks, documents,
  and workflow responsibilities to teams.
- Default teams are Translation, Review, Layout, Illustrations, Multimedia,
  Publishing, Marketing, and Advertising.
- `PLATFORM_CREATOR` / `Creatorul platformei` is a unique protected system
  role for platform ownership, development, maintenance, testing, and
  configuration.
- `PLATFORM_CREATOR` is separate from `ADMIN`, cannot be removed, downgraded,
  assigned to normal users, modified by other administrators, or limited by
  subscription plans.
- Administrator users may manage organization profile, organization type,
  teams, members, and invitations.
- Creator access and all organization/team/member changes must be audited.

### AI Providers & Cost Management Directive

Purpose:

- Finalize provider fallback, model selection, subscription-aware AI usage,
  budget governance, and administrative monitoring through existing AI
  Governance, AI Orchestrator, Administration, Subscription Plans, Audit,
  Organization Management, and Workspace infrastructure.

Rules:

- This is an AI Governance and Administration refinement, not a new enterprise
  module.
- Supported v1.0 providers are OpenAI as primary provider and Anthropic as
  fallback provider.
- Provider architecture must remain extensible for future providers without
  major code changes.
- OpenAI is the default provider. If it times out, is unavailable, returns an
  API error, or is placed in configured outage, the platform may automatically
  switch to Anthropic.
- When OpenAI becomes available again, the platform may automatically recover
  to OpenAI.
- Provider changes, fallback activation, and fallback recovery must be audited.
- Model selection is automatic by default. Manual model selection is available
  only when role and subscription entitlement permit it.
- Subscription plans for v1.0 are `FREE`, `BASIC`, `PREMIUM`, and `BUSINESS`.
  `ENTERPRISE_RESERVED` remains disabled unless explicitly activated later.
- Subscription may control AI access, quotas, collaborators, projects, storage,
  exports, advanced AI capabilities, and team functionality.
- AI budgets may be tracked for user, project, and organization scopes.
- Cost monitoring tracks estimated cost, actual cost, monthly consumption,
  consumption by AI agent, and consumption by project.
- Budget warning thresholds are 80%, 90%, and 100%.
- Reaching a limit must never delete data. It may block only the restricted AI
  action until quota reset or subscription upgrade.
- `PLATFORM_CREATOR` remains unrestricted for AI access, testing, and
  monitoring regardless of subscription plan.
- Administration must display configured providers, active provider, fallback
  status, consumption, monthly budget, remaining budget, and AI usage history.
- Audit must cover provider changed, fallback activated, fallback recovered,
  budget warning, budget exceeded, AI blocked, subscription upgraded, and
  subscription downgraded.

### ChatGPT

Role: System Architect.

Responsibilities:

- Product vision.
- Architecture.
- Specifications.
- Business rules.
- Workflow definitions.
- Roadmap management.
- Future module planning.

### Codex

Role: Software Engineer.

Responsibilities:

- Implementation.
- Database schema.
- APIs.
- Tests.
- Refactoring.
- Performance improvements.

Rules:

- Must follow `SPEC.md`, `AGENTS.md`, and `ROADMAP.md`.
- Must not change architecture without approval.
- Must not introduce major features outside roadmap.
- Must implement only the approved MVP scope until the architecture is reopened.

### Lovable

Role: Rapid UI Prototyping.

Responsibilities:

- UI generation.
- Navigation.
- Dashboards.
- Forms.
- Workflow screens.

Rules:

- Not responsible for architecture decisions.
- Must follow specifications.

### Priority Order

1. `SPEC.md`.
2. `AGENTS.md`.
3. `ROADMAP.md`.
4. Codex implementation.
5. Lovable UI generation.

When conflicts occur, architecture and specifications take precedence.
