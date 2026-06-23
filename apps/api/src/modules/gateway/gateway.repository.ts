import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type GatewayApiKey,
  type GatewayAuditEvent,
  type GatewayRepository,
  type GatewayRouteRegistryEntry,
  type IntegrationAuditEvent,
  type IntegrationProvider,
  type Webhook,
  type WebhookDeliveryLog
} from "./gateway.types";

@Injectable()
export class DatabaseGatewayRepository implements GatewayRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createRouteRegistryEntry(entry: GatewayRouteRegistryEntry): Promise<GatewayRouteRegistryEntry> {
    return this.database.insert("gateway_route_registry", entry);
  }

  async listRouteRegistry(organizationId: string): Promise<GatewayRouteRegistryEntry[]> {
    return this.database.selectForTenant<GatewayRouteRegistryEntry>("gateway_route_registry", organizationId);
  }

  async createApiKey(apiKey: GatewayApiKey): Promise<GatewayApiKey> {
    return this.database.insert("gateway_api_keys", apiKey);
  }

  async updateApiKey(apiKey: GatewayApiKey): Promise<GatewayApiKey> {
    return this.database.upsert("gateway_api_keys", apiKey);
  }

  async findApiKeyById(id: string, organizationId: string): Promise<GatewayApiKey | null> {
    return this.database.findByIdForTenant<GatewayApiKey>("gateway_api_keys", id, organizationId);
  }

  async listApiKeys(organizationId: string): Promise<GatewayApiKey[]> {
    return this.database.selectForTenant<GatewayApiKey>("gateway_api_keys", organizationId);
  }

  async createIntegration(provider: IntegrationProvider): Promise<IntegrationProvider> {
    return this.database.insert("integration_providers", provider);
  }

  async updateIntegration(provider: IntegrationProvider): Promise<IntegrationProvider> {
    return this.database.upsert("integration_providers", provider);
  }

  async findIntegrationById(id: string, organizationId: string): Promise<IntegrationProvider | null> {
    return this.database.findByIdForTenant<IntegrationProvider>("integration_providers", id, organizationId);
  }

  async listIntegrations(organizationId: string): Promise<IntegrationProvider[]> {
    return this.database.selectForTenant<IntegrationProvider>("integration_providers", organizationId);
  }

  async createWebhook(webhook: Webhook): Promise<Webhook> {
    return this.database.insert("webhooks", webhook);
  }

  async updateWebhook(webhook: Webhook): Promise<Webhook> {
    return this.database.upsert("webhooks", webhook);
  }

  async findWebhookById(id: string, organizationId: string): Promise<Webhook | null> {
    return this.database.findByIdForTenant<Webhook>("webhooks", id, organizationId);
  }

  async listWebhooks(organizationId: string): Promise<Webhook[]> {
    return this.database.selectForTenant<Webhook>("webhooks", organizationId);
  }

  async createWebhookDeliveryLog(log: WebhookDeliveryLog): Promise<WebhookDeliveryLog> {
    return this.database.insert("webhook_delivery_logs", log);
  }

  async appendGatewayAuditEvent(event: GatewayAuditEvent): Promise<void> {
    this.database.insert("gateway_audit_events", event);
  }

  async appendIntegrationAuditEvent(event: IntegrationAuditEvent): Promise<void> {
    this.database.insert("integration_audit_events", event);
  }
}
