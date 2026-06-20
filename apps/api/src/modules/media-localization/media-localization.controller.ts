import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { MediaLocalizationService } from "./media-localization.service";
import {
  type CreateMediaLocalizationAssetInput,
  type CreateMediaLocalizationProjectInput
} from "./media-localization.types";

@Controller("media-localization")
export class MediaLocalizationController {
  constructor(private readonly mediaLocalizationService: MediaLocalizationService) {}

  @Post("projects")
  createProject(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateMediaLocalizationProjectInput
  ) {
    return this.mediaLocalizationService.createProject(actor, input);
  }

  @Get("projects/:id")
  getProject(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.mediaLocalizationService.getProject(actor, id);
  }

  @Post("projects/:id/assets")
  addAsset(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: CreateMediaLocalizationAssetInput
  ) {
    return this.mediaLocalizationService.addAsset(actor, id, input);
  }

  @Post("projects/:id/approve")
  approveProject(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.mediaLocalizationService.approveProject(actor, id);
  }

  @Post("projects/:id/reject")
  rejectProject(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.mediaLocalizationService.rejectProject(actor, id);
  }
}
