import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseAiGovernanceRepository } from "./ai-governance.repository";
import {
  type AiBudget,
  type AiBudgetOverrideRequest,
  type AiCostAuditAction,
  type AiCostAuditEvent,
  type AiCostPolicy,
  type AiGovernanceActor,
  type AiOverrideDecisionInput,
  type AiQuota,
  type AiUsageRecord,
  type CreateAiBudgetInput,
  type CreateAiBudgetOverrideRequestInput,
  type CreateAiCostPolicyInput,
  type CreateAiQuotaInput,
  type CreateAiUsageRecordInput
} from "./ai-governance.types";

@Injectable()
export class AiGovernanceService {
  constructor(private readonly repository: DatabaseAiGovernanceRepository) {}

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
    const policyEvaluation = await this.evaluatePolicy(actor, estimatedCost);
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
    estimatedCost: number
  ): Promise<AiUsageRecord["costPolicyEvaluation"]> {
    const policies = await this.repository.listPolicies(actor.organizationId);
    const activePolicy = policies.find((policy) => policy.status === "ACTIVE");
    const softLimit = activePolicy?.softLimitWarningThreshold;
    const hardLimit = activePolicy?.hardLimitMetadata?.maxCostPerRun;
    const approvalThreshold = activePolicy?.approvalRequiredOverThreshold;

    return {
      softLimitWarning: typeof softLimit === "number" && estimatedCost >= softLimit,
      hardLimitReached: typeof hardLimit === "number" && estimatedCost > hardLimit,
      approvalRequiredOverThreshold:
        typeof approvalThreshold === "number" && estimatedCost >= approvalThreshold
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

    if (!roles.has("ADMIN")) {
      throw new ForbiddenException("AI governance endpoints require an authorized admin.");
    }
  }

  private validateRequired(value: string | undefined, fieldName: string): void {
    if (!value) {
      throw new BadRequestException(`${fieldName} is required.`);
    }
  }
}
