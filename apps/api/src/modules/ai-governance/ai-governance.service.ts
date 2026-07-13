import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseAiGovernanceRepository } from "./ai-governance.repository";
import {
  AI_AGENT_GOVERNANCE_PROFILES,
  type AiBudget,
  type AiBudgetWarningThreshold,
  type AiBudgetOverrideRequest,
  type AiAgentGovernanceProfile,
  type AiCostSummary,
  type AiCostAuditAction,
  type AiCostAuditEvent,
  type AiCostPolicy,
  type AiGovernanceActor,
  type AiOverrideDecisionInput,
  type AiProviderName,
  type AiProviderStatus,
  type AiProviderStatusRecord,
  type AiProviderSummary,
  type AiQuota,
  type AiUsageRecord,
  type CreateAiBudgetInput,
  type CreateAiBudgetOverrideRequestInput,
  type CreateAiCostPolicyInput,
  type CreateAiQuotaInput,
  type CreateAiUsageRecordInput,
  type UpdateAiProviderStatusInput
} from "./ai-governance.types";

const PRIMARY_AI_PROVIDER = "OPENAI" satisfies AiProviderName;
const FALLBACK_AI_PROVIDER = "ANTHROPIC" satisfies AiProviderName;
const AI_BUDGET_WARNING_THRESHOLDS: AiBudgetWarningThreshold[] = [80, 90, 100];
const PROVIDER_UNAVAILABLE_STATUSES = new Set<AiProviderStatus>([
  "TIMEOUT",
  "UNAVAILABLE",
  "API_ERROR",
  "CONFIGURED_OUTAGE"
]);

@Injectable()
export class AiGovernanceService {
  constructor(private readonly repository: DatabaseAiGovernanceRepository) {}

  async listProviders(actor: AiGovernanceActor): Promise<AiProviderSummary> {
    this.assertAdminActor(actor);
    const providers = await this.ensureProviderStatuses(actor);

    return this.providerSummary(providers);
  }

  async updateProviderStatus(
    actor: AiGovernanceActor,
    provider: AiProviderName,
    input: UpdateAiProviderStatusInput
  ): Promise<AiProviderSummary> {
    this.assertAdminActor(actor);
    const beforeProviders = await this.ensureProviderStatuses(actor);
    const beforeSummary = this.providerSummary(beforeProviders);
    const existing = await this.repository.findProviderStatusByProvider(provider, actor.organizationId);

    if (!existing) {
      throw new NotFoundException("AI provider status not found.");
    }

    const updated = await this.repository.upsertProviderStatus({
      ...existing,
      status: input.status,
      supportedModels: input.supportedModels ?? existing.supportedModels,
      defaultModel: input.defaultModel ?? existing.defaultModel,
      modelSelectionMode: input.modelSelectionMode ?? existing.modelSelectionMode,
      outageReason: input.outageReason,
      lastCheckedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        ...(existing.metadata ?? {}),
        ...(input.metadata ?? {})
      }
    });
    const afterProviders = beforeProviders.map((record) =>
      record.provider === updated.provider ? updated : record
    );
    const afterSummary = this.providerSummary(afterProviders);

    await this.audit("AI_PROVIDER_CHANGED", actor, { providerStatusId: updated.id }, updated, existing);

    if (
      beforeSummary.activeProvider !== afterSummary.activeProvider &&
      afterSummary.fallbackStatus === "FALLBACK_ACTIVE"
    ) {
      await this.audit("AI_FALLBACK_ACTIVATED", actor, { providerStatusId: updated.id }, afterSummary, beforeSummary);
    }

    if (
      beforeSummary.activeProvider !== afterSummary.activeProvider &&
      beforeSummary.activeProvider === FALLBACK_AI_PROVIDER &&
      afterSummary.activeProvider === PRIMARY_AI_PROVIDER
    ) {
      await this.audit("AI_FALLBACK_RECOVERED", actor, { providerStatusId: updated.id }, afterSummary, beforeSummary);
    }

