import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { QaService } from "../qa/qa.service";
import { TerminologyService } from "../terminology/terminology.service";
import { TranslationMemoryService } from "../translation-memory/translation-memory.service";
import { calculateFuzzyScore } from "../translation-memory/translation-memory.utils";
import { InMemorySemanticFidelityRepository } from "./semantic-fidelity.repository";
import {
  type ListSemanticIssuesInput,
  type SemanticDocumentInput,
  type SemanticFidelityActor,
  type SemanticFidelityAuditAction,
  type SemanticFidelityIssue,
  type SemanticFidelityIssueType,
  type SemanticFidelityReport,
  type SemanticSegmentInput
} from "./semantic-fidelity.types";
import {
  calculateSemanticScore,
  hasReinterpretationMarker,
  lengthRatio,
  normalizeSemanticText,
  overallRiskLevel,
  riskForIssue
} from "./semantic-fidelity.utils";

const TERMINOLOGY_VALIDATED_PRIORITY = "VALIDATED_TERMINOLOGY_OVER_TM_OVER_AI" as const;

@Injectable()
export class SemanticFidelityService {
  constructor(
    private readonly repository: InMemorySemanticFidelityRepository,
    private readonly terminologyService: TerminologyService,
    private readonly translationMemoryService: TranslationMemoryService,
    private readonly qaService: QaService
  ) {}

  async runCheckOnSegment(
    actor: SemanticFidelityActor,
    input: SemanticSegmentInput
  ): Promise<SemanticFidelityReport> {
    this.validateActor(actor);
    this.validateSegmentInput(input);

    const reportId = randomUUID();
    const createdAt = new Date().toISOString();
    const issues = await this.buildSegmentIssues(actor, reportId, input, createdAt);
    const report = this.createReport(actor, reportId, "SEGMENT", createdAt, issues, input);

    await this.repository.createReport(report);
    await this.repository.createIssues(issues);
    await this.audit("SEMANTIC_CHECK", actor, report.id, undefined, report);

    for (const issue of issues) {
      await this.audit("ISSUE_CREATED", actor, report.id, undefined, issue, issue.id);
    }

    return report;
  }

  async runCheckOnDocument(
    actor: SemanticFidelityActor,
    input: SemanticDocumentInput
  ): Promise<SemanticFidelityReport> {
    this.validateActor(actor);

    if (!input.documentId || !Array.isArray(input.segments)) {
      throw new BadRequestException("documentId and segments are required.");
    }

    const reportId = randomUUID();
    const createdAt = new Date().toISOString();
    const issues: SemanticFidelityIssue[] = [];

    for (const segment of input.segments) {
      issues.push(
        ...(await this.buildSegmentIssues(
          actor,
          reportId,
          {
            ...segment,
            projectId: segment.projectId ?? input.projectId,
            documentId: segment.documentId ?? input.documentId,
            sourceLanguage: segment.sourceLanguage ?? input.sourceLanguage,
            targetLanguage: segment.targetLanguage ?? input.targetLanguage,
            domain: segment.domain ?? input.domain
          },
          createdAt
        ))
      );
    }

    const report = this.createReport(actor, reportId, "DOCUMENT", createdAt, issues, {
      projectId: input.projectId,
      documentId: input.documentId
    });

    await this.repository.createReport(report);
    await this.repository.createIssues(issues);
    await this.audit("SEMANTIC_CHECK", actor, report.id, undefined, report);

    for (const issue of issues) {
      await this.audit("ISSUE_CREATED", actor, report.id, undefined, issue, issue.id);
    }

    return report;
  }

  async listIssues(
    actor: SemanticFidelityActor,
    input: ListSemanticIssuesInput
  ): Promise<SemanticFidelityIssue[]> {
    this.validateActor(actor);

    return this.repository.listIssues({
      ...input,
      organizationId: actor.organizationId
    });
  }

