import { Injectable, Optional } from "@nestjs/common";
import { z } from "zod";
import { type AgentCapabilityBinding } from "./ai-agent-registry.types";
import { ProjectsAgentAdapter } from "../projects/projects-agent.adapter";
import { ManuscriptsAgentAdapter } from "../author-studio/manuscripts-agent.adapter";
import { DocumentationAgentAdapter } from "../research/documentation-agent.adapter";
import { PlanningAgentAdapter } from "../scheduling/planning-agent.adapter";
import { LinguisticAgentAdapter } from "../translations/linguistic-agent.adapter";
import { handlerInputSchema, localDescriptor, localReportSchema,
  type LocalHandlerDescriptor, type LocalHandlerInput } from "./ai-handler.contract";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { resolveAiAgentIdentity } from "./ai-agent-identity";

const descriptorSchema = z.object({
  agentId: z.string().min(1), id: z.string().regex(/^[a-z][a-z0-9.-]+$/u), version: z.literal("1"),
  capabilityId: z.string().min(1), operationId: z.string().min(1),
  inputSchemaRef: z.string().min(1), outputSchemaRef: z.string().min(1),
  requiredPermissions: z.array(z.enum(["project.read", "document.read", "segment.read", "translation.read", "translation.write"])).min(1),
  resourceScope: z.enum(["PROJECT", "DOCUMENT", "MANUSCRIPT", "LINGUISTIC_SOURCE"]),
  classification: z.literal("RESTRICTED"), workflowRequired: z.boolean(),
  allowedWorkflowStates: z.array(z.enum(["DRAFT", "IN_TRANSLATION", "IN_QA", "IN_SEMANTIC_REVIEW", "IN_REVIEW", "APPROVED", "READY_FOR_EXPORT", "EXPORTED"])).min(1),
  timeoutMs: z.number().int().min(1).max(5000), estimatedCost: z.literal(0), currency: z.literal("EUR"),
  availability: z.literal("PAID_EXECUTION_DISABLED").optional(),
  metadata: z.object({ advisoryOnly: z.literal(true), externalProcessing: z.boolean(), modifiesResources: z.literal(false) }).strict(),
  inputSchema: z.custom<z.ZodType<LocalHandlerInput>>((value) => value instanceof z.ZodType),
  outputSchema: z.custom<z.ZodType>((value) => value instanceof z.ZodType)
}).strict();

/** Server-owned descriptors: request data can never register or load handlers. */
@Injectable()
export class AiHandlerRegistry {
  constructor(@Optional() private readonly projects?: ProjectsAgentAdapter,
    @Optional() private readonly manuscripts?: ManuscriptsAgentAdapter,
    @Optional() private readonly documentation?: DocumentationAgentAdapter,
    @Optional() private readonly planning?: PlanningAgentAdapter,
    @Optional() private readonly linguistic?: LinguisticAgentAdapter) {}

  onModuleInit() { this.descriptors(); }

  descriptors(): LocalHandlerDescriptor[] {
    const quality = localDescriptor("quality-agent", "quality.metadata.v1", "quality.metadata", "DOCUMENT", ["document.read"], true);
    quality.operationId = "quality.validate-metadata";
    const descriptors = [quality, ...[this.projects, this.manuscripts, this.documentation, this.planning, this.linguistic]
      .flatMap((adapter) => adapter?.descriptors() ?? [])];
    const keys = descriptors.map((descriptor) => descriptor.id);
    const operations = descriptors.map((descriptor) => `${descriptor.agentId}:${descriptor.operationId}`);
    if (new Set(keys).size !== keys.length || new Set(operations).size !== operations.length) throw new Error("DUPLICATE_HANDLER_DESCRIPTOR");
    for (const descriptor of descriptors) {
      descriptorSchema.parse(descriptor);
      if (descriptor.metadata.externalProcessing && descriptor.availability !== "PAID_EXECUTION_DISABLED") throw new Error("PAID_HANDLER_NOT_RESERVED");
      if (!descriptor.id.endsWith(`.v${descriptor.version}`)) throw new Error("INVALID_HANDLER_VERSION");
      const identity = resolveAiAgentIdentity(descriptor.agentId);
      if (identity.status !== "RESOLVED" || identity.identity.agentId !== descriptor.agentId) throw new Error("INVALID_HANDLER_IDENTITY");
    }
    return descriptors;
  }

