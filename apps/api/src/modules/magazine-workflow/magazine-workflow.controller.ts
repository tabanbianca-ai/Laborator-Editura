import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { MagazineWorkflowService } from "./magazine-workflow.service";
import {
  type CreateMagazineArticleComponentInput,
  type CreateMagazineArticleInput,
  type CreateMagazineCommonMaterialInput,
  type CreateMagazineIssueInput,
  type CreateMagazineRevisionInput,
  type CreateMagazineReviewItemInput,
  type CreateMagazineReuseInput,
  type CreateMagazineSectionInput,
  type MagazineFinalApprovalInput,
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

@Controller("magazine-workflow")
export class MagazineWorkflowController {
  constructor(private readonly magazineWorkflowService: MagazineWorkflowService) {}

  @Post("issues")
  createIssue(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateMagazineIssueInput
  ) {
    return this.magazineWorkflowService.createIssue(actor, input);
  }

  @Get("issues")
  listIssues(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.magazineWorkflowService.listIssues(actor);
  }

  @Get("issues/:id")
  getIssue(@CurrentActor() actor: AuthenticatedRequestContext, @Param("id") id: string) {
    return this.magazineWorkflowService.getIssueOverview(actor, id);
  }

  @Post("issues/:id/sections")
  createSection(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: CreateMagazineSectionInput
  ) {
    return this.magazineWorkflowService.createSection(actor, id, input);
  }

  @Post("issues/:id/common-materials")
  createCommonMaterial(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: CreateMagazineCommonMaterialInput
  ) {
    return this.magazineWorkflowService.createCommonMaterial(actor, id, input);
  }

  @Post("common-materials/:id/validate")
  validateCommonMaterial(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.magazineWorkflowService.validateCommonMaterial(actor, id);
  }

  @Post("issues/:id/articles")
  createArticle(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: CreateMagazineArticleInput
  ) {
    return this.magazineWorkflowService.createArticle(actor, id, input);
  }

  @Post("articles/:id/components")
  addArticleComponent(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: CreateMagazineArticleComponentInput
  ) {
    return this.magazineWorkflowService.addArticleComponent(actor, id, input);
  }

  @Post("components/:id/validate")
  validateArticleComponent(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.magazineWorkflowService.validateArticleComponent(actor, id);
  }

  @Post("articles/:id/text/finalize")
  finalizeArticleText(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.magazineWorkflowService.finalizeArticleText(actor, id);
  }

  @Post("articles/:id/text")
  updateArticleText(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: UpdateMagazineArticleTextInput
  ) {
    return this.magazineWorkflowService.updateArticleText(actor, id, input);
  }

  @Post("articles/:id/translation/complete")
  markTranslationCompleted(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.magazineWorkflowService.markTranslationCompleted(actor, id);
  }

  @Post("articles/:id/review/complete")
  completeArticleReview(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.magazineWorkflowService.completeArticleReview(actor, id);
  }

  @Post("articles/:id/approve")
  approveArticle(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.magazineWorkflowService.approveArticle(actor, id);
  }

  @Post("articles/:id/review-items")
  createReviewItem(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: CreateMagazineReviewItemInput
  ) {
    return this.magazineWorkflowService.createReviewItem(actor, id, input);
  }

  @Post("review-items/:id/severity")
  updateReviewItemSeverity(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: UpdateMagazineReviewSeverityInput
  ) {
    return this.magazineWorkflowService.updateReviewItemSeverity(actor, id, input);
  }

  @Post("review-items/:id/override")
  overrideReviewItem(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: OverrideMagazineReviewItemInput
  ) {
    return this.magazineWorkflowService.overrideReviewItem(actor, id, input);
  }

  @Post("review-items/:id/resolve")
  resolveReviewItem(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: ResolveMagazineReviewItemInput
  ) {
    return this.magazineWorkflowService.resolveReviewItem(actor, id, input);
  }

  @Post("articles/:id/ready-for-issue")
  markArticleReadyForIssue(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.magazineWorkflowService.markArticleReadyForIssue(actor, id);
  }

  @Post("issues/:id/articles/reorder")
  reorderArticles(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: ReorderMagazineArticlesInput
  ) {
    return this.magazineWorkflowService.reorderArticles(actor, id, input);
  }

  @Post("articles/:id/move")
  moveArticle(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: MoveMagazineArticleInput
  ) {
    return this.magazineWorkflowService.moveArticle(actor, id, input);
  }

  @Post("issues/:id/table-of-contents/refresh")
  refreshTableOfContents(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.magazineWorkflowService.refreshTableOfContents(actor, id);
  }

  @Post("issues/:id/layout/assemble")
  assembleLayout(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.magazineWorkflowService.assembleLayout(actor, id);
  }

  @Post("issues/:id/global-control")
  runGlobalControl(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.magazineWorkflowService.runGlobalControl(actor, id);
  }

  @Post("issues/:id/preflight")
  runPreflight(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.magazineWorkflowService.runPreflight(actor, id);
  }

  @Post("issues/:id/final-approval")
  approveFinalIssue(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: MagazineFinalApprovalInput
  ) {
    return this.magazineWorkflowService.approveFinalIssue(actor, id, input);
  }

  @Post("issues/:id/publish")
  publishIssue(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.magazineWorkflowService.publishIssue(actor, id);
  }

  @Post("issues/:id/revisions")
  createPublishedRevision(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: CreateMagazineRevisionInput
  ) {
    return this.magazineWorkflowService.createPublishedRevision(actor, id, input);
  }

  @Post("issues/:id/withdraw")
  withdrawIssue(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: WithdrawMagazineIssueInput
  ) {
    return this.magazineWorkflowService.withdrawIssue(actor, id, input);
  }

  @Post("issues/:id/republish")
  republishIssue(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: RepublishMagazineIssueInput
  ) {
    return this.magazineWorkflowService.republishIssue(actor, id, input);
  }

  @Post("issues/:id/distribution-promotion")
  recordDistributionPromotion(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: RecordMagazineDistributionPromotionInput
  ) {
    return this.magazineWorkflowService.recordDistributionPromotion(actor, id, input);
  }

  @Post("reuse")
  createCrossEditionReuse(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateMagazineReuseInput
  ) {
    return this.magazineWorkflowService.createCrossEditionReuse(actor, input);
  }

  @Post("issues/:id/adaptability/analyze")
  analyzeAdaptability(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.magazineWorkflowService.analyzeAdaptability(actor, id);
  }

  @Get("issues/:id/versions")
  listIssueVersions(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.magazineWorkflowService.listIssueVersions(actor, id);
  }

  @Get("audit")
  listAuditEvents(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.magazineWorkflowService.listAuditEvents(actor);
  }

  @Get("issues/:id/audit")
  listIssueAuditEvents(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.magazineWorkflowService.listAuditEvents(actor, id);
  }
}
