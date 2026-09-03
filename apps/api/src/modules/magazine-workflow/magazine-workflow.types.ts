import { type AuthenticatedRequestContext } from "../auth/request-context.types";

export type MagazineActor = AuthenticatedRequestContext;

export type MagazineIssueStatus =
  | "DRAFT"
  | "STRUCTURE_PLANNED"
  | "ARTICLES_IN_PRODUCTION"
  | "READY_FOR_LAYOUT"
  | "LAYOUT_ASSEMBLED"
  | "GLOBAL_CONTROL_PASSED"
  | "PREFLIGHT_PASSED"
  | "FINAL_APPROVED"
  | "PUBLISHED"
  | "WITHDRAWN"
  | "REPUBLICATION_IN_PROGRESS"
  | "REPUBLISHED";

export type MagazineArticleStatus =
  | "DRAFT"
  | "IN_TRANSLATION"
  | "IN_REVIEW"
  | "APPROVED"
  | "READY_FOR_ISSUE"
  | "NEEDS_REVIEW"
  | "OUTDATED"
  | "FAILED";

export type MagazineValidationStatus =
  | "DRAFT"
  | "VALIDATED"
  | "NEEDS_REVIEW"
  | "OUTDATED"
  | "FAILED";

export type MagazineWorkflowStage =
  | "DRAFT_WRITING"
  | "TRANSLATION"
  | "EDITORIAL_REVIEW"
  | "EDITORIAL_APPROVAL"
  | "COMPONENT_VALIDATION"
  | "READY_FOR_ISSUE";

export type MagazineIssueWorkflowStage =
  | "LIBRARY"
  | "ISSUE_CREATION"
  | "EDITORIAL_PLAN"
  | "ARTICLE_PRODUCTION"
  | "READY_FOR_ISSUE"
  | "COMMON_MATERIAL_VALIDATION"
  | "LAYOUT_ASSEMBLY"
  | "GLOBAL_CONTROL"
  | "PREFLIGHT"
  | "FINAL_APPROVAL"
  | "PUBLICATION"
  | "DISTRIBUTION_PROMOTION";

export type MagazineCommonMaterialType =
  | "FRONT_COVER"
  | "BACK_COVER"
  | "EDITORIAL"
  | "TABLE_OF_CONTENTS"
  | "MASTHEAD"
  | "ISSUE_METADATA"
  | "INTRODUCTORY_PAGE"
  | "FINAL_PAGE"
  | "ADVERTISEMENT"
  | "GLOBAL_GRAPHIC";

export type MagazineArticleComponentType =
  | "TEXT"
  | "IMAGE"
  | "AUDIO"
  | "VIDEO"
  | "TRANSCRIPT"
  | "SUBTITLE";

export type MagazineGateStatus = "PASS" | "WARNING" | "BLOCKED";

export type MagazineReviewSeverity = "MINOR" | "MAJOR" | "CRITICAL";

export type MagazineReviewItemStatus = "OPEN" | "RESOLVED" | "OVERRIDDEN";

export type MagazineDerivationType =
  | "TRANSLATION"
  | "EDITORIAL_REVISION"
  | "LAYOUT"
  | "AUDIO"
  | "VIDEO"
  | "TRANSCRIPT"
  | "SUBTITLE"
  | "PUBLICATION_VERSION"
  | "CROSS_EDITION_REFERENCE"
  | "ILLUSTRATION";

export type MagazineFinalApprovalMode =
  | "HUMAN_APPROVAL"
  | "HYBRID_APPROVAL"
  | "AI_RECOMMENDATION_WITH_HUMAN_APPROVAL";

