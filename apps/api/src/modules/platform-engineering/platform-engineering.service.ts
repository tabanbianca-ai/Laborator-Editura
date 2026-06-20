import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabasePlatformEngineeringRepository } from "./platform-engineering.repository";
import {
  type AgentCoordinationRun,
  type CreateAgentCoordinationRunInput,
  type CreateBackupRestorePlanInput,
  type CreateHealingPlanInput,
  type CreateOptimizationPlanInput,
  type CreateUpgradePlanInput,
  type PlatformEngineeringActor,
  type PlatformEngineeringAuditAction,
  type PlatformEngineeringAuditTrailItem,
  type PlatformEngineeringPlan,
  type PlatformEngineeringPlanKind,
  type PlatformEngineeringRiskLevel,
  type PlatformHealthDiagnostics
} from "./platform-engineering.types";

@Injectable()
export class PlatformEngineeringService {
  constructor(private readonly repository: DatabasePlatformEngineeringRepository) {}

  async getHealthDiagnostics(
    actor: PlatformEngineeringActor
  ): Promise<PlatformHealthDiagnostics> {
    this.validateActor(actor);

    const checkedAt = new Date().toISOString();
    const diagnostics: PlatformHealthDiagnostics = {
      apiHealth: "READY",
      webHealth: "CHECK_NOT_EXECUTED",
      runtimeDatabaseStatus: "AVAILABLE",
      backupStatus: "CONFIGURED",
      moduleReadiness: {
        auth: "READY",
        projects: "READY",
        documents: "READY",
        translations: "READY",
        workflow: "READY",
        export: "READY"
      },
      agentReadiness: {
        lexicographic: "READY",
        editorialDecision: "READY",
        layoutPublishing: "READY",
        multimediaCreation: "READY",
        platformEngineering: "READY"
      },
      destructiveActionsExecuted: false,
      checkedAt
    };

    await this.audit(
      "PLATFORM_HEALTH_DIAGNOSTIC_RUN",
      actor,
      undefined,
      undefined,
      diagnostics
    );

    return diagnostics;
  }

  async createOptimizationPlan(
    actor: PlatformEngineeringActor,
    input: CreateOptimizationPlanInput
  ): Promise<PlatformEngineeringPlan> {
    this.validateActor(actor);
    this.validateTitle(input.title);

    return this.createPlan(actor, {
      planKind: "OPTIMIZATION",
      title: input.title,
      riskLevel: input.riskLevel ?? "LOW",
      action: "OPTIMIZATION_PLAN_CREATED",
      metadata: input.metadata,
      optimization: {
        backendOptimizationRecommendations: input.backendOptimizationRecommendations ?? [],
        databaseIndexOptimizationRecommendations: input.databaseIndexOptimizationRecommendations ?? [],
        cacheRecommendations: input.cacheRecommendations ?? [],
        dockerResourceRecommendations: input.dockerResourceRecommendations ?? [],
        aiCostOptimizationRecommendations: input.aiCostOptimizationRecommendations ?? []
      }
    });
  }

  async createUpgradePlan(
    actor: PlatformEngineeringActor,
    input: CreateUpgradePlanInput
  ): Promise<PlatformEngineeringPlan> {
    this.validateActor(actor);
    this.validateTitle(input.title);

    if (!input.rollbackPlan) {
      throw new BadRequestException("rollbackPlan is required.");
    }

    return this.createPlan(actor, {
      planKind: "UPGRADE",
      title: input.title,
      riskLevel: input.riskLevel,
      action: "UPGRADE_PLAN_CREATED",
      metadata: input.metadata,
      upgrade: {
        dependencyUpgradePlanMetadata: input.dependencyUpgradePlanMetadata ?? {},
        nodePlan: input.nodePlan,
        nestjsPlan: input.nestjsPlan,
        nextjsPlan: input.nextjsPlan,
        dockerPlan: input.dockerPlan,
        postgresqlPlan: input.postgresqlPlan,
        redisPlan: input.redisPlan,
        rollbackPlan: input.rollbackPlan
      }
    });
  }

