import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type MagazineArticle,
  type MagazineArticleComponent,
  type MagazineAuditEvent,
  type MagazineCommonMaterial,
  type MagazineIssue,
  type MagazineIssueVersion,
  type MagazineReviewItem,
  type MagazineSection,
  type MagazineWorkflowRepository
} from "./magazine-workflow.types";

@Injectable()
export class DatabaseMagazineWorkflowRepository implements MagazineWorkflowRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createIssue(issue: MagazineIssue): Promise<MagazineIssue> {
    return this.database.insert("magazine_issues", issue);
  }

  async updateIssue(issue: MagazineIssue): Promise<MagazineIssue> {
    return this.database.upsert("magazine_issues", issue);
  }

  async findIssueById(id: string, organizationId: string): Promise<MagazineIssue | null> {
    return this.database.findByIdForTenant<MagazineIssue>(
      "magazine_issues",
      id,
      organizationId
    );
  }

  async listIssues(organizationId: string): Promise<MagazineIssue[]> {
    return this.database.selectForTenant<MagazineIssue>(
      "magazine_issues",
      organizationId
    );
  }

  async createSection(section: MagazineSection): Promise<MagazineSection> {
    return this.database.insert("magazine_sections", section);
  }

  async updateSection(section: MagazineSection): Promise<MagazineSection> {
    return this.database.upsert("magazine_sections", section);
  }

  async findSectionById(
    id: string,
    organizationId: string
  ): Promise<MagazineSection | null> {
    return this.database.findByIdForTenant<MagazineSection>(
      "magazine_sections",
      id,
      organizationId
    );
  }

  async listSections(
    issueId: string,
    organizationId: string
  ): Promise<MagazineSection[]> {
    return this.database.selectForTenant<MagazineSection>(
      "magazine_sections",
      organizationId,
      (section) => section.issueId === issueId
    );
  }

  async createArticle(article: MagazineArticle): Promise<MagazineArticle> {
    return this.database.insert("magazine_articles", article);
  }

  async updateArticle(article: MagazineArticle): Promise<MagazineArticle> {
    return this.database.upsert("magazine_articles", article);
  }

  async findArticleById(
    id: string,
    organizationId: string
  ): Promise<MagazineArticle | null> {
    return this.database.findByIdForTenant<MagazineArticle>(
      "magazine_articles",
      id,
      organizationId
    );
  }

  async listArticles(
    issueId: string,
    organizationId: string
  ): Promise<MagazineArticle[]> {
    return this.database.selectForTenant<MagazineArticle>(
      "magazine_articles",
      organizationId,
      (article) => article.issueId === issueId
    );
  }

  async createComponent(
    component: MagazineArticleComponent
  ): Promise<MagazineArticleComponent> {
    return this.database.insert("magazine_article_components", component);
  }

  async updateComponent(
    component: MagazineArticleComponent
  ): Promise<MagazineArticleComponent> {
    return this.database.upsert("magazine_article_components", component);
  }

  async findComponentById(
    id: string,
    organizationId: string
  ): Promise<MagazineArticleComponent | null> {
    return this.database.findByIdForTenant<MagazineArticleComponent>(
      "magazine_article_components",
      id,
      organizationId
    );
  }

  async listComponentsByArticle(
    articleId: string,
    organizationId: string
  ): Promise<MagazineArticleComponent[]> {
    return this.database.selectForTenant<MagazineArticleComponent>(
      "magazine_article_components",
      organizationId,
      (component) => component.articleId === articleId
    );
  }

  async createReviewItem(item: MagazineReviewItem): Promise<MagazineReviewItem> {
    return this.database.insert("magazine_review_items", item);
  }

  async updateReviewItem(item: MagazineReviewItem): Promise<MagazineReviewItem> {
    return this.database.upsert("magazine_review_items", item);
  }

  async findReviewItemById(
    id: string,
    organizationId: string
  ): Promise<MagazineReviewItem | null> {
    return this.database.findByIdForTenant<MagazineReviewItem>(
      "magazine_review_items",
      id,
      organizationId
    );
  }

  async listReviewItemsByIssue(
    issueId: string,
    organizationId: string
  ): Promise<MagazineReviewItem[]> {
    return this.database.selectForTenant<MagazineReviewItem>(
      "magazine_review_items",
      organizationId,
      (item) => item.issueId === issueId
    );
  }

  async listReviewItemsByArticle(
    articleId: string,
    organizationId: string
  ): Promise<MagazineReviewItem[]> {
    return this.database.selectForTenant<MagazineReviewItem>(
      "magazine_review_items",
      organizationId,
      (item) => item.articleId === articleId
    );
  }

  async createCommonMaterial(
    material: MagazineCommonMaterial
  ): Promise<MagazineCommonMaterial> {
    return this.database.insert("magazine_common_materials", material);
  }

  async updateCommonMaterial(
    material: MagazineCommonMaterial
  ): Promise<MagazineCommonMaterial> {
    return this.database.upsert("magazine_common_materials", material);
  }

  async findCommonMaterialById(
    id: string,
    organizationId: string
  ): Promise<MagazineCommonMaterial | null> {
    return this.database.findByIdForTenant<MagazineCommonMaterial>(
      "magazine_common_materials",
      id,
      organizationId
    );
  }

  async listCommonMaterials(
    issueId: string,
    organizationId: string
  ): Promise<MagazineCommonMaterial[]> {
    return this.database.selectForTenant<MagazineCommonMaterial>(
      "magazine_common_materials",
      organizationId,
      (material) => material.issueId === issueId
    );
  }

  async createIssueVersion(version: MagazineIssueVersion): Promise<MagazineIssueVersion> {
    return this.database.insert("magazine_issue_versions", version);
  }

  async updateIssueVersion(version: MagazineIssueVersion): Promise<MagazineIssueVersion> {
    return this.database.upsert("magazine_issue_versions", version);
  }

  async listIssueVersions(
    issueId: string,
    organizationId: string
  ): Promise<MagazineIssueVersion[]> {
    return this.database.selectForTenant<MagazineIssueVersion>(
      "magazine_issue_versions",
      organizationId,
      (version) => version.issueId === issueId
    );
  }

  async appendAuditEvent(event: MagazineAuditEvent): Promise<void> {
    this.database.insert("magazine_audit_events", event);
  }

  async listAuditEvents(
    organizationId: string,
    issueId?: string
  ): Promise<MagazineAuditEvent[]> {
    return this.database.selectForTenant<MagazineAuditEvent>(
      "magazine_audit_events",
      organizationId,
      (event) => !issueId || event.issueId === issueId
    );
  }
}
