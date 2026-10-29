import { ForbiddenException, Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";
import { validateIsoCompatibleLanguageTag, validateTranslationTargetV1 } from "@laborator/shared";
import { type AuthenticatedRequestContext } from "../auth/request-context.types";
import { handlerInputSchema, localDescriptor, localReportSchema,
  type LocalHandlerInput, type LocalHandlerReport } from "../ai-governance/ai-handler.contract";
import { DocumentsService } from "../documents/documents.service";
import { SegmentsService } from "../segments/segments.service";
import { LexicographicService } from "../lexicographic/lexicographic.service";
import { TerminologyService } from "../terminology/terminology.service";
import { TranslationMemoryService } from "../translation-memory/translation-memory.service";
import { SemanticFidelityService } from "../semantic-fidelity/semantic-fidelity.service";
import { WorkspaceService } from "../workspace/workspace.service";
import { TranslationsService } from "./translations.service";
import { type Segment } from "../segments/segments.types";

const translationId = "translation-agent";
const terminologyId = "terminology-lexicography-subagent";
const semanticId = "semantic-fidelity-subagent";
const segmentVersion = (segment: Segment) => createHash("sha256").update(JSON.stringify({
  source: segment.sourceText, target: segment.latestTargetText, updatedAt: segment.updatedAt,
  sourceLanguage: segment.sourceLanguage, targetLanguage: segment.targetLanguage,
  sourceLocale: segment.sourceLocale, targetLocale: segment.targetLocale,
  translationId: segment.latestTranslationId
})).digest("hex");

/** Module-owned orchestration only: linguistic decisions remain in existing services. */
@Injectable()
export class LinguisticAgentAdapter {
  constructor(private readonly segments: SegmentsService, private readonly documents: DocumentsService,
    private readonly workspace: WorkspaceService, private readonly terminology: TerminologyService,
    private readonly lexicographic: LexicographicService, private readonly memory: TranslationMemoryService,
    private readonly semantic: SemanticFidelityService, private readonly translations: TranslationsService) {}

  descriptors() {
    return [
      [translationId, "translation.proposal"], [terminologyId, "terminology.analyze"], [semanticId, "semantic.analyze"]
    ].map(([agentId, capability]) => {
      const descriptor = localDescriptor(agentId!, `${capability}.v1`, capability!, "DOCUMENT",
        ["document.read", "segment.read", "translation.read", ...(agentId === translationId ? ["translation.write"] : [])], true);
      descriptor.inputSchema = handlerInputSchema.refine((input) => input.resource.type === "DOCUMENT" && Boolean(input.segmentId)
        && (agentId !== translationId || input.explicitExternalProcessingAuthorization === true));
      descriptor.outputSchema = localReportSchema.refine((report) => Boolean(report.provenance?.length) && Array.isArray(report.findings));
      descriptor.allowedWorkflowStates = ["IN_TRANSLATION", "IN_QA", "IN_SEMANTIC_REVIEW", "IN_REVIEW"];
      if (agentId === translationId) {
        descriptor.availability = "PAID_EXECUTION_DISABLED";
        descriptor.metadata.externalProcessing = true;
      }
      return descriptor;
    });
  }

  async authorize(actor: AuthenticatedRequestContext, input: LocalHandlerInput) {
    await this.segment(actor, input);
  }

  private async segment(actor: AuthenticatedRequestContext, input: LocalHandlerInput) {
    if (!["document.read", "segment.read", "translation.read"].every((permission) =>
      (actor.canonicalPermissions as string[] | undefined)?.includes(permission)) || !input.segmentId || input.resource.type !== "DOCUMENT") {
      throw new ForbiddenException();
    }
    const segment = await this.segments.getSegment(actor, input.segmentId);
    const document = await this.documents.getDocument(actor, input.resource.id);
    if (segment.organizationId !== actor.organizationId || segment.projectId !== input.projectId ||
      segment.documentId !== document.id || document.projectId !== input.projectId || !segment.sourceText?.trim() ||
      !validateIsoCompatibleLanguageTag(segment.sourceLanguage).valid ||
      !validateTranslationTargetV1({ targetLanguage: segment.targetLanguage, targetLocale: segment.targetLocale }).valid) {
      throw new ForbiddenException();
    }
    for (const [resourceType, resourceId] of [["DOCUMENT", document.id], ["SEGMENT", segment.id]] as const) {
      const access = await this.workspace.evaluateNeedToKnowAccess(actor, {
        projectId: input.projectId, documentId: document.id, segmentId: segment.id,
        resourceType, resourceId, confidentialClassification: "RESTRICTED", requestedAction: "linguistic.analyze"
      });
      if (access.decision !== "ALLOW") throw new ForbiddenException();
    }
    return segment;
  }

  private async evidence(actor: AuthenticatedRequestContext, input: LocalHandlerInput, segment: Segment) {
    // Existing services can consult all pair-compatible resources. Authorize their entire
    // candidate set before consultation, rather than filtering confidential results afterward.
    const sources = (await this.lexicographic.listSources(actor)).filter((source) => source.enabled);
    const entries = await this.memory.listEntries(actor, {
      sourceLanguage: segment.sourceLanguage, targetLanguage: segment.targetLanguage
    });
    const terms = await this.terminology.searchTerms(actor, {
      language: segment.targetLanguage, projectId: input.projectId, limit: 100
    });
    if (sources.length + entries.length + terms.length > 200 || terms.length === 100) throw new ForbiddenException();
    const references = [
      ...sources.map((source) => ({ id: source.id, projectId: source.projectId, documentId: undefined,
        version: createHash("sha256").update(JSON.stringify(source)).digest("hex") })),
      ...entries.map((entry) => ({ id: entry.id, projectId: entry.projectId, documentId: entry.documentId,
        version: createHash("sha256").update(JSON.stringify(entry)).digest("hex") })),
      ...terms.map((term) => {
        if (term.glossaryScope === "PERSONAL" && term.ownerUserId !== actor.userId) throw new ForbiddenException();
        return { id: term.id, projectId: term.projectId, documentId: undefined,
          version: createHash("sha256").update(JSON.stringify(term)).digest("hex") };
      })
    ];
    for (const reference of references) {
      const projectId = reference.projectId ?? input.projectId;
      const access = await this.workspace.evaluateNeedToKnowAccess(actor, {
        projectId, resourceType: "LINGUISTIC_SOURCE", resourceId: reference.id,
        confidentialClassification: "RESTRICTED", requestedAction: "linguistic.consult"
      });
      if (access.decision !== "ALLOW") throw new ForbiddenException();
      if (reference.documentId) {
        const access = await this.workspace.evaluateNeedToKnowAccess(actor, { projectId,
          documentId: reference.documentId, resourceType: "DOCUMENT", resourceId: reference.documentId,
          confidentialClassification: "RESTRICTED", requestedAction: "linguistic.consult" });
        if (access.decision !== "ALLOW") throw new ForbiddenException();
      }
    }
    return references.map((ref) => ({ resourceType: "LINGUISTIC_EVIDENCE", resourceId: ref.id, version: ref.version }));
  }

  async authorizeResult(actor: AuthenticatedRequestContext, input: LocalHandlerInput, result: LocalHandlerReport) {
    const segment = await this.segment(actor, input);
    const evidence = await this.evidence(actor, input, segment);
    const expected = [{ resourceType: "SEGMENT", resourceId: segment.id, version: segmentVersion(segment) }, ...evidence];
    if (JSON.stringify(result.provenance) !== JSON.stringify(expected)) throw new ForbiddenException("Linguistic evidence changed.");
  }

  async execute(agentId: string, actor: AuthenticatedRequestContext, input: LocalHandlerInput, signal: AbortSignal): Promise<LocalHandlerReport> {
    if (![translationId, terminologyId, semanticId].includes(agentId) || signal.aborted) throw new ForbiddenException();
    const segment = await this.segment(actor, input);
    if (agentId === translationId) {
      if (input.explicitExternalProcessingAuthorization !== true) throw new ForbiddenException("External processing consent is required.");
      // No flag or Creator exemption may bypass the missing atomic financial ledger.
      this.requireFinancialReservation();
      const proposal = await this.translations.generateAiProposal(actor, {
        segmentId: segment.id, explicitExternalProcessingAuthorization: input.explicitExternalProcessingAuthorization === true
      });
      // Intentionally unreachable until a separately approved paid-runtime phase.
      throw new ForbiddenException(`PAID_EXECUTION_DISABLED:${proposal.status}`);
    }
    if (!segment.latestTargetText?.trim()) throw new ForbiddenException("A saved target translation is required.");
    const provenance = [{ resourceType: "SEGMENT", resourceId: segment.id, version: segmentVersion(segment) },
      ...await this.evidence(actor, input, segment)];
    if (signal.aborted) throw new Error("HANDLER_CANCELLED");
    const findings: NonNullable<LocalHandlerReport["findings"]> = [];
    const metrics: Record<string, number> = {};
    if (agentId === terminologyId) {
      const result = await this.terminology.checkSegmentText(actor, {
        sourceLanguage: segment.sourceLanguage, language: segment.targetLanguage,
        projectId: segment.projectId, ownerUserId: actor.userId,
        sourceText: segment.sourceText, targetText: segment.latestTargetText
      });
      const matches = await this.memory.searchMatches(actor, {
        sourceLanguage: segment.sourceLanguage, targetLanguage: segment.targetLanguage,
        sourceText: segment.sourceText, context: `${segment.projectId}:${segment.documentId}:${segment.id}`, limit: 5
      });
      for (const violation of result.violations) findings.push({ code: violation.type,
        severity: violation.severity ?? "WARNING", referenceId: violation.termId });
      for (const conflict of result.glossaryConflicts ?? []) findings.push({ code: "GLOSSARY_CONFLICT", severity: "HIGH", referenceId: conflict.termIds[0] });
      metrics.translationMemoryMatches = matches.length;
      metrics.validatedTerminologyPriority = 1;
    } else {
      const result = await this.semantic.runCheckOnSegment(actor, {
        projectId: segment.projectId, documentId: segment.documentId, segmentId: segment.id,
        sourceLanguage: segment.sourceLanguage, targetLanguage: segment.targetLanguage,
        sourceText: segment.sourceText, targetText: segment.latestTargetText
      });
      for (const issue of result.issues) findings.push({ code: issue.type,
        severity: issue.riskLevel === "CRITICAL" ? "CRITICAL" : issue.riskLevel === "HIGH" ? "HIGH" : "WARNING",
        referenceId: issue.terminologyTermId ?? issue.translationMemoryEntryId ?? segment.id });
      metrics.semanticScore = result.score;
    }
    if (signal.aborted) throw new Error("HANDLER_CANCELLED");
    return { readiness: findings.length ? "READY_WITH_WARNINGS" : "READY", humanApprovalRequired: true,
      issues: findings.map((finding) => finding.code), findings, provenance, metrics };
  }

  private requireFinancialReservation(): void {
    throw new ForbiddenException("PAID_EXECUTION_DISABLED_ATOMIC_RESERVATIONS_REQUIRED");
  }
}
