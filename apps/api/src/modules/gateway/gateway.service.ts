import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { DatabaseGatewayRepository } from "./gateway.repository";
import {
  type CreateGatewayApiKeyResult,
  type CreateGatewayApiKeyInput,
  type CreateIntegrationProviderInput,
  type CreateWebhookInput,
  type GatewayActor,
  type GatewayApiKey,
  type GatewayApiKeyView,
  type GatewayAuditAction,
  type GatewayHealth,
  type GatewayRouteRegistryEntry,
  type IntegrationAuditAction,
  type IntegrationProvider,
  type IntegrationStateChangeInput,
  type Webhook,
  type WebhookDeliveryLog,
  type WebhookStateChangeInput
} from "./gateway.types";

const ROUTE_DEFINITIONS: Array<Pick<GatewayRouteRegistryEntry, "moduleName" | "routePath" | "method" | "rateLimitPolicy">> = [
  { moduleName: "Gateway", routePath: "/gateway/health", method: "GET", rateLimitPolicy: "standard-read" },
  { moduleName: "Gateway", routePath: "/gateway/routes", method: "GET", rateLimitPolicy: "standard-read" },
  { moduleName: "Gateway", routePath: "/gateway/modules", method: "GET", rateLimitPolicy: "standard-read" },
  { moduleName: "Gateway API Keys", routePath: "/gateway/api-keys", method: "POST", rateLimitPolicy: "sensitive-write" },
  { moduleName: "Gateway API Keys", routePath: "/gateway/api-keys", method: "GET", rateLimitPolicy: "standard-read" },
  { moduleName: "Gateway API Keys", routePath: "/gateway/api-keys/:id/revoke", method: "POST", rateLimitPolicy: "sensitive-write" },
  { moduleName: "Integrations", routePath: "/integrations", method: "POST", rateLimitPolicy: "sensitive-write" },
  { moduleName: "Integrations", routePath: "/integrations", method: "GET", rateLimitPolicy: "standard-read" },
  { moduleName: "Integrations", routePath: "/integrations/:id", method: "GET", rateLimitPolicy: "standard-read" },
  { moduleName: "Integrations", routePath: "/integrations/:id/enable", method: "POST", rateLimitPolicy: "sensitive-write" },
  { moduleName: "Integrations", routePath: "/integrations/:id/disable", method: "POST", rateLimitPolicy: "sensitive-write" },
  { moduleName: "Webhooks", routePath: "/webhooks", method: "POST", rateLimitPolicy: "sensitive-write" },
  { moduleName: "Webhooks", routePath: "/webhooks", method: "GET", rateLimitPolicy: "standard-read" },
  { moduleName: "Webhooks", routePath: "/webhooks/:id/enable", method: "POST", rateLimitPolicy: "sensitive-write" },
  { moduleName: "Webhooks", routePath: "/webhooks/:id/disable", method: "POST", rateLimitPolicy: "sensitive-write" }
];

@Injectable()
export class GatewayService {
  constructor(private readonly repository: DatabaseGatewayRepository) {}

  async getHealth(actor: GatewayActor): Promise<GatewayHealth> {
    this.validateActor(actor);
    const modules = await this.getModules(actor);

    return {
      name: "Laboratorul Editurii API Gateway",
      status: "ok",
      apiVersion: "v1",
      tenantAware: true,
      correlationIds: "enabled",
      requestTracing: "enabled",
      rateLimitingMetadata: "configured",
      modules,
      checkedAt: new Date().toISOString()
    };
  }

