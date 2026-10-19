export type WorkflowScope = "DOCUMENT" | "SEGMENT";

export type WorkflowStatus =
  | "DRAFT"
  | "IN_TRANSLATION"
  | "IN_QA"
  | "IN_SEMANTIC_REVIEW"
  | "IN_REVIEW"
  | "APPROVED"
  | "READY_FOR_EXPORT"
  | "EXPORTED"
  | "BLOCKED";

export type WorkflowAuditAction =
  | "WORKFLOW_STARTED"
  | "WORKFLOW_ADVANCED"
  | "WORKFLOW_BLOCKED"
  | "WORKFLOW_UNBLOCKED"
  | "EDITORIAL_REVIEW_COMPLETED"
  | "DOCUMENT_APPROVED"
  | "READY_FOR_EXPORT"
  | "DOCUMENT_EXPORTED";

export interface WorkflowActor {
  userId: string;
  organizationId: string;
  roles?: string[];
  permissions?: string[];
  canonicalPermissions?: string[];
}

export interface CompleteEditorialReviewInput extends WorkflowTargetInput {
  editorialDecisionId: string;
  outcome: "ACCEPTED_CORRECTION" | "NO_CHANGES_REQUIRED";
}

export interface WorkflowTargetInput {
  projectId?: string;
  documentId: string;
  segmentId?: string;
}

export interface StartWorkflowInput extends WorkflowTargetInput {
  scope?: WorkflowScope;
  metadata?: Record<string, unknown>;
}

export interface AdvanceWorkflowInput extends WorkflowTargetInput {
  toStatus?: WorkflowStatus;
  reason?: string;
}

export interface BlockWorkflowInput extends WorkflowTargetInput {
  reason: string;
}

export interface UnblockWorkflowInput extends WorkflowTargetInput {
  reason?: string;
}

