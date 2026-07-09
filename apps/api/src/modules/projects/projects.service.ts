import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  normalizeLanguageLocale,
  validateIsoCompatibleLanguageTag,
  validateTranslationTargetV1
} from "@laborator/shared";
import { randomUUID } from "node:crypto";
import { DatabaseProjectsRepository } from "./projects.repository";
import {
  type CreateProjectInput,
  type Project,
  type ProjectActor,
  type ProjectAuditAction,
  type ProjectAuditEvent,
  type ProjectIdentity,
  type ProjectOrigin,
  type ProjectRightsStatus
} from "./projects.types";

const PROJECT_ORIGINS: readonly ProjectOrigin[] = [
  "ORIGINAL_CREATION",
  "EXTERNAL_AUTHOR",
  "TRANSLATION",
  "EDITORIAL_COLLABORATION",
  "PUBLIC_DOMAIN_CLASSICAL_WORK",
  "MAGAZINE_ARTICLE",
  "CHILDRENS_BOOK",
  "AUDIO_VIDEO_PROJECT"
];

const PROJECT_RIGHTS_STATUSES: readonly ProjectRightsStatus[] = [
  "ORIGINAL_CREATION",
  "RIGHTS_OBTAINED",
  "PUBLIC_DOMAIN",
  "CLASSICAL_WORK",
  "OPEN_LICENSE",
  "RIGHTS_PENDING",
  "RESTRICTED_PUBLICATION"
];

@Injectable()
export class ProjectsService {
  constructor(private readonly repository: DatabaseProjectsRepository) {}

  async createProject(actor: ProjectActor, input: CreateProjectInput): Promise<Project> {
    this.validateActor(actor);

    if (!input.name || !input.sourceLanguage || !Array.isArray(input.targetLanguages) || input.targetLanguages.length === 0) {
      throw new BadRequestException("name, sourceLanguage and targetLanguages are required.");
    }

    const projectIdentity = this.buildProjectIdentity(input);
    const originalLanguage = this.normalizeIsoLanguage(input.originalLanguage ?? input.sourceLanguage, input.originalLocale);
    const targetLanguages = input.targetLanguages.map((targetLanguage, index) =>
      this.normalizeTranslationTarget(targetLanguage, input.targetLocales?.[index])
    );
    const targetLocales = targetLanguages.flatMap((target) => target.locale ? [target.locale] : []);
    const metadata = {
      ...(input.metadata ?? {}),
      projectIdentity
    };
    const now = new Date().toISOString();
    const project = await this.repository.createProject({
      id: randomUUID(),
      organizationId: actor.organizationId,
      name: input.name,
      description: input.description,
      sourceLanguage: originalLanguage.language,
      originalLanguage: originalLanguage.language,
      originalLocale: originalLanguage.locale,
      targetLanguages: targetLanguages.map((target) => target.language),
      targetLocales: targetLocales.length > 0 ? targetLocales : undefined,
      domain: input.domain,
      status: "ACTIVE",
      projectIdentity,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata
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

  private normalizeIsoLanguage(language: string, locale?: string) {
    const validation = validateIsoCompatibleLanguageTag(language);

    if (!validation.valid) {
      throw new BadRequestException(validation.reason ?? "Language must be ISO-compatible.");
    }

    return normalizeLanguageLocale(language, locale);
  }

  private normalizeTranslationTarget(targetLanguage: string, targetLocale?: string) {
    const validation = validateTranslationTargetV1({
      targetLanguage,
      targetLocale
    });

    if (!validation.valid) {
      throw new BadRequestException(validation.reason ?? "Unsupported translation target.");
    }

    return {
      language: validation.language,
      locale: validation.locale
    };
  }

  private buildProjectIdentity(input: CreateProjectInput): ProjectIdentity {
    const identity = input.projectIdentity;

    if (!identity?.projectOrigin || !identity.rightsStatus) {
      throw new BadRequestException("Project Identity requires projectOrigin and rightsStatus.");
    }

    if (!PROJECT_ORIGINS.includes(identity.projectOrigin)) {
      throw new BadRequestException("Unsupported project origin.");
    }

    if (!PROJECT_RIGHTS_STATUSES.includes(identity.rightsStatus)) {
      throw new BadRequestException("Unsupported rights status.");
    }

    const originalAuthor = this.buildOriginalAuthorIdentity(input, identity.projectOrigin);
    const publicDomain = identity.rightsStatus === "PUBLIC_DOMAIN" || identity.rightsStatus === "CLASSICAL_WORK";

    return {
      projectOrigin: identity.projectOrigin,
      rightsStatus: identity.rightsStatus,
      originalAuthor,
      linkedRightsContractIds: this.normalizeLinkedRightsContractIds(identity.linkedRightsContractIds),
      rightsContributionTracking: {
        translation: true,
        editorialAdaptation: true,
        illustrations: true,
        layout: true,
        cover: true,
        audiobook: true,
        video: true,
        otherOriginalContributions: true
      },
      publicationEligibility: {
        editingAllowed: true,
        translationAllowed: true,
        publicationAllowed: publicDomain || identity.rightsStatus === "ORIGINAL_CREATION" || identity.rightsStatus === "RIGHTS_OBTAINED" || identity.rightsStatus === "OPEN_LICENSE",
        originalAuthorRightsRequired: !publicDomain && identity.projectOrigin !== "ORIGINAL_CREATION"
      }
    };
  }

  private buildOriginalAuthorIdentity(
    input: CreateProjectInput,
    projectOrigin: ProjectOrigin
  ): ProjectIdentity["originalAuthor"] {
    if (projectOrigin === "ORIGINAL_CREATION") {
      return undefined;
    }

    const originalAuthor = input.projectIdentity.originalAuthor;

    if (!originalAuthor?.name || !originalAuthor.originalLanguage) {
      throw new BadRequestException("Original author name and originalLanguage are required for this project origin.");
    }

    const normalizedOriginalLanguage = this.normalizeIsoLanguage(originalAuthor.originalLanguage);

    return {
      name: originalAuthor.name.trim(),
      country: originalAuthor.country?.trim() || undefined,
      originalLanguage: normalizedOriginalLanguage.language
    };
  }

  private normalizeLinkedRightsContractIds(linkedRightsContractIds: string[] | undefined): string[] | undefined {
    const normalized = (linkedRightsContractIds ?? [])
      .map((contractId) => contractId.trim())
      .filter((contractId) => contractId.length > 0);

    return normalized.length > 0 ? [...new Set(normalized)] : undefined;
  }
}
