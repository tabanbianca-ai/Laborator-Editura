import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { EditorialDecisionService } from "./editorial-decisions.service";
import {
  type CreateEditorialCorrectionInput,
  type CreateEditorialDecisionRecommendationInput,
  type RequestEditorialChangesInput
} from "./editorial-decisions.types";

@Controller("editorial-decisions")
export class EditorialDecisionController {
  constructor(private readonly editorialDecisionService: EditorialDecisionService) {}

  @Post("recommendations")
  createRecommendation(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateEditorialDecisionRecommendationInput
  ) {
    return this.editorialDecisionService.createRecommendation(actor, input);
  }

  @Get("recommendations/:id")
  getRecommendation(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.editorialDecisionService.getRecommendation(actor, id);
  }

  @Get("recommendations")
  listRecommendations(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Query("documentId") documentId: string,
    @Query("segmentId") segmentId?: string
  ) {
    return this.editorialDecisionService.listRecommendations(actor, documentId, segmentId);
  }

  @Post("corrections")
  createCorrection(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateEditorialCorrectionInput
  ) {
    return this.editorialDecisionService.createCorrection(actor, input);
  }

  @Post("corrections/:id/accept")
  acceptCorrection(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.editorialDecisionService.acceptCorrection(actor, id);
  }

  @Post("corrections/:id/reject")
  rejectCorrection(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.editorialDecisionService.rejectRecommendation(actor, id);
  }

  @Post("request-changes")
  requestChanges(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: RequestEditorialChangesInput
  ) {
    return this.editorialDecisionService.requestChanges(actor, input);
  }

  @Post("complete-no-changes")
  completeWithoutChanges(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateEditorialDecisionRecommendationInput
  ) {
    return this.editorialDecisionService.completeWithoutChanges(actor, input);
  }

  @Post("recommendations/:id/approve")
  approveRecommendation(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.editorialDecisionService.approveRecommendation(actor, id);
  }

  @Post("recommendations/:id/reject")
  rejectRecommendation(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.editorialDecisionService.rejectRecommendation(actor, id);
  }
}
