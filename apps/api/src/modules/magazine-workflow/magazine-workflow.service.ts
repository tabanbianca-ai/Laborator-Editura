import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DocumentsService } from "../documents/documents.service";
import { type Document } from "../documents/documents.types";
import { LayoutPublishingService } from "../layout-publishing/layout-publishing.service";
import { ProjectsService } from "../projects/projects.service";
import { RightsProvenanceService } from "../rights-provenance/rights-provenance.service";
import {
  type PublishingAuthorization,
  type TranslationAuthorization
} from "../rights-provenance/rights-provenance.types";
import { WorkflowService } from "../workflow/workflow.service";
import { DatabaseMagazineWorkflowRepository } from "./magazine-workflow.repository";
import {
  type CreateMagazineArticleComponentInput,
  type CreateMagazineArticleInput,
  type CreateMagazineCommonMaterialInput,
  type CreateMagazineIssueInput,
  type CreateMagazineRevisionInput,
  type CreateMagazineReviewItemInput,
  type CreateMagazineReuseInput,
  type CreateMagazineSectionInput,
  type MagazineDerivationType,
  type MagazineActor,
  type MagazineAdaptabilityAnalysis,
  type MagazineArticle,
  type MagazineArticleComponent,
  type MagazineArticleComponentType,
  type MagazineAuditAction,
  type MagazineAuditEvent,
  type MagazineCommonMaterial,
  type MagazineCommonMaterialType,
  type MagazineDistributionPromotionRecord,
  type MagazineFinalApprovalInput,
  type MagazineGateStatus,
  type MagazineIssue,
  type MagazineIssueOverview,
  type MagazineIssueStatus,
  type MagazineIssueVersion,
  type MagazineQualityGateIssue,
  type MagazineQualityGateResult,
  type MagazineReviewItem,
  type MagazineReviewSeverity,
  type MagazineSourceLineage,
  type MagazineSection,
  type MagazineTableOfContents,
  type MagazineValidationStatus,
  type MoveMagazineArticleInput,
  type OverrideMagazineReviewItemInput,
  type RecordMagazineDistributionPromotionInput,
  type ReorderMagazineArticlesInput,
  type RepublishMagazineIssueInput,
  type ResolveMagazineReviewItemInput,
  type UpdateMagazineReviewSeverityInput,
  type UpdateMagazineArticleTextInput,
  type WithdrawMagazineIssueInput
} from "./magazine-workflow.types";

const HUMAN_APPROVAL_ROLES = new Set(["PLATFORM_CREATOR", "ADMIN", "EDITOR", "REVIEWER"]);
const DEFAULT_COMMON_MATERIALS: ReadonlyArray<{
  materialType: MagazineCommonMaterialType;
  title: string;
  required: boolean;
}> = [
  { materialType: "FRONT_COVER", title: "Front cover", required: true },
  { materialType: "BACK_COVER", title: "Back cover", required: true },
  { materialType: "EDITORIAL", title: "Editorial", required: true },
  { materialType: "TABLE_OF_CONTENTS", title: "Table of contents", required: true },
  { materialType: "MASTHEAD", title: "Masthead", required: true },
  { materialType: "ISSUE_METADATA", title: "Issue metadata", required: true },
  { materialType: "INTRODUCTORY_PAGE", title: "Introductory pages", required: false },
  { materialType: "FINAL_PAGE", title: "Final pages", required: false },
  { materialType: "ADVERTISEMENT", title: "Advertising and notices", required: false },
  { materialType: "GLOBAL_GRAPHIC", title: "Global graphics", required: false }
];

const BLOCKING_COMPONENT_STATUSES = new Set<MagazineValidationStatus>([
  "DRAFT",
  "OUTDATED",
  "FAILED"
]);

const LOCKED_PUBLICATION_STATES = new Set<MagazineIssueStatus>([
  "PUBLISHED",
  "REPUBLISHED"
]);

@Injectable()
export class MagazineWorkflowService {
  constructor(
    private readonly repository: DatabaseMagazineWorkflowRepository,
    private readonly projectsService: ProjectsService,
    private readonly documentsService: DocumentsService,
    private readonly workflowService: WorkflowService,
    private readonly layoutPublishingService: LayoutPublishingService,
    private readonly rightsProvenanceService: RightsProvenanceService
  ) {}

  async createIssue(
    actor: MagazineActor,
    input: CreateMagazineIssueInput
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    this.validateRequired(input.projectId, "projectId");
    this.validateRequired(input.title, "title");
    this.validateRequired(input.issueNumber, "issueNumber");
    this.validateRequired(input.language, "language");

    const project = await this.projectsService.getProject(actor, input.projectId);

    if (project.publicationType !== "MAGAZINE") {
      throw new BadRequestException("Magazine workflow requires a Magazine project.");
    }

    const now = new Date().toISOString();
    const issue: MagazineIssue = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      projectId: input.projectId,
      title: input.title,
      issueNumber: input.issueNumber,
      publicationDate: input.publicationDate,
      issn: input.issn,
      language: input.language,
      status: "DRAFT",
      articleOrder: [],
      sectionOrder: [],
      commonMaterialIds: [],
      tableOfContents: {
        status: "OUTDATED",
        entries: []
      },
      distributionPromotionHistory: [],
      version: 1,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: {
        ...(input.metadata ?? {}),
        rightsStatus: project.projectIdentity?.rightsStatus,
        magazineWorkflowEngine: "EXISTING_WORKFLOW_ENGINE",
        librarySingleSourceOfTruth: true,
        documentMasterSingleSourceOfTruth: true,
        distributionPromotionSeparateFromPublication: true
      }
    };

    const created = await this.repository.createIssue(issue);
    await this.createIssueVersion(actor, created, "DRAFT", "Magazine issue created.");
    const issueWithMaterials = await this.ensureDefaultCommonMaterials(actor, created);
    await this.audit(
      "MAGAZINE_ISSUE_CREATED",
      actor,
      { issueId: issueWithMaterials.id },
      undefined,
      issueWithMaterials
    );

