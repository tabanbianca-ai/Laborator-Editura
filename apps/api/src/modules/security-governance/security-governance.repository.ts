import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type SecurityAccessReview,
  type SecurityApiKeyEvent,
  type SecurityAuditEvent,
  type SecurityGovernanceRepository,
  type SecurityPolicy,
  type SecurityPolicyViolation,
  type SecuritySessionEvent
} from "./security-governance.types";

@Injectable()
export class DatabaseSecurityGovernanceRepository implements SecurityGovernanceRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createPolicy(policy: SecurityPolicy): Promise<SecurityPolicy> {
    return this.database.insert("security_policies", policy);
  }

  async listPolicies(organizationId: string): Promise<SecurityPolicy[]> {
    return this.database.selectForTenant<SecurityPolicy>("security_policies", organizationId);
  }

  async createAccessReview(review: SecurityAccessReview): Promise<SecurityAccessReview> {
    return this.database.insert("security_access_reviews", review);
  }

  async listAccessReviews(organizationId: string): Promise<SecurityAccessReview[]> {
    return this.database.selectForTenant<SecurityAccessReview>("security_access_reviews", organizationId);
  }

  async createSessionEvent(event: SecuritySessionEvent): Promise<SecuritySessionEvent> {
    return this.database.insert("security_session_events", event);
  }

  async listSessionEvents(organizationId: string): Promise<SecuritySessionEvent[]> {
    return this.database.selectForTenant<SecuritySessionEvent>("security_session_events", organizationId);
  }

  async createApiKeyEvent(event: SecurityApiKeyEvent): Promise<SecurityApiKeyEvent> {
    return this.database.insert("security_api_key_events", event);
  }

  async listApiKeyEvents(organizationId: string): Promise<SecurityApiKeyEvent[]> {
    return this.database.selectForTenant<SecurityApiKeyEvent>("security_api_key_events", organizationId);
  }

  async createPolicyViolation(violation: SecurityPolicyViolation): Promise<SecurityPolicyViolation> {
    return this.database.insert("security_policy_violations", violation);
  }

  async listPolicyViolations(organizationId: string): Promise<SecurityPolicyViolation[]> {
    return this.database.selectForTenant<SecurityPolicyViolation>(
      "security_policy_violations",
      organizationId
    );
  }

  async appendAuditEvent(event: SecurityAuditEvent): Promise<void> {
    this.database.insert("security_audit_events", event);
  }

  async listAuditEvents(organizationId: string): Promise<SecurityAuditEvent[]> {
    return this.database.selectForTenant<SecurityAuditEvent>("security_audit_events", organizationId);
  }
}