  descriptor(agentId: string, binding: AgentCapabilityBinding): LocalHandlerDescriptor | undefined {
    return this.descriptors().find((descriptor) => descriptor.agentId === agentId && descriptor.id === binding.handlerKey &&
      descriptor.operationId === binding.operationId && descriptor.capabilityId === binding.capabilityId &&
      descriptor.inputSchemaRef === binding.inputSchemaRef && descriptor.outputSchemaRef === binding.outputSchemaRef &&
      descriptor.requiredPermissions.every((permission) => binding.requiredPermissions.includes(permission)));
  }

  validate(agentId: string, binding: AgentCapabilityBinding): boolean {
    const descriptor = this.descriptor(agentId, binding);
    return Boolean(descriptor && !descriptor.availability);
  }

  async executeResource(agentId: string, binding: AgentCapabilityBinding, actor: AuthenticatedRequestContext,
    input: LocalHandlerInput, signal: AbortSignal) {
    const descriptor = this.descriptor(agentId, binding);
    if (!descriptor || descriptor.availability || signal.aborted) throw new Error("HANDLER_UNAVAILABLE");
    const validated = descriptor.inputSchema.parse(handlerInputSchema.parse(input));
    const adapter = [this.projects, this.manuscripts, this.documentation, this.planning, this.linguistic]
      .find((candidate) => candidate?.descriptors().some((item) => item.id === descriptor.id));
    if (!adapter) throw new Error("HANDLER_UNAVAILABLE");
    const result = await adapter.execute(agentId, actor, validated, signal);
    if (signal.aborted) throw new Error("HANDLER_CANCELLED");
    return descriptor.outputSchema.parse(localReportSchema.parse(result));
  }

  async authorizeResource(agentId: string, binding: AgentCapabilityBinding, actor: AuthenticatedRequestContext, input: LocalHandlerInput) {
    const descriptor = this.descriptor(agentId, binding);
    if (!descriptor || descriptor.availability) throw new Error("HANDLER_UNAVAILABLE");
    const validated = descriptor.inputSchema.parse(input);
    const adapter = [this.projects, this.manuscripts, this.documentation, this.planning, this.linguistic]
      .find((candidate) => candidate?.descriptors().some((item) => item.id === descriptor.id));
    if (!adapter) throw new Error("HANDLER_UNAVAILABLE");
    await adapter.authorize(actor, validated);
  }

  async authorizeResult(agentId: string, binding: AgentCapabilityBinding, actor: AuthenticatedRequestContext,
    input: LocalHandlerInput, result: unknown) {
    const descriptor = this.descriptor(agentId, binding);
    if (!descriptor || descriptor.availability) throw new Error("HANDLER_UNAVAILABLE");
    const report = descriptor.outputSchema.parse(result);
    const adapters: Array<import("./ai-handler.contract").LocalHandlerAdapter | undefined> =
      [this.projects, this.manuscripts, this.documentation, this.planning, this.linguistic];
    const adapter = adapters.find((candidate) => candidate?.descriptors().some((item) => item.id === descriptor.id));
    if (!adapter) throw new Error("HANDLER_UNAVAILABLE");
    await adapter.authorizeResult?.(actor, descriptor.inputSchema.parse(input), report);
  }

  async execute(agentId: string, binding: AgentCapabilityBinding,
    metadata: { title?: string; originalLanguage?: string }, signal: AbortSignal) {
    if (agentId !== "quality-agent" || !this.validate(agentId, binding) || signal.aborted) throw new Error("HANDLER_UNAVAILABLE");
    const issues: string[] = [];
    if (!metadata.title?.trim()) issues.push("MISSING_TITLE");
    if (!metadata.originalLanguage?.trim()) issues.push("MISSING_ORIGINAL_LANGUAGE");
    return {
      readiness: issues.length ? "READY_WITH_WARNINGS" as const : "READY" as const,
      issues, humanApprovalRequired: true as const
    };
  }
}
