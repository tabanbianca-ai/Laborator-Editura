import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { SegmentsService } from "./segments.service";
import { type CreateSegmentInput } from "./segments.types";

@Controller("segments")
export class SegmentsController {
  constructor(private readonly segmentsService: SegmentsService) {}

  @Post()
  createSegment(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateSegmentInput
  ) {
    return this.segmentsService.createSegment(actor, input);
  }

  @Get()
  listSegments(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Query("documentId") documentId: string
  ) {
    return this.segmentsService.listSegments(actor, documentId);
  }

  @Get(":id")
  getSegment(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.segmentsService.getSegment(actor, id);
  }
}
