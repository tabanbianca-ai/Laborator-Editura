import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseProjectsRepository } from "./projects.repository";
import {
  type CreateProjectInput,
  type Project,
  type ProjectActor,
  type ProjectAuditAction,
  type ProjectAuditEvent
} from "./projects.types";

@Injectable()
export class ProjectsService {
  constructor(private readonly repository: DatabaseProjectsRepository) {}

  async createProject(actor: ProjectActor, input: CreateProjectInput): Promise<Project> {
    this.validateActor(actor);

    if (!input.name || !input.sourceLanguage || !Array.isArray(input.targetLanguages) || input.targetLanguages.length === 0) {
      throw new BadRequestException("name, sourceLanguage and targetLanguages are required.");
    }

    const now = new Date().toISOString();
    const project = await this.repository.createProject({
      id: randomUUID(),
      organizationId: actor.organizationId,
      name: input.name,
      description: input.description,
      sourceLanguage: input.sourceLanguage,
      targetLanguages: input.targetLanguages,
      domain: input.domain,
      status: "ACTIVE",
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    });

    await this.audit("CREATE", actor, project.id, undefined, project);

    return project;
  }

  async getProject(actor: ProjectActor, projectId: string): Promise<Project> {
    this.validateActor(actor);
    const project = await this.repository.findProjectById(projectId, actor.organizationId);

    if (!project) {
      throw new NotFoundException("project not found.");
    }

    return project;
  }

  async listProjects(actor: ProjectActor): Promise<Project[]> {
    this.validateActor(actor);
    return this.repository.listProjects(actor.organizationId);
  }

  getAuditEvents(actor: ProjectActor): ProjectAuditEvent[] {
    this.validateActor(actor);
    return this.repository.getAuditEvents(actor.organizationId);
  }

  private async audit(
    action: ProjectAuditAction,
    actor: ProjectActor,
    entityId: string,
    beforeState: Project | undefined,
    afterState: Project
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      actorId: actor.userId,
      action,
      entityType: "PROJECT",
      entityId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private validateActor(actor: ProjectActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }
}
