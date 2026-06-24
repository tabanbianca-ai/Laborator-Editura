import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { PolicyEngineService } from "./policy-engine.service";
import {
  type CreatePolicyExceptionInput,
  type CreatePolicyInput,
  type EvaluatePolicyInput,
  type PolicyExceptionDecisionInput
} from "./policy-engine.types";

@Controller("policies")
export class PolicyEngineController {
  constructor(private readonly policyEngineService: PolicyEngineService) {}

  @Get()
  listPolicies(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.policyEngineService.listPolicies(actor);
  }

  @Post()
  createPolicy(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreatePolicyInput
  ) {
    return this.policyEngineService.createPolicy(actor, input);
  }

  @Get("evaluations")
  listEvaluations(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.policyEngineService.listEvaluations(actor);
  }

  @Post("evaluate")
  evaluatePolicy(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: EvaluatePolicyInput
  ) {
    return this.policyEngineService.evaluatePolicy(actor, input);
  }

  @Post("exceptions")
  createExceptionRequest(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreatePolicyExceptionInput
  ) {
    return this.policyEngineService.createExceptionRequest(actor, input);
  }

  @Post("exceptions/:id/approve")
  approveException(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: PolicyExceptionDecisionInput
  ) {
    return this.policyEngineService.approveException(actor, id, input);
  }

  @Post("exceptions/:id/reject")
  rejectException(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: PolicyExceptionDecisionInput
  ) {
    return this.policyEngineService.rejectException(actor, id, input);
  }

  @Get("audit")
  listAudit(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.policyEngineService.listAudit(actor);
  }
}
