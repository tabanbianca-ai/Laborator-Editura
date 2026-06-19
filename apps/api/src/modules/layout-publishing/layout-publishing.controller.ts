import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { LayoutPublishingService } from "./layout-publishing.service";
import {
  type CreateLayoutPublicationPlanInput,
  type EditorialFinishingProfile,
  type RecordLayoutExportInput
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
}