  async createBackupPlan(
    actor: PlatformEngineeringActor,
    input: CreateBackupRestorePlanInput
  ): Promise<PlatformEngineeringPlan> {
    this.validateActor(actor);
    this.validateTitle(input.title);

    return this.createPlan(actor, {
      planKind: "BACKUP",
      title: input.title,
      riskLevel: input.riskLevel ?? "LOW",
      action: "BACKUP_PLAN_CREATED",
      metadata: input.metadata,
      backupRestore: {
        backupPlanRecords: input.backupPlanRecords ?? [],
        restorePlanRecords: [],
        integrityChecks: input.integrityChecks ?? ["deterministic-json", "tenant-boundary-validation"],
        simulationModeOnly: true,
        destructiveExecutionAllowed: false
      }
    });
  }

  async createRestorePlan(
    actor: PlatformEngineeringActor,
    input: CreateBackupRestorePlanInput
  ): Promise<PlatformEngineeringPlan> {
    this.validateActor(actor);
    this.validateTitle(input.title);

    return this.createPlan(actor, {
      planKind: "RESTORE",
      title: input.title,
      riskLevel: input.riskLevel ?? "HIGH",
      action: "RESTORE_PLAN_CREATED",
      metadata: input.metadata,
      backupRestore: {
        backupPlanRecords: input.backupPlanRecords ?? [],
        restorePlanRecords: input.restorePlanRecords ?? [],
        integrityChecks: input.integrityChecks ?? ["backup-validation", "non-destructive-simulation"],
        simulationModeOnly: true,
        destructiveExecutionAllowed: false
      }
    });
  }

  async createHealingPlan(
    actor: PlatformEngineeringActor,
    input: CreateHealingPlanInput
  ): Promise<PlatformEngineeringPlan> {
    this.validateActor(actor);
    this.validateTitle(input.title);

    return this.createPlan(actor, {
      planKind: "HEALING",
      title: input.title,
      riskLevel: input.riskLevel ?? "MEDIUM",
      action: "HEALING_PLAN_CREATED",
      metadata: input.metadata,
      healing: {
        restartRecommendations: input.restartRecommendations ?? [],
        recoveryRecommendations: input.recoveryRecommendations ?? [],
        serviceHealthRemediationPlans: input.serviceHealthRemediationPlans ?? [],
        automaticExecution: false,
        destructiveExecutionAllowed: false
      }
    });
  }

  async createAgentCoordinationRun(
    actor: PlatformEngineeringActor,
    input: CreateAgentCoordinationRunInput
  ): Promise<AgentCoordinationRun> {
    this.validateActor(actor);
    this.validateTitle(input.title);

    const now = new Date().toISOString();
    const run: AgentCoordinationRun = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      title: input.title,
      agentExecutionPlans: input.agentExecutionPlans ?? [],
      dependenciesBetweenAgents: input.dependenciesBetweenAgents ?? [],
      executionOrder: input.executionOrder ?? [],
      costEstimates: input.costEstimates ?? {},
      auditTrail: [
        this.auditTrailItem("AGENT_COORDINATION_RUN_CREATED", actor, now, 1, {
          humanApprovalRequired: true,
          executionMode: "PLANNING_ONLY"
        })
      ],
      humanApprovalRequired: true,
      executionMode: "PLANNING_ONLY",
      destructiveActionsExecuted: false,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createAgentCoordinationRun(run);
    await this.audit(
      "AGENT_COORDINATION_RUN_CREATED",
      actor,
      undefined,
      undefined,
      created,
      created.id
    );

    return created;
  }

