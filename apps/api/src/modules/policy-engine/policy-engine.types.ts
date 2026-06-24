import { type AuthenticatedRequestContext } from "../auth/request-context.types";

export type PolicyEngineActor = AuthenticatedRequestContext;

export type PolicyCategory =
  | "EDITORIAL"
  | "TRANSLATION"
  | "AI_GOVERNANCE"
  | "SECURITY"
  | "PUBLISHING"
  | "COMMERCE"
  | "RESEARCH"
  | "LIBRARY"
  | "COMMUNITY_MODERATION"
  | "BACKUP_RETENTION";

export type PolicyStatus = "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";

export type PolicyEvaluationScope =
  | "MODULE"
  | "PROJECT"
  | "AI_EXECUTION"
  | "PUBLICATION";

export type PolicyEvaluationStatus =
  | "COMPLIANT"
  | "WARNING"
  | "NON_COMPLIANT"
  | "MANUAL_REVIEW_REQUIRED";

export type PolicyExceptionStatus =
  | "PENDING_HUMAN_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED";

export type PolicyAuditAction =
  | "POLICY_CREATED"
  | "POLICY_ACTIVATED"
  | "POLICY_EVALUATED"
  | "POLICY_EXCEPTION_REQUESTED"
  | "POLICY_EXCEPTION_APPROVED"
  | "POLICY_EXCEPTION_REJECTED"
  | "COMPLIANCE_RECORD_CREATED";

export interface ComplianceRuleSet {
  humanFinalAuthorityMandatory: true;
  noPermanentDeletion: true;
  originalSourcePreservationMandatory: true;
  auditTrailMandatory: true;
  versionHistoryMandatory: true;
  aiCannotApprovePublications: true;
  aiCannotApproveBudgets: true;
  aiCannotRevokeUsersAutomatically: true;
  aiCannotAlterCitationsAutomatically: true;
  aiCannotModifyValidatedResearch: true;
}

export interface PolicyDefinition {
  id: string;
  organizationId: string;
  name: string;
  category: PolicyCategory;
  description: string;
  version: string;
  status: PolicyStatus;
  effectiveFrom: string;
  effectiveUntil?: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  humanApprovalRequired: true;
  aiMaySuggest: boolean;
  aiMayEnforce: false;
  complianceRules: ComplianceRuleSet;
  createdAt: string;
  updatedAt: string;
  metadata?: object;
}

export interface PolicyEvaluation {
  id: string;
  organizationId: string;
  policyId?: string;
  scope: PolicyEvaluationScope;
  moduleName?: string;
  projectId?: string;
  aiExecutionId?: string;
  publicationId?: string;
  status: PolicyEvaluationStatus;
  findings: string[];
  evaluatedRules: ComplianceRuleSet;
  humanFinalAuthorityRequired: true;
  aiMaySummarizeCompliance: true;
  aiMayDetectRisks: true;
  aiMayEnforce: false;
  createdBy: string;
  createdAt: string;
  metadata?: object;
}

export interface PolicyExceptionRequest {
  id: string;
  organizationId: string;
  policyId?: string;
  evaluationId?: string;
  justification: string;
  status: PolicyExceptionStatus;
  requestedBy: string;
  approver?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  expirationDate: string;
  humanApprovalRequired: true;
  aiRequested: boolean;
  aiApprovalAttempt: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: object;
}

export interface ComplianceRecord {
  id: string;
  organizationId: string;
  evaluationId: string;
  policyId?: string;
  scope: PolicyEvaluationScope;
  status: PolicyEvaluationStatus;
  findings: string[];
  humanFinalAuthorityRequired: true;
  auditTrailRequired: true;
  versionHistoryRequired: true;
  createdBy: string;
  createdAt: string;
  metadata?: object;
}

export interface PolicyAuditEvent {
  id: string;
  organizationId: string;
  actorId: string;
  action: PolicyAuditAction;
  policyId?: string;
  evaluationId?: string;
  exceptionRequestId?: string;
  complianceRecordId?: string;
  beforeState?: object;
  afterState?: object;
  createdAt: string;
}

export interface CreatePolicyInput {
  name: string;
  category: PolicyCategory;
  description: string;
  version: string;
  status?: PolicyStatus;
  effectiveFrom?: string;
  effectiveUntil?: string;
  aiMaySuggest?: boolean;
  aiInitiatedActivation?: boolean;
  metadata?: object;
}

export interface EvaluatePolicyInput {
  policyId?: string;
  scope: PolicyEvaluationScope;
  moduleName?: string;
  projectId?: string;
  aiExecutionId?: string;
  publicationId?: string;
  checks?: {
    humanFinalAuthorityPresent?: boolean;
    permanentDeletionAllowed?: boolean;
    originalSourcePreserved?: boolean;
    auditTrailPresent?: boolean;
    versionHistoryPresent?: boolean;
    aiApprovesPublication?: boolean;
    aiApprovesBudget?: boolean;
    aiRevokesUsersAutomatically?: boolean;
    aiAltersCitationsAutomatically?: boolean;
    aiModifiesValidatedResearch?: boolean;
  };
  metadata?: object;
}

export interface CreatePolicyExceptionInput {
  policyId?: string;
  evaluationId?: string;
  justification: string;
  expirationDate: string;
  aiRequested?: boolean;
  aiApprovalAttempt?: boolean;
  metadata?: object;
}

export interface PolicyExceptionDecisionInput {
  reason?: string;
  aiInitiatedApproval?: boolean;
  metadata?: object;
}

export interface PolicyEngineRepository {
  createPolicy(policy: PolicyDefinition): Promise<PolicyDefinition>;
  updatePolicy(policy: PolicyDefinition): Promise<PolicyDefinition>;
  findPolicyById(id: string, organizationId: string): Promise<PolicyDefinition | null>;
  listPolicies(organizationId: string): Promise<PolicyDefinition[]>;
  createEvaluation(evaluation: PolicyEvaluation): Promise<PolicyEvaluation>;
  findEvaluationById(id: string, organizationId: string): Promise<PolicyEvaluation | null>;
  listEvaluations(organizationId: string): Promise<PolicyEvaluation[]>;
  createExceptionRequest(request: PolicyExceptionRequest): Promise<PolicyExceptionRequest>;
  updateExceptionRequest(request: PolicyExceptionRequest): Promise<PolicyExceptionRequest>;
  findExceptionRequestById(id: string, organizationId: string): Promise<PolicyExceptionRequest | null>;
  createComplianceRecord(record: ComplianceRecord): Promise<ComplianceRecord>;
  appendAuditEvent(event: PolicyAuditEvent): Promise<void>;
  listAuditEvents(organizationId: string): Promise<PolicyAuditEvent[]>;
}
