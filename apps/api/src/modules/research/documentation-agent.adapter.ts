import { ForbiddenException, Injectable } from "@nestjs/common";
import { ResearchService } from "./research.service";
import { LexicographicService } from "../lexicographic/lexicographic.service";
import { WorkspaceService } from "../workspace/workspace.service";
import { localDescriptor, type LocalHandlerAdapter, type LocalHandlerInput, type LocalHandlerReport } from "../ai-governance/ai-handler.contract";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";

@Injectable()
export class DocumentationAgentAdapter implements LocalHandlerAdapter {
  constructor(private readonly research: ResearchService, private readonly lexicographic: LexicographicService,
    private readonly workspace: WorkspaceService) {}
  descriptors() { return [localDescriptor("documentation-agent", "documentation.citations.v1", "documentation.citations", "LINGUISTIC_SOURCE", ["project.read"], false, ["matchingResourceCount"])]; }
  async authorize(actor: AuthenticatedRequestContext, input: LocalHandlerInput) {
    const source = await this.research.getSource(actor, input.resource.id);
    if (!source.ecosystemReferences.some((ref) => ref.module === "TRANSLATION" && ref.entityId === input.projectId)) throw new ForbiddenException();
  }
  async authorizeResult(actor: AuthenticatedRequestContext, input: LocalHandlerInput, result: LocalHandlerReport) {
    for (const source of result.provenance ?? []) {
      if (source.resourceType !== "LINGUISTIC_SOURCE") continue;
      const access = await this.workspace.evaluateNeedToKnowAccess(actor, {
        projectId: input.projectId, resourceType: "LINGUISTIC_SOURCE", resourceId: source.resourceId,
        confidentialClassification: "RESTRICTED", requestedAction: "documentation.citations"
      });
      if (access.decision !== "ALLOW") throw new ForbiddenException();
    }
  }
  async execute(_agentId: string, actor: AuthenticatedRequestContext, input: LocalHandlerInput, signal: AbortSignal) {
    const source = await this.research.getSource(actor, input.resource.id);
    if (signal.aborted || !source.ecosystemReferences.some((ref) => ref.module === "TRANSLATION" && ref.entityId === input.projectId)) throw new ForbiddenException();
    const issues: string[] = [];
    if (!source.citation?.trim()) issues.push("MISSING_CITATION");
    if (!source.author?.trim() && !source.originalAuthor?.trim()) issues.push("MISSING_SOURCE_AUTHOR");
    if (!source.language) issues.push("MISSING_SOURCE_LANGUAGE");
    const resources = await this.lexicographic.listSources(actor);
    const candidates = resources.filter((resource) => resource.enabled &&
      (!resource.projectId || resource.projectId === input.projectId) &&
      (resource.language === source.language || resource.sourceLanguages.includes(source.language)));
    if (candidates.length > 200) throw new ForbiddenException("Source set exceeds bounded local analysis.");
    const enabled = [];
    for (const resource of candidates) {
      if (signal.aborted) throw new ForbiddenException();
      const access = await this.workspace.evaluateNeedToKnowAccess(actor, {
        projectId: input.projectId, resourceType: "LINGUISTIC_SOURCE", resourceId: resource.id,
        confidentialClassification: "RESTRICTED", requestedAction: "documentation.citations"
      });
      if (access.decision === "ALLOW") enabled.push(resource);
    }
    if (!enabled.length) issues.push("NO_ENABLED_LINGUISTIC_REFERENCE");
    return { readiness: issues.length ? "READY_WITH_WARNINGS" as const : "READY" as const,
      issues, humanApprovalRequired: true as const,
      metrics: { matchingResourceCount: enabled.length },
      provenance: [{ resourceType: "RESEARCH_SOURCE", resourceId: source.id, version: source.updatedAt },
        ...enabled.map((resource) => ({ resourceType: "LINGUISTIC_SOURCE", resourceId: resource.id,
          version: resource.version ?? resource.lastVerificationDate ?? resource.createdAt }))]
    };
  }
}
