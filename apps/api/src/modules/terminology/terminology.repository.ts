import { Injectable } from "@nestjs/common";
import {
  type SearchTerminologyInput,
  type TerminologyAuditEvent,
  type TerminologyRepository,
  type TerminologyTerm
} from "./terminology.types";
import { includesNormalized, sortTermsByAuthority } from "./terminology.utils";

@Injectable()
export class InMemoryTerminologyRepository implements TerminologyRepository {
  private readonly terms = new Map<string, TerminologyTerm>();
  private readonly auditEvents: TerminologyAuditEvent[] = [];

  async createTerm(term: TerminologyTerm): Promise<TerminologyTerm> {
    this.terms.set(term.id, term);
    return term;
  }

  async updateTerm(term: TerminologyTerm): Promise<TerminologyTerm> {
    this.terms.set(term.id, term);
    return term;
  }

  async findTermById(id: string, organizationId: string): Promise<TerminologyTerm | null> {
    const term = this.terms.get(id);

    if (!term || term.organizationId !== organizationId) {
      return null;
    }

    return term;
  }

  async searchTerms(
    input: SearchTerminologyInput & { organizationId: string }
  ): Promise<TerminologyTerm[]> {
    const matches = [...this.terms.values()].filter((term) => {
      const queryMatches =
        input.query === undefined ||
        input.query.length === 0 ||
        includesNormalized(term.term, input.query);

      return (
        term.organizationId === input.organizationId &&
        term.language === input.language &&
        (input.domain === undefined || term.domain === input.domain) &&
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
  }): Promise<TerminologyTerm[]> {
    return sortTermsByAuthority(
      [...this.terms.values()].filter((term) => {
        return (
          term.organizationId === input.organizationId &&
          term.language === input.language &&
          term.status === "VALIDATED" &&
          (input.domain === undefined || term.domain === input.domain)
        );
      })
    );
  }

  async appendAuditEvent(event: TerminologyAuditEvent): Promise<void> {
    this.auditEvents.push(event);
  }

  getAuditEvents(): TerminologyAuditEvent[] {
    return [...this.auditEvents];
  }
}
