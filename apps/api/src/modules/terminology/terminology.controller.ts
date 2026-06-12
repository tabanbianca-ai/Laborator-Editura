import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { TerminologyService } from "./terminology.service";
import {
  type CheckSegmentTerminologyInput,
  type CreateTerminologyTermInput,
  type SearchTerminologyInput,
  type TerminologyTermStatus,
  type UpdateTerminologyTermInput
} from "./terminology.types";

@Controller("terminology")
export class TerminologyController {
  constructor(private readonly terminologyService: TerminologyService) {}

  @Post("terms")
  createTerm(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateTerminologyTermInput
  ) {
    return this.terminologyService.createTerm(actor, input);
  }

  @Patch("terms/:id")
  updateTerm(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: UpdateTerminologyTermInput
  ) {
    return this.terminologyService.updateTerm(actor, id, input);
  }

  @Post("terms/:id/validate")
  validateTerm(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.terminologyService.validateTerm(actor, id);
  }

  @Post("terms/:id/suspend")
  suspendTerm(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.terminologyService.suspendTerm(actor, id);
  }

  @Post("terms/:id/archive")
  archiveTerm(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.terminologyService.archiveTerm(actor, id);
  }

  @Get("terms")
  searchTerms(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Query() query: Record<string, string | undefined>
  ) {
    const input: SearchTerminologyInput = {
      language: query.language ?? "",
      domain: query.domain,
      status: query.status as TerminologyTermStatus | undefined,
      query: query.query,
      limit: query.limit ? Number(query.limit) : undefined
    };

    return this.terminologyService.searchTerms(actor, input);
  }

  @Post("check-segment")
  checkSegment(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CheckSegmentTerminologyInput
  ) {
    return this.terminologyService.checkSegmentText(actor, input);
  }
}