    return this.getIssueOverview(actor, issueWithMaterials.id);
  }

  async listIssues(actor: MagazineActor): Promise<MagazineIssueOverview[]> {
    this.validateActor(actor);
    const issues = await this.repository.listIssues(actor.organizationId);
    const sorted = issues.sort(
      (left, right) =>
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    );

    return Promise.all(sorted.map((issue) => this.getIssueOverview(actor, issue.id)));
  }

  async getIssueOverview(
    actor: MagazineActor,
    issueId: string
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    const issue = await this.getIssue(actor, issueId);
    const [sections, articles, commonMaterials, reviewItems, issueVersions] =
      await Promise.all([
        this.repository.listSections(issue.id, actor.organizationId),
        this.articlesWithComponents(issue),
        this.repository.listCommonMaterials(issue.id, actor.organizationId),
        this.repository.listReviewItemsByIssue(issue.id, actor.organizationId),
        this.repository.listIssueVersions(issue.id, actor.organizationId)
      ]);
    const tableOfContents = this.buildTableOfContents(
      issue,
      sections,
      articles.map((article) => article.article)
    );
    const qualityGate = this.evaluateIssueQualityGate(
      issue,
      articles,
      commonMaterials,
      tableOfContents,
      false,
      reviewItems
    );
    const adaptabilityAnalysis = this.buildAdaptabilityAnalysis(issue, articles);

    return {
      issue,
      sections: this.sortSections(sections),
      articles: articles.map(({ article, components }) => ({ ...article, components })),
      reviewItems,
      commonMaterials,
      tableOfContents,
      currentOfficialVersion: issue.currentOfficialVersionId
        ? issueVersions.find((version) => version.id === issue.currentOfficialVersionId)
        : undefined,
      qualityGate,
      adaptabilityAnalysis
    };
  }

  async createSection(
    actor: MagazineActor,
    issueId: string,
    input: CreateMagazineSectionInput
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    this.validateRequired(input.title, "title");
    const issue = await this.getIssue(actor, issueId);
    this.assertIssueEditable(issue);
    const sections = await this.repository.listSections(issue.id, actor.organizationId);
    const now = new Date().toISOString();
    const section: MagazineSection = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      issueId: issue.id,
      title: input.title,
      order: input.order ?? sections.length + 1,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createSection(section);
    const updatedIssue = await this.updateIssueStructure(actor, issue, {
      sectionOrder: [...issue.sectionOrder, created.id],
      status: this.productionStatus(issue),
      tableOfContents: this.markTableOfContentsOutdated(issue.tableOfContents)
    });

    await this.audit(
      "MAGAZINE_SECTION_CREATED",
      actor,
      { issueId: issue.id },
      undefined,
      created
    );
    await this.audit(
      "MAGAZINE_TABLE_OF_CONTENTS_UPDATED",
      actor,
      { issueId: issue.id },
      issue,
      updatedIssue,
      "Section added."
    );

    return this.getIssueOverview(actor, issue.id);
  }

  async createCommonMaterial(
    actor: MagazineActor,
    issueId: string,
    input: CreateMagazineCommonMaterialInput
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    this.validateRequired(input.materialType, "materialType");
    this.validateRequired(input.title, "title");
    const issue = await this.getIssue(actor, issueId);
    this.assertIssueEditable(issue);
    const now = new Date().toISOString();
    const material: MagazineCommonMaterial = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      issueId: issue.id,
      materialType: input.materialType,
      title: input.title,
      included: input.included ?? true,
      required: input.required ?? false,
      status: input.status ?? "DRAFT",
      componentRefs: input.componentRefs ?? [],
      version: 1,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createCommonMaterial(material);
    const updatedIssue = await this.updateIssueStructure(actor, issue, {
      commonMaterialIds: [...issue.commonMaterialIds, created.id]
    });

    await this.audit(
      "MAGAZINE_COMMON_MATERIAL_CREATED",
      actor,
      { issueId: issue.id, commonMaterialId: created.id },
      undefined,
      created
    );
    await this.audit(
      "MAGAZINE_TABLE_OF_CONTENTS_UPDATED",
      actor,
      { issueId: issue.id },
      issue,
      updatedIssue,
      "Common material added."
    );

    return this.getIssueOverview(actor, issue.id);
  }

  async validateCommonMaterial(
    actor: MagazineActor,
    materialId: string
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    const existing = await this.getCommonMaterial(actor, materialId);
    const issue = await this.getIssue(actor, existing.issueId);
    this.assertIssueEditable(issue);
    const saved = await this.repository.updateCommonMaterial({
      ...existing,
      status: "VALIDATED",
      version: existing.version + 1,
      updatedAt: new Date().toISOString()
    });

    await this.audit(
      "MAGAZINE_COMMON_MATERIAL_VALIDATED",
      actor,
      { issueId: existing.issueId, commonMaterialId: saved.id },
      existing,
      saved
    );

    return this.getIssueOverview(actor, existing.issueId);
  }

  async createArticle(
    actor: MagazineActor,
    issueId: string,
    input: CreateMagazineArticleInput
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    this.validateRequired(input.title, "title");
    this.validateRequired(input.language, "language");
    this.validateRequired(input.textContent, "textContent");

    const issue = await this.getIssue(actor, issueId);
    this.assertIssueEditable(issue);

    const sourceDocument = input.documentId
      ? await this.documentsService.getDocument(actor, input.documentId)
      : undefined;

    if (input.sectionId) {
      await this.assertSectionBelongsToIssue(actor, issue.id, input.sectionId);
    }

    const now = new Date().toISOString();
    const articleId = randomUUID();
    const workflow = await this.workflowService.startWorkflow(actor, {
      projectId: issue.projectId,
      documentId: input.documentId ?? articleId,
      scope: "DOCUMENT",
      metadata: {
        magazineIssueId: issue.id,
        magazineArticleId: articleId,
        magazineWorkflow: true,
        translationConditional: true
      }
    });
    const article: MagazineArticle = {
      id: articleId,
      organizationId: actor.organizationId,
      issueId: issue.id,
      projectId: issue.projectId,
      documentId: input.documentId,
      workflowStateId: workflow.id,
      title: input.title,
      authors: input.authors ?? [],
      sectionId: input.sectionId,
      category: input.category,
      language: input.language,
      rightsStatus: input.rightsStatus,
      keywords: input.keywords ?? [],
      identifier: input.identifier,
      textContent: input.textContent,
      textStatus: "DRAFT",
      translationRequired: input.translationRequired ?? false,
      translationStatus: input.translationRequired ? "PENDING" : "NOT_REQUIRED",
      correctionStatus: "PENDING",
      editorialApprovalStatus: "PENDING",
      componentIds: [],
      readyForIssue: false,
      readyForIssueBlockers: [
        "TEXT_NOT_VALIDATED",
        "CORRECTION_REQUIRED",
        "EDITORIAL_APPROVAL_REQUIRED"
      ],
      status: input.translationRequired ? "IN_TRANSLATION" : "DRAFT",
      order: issue.articleOrder.length + 1,
      version: 1,
      reusable: input.reusable ?? false,
      provenance: this.buildArticleProvenance(articleId, input, sourceDocument),
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const createdArticle = await this.repository.createArticle(article);
    const textComponent = await this.repository.createComponent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      issueId: issue.id,
      articleId: createdArticle.id,
      componentType: "TEXT",
      title: `${createdArticle.title} text`,
      status: "DRAFT",
      required: true,
      lineage: this.buildComponentLineage(createdArticle, "TEXT", now),
      dependsOnComponentIds: [],
      version: 1,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: {
        documentMasterSingleSourceOfTruth: true
      }
    });
    const savedArticle = await this.repository.updateArticle({
      ...createdArticle,
      componentIds: [textComponent.id]
    });
    const updatedIssue = await this.updateIssueStructure(actor, issue, {
      articleOrder: [...issue.articleOrder, savedArticle.id],
      status: "ARTICLES_IN_PRODUCTION",
      tableOfContents: this.markTableOfContentsOutdated(issue.tableOfContents)
    });

    await this.audit(
      "MAGAZINE_ARTICLE_CREATED",
      actor,
      { issueId: issue.id, articleId: savedArticle.id },
      undefined,
      savedArticle
    );
    await this.audit(
      savedArticle.provenance?.derivationType === "TRANSLATION"
        ? "MAGAZINE_TRANSLATION_PROVENANCE_RECORDED"
        : "MAGAZINE_SOURCE_LINEAGE_RECORDED",
      actor,
      { issueId: issue.id, articleId: savedArticle.id },
      undefined,
      savedArticle.provenance,
      "Magazine article keeps one source-of-record lineage."
    );
    await this.audit(
      "MAGAZINE_ARTICLE_COMPONENT_CREATED",
      actor,
      { issueId: issue.id, articleId: savedArticle.id, componentId: textComponent.id },
      undefined,
      textComponent
    );
    await this.audit(
      "MAGAZINE_TABLE_OF_CONTENTS_UPDATED",
      actor,
      { issueId: issue.id },
      issue,
      updatedIssue,
      "Article added."
    );

    return this.getIssueOverview(actor, issue.id);
  }

  async addArticleComponent(
    actor: MagazineActor,
    articleId: string,
    input: CreateMagazineArticleComponentInput
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    this.validateRequired(input.componentType, "componentType");
    this.validateRequired(input.title, "title");
    const article = await this.getArticle(actor, articleId);
    const issue = await this.getIssue(actor, article.issueId);
    this.assertIssueEditable(issue);
    const now = new Date().toISOString();
    const component: MagazineArticleComponent = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      issueId: article.issueId,
      articleId: article.id,
      componentType: input.componentType,
      title: input.title,
      status: input.status ?? "DRAFT",
      required: input.required ?? input.componentType === "TEXT",
      assetId: input.assetId,
      sourceComponentId: input.sourceComponentId,
      lineage: this.buildComponentLineage(
        article,
        input.componentType,
        now,
        input.lineage
      ),
      dependsOnComponentIds: input.dependsOnComponentIds ?? [],
      transcriptComponentId: input.transcriptComponentId,
      subtitleComponentId: input.subtitleComponentId,
      reviewSeverity: input.reviewSeverity,
      version: 1,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createComponent(component);
    const savedArticle = await this.repository.updateArticle({
      ...article,
      componentIds: [...article.componentIds, created.id],
      version: article.version + 1,
      updatedAt: now
    });

    await this.audit(
      "MAGAZINE_ARTICLE_COMPONENT_CREATED",
      actor,
      { issueId: article.issueId, articleId: article.id, componentId: created.id },
      undefined,
      created
    );
    await this.recalculateArticleReadiness(actor, savedArticle.id);

    return this.getIssueOverview(actor, article.issueId);
  }

  async validateArticleComponent(
    actor: MagazineActor,
    componentId: string
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    const existing = await this.getComponent(actor, componentId);
    const issue = await this.getIssue(actor, existing.issueId);
    this.assertIssueEditable(issue);
    const saved = await this.repository.updateComponent({
      ...existing,
      status: "VALIDATED",
      version: existing.version + 1,
      updatedAt: new Date().toISOString()
    });

    await this.audit(
      "MAGAZINE_ARTICLE_COMPONENT_VALIDATED",
      actor,
      { issueId: existing.issueId, articleId: existing.articleId, componentId: saved.id },
      existing,
      saved
    );
    await this.recalculateArticleReadiness(actor, existing.articleId);

    return this.getIssueOverview(actor, existing.issueId);
  }

  async finalizeArticleText(
    actor: MagazineActor,
    articleId: string
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    const article = await this.getArticle(actor, articleId);
    const issue = await this.getIssue(actor, article.issueId);
    this.assertIssueEditable(issue);
    const components = await this.repository.listComponentsByArticle(
      article.id,
      actor.organizationId
    );
    const textComponent = this.getTextComponent(components);
    const now = new Date().toISOString();
    const updatedText = await this.repository.updateComponent({
      ...textComponent,
      status: "VALIDATED",
      version: textComponent.version + 1,
      updatedAt: now
    });
    const savedArticle = await this.repository.updateArticle({
      ...article,
      textStatus: "VALIDATED",
      status: article.translationRequired ? "IN_TRANSLATION" : "IN_REVIEW",
      version: article.version + 1,
      updatedAt: now
    });

    await this.audit(
      "MAGAZINE_ARTICLE_TEXT_FINALIZED",
      actor,
      { issueId: article.issueId, articleId: article.id, componentId: updatedText.id },
      article,
      savedArticle
    );
    await this.recalculateArticleReadiness(actor, savedArticle.id);

    return this.getIssueOverview(actor, article.issueId);
  }

  async markTranslationCompleted(
    actor: MagazineActor,
    articleId: string
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    const article = await this.getArticle(actor, articleId);
    const issue = await this.getIssue(actor, article.issueId);
    this.assertIssueEditable(issue);

    if (!article.translationRequired) {
      throw new BadRequestException("Translation is not required for this article.");
    }

    const savedArticle = await this.repository.updateArticle({
      ...article,
      translationStatus: "COMPLETED",
      status: "IN_REVIEW",
      version: article.version + 1,
      updatedAt: new Date().toISOString()
    });

    await this.audit(
      "MAGAZINE_ARTICLE_TRANSLATION_MARKED",
      actor,
      { issueId: article.issueId, articleId: article.id },
      article,
      savedArticle
    );
    await this.recalculateArticleReadiness(actor, savedArticle.id);

    return this.getIssueOverview(actor, article.issueId);
  }

  async completeArticleReview(
    actor: MagazineActor,
    articleId: string
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    const article = await this.getArticle(actor, articleId);
    const issue = await this.getIssue(actor, article.issueId);
    this.assertIssueEditable(issue);
    const savedArticle = await this.repository.updateArticle({
      ...article,
      correctionStatus: "COMPLETED",
      status: "IN_REVIEW",
      version: article.version + 1,
      updatedAt: new Date().toISOString()
    });

    await this.audit(
      "MAGAZINE_ARTICLE_REVIEW_COMPLETED",
      actor,
      { issueId: article.issueId, articleId: article.id },
      article,
      savedArticle
    );
    await this.recalculateArticleReadiness(actor, savedArticle.id);

    return this.getIssueOverview(actor, article.issueId);
  }

  async approveArticle(
    actor: MagazineActor,
    articleId: string
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);
    const article = await this.getArticle(actor, articleId);
    const issue = await this.getIssue(actor, article.issueId);
    this.assertIssueEditable(issue);
    const savedArticle = await this.repository.updateArticle({
      ...article,
      editorialApprovalStatus: "APPROVED",
      status: "APPROVED",
      version: article.version + 1,
      updatedAt: new Date().toISOString()
    });

    await this.audit(
      "MAGAZINE_ARTICLE_APPROVED",
      actor,
      { issueId: article.issueId, articleId: article.id },
      article,
      savedArticle,
      "Only authorized humans may approve article readiness."
    );
    await this.recalculateArticleReadiness(actor, savedArticle.id);

    return this.getIssueOverview(actor, article.issueId);
  }

  async markArticleReadyForIssue(
    actor: MagazineActor,
    articleId: string
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    const article = await this.recalculateArticleReadiness(actor, articleId);

    if (!article.readyForIssue) {
      throw new BadRequestException(
        `Article is blocked from Ready for Issue: ${article.readyForIssueBlockers.join(", ")}`
      );
    }

    return this.getIssueOverview(actor, article.issueId);
  }

  async updateArticleText(
    actor: MagazineActor,
    articleId: string,
    input: UpdateMagazineArticleTextInput
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    this.validateRequired(input.textContent, "textContent");
    this.validateRequired(input.reason, "reason");
    const article = await this.getArticle(actor, articleId);
    const issue = await this.getIssue(actor, article.issueId);
    const now = new Date().toISOString();
    const components = await this.repository.listComponentsByArticle(
      article.id,
      actor.organizationId
    );

    await Promise.all(
      components.map((component) => {
        if (component.componentType === "TEXT") {
          return this.repository.updateComponent({
            ...component,
            status: "DRAFT",
            lineage: this.updatedLineage(
              component.lineage,
              "CURRENT",
              article.version + 1
            ),
            version: component.version + 1,
            updatedAt: now
          });
        }

        if (this.isDependentOutput(component.componentType)) {
          return this.repository.updateComponent({
            ...component,
            status:
              component.componentType === "TRANSCRIPT" ||
              component.componentType === "SUBTITLE"
                ? "NEEDS_REVIEW"
                : "OUTDATED",
            lineage: this.updatedLineage(component.lineage, "OUTDATED", article.version),
            version: component.version + 1,
            updatedAt: now
          });
        }

        return Promise.resolve(component);
      })
    );

    const savedArticle = await this.repository.updateArticle({
      ...article,
      textContent: input.textContent,
      textStatus: "DRAFT",
      translationStatus:
        article.translationRequired && article.translationStatus === "COMPLETED"
          ? "OUTDATED"
          : article.translationStatus,
      correctionStatus: "PENDING",
      editorialApprovalStatus: "PENDING",
      readyForIssue: false,
      readyForIssueBlockers: [
        "TEXT_NOT_VALIDATED",
        "CORRECTION_REQUIRED",
        "EDITORIAL_APPROVAL_REQUIRED"
      ],
      status: "NEEDS_REVIEW",
      provenance: {
        ...(article.provenance ?? {
          sourceOfRecordId: article.documentId ?? article.id,
          sourceVersionId: String(article.version),
          version: article.version
        }),
        derivedFromId: article.id,
        derivedFromVersionId: String(article.version),
        derivationType: "EDITORIAL_REVISION",
        language: article.language,
        status: "CURRENT",
        version: (article.provenance?.version ?? article.version) + 1
      },
      version: article.version + 1,
      updatedAt: now
    });
    const updatedIssue = await this.createDraftVersionIfPublished(
      actor,
      issue,
      input.reason
    );

    await this.audit(
      "MAGAZINE_ARTICLE_TEXT_UPDATED",
      actor,
      { issueId: issue.id, articleId: savedArticle.id },
      article,
      savedArticle,
      input.reason
    );
    await this.audit(
      "MAGAZINE_SOURCE_LINEAGE_RECORDED",
      actor,
      { issueId: issue.id, articleId: savedArticle.id },
      article.provenance,
      savedArticle.provenance,
      "Article text revision preserved source-of-record lineage."
    );
    await this.recalculateArticleReadiness(actor, savedArticle.id);

    return this.getIssueOverview(actor, updatedIssue.id);
  }

  async createReviewItem(
    actor: MagazineActor,
    articleId: string,
    input: CreateMagazineReviewItemInput
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    this.validateRequired(input.title, "title");
    this.validateRequired(input.description, "description");
    this.validateReviewSeverity(input.severity);
    const article = await this.getArticle(actor, articleId);
    const issue = await this.getIssue(actor, article.issueId);
    const component = input.componentId
      ? await this.getComponent(actor, input.componentId)
      : undefined;

    if (component && component.articleId !== article.id) {
      throw new BadRequestException("Review item component must belong to the article.");
    }

    const now = new Date().toISOString();
    const reviewItem: MagazineReviewItem = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      issueId: article.issueId,
      articleId: article.id,
      componentId: component?.id,
      issueVersion: issue.version,
      articleVersion: article.version,
      affectedComponentType: component?.componentType,
      severity: input.severity,
      status: "OPEN",
      blocksPublication: input.severity !== "MINOR",
      title: input.title,
      description: input.description,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: {
        ...(input.metadata ?? {}),
        minorReviewDoesNotBlockPublication: input.severity === "MINOR",
        criticalReviewCannotBeOverridden: input.severity === "CRITICAL"
      }
    };
    const created = await this.repository.createReviewItem(reviewItem);

    if (component) {
      await this.repository.updateComponent({
        ...component,
        status: "NEEDS_REVIEW",
        reviewSeverity: input.severity,
        version: component.version + 1,
        updatedAt: now
      });
    }

    await this.audit(
      "MAGAZINE_REVIEW_ITEM_CREATED",
      actor,
      {
        issueId: article.issueId,
        articleId: article.id,
        componentId: component?.id,
        reviewItemId: created.id
      },
      undefined,
      created,
      "Review item created with explicit severity."
    );
    await this.refreshReviewImpact(actor, issue, article, created);

    return this.getIssueOverview(actor, article.issueId);
  }

  async updateReviewItemSeverity(
    actor: MagazineActor,
    reviewItemId: string,
    input: UpdateMagazineReviewSeverityInput
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);
    this.validateReviewSeverity(input.severity);
    this.validateRequired(input.reason, "reason");
    const existing = await this.getReviewItem(actor, reviewItemId);
    const issue = await this.getIssue(actor, existing.issueId);
    const article = existing.articleId
      ? await this.getArticle(actor, existing.articleId)
      : undefined;
    const saved = await this.repository.updateReviewItem({
      ...existing,
      severity: input.severity,
      status: "OPEN",
      blocksPublication: input.severity !== "MINOR",
      override: undefined,
      updatedAt: new Date().toISOString()
    });

    if (existing.componentId) {
      const component = await this.getComponent(actor, existing.componentId);
      await this.repository.updateComponent({
        ...component,
        status: "NEEDS_REVIEW",
        reviewSeverity: input.severity,
        reviewOverride: undefined,
        version: component.version + 1,
        updatedAt: new Date().toISOString()
      });
    }

    await this.audit(
      "MAGAZINE_REVIEW_SEVERITY_CHANGED",
      actor,
      {
        issueId: existing.issueId,
        articleId: existing.articleId,
        componentId: existing.componentId,
        reviewItemId: saved.id
      },
      existing,
      saved,
      input.reason
    );

    if (article) {
      await this.refreshReviewImpact(actor, issue, article, saved);
    }

    return this.getIssueOverview(actor, existing.issueId);
  }

  async overrideReviewItem(
    actor: MagazineActor,
    reviewItemId: string,
    input: OverrideMagazineReviewItemInput
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);
    this.validateRequired(input.justification, "justification");
    const existing = await this.getReviewItem(actor, reviewItemId);

    if (existing.severity !== "MAJOR") {
      throw new BadRequestException(
        "Only MAJOR magazine review items may be overridden."
      );
    }

    if (existing.status === "RESOLVED") {
      throw new BadRequestException("Resolved review items cannot be overridden.");
    }

    const article = existing.articleId
      ? await this.getArticle(actor, existing.articleId)
      : undefined;

    if (
      article &&
      (article.correctionStatus !== "COMPLETED" ||
        article.editorialApprovalStatus !== "APPROVED")
    ) {
      throw new BadRequestException(
        "Review override cannot bypass mandatory correction or editorial approval."
      );
    }

    const issue = await this.getIssue(actor, existing.issueId);
    const override = {
      id: randomUUID(),
      severity: "MAJOR" as const,
      actorId: actor.userId,
      createdAt: new Date().toISOString(),
      justification: input.justification,
      issueVersion: existing.issueVersion,
      articleVersion: existing.articleVersion,
      affectedComponentId: existing.componentId
    };
    const saved = await this.repository.updateReviewItem({
      ...existing,
      status: "OVERRIDDEN",
      blocksPublication: false,
      override,
      updatedAt: override.createdAt
    });

    if (existing.componentId) {
      const component = await this.getComponent(actor, existing.componentId);
      await this.repository.updateComponent({
        ...component,
        reviewSeverity: "MAJOR",
        reviewOverride: override,
        version: component.version + 1,
        updatedAt: override.createdAt
      });
    }

    await this.audit(
      "MAGAZINE_MAJOR_REVIEW_OVERRIDDEN",
      actor,
      {
        issueId: existing.issueId,
        articleId: existing.articleId,
        componentId: existing.componentId,
        reviewItemId: saved.id
      },
      existing,
      saved,
      input.justification
    );

    if (article) {
      await this.refreshReviewImpact(actor, issue, article, saved);
    }

    return this.getIssueOverview(actor, existing.issueId);
  }

  async resolveReviewItem(
    actor: MagazineActor,
    reviewItemId: string,
    input: ResolveMagazineReviewItemInput = {}
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);
    const existing = await this.getReviewItem(actor, reviewItemId);
    const saved = await this.repository.updateReviewItem({
      ...existing,
      status: "RESOLVED",
      blocksPublication: false,
      resolvedBy: actor.userId,
      resolvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    if (existing.componentId) {
      await this.clearResolvedComponentReviewState(actor, existing);
    }

    await this.audit(
      "MAGAZINE_REVIEW_ITEM_RESOLVED",
      actor,
      {
        issueId: existing.issueId,
        articleId: existing.articleId,
        componentId: existing.componentId,
        reviewItemId: saved.id
      },
      existing,
      saved,
      input.reason ?? "Review item resolved and revalidation recorded."
    );

    if (existing.articleId) {
      await this.recalculateArticleReadiness(actor, existing.articleId);
    }

    await this.clearCurrentOfficialFlagIfResolved(actor, existing);

    return this.getIssueOverview(actor, existing.issueId);
  }

  async reorderArticles(
    actor: MagazineActor,
    issueId: string,
    input: ReorderMagazineArticlesInput
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    const issue = await this.getIssue(actor, issueId);
    this.assertIssueEditable(issue);
    const articles = await this.repository.listArticles(issue.id, actor.organizationId);
    const expected = new Set(articles.map((article) => article.id));
    const received = new Set(input.articleIds);

    if (
      expected.size !== received.size ||
      [...expected].some((articleId) => !received.has(articleId))
    ) {
      throw new BadRequestException("Reorder must include every article exactly once.");
    }

    const now = new Date().toISOString();
    await Promise.all(
      input.articleIds.map((articleId, index) => {
        const article = articles.find((item) => item.id === articleId);

        if (!article) {
          throw new BadRequestException("Unknown article in reorder list.");
        }

        return this.repository.updateArticle({
          ...article,
          order: index + 1,
          updatedAt: now
        });
      })
    );
    const updatedIssue = await this.updateIssueStructure(actor, issue, {
      articleOrder: input.articleIds,
      tableOfContents: this.markTableOfContentsOutdated(issue.tableOfContents)
    });

    await this.audit(
      "MAGAZINE_ARTICLES_REORDERED",
      actor,
      { issueId: issue.id },
      issue,
      updatedIssue,
      input.reason ?? "Article order changed."
    );

    return this.getIssueOverview(actor, issue.id);
  }

  async moveArticle(
    actor: MagazineActor,
    articleId: string,
    input: MoveMagazineArticleInput
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    const article = await this.getArticle(actor, articleId);
    const issue = await this.getIssue(actor, article.issueId);
    this.assertIssueEditable(issue);

    if (input.sectionId) {
      await this.assertSectionBelongsToIssue(actor, issue.id, input.sectionId);
    }

    const articleOrder = this.repositionArticle(
      issue.articleOrder,
      article.id,
      input.order
    );
    const now = new Date().toISOString();
    const savedArticle = await this.repository.updateArticle({
      ...article,
      sectionId: input.sectionId,
      order: articleOrder.indexOf(article.id) + 1,
      updatedAt: now
    });
    await Promise.all(
      articleOrder.map(async (orderedArticleId, index) => {
        if (orderedArticleId === savedArticle.id) {
          return savedArticle;
        }

        const orderedArticle = await this.getArticle(actor, orderedArticleId);
        return this.repository.updateArticle({
          ...orderedArticle,
          order: index + 1,
          updatedAt: now
        });
      })
    );
    const updatedIssue = await this.updateIssueStructure(actor, issue, {
      articleOrder,
      tableOfContents: this.markTableOfContentsOutdated(issue.tableOfContents)
    });

    await this.audit(
      "MAGAZINE_ARTICLE_MOVED",
      actor,
      { issueId: issue.id, articleId: article.id },
      article,
      savedArticle,
      input.reason ?? "Article moved between sections or issue positions."
    );
    await this.audit(
      "MAGAZINE_TABLE_OF_CONTENTS_UPDATED",
      actor,
      { issueId: issue.id },
      issue,
      updatedIssue,
      "Article moved."
    );

    return this.getIssueOverview(actor, issue.id);
  }

  async refreshTableOfContents(
    actor: MagazineActor,
    issueId: string
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    const issue = await this.getIssue(actor, issueId);
    this.assertIssueEditable(issue);
    const sections = await this.repository.listSections(issue.id, actor.organizationId);
    const articles = await this.repository.listArticles(issue.id, actor.organizationId);
    const tableOfContents = this.buildTableOfContents(issue, sections, articles);
    const updatedIssue = await this.updateIssueStructure(actor, issue, {
      tableOfContents: {
        ...tableOfContents,
        status: "CURRENT",
        generatedAt: new Date().toISOString()
      }
    });

    await this.audit(
      "MAGAZINE_TABLE_OF_CONTENTS_UPDATED",
      actor,
      { issueId: issue.id },
      issue,
      updatedIssue,
      "Table of contents regenerated from issue structure."
    );

    return this.getIssueOverview(actor, issue.id);
  }

  async assembleLayout(
    actor: MagazineActor,
    issueId: string
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    const overview = await this.getIssueOverview(actor, issueId);
    const blockingIssue = overview.qualityGate.blockers.find(
      (issue) => issue.sourceComponent === "ARTICLE"
    );

    if (blockingIssue) {
      throw new BadRequestException(
        "Layout assembly requires all included articles to be Ready for Issue."
      );
    }

    const currentOverview =
      overview.issue.tableOfContents.status === "CURRENT"
        ? overview
        : await this.refreshTableOfContents(actor, issueId);
    const articleIds = currentOverview.articles.map((article) => article.id);
    const plan = await this.layoutPublishingService.createPlan(actor, {
      projectId: currentOverview.issue.projectId,
      publicationKind: "MAGAZINE",
      title: currentOverview.issue.title,
      language: currentOverview.issue.language,
      magazineLayout: {
        issues: [currentOverview.issue.id],
        articles: articleIds,
        columns: currentOverview.sections.map((section) => section.title),
        imageGalleries: this.componentIdsByType(currentOverview.articles, "IMAGE"),
        covers: currentOverview.commonMaterials
          .filter(
            (material) =>
              material.materialType === "FRONT_COVER" ||
              material.materialType === "BACK_COVER"
          )
          .map((material) => material.id),
        archives: []
      },
      multimedia: {
        audioChapters: this.componentIdsByType(currentOverview.articles, "AUDIO"),
        synchronizedNarration:
          this.componentIdsByType(currentOverview.articles, "AUDIO").length > 0,
        videoAssets: this.componentIdsByType(currentOverview.articles, "VIDEO"),
        illustrations: this.componentIdsByType(currentOverview.articles, "IMAGE"),
        galleries: []
      },
      metadata: {
        source: "MAGAZINE_WORKFLOW",
        noIndependentEditorialCopies: true,
        documentMasterLinksPreserved: true
      }
    });
    const updatedIssue = await this.repository.updateIssue({
      ...currentOverview.issue,
      layoutPublicationPlanId: plan.id,
      status: "LAYOUT_ASSEMBLED",
      version: currentOverview.issue.version + 1,
      updatedAt: new Date().toISOString()
    });

    await this.createIssueVersion(
      actor,
      updatedIssue,
      "DRAFT",
      "Magazine layout assembled."
    );
    await this.audit(
      "MAGAZINE_LAYOUT_ASSEMBLED",
      actor,
      { issueId: updatedIssue.id },
      currentOverview.issue,
      updatedIssue
    );

    return this.getIssueOverview(actor, issueId);
  }

  async runGlobalControl(
    actor: MagazineActor,
    issueId: string
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    const overview = await this.getIssueOverview(actor, issueId);
    const control = this.evaluateIssueQualityGate(
      overview.issue,
      overview.articles.map((article) => ({ article, components: article.components })),
      overview.commonMaterials,
      overview.tableOfContents,
      false,
      overview.reviewItems
    );
    const updatedIssue = await this.repository.updateIssue({
      ...overview.issue,
      globalControl: control,
      status: control.status === "PASS" ? "GLOBAL_CONTROL_PASSED" : overview.issue.status,
      updatedAt: new Date().toISOString()
    });

    await this.audit(
      "MAGAZINE_GLOBAL_CONTROL_RUN",
      actor,
      { issueId },
      overview.issue,
      updatedIssue
    );

    return this.getIssueOverview(actor, issueId);
  }

  async runPreflight(
    actor: MagazineActor,
    issueId: string
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    const overview = await this.getIssueOverview(actor, issueId);
    const rightsBlockers = await this.loadRightsBlockers(
      actor,
      overview.issue,
      overview.articles
    );
    const gate = this.mergeQualityGateIssues(
      this.evaluateIssueQualityGate(
        overview.issue,
        overview.articles.map((article) => ({ article, components: article.components })),
        overview.commonMaterials,
        overview.tableOfContents,
        true,
        overview.reviewItems
      ),
      rightsBlockers
    );
    const updatedIssue = await this.repository.updateIssue({
      ...overview.issue,
      preflight: gate,
      status: gate.status === "PASS" ? "PREFLIGHT_PASSED" : overview.issue.status,
      updatedAt: new Date().toISOString()
    });

    await this.audit(
      "MAGAZINE_PREFLIGHT_RUN",
      actor,
      { issueId },
      overview.issue,
      updatedIssue
    );

    return this.getIssueOverview(actor, issueId);
  }

  async approveFinalIssue(
    actor: MagazineActor,
    issueId: string,
    input: MagazineFinalApprovalInput = {}
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);
    const issue = await this.getIssue(actor, issueId);

    if (!issue.preflight || this.gateBlocksPublication(issue.preflight)) {
      throw new BadRequestException(
        "Final approval requires a passing magazine preflight."
      );
    }

    const updatedIssue = await this.repository.updateIssue({
      ...issue,
      status: "FINAL_APPROVED",
      finalApproval: {
        mode: input.approvalMode ?? "HUMAN_APPROVAL",
        approvalStatus: "APPROVED",
        approvedBy: actor.userId,
        approvedAt: new Date().toISOString(),
        humanFinalAuthorityRequired: true
      },
      updatedAt: new Date().toISOString()
    });

    await this.audit(
      "MAGAZINE_FINAL_APPROVED",
      actor,
      { issueId },
      issue,
      updatedIssue,
      input.reason ?? "Final issue approval recorded by authorized human."
    );

    return this.getIssueOverview(actor, issueId);
  }

  async publishIssue(
    actor: MagazineActor,
    issueId: string
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);
    const overview = await this.getIssueOverview(actor, issueId);
    this.assertIssuePublishable(overview);
    const officialVersion = await this.createIssueVersion(
      actor,
      overview.issue,
      "OFFICIAL",
      "Magazine issue published.",
      overview.issue.currentOfficialVersionId
    );
    await this.supersedeCurrentOfficialVersion(
      actor,
      overview.issue,
      "New official magazine issue version published.",
      officialVersion.id
    );
    const updatedIssue = await this.repository.updateIssue({
      ...overview.issue,
      status:
        overview.issue.status === "REPUBLICATION_IN_PROGRESS"
          ? "REPUBLISHED"
          : "PUBLISHED",
      publishedVersion: officialVersion,
      currentOfficialVersionId: officialVersion.id,
      currentOfficialVersionFlag: undefined,
      updatedAt: new Date().toISOString()
    });

    await this.audit(
      "MAGAZINE_PUBLISHED",
      actor,
      { issueId, issueVersionId: officialVersion.id },
      overview.issue,
      updatedIssue
    );
    await this.audit(
      "MAGAZINE_OFFICIAL_VERSION_SWITCHED",
      actor,
      { issueId, issueVersionId: officialVersion.id },
      overview.issue,
      updatedIssue,
      "Current official magazine issue version switched after publication."
    );

    return this.getIssueOverview(actor, issueId);
  }

  async createPublishedRevision(
    actor: MagazineActor,
    issueId: string,
    input: CreateMagazineRevisionInput
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);
    this.validateRequired(input.reason, "reason");
    const issue = await this.getIssue(actor, issueId);

    if (!LOCKED_PUBLICATION_STATES.has(issue.status)) {
      throw new BadRequestException(
        "Controlled revision creation requires a published magazine issue."
      );
    }

    const updatedIssue = await this.createDraftVersionIfPublished(
      actor,
      issue,
      input.reason
    );

    return this.getIssueOverview(actor, updatedIssue.id);
  }

  async withdrawIssue(
    actor: MagazineActor,
    issueId: string,
    input: WithdrawMagazineIssueInput
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);
    this.validateRequired(input.reason, "reason");
    const issue = await this.getIssue(actor, issueId);

    if (!LOCKED_PUBLICATION_STATES.has(issue.status)) {
      throw new BadRequestException("Only a published magazine issue can be withdrawn.");
    }

    const withdrawalVersion = await this.createIssueVersion(
      actor,
      issue,
      "WITHDRAWN",
      input.reason,
      issue.currentOfficialVersionId
    );
    const updatedIssue = await this.repository.updateIssue({
      ...issue,
      status: "WITHDRAWN",
      withdrawalReason: input.reason,
      currentOfficialVersionId: withdrawalVersion.id,
      updatedAt: new Date().toISOString()
    });

    await this.audit(
      "MAGAZINE_WITHDRAWN",
      actor,
      { issueId, issueVersionId: withdrawalVersion.id },
      issue,
      updatedIssue,
      input.reason
    );

    return this.getIssueOverview(actor, issueId);
  }

  async republishIssue(
    actor: MagazineActor,
    issueId: string,
    input: RepublishMagazineIssueInput
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);
    this.validateRequired(input.reason, "reason");
    const overview = await this.getIssueOverview(actor, issueId);

    if (
      overview.issue.status !== "WITHDRAWN" &&
      overview.issue.status !== "REPUBLICATION_IN_PROGRESS"
    ) {
      throw new BadRequestException(
        "Republication requires a withdrawn issue or controlled republication revision."
      );
    }

    this.assertIssuePublishable(overview);
    const officialVersion = await this.createIssueVersion(
      actor,
      overview.issue,
      "OFFICIAL",
      input.reason,
      overview.issue.currentOfficialVersionId
    );
    await this.supersedeCurrentOfficialVersion(
      actor,
      overview.issue,
      input.reason,
      officialVersion.id
    );
    const updatedIssue = await this.repository.updateIssue({
      ...overview.issue,
      status: "REPUBLISHED",
      publishedVersion: officialVersion,
      currentOfficialVersionId: officialVersion.id,
      currentOfficialVersionFlag: undefined,
      withdrawalReason: undefined,
      updatedAt: new Date().toISOString()
    });

    await this.audit(
      "MAGAZINE_REPUBLISHED",
      actor,
      { issueId, issueVersionId: officialVersion.id },
      overview.issue,
      updatedIssue,
      input.reason
    );
    await this.audit(
      "MAGAZINE_OFFICIAL_VERSION_SWITCHED",
      actor,
      { issueId, issueVersionId: officialVersion.id },
      overview.issue,
      updatedIssue,
      input.reason
    );

    return this.getIssueOverview(actor, issueId);
  }

  async recordDistributionPromotion(
    actor: MagazineActor,
    issueId: string,
    input: RecordMagazineDistributionPromotionInput
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    this.validateRequired(input.channel, "channel");
    const issue = await this.getIssue(actor, issueId);

    if (!issue.currentOfficialVersionId || !LOCKED_PUBLICATION_STATES.has(issue.status)) {
      throw new BadRequestException(
        "Distribution and promotion can use only the current official published issue."
      );
    }

    await this.assertNoCriticalCurrentOfficialReviewItems(actor, issue);

    const record: MagazineDistributionPromotionRecord = {
      id: randomUUID(),
      channel: input.channel,
      status: input.status ?? "PLANNED",
      officialVersionId: issue.currentOfficialVersionId,
      createdBy: actor.userId,
      createdAt: new Date().toISOString(),
      metadata: input.metadata
    };
    const updatedIssue = await this.repository.updateIssue({
      ...issue,
      distributionPromotionHistory: [...issue.distributionPromotionHistory, record],
      updatedAt: new Date().toISOString()
    });

    await this.audit(
      "MAGAZINE_DISTRIBUTION_PROMOTION_RECORDED",
      actor,
      { issueId },
      issue,
      updatedIssue
    );

    return this.getIssueOverview(actor, issueId);
  }

  async createCrossEditionReuse(
    actor: MagazineActor,
    input: CreateMagazineReuseInput
  ): Promise<MagazineIssueOverview> {
    this.validateActor(actor);
    this.validateRequired(input.sourceArticleId, "sourceArticleId");
    this.validateRequired(input.targetIssueId, "targetIssueId");
    const sourceArticle = await this.getArticle(actor, input.sourceArticleId);
    const targetIssue = await this.getIssue(actor, input.targetIssueId);
    this.assertIssueEditable(targetIssue);

    if (input.sectionId) {
      await this.assertSectionBelongsToIssue(actor, targetIssue.id, input.sectionId);
    }

    const created = await this.createArticle(actor, targetIssue.id, {
      documentId: sourceArticle.documentId,
      title: input.title ?? sourceArticle.title,
      authors: sourceArticle.authors,
      sectionId: input.sectionId,
      category: sourceArticle.category,
      language: sourceArticle.language,
      rightsStatus: sourceArticle.rightsStatus,
      keywords: sourceArticle.keywords,
      identifier: sourceArticle.identifier,
      textContent: sourceArticle.textContent,
      translationRequired: sourceArticle.translationRequired,
      reusable: sourceArticle.reusable,
      provenance: {
        ...sourceArticle.provenance,
        sourceIssueId: sourceArticle.issueId,
        sourceArticleId: sourceArticle.id,
        sourceArticleVersion: sourceArticle.version,
        sourceOfRecordId:
          sourceArticle.provenance?.sourceOfRecordId ??
          sourceArticle.documentId ??
          sourceArticle.id,
        sourceVersionId:
          sourceArticle.provenance?.sourceVersionId ?? String(sourceArticle.version),
        derivedFromId: sourceArticle.id,
        derivedFromVersionId: String(sourceArticle.version),
        derivationType: "CROSS_EDITION_REFERENCE",
        language: sourceArticle.language,
        status: "CURRENT",
        reusedFrom: "CROSS_EDITION_REUSE",
        version: sourceArticle.version
      },
      metadata: {
        ...(sourceArticle.metadata ?? {}),
        crossEditionReuse: true,
        sourceArticleVersion: sourceArticle.version,
        noIndependentSourceOfTruth: true
      }
    });

    await this.audit(
      "MAGAZINE_CROSS_EDITION_REUSE_CREATED",
      actor,
      { issueId: targetIssue.id },
      sourceArticle,
      created.issue,
      input.reason ?? "Article reused across magazine editions with provenance."
    );

    if (input.order) {
      const reusedArticleId =
        created.issue.articleOrder[created.issue.articleOrder.length - 1];

      if (!reusedArticleId) {
        throw new BadRequestException(
          "Cross-edition reuse did not create an article reference."
        );
      }

      return this.moveArticle(actor, reusedArticleId, {
        sectionId: input.sectionId,
        order: input.order,
        reason: input.reason
      });
    }

    return created;
  }

  async analyzeAdaptability(
    actor: MagazineActor,
    issueId: string
  ): Promise<MagazineAdaptabilityAnalysis> {
    this.validateActor(actor);
    const overview = await this.getIssueOverview(actor, issueId);
    const analysis = overview.adaptabilityAnalysis;

    await this.audit(
      "MAGAZINE_ADAPTABILITY_ANALYZED",
      actor,
      { issueId },
      undefined,
      analysis,
      "AI Project Adaptability Agent analysis is advisory only; Workflow Engine executes."
    );

    return analysis;
  }

  async listIssueVersions(
    actor: MagazineActor,
    issueId: string
  ): Promise<MagazineIssueVersion[]> {
    this.validateActor(actor);
    await this.getIssue(actor, issueId);

    return this.repository.listIssueVersions(issueId, actor.organizationId);
  }

  async listAuditEvents(
    actor: MagazineActor,
    issueId?: string
  ): Promise<MagazineAuditEvent[]> {
    this.validateActor(actor);

    return this.repository.listAuditEvents(actor.organizationId, issueId);
  }

  private async ensureDefaultCommonMaterials(
    actor: MagazineActor,
    issue: MagazineIssue
  ): Promise<MagazineIssue> {
    if (issue.commonMaterialIds.length > 0) {
      return issue;
    }

    const now = new Date().toISOString();
    const materials = await Promise.all(
      DEFAULT_COMMON_MATERIALS.map((material) =>
        this.repository.createCommonMaterial({
          id: randomUUID(),
          organizationId: actor.organizationId,
          issueId: issue.id,
          materialType: material.materialType,
          title: material.title,
          included: material.required,
          required: material.required,
          status: "DRAFT",
          componentRefs: [],
          version: 1,
          createdBy: actor.userId,
          createdAt: now,
          updatedAt: now,
          metadata: {
            defaultIssueMaterial: true
          }
        })
      )
    );

    return this.repository.updateIssue({
      ...issue,
      commonMaterialIds: materials.map((material) => material.id),
      status: "STRUCTURE_PLANNED",
      updatedAt: now
    });
  }

  private async recalculateArticleReadiness(
    actor: MagazineActor,
    articleId: string
  ): Promise<MagazineArticle> {
    const article = await this.getArticle(actor, articleId);
    const [components, reviewItems] = await Promise.all([
      this.repository.listComponentsByArticle(article.id, actor.organizationId),
      this.repository.listReviewItemsByArticle(article.id, actor.organizationId)
    ]);
    const blockers = this.articleReadinessBlockers(article, components, reviewItems);
    const readyForIssue = blockers.length === 0;
    const status = readyForIssue
      ? "READY_FOR_ISSUE"
      : this.statusForBlockedArticle(article);
    const updatedArticle = await this.repository.updateArticle({
      ...article,
      readyForIssue,
      readyForIssueBlockers: blockers,
      status,
      updatedAt: new Date().toISOString()
    });

    await this.audit(
      "MAGAZINE_ARTICLE_READY_RECALCULATED",
      actor,
      { issueId: article.issueId, articleId: article.id },
      article,
      updatedArticle
    );
    await this.refreshIssueReadinessAfterArticleChange(actor, article.issueId);

    return updatedArticle;
  }

  private articleReadinessBlockers(
    article: MagazineArticle,
    components: MagazineArticleComponent[],
    reviewItems: MagazineReviewItem[] = []
  ): string[] {
    const blockers: string[] = [];

    if (!article.textContent.trim() || article.textStatus !== "VALIDATED") {
      blockers.push("TEXT_NOT_VALIDATED");
    }

    if (article.translationRequired && article.translationStatus === "OUTDATED") {
      blockers.push("TRANSLATION_OUTDATED");
    } else if (article.translationRequired && article.translationStatus !== "COMPLETED") {
      blockers.push("TRANSLATION_REQUIRED");
    }

    if (article.correctionStatus !== "COMPLETED") {
      blockers.push("CORRECTION_REQUIRED");
    }

    if (article.editorialApprovalStatus !== "APPROVED") {
      blockers.push("EDITORIAL_APPROVAL_REQUIRED");
    }

    for (const component of components) {
      if (BLOCKING_COMPONENT_STATUSES.has(component.status)) {
        blockers.push(`${component.componentType}_${component.status}`);
      }

      if (component.status === "NEEDS_REVIEW") {
        blockers.push(...this.componentReviewBlockers(component, reviewItems));
      }
    }

    for (const item of reviewItems.filter(
      (reviewItem) => reviewItem.status !== "RESOLVED"
    )) {
      if (item.severity === "CRITICAL") {
        blockers.push(`CRITICAL_REVIEW_ITEM_${item.id}`);
      }

      if (item.severity === "MAJOR" && item.status !== "OVERRIDDEN") {
        blockers.push(`MAJOR_REVIEW_ITEM_${item.id}`);
      }
    }

    for (const audioComponent of components.filter(
      (component) => component.componentType === "AUDIO"
    )) {
      if (
        !this.hasAssociatedValidatedComponent(audioComponent, components, "TRANSCRIPT")
      ) {
        blockers.push("AUDIO_TRANSCRIPT_REQUIRED");
      }
    }

    for (const videoComponent of components.filter(
      (component) => component.componentType === "VIDEO"
    )) {
      const hasTranscript = this.hasAssociatedValidatedComponent(
        videoComponent,
        components,
        "TRANSCRIPT"
      );
      const hasSubtitle = this.hasAssociatedValidatedComponent(
        videoComponent,
        components,
        "SUBTITLE"
      );

      if (!hasTranscript && !hasSubtitle) {
        blockers.push("VIDEO_TRANSCRIPT_OR_SUBTITLE_REQUIRED");
      }
    }

    return [...new Set(blockers)];
  }

  private componentReviewBlockers(
    component: MagazineArticleComponent,
    reviewItems: MagazineReviewItem[]
  ): string[] {
    const activeItems = reviewItems.filter(
      (item) => item.componentId === component.id && item.status !== "RESOLVED"
    );

    if (activeItems.length > 0) {
      return activeItems.flatMap((item) => {
        if (item.severity === "CRITICAL") {
          return [`${component.componentType}_CRITICAL_REVIEW_${item.id}`];
        }

        if (item.severity === "MAJOR" && item.status !== "OVERRIDDEN") {
          return [`${component.componentType}_MAJOR_REVIEW_${item.id}`];
        }

        return [];
      });
    }

    if (component.reviewSeverity === "MINOR") {
      return [];
    }

    if (component.reviewSeverity === "MAJOR" && component.reviewOverride) {
      return [];
    }

    return [`${component.componentType}_NEEDS_REVIEW`];
  }

  private reviewItemsForArticle(
    reviewItems: MagazineReviewItem[],
    articleId: string
  ): MagazineReviewItem[] {
    return reviewItems.filter((item) => item.articleId === articleId);
  }

  private reviewItemGateIssue(item: MagazineReviewItem): MagazineQualityGateIssue | null {
    if (item.status === "RESOLVED") {
      return null;
    }

    if (item.severity === "MINOR") {
      return this.gateIssue(
        "MINOR_REVIEW_ITEM",
        "WARNING",
        `Minor review item remains unresolved: ${item.title}`,
        "ARTICLE",
        item.articleId ?? item.issueId,
        "MINOR"
      );
    }

    if (item.severity === "MAJOR" && item.status === "OVERRIDDEN") {
      return this.gateIssue(
        "MAJOR_REVIEW_ITEM_OVERRIDDEN",
        "WARNING",
        `Major review item was explicitly overridden: ${item.title}`,
        "ARTICLE",
        item.articleId ?? item.issueId,
        "MAJOR"
      );
    }

    return this.gateIssue(
      `${item.severity}_REVIEW_ITEM`,
      "BLOCKED",
      `${item.severity} review item blocks publication: ${item.title}`,
      "ARTICLE",
      item.articleId ?? item.issueId,
      item.severity
    );
  }

  private async refreshReviewImpact(
    actor: MagazineActor,
    issue: MagazineIssue,
    article: MagazineArticle,
    reviewItem: MagazineReviewItem
  ): Promise<void> {
    if (
      reviewItem.severity === "CRITICAL" &&
      LOCKED_PUBLICATION_STATES.has(issue.status)
    ) {
      await this.flagCurrentOfficialVersion(actor, issue, reviewItem);
      return;
    }

    if (!LOCKED_PUBLICATION_STATES.has(issue.status)) {
      await this.recalculateArticleReadiness(actor, article.id);
    }
  }

  private async flagCurrentOfficialVersion(
    actor: MagazineActor,
    issue: MagazineIssue,
    reviewItem: MagazineReviewItem
  ): Promise<void> {
    if (!issue.currentOfficialVersionId) {
      return;
    }

    await this.repository.updateIssue({
      ...issue,
      currentOfficialVersionFlag: {
        reviewItemId: reviewItem.id,
        severity: "CRITICAL",
        flaggedAt: new Date().toISOString(),
        flaggedBy: actor.userId,
        reason: reviewItem.description
      },
      updatedAt: new Date().toISOString()
    });
  }

  private async clearCurrentOfficialFlagIfResolved(
    actor: MagazineActor,
    reviewItem: MagazineReviewItem
  ): Promise<void> {
    if (reviewItem.severity !== "CRITICAL") {
      return;
    }

    const issue = await this.getIssue(actor, reviewItem.issueId);

    if (issue.currentOfficialVersionFlag?.reviewItemId !== reviewItem.id) {
      return;
    }

    await this.repository.updateIssue({
      ...issue,
      currentOfficialVersionFlag: undefined,
      updatedAt: new Date().toISOString()
    });
  }

  private async clearResolvedComponentReviewState(
    actor: MagazineActor,
    reviewItem: MagazineReviewItem
  ): Promise<void> {
    if (!reviewItem.componentId) {
      return;
    }

    const component = await this.getComponent(actor, reviewItem.componentId);
    const issueReviewItems = await this.repository.listReviewItemsByIssue(
      reviewItem.issueId,
      actor.organizationId
    );
    const remainingActiveComponentReviews = issueReviewItems.filter(
      (item) =>
        item.componentId === component.id &&
        item.id !== reviewItem.id &&
        item.status !== "RESOLVED"
    );

    if (remainingActiveComponentReviews.length > 0) {
      return;
    }

    await this.repository.updateComponent({
      ...component,
      status: "VALIDATED",
      reviewSeverity: undefined,
      reviewOverride: undefined,
      version: component.version + 1,
      updatedAt: new Date().toISOString()
    });
  }

  private hasAssociatedValidatedComponent(
    source: MagazineArticleComponent,
    components: MagazineArticleComponent[],
    componentType: MagazineArticleComponentType
  ): boolean {
    const linkedId =
      componentType === "TRANSCRIPT"
        ? source.transcriptComponentId
        : source.subtitleComponentId;

    return components.some(
      (component) =>
        component.componentType === componentType &&
        component.status === "VALIDATED" &&
        (component.id === linkedId ||
          component.sourceComponentId === source.id ||
          component.dependsOnComponentIds.includes(source.id))
    );
  }

  private statusForBlockedArticle(article: MagazineArticle): MagazineArticle["status"] {
    if (article.textStatus === "FAILED") {
      return "FAILED";
    }

    if (article.textStatus === "OUTDATED") {
      return "OUTDATED";
    }

    if (article.translationRequired && article.translationStatus !== "COMPLETED") {
      return "IN_TRANSLATION";
    }

    if (
      article.correctionStatus !== "COMPLETED" ||
      article.editorialApprovalStatus !== "APPROVED"
    ) {
      return "IN_REVIEW";
    }

    return article.status === "APPROVED" ? "APPROVED" : "NEEDS_REVIEW";
  }

  private async refreshIssueReadinessAfterArticleChange(
    actor: MagazineActor,
    issueId: string
  ): Promise<void> {
    const issue = await this.getIssue(actor, issueId);

    if (
      ![
        "DRAFT",
        "STRUCTURE_PLANNED",
        "ARTICLES_IN_PRODUCTION",
        "READY_FOR_LAYOUT"
      ].includes(issue.status)
    ) {
      return;
    }

    const articles = await this.repository.listArticles(issueId, actor.organizationId);
    const allReady =
      articles.length > 0 && articles.every((article) => article.readyForIssue);

    await this.repository.updateIssue({
      ...issue,
      status: allReady ? "READY_FOR_LAYOUT" : "ARTICLES_IN_PRODUCTION",
      updatedAt: new Date().toISOString()
    });
  }

  private evaluateIssueQualityGate(
    issue: MagazineIssue,
    articleEntries: Array<{
      article: MagazineArticle;
      components: MagazineArticleComponent[];
    }>,
    commonMaterials: MagazineCommonMaterial[],
    tableOfContents: MagazineTableOfContents,
    requireLayout = false,
    reviewItems: MagazineReviewItem[] = []
  ): MagazineQualityGateResult {
    const blockers: MagazineQualityGateIssue[] = [];
    const warnings: MagazineQualityGateIssue[] = [];

    if (articleEntries.length === 0) {
      blockers.push(
        this.gateIssue(
          "NO_ARTICLES",
          "BLOCKED",
          "Magazine issue requires at least one article.",
          "ARTICLE",
          issue.id
        )
      );
    }

    for (const entry of articleEntries) {
      if (!entry.article.readyForIssue) {
        blockers.push(
          this.gateIssue(
            "ARTICLE_NOT_READY_FOR_ISSUE",
            "BLOCKED",
            `Article is not Ready for Issue: ${entry.article.title}`,
            "ARTICLE",
            entry.article.id
          )
        );
      }

      for (const blocker of this.articleReadinessBlockers(
        entry.article,
        entry.components,
        this.reviewItemsForArticle(reviewItems, entry.article.id)
      )) {
        blockers.push(
          this.gateIssue(
            blocker,
            "BLOCKED",
            `Article dependency blocks publication: ${blocker}`,
            "ARTICLE",
            entry.article.id
          )
        );
      }
    }

    for (const item of reviewItems.filter(
      (reviewItem) => reviewItem.status !== "RESOLVED"
    )) {
      const gateIssue = this.reviewItemGateIssue(item);

      if (!gateIssue) {
        continue;
      }

      if (gateIssue.severity === "BLOCKED") {
        blockers.push(gateIssue);
      } else {
        warnings.push(gateIssue);
      }
    }

    for (const material of commonMaterials.filter(
      (item) => item.included || item.required
    )) {
      if (material.status !== "VALIDATED") {
        blockers.push(
          this.gateIssue(
            "COMMON_MATERIAL_NOT_VALIDATED",
            "BLOCKED",
            `Common issue material is not validated: ${material.title}`,
            "COMMON_MATERIAL",
            material.id
          )
        );
      }
    }

    if (tableOfContents.status !== "CURRENT") {
      warnings.push(
        this.gateIssue(
          "TABLE_OF_CONTENTS_OUTDATED",
          "WARNING",
          "Table of contents must reflect the current issue structure.",
          "TABLE_OF_CONTENTS",
          issue.id
        )
      );
    }

    if (requireLayout && !issue.layoutPublicationPlanId) {
      blockers.push(
        this.gateIssue(
          "LAYOUT_NOT_ASSEMBLED",
          "BLOCKED",
          "Preflight requires an assembled magazine layout.",
          "LAYOUT",
          issue.id
        )
      );
    }

    if (requireLayout) {
      blockers.push(
        ...this.rightsWarnings(
          issue,
          articleEntries.map((entry) => entry.article)
        )
      );
    }

    const totalChecks = Math.max(
      articleEntries.length + commonMaterials.length + (requireLayout ? 3 : 1),
      1
    );
    const failedChecks = blockers.length + warnings.length;
    const completionPercentage = Math.max(
      0,
      Math.round(((totalChecks - failedChecks) / totalChecks) * 100)
    );

    return {
      id: randomUUID(),
      status: blockers.length > 0 ? "BLOCKED" : warnings.length > 0 ? "WARNING" : "PASS",
      completionPercentage,
      blockers,
      warnings,
      checkedAt: new Date().toISOString(),
      metadata: {
        noDuplicateWorkflowEngine: true,
        preflightMandatoryBeforePublication: requireLayout,
        reviewSeverityAwareBlocking: true,
        humanFinalAuthorityRequired: true
      }
    };
  }

  private rightsWarnings(
    issue: MagazineIssue,
    articles: MagazineArticle[]
  ): MagazineQualityGateIssue[] {
    const warnings: MagazineQualityGateIssue[] = [];

    for (const article of articles) {
      if (article.rightsStatus === "RESTRICTED" || article.rightsStatus === "PENDING") {
        warnings.push(
          this.gateIssue(
            "ARTICLE_RIGHTS_NOT_READY",
            "BLOCKED",
            `Article rights are not publication-ready: ${article.title}`,
            "RIGHTS",
            article.id
          )
        );
      }
    }

    if (issue.metadata?.rightsStatus === "RESTRICTED_PUBLICATION") {
      warnings.push(
        this.gateIssue(
          "ISSUE_RIGHTS_RESTRICTED",
          "BLOCKED",
          "Issue rights metadata blocks publication.",
          "RIGHTS",
          issue.id
        )
      );
    }

    return warnings;
  }

  private async loadRightsBlockers(
    actor: MagazineActor,
    issue: MagazineIssue,
    articles: MagazineArticle[]
  ): Promise<MagazineQualityGateIssue[]> {
    const [publishingAuthorizations, translationAuthorizations] = await Promise.all([
      this.rightsProvenanceService.listPublishingAuthorizations(actor, {
        projectId: issue.projectId
      }),
      this.rightsProvenanceService.listTranslationAuthorizations(actor, {
        projectId: issue.projectId
      })
    ]);
    const blockers: MagazineQualityGateIssue[] = [];

    blockers.push(
      ...this.publishingAuthorizationBlockers(issue, publishingAuthorizations)
    );

    for (const article of articles.filter((item) => item.translationRequired)) {
      blockers.push(
        ...this.translationAuthorizationBlockers(article, translationAuthorizations)
      );
    }

    return blockers;
  }

  private publishingAuthorizationBlockers(
    issue: MagazineIssue,
    authorizations: PublishingAuthorization[]
  ): MagazineQualityGateIssue[] {
    if (authorizations.length === 0) {
      return [
        this.gateIssue(
          "PUBLISHING_AUTHORIZATION_MISSING",
          "BLOCKED",
          "Publishing authorization is required before magazine publication.",
          "RIGHTS",
          issue.id
        )
      ];
    }

    return authorizations
      .filter((authorization) => !authorization.publicationAuthorized)
      .map((authorization) =>
        this.gateIssue(
          "PUBLISHING_NOT_AUTHORIZED",
          "BLOCKED",
          "Publishing authorization explicitly blocks publication.",
          "RIGHTS",
          authorization.id
        )
      );
  }

  private translationAuthorizationBlockers(
    article: MagazineArticle,
    authorizations: TranslationAuthorization[]
  ): MagazineQualityGateIssue[] {
    const matching = authorizations.filter(
      (authorization) =>
        (!authorization.documentId || authorization.documentId === article.documentId) &&
        authorization.authorizedLanguages.includes(article.language)
    );

    if (matching.length === 0) {
      return [
        this.gateIssue(
          "TRANSLATION_AUTHORIZATION_MISSING",
          "BLOCKED",
          `Translation authorization is required before publishing translated article: ${article.title}`,
          "RIGHTS",
          article.id
        )
      ];
    }

    const now = Date.now();

    return matching.flatMap((authorization) => {
      const issues: MagazineQualityGateIssue[] = [];

      if (!authorization.translationAuthorized) {
        issues.push(
          this.gateIssue(
            "TRANSLATION_NOT_AUTHORIZED",
            "BLOCKED",
            "Translation authorization explicitly blocks this article.",
            "RIGHTS",
            authorization.id
          )
        );
      }

      if (
        authorization.validUntil &&
        new Date(authorization.validUntil).getTime() < now
      ) {
        issues.push(
          this.gateIssue(
            "TRANSLATION_AUTHORIZATION_EXPIRED",
            "BLOCKED",
            "Translation authorization is expired.",
            "RIGHTS",
            authorization.id
          )
        );
      }

      return issues;
    });
  }

  private mergeQualityGateIssues(
    gate: MagazineQualityGateResult,
    blockers: MagazineQualityGateIssue[]
  ): MagazineQualityGateResult {
    if (blockers.length === 0) {
      return gate;
    }

    return {
      ...gate,
      status: "BLOCKED",
      blockers: [...gate.blockers, ...blockers],
      completionPercentage: Math.max(0, gate.completionPercentage - blockers.length * 5)
    };
  }

  private gateIssue(
    code: string,
    severity: MagazineGateStatus,
    message: string,
    sourceComponent: MagazineQualityGateIssue["sourceComponent"],
    referenceId?: string,
    reviewSeverity?: MagazineReviewSeverity
  ): MagazineQualityGateIssue {
    return {
      code,
      severity,
      reviewSeverity,
      message,
      sourceComponent,
      referenceId
    };
  }

  private gateBlocksPublication(gate: MagazineQualityGateResult): boolean {
    return gate.status === "BLOCKED" || gate.blockers.length > 0;
  }

  private assertIssuePublishable(overview: MagazineIssueOverview): void {
    if (
      !overview.issue.preflight ||
      this.gateBlocksPublication(overview.issue.preflight)
    ) {
      throw new BadRequestException("Publication requires a passing magazine preflight.");
    }

    if (overview.issue.finalApproval?.approvalStatus !== "APPROVED") {
      throw new BadRequestException("Publication requires final approval.");
    }

    if (overview.qualityGate.blockers.length > 0) {
      throw new BadRequestException(
        "Magazine issue cannot be published with blocking quality gate issues."
      );
    }
  }

  private buildTableOfContents(
    issue: MagazineIssue,
    sections: MagazineSection[],
    articles: MagazineArticle[]
  ): MagazineTableOfContents {
    const sectionsById = new Map(sections.map((section) => [section.id, section]));
    const articlesById = new Map(articles.map((article) => [article.id, article]));
    const orderedArticleIds =
      issue.articleOrder.length > 0
        ? issue.articleOrder
        : articles
            .sort((left, right) => left.order - right.order)
            .map((article) => article.id);

    return {
      ...issue.tableOfContents,
      entries: orderedArticleIds.flatMap((articleId, index) => {
        const article = articlesById.get(articleId);

        if (!article) {
          return [];
        }

        const section = article.sectionId
          ? sectionsById.get(article.sectionId)
          : undefined;

        return [
          {
            articleId: article.id,
            title: article.title,
            sectionId: article.sectionId,
            sectionTitle: section?.title,
            order: index + 1
          }
        ];
      })
    };
  }

  private buildAdaptabilityAnalysis(
    issue: MagazineIssue,
    articleEntries: Array<{
      article: MagazineArticle;
      components: MagazineArticleComponent[];
    }>
  ): MagazineAdaptabilityAnalysis {
    const articleRecommendations = articleEntries.map(({ article, components }) => {
      const recommendations: Array<
        "TRANSLATION" | "AUDIO" | "VIDEO" | "ACCESSIBILITY_REVIEW"
      > = [];

      if (article.translationRequired && article.translationStatus !== "COMPLETED") {
        recommendations.push("TRANSLATION");
      }

      if (components.some((component) => component.componentType === "AUDIO")) {
        recommendations.push("AUDIO");
      }

      if (components.some((component) => component.componentType === "VIDEO")) {
        recommendations.push("VIDEO");
      }

      if (
        components.some(
          (component) =>
            component.componentType === "AUDIO" || component.componentType === "VIDEO"
        )
      ) {
        recommendations.push("ACCESSIBILITY_REVIEW");
      }

      return {
        articleId: article.id,
        recommendations,
        reason:
          "Adapt workflow based on article translation, media, accessibility, and validation dependencies."
      };
    });
    const recommendedCapabilities = new Set<
      "TRANSLATION" | "AUDIO" | "VIDEO" | "FLIPBOOK" | "ACCESSIBILITY"
    >(["FLIPBOOK"]);

    for (const recommendation of articleRecommendations) {
      for (const item of recommendation.recommendations) {
        if (item === "ACCESSIBILITY_REVIEW") {
          recommendedCapabilities.add("ACCESSIBILITY");
        } else {
          recommendedCapabilities.add(item);
        }
      }
    }

    return {
      id: randomUUID(),
      issueId: issue.id,
      projectId: issue.projectId,
      recommendedCapabilities: [...recommendedCapabilities],
      articleRecommendations,
      impactPreview: [],
      smartCheckpoints: [
        "EDITORIAL_PLAN",
        "ARTICLE_PRODUCTION",
        "READY_FOR_ISSUE",
        "GLOBAL_CONTROL",
        "PREFLIGHT",
        "FINAL_APPROVAL",
        "PUBLICATION"
      ],
      dependencyProtection: true,
      branchingSupported: true,
      scenarioBranchComparisonSupported: true,
      controlledVersionRestoreSupported: true,
      avoidsValidatedStageLoss: true,
      aiMayAnalyzeAndProposeOnly: true,
      workflowEngineExecutes: true,
      versioningPreservesStates: true,
      auditPreservesActions: true,
      createdAt: new Date().toISOString()
    };
  }

  private async createIssueVersion(
    actor: MagazineActor,
    issue: MagazineIssue,
    status: MagazineIssueVersion["status"],
    reason: string,
    previousVersionId?: string
  ): Promise<MagazineIssueVersion> {
    const version: MagazineIssueVersion = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      issueId: issue.id,
      version: issue.version,
      status,
      reason,
      articleIds: issue.articleOrder,
      articleOrder: issue.articleOrder,
      tableOfContents: issue.tableOfContents,
      previousVersionId,
      createdBy: actor.userId,
      createdAt: new Date().toISOString(),
      metadata: {
        immutablePublishedHistory: status !== "DRAFT",
        provenancePreserved: true,
        supersedesVersionId: previousVersionId,
        sourceLineage: {
          sourceOfRecordId: issue.id,
          sourceVersionId: String(issue.version),
          derivationType: "PUBLICATION_VERSION",
          language: issue.language,
          version: issue.version,
          status: status === "SUPERSEDED" ? "SUPERSEDED" : "CURRENT",
          createdAt: new Date().toISOString()
        } satisfies MagazineSourceLineage
      }
    };

    return this.repository.createIssueVersion(version);
  }

  private async createDraftVersionIfPublished(
    actor: MagazineActor,
    issue: MagazineIssue,
    reason: string
  ): Promise<MagazineIssue> {
    if (!LOCKED_PUBLICATION_STATES.has(issue.status)) {
      return issue;
    }

    const updatedIssue: MagazineIssue = {
      ...issue,
      status: "REPUBLICATION_IN_PROGRESS",
      finalApproval: {
        mode: "HUMAN_APPROVAL",
        approvalStatus: "PENDING",
        humanFinalAuthorityRequired: true
      },
      preflight: undefined,
      version: issue.version + 1,
      updatedAt: new Date().toISOString()
    };

    await this.createIssueVersion(
      actor,
      updatedIssue,
      "DRAFT",
      reason,
      issue.currentOfficialVersionId
    );
    await this.audit(
      "MAGAZINE_PUBLISHED_REVISION_CREATED",
      actor,
      { issueId: issue.id, issueVersionId: issue.currentOfficialVersionId },
      issue,
      updatedIssue,
      reason
    );

    return this.repository.updateIssue(updatedIssue);
  }

  private async updateIssueStructure(
    actor: MagazineActor,
    issue: MagazineIssue,
    update: Partial<MagazineIssue>
  ): Promise<MagazineIssue> {
    return this.repository.updateIssue({
      ...issue,
      ...update,
      version: update.version ?? issue.version + 1,
      updatedAt: new Date().toISOString()
    });
  }

  private markTableOfContentsOutdated(
    tableOfContents: MagazineTableOfContents
  ): MagazineTableOfContents {
    return {
      ...tableOfContents,
      status: "OUTDATED"
    };
  }

  private productionStatus(issue: MagazineIssue): MagazineIssueStatus {
    if (["DRAFT", "STRUCTURE_PLANNED"].includes(issue.status)) {
      return "STRUCTURE_PLANNED";
    }

    return issue.status;
  }

  private async articlesWithComponents(
    issue: MagazineIssue
  ): Promise<
    Array<{ article: MagazineArticle; components: MagazineArticleComponent[] }>
  > {
    const articles = await this.repository.listArticles(issue.id, issue.organizationId);
    const articlesById = new Map(articles.map((article) => [article.id, article]));
    const orderedIds =
      issue.articleOrder.length > 0
        ? issue.articleOrder
        : articles
            .sort((left, right) => left.order - right.order)
            .map((article) => article.id);
    const orderedArticles = orderedIds.flatMap((articleId) => {
      const article = articlesById.get(articleId);

      return article ? [article] : [];
    });

    return Promise.all(
      orderedArticles.map(async (article) => ({
        article,
        components: await this.repository.listComponentsByArticle(
          article.id,
          issue.organizationId
        )
      }))
    );
  }

  private sortSections(sections: MagazineSection[]): MagazineSection[] {
    return [...sections].sort((left, right) => left.order - right.order);
  }

  private componentIdsByType(
    articles: Array<MagazineArticle & { components: MagazineArticleComponent[] }>,
    componentType: MagazineArticleComponentType
  ): string[] {
    return articles.flatMap((article) =>
      article.components
        .filter((component) => component.componentType === componentType)
        .map((component) => component.id)
    );
  }

  private getTextComponent(
    components: MagazineArticleComponent[]
  ): MagazineArticleComponent {
    const textComponent = components.find(
      (component) => component.componentType === "TEXT"
    );

    if (!textComponent) {
      throw new BadRequestException("Article text component is required.");
    }

    return textComponent;
  }

  private isDependentOutput(componentType: MagazineArticleComponentType): boolean {
    return (
      componentType === "AUDIO" ||
      componentType === "VIDEO" ||
      componentType === "TRANSCRIPT" ||
      componentType === "SUBTITLE"
    );
  }

  private buildArticleProvenance(
    articleId: string,
    input: CreateMagazineArticleInput,
    sourceDocument?: Document
  ): MagazineArticle["provenance"] {
    const now = new Date().toISOString();
    const sourceOfRecordId =
      input.provenance?.sourceOfRecordId ?? input.documentId ?? articleId;
    const sourceVersionId =
      input.provenance?.sourceVersionId ??
      this.documentVersionId(sourceDocument) ??
      `article:${articleId}:v1`;
    const derivationType =
      input.provenance?.derivationType ??
      (input.translationRequired ? "TRANSLATION" : "EDITORIAL_REVISION");

    return {
      version: input.provenance?.version ?? 1,
      sourceIssueId: input.provenance?.sourceIssueId,
      sourceArticleId: input.provenance?.sourceArticleId,
      sourceArticleVersion: input.provenance?.sourceArticleVersion,
      sourceOfRecordId,
      sourceVersionId,
      derivedFromId: input.provenance?.derivedFromId,
      derivedFromVersionId: input.provenance?.derivedFromVersionId,
      derivationType,
      language: input.provenance?.language ?? input.language,
      sourceLanguage:
        input.provenance?.sourceLanguage ?? sourceDocument?.originalLanguage,
      targetLanguage:
        input.provenance?.targetLanguage ??
        (input.translationRequired ? input.language : undefined),
      translatorId: input.provenance?.translatorId ?? sourceDocument?.translatorId,
      translatorName: input.provenance?.translatorName ?? sourceDocument?.translatorName,
      status: input.provenance?.status ?? "CURRENT",
      createdAt: input.provenance?.createdAt ?? now,
      sourceAssetId: input.provenance?.sourceAssetId,
      sourceReference: input.provenance?.sourceReference ?? sourceDocument?.id,
      reusedFrom: input.provenance?.reusedFrom
    };
  }

  private buildComponentLineage(
    article: MagazineArticle,
    componentType: MagazineArticleComponentType,
    createdAt: string,
    input?: Partial<MagazineSourceLineage>
  ): MagazineSourceLineage {
    return {
      sourceOfRecordId:
        input?.sourceOfRecordId ??
        article.provenance?.sourceOfRecordId ??
        article.documentId ??
        article.id,
      sourceVersionId:
        input?.sourceVersionId ??
        article.provenance?.sourceVersionId ??
        String(article.version),
      derivedFromId: input?.derivedFromId ?? article.id,
      derivedFromVersionId: input?.derivedFromVersionId ?? String(article.version),
      derivationType:
        input?.derivationType ?? this.derivationTypeForComponent(componentType),
      language: input?.language ?? article.language,
      version: input?.version ?? 1,
      status: input?.status ?? "CURRENT",
      createdAt: input?.createdAt ?? createdAt
    };
  }

  private updatedLineage(
    lineage: MagazineSourceLineage | undefined,
    status: MagazineSourceLineage["status"],
    sourceVersion: number
  ): MagazineSourceLineage | undefined {
    if (!lineage) {
      return undefined;
    }

    return {
      ...lineage,
      sourceVersionId: String(sourceVersion),
      derivedFromVersionId: String(sourceVersion),
      status,
      version: lineage.version + 1
    };
  }

  private derivationTypeForComponent(
    componentType: MagazineArticleComponentType
  ): MagazineDerivationType {
    if (componentType === "AUDIO") {
      return "AUDIO";
    }

    if (componentType === "VIDEO") {
      return "VIDEO";
    }

    if (componentType === "TRANSCRIPT") {
      return "TRANSCRIPT";
    }

    if (componentType === "SUBTITLE") {
      return "SUBTITLE";
    }

    if (componentType === "IMAGE") {
      return "ILLUSTRATION";
    }

    return "EDITORIAL_REVISION";
  }

  private documentVersionId(document?: Document): string | undefined {
    if (!document) {
      return undefined;
    }

    const explicitVersion =
      document.metadata?.sourceVersionId ?? document.metadata?.versionId;

    return typeof explicitVersion === "string" ? explicitVersion : document.updatedAt;
  }

  private async supersedeCurrentOfficialVersion(
    actor: MagazineActor,
    issue: MagazineIssue,
    reason: string,
    supersededByVersionId?: string
  ): Promise<void> {
    if (!issue.currentOfficialVersionId) {
      return;
    }

    const versions = await this.repository.listIssueVersions(
      issue.id,
      actor.organizationId
    );
    const current = versions.find(
      (version) => version.id === issue.currentOfficialVersionId
    );

    if (!current || current.status !== "OFFICIAL") {
      return;
    }

    const saved = await this.repository.updateIssueVersion({
      ...current,
      status: "SUPERSEDED",
      supersededByVersionId,
      reason: `${current.reason} Superseded: ${reason}`
    });

    await this.audit(
      "MAGAZINE_OFFICIAL_VERSION_SWITCHED",
      actor,
      { issueId: issue.id, issueVersionId: saved.id },
      current,
      saved,
      reason
    );
  }

  private async assertNoCriticalCurrentOfficialReviewItems(
    actor: MagazineActor,
    issue: MagazineIssue
  ): Promise<void> {
    const reviewItems = await this.repository.listReviewItemsByIssue(
      issue.id,
      actor.organizationId
    );
    const hasCriticalCurrentOfficialReview = reviewItems.some(
      (item) =>
        item.severity === "CRITICAL" &&
        item.status !== "RESOLVED" &&
        item.issueVersion === issue.version
    );

    if (hasCriticalCurrentOfficialReview) {
      throw new BadRequestException(
        "Current official magazine issue has a critical review item and cannot be promoted downstream."
      );
    }
  }

  private repositionArticle(
    articleOrder: string[],
    articleId: string,
    requestedOrder?: number
  ): string[] {
    const withoutArticle = articleOrder.filter((id) => id !== articleId);
    const position = Math.min(
      Math.max((requestedOrder ?? articleOrder.length) - 1, 0),
      withoutArticle.length
    );

    return [
      ...withoutArticle.slice(0, position),
      articleId,
      ...withoutArticle.slice(position)
    ];
  }

  private async getIssue(actor: MagazineActor, issueId: string): Promise<MagazineIssue> {
    const issue = await this.repository.findIssueById(issueId, actor.organizationId);

    if (!issue) {
      throw new NotFoundException("Magazine issue not found.");
    }

    return issue;
  }

  private async getArticle(
    actor: MagazineActor,
    articleId: string
  ): Promise<MagazineArticle> {
    const article = await this.repository.findArticleById(
      articleId,
      actor.organizationId
    );

    if (!article) {
      throw new NotFoundException("Magazine article not found.");
    }

    return article;
  }

  private async getComponent(
    actor: MagazineActor,
    componentId: string
  ): Promise<MagazineArticleComponent> {
    const component = await this.repository.findComponentById(
      componentId,
      actor.organizationId
    );

    if (!component) {
      throw new NotFoundException("Magazine article component not found.");
    }

    return component;
  }

  private async getCommonMaterial(
    actor: MagazineActor,
    materialId: string
  ): Promise<MagazineCommonMaterial> {
    const material = await this.repository.findCommonMaterialById(
      materialId,
      actor.organizationId
    );

    if (!material) {
      throw new NotFoundException("Magazine common material not found.");
    }

    return material;
  }

  private async getReviewItem(
    actor: MagazineActor,
    reviewItemId: string
  ): Promise<MagazineReviewItem> {
    const item = await this.repository.findReviewItemById(
      reviewItemId,
      actor.organizationId
    );

    if (!item) {
      throw new NotFoundException("Magazine review item not found.");
    }

    return item;
  }

  private async assertSectionBelongsToIssue(
    actor: MagazineActor,
    issueId: string,
    sectionId: string
  ): Promise<void> {
    const section = await this.repository.findSectionById(
      sectionId,
      actor.organizationId
    );

    if (!section || section.issueId !== issueId) {
      throw new BadRequestException("Section must belong to this magazine issue.");
    }
  }

  private assertIssueEditable(issue: MagazineIssue): void {
    if (LOCKED_PUBLICATION_STATES.has(issue.status)) {
      throw new BadRequestException(
        "Published magazine issues require a controlled revision before editing."
      );
    }
  }

  private assertAuthorizedHuman(actor: MagazineActor): void {
    const roles = new Set(actor.roles.map((role) => role.toUpperCase()));

    if (![...HUMAN_APPROVAL_ROLES].some((role) => roles.has(role))) {
      throw new ForbiddenException(
        "Human Final Authority: only authorized humans may approve magazine articles or issues."
      );
    }
  }

  private async audit(
    action: MagazineAuditAction,
    actor: MagazineActor,
    ids: Partial<
      Pick<
        MagazineAuditEvent,
        | "issueId"
        | "articleId"
        | "componentId"
        | "commonMaterialId"
        | "issueVersionId"
        | "reviewItemId"
      >
    >,
    beforeState?: object,
    afterState?: object,
    reason?: string
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      action,
      actorId: actor.userId,
      ...ids,
      beforeState,
      afterState,
      reason,
      createdAt: new Date().toISOString()
    });
  }

  private validateActor(actor: MagazineActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("Authenticated actor with organization is required.");
    }
  }

  private validateRequired(value: string | undefined, fieldName: string): void {
    if (!value || value.trim().length === 0) {
      throw new BadRequestException(`${fieldName} is required.`);
    }
  }

  private validateReviewSeverity(severity: MagazineReviewSeverity): void {
    if (!["MINOR", "MAJOR", "CRITICAL"].includes(severity)) {
      throw new BadRequestException("Review severity must be MINOR, MAJOR or CRITICAL.");
    }
  }
}
