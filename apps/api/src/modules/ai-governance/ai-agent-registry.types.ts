export interface AgentCapabilityBinding {
  capabilityId: string;
  operationId: string;
  handlerKey: string;
  inputSchemaRef: string;
  outputSchemaRef: string;
  requiredPermissions: string[];
}

export interface AgentConfigurationInput {
  bindings: AgentCapabilityBinding[];
  reason: string;
}

export interface AgentRegistryRecord {
  id: string;
  organizationId: string;
  canonicalAgentId: string;
  enabled: boolean;
  activeVersionId?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface AgentConfigurationVersion {
  id: string;
  organizationId: string;
  registryId: string;
  version: number;
  revision: number;
  governanceVersion: string;
  configurationSha256: string;
  bindings: AgentCapabilityBinding[];
  status: "DRAFT" | "APPROVED" | "ACTIVE";
  reason: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  activatedBy?: string;
  activatedAt?: string;
  validatedHandlerKeys?: string[];
}
