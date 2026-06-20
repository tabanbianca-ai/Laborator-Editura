export type PlatformEngineeringPlanKind =
  | "OPTIMIZATION"
  | "UPGRADE"
  | "BACKUP"
  | "RESTORE"
  | "HEALING";

export type PlatformEngineeringRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type PlatformEngineeringApprovalStatus =
  | "PENDING_HUMAN_APPROVAL"
  | "APPROVED"
  | "REJECTED";

export type PlatformEngineeringAuditAction =
  | "PLATFORM_HEALTH_DIAGNOSTIC_RUN"
  | "OPTIMIZATION_PLAN_CREATED"
  | "UPGRADE_PLAN_CREATED"
  | "BACKUP_PLAN_CREATED"
  | "RESTORE_PLAN_CREATED"
  | "HEALING_PLAN_CREATED"
  | "AGENT_COORDINATION_RUN_CREATED"
  | "PLATFORM_PLAN_APPROVED"
  | "PLATFORM_PLAN_REJECTED";

export interface PlatformEngineeringActor {
  userId: string;
  organizationId: string;
  roles?: string[];
  permissions?: string[];
}

export interface PlatformHealthDiagnostics {
  apiHealth: "READY" | "DEGRADED" | "UNKNOWN";
  webHealth: "READY" | "DEGRADED" | "UNKNOWN" | "CHECK_NOT_EXECUTED";
  runtimeDatabaseStatus: "AVAILABLE" | "UNAVAILABLE" | "UNKNOWN";
  backupStatus: "CONFIGURED" | "MISSING" | "UNKNOWN";
  moduleReadiness: Record<string, "READY" | "PLANNED" | "UNKNOWN">;
  agentReadiness: Record<string, "READY" | "PLANNED" | "UNKNOWN">;
  destructiveActionsExecuted: false;
  checkedAt: string;
}

export interface OptimizationPlanProfile {
  backendOptimizationRecommendations: string[];
  databaseIndexOptimizationRecommendations: string[];
  cacheRecommendations: string[];
  dockerResourceRecommendations: string[];
  aiCostOptimizationRecommendations: string[];
}

export interface UpgradePlanProfile {
  dependencyUpgradePlanMetadata: Record<string, string>;
  nodePlan?: string;
  nestjsPlan?: string;
  nextjsPlan?: string;
  dockerPlan?: string;
  postgresqlPlan?: string;
  redisPlan?: string;
  rollbackPlan: string;
}

export interface BackupRestorePlanProfile {
  backupPlanRecords: string[];
  restorePlanRecords: string[];
  integrityChecks: string[];
  simulationModeOnly: true;
  destructiveExecutionAllowed: false;
}

export interface AutoHealingPlanProfile {
  restartRecommendations: string[];
  recoveryRecommendations: string[];
  serviceHealthRemediationPlans: string[];
  automaticExecution: false;
  destructiveExecutionAllowed: false;
}

export interface PlatformEngineeringAuditTrailItem {
  id: string;
  action: PlatformEngineeringAuditAction;
  actorId: string;
  at: string;
  version: number;
  details?: object;
}

export interface PlatformEngineeringPlan {
  id: string;
  organizationId: string;
  planKind: PlatformEngineeringPlanKind;
  title: string;
  riskLevel: PlatformEngineeringRiskLevel;
  optimization?: OptimizationPlanProfile;
  upgrade?: UpgradePlanProfile;
  backupRestore?: BackupRestorePlanProfile;
  healing?: AutoHealingPlanProfile;
  approvalStatus: PlatformEngineeringApprovalStatus;
  humanApprovalRequired: true;
  executionMode: "PLANNING_ONLY";
  destructiveActionsExecuted: false;
  approvedBy?: string;
  approvedAt?: string;
  auditTrail: PlatformEngineeringAuditTrailItem[];
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface AgentExecutionPlan {
  agentName: string;
  objective: string;
  dependencies?: string[];
  estimatedCost?: number;
  humanApprovalGate?: boolean;
}

export interface AgentCoordinationRun {
  id: string;
  organizationId: string;
  title: string;
  agentExecutionPlans: AgentExecutionPlan[];
  dependenciesBetweenAgents: string[];
  executionOrder: string[];
  costEstimates: Record<string, number>;
  auditTrail: PlatformEngineeringAuditTrailItem[];
  humanApprovalRequired: true;
  executionMode: "PLANNING_ONLY";
  destructiveActionsExecuted: false;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface PlatformEngineeringAuditEvent {
  id: string;
  organizationId: string;
  platformEngineeringPlanId?: string;
  agentCoordinationRunId?: string;
  action: PlatformEngineeringAuditAction;
  actorId: string;
  beforeState?: PlatformEngineeringPlan | AgentCoordinationRun | PlatformHealthDiagnostics;
  afterState?: PlatformEngineeringPlan | AgentCoordinationRun | PlatformHealthDiagnostics;
  createdAt: string;
}

export interface CreateOptimizationPlanInput {
  title: string;
  riskLevel?: PlatformEngineeringRiskLevel;
  backendOptimizationRecommendations?: string[];
  databaseIndexOptimizationRecommendations?: string[];
  cacheRecommendations?: string[];
  dockerResourceRecommendations?: string[];
  aiCostOptimizationRecommendations?: string[];
  metadata?: Record<string, unknown>;
}

export interface CreateUpgradePlanInput {
  title: string;
  riskLevel: PlatformEngineeringRiskLevel;
  dependencyUpgradePlanMetadata?: Record<string, string>;
  nodePlan?: string;
  nestjsPlan?: string;
  nextjsPlan?: string;
  dockerPlan?: string;
  postgresqlPlan?: string;
  redisPlan?: string;
  rollbackPlan: string;
  metadata?: Record<string, unknown>;
}

export interface CreateBackupRestorePlanInput {
  title: string;
  riskLevel?: PlatformEngineeringRiskLevel;
  backupPlanRecords?: string[];
  restorePlanRecords?: string[];
  integrityChecks?: string[];
  metadata?: Record<string, unknown>;
}

export interface CreateHealingPlanInput {
  title: string;
  riskLevel?: PlatformEngineeringRiskLevel;
  restartRecommendations?: string[];
  recoveryRecommendations?: string[];
  serviceHealthRemediationPlans?: string[];
  metadata?: Record<string, unknown>;
}

export interface CreateAgentCoordinationRunInput {
  title: string;
  agentExecutionPlans?: AgentExecutionPlan[];
  dependenciesBetweenAgents?: string[];
  executionOrder?: string[];
  costEstimates?: Record<string, number>;
  metadata?: Record<string, unknown>;
}

export interface PlatformEngineeringRepository {
  createPlan(plan: PlatformEngineeringPlan): Promise<PlatformEngineeringPlan>;
  updatePlan(plan: PlatformEngineeringPlan): Promise<PlatformEngineeringPlan>;
  findPlanById(id: string, organizationId: string): Promise<PlatformEngineeringPlan | null>;
  createAgentCoordinationRun(run: AgentCoordinationRun): Promise<AgentCoordinationRun>;
  appendAuditEvent(event: PlatformEngineeringAuditEvent): Promise<void>;
}