  async getRoutes(actor: GatewayActor): Promise<GatewayRouteRegistryEntry[]> {
    this.validateActor(actor);
    const persisted = await this.repository.listRouteRegistry(actor.organizationId);

    if (persisted.length > 0) {
      return persisted;
    }

    const now = new Date().toISOString();
    const entries: GatewayRouteRegistryEntry[] = ROUTE_DEFINITIONS.map((route): GatewayRouteRegistryEntry => ({
      id: this.routeId(actor.organizationId, route.method, route.routePath),
      organizationId: actor.organizationId,
      ...route,
      apiVersion: "v1",
      tenantAware: true,
      tracingEnabled: true,
      correlationIdRequired: true,
      createdAt: now
    }));

    const created: GatewayRouteRegistryEntry[] = [];

    for (const entry of entries) {
      created.push(await this.repository.createRouteRegistryEntry(entry));
    }

    return created;
  }

  async getModules(actor: GatewayActor): Promise<string[]> {
    const routes = await this.getRoutes(actor);
    return [...new Set(routes.map((route) => route.moduleName))].sort();
  }

  async createApiKey(
    actor: GatewayActor,
    input: CreateGatewayApiKeyInput
  ): Promise<CreateGatewayApiKeyResult> {
    this.validateActor(actor);
    this.rejectAiInitiated(input.aiInitiated, "AI cannot create active API secrets.");

    if (!input.name) {
      throw new BadRequestException("api key name is required.");
    }

    const secret = this.generateSecret();
    const now = new Date().toISOString();
    const apiKey: GatewayApiKey = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      name: input.name,
      keyPrefix: secret.slice(0, 12),
      secretHash: this.hashSecret(secret),
      scopes: input.scopes ?? ["gateway:read"],
      expiresAt: input.expiresAt,
      status: "ACTIVE",
      usageMetadata: {
        createdFromGateway: true,
        usageCount: 0
      },
      humanApprovalRequired: true,
      aiSuggested: input.aiSuggested ?? false,
      createdBy: actor.userId,
      createdAt: now
    };

    const created = await this.repository.createApiKey(apiKey);
    await this.gatewayAudit("API_KEY_CREATED", actor, { apiKeyId: created.id }, undefined, created);

