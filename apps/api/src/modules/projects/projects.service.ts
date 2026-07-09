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
  type AssignProjectDossierItemInput,
  type CreateProjectDossierInput,
  type Project,
  type ProjectActor,
  type ProjectAuditAction,
  type ProjectCapability,
  type ProjectAuditEvent,
  type ProjectDossier,
  type ProjectDossierItem,
  type ProjectDossierItemType,
  type ProjectEditorialClassification,
  type ProjectEditorialDomain,
  type ProjectDossierOverview,
  type ProjectEditorialProcessStage,
  type ProjectIdentity,
  type ProjectOrigin,
  type ProjectPublicationType,
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

const PROJECT_PUBLICATION_TYPES: readonly ProjectPublicationType[] = [
  "BOOK",
  "CHILDRENS_BOOK",
  "MAGAZINE",
  "POETRY",
  "DICTIONARY",
  "COURSE",
  "AUDIOBOOK",
  "VIDEO"
];

const PROJECT_CAPABILITIES: readonly ProjectCapability[] = [
  "ILLUSTRATIONS",
  "TRANSLATION",
  "AUDIOBOOK",
  "VIDEO",
  "FLIPBOOK",
  "ACCESSIBILITY"
];

const PROJECT_EDITORIAL_DOMAINS: readonly ProjectEditorialDomain[] = [
  "LITERATURE",
  "PHILOSOPHY",
  "SPIRITISM",
  "RELIGION",
  "PSYCHOLOGY",
  "EDUCATION",
  "HISTORY",
  "SCIENCE",
  "BIOLOGY",
  "MATHEMATICS",
  "MEDICINE",
  "ART",
  "MUSIC",
  "LINGUISTICS",
  "LAW",
  "ECONOMICS",
  "TECHNOLOGY",
  "CHILDREN_EDUCATIONAL",
  "OTHER"
];

const PROJECT_DOSSIER_ITEM_TYPES: readonly ProjectDossierItemType[] = [
  "MANUSCRIPT",
  "DOCUMENT",
  "RESEARCH_FILE",
  "CONTRACT",
  "IMAGE",
  "AUDIO",
  "VIDEO",
  "EXPORT",
  "PUBLISHING_FILE",
  "OTHER_ASSET"
];

const DEFAULT_PROJECT_DOSSIERS = [
  "Original",
  "Manuscript",
  "Documentation",
  "Translations",
  "Review",
  "Contracts",
  "Images",
  "Audio",
  "Video",
  "Exports",
  "Publishing"
] as const;

