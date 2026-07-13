import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabasePolicyEngineRepository } from "./policy-engine.repository";
import {
  type ComplianceRecord,
  type ComplianceRuleSet,
  type CreatePolicyExceptionInput,
  type CreatePolicyInput,
  type EvaluatePolicyInput,
  type PolicyAuditAction,
  type PolicyAuditEvent,
  type PolicyDefinition,
  type PolicyEngineActor,
  type PolicyEvaluation,
  type PolicyEvaluationStatus,
  type PolicyExceptionDecisionInput,
  type PolicyExceptionRequest
} from "./policy-engine.types";

const COMPLIANCE_RULES: ComplianceRuleSet = {
  humanFinalAuthorityMandatory: true,
  noPermanentDeletion: true,
  originalSourcePreservationMandatory: true,
  auditTrailMandatory: true,
  versionHistoryMandatory: true,
  aiCannotApprovePublications: true,
  aiCannotApproveBudgets: true,
  aiCannotRevokeUsersAutomatically: true,
  aiCannotAlterCitationsAutomatically: true,
  aiCannotModifyValidatedResearch: true
};

@Injectable()
export class PolicyEngineService {
  constructor(private readonly repository: DatabasePolicyEngineRepository) {}

  async listPolicies(actor: PolicyEngineActor): Promise<PolicyDefinition[]> {
    this.assertAdminActor(actor);
    return this.repository.listPolicies(actor.organizationId);
  }

  async createPolicy(actor: PolicyEngineActor, input: CreatePolicyInput): Promise<PolicyDefinition> {
    this.assertAdminActor(actor);
    this.validateRequired(input.name, "name");
    this.validateRequired(input.category, "category");
    this.validateRequired(input.description, "description");
    this.validateRequired(input.version, "version");

    const status = input.status ?? "DRAFT";

    if (status === "ACTIVE" && input.aiInitiatedActivation) {
      throw new BadRequestException("AI cannot activate policies.");
    }

    const now = new Date().toISOString();
    const policy: PolicyDefinition = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      name: input.name,
      category: input.category,
      description: input.description,
      version: input.version,
      status,
      effectiveFrom: input.effectiveFrom ?? now,
      effectiveUntil: input.effectiveUntil,
      createdBy: actor.userId,
      approvedBy: status === "ACTIVE" ? actor.userId : undefined,
      approvedAt: status === "ACTIVE" ? now : undefined,
      humanApprovalRequired: true,
      aiMaySuggest: input.aiMaySuggest ?? true,
      aiMayEnforce: false,
      complianceRules: COMPLIANCE_RULES,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createPolicy(policy);
    await this.audit(
      status === "ACTIVE" ? "POLICY_ACTIVATED" : "POLICY_CREATED",
      actor,
      { policyId: created.id },
      created
    );

    return created;
  }

  async listEvaluations(actor: PolicyEngineActor): Promise<PolicyEvaluation[]> {
    this.assertAdminActor(actor);
    return this.repository.listEvaluations(actor.organizationId);
  }

  async evaluatePolicy(
    actor: PolicyEngineActor,
    input: EvaluatePolicyInput
  ): Promise<PolicyEvaluation> {
    this.assertAdminActor(actor);
    this.validateRequired(input.scope, "scope");

    if (input.policyId) {
      await this.requirePolicy(actor, input.policyId);
    }

    const findings = this.evaluateFindings(input);
    const status = this.statusForFindings(findings, input);
    const evaluation: PolicyEvaluation = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      policyId: input.policyId,
      scope: input.scope,
      moduleName: input.moduleName,
      projectId: input.projectId,
      aiExecutionId: input.aiExecutionId,
      publicationId: input.publicationId,
      status,
      findings,
      evaluatedRules: COMPLIANCE_RULES,
      humanFinalAuthorityRequired: true,
      aiMaySummarizeCompliance: true,
      aiMayDetectRisks: true,
      aiMayEnforce: false,
      createdBy: actor.userId,
      createdAt: new Date().toISOString(),
      metadata: input.metadata
    };

