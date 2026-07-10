import { type AuthenticatedRequestContext } from "../auth/request-context.types";

export type MarketplaceActor = AuthenticatedRequestContext;

export type MarketplaceAgentStatus = "DRAFT" | "ACTIVE" | "DISABLED" | "ARCHIVED";
export type MarketplaceExtensionStatus = "DRAFT" | "ACTIVE" | "DISABLED" | "ARCHIVED";
export type MarketplaceVisibility = "PRIVATE" | "ORGANIZATION" | "PUBLIC_REFERENCE";
export type MarketplaceInstallStatus = "ENABLED" | "DISABLED";

export type MarketplaceAgentCategory =
  | "TRANSLATION"
  | "LEXICOGRAPHIC"
  | "SEMANTIC_FIDELITY"
  | "EDITORIAL_DECISION"
  | "LAYOUT_PUBLISHING"
  | "MULTIMEDIA"
  | "MEDIA_LOCALIZATION"
  | "PLATFORM_ENGINEERING"
  | "SCHEDULING"
  | "AUTHOR_STUDIO"
  | "RESEARCH"
  | "SECURITY"
  | "QUALITY"
  | "CUSTOM";

export type MarketplaceIntegrationType =
  | "INTERNAL_MODULE"
  | "API_CONNECTOR"
  | "AI_AGENT_EXTENSION"
  | "WORKFLOW_EXTENSION"
  | "EDITORIAL_EXTENSION"
  | "MEDIA_EXTENSION"
  | "CUSTOM_METADATA";

export type MarketplaceAuditAction =
  | "MARKETPLACE_AGENT_CREATED"
  | "MARKETPLACE_AGENT_ENABLED"
  | "MARKETPLACE_AGENT_DISABLED"
  | "MARKETPLACE_EXTENSION_CREATED"
  | "MARKETPLACE_EXTENSION_ENABLED"
  | "MARKETPLACE_EXTENSION_DISABLED"
  | "MARKETPLACE_INSTALL_RECORDED";

export interface MarketplaceGovernanceMetadata {
  adminApprovalRequired: true;
  policyEngineComplianceRequired: true;
  costGovernanceRequired: true;
  auditTrailMandatory: true;
  humanFinalAuthorityRequired: true;
  aiMaySuggest: true;
  aiMaySummarizeCatalog: true;
  aiMayDetectRisk: true;
  aiCannotSelfEnable: true;
  aiCannotInstallExtensionsAutomatically: true;
  aiCannotBypassPolicyGovernance: true;
  aiCannotBypassCostGovernance: true;
  externalPluginExecution: "NOT_CONFIGURED";
  paidMarketplace: "NOT_CONFIGURED";
}

export interface MarketplaceAgent {
  id: string;
  organizationId: string;
  agentName: string;
  category: MarketplaceAgentCategory;
  version: string;
  providerMetadata: object;
  supportedModules: string[];
  permissionsRequired: string[];
  costGovernanceLink?: string;
  policyComplianceLink?: string;
  status: MarketplaceAgentStatus;
  visibility: MarketplaceVisibility;
  installMetadata?: object;
  enabledBy?: string;
  enabledAt?: string;
  disabledBy?: string;
  disabledAt?: string;
  governance: MarketplaceGovernanceMetadata;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: object;
}

export interface MarketplaceExtension {
  id: string;
  organizationId: string;
  moduleName: string;
  capabilities: string[];
  integrationType: MarketplaceIntegrationType;
  requiredScopes: string[];
  tenantAvailability: string[];
  status: MarketplaceExtensionStatus;
  visibility: MarketplaceVisibility;
  installMetadata?: object;
  enabledBy?: string;
  enabledAt?: string;
  disabledBy?: string;
  disabledAt?: string;
  governance: MarketplaceGovernanceMetadata;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: object;
}

export interface MarketplaceInstall {
  id: string;
  organizationId: string;
  agentId?: string;
  extensionId?: string;
  catalogItemType: "AGENT" | "EXTENSION";
  status: MarketplaceInstallStatus;
  enabledBy?: string;
  enabledAt?: string;
  disabledBy?: string;
  disabledAt?: string;
  installMetadata?: object;
  disableMetadata?: object;
  adminApprovalRequired: true;
  humanFinalAuthorityRequired: true;
  policyEngineComplianceRequired: true;
  costGovernanceRequired: true;
  externalPluginExecution: "NOT_CONFIGURED";
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceCatalogItem {
  id: string;
  organizationId: string;
  catalogItemType: "AGENT" | "EXTENSION";
  name: string;
  version: string;
  status: MarketplaceAgentStatus | MarketplaceExtensionStatus;
  visibility: MarketplaceVisibility;
  supportedModules?: string[];
  capabilities?: string[];
  installMetadata?: object;
  governance: MarketplaceGovernanceMetadata;
}

export interface MarketplaceAuditEvent {
  id: string;
  organizationId: string;
  actorId: string;
  action: MarketplaceAuditAction;
  agentId?: string;
  extensionId?: string;
  installId?: string;
  beforeState?: object;
  afterState?: object;
  humanFinalAuthority: true;
  createdAt: string;
}

export interface CreateMarketplaceAgentInput {
  agentName: string;
  category: MarketplaceAgentCategory;
  version: string;
  providerMetadata?: object;
  supportedModules?: string[];
  permissionsRequired?: string[];
  costGovernanceLink?: string;
  policyComplianceLink?: string;
  status?: MarketplaceAgentStatus;
  visibility?: MarketplaceVisibility;
  installMetadata?: object;
  aiSuggested?: boolean;
  aiSelfEnableAttempt?: boolean;
  metadata?: object;
}

export interface CreateMarketplaceExtensionInput {
  moduleName: string;
  capabilities?: string[];
  integrationType: MarketplaceIntegrationType;
  requiredScopes?: string[];
  tenantAvailability?: string[];
  status?: MarketplaceExtensionStatus;
  visibility?: MarketplaceVisibility;
  installMetadata?: object;
  aiSuggested?: boolean;
  aiAutoInstallAttempt?: boolean;
  metadata?: object;
}

export interface MarketplaceStateChangeInput {
  aiInitiated?: boolean;
  installMetadata?: object;
  disableMetadata?: object;
}

export interface MarketplaceRepository {
  createAgent(agent: MarketplaceAgent): Promise<MarketplaceAgent>;
  updateAgent(agent: MarketplaceAgent): Promise<MarketplaceAgent>;
  findAgentById(id: string, organizationId: string): Promise<MarketplaceAgent | null>;
  listAgents(organizationId: string): Promise<MarketplaceAgent[]>;
  createExtension(extension: MarketplaceExtension): Promise<MarketplaceExtension>;
  updateExtension(extension: MarketplaceExtension): Promise<MarketplaceExtension>;
  findExtensionById(id: string, organizationId: string): Promise<MarketplaceExtension | null>;
  listExtensions(organizationId: string): Promise<MarketplaceExtension[]>;
  createInstall(install: MarketplaceInstall): Promise<MarketplaceInstall>;
  appendAuditEvent(event: MarketplaceAuditEvent): Promise<void>;
  listAuditEvents(organizationId: string): Promise<MarketplaceAuditEvent[]>;
}
