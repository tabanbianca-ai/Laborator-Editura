import { z } from "zod";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { type WorkflowStatus } from "../workflow/workflow.types";

export const resourceSchema = z.object({
  type: z.enum(["PROJECT", "DOCUMENT", "MANUSCRIPT", "LINGUISTIC_SOURCE"]),
  id: z.string().min(1).max(120)
}).strict();
export type HandlerResource = z.infer<typeof resourceSchema>;
export const handlerInputSchema = z.object({
  projectId: z.string().min(1).max(120), resource: resourceSchema,
  segmentId: z.string().min(1).max(120).optional(),
  explicitExternalProcessingAuthorization: z.boolean().optional()
}).strict();
export type LocalHandlerInput = z.infer<typeof handlerInputSchema>;
export const provenanceSchema = z.object({
  resourceType: z.string().min(1), resourceId: z.string().min(1), version: z.string().min(1)
}).strict();
export const localReportSchema = z.object({
  readiness: z.enum(["READY", "READY_WITH_WARNINGS"]), issues: z.array(z.string().max(120)).max(500),
  humanApprovalRequired: z.literal(true),
  findings: z.array(z.object({ code: z.string().min(1).max(120),
    severity: z.enum(["INFO", "WARNING", "HIGH", "CRITICAL"]),
    referenceId: z.string().min(1).max(120).optional() }).strict()).max(500).optional(),
  metrics: z.record(z.string(), z.number().finite()).optional(),
  plan: z.array(z.object({ stage: z.string().min(1).max(120),
    dependencies: z.array(z.string().min(1).max(120)).max(200), blocked: z.boolean() }).strict()).max(200).optional(),
  provenance: z.array(provenanceSchema).max(1000).optional()
}).strict();
export type LocalHandlerReport = z.infer<typeof localReportSchema>;
export interface LocalHandlerDescriptor {
  agentId: string;
  id: string;
  version: "1";
  capabilityId: string;
  operationId: string;
  inputSchemaRef: string;
  outputSchemaRef: string;
  inputSchema: z.ZodType<LocalHandlerInput>;
  outputSchema: z.ZodType<LocalHandlerReport>;
  requiredPermissions: string[];
  resourceScope: HandlerResource["type"];
  classification: "RESTRICTED";
  allowedWorkflowStates: WorkflowStatus[];
  workflowRequired: boolean;
  timeoutMs: number;
  estimatedCost: 0;
  currency: "EUR";
  availability?: "PAID_EXECUTION_DISABLED";
  metadata: { advisoryOnly: true; externalProcessing: boolean; modifiesResources: false };
}
export interface LocalHandlerAdapter {
  descriptors(): LocalHandlerDescriptor[];
  authorize(actor: AuthenticatedRequestContext, input: LocalHandlerInput): Promise<void>;
  authorizeResult?(actor: AuthenticatedRequestContext, input: LocalHandlerInput, result: LocalHandlerReport): Promise<void>;
  execute(agentId: string, actor: AuthenticatedRequestContext, input: LocalHandlerInput, signal: AbortSignal): Promise<LocalHandlerReport>;
}

export function localDescriptor(agentId: string, id: string, capabilityId: string,
  scope: HandlerResource["type"], permissions: string[], workflowRequired = false,
  requiredMetrics: string[] = [], requiresPlan = false): LocalHandlerDescriptor {
  return {
    agentId, id, version: "1", capabilityId, operationId: capabilityId,
    inputSchemaRef: `${capabilityId}.input.v1`, outputSchemaRef: `${capabilityId}.output.v1`,
    inputSchema: handlerInputSchema.refine((input) => input.resource.type === scope &&
      input.segmentId === undefined && input.explicitExternalProcessingAuthorization === undefined),
    outputSchema: scope === "DOCUMENT" ? localReportSchema : localReportSchema.refine((report) =>
      Boolean(report.provenance?.length) && (!requiresPlan || Array.isArray(report.plan)) &&
      requiredMetrics.every((metric) => Number.isInteger(report.metrics?.[metric]) && report.metrics![metric]! >= 0)),
    requiredPermissions: permissions, resourceScope: scope,
    classification: "RESTRICTED", allowedWorkflowStates: ["DRAFT", "IN_TRANSLATION", "IN_QA", "IN_SEMANTIC_REVIEW", "IN_REVIEW", "APPROVED", "READY_FOR_EXPORT", "EXPORTED"],
    workflowRequired, timeoutMs: 5000, estimatedCost: 0, currency: "EUR",
    metadata: { advisoryOnly: true, externalProcessing: false, modifiesResources: false }
  };
}
