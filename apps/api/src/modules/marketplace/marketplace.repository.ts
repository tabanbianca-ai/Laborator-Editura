import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type MarketplaceAgent,
  type MarketplaceAuditEvent,
  type MarketplaceExtension,
  type MarketplaceInstall,
  type MarketplaceRepository
} from "./marketplace.types";

@Injectable()
export class DatabaseMarketplaceRepository implements MarketplaceRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createAgent(agent: MarketplaceAgent): Promise<MarketplaceAgent> {
    return this.database.insert("marketplace_agents", agent);
  }

  async updateAgent(agent: MarketplaceAgent): Promise<MarketplaceAgent> {
    return this.database.upsert("marketplace_agents", agent);
  }

  async findAgentById(id: string, organizationId: string): Promise<MarketplaceAgent | null> {
    return this.database.findByIdForTenant<MarketplaceAgent>("marketplace_agents", id, organizationId);
  }

  async listAgents(organizationId: string): Promise<MarketplaceAgent[]> {
    return this.database.selectForTenant<MarketplaceAgent>("marketplace_agents", organizationId);
  }

  async createExtension(extension: MarketplaceExtension): Promise<MarketplaceExtension> {
    return this.database.insert("marketplace_extensions", extension);
  }

  async updateExtension(extension: MarketplaceExtension): Promise<MarketplaceExtension> {
    return this.database.upsert("marketplace_extensions", extension);
  }

  async findExtensionById(id: string, organizationId: string): Promise<MarketplaceExtension | null> {
    return this.database.findByIdForTenant<MarketplaceExtension>(
      "marketplace_extensions",
      id,
      organizationId
    );
  }

  async listExtensions(organizationId: string): Promise<MarketplaceExtension[]> {
    return this.database.selectForTenant<MarketplaceExtension>("marketplace_extensions", organizationId);
  }

  async createInstall(install: MarketplaceInstall): Promise<MarketplaceInstall> {
    return this.database.insert("marketplace_installs", install);
  }

  async appendAuditEvent(event: MarketplaceAuditEvent): Promise<void> {
    this.database.insert("marketplace_audit_events", event);
  }

  async listAuditEvents(organizationId: string): Promise<MarketplaceAuditEvent[]> {
    return this.database.selectForTenant<MarketplaceAuditEvent>("marketplace_audit_events", organizationId);
  }
}
