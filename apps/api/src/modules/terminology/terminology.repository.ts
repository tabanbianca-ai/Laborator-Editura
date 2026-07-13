import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type ProjectLinguisticSourcePriority,
  type SearchTerminologyInput,
  type TerminologyAuditEvent,
  type TerminologyRepository,
  type TerminologyTerm
} from "./terminology.types";
import { includesNormalized, sortTermsByAuthority } from "./terminology.utils";

@Injectable()
export class InMemoryTerminologyRepository implements TerminologyRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createTerm(term: TerminologyTerm): Promise<TerminologyTerm> {
    return this.database.insert("terminology_terms", term);
  }

  async updateTerm(term: TerminologyTerm): Promise<TerminologyTerm> {
    return this.database.upsert("terminology_terms", term);
  }

  async findTermById(id: string, organizationId: string): Promise<TerminologyTerm | null> {
    return this.database.findByIdForTenant<TerminologyTerm>(
      "terminology_terms",
      id,
      organizationId
    );
  }

  async searchTerms(
    input: SearchTerminologyInput & { organizationId: string }
  ): Promise<TerminologyTerm[]> {
    const matches = this.database
      .selectForTenant<TerminologyTerm>("terminology_terms", input.organizationId)
      .filter((term) => {
      const queryMatches =
        input.query === undefined ||
        input.query.length === 0 ||
        includesNormalized(term.term, input.query);

      return (
        term.language === input.language &&
        (input.domain === undefined || term.domain === input.domain) &&
        (input.projectId === undefined ||
          term.projectId === input.projectId ||
          term.glossaryScope === "PLATFORM" ||
          term.glossaryScope === "PERSONAL") &&
        (input.ownerUserId === undefined || term.ownerUserId === input.ownerUserId) &&
        (input.status === undefined || term.status === input.status) &&
        queryMatches
      );
    });

    return sortTermsByAuthority(matches).slice(0, input.limit ?? 50);
  }

  async listValidatedTerms(input: {
    organizationId: string;
    language: string;
    domain?: string;
    projectId?: string;
    ownerUserId?: string;
  }): Promise<TerminologyTerm[]> {
    return sortTermsByAuthority(
      this.database.selectForTenant<TerminologyTerm>(
        "terminology_terms",
        input.organizationId
      ).filter((term) => {
        return (
          term.language === input.language &&
          term.status === "VALIDATED" &&
          (input.domain === undefined || term.domain === input.domain) &&
          (input.projectId === undefined ||
            term.projectId === input.projectId ||
            term.glossaryScope === "PLATFORM" ||
            term.glossaryScope === "PERSONAL") &&
          (input.ownerUserId === undefined || term.ownerUserId === input.ownerUserId)
        );
      })
    );
  }

  async listTermsRequiringReview(organizationId: string): Promise<TerminologyTerm[]> {
    return sortTermsByAuthority(
      this.database.selectForTenant<TerminologyTerm>(
        "terminology_terms",
        organizationId
      ).filter((term) => {
        return (
          (term.status === "UNDER_REVIEW" ||
            term.status === "REJECTED" ||
            term.governanceDecisionStatus === "UNDER_REVIEW" ||
            term.governanceDecisionStatus === "REJECTED" ||
            term.qualityLevel === "REVIEW_REQUIRED" ||
            term.qualityLevel === "REJECTED" ||
            term.orthographicValidationStatus === "FAILED" ||
            term.diacriticsValidationStatus === "FAILED" ||
            term.sourceValidationStatus === "MISSING_APPROVED_SOURCE")
        );
      })
    );
  }

  async listTermsForGovernanceCheck(input: {
    organizationId: string;
    language: string;
    domain?: string;
    projectId?: string;
    ownerUserId?: string;
  }): Promise<TerminologyTerm[]> {
    return sortTermsByAuthority(
      this.database.selectForTenant<TerminologyTerm>(
        "terminology_terms",
        input.organizationId
      ).filter((term) => {
        return (
          term.language === input.language &&
          ["REJECTED", "VALIDATED"].includes(term.status) &&
          (input.domain === undefined || term.domain === input.domain) &&
          (input.projectId === undefined ||
            term.projectId === input.projectId ||
            term.glossaryScope === "PLATFORM" ||
            term.glossaryScope === "PERSONAL") &&
          (input.ownerUserId === undefined || term.ownerUserId === input.ownerUserId)
        );
      })
    );
  }

  async getSourcePriority(
    projectId: string,
    organizationId: string
  ): Promise<ProjectLinguisticSourcePriority | null> {
    return this.database
      .selectForTenant<ProjectLinguisticSourcePriority>(
        "linguistic_source_priorities",
        organizationId,
        (priority) => priority.projectId === projectId
      )[0] ?? null;
  }

  async upsertSourcePriority(
    priority: ProjectLinguisticSourcePriority
  ): Promise<ProjectLinguisticSourcePriority> {
    return this.database.upsert("linguistic_source_priorities", priority);
  }

  async appendAuditEvent(event: TerminologyAuditEvent): Promise<void> {
    this.database.insert("terminology_audit_events", event);
  }

  getAuditEvents(): TerminologyAuditEvent[] {
    return this.database.select<TerminologyAuditEvent>("terminology_audit_events");
  }
}
