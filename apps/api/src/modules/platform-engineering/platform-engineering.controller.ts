import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { PlatformEngineeringService } from "./platform-engineering.service";
import {
  type CreateAgentCoordinationRunInput,
  type CreateBackupRestorePlanInput,
  type CreateHealingPlanInput,
  type CreateOptimizationPlanInput,
  type CreateUpgradePlanInput
} from "./platform-engineering.types";

@Controller("platform-engineering")
export class PlatformEngineeringController {
  constructor(private readonly platformEngineeringService: PlatformEngineeringService) {}

  @Get("health")
  getHealthDiagnostics(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.platformEngineeringService.getHealthDiagnostics(actor);
  }

  @Post("optimization-plans")
  createOptimizationPlan(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateOptimizationPlanInput
  ) {
    return this.platformEngineeringService.createOptimizationPlan(actor, input);
  }

  @Post("upgrade-plans")
  createUpgradePlan(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateUpgradePlanInput
  ) {
    return this.platformEngineeringService.createUpgradePlan(actor, input);
  }

  @Post("backup-plans")
  createBackupPlan(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateBackupRestorePlanInput
  ) {
    return this.platformEngineeringService.createBackupPlan(actor, input);
  }

  @Post("restore-plans")
  createRestorePlan(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateBackupRestorePlanInput
  ) {
    return this.platformEngineeringService.createRestorePlan(actor, input);
  }

  @Post("healing-plans")
  createHealingPlan(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateHealingPlanInput
  ) {
    return this.platformEngineeringService.createHealingPlan(actor, input);
  }

  @Post("agent-coordination-runs")
  createAgentCoordinationRun(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateAgentCoordinationRunInput
  ) {
    return this.platformEngineeringService.createAgentCoordinationRun(actor, input);
  }

  @Post("plans/:id/approve")
  approvePlan(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.platformEngineeringService.approvePlan(actor, id);
  }

  @Post("plans/:id/reject")
  rejectPlan(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string
  ) {
    return this.platformEngineeringService.rejectPlan(actor, id);
  }
}
