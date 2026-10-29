import { type AgentCapabilityBinding } from "./ai-agent-registry.types";
import { type HandlerResource, type LocalHandlerReport } from "./ai-handler.contract";

export type AgentTaskStatus = "CREATED" | "AUTHORIZED" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED" | "BLOCKED";
export interface AgentExecutionTask {
  id: string;
  organizationId: string;
  userId: string;
  agentId: string;
  canonicalAgentId: string;
  agentVersionId: string;
  configurationSha256: string;
  binding: AgentCapabilityBinding;
  projectId: string;
  documentId?: string;
  segmentId?: string;
  explicitExternalProcessingAuthorization?: boolean;
  resource?: HandlerResource;
  idempotencyKey: string;
  requestHash: string;
  correlationId: string;
  status: AgentTaskStatus;
  createdAt: string;
  updatedAt: string;
  inputTokens: number;
  outputTokens: number;
  actualCost: number;
  currency: "EUR";
  usageRecorded?: boolean;
  failureCode?: string;
  result?: LocalHandlerReport;
}
