import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { AiGovernanceService } from "./ai-governance.service";
import {
  type AiOverrideDecisionInput,
  type CreateAiBudgetInput,
  type CreateAiBudgetOverrideRequestInput,
  type CreateAiCostPolicyInput,
  type CreateAiQuotaInput,
  type CreateAiUsageRecordInput
} from "./ai-governance.types";

@Controller("ai-governance")
export class AiGovernanceController {
  constructor(private readonly aiGovernanceService: AiGovernanceService) {}

  @Get("usage")
  listUsage(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.aiGovernanceService.listUsage(actor);
  }

  @Post("usage")
  createUsageRecord(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateAiUsageRecordInput
  ) {
    return this.aiGovernanceService.createUsageRecord(actor, input);
  }

  @Get("budgets")
  listBudgets(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.aiGovernanceService.listBudgets(actor);
  }

  @Post("budgets")
  createBudget(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateAiBudgetInput
  ) {
    return this.aiGovernanceService.createBudget(actor, input);
  }

  @Get("quotas")
  listQuotas(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.aiGovernanceService.listQuotas(actor);
  }

  @Post("quotas")
  createQuota(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateAiQuotaInput
  ) {
    return this.aiGovernanceService.createQuota(actor, input);
  }

  @Get("policies")
  listPolicies(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.aiGovernanceService.listPolicies(actor);
  }

  @Post("policies")
  createPolicy(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateAiCostPolicyInput
  ) {
    return this.aiGovernanceService.createPolicy(actor, input);
  }

  @Post("override-requests")
  createOverrideRequest(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateAiBudgetOverrideRequestInput
  ) {
    return this.aiGovernanceService.createOverrideRequest(actor, input);
  }

  @Post("override-requests/:id/approve")
  approveOverrideRequest(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: AiOverrideDecisionInput
  ) {
    return this.aiGovernanceService.approveOverrideRequest(actor, id, input);
  }

  @Post("override-requests/:id/reject")
  rejectOverrideRequest(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: AiOverrideDecisionInput
  ) {
    return this.aiGovernanceService.rejectOverrideRequest(actor, id, input);
  }

  @Get("audit")
  listAudit(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.aiGovernanceService.listAudit(actor);
  }
}
