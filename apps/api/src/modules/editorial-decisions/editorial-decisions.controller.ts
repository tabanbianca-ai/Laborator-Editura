import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { EditorialDecisionService } from "./editorial-decisions.service";
import { type CreateEditorialDecisionRecommendationInput } from "./editorial-decisions.types";

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
