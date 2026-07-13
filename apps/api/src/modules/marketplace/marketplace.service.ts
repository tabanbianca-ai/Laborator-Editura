import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseMarketplaceRepository } from "./marketplace.repository";
import {
  type CreateMarketplaceAgentInput,
  type CreateMarketplaceExtensionInput,
  type MarketplaceActor,
  type MarketplaceAgent,
  type MarketplaceAuditAction,
  type MarketplaceAuditEvent,
  type MarketplaceCatalogItem,
  type MarketplaceExtension,
  type MarketplaceGovernanceMetadata,
  type MarketplaceInstall,
  type MarketplaceStateChangeInput
} from "./marketplace.types";

const GOVERNANCE_BASELINE: MarketplaceGovernanceMetadata = {
  adminApprovalRequired: true,
  policyEngineComplianceRequired: true,
  costGovernanceRequired: true,
  auditTrailMandatory: true,
  humanFinalAuthorityRequired: true,
  aiMaySuggest: true,
  aiMaySummarizeCatalog: true,
  aiMayDetectRisk: true,
  aiCannotSelfEnable: true,
  aiCannotInstallExtensionsAutomatically: true,
  aiCannotBypassPolicyGovernance: true,
  aiCannotBypassCostGovernance: true,
  externalPluginExecution: "NOT_CONFIGURED",
  paidMarketplace: "NOT_CONFIGURED"
};

@Injectable()
export class MarketplaceService {
  constructor(private readonly repository: DatabaseMarketplaceRepository) {}

  async listAgents(actor: MarketplaceActor): Promise<MarketplaceAgent[]> {
    this.assertAdminActor(actor);
    return this.repository.listAgents(actor.organizationId);
  }

  async createAgent(actor: MarketplaceActor, input: CreateMarketplaceAgentInput): Promise<MarketplaceAgent> {
    this.assertAdminActor(actor);
    this.validateRequired(input.agentName, "agentName");
    this.validateRequired(input.category, "category");
    this.validateRequired(input.version, "version");

    if (input.status === "ACTIVE" && input.aiSelfEnableAttempt) {
      throw new BadRequestException("AI agents cannot self-enable.");
    }

    const now = new Date().toISOString();
    const agent: MarketplaceAgent = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      agentName: input.agentName,
      category: input.category,
      version: input.version,
      providerMetadata: input.providerMetadata ?? {},
      supportedModules: input.supportedModules ?? [],
      permissionsRequired: input.permissionsRequired ?? [],
      costGovernanceLink: input.costGovernanceLink,
      policyComplianceLink: input.policyComplianceLink,
      status: input.status ?? "DRAFT",
      visibility: input.visibility ?? "ORGANIZATION",
      installMetadata: input.installMetadata,
      governance: GOVERNANCE_BASELINE,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: {
        ...(input.metadata ?? {}),
        aiSuggested: input.aiSuggested ?? false
      }
    };

    const created = await this.repository.createAgent(agent);
    await this.audit("MARKETPLACE_AGENT_CREATED", actor, { agentId: created.id }, created);

    if (created.status === "ACTIVE") {
      await this.recordInstall(actor, {
        catalogItemType: "AGENT",
        agentId: created.id,
        status: "ENABLED",
        installMetadata: created.installMetadata
      });
    }