  async markIssueResolved(
    actor: SemanticFidelityActor,
    issueId: string
  ): Promise<SemanticFidelityIssue> {
    this.validateActor(actor);

    const existing = await this.repository.findIssueById(issueId, actor.organizationId);

    if (!existing) {
      throw new NotFoundException("Semantic fidelity issue not found.");
    }

    const resolved: SemanticFidelityIssue = {
      ...existing,
      status: "RESOLVED",
      resolvedBy: actor.userId,
      resolvedAt: new Date().toISOString()
    };

    const saved = await this.repository.updateIssue(resolved);
    await this.audit("ISSUE_RESOLVED", actor, saved.semanticReportId, existing, saved, saved.id);

    return saved;
  }

  async recalculateSemanticScore(
    actor: SemanticFidelityActor,
    reportId: string
  ): Promise<SemanticFidelityReport> {
    this.validateActor(actor);

    const existing = await this.repository.findReportById(reportId, actor.organizationId);

    if (!existing) {
      throw new NotFoundException("Semantic fidelity report not found.");
    }

    const issues = await this.repository.listIssues({
      organizationId: actor.organizationId,
      projectId: existing.projectId,
      documentId: existing.documentId,
      segmentId: existing.segmentId
    });
    const reportIssues = issues.filter((issue) => issue.semanticReportId === reportId);
    const updated: SemanticFidelityReport = {
      ...existing,
      issues: reportIssues,
      issueCount: reportIssues.filter((issue) => issue.status === "OPEN").length,
      score: calculateSemanticScore(reportIssues),
      riskLevel: overallRiskLevel(reportIssues)
    };

    const saved = await this.repository.updateReport(updated);
    await this.audit("SCORE_RECALCULATED", actor, saved.id, existing, saved);

    return saved;
  }

