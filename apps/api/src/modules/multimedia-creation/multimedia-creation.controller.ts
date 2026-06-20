import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { MultimediaCreationService } from "./multimedia-creation.service";
import {
  type CreateMultimediaAssetInput,
  type CreateMultimediaProjectInput,
  type RecordMultimediaExportInput
} from "./multimedia-creation.types";

@Controller("multimedia")
export class MultimediaCreationController {
  constructor(private readonly multimediaCreationService: MultimediaCreationService) {}

  @Post("projects")
  createProject(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateMultimediaProjectInput
  ) {
    return this.multimediaCreationService.createProject(actor, input);
  }

  @Get("projects/:id")
  getProject(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.multimediaCreationService.getProject(actor, id);
  }

  @Post("projects/:id/assets")
  addAsset(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: CreateMultimediaAssetInput
  ) {
    return this.multimediaCreationService.addAsset(actor, id, input);
  }

  @Post("projects/:id/approve")
  approveProject(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.multimediaCreationService.approveProject(actor, id);
  }

  @Post("projects/:id/reject")
  rejectProject(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.multimediaCreationService.rejectProject(actor, id);
  }

  @Post("projects/:id/exports")
  recordExport(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: RecordMultimediaExportInput
  ) {
    return this.multimediaCreationService.recordExport(actor, id, input);
  }
}