    return created;
  }

  async enableAgent(
    actor: MarketplaceActor,
    id: string,
    input: MarketplaceStateChangeInput = {}
  ): Promise<MarketplaceAgent> {
    this.assertAdminActor(actor);

    if (input.aiInitiated) {
      throw new BadRequestException("AI agents cannot self-enable.");
    }

    const existing = await this.requireAgent(actor, id);
    const now = new Date().toISOString();
    const enabled: MarketplaceAgent = {
      ...existing,
      status: "ACTIVE",
      installMetadata: {
        ...(existing.installMetadata ?? {}),
        ...(input.installMetadata ?? {}),
        adminApprovalRequired: true,
        policyEngineComplianceRequired: true,
        costGovernanceRequired: true
      },
      enabledBy: actor.userId,
      enabledAt: now,
      updatedAt: now
    };

    const saved = await this.repository.updateAgent(enabled);
    const install = await this.recordInstall(actor, {
      catalogItemType: "AGENT",
      agentId: saved.id,
      status: "ENABLED",
      installMetadata: saved.installMetadata,
      enabledBy: actor.userId,
      enabledAt: now
    });
    await this.audit(
      "MARKETPLACE_AGENT_ENABLED",
      actor,
      { agentId: saved.id, installId: install.id },
      saved,
      existing
    );

    return saved;
  }

  async disableAgent(
    actor: MarketplaceActor,
    id: string,
    input: MarketplaceStateChangeInput = {}
  ): Promise<MarketplaceAgent> {
    this.assertAdminActor(actor);
    const existing = await this.requireAgent(actor, id);
    const now = new Date().toISOString();
    const disabled: MarketplaceAgent = {
      ...existing,
      status: "DISABLED",
      disabledBy: actor.userId,
      disabledAt: now,
      updatedAt: now
    };

    const saved = await this.repository.updateAgent(disabled);
    const install = await this.recordInstall(actor, {
      catalogItemType: "AGENT",
      agentId: saved.id,
      status: "DISABLED",
      disableMetadata: input.disableMetadata,
      disabledBy: actor.userId,
      disabledAt: now
    });
    await this.audit(
      "MARKETPLACE_AGENT_DISABLED",
      actor,
      { agentId: saved.id, installId: install.id },
      saved,
      existing
    );

    return saved;
  }

  async listExtensions(actor: MarketplaceActor): Promise<MarketplaceExtension[]> {
    this.assertAdminActor(actor);
    return this.repository.listExtensions(actor.organizationId);
  }

  async createExtension(
    actor: MarketplaceActor,
    input: CreateMarketplaceExtensionInput
  ): Promise<MarketplaceExtension> {
    this.assertAdminActor(actor);
    this.validateRequired(input.moduleName, "moduleName");
    this.validateRequired(input.integrationType, "integrationType");

    if (input.status === "ACTIVE" && input.aiAutoInstallAttempt) {
      throw new BadRequestException("AI cannot install extensions automatically.");
    }

    const now = new Date().toISOString();
    const extension: MarketplaceExtension = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      moduleName: input.moduleName,
      capabilities: input.capabilities ?? [],
      integrationType: input.integrationType,
      requiredScopes: input.requiredScopes ?? [],
      tenantAvailability: input.tenantAvailability ?? [actor.organizationId],
      status: input.status ?? "DRAFT",
      visibility: input.visibility ?? "ORGANIZATION",
      installMetadata: input.installMetadata,
      governance: GOVERNANCE_BASELINE,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: {
        ...(input.metadata ?? {}),
        aiSuggested: input.aiSuggested ?? false
      }
    };

    const created = await this.repository.createExtension(extension);
    await this.audit("MARKETPLACE_EXTENSION_CREATED", actor, { extensionId: created.id }, created);

    if (created.status === "ACTIVE") {
      await this.recordInstall(actor, {
        catalogItemType: "EXTENSION",
        extensionId: created.id,
        status: "ENABLED",
        installMetadata: created.installMetadata
      });
    }

    return created;
  }

  async enableExtension(
    actor: MarketplaceActor,
    id: string,
    input: MarketplaceStateChangeInput = {}
  ): Promise<MarketplaceExtension> {
    this.assertAdminActor(actor);

    if (input.aiInitiated) {
      throw new BadRequestException("AI cannot install extensions automatically.");
    }

    const existing = await this.requireExtension(actor, id);
    const now = new Date().toISOString();
    const enabled: MarketplaceExtension = {
      ...existing,
      status: "ACTIVE",
      installMetadata: {
        ...(existing.installMetadata ?? {}),
        ...(input.installMetadata ?? {}),
        adminApprovalRequired: true,
        policyEngineComplianceRequired: true,
        costGovernanceRequired: true
      },
      enabledBy: actor.userId,
      enabledAt: now,
      updatedAt: now
    };

    const saved = await this.repository.updateExtension(enabled);
    const install = await this.recordInstall(actor, {
      catalogItemType: "EXTENSION",
      extensionId: saved.id,
      status: "ENABLED",
      installMetadata: saved.installMetadata,
      enabledBy: actor.userId,
      enabledAt: now
    });
    await this.audit(
      "MARKETPLACE_EXTENSION_ENABLED",
      actor,
      { extensionId: saved.id, installId: install.id },
      saved,
      existing
    );

    return saved;
  }

  async disableExtension(
    actor: MarketplaceActor,
    id: string,
    input: MarketplaceStateChangeInput = {}
  ): Promise<MarketplaceExtension> {
    this.assertAdminActor(actor);
    const existing = await this.requireExtension(actor, id);
    const now = new Date().toISOString();
    const disabled: MarketplaceExtension = {
      ...existing,
      status: "DISABLED",
      disabledBy: actor.userId,
      disabledAt: now,
      updatedAt: now
    };

    const saved = await this.repository.updateExtension(disabled);
    const install = await this.recordInstall(actor, {
      catalogItemType: "EXTENSION",
      extensionId: saved.id,
      status: "DISABLED",
      disableMetadata: input.disableMetadata,
      disabledBy: actor.userId,
      disabledAt: now
    });
    await this.audit(
      "MARKETPLACE_EXTENSION_DISABLED",
      actor,
      { extensionId: saved.id, installId: install.id },
      saved,
      existing
    );

    return saved;
  }

  async listCatalog(actor: MarketplaceActor): Promise<MarketplaceCatalogItem[]> {
    this.assertAdminActor(actor);
    const [agents, extensions] = await Promise.all([
      this.repository.listAgents(actor.organizationId),
      this.repository.listExtensions(actor.organizationId)
    ]);

    return [
      ...agents.map((agent): MarketplaceCatalogItem => ({
        id: agent.id,
        organizationId: agent.organizationId,
        catalogItemType: "AGENT",
        name: agent.agentName,
        version: agent.version,
        status: agent.status,
        visibility: agent.visibility,
        supportedModules: agent.supportedModules,
        installMetadata: agent.installMetadata,
        governance: agent.governance
      })),
      ...extensions.map((extension): MarketplaceCatalogItem => ({
        id: extension.id,
        organizationId: extension.organizationId,
        catalogItemType: "EXTENSION",
        name: extension.moduleName,
        version: "metadata-only",
        status: extension.status,
        visibility: extension.visibility,
        capabilities: extension.capabilities,
        installMetadata: extension.installMetadata,
        governance: extension.governance
      }))
    ];
  }

  async listAudit(actor: MarketplaceActor): Promise<MarketplaceAuditEvent[]> {
    this.assertAdminActor(actor);
    return this.repository.listAuditEvents(actor.organizationId);
  }

  private async recordInstall(
    actor: MarketplaceActor,
    input: {
      catalogItemType: "AGENT" | "EXTENSION";
      agentId?: string;
      extensionId?: string;
      status: "ENABLED" | "DISABLED";
      installMetadata?: object;
      disableMetadata?: object;
      enabledBy?: string;
      enabledAt?: string;
      disabledBy?: string;
      disabledAt?: string;
    }
  ): Promise<MarketplaceInstall> {
    const now = new Date().toISOString();
    const install: MarketplaceInstall = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      agentId: input.agentId,
      extensionId: input.extensionId,
      catalogItemType: input.catalogItemType,
      status: input.status,
      enabledBy: input.enabledBy,
      enabledAt: input.enabledAt,
      disabledBy: input.disabledBy,
      disabledAt: input.disabledAt,
      installMetadata: input.installMetadata,
      disableMetadata: input.disableMetadata,
      adminApprovalRequired: true,
      humanFinalAuthorityRequired: true,
      policyEngineComplianceRequired: true,
      costGovernanceRequired: true,
      externalPluginExecution: "NOT_CONFIGURED",
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repository.createInstall(install);
    await this.audit("MARKETPLACE_INSTALL_RECORDED", actor, { installId: created.id }, created);

    return created;
  }

  private async requireAgent(actor: MarketplaceActor, id: string): Promise<MarketplaceAgent> {
    const agent = await this.repository.findAgentById(id, actor.organizationId);

    if (!agent) {
      throw new NotFoundException("Marketplace agent not found.");
    }

    return agent;
  }

  private async requireExtension(actor: MarketplaceActor, id: string): Promise<MarketplaceExtension> {
    const extension = await this.repository.findExtensionById(id, actor.organizationId);

    if (!extension) {
      throw new NotFoundException("Marketplace extension not found.");
    }

    return extension;
  }

  private async audit(
    action: MarketplaceAuditAction,
    actor: MarketplaceActor,
    refs: { agentId?: string; extensionId?: string; installId?: string },
    afterState?: object,
    beforeState?: object
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      actorId: actor.userId,
      action,
      ...refs,
      beforeState,
      afterState,
      humanFinalAuthority: true,
      createdAt: new Date().toISOString()
    });
  }

  private assertAdminActor(actor: MarketplaceActor): void {
    if (!actor.roles.includes("PLATFORM_CREATOR") && !actor.roles.includes("ADMIN")) {
      throw new ForbiddenException("Marketplace endpoints require an authorized admin.");
    }
  }

  private validateRequired(value: unknown, fieldName: string): void {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new BadRequestException(`${fieldName} is required.`);
    }
  }
}
