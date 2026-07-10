export type AiPrincipalAgentName =
  | "Coordinator Agent"
  | "Projects Agent"
  | "Manuscripts Agent"
  | "Documentation Agent"
  | "Translation Agent"
  | "Review Agent"
  | "Layout Agent"
  | "Publishing Agent"
  | "Distribution Agent"
  | "Library Agent"
  | "Rights & Provenance Agent"
  | "Illustration Agent"
  | "Audio Agent"
  | "Video Agent"
  | "Magazine Agent"
  | "Administration Agent"
  | "Evolution Agent"
  | "Quality Agent";

export type AiSpecializedSubagentName =
  | "Terminology & Lexicography Subagent"
  | "Semantic Fidelity Subagent"
  | "Editorial Decision Subagent"
  | "Planning & Coordination Subagent"
  | "Media Localization Subagent"
  | "Platform Engineering Subagent";

export type AiGovernanceAgentName =
  | AiPrincipalAgentName
  | AiSpecializedSubagentName
  | "Translation AI"
  | "Lexicographic AI"
  | "Semantic Fidelity"
  | "Editorial Decision Agent"
  | "Layout Publishing Agent"
  | "Multimedia Creation Agent"
  | "Media Localization Agent"
  | "Platform Engineering Agent"
  | "Scheduling Agent"
  | "Author Studio AI"
  | "Research AI";

export type AiAgentKind = "PRINCIPAL" | "SUBAGENT";

export type AiQualityReadinessStatus = "READY" | "READY_WITH_WARNINGS" | "BLOCKED";

type AiAgentCollaborationRules = {
  mayExchangeInformation: true;
  mayRequestAssistance: true;
  mayReuseResults: true;
  mayNotifyOtherAgents: true;
  coordinatorAgent: "Coordinator Agent";
  communicationRestrictions: "NONE";
};

export type AiAgentGovernanceProfile = {
  id: string;
  name: AiGovernanceAgentName;
  agentName: AiGovernanceAgentName;
  agentKind: AiAgentKind;
  parentAgentId?: string;
  parentAgentIds?: string[];
  mission: string;
  responsibilities: string[];
  collaboration: AiAgentCollaborationRules;
  collaborationRules: AiAgentCollaborationRules;
  behavior?: string[];
  limits: string[];
  authority: {
    finalResponsibilityScope: string;
    humanFinalAuthorityOverrides: true;
    mayPublishAutomatically: false;
    mayApproveAutomatically: false;
    mayGrantRights: false;
    mayBypassWorkflow: false;
    mayModifySecurity: false;
    mayChangeGovernance: false;
  };
  enabled: boolean;
  version: string;
  updatedAt: string;
  qualityReadinessStatuses?: AiQualityReadinessStatus[];
};

export type AiAgentGovernanceAuditAction =
  | "AGENT_INVOCATION"
  | "SUBAGENT_INVOCATION"
  | "REVIEW_PROPOSAL_GENERATED"
  | "REVIEW_PROPOSAL_ACCEPTED"
  | "REVIEW_PROPOSAL_REJECTED"
  | "RESPONSIBILITY_TRANSFER"
  | "QUALITY_STATUS_RECORDED"
  | "FINAL_AGENT_DECISION"
  | "HUMAN_OVERRIDE";

export type AiReviewProposalStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface AiReviewProposal {
  proposalId: string;
  projectId: string;
  documentId: string;
  segmentId: string;
  sourceText: string;
  currentTranslation: string;
  proposedText: string;
  language: string;
  issueType: string;
  explanation: string;
  confidence: number;
  status: AiReviewProposalStatus;
  createdByAgent: "Review Agent" | "Editorial Decision Subagent";
  reviewedBy?: string;
  createdAt: string;
  resolvedAt?: string;
}

export type AiParallelReviewDisplayMode = "TWO_COLUMNS" | "THREE_COLUMNS" | "FOUR_COLUMNS";

