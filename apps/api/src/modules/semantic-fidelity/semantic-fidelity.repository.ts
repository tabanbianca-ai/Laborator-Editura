import { Injectable } from "@nestjs/common";
import {
  type ListSemanticIssuesInput,
  type SemanticFidelityAuditEvent,
  type SemanticFidelityIssue,
  type SemanticFidelityReport,
  type SemanticFidelityRepository
} from "./semantic-fidelity.types";

@Injectable()
export class InMemorySemanticFidelityRepository implements SemanticFidelityRepository {
  private readonly reports = new Map<string, SemanticFidelityReport>();
  private readonly issues = new Map<string, SemanticFidelityIssue>();
  private readonly auditEvents: SemanticFidelityAuditEvent[] = [];

  async createReport(report: SemanticFidelityReport): Promise<SemanticFidelityReport> {
    this.reports.set(report.id, report);
    return report;
  }

  async updateReport(report: SemanticFidelityReport): Promise<SemanticFidelityReport> {
    this.reports.set(report.id, report);
    return report;
  }

  async findReportById(
    id: string,
    organizationId: string
  ): Promise<SemanticFidelityReport | null> {
    const report = this.reports.get(id);

    if (!report || report.organizationId !== organizationId) {
      return null;
    }

    return report;
  }

  async createIssues(issues: SemanticFidelityIssue[]): Promise<SemanticFidelityIssue[]> {
    for (const issue of issues) {
      this.issues.set(issue.id, issue);
    }

    return issues;
  }

  async updateIssue(issue: SemanticFidelityIssue): Promise<SemanticFidelityIssue> {
    this.issues.set(issue.id, issue);
    return issue;
  }

  async findIssueById(
    id: string,
    organizationId: string
  ): Promise<SemanticFidelityIssue | null> {
    const issue = this.issues.get(id);

    if (!issue || issue.organizationId !== organizationId) {
      return null;
    }

    return issue;
  }

  async listIssues(
    input: ListSemanticIssuesInput & { organizationId: string }
  ): Promise<SemanticFidelityIssue[]> {
    return [...this.issues.values()].filter((issue) => {
      return (
        issue.organizationId === input.organizationId &&
        (input.projectId === undefined || issue.projectId === input.projectId) &&
        (input.documentId === undefined || issue.documentId === input.documentId) &&
        (input.segmentId === undefined || issue.segmentId === input.segmentId) &&
        (input.status === undefined || issue.status === input.status) &&
        (input.riskLevel === undefined || issue.riskLevel === input.riskLevel)
      );
    });
  }

  async appendAuditEvent(event: SemanticFidelityAuditEvent): Promise<void> {
    this.auditEvents.push(event);
  }

  getAuditEvents(): SemanticFidelityAuditEvent[] {
    return [...this.auditEvents];
  }
}
