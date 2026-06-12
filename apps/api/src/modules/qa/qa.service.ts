import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { TerminologyService } from "../terminology/terminology.service";
import { InMemoryQaRepository } from "./qa.repository";
import {
  type ListQaIssuesInput,
  type QaActor,
  type QaAuditAction,
  type QaDocumentInput,
  type QaIssue,
  type QaIssueType,
  type QaReport,
  type QaSegmentInput
} from "./qa.types";
import {
  calculateQaScore,
  extractDates,
  extractNumbers,
  isTooShortTranslation,
  isUntranslated,
  normalizeQaText,
  severityForIssue,
  terminalPunctuation
} from "./qa.utils";

const TERMINOLOGY_VALIDATED_PRIORITY = "TERMINOLOGY_VALIDATED" as const;

@Injectable()
export class QaService {
  constructor(
    private readonly repository: InMemoryQaRepository,
    private readonly terminologyService: TerminologyService
  ) {}

  async runQaOnSegment(actor: QaActor, input: QaSegmentInput): Promise<QaReport> {
    this.validateActor(actor);
    this.validateSegmentInput(input);

    const reportId = randomUUID();
    const createdAt = new Date().toISOString();
    const issues = await this.buildSegmentIssues(actor, reportId, input, createdAt);
    const score = calculateQaScore(issues);
    const report: QaReport = {
      id: reportId,
      organizationId: actor.organizationId,
      projectId: input.projectId,
      documentId: input.documentId,
      segmentId: input.segmentId,
      scope: "SEGMENT",
      status: "COMPLETED",
      score,
      issueCount: issues.length,
      createdBy: actor.userId,
      createdAt,
      issues
    };

    await this.repository.createReport(report);
    await this.repository.createIssues(issues);
    await this.audit("QA_RUN", actor, report.id, undefined, report);

    for (const issue of issues) {
      await this.audit("ISSUE_CREATED", actor, report.id, undefined, issue, issue.id);
    }

    return report;
  }

  async runQaOnDocument(actor: QaActor, input: QaDocumentInput): Promise<QaReport> {
    this.validateActor(actor);

    if (!input.documentId || !Array.isArray(input.segments)) {
      throw new BadRequestException("documentId and segments are required.");
    }

    const reportId = randomUUID();
    const createdAt = new Date().toISOString();
    const issues: QaIssue[] = [];
    const repeatedSourceTexts = new Map<string, number>();

    for (const segment of input.segments) {
      const normalizedSource = normalizeQaText(segment.sourceText).toLocaleLowerCase();
      repeatedSourceTexts.set(normalizedSource, (repeatedSourceTexts.get(normalizedSource) ?? 0) + 1);

      issues.push(
        ...(await this.buildSegmentIssues(
          actor,
          reportId,
          {
            ...segment,
            projectId: segment.projectId ?? input.projectId,
            documentId: segment.documentId ?? input.documentId,
            targetLanguage: segment.targetLanguage ?? input.targetLanguage,
            domain: segment.domain ?? input.domain
          },
          createdAt
        ))
      );
    }

    for (const segment of input.segments) {
      const normalizedSource = normalizeQaText(segment.sourceText).toLocaleLowerCase();

      if (normalizedSource && (repeatedSourceTexts.get(normalizedSource) ?? 0) > 1) {
        issues.push(
          this.createIssue(actor, reportId, "REPEATED_SEGMENT", {
            projectId: segment.projectId ?? input.projectId,
            documentId: segment.documentId ?? input.documentId,
            segmentId: segment.segmentId,
            sourceText: segment.sourceText,
            targetText: segment.targetText,
            message: "Repeated source segment detected.",
            createdAt
          })
        );
      }
    }

    const score = calculateQaScore(issues);
    const report: QaReport = {
      id: reportId,
      organizationId: actor.organizationId,
      projectId: input.projectId,
      documentId: input.documentId,
      scope: "DOCUMENT",
      status: "COMPLETED",
      score,
      issueCount: issues.length,
      createdBy: actor.userId,
      createdAt,
      issues
    };

    await this.repository.createReport(report);
    await this.repository.createIssues(issues);
    await this.audit("QA_RUN", actor, report.id, undefined, report);

    for (const issue of issues) {
      await this.audit("ISSUE_CREATED", actor, report.id, undefined, issue, issue.id);
    }

    return report;
  }

  async listIssues(actor: QaActor, input: ListQaIssuesInput): Promise<QaIssue[]> {
    this.validateActor(actor);

    return this.repository.listIssues({
      ...input,
      organizationId: actor.organizationId
    });
  }

  async markIssueResolved(actor: QaActor, issueId: string): Promise<QaIssue> {
    this.validateActor(actor);

    const existing = await this.repository.findIssueById(issueId, actor.organizationId);

    if (!existing) {
      throw new NotFoundException("QA issue not found.");
    }

    const resolved: QaIssue = {
      ...existing,
      status: "RESOLVED",
      resolvedBy: actor.userId,
      resolvedAt: new Date().toISOString()
    };

    const saved = await this.repository.updateIssue(resolved);
    await this.audit("ISSUE_RESOLVED", actor, saved.qaReportId, existing, saved, saved.id);

    return saved;
  }

