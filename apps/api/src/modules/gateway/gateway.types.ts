export type GatewayApiScope =
  | "gateway:read"
  | "gateway:write"
  | "integration:read"
  | "integration:write"
  | "webhook:read"
  | "webhook:write"
  | "project:read"
  | "document:read"
  | "export:read";

export type GatewayApiKeyStatus = "ACTIVE" | "REVOKED" | "EXPIRED";

export type IntegrationProviderType =
  | "GOOGLE_DRIVE"
  | "DROPBOX"
  | "ONEDRIVE"
  | "OPENAI"
  | "ANTHROPIC"
  | "DEEPL"
  | "ELEVENLABS"
  | "STRIPE"
  | "PAYPAL"
  | "AMAZON_S3"
  | "MINIO"
  | "CUSTOM_PROVIDER";

export type IntegrationProviderStatus =
  | "NOT_CONFIGURED"
  | "CONFIGURED"
  | "DISABLED";

export type GatewayAuditAction =
  | "API_KEY_CREATED"
  | "API_KEY_REVOKED"
  | "WEBHOOK_CREATED"
  | "WEBHOOK_ENABLED"
  | "WEBHOOK_DISABLED"
  | "WEBHOOK_DELIVERY_LOG_RECORDED";

export type IntegrationAuditAction =
  | "INTEGRATION_CREATED"
  | "INTEGRATION_ENABLED"
  | "INTEGRATION_DISABLED";

export type WebhookDeliveryStatus = "PENDING" | "DELIVERED" | "FAILED";

export interface GatewayActor {
  userId: string;
  organizationId: string;
  roles?: string[];
  permissions?: string[];
}

export interface GatewayRouteRegistryEntry {
  id: string;
  organizationId: string;
  moduleName: string;
  routePath: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  apiVersion: "v1";
  tenantAware: true;
  rateLimitPolicy?: string;
  tracingEnabled: true;
  correlationIdRequired: true;
  createdAt: string;
}

export interface GatewayApiKey {
  id: string;
  organizationId: string;
  name: string;
  keyPrefix: string;
  secretHash: string;
  scopes: GatewayApiScope[];
  expiresAt?: string;
  status: GatewayApiKeyStatus;
  usageMetadata: {
    createdFromGateway: true;
    lastUsedAt?: string;
    usageCount: number;
  };
  humanApprovalRequired: true;
  aiSuggested: boolean;
  createdBy: string;
  createdAt: string;
  revokedBy?: string;
  revokedAt?: string;
}

export type GatewayApiKeyView = Omit<GatewayApiKey, "secretHash">;

export interface CreateGatewayApiKeyResult {
  apiKey: GatewayApiKeyView;
  secret: string;
  secretPreview: string;
}

export interface IntegrationProvider {
  id: string;
  organizationId: string;
  providerType: IntegrationProviderType;
  displayName: string;
  status: IntegrationProviderStatus;
  configurationMetadata: Record<string, unknown>;
  scopes: string[];
  humanApprovalRequired: true;
  aiSuggested: boolean;
  externalConnectionEnabled: false;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  enabledBy?: string;
  enabledAt?: string;
  disabledBy?: string;
  disabledAt?: string;
}

export interface Webhook {
  id: string;
  organizationId: string;
  eventName: string;
  targetUrl: string;
  secretHash: string;
  enabled: boolean;
  retryPolicy: {
    maxAttempts: number;
    backoffSeconds: number;
  };
  humanApprovalRequired: true;
  aiSuggested: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookDeliveryLog {
  id: string;
  organizationId: string;
  webhookId: string;
  eventName: string;
  status: WebhookDeliveryStatus;
  attempt: number;
  responseStatus?: number;
  errorMessage?: string;
  createdAt: string;
}

export interface GatewayAuditEvent {
  id: string;
  organizationId: string;
  apiKeyId?: string;
  webhookId?: string;
  action: GatewayAuditAction;
  actorId: string;
  humanFinalAuthority: true;
  beforeState?: GatewayApiKey | Webhook;
  afterState?: GatewayApiKey | Webhook | WebhookDeliveryLog;
  createdAt: string;
}

export interface IntegrationAuditEvent {
  id: string;
  organizationId: string;
  integrationProviderId: string;
  action: IntegrationAuditAction;
  actorId: string;
  humanFinalAuthority: true;
  beforeState?: IntegrationProvider;
  afterState?: IntegrationProvider;
  createdAt: string;
}

export interface GatewayHealth {
  name: "Laboratorul Editurii API Gateway";
  status: "ok";
  apiVersion: "v1";
  tenantAware: true;
  correlationIds: "enabled";
  requestTracing: "enabled";
  rateLimitingMetadata: "configured";
  modules: string[];
  checkedAt: string;
}

export interface CreateGatewayApiKeyInput {
  name: string;
  scopes?: GatewayApiScope[];
  expiresAt?: string;
  aiSuggested?: boolean;
  aiInitiated?: boolean;
}

export interface CreateIntegrationProviderInput {
  providerType: IntegrationProviderType;
  displayName?: string;
  configurationMetadata?: Record<string, unknown>;
  scopes?: string[];
  aiSuggested?: boolean;
  aiInitiated?: boolean;
}

export interface IntegrationStateChangeInput {
  aiInitiated?: boolean;
}

export interface CreateWebhookInput {
  eventName: string;
  targetUrl: string;
  secret?: string;
  enabled?: boolean;
  retryPolicy?: {
    maxAttempts?: number;
    backoffSeconds?: number;
  };
  aiSuggested?: boolean;
  aiInitiated?: boolean;
}

export interface WebhookStateChangeInput {
  aiInitiated?: boolean;
}

export interface GatewayRepository {
  createRouteRegistryEntry(entry: GatewayRouteRegistryEntry): Promise<GatewayRouteRegistryEntry>;
  listRouteRegistry(organizationId: string): Promise<GatewayRouteRegistryEntry[]>;
  createApiKey(apiKey: GatewayApiKey): Promise<GatewayApiKey>;
  updateApiKey(apiKey: GatewayApiKey): Promise<GatewayApiKey>;
  findApiKeyById(id: string, organizationId: string): Promise<GatewayApiKey | null>;
  listApiKeys(organizationId: string): Promise<GatewayApiKey[]>;
  createIntegration(provider: IntegrationProvider): Promise<IntegrationProvider>;
  updateIntegration(provider: IntegrationProvider): Promise<IntegrationProvider>;
  findIntegrationById(id: string, organizationId: string): Promise<IntegrationProvider | null>;
  listIntegrations(organizationId: string): Promise<IntegrationProvider[]>;
  createWebhook(webhook: Webhook): Promise<Webhook>;
  updateWebhook(webhook: Webhook): Promise<Webhook>;
  findWebhookById(id: string, organizationId: string): Promise<Webhook | null>;
  listWebhooks(organizationId: string): Promise<Webhook[]>;
  createWebhookDeliveryLog(log: WebhookDeliveryLog): Promise<WebhookDeliveryLog>;
  appendGatewayAuditEvent(event: GatewayAuditEvent): Promise<void>;
  appendIntegrationAuditEvent(event: IntegrationAuditEvent): Promise<void>;
}