export interface AiParallelReviewInterfaceModel {
  defaultDisplayMode: "TWO_COLUMNS";
  allowedDisplayModes: AiParallelReviewDisplayMode[];
  defaultColumns: ["original", "translation"];
  optionalColumns: ["comparison", "version"];
  maxColumns: 4;
  sentenceAndParagraphAlignment: true;
  synchronizedScrollingCanBeToggled: true;
  originalTextImmutable: true;
  translationUnchangedUntilProposalAccepted: true;
  differencesHighlighted: true;
  proposalsAttachedToRelevantTranslation: true;
  individualAcceptRejectActions: true;
  acceptedRejectedProposalsAudited: true;
  versionHistoryPreserved: true;
  columnsResizableOrHideable: true;
}

export const AI_PARALLEL_REVIEW_INTERFACE: AiParallelReviewInterfaceModel = {
  defaultDisplayMode: "TWO_COLUMNS",
  allowedDisplayModes: ["TWO_COLUMNS", "THREE_COLUMNS", "FOUR_COLUMNS"],
  defaultColumns: ["original", "translation"],
  optionalColumns: ["comparison", "version"],
  maxColumns: 4,
  sentenceAndParagraphAlignment: true,
  synchronizedScrollingCanBeToggled: true,
  originalTextImmutable: true,
  translationUnchangedUntilProposalAccepted: true,
  differencesHighlighted: true,
  proposalsAttachedToRelevantTranslation: true,
  individualAcceptRejectActions: true,
  acceptedRejectedProposalsAudited: true,
  versionHistoryPreserved: true,
  columnsResizableOrHideable: true
};

const AI_AGENT_GOVERNANCE_VERSION = "1.0";
const AI_AGENT_GOVERNANCE_UPDATED_AT = "2026-07-10T00:00:00.000Z";

const STANDARD_AI_AGENT_COLLABORATION: AiAgentGovernanceProfile["collaboration"] = {
  mayExchangeInformation: true,
  mayRequestAssistance: true,
  mayReuseResults: true,
  mayNotifyOtherAgents: true,
  coordinatorAgent: "Coordinator Agent",
  communicationRestrictions: "NONE"
};

function authority(finalResponsibilityScope: string): AiAgentGovernanceProfile["authority"] {
  return {
    finalResponsibilityScope,
    humanFinalAuthorityOverrides: true,
    mayPublishAutomatically: false,
    mayApproveAutomatically: false,
    mayGrantRights: false,
    mayBypassWorkflow: false,
    mayModifySecurity: false,
    mayChangeGovernance: false
  };
}

function limits(specificLimits: string[]): string[] {
  return [
    "must not bypass workflow rules",
    "must not remove audit history",
    "must not modify rights or security outside authority",
    "must not perform responsibilities assigned to another specialized agent",
    "must not publish automatically without required validations",
    ...specificLimits
  ];
}

function profile(input: {
  id: string;
  agentName: AiGovernanceAgentName;
  agentKind: AiAgentKind;
  parentAgentId?: string;
  parentAgentIds?: string[];
  mission: string;
  responsibilities: string[];
  behavior?: string[];
  limits: string[];
  authorityScope: string;
  qualityReadinessStatuses?: AiQualityReadinessStatus[];
}): AiAgentGovernanceProfile {
  return {
    id: input.id,
    name: input.agentName,
    agentName: input.agentName,
    agentKind: input.agentKind,
    parentAgentId: input.parentAgentId,
    parentAgentIds: input.parentAgentIds,
    mission: input.mission,
    responsibilities: input.responsibilities,
    collaboration: STANDARD_AI_AGENT_COLLABORATION,
    collaborationRules: STANDARD_AI_AGENT_COLLABORATION,
    behavior: input.behavior,
    limits: limits(input.limits),
    authority: authority(input.authorityScope),
    enabled: true,
    version: AI_AGENT_GOVERNANCE_VERSION,
    updatedAt: AI_AGENT_GOVERNANCE_UPDATED_AT,
    qualityReadinessStatuses: input.qualityReadinessStatuses
  };
}

