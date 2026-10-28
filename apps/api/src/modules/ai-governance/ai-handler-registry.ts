import { Injectable } from "@nestjs/common";
import { type AgentCapabilityBinding } from "./ai-agent-registry.types";

/** Server-owned descriptors: request data can never register or load handlers. */
@Injectable()
export class AiHandlerRegistry {
  validate(agentId: string, binding: AgentCapabilityBinding): boolean {
    return agentId === "quality-agent" && binding.handlerKey === "quality.metadata.v1" &&
      binding.capabilityId === "quality.metadata" && binding.operationId === "quality.validate-metadata" &&
      binding.inputSchemaRef === "quality.metadata.input.v1" &&
      binding.outputSchemaRef === "quality.metadata.output.v1" &&
      binding.requiredPermissions.includes("document.read");
  }

  async execute(agentId: string, binding: AgentCapabilityBinding,
    metadata: { title?: string; originalLanguage?: string }, signal: AbortSignal) {
    if (!this.validate(agentId, binding) || signal.aborted) throw new Error("HANDLER_UNAVAILABLE");
    const issues: string[] = [];
    if (!metadata.title?.trim()) issues.push("MISSING_TITLE");
    if (!metadata.originalLanguage?.trim()) issues.push("MISSING_ORIGINAL_LANGUAGE");
    return {
      readiness: issues.length ? "READY_WITH_WARNINGS" as const : "READY" as const,
      issues, humanApprovalRequired: true as const
    };
  }
}
