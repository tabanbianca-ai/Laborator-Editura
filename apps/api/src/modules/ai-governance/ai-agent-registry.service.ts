import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import { listCanonicalAiAgentIdentities, resolveAiAgentIdentity } from "./ai-agent-identity";
import { DatabaseAiGovernanceRepository } from "./ai-governance.repository";
import { type AiGovernanceActor, type AiCostAuditAction } from "./ai-governance.types";
import { type AgentConfigurationVersion, type AgentRegistryRecord } from "./ai-agent-registry.types";

const identifier = z.string().trim().min(1).max(120).regex(/^[a-zA-Z0-9._:/-]+$/u);
const configurationSchema = z.object({
  bindings: z.array(z.object({
    capabilityId: identifier,
    operationId: identifier,
    handlerKey: identifier,
    inputSchemaRef: identifier,
    outputSchemaRef: identifier,
    requiredPermissions: z.array(identifier).min(1).max(32)
  }).strict()).max(64),
  reason: z.string().trim().min(1).max(2000)
}).strict();
const decisionSchema = z.object({
  configurationSha256: z.string().regex(/^[a-f0-9]{64}$/u),
  reason: z.string().trim().min(1).max(2000)
}).strict();

@Injectable()
export class AiAgentRegistryService {
  constructor(private readonly repository: DatabaseAiGovernanceRepository) {}

  listAgents(actor: AiGovernanceActor) {
    this.assertAdmin(actor);
    return listCanonicalAiAgentIdentities().map((identity) => this.getAgent(actor, identity.agentId));
  }

  getAgent(actor: AiGovernanceActor, agentId: string) {
    this.assertAdmin(actor);
    const identity = this.identity(agentId);
    const registry = this.repository.findAgentRegistry(actor.organizationId, identity.agentId);
    const active = registry?.activeVersionId
      ? this.repository.listAgentVersions(actor.organizationId, registry.id)
        .find((version) => version.id === registry.activeVersionId)
      : undefined;
    return {
      ...identity,
      status: registry?.enabled && active?.status === "ACTIVE" ? "ACTIVE" : "DISABLED",
      activeVersion: active?.version ?? null,
      activeVersionId: active?.id ?? null,
      availability: {
        status: "UNAVAILABLE" as const,
        executable: false as const,
        reason: "EXECUTION_RUNTIME_NOT_IMPLEMENTED",
        validatedBindingCount: 0
      }
    };
  }

  listVersions(actor: AiGovernanceActor, agentId: string) {
    this.assertAdmin(actor);
    const identity = this.identity(agentId);
    const registry = this.repository.findAgentRegistry(actor.organizationId, identity.agentId);
    return registry ? this.repository.listAgentVersions(actor.organizationId, registry.id) : [];
  }

  async createDraft(actor: AiGovernanceActor, agentId: string, input: unknown) {
    this.assertAdmin(actor);
    const identity = this.identity(agentId);
    const configuration = this.parseConfiguration(input);
    const now = new Date().toISOString();
    const registry = this.repository.findAgentRegistry(actor.organizationId, identity.agentId) ??
      this.repository.saveAgentRegistry({
        id: randomUUID(), organizationId: actor.organizationId, canonicalAgentId: identity.agentId,
        enabled: false, createdBy: actor.userId, updatedBy: actor.userId,
        createdAt: now, updatedAt: now
      });
    const versions = this.repository.listAgentVersions(actor.organizationId, registry.id);
    const version = this.repository.saveAgentVersion({
      id: randomUUID(), organizationId: actor.organizationId, registryId: registry.id,
      version: Math.max(0, ...versions.map((item) => item.version)) + 1,
      revision: 1, governanceVersion: identity.governanceVersion,
      configurationSha256: this.digest(configuration.bindings, identity.governanceVersion),
      ...configuration, status: "DRAFT", createdBy: actor.userId, updatedBy: actor.userId,
      createdAt: now, updatedAt: now
    });
    await this.audit(actor, "AI_AGENT_DRAFT_CREATED", undefined, version);
    return version;
  }

  async updateDraft(actor: AiGovernanceActor, agentId: string, versionId: string, input: unknown) {
    this.assertAdmin(actor);
    const version = this.version(actor, agentId, versionId);
    if (version.status !== "DRAFT") throw new ConflictException("Only draft configurations can be edited.");
    const configuration = this.parseConfiguration(input);
    const updated = this.repository.saveAgentVersion({
      ...version, ...configuration, revision: version.revision + 1,
      configurationSha256: this.digest(configuration.bindings, version.governanceVersion),
      updatedBy: actor.userId, updatedAt: new Date().toISOString()
    });
    await this.audit(actor, "AI_AGENT_DRAFT_UPDATED", version, updated);
    return updated;
  }

  async approveVersion(actor: AiGovernanceActor, agentId: string, versionId: string, input: unknown) {
    this.assertAdmin(actor);
    const version = this.version(actor, agentId, versionId);
    this.validateDecision(version, input);
    if (version.status !== "DRAFT") throw new ConflictException("Only draft configurations can be approved.");
    const now = new Date().toISOString();
    const updated = this.repository.saveAgentVersion({
      ...version, status: "APPROVED", approvedBy: actor.userId, approvedAt: now,
      updatedBy: actor.userId, updatedAt: now
    });
    await this.audit(actor, "AI_AGENT_VERSION_APPROVED", version, { ...updated, decision: input });
    return updated;
  }