export const AI_AGENT_GOVERNANCE_PROFILES: AiAgentGovernanceProfile[] = [
  profile({
    id: "coordinator-agent",
    agentName: "Coordinator Agent",
    agentKind: "PRINCIPAL",
    mission: "Coordinate agents, execution order, dependencies, retries, workload, blockers, shared context, cost awareness, and human approval gates.",
    responsibilities: ["agent coordination", "execution order", "dependency sequencing", "retries", "workload balancing", "blocker reporting", "shared context routing", "human approval gate visibility"],
    limits: ["must not approve work", "must not publish", "must not change governance"],
    authorityScope: "coordination only"
  }),
  profile({
    id: "projects-agent",
    agentName: "Projects Agent",
    agentKind: "PRINCIPAL",
    mission: "Configure project type, languages, formats, capabilities, folders, dossiers, and editorial workflow metadata.",
    responsibilities: ["project metadata", "project type", "project languages", "publication formats", "project capabilities", "project dossiers", "editorial workflow configuration", "project readiness context"],
    limits: ["must not grant rights", "must not approve project launch", "must not bypass Project Identity requirements"],
    authorityScope: "project metadata recommendations"
  }),
  profile({
    id: "manuscripts-agent",
    agentName: "Manuscripts Agent",
    agentKind: "PRINCIPAL",
    mission: "Import, structure, normalize, and verify manuscript integrity without rewriting content.",
    responsibilities: ["manuscript import", "manuscript structure", "content normalization", "integrity verification", "draft advisory support", "author notes context", "submission readiness signals"],
    limits: ["must not rewrite author content automatically", "must not overwrite author text automatically", "must not submit manuscripts automatically", "must not approve editorial publication"],
    authorityScope: "manuscript advisory support"
  }),
  profile({
    id: "documentation-agent",
    agentName: "Documentation Agent",
    agentKind: "PRINCIPAL",
    mission: "Research sources, editions, authors, context, and specialized information with full citation and provenance.",
    responsibilities: ["documentation organization", "source research", "edition research", "author context", "specialized information", "source metadata checks", "citation support", "provenance support"],
    limits: ["must not alter citations automatically", "must not modify validated research", "must not delete source records"],
    authorityScope: "documentation support"
  }),
  profile({
    id: "translation-agent",
    agentName: "Translation Agent",
    agentKind: "PRINCIPAL",
    mission: "Produce faithful translation support that preserves meaning, tone, register, verbal tense, source alignment, and approved terminology.",
    responsibilities: ["translation suggestions", "translation alternatives", "meaning preservation", "tone preservation", "register preservation", "verbal tense preservation", "terminology-aware wording", "source-target alignment support"],
    limits: ["must not override validated glossary", "must not approve translations", "must not replace human translator authority"],
    authorityScope: "final AI responsibility for translation suggestions"
  }),
  profile({
    id: "review-agent",
    agentName: "Review Agent",
    agentKind: "PRINCIPAL",
    mission: "Perform detailed linguistic and editorial review while preserving source meaning and human control over every proposal.",
    responsibilities: [
      "detailed text review",
      "stylistic improvement",
      "stylistic register",
      "lexical register",
      "verbal tenses",
      "paragraph structure",
      "transitions between paragraphs",
      "orthography",
      "elementary grammatical errors",
      "punctuation",
      "grammatical agreement",
      "word order",
      "prepositions",
      "anacolutha",
      "pleonasms",
      "cacophonies",
      "plural forms",
      "unnecessary repetitions"
    ],
    behavior: [
      "identifies each issue",
      "explains the issue",
      "proposes one or more replacement variants when available",
      "never imposes the proposed change",
      "preserves the current text until the proposal is accepted",
      "allows individual accept or reject actions",
      "does not alter the original meaning",
      "does not replace validated terminology without justification and traceability"
    ],
    limits: ["must not impose proposals", "must not approve reviews", "must not publish", "must not bypass unresolved issues"],
    authorityScope: "final AI responsibility for editorial correction recommendations"
  }),
  profile({
    id: "layout-agent",
    agentName: "Layout Agent",
    agentKind: "PRINCIPAL",
    mission: "Control typography, pagination, styles, page structure, images, print layout, and digital layout recommendations.",
    responsibilities: ["typography checks", "pagination", "style consistency", "page structure", "image placement", "print readiness signals", "digital layout readiness"],
    limits: ["must not approve layout", "must not publish", "must not bypass preflight"],
    authorityScope: "final AI responsibility for page layout recommendations"
  }),
  profile({
    id: "publishing-agent",
    agentName: "Publishing Agent",
    agentKind: "PRINCIPAL",
    mission: "Prepare validated publication packages, metadata, editions, and publication execution recommendations.",
    responsibilities: ["publication package preparation", "publication metadata checks", "edition metadata", "export readiness signals", "format readiness summaries", "approval gate visibility"],
    limits: ["must not publish automatically", "must not approve publication", "must not bypass final approval"],
    authorityScope: "publishing readiness recommendations"
  }),
  profile({
    id: "distribution-agent",
    agentName: "Distribution Agent",
    agentKind: "PRINCIPAL",
    mission: "Prepare and deliver approved files to configured distribution channels.",
    responsibilities: ["distribution channel readiness", "approved file delivery preparation", "release metadata checks", "availability summaries", "blocker reporting"],
    limits: ["must not release publicly", "must not enable commercial distribution automatically", "must not bypass rights"],
    authorityScope: "distribution readiness recommendations"
  }),
  profile({
    id: "library-agent",
    agentName: "Library Agent",
    agentKind: "PRINCIPAL",
    mission: "Classify, index, preserve, and manage publications, assets, metadata, and versions.",
    responsibilities: ["library classification support", "indexing support", "publication preservation", "asset metadata", "version metadata", "reader metadata summaries", "private reading data protection signals"],
    limits: ["must not expose private reading history", "must not publish private notes", "must not alter user privacy settings"],
    authorityScope: "library metadata recommendations"
  }),
  profile({
    id: "rights-provenance-agent",
    agentName: "Rights & Provenance Agent",
    agentKind: "PRINCIPAL",
    mission: "Validate authorship, original edition, licenses, contracts, asset sources, and publication rights.",
    responsibilities: ["authorship validation", "original edition checks", "license checks", "contract metadata checks", "asset source checks", "rights gap detection", "provenance validation", "authorization expiry signals", "source attribution checks"],
    limits: ["must not grant rights", "must not authorize publication", "must not modify provenance automatically"],
    authorityScope: "rights and provenance risk reporting"
  }),
  profile({
    id: "illustration-agent",
    agentName: "Illustration Agent",
    agentKind: "PRINCIPAL",
    mission: "Create and adapt illustration drafts while maintaining visual consistency and technical quality.",
    responsibilities: ["illustration suggestions", "illustration adaptation", "cover draft support", "visual consistency signals", "technical quality checks", "image asset metadata checks"],
    limits: ["must not approve illustrations", "must not publish images", "must not bypass rights for visual assets"],
    authorityScope: "final AI responsibility for illustration drafts"
  }),
  profile({
    id: "audio-agent",
    agentName: "Audio Agent",
    agentKind: "PRINCIPAL",
    mission: "Produce audiobook and accessible audio version drafts using validated text and authorized voices.",
    responsibilities: ["preview narration support", "voice profile suggestions", "authorized voice metadata", "audiobook readiness signals", "accessible audio readiness", "audio export metadata checks"],
    limits: ["must not publish audiobooks", "must not approve audiobook release", "must not bypass final text approval"],
    authorityScope: "final AI responsibility for audiobook draft support"
  }),
  profile({
    id: "video-agent",
    agentName: "Video Agent",
    agentKind: "PRINCIPAL",
    mission: "Produce synchronized video drafts, subtitles, audio description, and platform-specific format recommendations.",
    responsibilities: ["video draft support", "synchronization metadata", "subtitle timing suggestions", "audio description support", "thumbnail metadata support", "platform-specific format readiness", "video export readiness signals"],
    limits: ["must not publish video", "must not approve video release", "must not bypass workflow or rights"],
    authorityScope: "final AI responsibility for video draft support"
  }),
  profile({
    id: "magazine-agent",
    agentName: "Magazine Agent",
    agentKind: "PRINCIPAL",
    mission: "Coordinate issues, articles, sections, periodicity, and magazine-specific production readiness.",
    responsibilities: ["magazine issue summaries", "article metadata checks", "sections", "periodicity", "flipbook readiness signals", "magazine channel readiness"],
    limits: ["must not publish magazine issues", "must not approve magazine outputs", "must not bypass rights warnings"],
    authorityScope: "magazine readiness recommendations"
  }),
  profile({
    id: "administration-agent",
    agentName: "Administration Agent",
    agentKind: "PRINCIPAL",
    mission: "Manage authorized platform configuration, roles, permissions, policies, and provider metadata recommendations.",
    responsibilities: ["admin audit summaries", "platform configuration recommendations", "roles metadata", "permissions metadata", "policy visibility", "provider metadata", "access review summaries", "permission risk signals", "user status metadata support"],
    limits: ["must not grant admin", "must not revoke users automatically", "must not modify security"],
    authorityScope: "administrative recommendations"
  }),
  profile({
    id: "evolution-agent",
    agentName: "Evolution Agent",
    agentKind: "PRINCIPAL",
    mission: "Analyze upgrades, compatibility, migrations, vulnerabilities, and platform improvements.",
    responsibilities: ["upgrade analysis", "compatibility analysis", "migration analysis", "vulnerability awareness", "platform improvement recommendations", "roadmap impact summaries", "optimization suggestions", "future capability dependency notes"],
    limits: ["must not change architecture", "must not change governance", "must not execute upgrades automatically"],
    authorityScope: "platform evolution recommendations"
  }),
  profile({
    id: "quality-agent",
    agentName: "Quality Agent",
    agentKind: "PRINCIPAL",
    mission: "Perform final publication-readiness validation.",
    responsibilities: [
      "editorial completeness",
      "editorial consistency",
      "metadata validation",
      "missing assets",
      "links verification",
      "accessibility verification",
      "export validation",
      "rights status",
      "workflow completion",
      "publication readiness",
      "distribution readiness"
    ],
    limits: ["must not translate", "must not review", "must not edit", "must not illustrate", "must not publish", "must not approve", "reports issues only and does not correct the project"],
    authorityScope: "final AI responsibility for quality verification",
    qualityReadinessStatuses: ["READY", "READY_WITH_WARNINGS", "BLOCKED"]
  }),
  profile({
    id: "terminology-lexicography-subagent",
    agentName: "Terminology & Lexicography Subagent",
    agentKind: "SUBAGENT",
    parentAgentId: "translation-agent",
    mission: "Support Translation Agent terminology and lexicographic consistency without silently replacing validated terms.",
    responsibilities: ["manage validated glossaries", "enforce terminology consistency", "preserve specialized terms", "track terminology status and sources", "propose alternatives without silently replacing validated terms"],
    limits: ["must not validate terminology automatically", "must not override validated glossary", "must not silently replace validated terms"],
    authorityScope: "subagent support for Translation Agent terminology and lexicography"
  }),
  profile({
    id: "semantic-fidelity-subagent",
    agentName: "Semantic Fidelity Subagent",
    agentKind: "SUBAGENT",
    parentAgentId: "translation-agent",
    mission: "Support Translation Agent semantic comparison between source and translation.",
    responsibilities: ["compare source and translation sentence by sentence", "detect omissions", "detect additions", "detect meaning shifts", "verify tone", "verify intent", "verify verbal tense", "report semantic divergence"],
    limits: ["must not rewrite translation automatically", "must not approve semantic review", "must not override validated glossary"],
    authorityScope: "subagent support for Translation Agent semantic fidelity"
  }),
  profile({
    id: "editorial-decision-subagent",
    agentName: "Editorial Decision Subagent",
    agentKind: "SUBAGENT",
    parentAgentId: "review-agent",
    mission: "Support Review Agent comparison of competing editorial variants.",
    responsibilities: ["analyze competing editorial variants", "explain stylistic differences", "explain normative differences", "recommend a preferred variant", "never apply it automatically"],
    limits: ["must not apply preferred variants automatically", "must not approve reviews", "must not replace human editorial authority"],
    authorityScope: "subagent support for Review Agent editorial decisions"
  }),
  profile({
    id: "planning-coordination-subagent",
    agentName: "Planning & Coordination Subagent",
    agentKind: "SUBAGENT",
    parentAgentId: "coordinator-agent",
    mission: "Support Coordinator Agent planning, priorities, scheduling, and workload balancing.",
    responsibilities: ["deadlines", "priorities", "dependencies", "workload balancing", "milestones", "scheduling conflicts", "AI task scheduling"],
    limits: ["must not approve schedules automatically", "must not override human deadlines", "must not bypass workflow dependencies"],
    authorityScope: "subagent support for Coordinator Agent planning and coordination"
  }),
  profile({
    id: "media-localization-subagent",
    agentName: "Media Localization Subagent",
    agentKind: "SUBAGENT",
    parentAgentId: "audio-agent",
    parentAgentIds: ["audio-agent", "video-agent"],
    mission: "Support Audio Agent and Video Agent multilingual media localization readiness.",
    responsibilities: ["multilingual subtitles", "localized narration", "pronunciation", "timing and synchronization", "regional language variants", "accessible localized media"],
    limits: ["must not publish localized media", "must not approve localized media", "must not bypass final text or rights approval"],
    authorityScope: "subagent support for Audio Agent and Video Agent media localization"
  }),
  profile({
    id: "platform-engineering-subagent",
    agentName: "Platform Engineering Subagent",
    agentKind: "SUBAGENT",
    parentAgentId: "evolution-agent",
    mission: "Support Evolution Agent technical planning and risk assessment.",
    responsibilities: ["architecture compatibility", "dependency analysis", "upgrade plans", "migrations", "rollback plans", "technical risk assessment"],
    limits: ["must not execute upgrades automatically", "must not change architecture", "must not change governance"],
    authorityScope: "subagent support for Evolution Agent platform engineering"
  })
];

