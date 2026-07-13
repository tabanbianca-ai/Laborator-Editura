import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { DatabaseSecurityGovernanceRepository } from "./security-governance.repository";
import {
  type CreateSecurityAccessReviewInput,
  type CreateSecurityEventInput,
  type CreateSecurityPolicyInput,
  type RevokeSessionInput,
  type SecurityAccessReview,
  type SecurityApiKeyEvent,
  type SecurityAuditAction,
  type SecurityAuditEvent,
  type SecurityEventsSummary,
  type SecurityGovernanceActor,
  type SecurityPolicy,
  type SecurityPolicyViolation,
  type SecuritySessionEvent
} from "./security-governance.types";

@Injectable()
export class SecurityGovernanceService {
  constructor(private readonly repository: DatabaseSecurityGovernanceRepository) {}

  async listPolicies(actor: SecurityGovernanceActor): Promise<SecurityPolicy[]> {
    this.assertAdminActor(actor);
    return this.repository.listPolicies(actor.organizationId);
  }

  async createPolicy(
    actor: SecurityGovernanceActor,
    input: CreateSecurityPolicyInput
  ): Promise<SecurityPolicy> {
    this.assertAdminActor(actor);
    this.validateRequired(input.name, "name");

    if (input.aiInitiatedPolicyChange) {
      throw new BadRequestException("AI cannot change security policy automatically.");
    }

    const now = new Date().toISOString();
    const policy: SecurityPolicy = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      policyType: input.policyType,
      name: input.name,
      description: input.description,
      status: input.status ?? "DRAFT",
      passwordLoginPolicy: input.passwordLoginPolicy,
      sessionDurationPolicy: input.sessionDurationPolicy,
      apiKeyPolicy: input.apiKeyPolicy,
      webhookSecurityPolicy: input.webhookSecurityPolicy,
      allowedDomains: input.allowedDomains ?? [],
      ipAllowlist: input.ipAllowlist ?? [],
      ipBlocklist: input.ipBlocklist ?? [],
      mfaRequirementPlaceholder: input.mfaRequirementPlaceholder ?? true,
      rolePermissionMatrix: input.rolePermissionMatrix ?? {},
      organizationAccessPolicy: input.organizationAccessPolicy,
      tenantIsolationChecks: input.tenantIsolationChecks ?? ["server-derived-organization-context"],
      humanApprovalRequired: true,
      aiMayDetectRisks: true,
      aiMaySuggestPolicyChanges: true,
      aiMayChangePolicyAutomatically: false,
      aiSuggested: input.aiSuggested ?? false,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createPolicy(policy);
    await this.audit("SECURITY_POLICY_CREATED", actor, { policyId: created.id }, created);

    return created;
  }

  async listAccessReviews(actor: SecurityGovernanceActor): Promise<SecurityAccessReview[]> {
    this.assertAdminActor(actor);
    return this.repository.listAccessReviews(actor.organizationId);
  }

  async createAccessReview(
    actor: SecurityGovernanceActor,
    input: CreateSecurityAccessReviewInput
  ): Promise<SecurityAccessReview> {
    this.assertAdminActor(actor);
    this.validateRequired(input.reviewName, "reviewName");

    if (input.aiInitiatedApproval) {
      throw new BadRequestException("AI cannot approve access reviews automatically.");
    }

    const now = new Date().toISOString();
    const review: SecurityAccessReview = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      reviewName: input.reviewName,
      reviewedUserId: input.reviewedUserId,
      reviewedRoles: input.reviewedRoles ?? [],
      reviewedPermissions: input.reviewedPermissions ?? [],
      rolePermissionMatrix: input.rolePermissionMatrix ?? {},
      accessFindings: input.accessFindings ?? [],
      tenantIsolationChecks: input.tenantIsolationChecks ?? ["tenant-isolation-reviewed"],
      status: "PENDING_HUMAN_REVIEW",
      humanApprovalRequired: true,
      aiMaySummarizeAccessReviews: true,
      aiMayApproveAccessReviewAutomatically: false,
      createdBy: actor.userId,
      createdAt: now,
      updatedAt: now,
      metadata: input.metadata
    };

    const created = await this.repository.createAccessReview(review);
    await this.audit(
      "SECURITY_ACCESS_REVIEW_CREATED",
      actor,
      { accessReviewId: created.id },
      created
    );