  async recalculateQaScore(actor: QaActor, reportId: string): Promise<QaReport> {
    this.validateActor(actor);

    const existing = await this.repository.findReportById(reportId, actor.organizationId);

    if (!existing) {
      throw new NotFoundException("QA report not found.");
    }

    const issues = await this.repository.listIssues({
      organizationId: actor.organizationId,
      projectId: existing.projectId,
      documentId: existing.documentId,
      segmentId: existing.segmentId
    });
    const reportIssues = issues.filter((issue) => issue.qaReportId === reportId);
    const updated: QaReport = {
      ...existing,
      issues: reportIssues,
      issueCount: reportIssues.filter((issue) => issue.status === "OPEN").length,
      score: calculateQaScore(reportIssues)
    };

    const saved = await this.repository.updateReport(updated);
    await this.audit("SCORE_RECALCULATED", actor, saved.id, existing, saved);

    return saved;
  }

  private async buildSegmentIssues(
    actor: QaActor,
    reportId: string,
    segment: QaSegmentInput,
    createdAt: string
  ): Promise<QaIssue[]> {
    const issues: QaIssue[] = [];
    const source = normalizeQaText(segment.sourceText);
    const target = normalizeQaText(segment.targetText);

    if (!segment.targetText || target.length === 0) {
      issues.push(
        this.createIssue(actor, reportId, "MISSING_TARGET_TRANSLATION", {
          ...segment,
          message: "Target translation is missing.",
          createdAt
        })
      );
      issues.push(
        this.createIssue(actor, reportId, "EMPTY_TRANSLATION", {
          ...segment,
          message: "Target translation is empty.",
          createdAt
        })
      );
      return issues;
    }

    if (isUntranslated(source, target)) {
      issues.push(
        this.createIssue(actor, reportId, "UNTRANSLATED_SEGMENT", {
          ...segment,
          message: "Target translation appears identical to source.",
          createdAt
        })
      );
    }

    if (isTooShortTranslation(segment)) {
      issues.push(
        this.createIssue(actor, reportId, "TOO_SHORT_TRANSLATION", {
          ...segment,
          message: "Target translation is too short compared with source.",
          createdAt
        })
      );
    }

    if (extractNumbers(source).join("|") !== extractNumbers(target).join("|")) {
      issues.push(
        this.createIssue(actor, reportId, "NUMBER_MISMATCH", {
          ...segment,
          message: "Source and target numbers do not match.",
          createdAt
        })
      );
    }

    if (extractDates(source).join("|") !== extractDates(target).join("|")) {
      issues.push(
        this.createIssue(actor, reportId, "DATE_MISMATCH", {
          ...segment,
          message: "Source and target dates do not match.",
          createdAt
        })
      );
    }

    if (terminalPunctuation(source) !== terminalPunctuation(target)) {
      issues.push(
        this.createIssue(actor, reportId, "PUNCTUATION_MISMATCH", {
          ...segment,
          message: "Source and target terminal punctuation do not match.",
          createdAt
        })
      );
    }

    const terminologyResult = await this.terminologyService.checkSegmentText(actor, {
      language: segment.targetLanguage,
      domain: segment.domain,
      sourceText: segment.sourceText,
      targetText: segment.targetText
    });

    for (const violation of terminologyResult.violations) {
      issues.push(
        this.createIssue(
          actor,
          reportId,
          violation.type === "FORBIDDEN_VARIANT"
            ? "FORBIDDEN_TERMINOLOGY_VARIANT"
            : "TERMINOLOGY_VIOLATION",
          {
            ...segment,
            message: `${violation.message} Validated terminology has priority over Translation Memory and AI suggestions.`,
            terminologyTermId: violation.termId,
            createdAt,
            metadata: {
              terminologyPriority: TERMINOLOGY_VALIDATED_PRIORITY,
              authoritative: violation.authoritative
            }
          }
        )
      );
    }

    return issues;
  }

  private createIssue(
    actor: QaActor,
    reportId: string,
    type: QaIssueType,
    input: QaSegmentInput & {
      message: string;
      createdAt: string;
      terminologyTermId?: string;
      metadata?: Record<string, unknown>;
    }
  ): QaIssue {
    return {
      id: randomUUID(),
      organizationId: actor.organizationId,
      qaReportId: reportId,
      projectId: input.projectId,
      documentId: input.documentId,
      segmentId: input.segmentId,
      type,
      severity: severityForIssue(type),
      status: "OPEN",
      message: input.message,
      sourceText: input.sourceText,
      targetText: input.targetText,
      terminologyTermId: input.terminologyTermId,
      createdBy: actor.userId,
      createdAt: input.createdAt,
      metadata: input.metadata
    };
  }

  private async audit(
    action: QaAuditAction,
    actor: QaActor,
    qaReportId: string | undefined,
    beforeState: QaReport | QaIssue | undefined,
    afterState: QaReport | QaIssue,
    qaIssueId?: string
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      qaReportId,
      qaIssueId,
      action,
      actorId: actor.userId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private validateActor(actor: QaActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

  private validateSegmentInput(input: QaSegmentInput): void {
    if (!input.segmentId || !input.sourceText || !input.targetLanguage) {
      throw new BadRequestException("segmentId, sourceText and targetLanguage are required.");
    }
  }
}