export type AiUsageStatus = "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED" | "BLOCKED_BY_POLICY";

export type AiBudgetScope = "ORGANIZATION" | "PROJECT" | "USER" | "AGENT" | "MONTHLY" | "PER_RUN";

export type AiQuotaScope = "ORGANIZATION" | "PROJECT" | "USER" | "AGENT";

export type AiCostPolicyStatus = "DRAFT" | "ACTIVE" | "DISABLED";

export type AiOverrideStatus = "PENDING_HUMAN_APPROVAL" | "APPROVED" | "REJECTED";

export type AiCostAuditAction =
  | "AI_USAGE_RECORDED"
  | "AI_BUDGET_CREATED"
  | "AI_QUOTA_CREATED"
  | "AI_COST_POLICY_CREATED"
  | "AI_BUDGET_OVERRIDE_REQUEST_CREATED"
  | "AI_BUDGET_OVERRIDE_APPROVED"
  | "AI_BUDGET_OVERRIDE_REJECTED";

export interface AiGovernanceActor {
  userId: string;
  organizationId: string;
  roles?: string[];
  permissions?: string[];
}

export interface AiProviderModelMetadata {
  provider?: string;
  model?: string;
  region?: string;
  pricingReference?: string;
}

export interface AiUsageRecord {
  id: string;
  organizationId: string;
  agentName: AiGovernanceAgentName;
  executionType: string;
  projectId?: string;
  documentId?: string;
  userId: string;
  providerMetadata: AiProviderModelMetadata;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
  currency: string;
  status: AiUsageStatus;
  costPolicyEvaluation: {
    softLimitWarning: boolean;
    hardLimitReached: boolean;
    approvalRequiredOverThreshold: boolean;
  };
  externalBillingIntegration: "NOT_CONFIGURED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface AiBudget {
  id: string;
  organizationId: string;
  budgetScope: AiBudgetScope;
  scopeRef?: string;
  agentName?: AiGovernanceAgentName;
  monthlyBudget?: number;
  perRunLimit?: number;
  amount: number;
  currency: string;
  period: "MONTHLY" | "PER_RUN" | "CUSTOM";
  startsAt?: string;
  endsAt?: string;
  humanApprovalRequired: true;
  aiSuggested: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface AiQuota {
  id: string;
  organizationId: string;
  quotaScope: AiQuotaScope;
  scopeRef?: string;
  agentName?: AiGovernanceAgentName;
  maxTokensPerRun?: number;
  maxCostPerRun?: number;
  maxRunsPerDay?: number;
  maxRunsPerMonth?: number;
  projectSpecific: boolean;
  agentSpecific: boolean;
  humanApprovalRequired: true;
  aiSuggested: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface AiCostPolicy {
  id: string;
  organizationId: string;
  name: string;
  status: AiCostPolicyStatus;
  softLimitWarningThreshold?: number;
  hardLimitMetadata?: Record<string, unknown>;
  approvalRequiredOverThreshold?: number;
  humanOverrideAllowed: boolean;
  aiMayEstimateCost: true;
  aiMaySuggestOptimizations: true;
  aiMayWarnBudgetRisk: true;
  aiMayRecommendQuotaChanges: true;
  aiCannotApproveOwnBudgetIncrease: true;
  aiCannotBypassHardLimits: true;
  aiCannotAlterCostHistory: true;
  aiCannotDeleteUsageRecords: true;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface AiBudgetOverrideRequest {
  id: string;
  organizationId: string;
  requestedBy: string;
  requestedForUserId?: string;
  budgetId?: string;
  quotaId?: string;
  agentName?: AiGovernanceAgentName;
  reason: string;
  requestedAmount?: number;
  requestedCurrency?: string;
  status: AiOverrideStatus;
  aiInitiated: boolean;
  aiSelfApprovalAttempt: boolean;
  humanApprovalRequired: true;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface AiCostAuditEvent {
  id: string;
  organizationId: string;
  action: AiCostAuditAction;
  actorId: string;
  usageRecordId?: string;
  budgetId?: string;
  quotaId?: string;
  policyId?: string;
  overrideRequestId?: string;
  beforeState?: object;
  afterState?: object;
  humanFinalAuthority: true;
  createdAt: string;
}

export interface CreateAiUsageRecordInput {
  agentName: AiGovernanceAgentName;
  executionType: string;
  projectId?: string;
  documentId?: string;
  userId?: string;
  providerMetadata?: AiProviderModelMetadata;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  estimatedCost?: number;
  currency?: string;
  status?: AiUsageStatus;
  metadata?: Record<string, unknown>;
}

export interface CreateAiBudgetInput {
  budgetScope: AiBudgetScope;
  scopeRef?: string;
  agentName?: AiGovernanceAgentName;
  monthlyBudget?: number;
  perRunLimit?: number;
  amount: number;
  currency?: string;
  period?: "MONTHLY" | "PER_RUN" | "CUSTOM";
  startsAt?: string;
  endsAt?: string;
  aiSuggested?: boolean;
  aiInitiatedBudgetIncrease?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CreateAiQuotaInput {
  quotaScope: AiQuotaScope;
  scopeRef?: string;
  agentName?: AiGovernanceAgentName;
  maxTokensPerRun?: number;
  maxCostPerRun?: number;
  maxRunsPerDay?: number;
  maxRunsPerMonth?: number;
  aiSuggested?: boolean;
  aiInitiatedQuotaChange?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CreateAiCostPolicyInput {
  name: string;
  status?: AiCostPolicyStatus;
  softLimitWarningThreshold?: number;
  hardLimitMetadata?: Record<string, unknown>;
  approvalRequiredOverThreshold?: number;
  humanOverrideAllowed?: boolean;
  aiInitiatedPolicyChange?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CreateAiBudgetOverrideRequestInput {
  budgetId?: string;
  quotaId?: string;
  agentName?: AiGovernanceAgentName;
  reason: string;
  requestedAmount?: number;
  requestedCurrency?: string;
  aiInitiated?: boolean;
  aiSelfApprovalAttempt?: boolean;
  metadata?: Record<string, unknown>;
}

export interface AiOverrideDecisionInput {
  aiInitiatedApproval?: boolean;
  metadata?: Record<string, unknown>;
}

export interface AiGovernanceRepository {
  createUsageRecord(record: AiUsageRecord): Promise<AiUsageRecord>;
  listUsageRecords(organizationId: string): Promise<AiUsageRecord[]>;
  createBudget(budget: AiBudget): Promise<AiBudget>;
  findBudgetById(id: string, organizationId: string): Promise<AiBudget | null>;
  listBudgets(organizationId: string): Promise<AiBudget[]>;
  createQuota(quota: AiQuota): Promise<AiQuota>;
  findQuotaById(id: string, organizationId: string): Promise<AiQuota | null>;
  listQuotas(organizationId: string): Promise<AiQuota[]>;
  createPolicy(policy: AiCostPolicy): Promise<AiCostPolicy>;
  listPolicies(organizationId: string): Promise<AiCostPolicy[]>;
  createOverrideRequest(request: AiBudgetOverrideRequest): Promise<AiBudgetOverrideRequest>;
  updateOverrideRequest(request: AiBudgetOverrideRequest): Promise<AiBudgetOverrideRequest>;
  findOverrideRequestById(id: string, organizationId: string): Promise<AiBudgetOverrideRequest | null>;
  appendAuditEvent(event: AiCostAuditEvent): Promise<void>;
  listAuditEvents(organizationId: string): Promise<AiCostAuditEvent[]>;
}