export interface WorkflowState {
  id: string;
  organizationId: string;
  projectId?: string;
  documentId: string;
  segmentId?: string;
  scope: WorkflowScope;
  status: WorkflowStatus;
  previousStatus?: WorkflowStatus;
  blockedReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  exportedBy?: string;
  exportedAt?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface WorkflowTransition {
  id: string;
  organizationId: string;
  workflowStateId: string;
  projectId?: string;
  documentId: string;
  segmentId?: string;
  scope: WorkflowScope;
  fromStatus?: WorkflowStatus;
  toStatus: WorkflowStatus;
  action: WorkflowAuditAction;
  reason?: string;
  actorId: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface WorkflowAuditEvent {
  id: string;
  organizationId: string;
  workflowStateId?: string;
  workflowTransitionId?: string;
  action: WorkflowAuditAction;
  actorId: string;
  beforeState?: WorkflowState;
  afterState?: WorkflowState;
  createdAt: string;
}

export interface WorkflowRepository {
  createState(state: WorkflowState): Promise<WorkflowState>;
  updateState(state: WorkflowState): Promise<WorkflowState>;
  findStateByTarget(input: WorkflowTargetInput & { organizationId: string }): Promise<WorkflowState | null>;
  appendTransition(transition: WorkflowTransition): Promise<WorkflowTransition>;
  appendAuditEvent(event: WorkflowAuditEvent): Promise<void>;
}

export type WorkflowDefinitionStatus = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";
export type WorkflowVersionStatus = "DRAFT" | "ACTIVE" | "RETIRED";
export type ConfigurableWorkflowInstanceStatus = "RUNNING" | "BLOCKED" | "COMPLETED";
export type WorkflowApprovalStatus = "GRANTED" | "REJECTED";
export type WorkflowRuleOperator =
  | "EQUALS"
  | "NOT_EQUALS"
  | "IN"
  | "NOT_IN"
  | "EXISTS"
  | "GREATER_THAN_OR_EQUAL"
  | "LESS_THAN_OR_EQUAL";

export interface WorkflowRuleCondition {
  fact: string;
  operator: WorkflowRuleOperator;
  value?: unknown;
}

export interface WorkflowRulePredicate {
  all?: WorkflowRulePredicate[];
  any?: WorkflowRulePredicate[];
  condition?: WorkflowRuleCondition;
  not?: WorkflowRulePredicate;
}

export interface WorkflowRuleEffect {
  outcome: "ALLOW" | "BLOCK" | "REQUIRE_APPROVAL";
  reason?: string;
  requiredRoles?: string[];
}

export interface WorkflowIfThenRule {
  id: string;
  name: string;
  if: WorkflowRulePredicate;
  then: WorkflowRuleEffect;
  else?: WorkflowRuleEffect;
}

export interface WorkflowApprovalRequirement {
  minimumApprovals: number;
  required: boolean;
  roles: string[];
}

export interface WorkflowStageDefinition {
  id: string;
  name: string;
  order: number;
  initial?: boolean;
  final?: boolean;
  responsibleRoles: string[];
  approval?: WorkflowApprovalRequirement;
  metadata?: Record<string, unknown>;
}

export interface WorkflowTransitionDefinition {
  id: string;
  action: string;
  fromStageId: string;
  toStageId: string;
  allowedRoles: string[];
  rules: WorkflowIfThenRule[];
  metadata?: Record<string, unknown>;
}

export interface WorkflowDefinition {
  id: string;
  organizationId: string;
  key: string;
  name: string;
  description?: string;
  category: string;
  status: WorkflowDefinitionStatus;
  currentVersionId?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface WorkflowVersion {
  id: string;
  organizationId: string;
  workflowDefinitionId: string;
  version: number;
  status: WorkflowVersionStatus;
  stages: WorkflowStageDefinition[];
  transitions: WorkflowTransitionDefinition[];
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface ConfigurableWorkflowInstance {
  id: string;
  organizationId: string;
  workflowDefinitionId: string;
  workflowVersionId: string;
  projectId?: string;
  documentId?: string;
  scopeType: "PROJECT" | "DOCUMENT" | "SEGMENT";
  scopeId: string;
  currentStageId: string;
  status: ConfigurableWorkflowInstanceStatus;
  startedBy: string;
  startedAt: string;
  updatedBy: string;
  updatedAt: string;
  completedAt?: string;
  blockedReason?: string;
  metadata?: Record<string, unknown>;
}

export interface ConfigurableWorkflowTransition {
  id: string;
  organizationId: string;
  workflowInstanceId: string;
  workflowVersionId: string;
  transitionDefinitionId: string;
  action: string;
  fromStageId: string;
  toStageId: string;
  actorId: string;
  createdAt: string;
  evaluatedRules: Array<{
    ruleId: string;
    outcome: WorkflowRuleEffect["outcome"];
  }>;
}

export interface WorkflowApprovalRecord {
  id: string;
  organizationId: string;
  workflowInstanceId: string;
  workflowVersionId: string;
  stageId: string;
  status: WorkflowApprovalStatus;
  actorId: string;
  actorRoles: string[];
  reason?: string;
  createdAt: string;
}

export type WorkflowConfigurationAuditAction =
  | "WORKFLOW_DEFINITION_CREATED"
  | "WORKFLOW_VERSION_CREATED"
  | "WORKFLOW_VERSION_ACTIVATED"
  | "CONFIGURABLE_WORKFLOW_STARTED"
  | "CONFIGURABLE_TRANSITION_EXECUTED"
  | "WORKFLOW_APPROVAL_GRANTED"
  | "WORKFLOW_APPROVAL_REJECTED";

export interface WorkflowConfigurationAuditEvent {
  id: string;
  organizationId: string;
  action: WorkflowConfigurationAuditAction;
  actorId: string;
  entityId: string;
  entityType: "DEFINITION" | "VERSION" | "INSTANCE" | "APPROVAL";
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface CreateWorkflowDefinitionInput {
  key: string;
  name: string;
  description?: string;
  category: string;
}

export interface CreateWorkflowVersionInput {
  stages: WorkflowStageDefinition[];
  transitions: WorkflowTransitionDefinition[];
}

export interface StartConfigurableWorkflowInput {
  workflowDefinitionId: string;
  workflowVersionId?: string;
  projectId?: string;
  documentId?: string;
  scopeType: ConfigurableWorkflowInstance["scopeType"];
  scopeId: string;
  metadata?: Record<string, unknown>;
}

export interface TransitionConfigurableWorkflowInput {
  transitionId: string;
  context?: Record<string, unknown>;
}

export interface RecordWorkflowApprovalInput {
  decision: WorkflowApprovalStatus;
  reason?: string;
}
