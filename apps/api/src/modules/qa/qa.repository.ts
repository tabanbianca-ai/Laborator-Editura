import { Injectable } from "@nestjs/common";
import {
  type ListQaIssuesInput,
  type QaAuditEvent,
  type QaIssue,
  type QaReport,
  type QaRepository
} from "./qa.types";

@Injectable()
export class InMemoryQaRepository implements QaRepository {
  private readonly reports = new Map<string, QaReport>();
  private readonly issues = new Map<string, QaIssue>();
  private readonly auditEvents: QaAuditEvent[] = [];

  async createReport(report: QaReport): Promise<QaReport> {
    this.reports.set(report.id, report);
    return report;
  }

  async updateReport(report: QaReport): Promise<QaReport> {
    this.reports.set(report.id, report);
    return report;
  }

  async findReportById(id: string, organizationId: string): Promise<QaReport | null> {
    const report = this.reports.get(id);

    if (!report || report.organizationId !== organizationId) {
      return null;
    }

    return report;
  }

  async createIssues(issues: QaIssue[]): Promise<QaIssue[]> {
    for (const issue of issues) {
      this.issues.set(issue.id, issue);
    }

    return issues;
  }

  async updateIssue(issue: QaIssue): Promise<QaIssue> {
    this.issues.set(issue.id, issue);
    return issue;
  }

  async findIssueById(id: string, organizationId: string): Promise<QaIssue | null> {
    const issue = this.issues.get(id);

    if (!issue || issue.organizationId !== organizationId) {
      return null;
    }

    return issue;
  }

  async listIssues(input: ListQaIssuesInput & { organizationId: string }): Promise<QaIssue[]> {
    return [...this.issues.values()].filter((issue) => {
      return (
        issue.organizationId === input.organizationId &&
        (input.projectId === undefined || issue.projectId === input.projectId) &&
        (input.documentId === undefined || issue.documentId === input.documentId) &&
        (input.segmentId === undefined || issue.segmentId === input.segmentId) &&
        (input.status === undefined || issue.status === input.status) &&
        (input.severity === undefined || issue.severity === input.severity)
      );
    });
  }

  async appendAuditEvent(event: QaAuditEvent): Promise<void> {
    this.auditEvents.push(event);
  }

  getAuditEvents(): QaAuditEvent[] {
    return [...this.auditEvents];
  }
}