    return afterSummary;
  }

  async getCostSummary(actor: AiGovernanceActor): Promise<AiCostSummary> {
    this.assertAdminActor(actor);
    const usage = await this.repository.listUsageRecords(actor.organizationId);
    const budgets = await this.repository.listBudgets(actor.organizationId);
    const currentMonthUsage = this.currentMonthUsage(usage);
    const organizationBudget = budgets.find((budget) => budget.budgetScope === "ORGANIZATION");
    const monthlyBudget = organizationBudget?.monthlyBudget ?? organizationBudget?.amount ?? null;
    const monthlyConsumption = this.sumCosts(currentMonthUsage);

    return {
      monthlyBudget,
      monthlyConsumption,
      remainingBudget: monthlyBudget === null ? null : Math.max(monthlyBudget - monthlyConsumption, 0),
      warningThresholds: AI_BUDGET_WARNING_THRESHOLDS,
      consumptionByAgent: this.groupUsageByAgent(currentMonthUsage),
      consumptionByProject: this.groupUsageByProject(currentMonthUsage),
      platformCreatorUnlimited: this.isPlatformCreator(actor)
    };
  }

  listAgentGovernanceProfiles(actor: AiGovernanceActor): AiAgentGovernanceProfile[] {
    this.assertAdminActor(actor);
    return AI_AGENT_GOVERNANCE_PROFILES;
  }

  async listUsage(actor: AiGovernanceActor): Promise<AiUsageRecord[]> {
    this.assertAdminActor(actor);
    return this.repository.listUsageRecords(actor.organizationId);
  }

  async createUsageRecord(
    actor: AiGovernanceActor,
    input: CreateAiUsageRecordInput
  ): Promise<AiUsageRecord> {
    this.assertAdminActor(actor);
    this.validateRequired(input.agentName, "agentName");
    this.validateRequired(input.executionType, "executionType");

    const inputTokens = input.inputTokens ?? 0;
    const outputTokens = input.outputTokens ?? 0;
    const totalTokens = input.totalTokens ?? inputTokens + outputTokens;
    const estimatedCost = input.estimatedCost ?? 0;
    const policyEvaluation = await this.evaluatePolicy(actor, input, estimatedCost);
    const record: AiUsageRecord = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      agentName: input.agentName,
      executionType: input.executionType,
      projectId: input.projectId,
      documentId: input.documentId,
      userId: input.userId ?? actor.userId,
      providerMetadata: input.providerMetadata ?? {},
      inputTokens,
      outputTokens,
      totalTokens,
      estimatedCost,
      actualCost: input.actualCost,
      currency: input.currency ?? "EUR",
      status: input.status ?? (policyEvaluation.hardLimitReached ? "BLOCKED_BY_POLICY" : "SUCCEEDED"),
      costPolicyEvaluation: policyEvaluation,
      externalBillingIntegration: "NOT_CONFIGURED",
      createdAt: new Date().toISOString(),
      metadata: {
        ...(input.metadata ?? {}),
        providerCostApiConnected: false
      }
    };

    const created = await this.repository.createUsageRecord(record);
    await this.audit("AI_USAGE_RECORDED", actor, { usageRecordId: created.id }, created);

    if (policyEvaluation.warningThreshold === 80 || policyEvaluation.warningThreshold === 90) {
      await this.audit("AI_BUDGET_WARNING", actor, { usageRecordId: created.id }, created);
    }

    if (policyEvaluation.warningThreshold === 100 || policyEvaluation.hardLimitReached) {
      await this.audit("AI_BUDGET_EXCEEDED", actor, { usageRecordId: created.id }, created);
      await this.audit("AI_ACTION_BLOCKED", actor, { usageRecordId: created.id }, {
        ...created,
        blockedActionOnly: true,
        dataDeleted: false,
        recoveryOptions: ["wait until quota reset", "upgrade subscription"]
      });
    }

    return created;
  }

  async listBudgets(actor: AiGovernanceActor): Promise<AiBudget[]> {
    this.assertAdminActor(actor);
    return this.repository.listBudgets(actor.organizationId);
  }

  async createBudget(actor: AiGovernanceActor, input: CreateAiBudgetInput): Promise<AiBudget> {
    this.assertAdminActor(actor);

    if (input.aiInitiatedBudgetIncrease) {
      throw new BadRequestException("AI cannot approve or create its own budget increase.");
    }

    const now = new Date().toISOString();
    const budget: AiBudget = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      budgetScope: input.budgetScope,
      scopeRef: input.scopeRef,
      agentName: input.agentName,
      monthlyBudget: input.monthlyBudget,
      perRunLimit: input.perRunLimit,
      amount: input.amount,
      currency: input.currency ?? "EUR",
      period: input.period ?? "MONTHLY",
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      humanApprovalRequired: true,
      aiSuggested: input.aiSuggested ?? false,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createBudget(budget);
    await this.audit("AI_BUDGET_CREATED", actor, { budgetId: created.id }, created);

    return created;
  }

  async listQuotas(actor: AiGovernanceActor): Promise<AiQuota[]> {
    this.assertAdminActor(actor);
    return this.repository.listQuotas(actor.organizationId);
  }

  async createQuota(actor: AiGovernanceActor, input: CreateAiQuotaInput): Promise<AiQuota> {
    this.assertAdminActor(actor);

    if (input.aiInitiatedQuotaChange) {
      throw new BadRequestException("AI cannot change quotas automatically.");
    }

    const now = new Date().toISOString();
    const quota: AiQuota = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      quotaScope: input.quotaScope,
      scopeRef: input.scopeRef,
      agentName: input.agentName,
      maxTokensPerRun: input.maxTokensPerRun,
      maxCostPerRun: input.maxCostPerRun,
      maxRunsPerDay: input.maxRunsPerDay,
      maxRunsPerMonth: input.maxRunsPerMonth,
      projectSpecific: input.quotaScope === "PROJECT",
      agentSpecific: Boolean(input.agentName) || input.quotaScope === "AGENT",
      humanApprovalRequired: true,
      aiSuggested: input.aiSuggested ?? false,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createQuota(quota);
    await this.audit("AI_QUOTA_CREATED", actor, { quotaId: created.id }, created);

    return created;
  }

  async listPolicies(actor: AiGovernanceActor): Promise<AiCostPolicy[]> {
    this.assertAdminActor(actor);
    return this.repository.listPolicies(actor.organizationId);
  }

  async createPolicy(actor: AiGovernanceActor, input: CreateAiCostPolicyInput): Promise<AiCostPolicy> {
    this.assertAdminActor(actor);
    this.validateRequired(input.name, "name");

    if (input.aiInitiatedPolicyChange) {
      throw new BadRequestException("AI cannot change cost policies automatically.");
    }

    const now = new Date().toISOString();
    const policy: AiCostPolicy = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      name: input.name,
      status: input.status ?? "DRAFT",
      softLimitWarningThreshold: input.softLimitWarningThreshold,
      hardLimitMetadata: input.hardLimitMetadata,
      approvalRequiredOverThreshold: input.approvalRequiredOverThreshold,
      warningThresholds: input.warningThresholds ?? AI_BUDGET_WARNING_THRESHOLDS,
      humanOverrideAllowed: input.humanOverrideAllowed ?? true,
      aiMayEstimateCost: true,
      aiMaySuggestOptimizations: true,
      aiMayWarnBudgetRisk: true,
      aiMayRecommendQuotaChanges: true,
      aiCannotApproveOwnBudgetIncrease: true,
      aiCannotBypassHardLimits: true,
      aiCannotAlterCostHistory: true,
      aiCannotDeleteUsageRecords: true,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createPolicy(policy);
    await this.audit("AI_COST_POLICY_CREATED", actor, { policyId: created.id }, created);

    return created;
  }

  async createOverrideRequest(
    actor: AiGovernanceActor,
    input: CreateAiBudgetOverrideRequestInput
  ): Promise<AiBudgetOverrideRequest> {
    this.assertAdminActor(actor);
    this.validateRequired(input.reason, "reason");

    const now = new Date().toISOString();
    const request: AiBudgetOverrideRequest = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      requestedBy: actor.userId,
      requestedForUserId: actor.userId,
      budgetId: input.budgetId,
      quotaId: input.quotaId,
      agentName: input.agentName,
      reason: input.reason,
      requestedAmount: input.requestedAmount,
      requestedCurrency: input.requestedCurrency ?? "EUR",
      status: "PENDING_HUMAN_APPROVAL",
      aiInitiated: input.aiInitiated ?? false,
      aiSelfApprovalAttempt: input.aiSelfApprovalAttempt ?? false,
      humanApprovalRequired: true,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createOverrideRequest(request);
    await this.audit(
      "AI_BUDGET_OVERRIDE_REQUEST_CREATED",
      actor,
      { overrideRequestId: created.id },
      created
    );

    return created;
  }

  async approveOverrideRequest(
    actor: AiGovernanceActor,
    id: string,
    input: AiOverrideDecisionInput = {}
  ): Promise<AiBudgetOverrideRequest> {
    this.assertAdminActor(actor);

    if (input.aiInitiatedApproval) {
      throw new BadRequestException("AI cannot approve its own budget increase.");
    }

    const existing = await this.requireOverrideRequest(actor, id);

    if (existing.aiInitiated || existing.aiSelfApprovalAttempt) {
      throw new BadRequestException("AI-initiated override requests require separate human review.");
    }

    const now = new Date().toISOString();
    const approved: AiBudgetOverrideRequest = {
      ...existing,
      status: "APPROVED",
      approvedBy: actor.userId,
      approvedAt: now,
      updatedAt: now,
      metadata: {
        ...(existing.metadata ?? {}),
        ...(input.metadata ?? {}),
        finalAuthority: "AUTHORIZED_HUMAN"
      }
    };

    const saved = await this.repository.updateOverrideRequest(approved);
    await this.audit("AI_BUDGET_OVERRIDE_APPROVED", actor, { overrideRequestId: saved.id }, saved, existing);

    return saved;
  }

  async rejectOverrideRequest(
    actor: AiGovernanceActor,
    id: string,
    input: AiOverrideDecisionInput = {}
  ): Promise<AiBudgetOverrideRequest> {
    this.assertAdminActor(actor);
    const existing = await this.requireOverrideRequest(actor, id);
    const now = new Date().toISOString();
    const rejected: AiBudgetOverrideRequest = {
      ...existing,
      status: "REJECTED",
      rejectedBy: actor.userId,
      rejectedAt: now,
      updatedAt: now,
      metadata: {
        ...(existing.metadata ?? {}),
        ...(input.metadata ?? {}),
        finalAuthority: "AUTHORIZED_HUMAN"
      }
    };

    const saved = await this.repository.updateOverrideRequest(rejected);
    await this.audit("AI_BUDGET_OVERRIDE_REJECTED", actor, { overrideRequestId: saved.id }, saved, existing);

    return saved;
  }

  async listAudit(actor: AiGovernanceActor): Promise<AiCostAuditEvent[]> {
    this.assertAdminActor(actor);
    return this.repository.listAuditEvents(actor.organizationId);
  }

  private async evaluatePolicy(
    actor: AiGovernanceActor,
    input: CreateAiUsageRecordInput,
    estimatedCost: number
  ): Promise<AiUsageRecord["costPolicyEvaluation"]> {
    if (this.isPlatformCreator(actor)) {
      return {
        softLimitWarning: false,
        hardLimitReached: false,
        approvalRequiredOverThreshold: false,
        blockedActionOnly: false,
        dataDeleted: false,
        platformCreatorUnlimited: true
      };
    }

    const policies = await this.repository.listPolicies(actor.organizationId);
    const budgets = await this.repository.listBudgets(actor.organizationId);
    const usageRecords = await this.repository.listUsageRecords(actor.organizationId);
    const activePolicy = policies.find((policy) => policy.status === "ACTIVE");
    const softLimit = activePolicy?.softLimitWarningThreshold;
    const hardLimit = activePolicy?.hardLimitMetadata?.maxCostPerRun;
    const approvalThreshold = activePolicy?.approvalRequiredOverThreshold;
    const monthlyBudget = this.resolveMonthlyBudget(budgets, input, actor);
    const monthlyConsumption = this.sumCosts(this.currentMonthUsage(usageRecords, input, actor)) + estimatedCost;
    const budgetPercent = monthlyBudget && monthlyBudget > 0
      ? Math.floor((monthlyConsumption / monthlyBudget) * 100)
      : 0;
    const warningThreshold = this.resolveWarningThreshold(budgetPercent);
    const hardLimitReached = (typeof hardLimit === "number" && estimatedCost > hardLimit) ||
      warningThreshold === 100;

    return {
      softLimitWarning:
        typeof softLimit === "number" && estimatedCost >= softLimit ||
        warningThreshold === 80 ||
        warningThreshold === 90,
      hardLimitReached,
      approvalRequiredOverThreshold:
        typeof approvalThreshold === "number" && estimatedCost >= approvalThreshold,
      warningThreshold,
      monthlyBudget,
      monthlyConsumption,
      remainingBudget: monthlyBudget === undefined ? undefined : Math.max(monthlyBudget - monthlyConsumption, 0),
      blockedActionOnly: true,
      dataDeleted: false,
      platformCreatorUnlimited: false
    };
  }

  private async requireOverrideRequest(
    actor: AiGovernanceActor,
    id: string
  ): Promise<AiBudgetOverrideRequest> {
    const request = await this.repository.findOverrideRequestById(id, actor.organizationId);

    if (!request) {
      throw new NotFoundException("AI budget override request not found.");
    }

    return request;
  }

  private async audit(
    action: AiCostAuditAction,
    actor: AiGovernanceActor,
    target: {
      usageRecordId?: string;
      providerStatusId?: string;
      budgetId?: string;
      quotaId?: string;
      policyId?: string;
      overrideRequestId?: string;
    },
    afterState: object,
    beforeState?: object
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      ...target,
      action,
      actorId: actor.userId,
      beforeState,
      afterState,
      humanFinalAuthority: true,
      createdAt: new Date().toISOString()
    });
  }

  private assertAdminActor(actor: AiGovernanceActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("Authenticated AI governance context is required.");
    }

    const roles = new Set((actor.roles ?? []).map((role) => role.toUpperCase()));

    if (!roles.has("PLATFORM_CREATOR") && !roles.has("ADMIN")) {
      throw new ForbiddenException("AI governance endpoints require an authorized admin.");
    }
  }

  private async ensureProviderStatuses(actor: AiGovernanceActor): Promise<AiProviderStatusRecord[]> {
    const existing = await this.repository.listProviderStatuses(actor.organizationId);
    const now = new Date().toISOString();
    const defaults: AiProviderStatusRecord[] = [
      {
        id: `${actor.organizationId}:openai`,
        organizationId: actor.organizationId,
        provider: PRIMARY_AI_PROVIDER,
        displayName: "OpenAI",
        providerRole: "PRIMARY",
        status: "AVAILABLE",
        active: true,
        priority: 1,
        configured: true,
        supportedModels: ["automatic", "gpt-5"],
        defaultModel: "automatic",
        modelSelectionMode: "AUTOMATIC",
        fallbackToProvider: FALLBACK_AI_PROVIDER,
        createdAt: now,
        updatedAt: now,
        metadata: { extensibleProviderArchitecture: true }
      },
      {
        id: `${actor.organizationId}:anthropic`,
        organizationId: actor.organizationId,
        provider: FALLBACK_AI_PROVIDER,
        displayName: "Anthropic",
        providerRole: "FALLBACK",
        status: "AVAILABLE",
        active: false,
        priority: 2,
        configured: true,
        supportedModels: ["automatic", "claude"],
        defaultModel: "automatic",
        modelSelectionMode: "AUTOMATIC",
        createdAt: now,
        updatedAt: now,
        metadata: { fallbackFor: PRIMARY_AI_PROVIDER }
      }
    ];

    for (const provider of defaults) {
      if (!existing.some((record) => record.provider === provider.provider)) {
        existing.push(await this.repository.upsertProviderStatus(provider));
      }
    }

    return existing;
  }

  private providerSummary(providers: AiProviderStatusRecord[]): AiProviderSummary {
    const openAi = providers.find((provider) => provider.provider === PRIMARY_AI_PROVIDER);
    const anthropic = providers.find((provider) => provider.provider === FALLBACK_AI_PROVIDER);
    const primaryAvailable = openAi ? !PROVIDER_UNAVAILABLE_STATUSES.has(openAi.status) : false;
    const fallbackAvailable = anthropic ? !PROVIDER_UNAVAILABLE_STATUSES.has(anthropic.status) : false;
    const activeProvider = primaryAvailable || !fallbackAvailable ? PRIMARY_AI_PROVIDER : FALLBACK_AI_PROVIDER;
    const configuredProviders = providers
      .map((provider) => ({
        ...provider,
        active: provider.provider === activeProvider
      }))
      .sort((left, right) => left.priority - right.priority);

    return {
      configuredProviders,
      primaryProvider: PRIMARY_AI_PROVIDER,
      fallbackProvider: FALLBACK_AI_PROVIDER,
      activeProvider,
      fallbackStatus: activeProvider === FALLBACK_AI_PROVIDER
        ? "FALLBACK_ACTIVE"
        : "USING_PRIMARY",
      automaticModelSelection: true,
      manualModelSelectionRequiresRoleAndSubscription: true,
      extensibleProviderArchitecture: true
    };
  }

  private currentMonthUsage(
    usageRecords: AiUsageRecord[],
    input?: CreateAiUsageRecordInput,
    actor?: AiGovernanceActor
  ): AiUsageRecord[] {
    const now = new Date();
    const month = now.getUTCMonth();
    const year = now.getUTCFullYear();

    return usageRecords.filter((record) => {
      const created = new Date(record.createdAt);
      const sameMonth = created.getUTCMonth() === month && created.getUTCFullYear() === year;
      const sameProject = !input?.projectId || record.projectId === input.projectId;
      const sameUser = !actor || record.userId === (input?.userId ?? actor.userId);
      const sameAgent = !input?.agentName || record.agentName === input.agentName;

      return sameMonth && sameProject && sameUser && sameAgent;
    });
  }

  private resolveMonthlyBudget(
    budgets: AiBudget[],
    input: CreateAiUsageRecordInput,
    actor: AiGovernanceActor
  ): number | undefined {
    const matchingBudget = budgets.find((budget) =>
      budget.budgetScope === "PROJECT" && budget.scopeRef === input.projectId
    ) ?? budgets.find((budget) =>
      budget.budgetScope === "USER" && budget.scopeRef === (input.userId ?? actor.userId)
    ) ?? budgets.find((budget) =>
      budget.budgetScope === "AGENT" && budget.agentName === input.agentName
    ) ?? budgets.find((budget) => budget.budgetScope === "ORGANIZATION");

    return matchingBudget?.monthlyBudget ?? matchingBudget?.amount;
  }

  private resolveWarningThreshold(percent: number): AiBudgetWarningThreshold | undefined {
    if (percent >= 100) {
      return 100;
    }

    if (percent >= 90) {
      return 90;
    }

    if (percent >= 80) {
      return 80;
    }

    return undefined;
  }

  private sumCosts(usageRecords: AiUsageRecord[]): number {
    return usageRecords.reduce((sum, record) => sum + (record.actualCost ?? record.estimatedCost), 0);
  }

  private groupUsageByAgent(usageRecords: AiUsageRecord[]): AiCostSummary["consumptionByAgent"] {
    const grouped = new Map<string, { estimatedCost: number; actualCost: number }>();

    for (const record of usageRecords) {
      const value = record.agentName;
      const existing = grouped.get(value) ?? { estimatedCost: 0, actualCost: 0 };
      existing.estimatedCost += record.estimatedCost;
      existing.actualCost += record.actualCost ?? record.estimatedCost;
      grouped.set(value, existing);
    }

    return [...grouped.entries()].map(([value, costs]) => ({
      agentName: value,
      estimatedCost: costs.estimatedCost,
      actualCost: costs.actualCost
    }));
  }

  private groupUsageByProject(usageRecords: AiUsageRecord[]): AiCostSummary["consumptionByProject"] {
    const grouped = new Map<string, { estimatedCost: number; actualCost: number }>();

    for (const record of usageRecords) {
      const value = record.projectId ?? "UNASSIGNED";
      const existing = grouped.get(value) ?? { estimatedCost: 0, actualCost: 0 };
      existing.estimatedCost += record.estimatedCost;
      existing.actualCost += record.actualCost ?? record.estimatedCost;
      grouped.set(value, existing);
    }

    return [...grouped.entries()].map(([value, costs]) => ({
      projectId: value,
      estimatedCost: costs.estimatedCost,
      actualCost: costs.actualCost
    }));
  }

  private isPlatformCreator(actor: AiGovernanceActor): boolean {
    return (actor.roles ?? []).some((role) => role.toUpperCase() === "PLATFORM_CREATOR");
  }

  private validateRequired(value: string | undefined, fieldName: string): void {
    if (!value) {
      throw new BadRequestException(`${fieldName} is required.`);
    }
  }
}
