import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type EditorialDecisionAuditEvent,
  type EditorialDecisionRecommendation,
  type EditorialDecisionRepository
} from "./editorial-decisions.types";

@Injectable()
export class DatabaseEditorialDecisionRepository implements EditorialDecisionRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createRecommendation(
    recommendation: EditorialDecisionRecommendation
  ): Promise<EditorialDecisionRecommendation> {
    return this.database.insert("editorial_decisions", recommendation);
  }

  async updateRecommendation(
    recommendation: EditorialDecisionRecommendation
  ): Promise<EditorialDecisionRecommendation> {
    return this.database.upsert("editorial_decisions", recommendation);
  }

  async findRecommendationById(
    id: string,
    organizationId: string
  ): Promise<EditorialDecisionRecommendation | null> {
    return this.database.findByIdForTenant<EditorialDecisionRecommendation>(
      "editorial_decisions",
      id,
      organizationId
    );
  }

  async listApprovedDecisions(input: {
    organizationId: string;
    sourceLanguage: string;
    targetLanguage: string;
    domain?: string;
  }): Promise<EditorialDecisionRecommendation[]> {
    return this.database.selectForTenant<EditorialDecisionRecommendation>(
      "editorial_decisions",
      input.organizationId,
      (decision) =>
        decision.approvalStatus === "APPROVED" &&
        decision.sourceLanguage === input.sourceLanguage &&
        decision.targetLanguage === input.targetLanguage &&
        (input.domain === undefined || decision.domain === input.domain)
    );
  }

  async appendAuditEvent(event: EditorialDecisionAuditEvent): Promise<void> {
    this.database.insert("editorial_decision_audit_events", event);
  }
}
