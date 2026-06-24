import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type ComplianceRecord,
  type PolicyAuditEvent,
  type PolicyDefinition,
  type PolicyEngineRepository,
  type PolicyEvaluation,
  type PolicyExceptionRequest
} from "./policy-engine.types";

@Injectable()
export class DatabasePolicyEngineRepository implements PolicyEngineRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createPolicy(policy: PolicyDefinition): Promise<PolicyDefinition> {
    return this.database.insert("policy_definitions", policy);
  }

  async updatePolicy(policy: PolicyDefinition): Promise<PolicyDefinition> {
    return this.database.upsert("policy_definitions", policy);
  }

  async findPolicyById(id: string, organizationId: string): Promise<PolicyDefinition | null> {
    return this.database.findByIdForTenant<PolicyDefinition>("policy_definitions", id, organizationId);
  }

  async listPolicies(organizationId: string): Promise<PolicyDefinition[]> {
    return this.database.selectForTenant<PolicyDefinition>("policy_definitions", organizationId);
  }

  async createEvaluation(evaluation: PolicyEvaluation): Promise<PolicyEvaluation> {
    return this.database.insert("policy_evaluations", evaluation);
  }

  async findEvaluationById(id: string, organizationId: string): Promise<PolicyEvaluation | null> {
    return this.database.findByIdForTenant<PolicyEvaluation>("policy_evaluations", id, organizationId);
  }

  async listEvaluations(organizationId: string): Promise<PolicyEvaluation[]> {
    return this.database.selectForTenant<PolicyEvaluation>("policy_evaluations", organizationId);
  }

  async createExceptionRequest(
    request: PolicyExceptionRequest
  ): Promise<PolicyExceptionRequest> {
    return this.database.insert("policy_exception_requests", request);
  }

  async updateExceptionRequest(
    request: PolicyExceptionRequest
  ): Promise<PolicyExceptionRequest> {
    return this.database.upsert("policy_exception_requests", request);
  }

  async findExceptionRequestById(
    id: string,
    organizationId: string
  ): Promise<PolicyExceptionRequest | null> {
    return this.database.findByIdForTenant<PolicyExceptionRequest>(
      "policy_exception_requests",
      id,
      organizationId
    );
  }

  async createComplianceRecord(record: ComplianceRecord): Promise<ComplianceRecord> {
    return this.database.insert("compliance_records", record);
  }

  async appendAuditEvent(event: PolicyAuditEvent): Promise<void> {
    this.database.insert("policy_audit_events", event);
  }

  async listAuditEvents(organizationId: string): Promise<PolicyAuditEvent[]> {
    return this.database.selectForTenant<PolicyAuditEvent>("policy_audit_events", organizationId);
  }
}
