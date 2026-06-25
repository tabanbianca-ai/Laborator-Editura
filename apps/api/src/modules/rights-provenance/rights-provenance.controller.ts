import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { RightsProvenanceService } from "./rights-provenance.service";
import {
  type CreateCollaborationAgreementInput,
  type CreateProvenanceRecordInput,
  type CreatePublishingAuthorizationInput,
  type CreateTranslationAuthorizationInput,
  type RightsQuery
} from "./rights-provenance.types";

@Controller("rights")
export class RightsProvenanceController {
  constructor(private readonly rightsProvenanceService: RightsProvenanceService) {}

  @Get("contracts")
  listContracts(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Query() query: RightsQuery
  ) {
    return this.rightsProvenanceService.listCollaborationAgreements(actor, query);
  }

  @Post("contracts")
  createContract(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateCollaborationAgreementInput
  ) {
    return this.rightsProvenanceService.createCollaborationAgreement(actor, input);
  }

  @Get("translation")
  listTranslationRights(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Query() query: RightsQuery
  ) {
    return this.rightsProvenanceService.listTranslationAuthorizations(actor, query);
  }

  @Post("translation")
  createTranslationRights(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateTranslationAuthorizationInput
  ) {
    return this.rightsProvenanceService.createTranslationAuthorization(actor, input);
  }

  @Get("publishing")
  listPublishingRights(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Query() query: RightsQuery
  ) {
    return this.rightsProvenanceService.listPublishingAuthorizations(actor, query);
  }

  @Post("publishing")
  createPublishingRights(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreatePublishingAuthorizationInput
  ) {
    return this.rightsProvenanceService.createPublishingAuthorization(actor, input);
  }

  @Get("provenance")
  listProvenance(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Query() query: RightsQuery
  ) {
    return this.rightsProvenanceService.listProvenanceRecords(actor, query);
  }

  @Post("provenance")
  createProvenance(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateProvenanceRecordInput
  ) {
    return this.rightsProvenanceService.createProvenanceRecord(actor, input);
  }

  @Get("audit")
  listAudit(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.rightsProvenanceService.listAuditEvents(actor);
  }
}