export type MagazineAuditAction =
  | "MAGAZINE_ISSUE_CREATED"
  | "MAGAZINE_SECTION_CREATED"
  | "MAGAZINE_COMMON_MATERIAL_CREATED"
  | "MAGAZINE_COMMON_MATERIAL_VALIDATED"
  | "MAGAZINE_ARTICLE_CREATED"
  | "MAGAZINE_ARTICLE_TEXT_FINALIZED"
  | "MAGAZINE_ARTICLE_TRANSLATION_MARKED"
  | "MAGAZINE_ARTICLE_REVIEW_COMPLETED"
  | "MAGAZINE_ARTICLE_APPROVED"
  | "MAGAZINE_ARTICLE_READY_RECALCULATED"
  | "MAGAZINE_ARTICLE_COMPONENT_CREATED"
  | "MAGAZINE_ARTICLE_COMPONENT_VALIDATED"
  | "MAGAZINE_ARTICLE_TEXT_UPDATED"
  | "MAGAZINE_ARTICLES_REORDERED"
  | "MAGAZINE_ARTICLE_MOVED"
  | "MAGAZINE_REVIEW_ITEM_CREATED"
  | "MAGAZINE_REVIEW_SEVERITY_CHANGED"
  | "MAGAZINE_REVIEW_ITEM_RESOLVED"
  | "MAGAZINE_MAJOR_REVIEW_OVERRIDDEN"
  | "MAGAZINE_PUBLISHED_REVISION_CREATED"
  | "MAGAZINE_SOURCE_LINEAGE_RECORDED"
  | "MAGAZINE_TRANSLATION_PROVENANCE_RECORDED"
  | "MAGAZINE_OFFICIAL_VERSION_SWITCHED"
  | "MAGAZINE_TABLE_OF_CONTENTS_UPDATED"
  | "MAGAZINE_GLOBAL_CONTROL_RUN"
  | "MAGAZINE_PREFLIGHT_RUN"
  | "MAGAZINE_LAYOUT_ASSEMBLED"
  | "MAGAZINE_FINAL_APPROVED"
  | "MAGAZINE_PUBLISHED"
  | "MAGAZINE_WITHDRAWN"
  | "MAGAZINE_REPUBLISHED"
  | "MAGAZINE_CROSS_EDITION_REUSE_CREATED"
  | "MAGAZINE_ADAPTABILITY_ANALYZED"
  | "MAGAZINE_DISTRIBUTION_PROMOTION_RECORDED";

