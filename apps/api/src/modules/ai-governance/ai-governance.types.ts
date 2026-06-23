export type AiGovernanceAgentName =
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