    return created;
  }

  async listSecurityEvents(actor: SecurityGovernanceActor): Promise<SecurityEventsSummary> {
    this.assertAdminActor(actor);
    const [sessionEvents, apiKeyEvents, policyViolations] = await Promise.all([
      this.repository.listSessionEvents(actor.organizationId),
      this.repository.listApiKeyEvents(actor.organizationId),
      this.repository.listPolicyViolations(actor.organizationId)
    ]);

    return { sessionEvents, apiKeyEvents, policyViolations };
  }

  async createSecurityEvent(
    actor: SecurityGovernanceActor,
    input: CreateSecurityEventInput
  ): Promise<SecuritySessionEvent | SecurityApiKeyEvent | SecurityPolicyViolation> {
    this.assertAdminActor(actor);
    this.validateRequired(input.message, "message");

    if (input.eventType === "POLICY_VIOLATION" || input.category === "POLICY") {
      return this.recordPolicyViolation(actor, input);
    }

    if (input.category === "API_KEY" || input.eventType.startsWith("API_KEY_")) {
      return this.recordApiKeyEvent(actor, input);
    }

    return this.recordSessionEvent(actor, input);
  }

  async revokeSession(
    actor: SecurityGovernanceActor,
    sessionId: string,
    input: RevokeSessionInput = {}
  ): Promise<SecuritySessionEvent> {
    this.assertAdminActor(actor);
    this.validateRequired(sessionId, "sessionId");

    const created = await this.recordSessionEvent(actor, {
      category: "SESSION",
      eventType: "SESSION_REVOCATION_RECORDED",
      sessionId,
      message: input.reason ?? "Session revocation recorded for governance review.",
      severity: "HIGH",
      suspiciousFlags: input.suspiciousFlags ?? [],
      metadata: {
        ...(input.metadata ?? {}),
        existingAuthSessionNotModified: true,
        enforcementMode: "METADATA_ONLY"
      }
    });

    return created;
  }

  async listAudit(actor: SecurityGovernanceActor): Promise<SecurityAuditEvent[]> {
    this.assertAdminActor(actor);
    return this.repository.listAuditEvents(actor.organizationId);
  }

  private async recordSessionEvent(
    actor: SecurityGovernanceActor,
    input: CreateSecurityEventInput
  ): Promise<SecuritySessionEvent> {
    const event: SecuritySessionEvent = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      sessionId: input.sessionId,
      userId: input.userId,
      eventType: input.eventType,
      activeSessionMetadata: input.metadata,
      suspiciousFlags: input.suspiciousFlags ?? [],
      lastSeenAt: new Date().toISOString(),
      revocationRecorded: input.eventType === "SESSION_REVOCATION_RECORDED",
      revocationReason: input.eventType === "SESSION_REVOCATION_RECORDED" ? input.message : undefined,
      enforcementMode: "METADATA_ONLY",
      message: input.message,
      severity: input.severity ?? "MEDIUM",
      createdBy: actor.userId,
      createdAt: new Date().toISOString(),
      metadata: input.metadata
    };

    const created = await this.repository.createSessionEvent(event);
    await this.audit(
      input.eventType === "SESSION_REVOCATION_RECORDED"
        ? "SECURITY_SESSION_REVOCATION_RECORDED"
        : "SECURITY_SESSION_EVENT_RECORDED",
      actor,
      { sessionEventId: created.id },
      created
    );

    return created;
  }

  private async recordApiKeyEvent(
    actor: SecurityGovernanceActor,
    input: CreateSecurityEventInput
  ): Promise<SecurityApiKeyEvent> {
    const event: SecurityApiKeyEvent = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      apiKeyId: input.apiKeyId,
      eventType: input.eventType,
      usagePolicyMetadata: input.usagePolicyMetadata,
      scopeValidationMetadata: input.scopeValidationMetadata,
      expirationPolicyMetadata: input.expirationPolicyMetadata,
      revocationAuditMetadata: input.revocationAuditMetadata,
      message: input.message,
      severity: input.severity ?? "MEDIUM",
      createdBy: actor.userId,
      createdAt: new Date().toISOString(),
      metadata: input.metadata
    };

    const created = await this.repository.createApiKeyEvent(event);
    await this.audit("SECURITY_API_KEY_EVENT_RECORDED", actor, { apiKeyEventId: created.id }, created);

    return created;
  }

  private async recordPolicyViolation(
    actor: SecurityGovernanceActor,
    input: CreateSecurityEventInput
  ): Promise<SecurityPolicyViolation> {
    const violation: SecurityPolicyViolation = {
      id: randomUUID(),
      organizationId: actor.organizationId,
      policyId: input.policyId,
      eventType: "POLICY_VIOLATION",
      violationType: input.violationType ?? "UNCLASSIFIED_POLICY_VIOLATION",
      message: input.message,
      severity: input.severity ?? "HIGH",
      requestPath: input.requestPath,
      userId: input.userId,
      suspiciousActivityMetadata: input.suspiciousActivityMetadata,
      enforcementMode: "METADATA_ONLY",
      resolved: false,
      createdBy: actor.userId,
      createdAt: new Date().toISOString(),
      metadata: input.metadata
    };

    const created = await this.repository.createPolicyViolation(violation);
    await this.audit(
      "SECURITY_POLICY_VIOLATION_RECORDED",
      actor,
      { policyViolationId: created.id },
      created
    );

    return created;
  }

  private async audit(
    action: SecurityAuditAction,
    actor: SecurityGovernanceActor,
    target: {
      policyId?: string;
      accessReviewId?: string;
      sessionEventId?: string;
      apiKeyEventId?: string;
      policyViolationId?: string;
    },
    afterState: object
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      ...target,
      action,
      actorId: actor.userId,
      afterState,
      humanFinalAuthority: true,
      createdAt: new Date().toISOString()
    });
  }

  private assertAdminActor(actor: SecurityGovernanceActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("Authenticated security governance context is required.");
    }

    const roles = new Set((actor.roles ?? []).map((role) => role.toUpperCase()));

    if (!roles.has("PLATFORM_CREATOR") && !roles.has("ADMIN")) {
      throw new ForbiddenException("Security governance endpoints require an authorized admin.");
    }
  }

  private validateRequired(value: string | undefined, fieldName: string): void {
    if (!value) {
      throw new BadRequestException(`${fieldName} is required.`);
    }
  }
}