  async activateVersion(actor: AiGovernanceActor, agentId: string, versionId: string, input: unknown) {
    this.assertAdmin(actor);
    const version = this.version(actor, agentId, versionId);
    this.validateDecision(version, input);
    if (version.status !== "APPROVED" || !version.approvedBy || !version.approvedAt) {
      throw new ForbiddenException("Activation requires approval of the exact configuration version by a human.");
    }
    const identity = this.identity(agentId);
    if (version.governanceVersion !== identity.governanceVersion) {
      throw new ConflictException("Governance changed; create and approve a new configuration version.");
    }
    const registry = this.repository.findAgentRegistry(actor.organizationId, identity.agentId)!;
    const now = new Date().toISOString();
    const updated = this.repository.saveAgentVersion({
      ...version, status: "ACTIVE", activatedBy: actor.userId, activatedAt: now,
      updatedBy: actor.userId, updatedAt: now
    });
    this.repository.saveAgentRegistry({
      ...registry, enabled: true, activeVersionId: updated.id,
      updatedBy: actor.userId, updatedAt: now
    });
    await this.audit(actor, "AI_AGENT_VERSION_ACTIVATED", version, { ...updated, decision: input });
    return this.getAgent(actor, agentId);
  }

  async disableAgent(actor: AiGovernanceActor, agentId: string, input: unknown) {
    this.assertAdmin(actor);
    const parsed = z.object({ reason: z.string().trim().min(1).max(2000) }).strict().safeParse(input);
    if (!parsed.success) throw new BadRequestException("A disable reason is required.");
    const identity = this.identity(agentId);
    const registry = this.repository.findAgentRegistry(actor.organizationId, identity.agentId);
    if (!registry) throw new NotFoundException("Agent has no tenant configuration.");
    const updated: AgentRegistryRecord = this.repository.saveAgentRegistry({
      ...registry, enabled: false, updatedBy: actor.userId, updatedAt: new Date().toISOString()
    });
    await this.audit(actor, "AI_AGENT_DISABLED", registry, { ...updated, reason: parsed.data.reason });
    return this.getAgent(actor, agentId);
  }

  private identity(agentId: string) {
    const resolved = resolveAiAgentIdentity(agentId);
    if (resolved.status !== "RESOLVED") {
      throw new BadRequestException("Agent identity is unknown or ambiguous.");
    }
    return resolved.identity;
  }

  private version(actor: AiGovernanceActor, agentId: string, versionId: string): AgentConfigurationVersion {
    const version = this.listVersions(actor, agentId).find((item) => item.id === versionId);
    if (!version) throw new NotFoundException("Agent configuration version not found.");
    return version;
  }

  private parseConfiguration(input: unknown) {
    const result = configurationSchema.safeParse(input);
    if (!result.success) throw new BadRequestException("Invalid agent configuration.");
    const operations = result.data.bindings.map((binding) => binding.operationId);
    if (new Set(operations).size !== operations.length) {
      throw new BadRequestException("Operation bindings must be unique.");
    }
    return result.data;
  }

  private digest(bindings: AgentConfigurationVersion["bindings"], governanceVersion: string) {
    const canonicalBindings = bindings.map((binding) => ({
      capabilityId: binding.capabilityId,
      operationId: binding.operationId,
      handlerKey: binding.handlerKey,
      inputSchemaRef: binding.inputSchemaRef,
      outputSchemaRef: binding.outputSchemaRef,
      requiredPermissions: binding.requiredPermissions
    }));
    return createHash("sha256").update(JSON.stringify({ bindings: canonicalBindings, governanceVersion })).digest("hex");
  }

  private validateDecision(version: AgentConfigurationVersion, input: unknown) {
    const parsed = decisionSchema.safeParse(input);
    if (!parsed.success) throw new BadRequestException("Configuration digest and decision reason are required.");
    if (parsed.data.configurationSha256 !== version.configurationSha256 ||
      this.digest(version.bindings, version.governanceVersion) !== version.configurationSha256) {
      throw new ConflictException("Agent configuration digest mismatch.");
    }
  }

  private assertAdmin(actor: AiGovernanceActor) {
    const roles = (actor.roles ?? []).map((role) => role.toUpperCase());
    if (!actor.userId || !actor.organizationId ||
      roles.some((role) => /(^|_)(AI|AGENT|SYSTEM|AUTOMATION)($|_)/u.test(role)) ||
      !roles.some((role) => role === "ADMIN" || role === "PLATFORM_CREATOR")) {
      throw new ForbiddenException("Agent registry requires an authenticated human administrator.");
    }
  }

  private async audit(actor: AiGovernanceActor, action: AiCostAuditAction, beforeState: object | undefined, afterState: object) {
    await this.repository.appendAuditEvent({
      id: randomUUID(), organizationId: actor.organizationId, action, actorId: actor.userId,
      beforeState, afterState, humanFinalAuthority: true, createdAt: new Date().toISOString()
    });
  }
}