    const created = await this.repository.createEvaluation(evaluation);
    await this.audit("POLICY_EVALUATED", actor, { evaluationId: created.id }, created);
    await this.createComplianceRecord(actor, created);

    return created;
  }

  async createExceptionRequest(
    actor: PolicyEngineActor,
    input: CreatePolicyExceptionInput
  ): Promise<PolicyExceptionRequest> {
    this.assertAdminActor(actor);
    this.validateRequired(input.justification, "justification");
    this.validateRequired(input.expirationDate, "expirationDate");

    if (input.policyId) {
      await this.requirePolicy(actor, input.policyId);
    }

    if (input.evaluationId) {
      await this.requireEvaluation(actor, input.evaluationId);
    }

    const now = new Date().toISOString();
    const request: PolicyExceptionRequest = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      policyId: input.policyId,
      evaluationId: input.evaluationId,
      justification: input.justification,
      status: "PENDING_HUMAN_APPROVAL",
      requestedBy: actor.userId,
      expirationDate: input.expirationDate,
      humanApprovalRequired: true,
      aiRequested: input.aiRequested ?? false,
      aiApprovalAttempt: input.aiApprovalAttempt ?? false,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createExceptionRequest(request);
    await this.audit(
      "POLICY_EXCEPTION_REQUESTED",
      actor,
      { exceptionRequestId: created.id },
      created
    );

    return created;
  }

  async approveException(
    actor: PolicyEngineActor,
    id: string,
    input: PolicyExceptionDecisionInput = {}
  ): Promise<PolicyExceptionRequest> {
    this.assertAdminActor(actor);

    if (input.aiInitiatedApproval) {
      throw new BadRequestException("AI cannot approve policy exceptions.");
    }

    const existing = await this.requireExceptionRequest(actor, id);

    if (existing.aiApprovalAttempt) {
      throw new BadRequestException("AI approval attempts cannot approve policy exceptions.");
    }

    const now = new Date().toISOString();
    const approved: PolicyExceptionRequest = {
      ...existing,
      status: "APPROVED",
      approver: actor.userId,
      approvedAt: now,
      updatedAt: now,
      metadata: {
        ...(existing.metadata ?? {}),
        ...(input.metadata ?? {}),
        finalAuthority: "AUTHORIZED_HUMAN"
      }
    };

    const saved = await this.repository.updateExceptionRequest(approved);
    await this.audit(
      "POLICY_EXCEPTION_APPROVED",
      actor,
      { exceptionRequestId: saved.id },
      saved,
      existing
    );

    return saved;
  }

  async rejectException(
    actor: PolicyEngineActor,
    id: string,
    input: PolicyExceptionDecisionInput = {}
  ): Promise<PolicyExceptionRequest> {
    this.assertAdminActor(actor);
    const existing = await this.requireExceptionRequest(actor, id);
    const now = new Date().toISOString();
    const rejected: PolicyExceptionRequest = {
      ...existing,
      status: "REJECTED",
      rejectedBy: actor.userId,
      rejectedAt: now,
      rejectionReason: input.reason,
      updatedAt: now,
      metadata: {
        ...(existing.metadata ?? {}),
        ...(input.metadata ?? {}),
        finalAuthority: "AUTHORIZED_HUMAN"
      }
    };

    const saved = await this.repository.updateExceptionRequest(rejected);
    await this.audit(
      "POLICY_EXCEPTION_REJECTED",
      actor,
      { exceptionRequestId: saved.id },
      saved,
      existing
    );

    return saved;
  }

  async listAudit(actor: PolicyEngineActor): Promise<PolicyAuditEvent[]> {
    this.assertAdminActor(actor);
    return this.repository.listAuditEvents(actor.organizationId);
  }

  private async createComplianceRecord(
    actor: PolicyEngineActor,
    evaluation: PolicyEvaluation
  ): Promise<ComplianceRecord> {
    const record: ComplianceRecord = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      evaluationId: evaluation.id,
      policyId: evaluation.policyId,
      scope: evaluation.scope,
      status: evaluation.status,
      findings: evaluation.findings,
      humanFinalAuthorityRequired: true,
      auditTrailRequired: true,
      versionHistoryRequired: true,
      createdBy: actor.userId,
      createdAt: new Date().toISOString(),
      metadata: {
        metadataOnly: true,
        externalComplianceProvider: "NOT_CONFIGURED"
      }
    };

    const created = await this.repository.createComplianceRecord(record);
    await this.audit(
      "COMPLIANCE_RECORD_CREATED",
      actor,
      { complianceRecordId: created.id, evaluationId: evaluation.id },
      created
    );

    return created;
  }

  private evaluateFindings(input: EvaluatePolicyInput): string[] {
    const checks = input.checks ?? {};
    const findings: string[] = [];

    if (checks.humanFinalAuthorityPresent === false) {
      findings.push("Human Final Authority is missing.");
    }

    if (checks.permanentDeletionAllowed === true) {
      findings.push("Permanent deletion is not allowed.");
    }

    if (checks.originalSourcePreserved === false) {
      findings.push("Original source preservation is missing.");
    }

    if (checks.auditTrailPresent === false) {
      findings.push("Audit trail is missing.");
    }

    if (checks.versionHistoryPresent === false) {
      findings.push("Version history is missing.");
    }

    if (checks.aiApprovesPublication === true) {
      findings.push("AI cannot approve publications.");
    }

    if (checks.aiApprovesBudget === true) {
      findings.push("AI cannot approve budgets.");
    }

    if (checks.aiRevokesUsersAutomatically === true) {
      findings.push("AI cannot revoke users automatically.");
    }

    if (checks.aiAltersCitationsAutomatically === true) {
      findings.push("AI cannot alter citations automatically.");
    }

    if (checks.aiModifiesValidatedResearch === true) {
      findings.push("AI cannot modify validated research.");
    }

    return findings;
  }

  private statusForFindings(
    findings: string[],
    input: EvaluatePolicyInput
  ): PolicyEvaluationStatus {
    if (findings.some((finding) => finding.startsWith("AI cannot"))) {
      return "NON_COMPLIANT";
    }

    if (
      findings.some(
        (finding) =>
          finding.includes("Human Final Authority") ||
          finding.includes("Audit trail") ||
          finding.includes("Original source")
      )
    ) {
      return "MANUAL_REVIEW_REQUIRED";
    }

    if (findings.length > 0) {
      return "WARNING";
    }

    if (input.scope === "AI_EXECUTION" && input.checks === undefined) {
      return "MANUAL_REVIEW_REQUIRED";
    }

    return "COMPLIANT";
  }

  private async requirePolicy(actor: PolicyEngineActor, id: string): Promise<PolicyDefinition> {
    const policy = await this.repository.findPolicyById(id, actor.organizationId);

    if (!policy) {
      throw new NotFoundException("Policy not found.");
    }

    return policy;
  }

  private async requireEvaluation(actor: PolicyEngineActor, id: string): Promise<PolicyEvaluation> {
    const evaluation = await this.repository.findEvaluationById(id, actor.organizationId);

    if (!evaluation) {
      throw new NotFoundException("Policy evaluation not found.");
    }

    return evaluation;
  }

  private async requireExceptionRequest(
    actor: PolicyEngineActor,
    id: string
  ): Promise<PolicyExceptionRequest> {
    const request = await this.repository.findExceptionRequestById(id, actor.organizationId);

    if (!request) {
      throw new NotFoundException("Policy exception request not found.");
    }

    return request;
  }

  private async audit(
    action: PolicyAuditAction,
    actor: PolicyEngineActor,
    refs: {
      policyId?: string;
      evaluationId?: string;
      exceptionRequestId?: string;
      complianceRecordId?: string;
    },
    afterState?: object,
    beforeState?: object
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      actorId: actor.userId,
      action,
      ...refs,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private assertAdminActor(actor: PolicyEngineActor): void {
    if (!actor.roles.includes("PLATFORM_CREATOR") && !actor.roles.includes("ADMIN")) {
      throw new ForbiddenException("Policy engine endpoints require an authorized admin.");
    }
  }

  private validateRequired(value: unknown, fieldName: string): void {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new BadRequestException(`${fieldName} is required.`);
    }
  }
}