    return {
      apiKey: this.toApiKeyView(created),
      secret,
      secretPreview: `${created.keyPrefix}...`
    };
  }

  async revokeApiKey(actor: GatewayActor, id: string): Promise<GatewayApiKeyView> {
    this.validateActor(actor);
    const existing = await this.requireApiKey(actor, id);
    const revoked: GatewayApiKey = {
      ...existing,
      status: "REVOKED",
      revokedBy: actor.userId,
      revokedAt: new Date().toISOString()
    };

    const saved = await this.repository.updateApiKey(revoked);
    await this.gatewayAudit("API_KEY_REVOKED", actor, { apiKeyId: saved.id }, existing, saved);

    return this.toApiKeyView(saved);
  }

  async listApiKeys(actor: GatewayActor): Promise<GatewayApiKeyView[]> {
    this.validateActor(actor);
    const apiKeys = await this.repository.listApiKeys(actor.organizationId);
    return apiKeys.map((apiKey) => this.toApiKeyView(apiKey));
  }

  async createIntegration(actor: GatewayActor, input: CreateIntegrationProviderInput): Promise<IntegrationProvider> {
    this.validateActor(actor);
    this.rejectAiInitiated(input.aiInitiated, "AI cannot create active integration secrets.");

    if (!input.providerType) {
      throw new BadRequestException("providerType is required.");
    }

    const now = new Date().toISOString();
    const provider: IntegrationProvider = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      providerType: input.providerType,
      displayName: input.displayName ?? input.providerType,
      status: "NOT_CONFIGURED",
      configurationMetadata: input.configurationMetadata ?? {},
      scopes: input.scopes ?? [],
      humanApprovalRequired: true,
      aiSuggested: input.aiSuggested ?? false,
      externalConnectionEnabled: false,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repository.createIntegration(provider);
    await this.integrationAudit("INTEGRATION_CREATED", actor, created.id, undefined, created);

    return created;
  }

  async listIntegrations(actor: GatewayActor): Promise<IntegrationProvider[]> {
    this.validateActor(actor);
    return this.repository.listIntegrations(actor.organizationId);
  }

  async getIntegration(actor: GatewayActor, id: string): Promise<IntegrationProvider> {
    return this.requireIntegration(actor, id);
  }

  async enableIntegration(
    actor: GatewayActor,
    id: string,
    input: IntegrationStateChangeInput = {}
  ): Promise<IntegrationProvider> {
    this.validateActor(actor);
    this.rejectAiInitiated(input.aiInitiated, "AI cannot enable integrations automatically.");
    const existing = await this.requireIntegration(actor, id);
    const now = new Date().toISOString();
    const enabled: IntegrationProvider = {
      ...existing,
      status: "CONFIGURED",
      externalConnectionEnabled: false,
      enabledBy: actor.userId,
      enabledAt: now,
      updatedAt: now
    };

    const saved = await this.repository.updateIntegration(enabled);
    await this.integrationAudit("INTEGRATION_ENABLED", actor, saved.id, existing, saved);

    return saved;
  }

  async disableIntegration(
    actor: GatewayActor,
    id: string,
    input: IntegrationStateChangeInput = {}
  ): Promise<IntegrationProvider> {
    this.validateActor(actor);
    this.rejectAiInitiated(input.aiInitiated, "AI cannot disable integrations automatically.");
    const existing = await this.requireIntegration(actor, id);
    const now = new Date().toISOString();
    const disabled: IntegrationProvider = {
      ...existing,
      status: "DISABLED",
      externalConnectionEnabled: false,
      disabledBy: actor.userId,
      disabledAt: now,
      updatedAt: now
    };

    const saved = await this.repository.updateIntegration(disabled);
    await this.integrationAudit("INTEGRATION_DISABLED", actor, saved.id, existing, saved);

    return saved;
  }

  async createWebhook(actor: GatewayActor, input: CreateWebhookInput): Promise<Webhook> {
    this.validateActor(actor);
    this.rejectAiInitiated(input.aiInitiated, "AI cannot create active webhook secrets.");

    if (!input.eventName || !input.targetUrl) {
      throw new BadRequestException("eventName and targetUrl are required.");
    }

    const secret = input.secret ?? this.generateSecret();
    const now = new Date().toISOString();
    const webhook: Webhook = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      eventName: input.eventName,
      targetUrl: input.targetUrl,
      secretHash: this.hashSecret(secret),
      enabled: input.enabled ?? false,
      retryPolicy: {
        maxAttempts: input.retryPolicy?.maxAttempts ?? 3,
        backoffSeconds: input.retryPolicy?.backoffSeconds ?? 30
      },
      humanApprovalRequired: true,
      aiSuggested: input.aiSuggested ?? false,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now
    };

    const created = await this.repository.createWebhook(webhook);
    await this.gatewayAudit("WEBHOOK_CREATED", actor, { webhookId: created.id }, undefined, created);

    return created;
  }

  async listWebhooks(actor: GatewayActor): Promise<Webhook[]> {
    this.validateActor(actor);
    return this.repository.listWebhooks(actor.organizationId);
  }

  async enableWebhook(actor: GatewayActor, id: string, input: WebhookStateChangeInput = {}): Promise<Webhook> {
    this.validateActor(actor);
    this.rejectAiInitiated(input.aiInitiated, "AI cannot enable webhooks automatically.");
    return this.setWebhookEnabled(actor, id, true);
  }

  async disableWebhook(actor: GatewayActor, id: string, input: WebhookStateChangeInput = {}): Promise<Webhook> {
    this.validateActor(actor);
    this.rejectAiInitiated(input.aiInitiated, "AI cannot disable webhooks automatically.");
    return this.setWebhookEnabled(actor, id, false);
  }

  async recordWebhookDeliveryLog(
    actor: GatewayActor,
    webhookId: string,
    log: Omit<WebhookDeliveryLog, "id" | "organizationId" | "webhookId" | "createdAt">
  ): Promise<WebhookDeliveryLog> {
    this.validateActor(actor);
    await this.requireWebhook(actor, webhookId);
    const created = await this.repository.createWebhookDeliveryLog({
      id: randomUUID(),
      organizationId: actor.organizationId,
      webhookId,
      ...log,
      createdAt: new Date().toISOString()
    });

    await this.gatewayAudit("WEBHOOK_DELIVERY_LOG_RECORDED", actor, { webhookId }, undefined, created);
    return created;
  }

  private async setWebhookEnabled(actor: GatewayActor, id: string, enabled: boolean): Promise<Webhook> {
    const existing = await this.requireWebhook(actor, id);
    const updated: Webhook = {
      ...existing,
      enabled,
      updatedAt: new Date().toISOString()
    };
    const saved = await this.repository.updateWebhook(updated);

    await this.gatewayAudit(enabled ? "WEBHOOK_ENABLED" : "WEBHOOK_DISABLED", actor, { webhookId: saved.id }, existing, saved);
    return saved;
  }

  private async requireApiKey(actor: GatewayActor, id: string): Promise<GatewayApiKey> {
    const apiKey = await this.repository.findApiKeyById(id, actor.organizationId);

    if (!apiKey) {
      throw new NotFoundException("Gateway API key not found.");
    }

    return apiKey;
  }

  private async requireIntegration(actor: GatewayActor, id: string): Promise<IntegrationProvider> {
    const provider = await this.repository.findIntegrationById(id, actor.organizationId);

    if (!provider) {
      throw new NotFoundException("Integration provider not found.");
    }

    return provider;
  }

  private async requireWebhook(actor: GatewayActor, id: string): Promise<Webhook> {
    const webhook = await this.repository.findWebhookById(id, actor.organizationId);

    if (!webhook) {
      throw new NotFoundException("Webhook not found.");
    }

    return webhook;
  }

  private rejectAiInitiated(aiInitiated: boolean | undefined, message: string): void {
    if (aiInitiated) {
      throw new BadRequestException(message);
    }
  }

  private generateSecret(): string {
    return `led_${randomBytes(24).toString("base64url")}`;
  }

  private hashSecret(secret: string): string {
    return createHash("sha256").update(secret).digest("hex");
  }

  private toApiKeyView(apiKey: GatewayApiKey): GatewayApiKeyView {
    return {
      id: apiKey.id,
      organizationId: apiKey.organizationId,
      name: apiKey.name,
      keyPrefix: apiKey.keyPrefix,
      scopes: apiKey.scopes,
      expiresAt: apiKey.expiresAt,
      status: apiKey.status,
      usageMetadata: apiKey.usageMetadata,
      humanApprovalRequired: apiKey.humanApprovalRequired,
      aiSuggested: apiKey.aiSuggested,
      createdBy: apiKey.createdBy,
      createdAt: apiKey.createdAt,
      revokedBy: apiKey.revokedBy,
      revokedAt: apiKey.revokedAt
    };
  }

  private routeId(organizationId: string, method: string, routePath: string): string {
    return createHash("sha256").update(`${organizationId}:${method}:${routePath}`).digest("hex");
  }

  private validateActor(actor: GatewayActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("Authenticated gateway context is required.");
    }
  }

  private async gatewayAudit(
    action: GatewayAuditAction,
    actor: GatewayActor,
    target: { apiKeyId?: string; webhookId?: string },
    beforeState: GatewayApiKey | Webhook | undefined,
    afterState: GatewayApiKey | Webhook | WebhookDeliveryLog
  ): Promise<void> {
    await this.repository.appendGatewayAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      ...target,
      action,
      actorId: actor.userId,
      humanFinalAuthority: true,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private async integrationAudit(
    action: IntegrationAuditAction,
    actor: GatewayActor,
    integrationProviderId: string,
    beforeState: IntegrationProvider | undefined,
    afterState: IntegrationProvider
  ): Promise<void> {
    await this.repository.appendIntegrationAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      integrationProviderId,
      action,
      actorId: actor.userId,
      humanFinalAuthority: true,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }
}