  private async buildSegmentIssues(
    actor: SemanticFidelityActor,
    reportId: string,
    segment: SemanticSegmentInput,
    createdAt: string
  ): Promise<SemanticFidelityIssue[]> {
    const issues: SemanticFidelityIssue[] = [];
    const ratio = lengthRatio(segment.sourceText, segment.targetText);

    if (ratio < 0.45) {
      issues.push(
        this.createIssue(actor, reportId, "OMITTED_MEANING", segment, {
          message: "Target segment is much shorter than source and may omit meaning.",
          createdAt
        })
      );
    }

    if (ratio > 1.9) {
      issues.push(
        this.createIssue(actor, reportId, "ADDED_MEANING", segment, {
          message: "Target segment is much longer than source and may add meaning.",
          createdAt
        })
      );
    }

    if (hasReinterpretationMarker(segment.targetText)) {
      issues.push(
        this.createIssue(actor, reportId, "UNJUSTIFIED_REINTERPRETATION", segment, {
          message: "Target contains reinterpretation markers that require human review.",
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
        this.createIssue(actor, reportId, "TERMINOLOGY_MEANING_CONFLICT", segment, {
          message: `${violation.message} Validated terminology has priority over Translation Memory and AI suggestions.`,
          terminologyTermId: violation.termId,
          createdAt,
          metadata: {
            priority: TERMINOLOGY_VALIDATED_PRIORITY,
            authoritative: violation.authoritative
          }
        })
      );
    }

    const tmMatches = await this.translationMemoryService.searchMatches(actor, {
      sourceText: segment.sourceText,
      sourceLanguage: segment.sourceLanguage,
      targetLanguage: segment.targetLanguage,
      domain: segment.domain,
      limit: 1,
      similarityThreshold: 0.75
    });
    const bestTmMatch = tmMatches[0];

    if (bestTmMatch && calculateFuzzyScore(bestTmMatch.entry.targetText, segment.targetText) < 0.35) {
      issues.push(
        this.createIssue(actor, reportId, "MEANING_DRIFT", segment, {
          message: "Target diverges from an approved Translation Memory match and needs review.",
          translationMemoryEntryId: bestTmMatch.entry.id,
          createdAt,
          metadata: {
            translationMemorySimilarity: bestTmMatch.similarityScore,
            priority: "TRANSLATION_MEMORY_AFTER_VALIDATED_TERMINOLOGY"
          }
        })
      );
    }

    const qaIssues = await this.qaService.listIssues(actor, {
      projectId: segment.projectId,
      documentId: segment.documentId,
      segmentId: segment.segmentId,
      status: "OPEN"
    });
    const contextualQaIssue = qaIssues.find((issue) =>
      ["CRITICAL", "HIGH"].includes(issue.severity)
    );

    if (contextualQaIssue) {
      issues.push(
        this.createIssue(actor, reportId, "CONTEXT_MISMATCH", segment, {
          message: `Open QA issue may affect semantic context: ${contextualQaIssue.message}`,
          qaIssueId: contextualQaIssue.id,
          createdAt
        })
      );
    }

    return issues;
  }

  private createReport(
    actor: SemanticFidelityActor,
    reportId: string,
    scope: "SEGMENT" | "DOCUMENT",
    createdAt: string,
    issues: SemanticFidelityIssue[],
    target: { projectId?: string; documentId?: string; segmentId?: string }
  ): SemanticFidelityReport {
    return {
      id: reportId,
      organizationId: actor.organizationId,
      projectId: target.projectId,
      documentId: target.documentId,
      segmentId: target.segmentId,
      scope,
      status: "COMPLETED",
      score: calculateSemanticScore(issues),
      riskLevel: overallRiskLevel(issues),
      issueCount: issues.length,
      createdBy: actor.userId,
      createdAt,
      metadata: {
        priority: TERMINOLOGY_VALIDATED_PRIORITY,
        aiMayExplainButCannotOverride: true,
        finalAuthority: "AUTHORIZED_HUMAN"
      },
      issues
    };
  }

  private createIssue(
    actor: SemanticFidelityActor,
    reportId: string,
    type: SemanticFidelityIssueType,
    segment: SemanticSegmentInput,
    input: {
      message: string;
      createdAt: string;
      terminologyTermId?: string;
      translationMemoryEntryId?: string;
      qaIssueId?: string;
      metadata?: Record<string, unknown>;
    }
  ): SemanticFidelityIssue {
    return {
      id: randomUUID(),
      organizationId: actor.organizationId,
      semanticReportId: reportId,
      projectId: segment.projectId,
      documentId: segment.documentId,
      segmentId: segment.segmentId,
      type,
      riskLevel: riskForIssue(type),
      status: "OPEN",
      message: input.message,
      sourceText: segment.sourceText,
      targetText: segment.targetText,
      terminologyTermId: input.terminologyTermId,
      translationMemoryEntryId: input.translationMemoryEntryId,
      qaIssueId: input.qaIssueId,
      aiExplanation: "AI may provide explanations and alternatives but cannot override validated terminology or final human authority.",
      alternatives: [],
      createdBy: actor.userId,
      createdAt: input.createdAt,
      metadata: {
        priority: TERMINOLOGY_VALIDATED_PRIORITY,
        ...input.metadata
      }
    };
  }

  private async audit(
    action: SemanticFidelityAuditAction,
    actor: SemanticFidelityActor,
    semanticReportId: string | undefined,
    beforeState: SemanticFidelityReport | SemanticFidelityIssue | undefined,
    afterState: SemanticFidelityReport | SemanticFidelityIssue,
    semanticIssueId?: string
  ): Promise<void> {
    await this.repository.appendAuditEvent({
      id: randomUUID(),
      organizationId: actor.organizationId,
      semanticReportId,
      semanticIssueId,
      action,
      actorId: actor.userId,
      beforeState,
      afterState,
      createdAt: new Date().toISOString()
    });
  }

  private validateActor(actor: SemanticFidelityActor): void {
    if (!actor.userId || !actor.organizationId) {
      throw new BadRequestException("userId and organizationId are required.");
    }
  }

  private validateSegmentInput(input: SemanticSegmentInput): void {
    if (
      !input.segmentId ||
      !input.sourceText ||
      !input.targetText ||
      !input.sourceLanguage ||
      !input.targetLanguage
    ) {
      throw new BadRequestException(
        "segmentId, sourceText, targetText, sourceLanguage and targetLanguage are required."
      );
    }
  }
}
