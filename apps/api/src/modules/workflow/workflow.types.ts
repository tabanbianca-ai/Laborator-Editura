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
  | "DOCUMENT_APPROVED"
  | "READY_FOR_EXPORT"
  | "DOCUMENT_EXPORTED";

export interface WorkflowActor {
  userId: string;
  organizationId: string;
  roles?: string[];
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
