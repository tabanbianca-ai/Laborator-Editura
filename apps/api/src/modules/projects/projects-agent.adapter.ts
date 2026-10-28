import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { localDescriptor, type LocalHandlerAdapter, type LocalHandlerInput } from "../ai-governance/ai-handler.contract";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";

@Injectable()
export class ProjectsAgentAdapter implements LocalHandlerAdapter {
  constructor(private readonly projects: ProjectsService) {}
  descriptors() { return [localDescriptor("projects-agent", "projects.readiness.v1", "projects.readiness", "PROJECT", ["project.read"], false, ["stageCount"])]; }
  async authorize(actor: AuthenticatedRequestContext, input: LocalHandlerInput) {
    if (input.resource.id !== input.projectId) throw new ForbiddenException();
    await this.projects.getProject(actor, input.projectId);
  }
  async execute(_agentId: string, actor: AuthenticatedRequestContext, input: LocalHandlerInput, signal: AbortSignal) {
    if (signal.aborted || input.resource.id !== input.projectId) throw new ForbiddenException();
    const project = await this.projects.getProject(actor, input.projectId);
    const issues: string[] = [];
    try { await this.projects.assertProjectReadyForEditorialProcessing(actor, input.projectId); }
    catch (error) {
      if (!(error instanceof BadRequestException)) throw error;
      issues.push("PROJECT_NOT_READY_FOR_EDITORIAL_PROCESSING");
    }
    if (!project.name?.trim()) issues.push("MISSING_PROJECT_NAME");
    if (!project.originalLanguage) issues.push("MISSING_ORIGINAL_LANGUAGE");
    if (!project.projectIdentity) issues.push("MISSING_PROJECT_IDENTITY");
    else {
      if (!project.projectIdentity.projectOrigin) issues.push("MISSING_PROJECT_ORIGIN");
      if (!project.projectIdentity.rightsStatus) issues.push("MISSING_RIGHTS_STATUS");
      if (project.projectIdentity.projectOrigin !== "ORIGINAL_CREATION" &&
        (!project.projectIdentity.originalAuthor?.name?.trim() || !project.projectIdentity.originalAuthor.originalLanguage)) {
        issues.push("MISSING_ORIGINAL_AUTHOR_IDENTITY");
      }
      if (project.projectIdentity.publicationEligibility?.publicationAllowed === false) issues.push("PUBLICATION_RIGHTS_NOT_READY");
    }
    return { readiness: issues.length ? "READY_WITH_WARNINGS" as const : "READY" as const,
      issues, humanApprovalRequired: true as const,
      metrics: { stageCount: project.editorialProcess?.length ?? 0 },
      provenance: [{ resourceType: "PROJECT", resourceId: project.id, version: project.updatedAt }] };
  }
}