const BASE_EDITORIAL_PROCESS: readonly ProjectEditorialProcessStage[] = [
  "IMPORT",
  "ANALYSIS",
  "EDITING",
  "REVIEW",
  "EDITORIAL_VALIDATION",
  "LAYOUT",
  "EXPORT",
  "TECHNICAL_VALIDATION",
  "FINAL_APPROVAL",
  "PUBLICATION"
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
    const publicationType = this.validatePublicationType(input.publicationType);
    const editorialDomain = this.normalizeEditorialDomain(input.editorialDomain, input.domain);
    const editorialClassification = this.normalizeEditorialClassification(input.editorialClassification);
    const capabilities = this.normalizeProjectCapabilities(input.capabilities, publicationType);
    const editorialProcess = this.buildEditorialProcess(publicationType, capabilities);
    const originalLanguage = this.normalizeIsoLanguage(input.originalLanguage ?? input.sourceLanguage, input.originalLocale);
    const targetLanguages = input.targetLanguages.map((targetLanguage, index) =>
      this.normalizeTranslationTarget(targetLanguage, input.targetLocales?.[index])
    );
    const targetLocales = targetLanguages.flatMap((target) => target.locale ? [target.locale] : []);
    const metadata = {
      ...(input.metadata ?? {}),
      projectIdentity,
      publicationType,
      editorialDomain,
      editorialClassification,
      capabilities,
      editorialProcess
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
      domain: input.domain ?? editorialDomain,
      status: "ACTIVE",
      publicationType,
      editorialDomain,
      editorialClassification,
      capabilities,
      editorialProcess,
      projectIdentity,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata
    });

    await this.audit("CREATE", actor, project.id, undefined, project);
    await this.ensureDefaultDossiers(actor, project.id);

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

  async listProjectDossiers(actor: ProjectActor, projectId: string): Promise<ProjectDossierOverview> {
    this.validateActor(actor);
    await this.getProject(actor, projectId);
    const dossiers = await this.ensureDefaultDossiers(actor, projectId);
    const items = await this.repository.listDossierItems(projectId, actor.organizationId);

    return {
      dossiers: this.sortDossiers(dossiers),
      items
    };
  }

  async createProjectDossier(
    actor: ProjectActor,
    projectId: string,
    input: CreateProjectDossierInput
  ): Promise<ProjectDossier> {
    this.validateActor(actor);
    await this.getProject(actor, projectId);

    if (!input.name?.trim()) {
      throw new BadRequestException("dossier name is required.");
    }

    if (input.parentDossierId) {
      await this.assertDossierBelongsToProject(actor, projectId, input.parentDossierId);
    }

    const existingDossiers = await this.ensureDefaultDossiers(actor, projectId);
    const now = new Date().toISOString();
    const dossier = await this.repository.createDossier({
      id: randomUUID(),
      organizationId: actor.organizationId,
      projectId,
      parentDossierId: input.parentDossierId,
      name: input.name.trim(),
      slug: this.toDossierSlug(input.name),
      dossierType: "CUSTOM",
      order: existingDossiers.length + 1,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now
    });

    await this.audit("DOSSIER_CREATED", actor, dossier.id, undefined, dossier, "PROJECT_DOSSIER");

    return dossier;
  }

  async assignProjectDossierItem(
    actor: ProjectActor,
    projectId: string,
    input: AssignProjectDossierItemInput
  ): Promise<ProjectDossierItem> {
    this.validateActor(actor);
    await this.getProject(actor, projectId);

    if (!input.dossierId || !input.itemId || !input.itemType) {
      throw new BadRequestException("dossierId, itemType and itemId are required.");
    }

    if (!PROJECT_DOSSIER_ITEM_TYPES.includes(input.itemType)) {
      throw new BadRequestException("Unsupported dossier item type.");
    }

    await this.assertDossierBelongsToProject(actor, projectId, input.dossierId);
    const existingItems = await this.repository.listDossierItems(projectId, actor.organizationId);
    const itemId = this.toDossierItemAssignmentId(projectId, input.itemType, input.itemId);
    const beforeState = existingItems.find((item) => item.id === itemId);
    const assignedAt = new Date().toISOString();
    const item = await this.repository.assignDossierItem({
      id: itemId,
      organizationId: actor.organizationId,
      projectId,
      dossierId: input.dossierId,
      itemType: input.itemType,
      itemId: input.itemId,
      label: input.label?.trim() || undefined,
      metadata: input.metadata,
      assignedBy: actor.userId,
      assignedAt
    });

    await this.audit(
      "DOSSIER_ITEM_ASSIGNED",
      actor,
      item.id,
      beforeState,
      item,
      "PROJECT_DOSSIER_ITEM"
    );

    return item;
  }

  getAuditEvents(actor: ProjectActor): ProjectAuditEvent[] {
    this.validateActor(actor);
    return this.repository.getAuditEvents(actor.organizationId);
  }

  private async audit(
    action: ProjectAuditAction,
    actor: ProjectActor,
    entityId: string,
    beforeState: Project | ProjectDossier | ProjectDossierItem | undefined,
    afterState: Project | ProjectDossier | ProjectDossierItem,
    entityType: ProjectAuditEvent["entityType"] = "PROJECT"
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      actorId: actor.userId,
      action,
      entityType,
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

  private validatePublicationType(publicationType: ProjectPublicationType | undefined): ProjectPublicationType {
    if (!publicationType) {
      throw new BadRequestException("Publication Type is required.");
    }

    if (!PROJECT_PUBLICATION_TYPES.includes(publicationType)) {
      throw new BadRequestException("Unsupported publication type.");
    }

    return publicationType;
  }

  private normalizeProjectCapabilities(
    capabilities: ProjectCapability[] | undefined,
    publicationType: ProjectPublicationType
  ): ProjectCapability[] {
    const normalized = [...new Set(capabilities ?? [])];

    for (const capability of normalized) {
      if (!PROJECT_CAPABILITIES.includes(capability)) {
        throw new BadRequestException("Unsupported project capability.");
      }
    }

    if (normalized.includes("FLIPBOOK") && publicationType !== "MAGAZINE") {
      throw new BadRequestException("Flipbook capability is available only for Magazine projects.");
    }

    if (publicationType === "AUDIOBOOK" && !normalized.includes("AUDIOBOOK")) {
      normalized.push("AUDIOBOOK");
    }

    if (publicationType === "VIDEO" && !normalized.includes("VIDEO")) {
      normalized.push("VIDEO");
    }

    return normalized;
  }

  private normalizeEditorialDomain(
    editorialDomain: ProjectEditorialDomain | undefined,
    legacyDomain: string | undefined
  ): ProjectEditorialDomain {
    if (editorialDomain) {
      if (!PROJECT_EDITORIAL_DOMAINS.includes(editorialDomain)) {
        throw new BadRequestException("Unsupported editorial domain.");
      }

      return editorialDomain;
    }

    const normalizedLegacyDomain = legacyDomain
      ?.trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    if (normalizedLegacyDomain && PROJECT_EDITORIAL_DOMAINS.includes(normalizedLegacyDomain as ProjectEditorialDomain)) {
      return normalizedLegacyDomain as ProjectEditorialDomain;
    }

    return "OTHER";
  }

  private normalizeEditorialClassification(
    classification: ProjectEditorialClassification | undefined
  ): ProjectEditorialClassification | undefined {
    const normalized = {
      collection: classification?.collection?.trim() || undefined,
      series: classification?.series?.trim() || undefined,
      volume: classification?.volume?.trim() || undefined
    };

    return normalized.collection || normalized.series || normalized.volume ? normalized : undefined;
  }

  private buildEditorialProcess(
    publicationType: ProjectPublicationType,
    capabilities: ProjectCapability[]
  ): ProjectEditorialProcessStage[] {
    const capabilitySet = new Set(capabilities);
    const stages: ProjectEditorialProcessStage[] = [];

    for (const stage of BASE_EDITORIAL_PROCESS) {
      if (stage === "EDITING" && capabilitySet.has("ILLUSTRATIONS")) {
        stages.push("ILLUSTRATION");
      }

      if (stage === "REVIEW" && capabilitySet.has("TRANSLATION")) {
        stages.push("TRANSLATION");
      }

      if (stage === "FINAL_APPROVAL" && capabilitySet.has("ACCESSIBILITY")) {
        stages.push("ACCESSIBILITY");
      }

      stages.push(stage);
    }

    if (publicationType === "AUDIOBOOK" || capabilitySet.has("AUDIOBOOK")) {
      stages.push("AUDIOBOOK");
    }

    if (publicationType === "VIDEO" || capabilitySet.has("VIDEO")) {
      stages.push("VIDEO");
    }

    if (publicationType === "MAGAZINE" && capabilitySet.has("FLIPBOOK")) {
      stages.push("FLIPBOOK");
    }

    return stages;
  }

  private async ensureDefaultDossiers(actor: ProjectActor, projectId: string): Promise<ProjectDossier[]> {
    const existingDossiers = await this.repository.listDossiers(projectId, actor.organizationId);
    const existingDefaultSlugs = new Set(
      existingDossiers
        .filter((dossier) => dossier.dossierType === "DEFAULT" && !dossier.parentDossierId)
        .map((dossier) => dossier.slug)
    );
    const createdDossiers: ProjectDossier[] = [];

    for (const [index, name] of DEFAULT_PROJECT_DOSSIERS.entries()) {
      const slug = this.toDossierSlug(name);

      if (existingDefaultSlugs.has(slug)) {
        continue;
      }

      const now = new Date().toISOString();
      const dossier = await this.repository.createDossier({
        id: randomUUID(),
        organizationId: actor.organizationId,
        projectId,
        name,
        slug,
        dossierType: "DEFAULT",
        order: index + 1,
        createdBy: actor.userId,
        createdAt: now,
        updatedAt: now
      });

      await this.audit("DOSSIER_CREATED", actor, dossier.id, undefined, dossier, "PROJECT_DOSSIER");
      createdDossiers.push(dossier);
    }

    return this.sortDossiers([...existingDossiers, ...createdDossiers]);
  }

  private sortDossiers(dossiers: ProjectDossier[]): ProjectDossier[] {
    return [...dossiers].sort((left, right) => {
      if ((left.parentDossierId ?? "") !== (right.parentDossierId ?? "")) {
        return (left.parentDossierId ?? "").localeCompare(right.parentDossierId ?? "");
      }

      return left.order - right.order || left.name.localeCompare(right.name);
    });
  }

  private async assertDossierBelongsToProject(
    actor: ProjectActor,
    projectId: string,
    dossierId: string
  ): Promise<ProjectDossier> {
    const dossier = await this.repository.findDossierById(dossierId, actor.organizationId);

    if (!dossier || dossier.projectId !== projectId) {
      throw new NotFoundException("project dossier not found.");
    }

    return dossier;
  }

  private toDossierSlug(name: string): string {
    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return slug || "dossier";
  }

  private toDossierItemAssignmentId(
    projectId: string,
    itemType: ProjectDossierItemType,
    itemId: string
  ): string {
    return `${projectId}:${itemType}:${itemId}`;
  }
}
