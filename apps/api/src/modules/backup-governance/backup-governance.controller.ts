import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CurrentActor } from "../auth/request-context.decorator";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { BackupGovernanceService } from "./backup-governance.service";
import {
  type CreateBackupJobInput,
  type CreateDisasterRecoveryPlanInput,
  type CreateRetentionPolicyInput,
  type RestoreBackupInput
} from "./backup-governance.types";

@Controller("backup")
export class BackupGovernanceController {
  constructor(private readonly backupGovernanceService: BackupGovernanceService) {}

  @Get("jobs")
  listBackupJobs(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.backupGovernanceService.listBackupJobs(actor);
  }

  @Post("jobs")
  createBackupJob(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateBackupJobInput
  ) {
    return this.backupGovernanceService.createBackupJob(actor, input);
  }

  @Get("retention")
  listRetentionPolicies(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.backupGovernanceService.listRetentionPolicies(actor);
  }

  @Post("retention")
  createRetentionPolicy(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateRetentionPolicyInput
  ) {
    return this.backupGovernanceService.createRetentionPolicy(actor, input);
  }

  @Get("recovery-plans")
  listDisasterRecoveryPlans(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.backupGovernanceService.listDisasterRecoveryPlans(actor);
  }

  @Post("recovery-plans")
  createDisasterRecoveryPlan(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Body() input: CreateDisasterRecoveryPlanInput
  ) {
    return this.backupGovernanceService.createDisasterRecoveryPlan(actor, input);
  }

  @Get("preservation")
  listPreservationRecords(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.backupGovernanceService.listPreservationRecords(actor);
  }

  @Post("restore/:id")
  restoreBackup(
    @CurrentActor() actor: AuthenticatedRequestContext,
    @Param("id") id: string,
    @Body() input: RestoreBackupInput
  ) {
    return this.backupGovernanceService.restoreBackup(actor, id, input);
  }

  @Get("audit")
  listAudit(@CurrentActor() actor: AuthenticatedRequestContext) {
    return this.backupGovernanceService.listAudit(actor);
  }
}
