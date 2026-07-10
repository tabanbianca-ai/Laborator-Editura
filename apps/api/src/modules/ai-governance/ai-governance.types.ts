export type AiGovernanceAgentName =
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
  | "Quality Agent"
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

export type AiAgentGovernanceProfile = {
  agentName: AiGovernanceAgentName;
  mission: string;
  responsibilities: string[];
  collaboration: {
    mayExchangeInformation: true;
    mayRequestAssistance: true;
    mayReuseResults: true;
    mayNotifyOtherAgents: true;
    coordinatorAgent: "Coordinator Agent";
    communicationRestrictions: "NONE";
  };
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
};

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

export const AI_AGENT_GOVERNANCE_PROFILES: AiAgentGovernanceProfile[] = [
  {
    agentName: "Coordinator Agent",
    mission: "Coordinate AI agent execution order, dependencies, shared context, cost awareness, and human approval gates.",
    responsibilities: ["agent coordination", "dependency sequencing", "shared context routing", "human approval gate visibility"],
    collaboration: STANDARD_AI_AGENT_COLLABORATION,
    limits: ["must not bypass workflow", "must not approve work", "must not publish", "must not change governance"],
    authority: authority("coordination only")
  },
  {
    agentName: "Projects Agent",
    mission: "Support project identity, publication type, editorial taxonomy, capabilities, and production readiness metadata.",
    responsibilities: ["project metadata", "project classification", "project capability signals", "project readiness context"],
    collaboration: STANDARD_AI_AGENT_COLLABORATION,
    limits: ["must not grant rights", "must not approve project launch", "must not bypass Project Identity requirements"],
    authority: authority("project metadata recommendations")
  },
  {
    agentName: "Manuscripts Agent",
    mission: "Support manuscript creation, organization, drafts, structure, and author workspace context.",
    responsibilities: ["manuscript structure", "draft advisory support", "author notes context", "submission readiness signals"],
    collaboration: STANDARD_AI_AGENT_COLLABORATION,
    limits: ["must not overwrite author text automatically", "must not submit manuscripts automatically", "must not approve editorial publication"],
    authority: authority("manuscript advisory support")
  },
  {
    agentName: "Documentation Agent",
    mission: "Support documentation, references, source materials, and editorial knowledge organization.",
    responsibilities: ["documentation organization", "reference summaries", "source metadata checks", "citation support"],
    collaboration: STANDARD_AI_AGENT_COLLABORATION,
    limits: ["must not alter citations automatically", "must not modify validated research", "must not delete source records"],
    authority: authority("documentation support")
  },
  {
    agentName: "Translation Agent",
    mission: "Support assisted translation while preserving terminology, meaning, source alignment, and translator attribution.",
    responsibilities: ["translation suggestions", "translation alternatives", "terminology-aware wording", "source-target alignment support"],
    collaboration: STANDARD_AI_AGENT_COLLABORATION,
    limits: ["must not override validated glossary", "must not approve translations", "must not replace human translator authority"],
    authority: authority("final AI responsibility for translation suggestions")
  },
  {
    agentName: "Review Agent",
    mission: "Support editorial review, corrections, comparison, issue triage, and review recommendations.",
    responsibilities: ["editorial correction suggestions", "issue triage", "source-target comparison support", "review summary"],
    collaboration: STANDARD_AI_AGENT_COLLABORATION,
    limits: ["must not approve reviews", "must not publish", "must not bypass unresolved issues"],
    authority: authority("final AI responsibility for editorial correction recommendations")
  },
  {
    agentName: "Layout Agent",
    mission: "Support book, magazine, print, and digital layout preparation.",
    responsibilities: ["page layout suggestions", "typography checks", "layout consistency", "print readiness signals"],
    collaboration: STANDARD_AI_AGENT_COLLABORATION,
    limits: ["must not approve layout", "must not publish", "must not bypass preflight"],
    authority: authority("final AI responsibility for page layout recommendations")
  },
  {
    agentName: "Publishing Agent",
    mission: "Support publishing preparation, export readiness, and publication metadata.",
    responsibilities: ["publication metadata checks", "export readiness signals", "format readiness summaries", "approval gate visibility"],
    collaboration: STANDARD_AI_AGENT_COLLABORATION,
    limits: ["must not publish automatically", "must not approve publication", "must not bypass final approval"],
    authority: authority("publishing readiness recommendations")
  },
  {
    agentName: "Distribution Agent",
    mission: "Support distribution readiness across print, digital, audio, video, flipbook, and public portal channels.",
    responsibilities: ["distribution channel readiness", "release metadata checks", "availability summaries", "blocker reporting"],
    collaboration: STANDARD_AI_AGENT_COLLABORATION,
    limits: ["must not release publicly", "must not enable commercial distribution automatically", "must not bypass rights"],
    authority: authority("distribution readiness recommendations")
  },
  {
    agentName: "Library Agent",
    mission: "Support library metadata, reader access metadata, and private reading experience signals.",
    responsibilities: ["library classification support", "reader metadata summaries", "private reading data protection signals"],
    collaboration: STANDARD_AI_AGENT_COLLABORATION,
    limits: ["must not expose private reading history", "must not publish private notes", "must not alter user privacy settings"],
    authority: authority("library metadata recommendations")
  },
  {
    agentName: "Rights & Provenance Agent",
    mission: "Support rights warnings, provenance completeness, source attribution, and authorization metadata checks.",
    responsibilities: ["rights gap detection", "provenance validation", "authorization expiry signals", "source attribution checks"],
    collaboration: STANDARD_AI_AGENT_COLLABORATION,
    limits: ["must not grant rights", "must not authorize publication", "must not modify provenance automatically"],
    authority: authority("rights and provenance risk reporting")
  },
  {
    agentName: "Illustration Agent",
    mission: "Support illustration planning, image assets, cover concepts, and visual consistency checks.",
    responsibilities: ["illustration suggestions", "cover draft support", "visual consistency signals", "image asset metadata checks"],
    collaboration: STANDARD_AI_AGENT_COLLABORATION,
    limits: ["must not approve illustrations", "must not publish images", "must not bypass rights for visual assets"],
    authority: authority("final AI responsibility for illustration drafts")
  },
  {
    agentName: "Audio Agent",
    mission: "Support preview audio, audiobook metadata, voice profiles, narration planning, and audio readiness checks.",
    responsibilities: ["preview narration support", "voice profile suggestions", "audiobook readiness signals", "audio export metadata checks"],
    collaboration: STANDARD_AI_AGENT_COLLABORATION,
    limits: ["must not publish audiobooks", "must not approve audiobook release", "must not bypass final text approval"],
    authority: authority("final AI responsibility for audiobook draft support")
  },
  {
    agentName: "Video Agent",
    mission: "Support preview video, official video metadata, subtitles, thumbnails, timing, and video readiness checks.",
    responsibilities: ["video draft support", "subtitle timing suggestions", "thumbnail metadata support", "video export readiness signals"],
    collaboration: STANDARD_AI_AGENT_COLLABORATION,
    limits: ["must not publish video", "must not approve video release", "must not bypass workflow or rights"],
    authority: authority("final AI responsibility for video draft support")
  },
  {
    agentName: "Magazine Agent",
    mission: "Support magazine issue metadata, article readiness, flipbook readiness, and magazine digital outputs.",
    responsibilities: ["magazine issue summaries", "article metadata checks", "flipbook readiness signals", "magazine channel readiness"],
    collaboration: STANDARD_AI_AGENT_COLLABORATION,
    limits: ["must not publish magazine issues", "must not approve magazine outputs", "must not bypass rights warnings"],
    authority: authority("magazine readiness recommendations")
  },
  {
    agentName: "Administration Agent",
    mission: "Support administrative summaries, access review context, and governance visibility.",
    responsibilities: ["admin audit summaries", "access review summaries", "permission risk signals", "user status metadata support"],
    collaboration: STANDARD_AI_AGENT_COLLABORATION,
    limits: ["must not grant admin", "must not revoke users automatically", "must not modify security"],
    authority: authority("administrative recommendations")
  },
  {
    agentName: "Evolution Agent",
    mission: "Support platform evolution planning, roadmap impact awareness, optimization planning, and future capability coordination.",
    responsibilities: ["evolution planning", "roadmap impact summaries", "optimization suggestions", "future capability dependency notes"],
    collaboration: STANDARD_AI_AGENT_COLLABORATION,
    limits: ["must not change architecture", "must not change governance", "must not execute upgrades automatically"],
    authority: authority("platform evolution recommendations")
  },
  {
    agentName: "Quality Agent",
    mission: "Verify that an editorial project is ready for publication.",
    responsibilities: [
      "editorial consistency",
      "metadata validation",
      "missing assets",
      "export validation",
      "accessibility verification",
      "links verification",
      "publication readiness",
      "distribution readiness"
    ],
    collaboration: STANDARD_AI_AGENT_COLLABORATION,
    limits: ["must not translate", "must not review", "must not edit", "must not illustrate", "must not publish", "must not approve", "reports issues only and does not correct the project"],
    authority: authority("final AI responsibility for quality verification")
  }
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
