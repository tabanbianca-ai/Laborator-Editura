import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { SecurityGovernanceService } from "./security-governance.service";
import {
  type CreateSecurityAccessReviewInput,
  type CreateSecurityEventInput,
  type CreateSecurityPolicyInput,
  type RevokeSessionInput
} from "./security-governance.types";

@Controller("security")
export class SecurityGovernanceController {
  constructor(private readonly securityGovernanceService: SecurityGovernanceService) {}

  @Get("policies")
  listPolicies(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.securityGovernanceService.listPolicies(actor);
  }

  @Post("policies")
  createPolicy(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateSecurityPolicyInput
  ) {
    return this.securityGovernanceService.createPolicy(actor, input);
  }

  @Get("access-reviews")
  listAccessReviews(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.securityGovernanceService.listAccessReviews(actor);
  }

  @Post("access-reviews")
  createAccessReview(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateSecurityAccessReviewInput
  ) {
    return this.securityGovernanceService.createAccessReview(actor, input);
  }

  @Get("events")
  listSecurityEvents(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.securityGovernanceService.listSecurityEvents(actor);
  }

  @Post("events")
  createSecurityEvent(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateSecurityEventInput
  ) {
    return this.securityGovernanceService.createSecurityEvent(actor, input);
  }

  @Post("sessions/:id/revoke")
  revokeSession(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: RevokeSessionInput
  ) {
    return this.securityGovernanceService.revokeSession(actor, id, input);
  }

  @Get("audit")
  listAudit(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.securityGovernanceService.listAudit(actor);
  }
}