  async approvePlan(
    actor: PlatformEngineeringActor,
    planId: string
  ): Promise<PlatformEngineeringPlan> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getPlan(actor, planId);
    const now = new Date().toISOString();
    const approved: PlatformEngineeringPlan = {
      ...existing,
      approvalStatus: "APPROVED",
      approvedBy: actor.userId,
      approvedAt: now,
      version: existing.version + 1,
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("PLATFORM_PLAN_APPROVED", actor, now, existing.version + 1, {
          finalAuthority: "AUTHORIZED_HUMAN"
        })
      ],
      updatedAt: now
    };

    const saved = await this.repository.updatePlan(approved);
    await this.audit("PLATFORM_PLAN_APPROVED", actor, saved.id, existing, saved);

    return saved;
  }

  async rejectPlan(
    actor: PlatformEngineeringActor,
    planId: string
  ): Promise<PlatformEngineeringPlan> {
    this.validateActor(actor);
    this.assertAuthorizedHuman(actor);

    const existing = await this.getPlan(actor, planId);
    const now = new Date().toISOString();
    const rejected: PlatformEngineeringPlan = {
      ...existing,
      approvalStatus: "REJECTED",
      version: existing.version + 1,
      auditTrail: [
        ...existing.auditTrail,
        this.auditTrailItem("PLATFORM_PLAN_REJECTED", actor, now, existing.version + 1, {
          finalAuthority: "AUTHORIZED_HUMAN"
        })
      ],
      updatedAt: now
    };

    const saved = await this.repository.updatePlan(rejected);
    await this.audit("PLATFORM_PLAN_REJECTED", actor, saved.id, existing, saved);

    return saved;
  }

  private async getPlan(
    actor: PlatformEngineeringActor,
    planId: string
  ): Promise<PlatformEngineeringPlan> {
    const plan = await this.repository.findPlanById(planId, actor.organizationId);

    if (!plan) {
      throw new NotFoundException("Platform engineering plan not found.");
    }

    return plan;
  }

  private async createPlan(
    actor: PlatformEngineeringActor,
    input: {
      planKind: PlatformEngineeringPlanKind;
      title: string;
      riskLevel: PlatformEngineeringRiskLevel;
      action: PlatformEngineeringAuditAction;
      optimization?: PlatformEngineeringPlan["optimization"];
      upgrade?: PlatformEngineeringPlan["upgrade"];
      backupRestore?: PlatformEngineeringPlan["backupRestore"];
      healing?: PlatformEngineeringPlan["healing"];
      metadata?: Record<string, unknown>;
    }
  ): Promise<PlatformEngineeringPlan> {
    const now = new Date().toISOString();
    const plan: PlatformEngineeringPlan = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      planKind: input.planKind,
      title: input.title,
      riskLevel: input.riskLevel,
      optimization: input.optimization,
      upgrade: input.upgrade,
      backupRestore: input.backupRestore,
      healing: input.healing,
      approvalStatus: "PENDING_HUMAN_APPROVAL",
      humanApprovalRequired: true,
      executionMode: "PLANNING_ONLY",
      destructiveActionsExecuted: false,
      auditTrail: [
        this.auditTrailItem(input.action, actor, now, 1, {
          aiMayDiagnose: true,
          aiMayRecommend: true,
          aiMayPlan: true,
          humanFinalAuthority: true,
          noRealExecution: true
        })
      ],
      version: 1,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createPlan(plan);
    await this.audit(input.action, actor, created.id, undefined, created);

    return created;
  }

  private async audit(
    action: PlatformEngineeringAuditAction,
    actor: PlatformEngineeringActor,
    platformEngineeringPlanId: string | undefined,
    beforeState: PlatformEngineeringPlan | PlatformHealthDiagnostics | undefined,
    afterState: PlatformEngineeringPlan | AgentCoordinationRun | PlatformHealthDiagnostics,
    agentCoordinationRunId?: string
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      platformEngineeringPlanId,
      agentCoordinationRunId,
      action,
      actorId: actor.userId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private auditTrailItem(
    action: PlatformEngineeringAuditAction,
    actor: PlatformEngineeringActor,
    at: string,
    version: number,
    details?: object
  ): PlatformEngineeringAuditTrailItem {
    return {
      id: randomUUID(),
      action,
      actorId: actor.userId,
      at,
      version,
      details
    };
  }

  private validateActor(actor: PlatformEngineeringActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

  private validateTitle(title: string): void {
    if (!title) {
      throw new BadRequestException("title is required.");
    }
  }

  private assertAuthorizedHuman(actor: PlatformEngineeringActor): void {
    const permissions = new Set(actor.permissions ?? []);
    const roles = new Set((actor.roles ?? []).map((role) => role.toUpperCase()));

    if (
      !permissions.has("review:approve") &&
      !roles.has("ADMIN") &&
      !roles.has("REVIEWER")
    ) {
      throw new ForbiddenException("Only authorized humans may approve platform operations.");
    }
  }
}
