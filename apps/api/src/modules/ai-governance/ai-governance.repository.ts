import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import { ConflictException } from "@nestjs/common";
import { type AgentRegistryRecord, type AgentConfigurationVersion } from "./ai-agent-registry.types";
import {
  type AiBudget,
  type AiBudgetOverrideRequest,
  type AiCostAuditEvent,
  type AiCostPolicy,
  type AiGovernanceRepository,
  type AiProviderName,
  type AiProviderStatusRecord,
  type AiQuota,
  type AiUsageRecord
} from "./ai-governance.types";

@Injectable()
export class DatabaseAiGovernanceRepository implements AiGovernanceRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  findAgentRegistry(organizationId: string, canonicalAgentId: string): AgentRegistryRecord | null {
    return this.database.selectForTenant<AgentRegistryRecord>(
      "ai_agent_registry", organizationId,
      (row) => row.canonicalAgentId === canonicalAgentId
    )[0] ?? null;
  }

  saveAgentRegistry(record: AgentRegistryRecord): AgentRegistryRecord {
    return this.database.upsert("ai_agent_registry", record);
  }

  listAgentVersions(organizationId: string, registryId: string): AgentConfigurationVersion[] {
    return this.database.selectForTenant<AgentConfigurationVersion>(
      "ai_agent_configuration_versions", organizationId, (row) => row.registryId === registryId
    ).sort((a, b) => a.version - b.version);
  }

  saveAgentVersion(version: AgentConfigurationVersion): AgentConfigurationVersion {
    const current = this.database.findByIdForTenant<AgentConfigurationVersion>(
      "ai_agent_configuration_versions", version.id, version.organizationId
    );
    const immutable = (row: AgentConfigurationVersion) => {
      const copy: Record<string, unknown> = { ...row };
      for (const key of ["status", "activatedBy", "activatedAt", "updatedBy", "updatedAt"]) delete copy[key];
      return JSON.stringify(Object.entries(copy).sort(([a], [b]) => a.localeCompare(b)));
    };
    if (current && (current.status === "ACTIVE" ||
      (current.status === "APPROVED" && (version.status !== "ACTIVE" ||
        immutable(current) !== immutable(version))))) {
      throw new ConflictException("Approved agent configuration is immutable.");
    }
    return this.database.upsert("ai_agent_configuration_versions", version);
  }

  async upsertProviderStatus(provider: AiProviderStatusRecord): Promise<AiProviderStatusRecord> {
    return this.database.upsert("ai_provider_statuses", provider);
  }

  async findProviderStatusByProvider(
    provider: AiProviderName,
    organizationId: string
  ): Promise<AiProviderStatusRecord | null> {
    return this.database.selectForTenant<AiProviderStatusRecord>(
      "ai_provider_statuses",
      organizationId,
      (status) => status.provider === provider
    )[0] ?? null;
  }

  async listProviderStatuses(organizationId: string): Promise<AiProviderStatusRecord[]> {
    return this.database.selectForTenant<AiProviderStatusRecord>("ai_provider_statuses", organizationId);
  }

  async createUsageRecord(record: AiUsageRecord): Promise<AiUsageRecord> {
    return this.database.insert("ai_usage_records", record);
  }

  async listUsageRecords(organizationId: string): Promise<AiUsageRecord[]> {
    return this.database.selectForTenant<AiUsageRecord>("ai_usage_records", organizationId);
  }

  async createBudget(budget: AiBudget): Promise<AiBudget> {
    return this.database.insert("ai_budgets", budget);
  }

  async findBudgetById(id: string, organizationId: string): Promise<AiBudget | null> {
    return this.database.findByIdForTenant<AiBudget>("ai_budgets", id, organizationId);
  }

  async listBudgets(organizationId: string): Promise<AiBudget[]> {
    return this.database.selectForTenant<AiBudget>("ai_budgets", organizationId);
  }

  async createQuota(quota: AiQuota): Promise<AiQuota> {
    return this.database.insert("ai_quotas", quota);
  }

  async findQuotaById(id: string, organizationId: string): Promise<AiQuota | null> {
    return this.database.findByIdForTenant<AiQuota>("ai_quotas", id, organizationId);
  }

  async listQuotas(organizationId: string): Promise<AiQuota[]> {
    return this.database.selectForTenant<AiQuota>("ai_quotas", organizationId);
  }

  async createPolicy(policy: AiCostPolicy): Promise<AiCostPolicy> {
    return this.database.insert("ai_cost_policies", policy);
  }

  async listPolicies(organizationId: string): Promise<AiCostPolicy[]> {
    return this.database.selectForTenant<AiCostPolicy>("ai_cost_policies", organizationId);
  }

  async createOverrideRequest(
    request: AiBudgetOverrideRequest
  ): Promise<AiBudgetOverrideRequest> {
    return this.database.insert("ai_budget_override_requests", request);
  }

  async updateOverrideRequest(
    request: AiBudgetOverrideRequest
  ): Promise<AiBudgetOverrideRequest> {
    return this.database.upsert("ai_budget_override_requests", request);
  }

  async findOverrideRequestById(
    id: string,
    organizationId: string
  ): Promise<AiBudgetOverrideRequest | null> {
    return this.database.findByIdForTenant<AiBudgetOverrideRequest>(
      "ai_budget_override_requests",
      id,
      organizationId
    );
  }

  async appendAuditEvent(event: AiCostAuditEvent): Promise<void> {
    this.database.insert("ai_cost_audit_events", event);
  }

  async listAuditEvents(organizationId: string): Promise<AiCostAuditEvent[]> {
    return this.database.selectForTenant<AiCostAuditEvent>("ai_cost_audit_events", organizationId);
  }
}
