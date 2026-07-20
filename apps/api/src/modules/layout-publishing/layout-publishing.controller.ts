import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { LayoutPublishingService } from "./layout-publishing.service";
import {
  type CreateLayoutPublicationPlanInput,
  type EditorialFinishingProfile,
  type GeneratePublishingPreflightInput,
  type PreparePublishingRecordInput,
  type PublishRecordInput,
  type RecordDistributionInput,
  type RecordLayoutExportInput,
  type RepublishPublishingRecordInput,
  type UpdateDistributionStatusInput,
  type WithdrawPublishingRecordInput
} from "./layout-publishing.types";

@Controller("layout-publishing")
export class LayoutPublishingController {
  constructor(private readonly layoutPublishingService: LayoutPublishingService) {}

  @Post("plans")
  createPlan(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateLayoutPublicationPlanInput
  ) {
    return this.layoutPublishingService.createPlan(actor, input);
  }

  @Get("plans/:id")
  getPlan(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.layoutPublishingService.getPlan(actor, id);
  }

  @Post("plans/:id/style-revisions")
  createStyleRevision(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: Partial<EditorialFinishingProfile>
  ) {
    return this.layoutPublishingService.createStyleRevision(actor, id, input);
  }

  @Post("plans/:id/approve")
  approvePublication(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.layoutPublishingService.approvePublication(actor, id);
  }

  @Post("plans/:id/reject")
  rejectPublication(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.layoutPublishingService.rejectPublication(actor, id);
  }

  @Post("plans/:id/exports")
  recordExport(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: RecordLayoutExportInput
  ) {
    return this.layoutPublishingService.recordExport(actor, id, input);
  }

  @Post("publishing/preflight")
  generatePublishingPreflight(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: GeneratePublishingPreflightInput
  ) {
    return this.layoutPublishingService.generatePublishingPreflight(actor, input);
  }

  @Get("publishing/preflight/:id")
  getPublishingPreflight(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.layoutPublishingService.getPublishingPreflight(actor, id);
  }

  @Post("publishing/records")
  preparePublishingRecord(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: PreparePublishingRecordInput
  ) {
    return this.layoutPublishingService.preparePublishingRecord(actor, input);
  }

  @Post("publishing/records/:id/ready")
  markReadyForPublication(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: { reason?: string }
  ) {
    return this.layoutPublishingService.markReadyForPublication(actor, id, input.reason);
  }

  @Post("publishing/records/:id/publish")
  publishOfficialEdition(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: PublishRecordInput
  ) {
    return this.layoutPublishingService.publishOfficialEdition(actor, id, input);
  }

  @Post("publishing/records/:id/withdraw")
  withdrawPublication(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: WithdrawPublishingRecordInput
  ) {
    return this.layoutPublishingService.withdrawPublication(actor, id, input);
  }

  @Post("publishing/records/:id/republish")
  republishPublication(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: RepublishPublishingRecordInput
  ) {
    return this.layoutPublishingService.republishPublication(actor, id, input);
  }

  @Post("publishing/records/:id/distribution")
  recordDistribution(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: RecordDistributionInput
  ) {
    return this.layoutPublishingService.recordDistribution(actor, id, input);
  }

  @Get("publishing/records/:id/distribution")
  listDistributionHistory(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.layoutPublishingService.listDistributionHistory(actor, id);
  }

  @Post("publishing/distribution/:id/status")
  updateDistributionStatus(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: UpdateDistributionStatusInput
  ) {
    return this.layoutPublishingService.updateDistributionStatus(actor, id, input);
  }
}