export interface MagazineIssue {
  id: string;
  organizationId: string;
  projectId: string;
  title: string;
  issueNumber: string;
  publicationDate?: string;
  issn?: string;
  language: string;
  status: MagazineIssueStatus;
  articleOrder: string[];
  sectionOrder: string[];
  commonMaterialIds: string[];
  tableOfContents: MagazineTableOfContents;
  layoutPublicationPlanId?: string;
  globalControl?: MagazineQualityGateResult;
  preflight?: MagazineQualityGateResult;
  finalApproval?: MagazineFinalApproval;
  publishedVersion?: MagazineIssueVersion;
  currentOfficialVersionId?: string;
  withdrawalReason?: string;
  currentOfficialVersionFlag?: MagazineCurrentOfficialVersionFlag;
  distributionPromotionHistory: MagazineDistributionPromotionRecord[];
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface MagazineSection {
  id: string;
  organizationId: string;
  issueId: string;
  title: string;
  order: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface MagazineArticle {
  id: string;
  organizationId: string;
  issueId: string;
  projectId: string;
  documentId?: string;
  workflowStateId?: string;
  title: string;
  authors: string[];
  sectionId?: string;
  category?: string;
  language: string;
  rightsStatus?: string;
  keywords: string[];
  identifier?: string;
  textContent: string;
  textStatus: MagazineValidationStatus;
  translationRequired: boolean;
  translationStatus: "NOT_REQUIRED" | "PENDING" | "COMPLETED" | "OUTDATED";
  correctionStatus: "PENDING" | "COMPLETED";
  editorialApprovalStatus: "PENDING" | "APPROVED";
  componentIds: string[];
  readyForIssue: boolean;
  readyForIssueBlockers: string[];
  status: MagazineArticleStatus;
  order: number;
  version: number;
  reusable: boolean;
  provenance?: MagazineArticleProvenance;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface MagazineArticleProvenance {
  sourceIssueId?: string;
  sourceArticleId?: string;
  sourceArticleVersion?: number;
  sourceOfRecordId?: string;
  sourceVersionId?: string;
  derivedFromId?: string;
  derivedFromVersionId?: string;
  derivationType?: MagazineDerivationType;
  language?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  translatorId?: string;
  translatorName?: string;
  status?: "CURRENT" | "OUTDATED" | "SUPERSEDED";
  createdAt?: string;
  sourceAssetId?: string;
  sourceReference?: string;
  reusedFrom?: string;
  version: number;
}

export interface MagazineArticleComponent {
  id: string;
  organizationId: string;
  issueId: string;
  articleId: string;
  componentType: MagazineArticleComponentType;
  title: string;
  status: MagazineValidationStatus;
  required: boolean;
  assetId?: string;
  sourceComponentId?: string;
  lineage?: MagazineSourceLineage;
  dependsOnComponentIds: string[];
  transcriptComponentId?: string;
  subtitleComponentId?: string;
  reviewSeverity?: MagazineReviewSeverity;
  reviewOverride?: MagazineReviewOverride;
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface MagazineCommonMaterial {
  id: string;
  organizationId: string;
  issueId: string;
  materialType: MagazineCommonMaterialType;
  title: string;
  included: boolean;
  required: boolean;
  status: MagazineValidationStatus;
  componentRefs: string[];
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface MagazineTableOfContents {
  status: "CURRENT" | "OUTDATED";
  generatedAt?: string;
  entries: MagazineTableOfContentsEntry[];
}

export interface MagazineTableOfContentsEntry {
  articleId: string;
  title: string;
  sectionId?: string;
  sectionTitle?: string;
  order: number;
  pageNumber?: number;
}

export interface MagazineQualityGateIssue {
  code: string;
  severity: MagazineGateStatus;
  reviewSeverity?: MagazineReviewSeverity;
  message: string;
  sourceComponent:
    | "ARTICLE"
    | "COMMON_MATERIAL"
    | "TABLE_OF_CONTENTS"
    | "LAYOUT"
    | "PREFLIGHT"
    | "RIGHTS"
    | "WORKFLOW"
    | "ADAPTABILITY_AGENT";
  referenceId?: string;
}

export interface MagazineQualityGateResult {
  id: string;
  status: MagazineGateStatus;
  completionPercentage: number;
  blockers: MagazineQualityGateIssue[];
  warnings: MagazineQualityGateIssue[];
  checkedAt: string;
  metadata?: Record<string, unknown>;
}

export interface MagazineReviewOverride {
  id: string;
  severity: "MAJOR";
  actorId: string;
  createdAt: string;
  justification: string;
  issueVersion: number;
  articleVersion?: number;
  affectedComponentId?: string;
}

export interface MagazineReviewItem {
  id: string;
  organizationId: string;
  issueId: string;
  articleId?: string;
  componentId?: string;
  issueVersion: number;
  articleVersion?: number;
  affectedComponentType?: MagazineArticleComponentType;
  severity: MagazineReviewSeverity;
  status: MagazineReviewItemStatus;
  blocksPublication: boolean;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  resolvedBy?: string;
  resolvedAt?: string;
  override?: MagazineReviewOverride;
  metadata?: Record<string, unknown>;
}

export interface MagazineCurrentOfficialVersionFlag {
  reviewItemId: string;
  severity: "CRITICAL";
  flaggedAt: string;
  flaggedBy: string;
  reason: string;
}

export interface MagazineSourceLineage {
  sourceOfRecordId: string;
  sourceVersionId: string;
  derivedFromId?: string;
  derivedFromVersionId?: string;
  derivationType: MagazineDerivationType;
  language: string;
  version: number;
  status: "CURRENT" | "OUTDATED" | "SUPERSEDED";
  createdAt: string;
}

export interface MagazineFinalApproval {
  mode: MagazineFinalApprovalMode;
  approvalStatus: "PENDING" | "APPROVED";
  approvedBy?: string;
  approvedAt?: string;
  humanFinalAuthorityRequired: true;
}

export interface MagazineIssueVersion {
  id: string;
  organizationId: string;
  issueId: string;
  version: number;
  status: "DRAFT" | "OFFICIAL" | "WITHDRAWN" | "SUPERSEDED";
  reason: string;
  articleIds: string[];
  articleOrder: string[];
  tableOfContents: MagazineTableOfContents;
  previousVersionId?: string;
  supersededByVersionId?: string;
  createdBy: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface MagazineDistributionPromotionRecord {
  id: string;
  channel: string;
  status: "PLANNED" | "READY" | "DELIVERED" | "WITHDRAWN";
  officialVersionId: string;
  createdBy: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface MagazineAdaptabilityAnalysis {
  id: string;
  issueId: string;
  projectId: string;
  recommendedCapabilities: Array<
    "TRANSLATION" | "AUDIO" | "VIDEO" | "FLIPBOOK" | "ACCESSIBILITY"
  >;
  articleRecommendations: MagazineAdaptabilityArticleRecommendation[];
  impactPreview: MagazineQualityGateIssue[];
  smartCheckpoints: MagazineIssueWorkflowStage[];
  dependencyProtection: true;
  branchingSupported: true;
  scenarioBranchComparisonSupported: true;
  controlledVersionRestoreSupported: true;
  avoidsValidatedStageLoss: true;
  aiMayAnalyzeAndProposeOnly: true;
  workflowEngineExecutes: true;
  versioningPreservesStates: true;
  auditPreservesActions: true;
  createdAt: string;
}

export interface MagazineAdaptabilityArticleRecommendation {
  articleId: string;
  recommendations: Array<"TRANSLATION" | "AUDIO" | "VIDEO" | "ACCESSIBILITY_REVIEW">;
  reason: string;
}

export interface MagazineIssueOverview {
  issue: MagazineIssue;
  sections: MagazineSection[];
  articles: Array<MagazineArticle & { components: MagazineArticleComponent[] }>;
  reviewItems: MagazineReviewItem[];
  commonMaterials: MagazineCommonMaterial[];
  tableOfContents: MagazineTableOfContents;
  currentOfficialVersion?: MagazineIssueVersion;
  qualityGate: MagazineQualityGateResult;
  adaptabilityAnalysis: MagazineAdaptabilityAnalysis;
}

export interface MagazineAuditEvent {
  id: string;
  organizationId: string;
  issueId?: string;
  articleId?: string;
  componentId?: string;
  commonMaterialId?: string;
  issueVersionId?: string;
  reviewItemId?: string;
  action: MagazineAuditAction;
  actorId: string;
  beforeState?: object;
  afterState?: object;
  reason?: string;
  createdAt: string;
}

export interface CreateMagazineIssueInput {
  projectId: string;
  title: string;
  issueNumber: string;
  publicationDate?: string;
  issn?: string;
  language: string;
  metadata?: Record<string, unknown>;
}

export interface CreateMagazineSectionInput {
  title: string;
  order?: number;
  metadata?: Record<string, unknown>;
}

export interface CreateMagazineCommonMaterialInput {
  materialType: MagazineCommonMaterialType;
  title: string;
  included?: boolean;
  required?: boolean;
  status?: MagazineValidationStatus;
  componentRefs?: string[];
  metadata?: Record<string, unknown>;
}

export interface CreateMagazineArticleInput {
  documentId?: string;
  title: string;
  authors?: string[];
  sectionId?: string;
  category?: string;
  language: string;
  rightsStatus?: string;
  keywords?: string[];
  identifier?: string;
  textContent: string;
  translationRequired?: boolean;
  reusable?: boolean;
  provenance?: Partial<MagazineArticleProvenance>;
  metadata?: Record<string, unknown>;
}

export interface CreateMagazineArticleComponentInput {
  componentType: MagazineArticleComponentType;
  title: string;
  status?: MagazineValidationStatus;
  required?: boolean;
  assetId?: string;
  sourceComponentId?: string;
  lineage?: Partial<MagazineSourceLineage>;
  dependsOnComponentIds?: string[];
  transcriptComponentId?: string;
  subtitleComponentId?: string;
  reviewSeverity?: MagazineReviewSeverity;
  metadata?: Record<string, unknown>;
}

export interface UpdateMagazineArticleTextInput {
  textContent: string;
  reason: string;
}

export interface CreateMagazineRevisionInput {
  reason: string;
}

export interface CreateMagazineReviewItemInput {
  title: string;
  description: string;
  severity: MagazineReviewSeverity;
  componentId?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateMagazineReviewSeverityInput {
  severity: MagazineReviewSeverity;
  reason: string;
}

export interface OverrideMagazineReviewItemInput {
  justification: string;
}

export interface ResolveMagazineReviewItemInput {
  reason?: string;
}

export interface ReorderMagazineArticlesInput {
  articleIds: string[];
  reason?: string;
}

export interface MoveMagazineArticleInput {
  sectionId?: string;
  order?: number;
  reason?: string;
}

export interface MagazineFinalApprovalInput {
  approvalMode?: MagazineFinalApprovalMode;
  reason?: string;
}

export interface WithdrawMagazineIssueInput {
  reason: string;
}

export interface RepublishMagazineIssueInput {
  reason: string;
}

export interface RecordMagazineDistributionPromotionInput {
  channel: string;
  status?: "PLANNED" | "READY" | "DELIVERED" | "WITHDRAWN";
  metadata?: Record<string, unknown>;
}

export interface CreateMagazineReuseInput {
  sourceArticleId: string;
  targetIssueId: string;
  sectionId?: string;
  order?: number;
  title?: string;
  reason?: string;
}

export interface MagazineWorkflowRepository {
  createIssue(issue: MagazineIssue): Promise<MagazineIssue>;
  updateIssue(issue: MagazineIssue): Promise<MagazineIssue>;
  findIssueById(id: string, organizationId: string): Promise<MagazineIssue | null>;
  listIssues(organizationId: string): Promise<MagazineIssue[]>;
  createSection(section: MagazineSection): Promise<MagazineSection>;
  updateSection(section: MagazineSection): Promise<MagazineSection>;
  findSectionById(id: string, organizationId: string): Promise<MagazineSection | null>;
  listSections(issueId: string, organizationId: string): Promise<MagazineSection[]>;
  createArticle(article: MagazineArticle): Promise<MagazineArticle>;
  updateArticle(article: MagazineArticle): Promise<MagazineArticle>;
  findArticleById(id: string, organizationId: string): Promise<MagazineArticle | null>;
  listArticles(issueId: string, organizationId: string): Promise<MagazineArticle[]>;
  createComponent(component: MagazineArticleComponent): Promise<MagazineArticleComponent>;
  updateComponent(component: MagazineArticleComponent): Promise<MagazineArticleComponent>;
  findComponentById(
    id: string,
    organizationId: string
  ): Promise<MagazineArticleComponent | null>;
  listComponentsByArticle(
    articleId: string,
    organizationId: string
  ): Promise<MagazineArticleComponent[]>;
  createReviewItem(item: MagazineReviewItem): Promise<MagazineReviewItem>;
  updateReviewItem(item: MagazineReviewItem): Promise<MagazineReviewItem>;
  findReviewItemById(
    id: string,
    organizationId: string
  ): Promise<MagazineReviewItem | null>;
  listReviewItemsByIssue(
    issueId: string,
    organizationId: string
  ): Promise<MagazineReviewItem[]>;
  listReviewItemsByArticle(
    articleId: string,
    organizationId: string
  ): Promise<MagazineReviewItem[]>;
  createCommonMaterial(material: MagazineCommonMaterial): Promise<MagazineCommonMaterial>;
  updateCommonMaterial(material: MagazineCommonMaterial): Promise<MagazineCommonMaterial>;
  findCommonMaterialById(
    id: string,
    organizationId: string
  ): Promise<MagazineCommonMaterial | null>;
  listCommonMaterials(
    issueId: string,
    organizationId: string
  ): Promise<MagazineCommonMaterial[]>;
  createIssueVersion(version: MagazineIssueVersion): Promise<MagazineIssueVersion>;
  updateIssueVersion(version: MagazineIssueVersion): Promise<MagazineIssueVersion>;
  listIssueVersions(
    issueId: string,
    organizationId: string
  ): Promise<MagazineIssueVersion[]>;
  appendAuditEvent(event: MagazineAuditEvent): Promise<void>;
  listAuditEvents(
    organizationId: string,
    issueId?: string
  ): Promise<MagazineAuditEvent[]>;
}
