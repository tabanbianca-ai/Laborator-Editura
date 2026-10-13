import type { ComponentProps } from "react";
import Link from "next/link";
import {
  acceptEditorialCorrectionAction,
  advanceReviewWorkflowAction,
  approveReviewAction,
  completeEditorialReviewAction,
  createEditorialCorrectionAction,
  rejectEditorialCorrectionAction,
  requestEditorialChangesAction,
  unblockReviewWorkflowAction
} from "../../lib/review-workspace-actions";
import type {
  ParallelReviewInterfaceState,
  ReviewProposal,
  ReviewWorkspaceData,
  ReviewWorkflowStatus
} from "../../lib/review-workspace-client";
import type {
  LexicographicReference,
  SemanticIssue,
  TerminologyViolation,
  WorkspaceSegmentRecord,
  WorkspaceTranslationRecord
} from "../../lib/translation-workspace-client";
import { Badge, Button, Card, EmptyState, ErrorState, PageHeader } from "../ui";
import { createEditorialUiTranslator, type EditorialUiTranslator } from "../../lib/ui-i18n";

type BadgeTone = ComponentProps<typeof Badge>["tone"];

interface ReviewWorkspacePageProps {
  error?: string;
  platformLanguage?: string;
  workspace: ReviewWorkspaceData;
}

interface ReviewIssue {
  id: string;
  label: string;
  message: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export function ReviewWorkspacePage({
  error,
  platformLanguage,
  workspace
}: ReviewWorkspacePageProps) {
  const ui = createEditorialUiTranslator(platformLanguage);
  const activeSegment = workspace.activeSegment;
  const latestTranslation = workspace.latestTranslation;
  const issues = buildReviewIssues(workspace);

  return (
    <main className="page-stack">
      <PageHeader eyebrow={ui.t("review")} title={ui.t("reviewApprovalWorkspace")} />

      {error ? <ErrorState message={error} /> : null}
      {workspace.projectsError ? <ErrorState message={workspace.projectsError} /> : null}
      {workspace.documentsError ? <ErrorState message={workspace.documentsError} /> : null}
      {workspace.segmentsError ? <ErrorState message={workspace.segmentsError} /> : null}
      {workspace.translationsError ? <ErrorState message={workspace.translationsError} /> : null}

      <section className="translation-selector-grid" aria-label={ui.t("reviewDocumentSelection")}>
        <Card title={ui.t("project")}>
          <p className="selector-value">
            {workspace.selectedProject?.name ?? ui.t("notSelected")}
          </p>
          <select className="ui-input ui-select" disabled name="review-project-selector">
            <option>
              {workspace.selectedProject?.name ?? ui.t("project")}
            </option>
          </select>
        </Card>
        <Card title={ui.t("document")}>
          <p className="selector-value">
            {workspace.selectedDocument?.title ?? ui.t("notSelected")}
          </p>
          <div className="document-link-list">
            {workspace.documents.slice(0, 6).map((document) => (
              <Link
                className={
                  workspace.selectedDocument?.id === document.id
                    ? "document-selector-link document-selector-link-active"
                    : "document-selector-link"
                }
                href={`/review?documentId=${encodeURIComponent(document.id)}`}
                key={document.id}
              >
                {document.title}
              </Link>
            ))}
          </div>
        </Card>
      </section>

      {!workspace.selectedDocument ? (
        <EmptyState title={ui.t("noDocumentSelected")} />
      ) : null}

      {workspace.selectedDocument && !activeSegment ? (
        <EmptyState title={ui.t("emptyReviewSegments")} />
      ) : null}

      {activeSegment ? (
        <section className="translation-workspace-grid" aria-label={ui.t("reviewApprovalWorkspace")}>
          <ReviewSegmentRail
            activeSegmentId={activeSegment.id}
            documentId={workspace.selectedDocument?.id ?? activeSegment.documentId}
            segments={workspace.segments}
            semanticIssues={workspace.semanticIssues}
            translations={workspace.translations}
            ui={ui}
          />

          <ReviewComparisonPanel
            latestTranslation={latestTranslation}
            parallelReview={workspace.parallelReview}
            proposals={workspace.reviewProposals}
            segment={activeSegment}
            workflowStatus={workspace.workflow?.status}
            ui={ui}
          />

          <ReviewReferencePanels
            issues={issues}
            latestTranslation={latestTranslation}
            workspace={workspace}
            ui={ui}
          />
        </section>
      ) : null}
    </main>
  );
}

function ReviewSegmentRail({
  activeSegmentId,
  documentId,
  segments,
  semanticIssues,
  translations,
  ui
}: {
  activeSegmentId: string;
  documentId: string;
  segments: WorkspaceSegmentRecord[];
  semanticIssues: SemanticIssue[];
  translations: WorkspaceTranslationRecord[];
  ui: EditorialUiTranslator;
}) {
  return (
    <aside className="translation-segment-rail" aria-label={ui.t("reviewSegments")}>
      <div className="section-heading">
        <div>
          <p className="section-kicker">{ui.t("segments")}</p>
          <h2>{ui.t("reviewQueue")}</h2>
        </div>
        <Badge tone="info">{segments.length}</Badge>
      </div>
      <div className="translation-segment-list">
        {segments.map((segment) => {
          const translation = findLatestTranslation(segment, translations);
          const blockingIssues = semanticIssues.filter(
            (issue) =>
              issue.segmentId === segment.id &&
              issue.status === "OPEN" &&
              (issue.riskLevel === "HIGH" || issue.riskLevel === "CRITICAL")
          );

          return (
            <Link
              className={
                segment.id === activeSegmentId
                  ? "translation-segment-card translation-segment-card-active"
                  : "translation-segment-card"
              }
              href={`/review?documentId=${encodeURIComponent(documentId)}&segmentId=${encodeURIComponent(
                segment.id
              )}`}
              key={segment.id}
            >
              <span>{ui.t("segment")} {segment.order}</span>
              <strong>{truncate(segment.sourceText, 76)}</strong>
              <div className="review-segment-badges">
                <Badge tone={toneForTranslationStatus(translation?.status)}>
                  {statusLabel(translation?.status, ui)}
                </Badge>
                {blockingIssues.length > 0 ? (
                  <Badge tone="danger">{blockingIssues.length} {ui.t("issues")}</Badge>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

function ReviewComparisonPanel({
  latestTranslation,
  parallelReview,
  proposals,
  segment,
  workflowStatus,
  ui
}: {
  latestTranslation: WorkspaceTranslationRecord | null;
  parallelReview: ParallelReviewInterfaceState;
  proposals: ReviewProposal[];
  segment: WorkspaceSegmentRecord;
  workflowStatus?: ReviewWorkflowStatus;
  ui: EditorialUiTranslator;
}) {
  const targetText = latestTranslation?.targetText;

  return (
    <section className="translation-editor-panel" aria-label={ui.t("parallelReview")}>
      <Card title={ui.t("parallelReview")}>
        <div className="parallel-review-toolbar">
          <Badge tone="info">{ui.t("defaultTwoColumns")}</Badge>
          <Badge tone="neutral">{ui.t("optionalThreeColumns")}</Badge>
          <Badge tone="neutral">{ui.t("optionalFourColumns")}</Badge>
        </div>
        <div className="parallel-review-mode-controls" aria-label={ui.t("parallelModeControls")}>
          <label>
            {ui.t("displayMode")}
            <select className="ui-input ui-select" disabled name="parallel-review-display-mode">
              <option>{ui.t("twoColumns")}</option>
              <option>{ui.t("threeColumns")}</option>
              <option>{ui.t("fourColumns")}</option>
            </select>
          </label>
          <label>
            {ui.t("optionalLanguageVersion")}
            <select className="ui-input ui-select" disabled name="parallel-review-optional-column">
              <option>{ui.t("chooseLanguageVersion")}</option>
            </select>
          </label>
        </div>
        <div className="parallel-review-grid parallel-review-grid-two" data-display-mode={parallelReview.defaultDisplayMode}>
          <article className="parallel-review-column parallel-review-column-original">
            <div className="section-heading">
              <div>
                <p className="section-kicker">{ui.t("columnOne")}</p>
                <h3>{ui.t("sourceText")}</h3>
              </div>
              <Badge tone="neutral">{segment.sourceLanguage.toUpperCase()}</Badge>
            </div>
            <p className="source-text-block">{segment.sourceText}</p>
            <p className="review-human-authority">
              {ui.t("originalTextRule")}
            </p>
          </article>

          <article className="parallel-review-column parallel-review-column-translation">
            <div className="section-heading">
              <div>
                <p className="section-kicker">{ui.t("columnTwo")}</p>
                <h3>{ui.t("translatedText")}</h3>
              </div>
              <Badge tone="neutral">{segment.targetLanguage.toUpperCase()}</Badge>
            </div>
            {targetText ? (
              <p className="source-text-block">{targetText}</p>
            ) : (
              <EmptyState title={ui.t("emptyTranslation")} />
            )}

            <ReviewProposalList proposals={proposals} ui={ui} />
            {targetText ? (
              <form action={createEditorialCorrectionAction} className="translation-save-form">
                <input name="documentId" type="hidden" value={segment.documentId} />
                <input name="projectId" type="hidden" value={segment.projectId} />
                <input name="segmentId" type="hidden" value={segment.id} />
                <input name="sourceLanguage" type="hidden" value={segment.sourceLanguage} />
                <input name="sourceText" type="hidden" value={segment.sourceText} />
                <input name="targetLanguage" type="hidden" value={segment.targetLanguage} />
                <input name="targetText" type="hidden" value={targetText} />
                <input name="translationId" type="hidden" value={latestTranslation?.id ?? ""} />
                <label className="ui-input-field">
                  <span>{ui.t("correction")}</span>
                  <textarea className="ui-input" name="proposedText" required rows={5} />
                </label>
                <label className="ui-input-field">
                  <span>{ui.t("issueType")}</span>
                  <select className="ui-input ui-select" defaultValue="LANGUAGE_CORRECTION" name="issueType">
                    <option value="ORTHOGRAPHY">{ui.t("correctionOrthography")}</option>
                    <option value="PUNCTUATION">{ui.t("correctionPunctuation")}</option>
                    <option value="GRAMMAR">{ui.t("correctionGrammar")}</option>
                    <option value="SYNTAX">{ui.t("correctionSyntax")}</option>
                    <option value="TERMINOLOGY">{ui.t("correctionTerminology")}</option>
                    <option value="STYLE">{ui.t("correctionStyle")}</option>
                    <option value="LANGUAGE_CORRECTION">{ui.t("correctionEditorial")}</option>
                  </select>
                </label>
                <label className="ui-input-field">
                  <span>{ui.t("severity")}</span>
                  <select className="ui-input ui-select" defaultValue="HIGH" name="severity">
                    <option value="LOW">{ui.t("severityLow")}</option>
                    <option value="MEDIUM">{ui.t("severityMedium")}</option>
                    <option value="HIGH">{ui.t("severityHigh")}</option>
                    <option value="CRITICAL">{ui.t("severityCritical")}</option>
                  </select>
                </label>
                <label className="ui-input-field">
                  <span>{ui.t("explanation")}</span>
                  <textarea className="ui-input" name="explanation" required rows={3} />
                </label>
                <Button type="submit">{ui.t("createCorrection")}</Button>
              </form>
            ) : null}
          </article>
        </div>

        <div className="parallel-review-options" aria-label={ui.t("parallelDisplayOptions")}>
          <Badge tone="success">{ui.t("synchronizedScrolling")}</Badge>
          <Badge tone="success">{ui.t("differencesHighlighted")}</Badge>
          <Badge tone="success">{ui.t("columnsResizable")}</Badge>
          <Badge tone="success">{ui.t("versionHistoryPreserved")}</Badge>
        </div>

        <div className="review-status-row">
          <Badge tone={toneForTranslationStatus(latestTranslation?.status)}>
            {statusLabel(latestTranslation?.status, ui)}
          </Badge>
          <Badge tone={toneForWorkflowStatus(workflowStatus)}>
            {ui.status(workflowStatus)}
          </Badge>
        </div>
      </Card>

      <Card title={ui.t("attributionAuthority")}>
        <AttributionBlock latestTranslation={latestTranslation} ui={ui} />
        <p className="review-human-authority">
          {ui.t("humanAuthorityReview")}
        </p>
      </Card>
    </section>
  );
}

function ReviewProposalList({ proposals, ui }: { proposals: ReviewProposal[]; ui: EditorialUiTranslator }) {
  if (proposals.length === 0) {
    return (
      <div className="parallel-review-proposals">
        <EmptyState title={ui.t("emptyReviewProposals")} />
      </div>
    );
  }

  return (
    <div className="parallel-review-proposals" aria-label={ui.t("proposedReplacementVariants")}>
      <p className="section-kicker">{ui.t("proposedReplacementVariants")}</p>
      {proposals.map((proposal) => (
        <article className="review-proposal-card" key={proposal.proposalId}>
          <div className="review-proposal-heading">
            <strong>{correctionTypeLabel(proposal.issueType, ui)}</strong>
            <Badge tone={proposal.status === "PENDING" ? "warning" : "success"}>
              {ui.status(proposal.status)}
            </Badge>
          </div>
          <div className="review-proposal-diff" aria-label={ui.t("proposedTextChange")}>
            <del>{proposal.currentTranslation}</del>
            <ins>{proposal.proposedText}</ins>
          </div>
          <p className="review-human-authority">{proposal.explanation}</p>
          <div className="review-status-row">
            <Badge tone="info">{ui.t("confidence")} {Math.round(proposal.confidence * 100)}%</Badge>
            <Badge tone="neutral">{reviewAgentLabel(proposal.createdByAgent, ui)}</Badge>
          </div>
          {proposal.status === "PENDING" ? (
            <div className="review-action-form" aria-label={ui.t("individualProposalActions")}>
              <form action={acceptEditorialCorrectionAction}>
                <input name="documentId" type="hidden" value={proposal.documentId} />
                <input name="segmentId" type="hidden" value={proposal.segmentId} />
                <input name="proposalId" type="hidden" value={proposal.proposalId} />
                <Button type="submit">{ui.t("acceptProposal")}</Button>
              </form>
              <form action={rejectEditorialCorrectionAction}>
                <input name="documentId" type="hidden" value={proposal.documentId} />
                <input name="segmentId" type="hidden" value={proposal.segmentId} />
                <input name="proposalId" type="hidden" value={proposal.proposalId} />
                <Button type="submit" variant="secondary">{ui.t("rejectProposal")}</Button>
              </form>
            </div>
          ) : null}
          <p className="review-human-authority">
            {ui.t("useDecisionsAudited")}
          </p>
        </article>
      ))}
    </div>
  );
}

function AttributionBlock({
  latestTranslation,
  ui
}: {
  latestTranslation: WorkspaceTranslationRecord | null;
  ui: EditorialUiTranslator;
}) {
  return (
    <dl className="translation-attribution">
      <div>
        <dt>{ui.t("translatorId")}</dt>
        <dd>{latestTranslation?.translatorId ?? latestTranslation?.createdBy ?? ui.t("workflowPending")}</dd>
      </div>
      <div>
        <dt>{ui.t("translator")}</dt>
        <dd>{latestTranslation?.translatorName ?? ui.t("notRecorded")}</dd>
      </div>
      <div>
        <dt>{ui.t("reviewer")}</dt>
        <dd>{ui.t("recordedWhenApproved")}</dd>
      </div>
      <div>
        <dt>{ui.t("originalAuthor")}</dt>
        <dd>{latestTranslation?.originalAuthorName ?? ui.t("preserved")}</dd>
      </div>
    </dl>
  );
}

function ReviewReferencePanels({
  issues,
  latestTranslation,
  workspace,
  ui
}: {
  issues: ReviewIssue[];
  latestTranslation: WorkspaceTranslationRecord | null;
  workspace: ReviewWorkspaceData;
  ui: EditorialUiTranslator;
}) {
  const lexicographicSupport = latestTranslation?.metadata?.lexicographicSupport ?? [];
  const dictionaryEvidence = workspace.terminology?.dictionaryEvidence ?? [];
  const canApprove = workspace.workflow?.status === "IN_REVIEW" && Boolean(workspace.selectedDocument);
  const canAdvance = Boolean(
    workspace.workflow &&
    !["IN_REVIEW", "APPROVED", "READY_FOR_EXPORT", "EXPORTED", "BLOCKED"].includes(
      workspace.workflow.status
    )
  );
  const commonFields = {
    documentId: workspace.selectedDocument?.id ?? "",
    projectId: workspace.selectedProject?.id ?? "",
    segmentId: workspace.activeSegment?.id ?? "",
    sourceLanguage: workspace.activeSegment?.sourceLanguage ?? "",
    sourceText: workspace.activeSegment?.sourceText ?? "",
    targetLanguage: workspace.activeSegment?.targetLanguage ?? "",
    targetText: latestTranslation?.targetText ?? ""
  };

  return (
    <aside className="translation-reference-panels" aria-label={ui.t("reviewValidationPanels")}>
      <Card title={ui.t("approvalStatus")}>
        {workspace.workflowError ? <ErrorState message={workspace.workflowError} /> : null}
        <div className="reference-stack">
          <ReferenceItem
            label={ui.t("workflow")}
            text={workspace.workflow ? ui.status(workspace.workflow.status) : ui.t("noActiveWorkflow")}
          />
          <ReferenceItem
            label={ui.t("reviewerAttribution")}
            text={workspace.workflow?.approvedBy ?? workspace.workflow?.updatedBy ?? ui.t("recordedWhenApproved")}
          />
          {canAdvance ? (
            <form action={advanceReviewWorkflowAction} className="review-action-form">
              <WorkflowHiddenFields values={commonFields} />
              <Button type="submit" variant="secondary">{ui.t("advanceWorkflow")}</Button>
            </form>
          ) : null}
          {workspace.workflow?.status === "BLOCKED" ? (
            <form action={unblockReviewWorkflowAction} className="translation-save-form">
              <WorkflowHiddenFields values={commonFields} />
              <label className="ui-input-field">
                <span>{ui.t("resumeNote")}</span>
                <input className="ui-input" name="reason" required />
              </label>
              <Button type="submit" variant="secondary">{ui.t("resumeReview")}</Button>
            </form>
          ) : null}
          {canApprove ? (
            <>
              <form action={completeEditorialReviewAction} className="review-action-form">
                <WorkflowHiddenFields values={commonFields} />
                <Button disabled={!latestTranslation} type="submit" variant="secondary">
                  {ui.t("completeReview")}
                </Button>
              </form>
              <form action={approveReviewAction} className="review-action-form">
                <WorkflowHiddenFields values={commonFields} />
                <Button type="submit">{ui.t("approveCorrectedTranslation")}</Button>
              </form>
              <form action={requestEditorialChangesAction} className="translation-save-form">
                <WorkflowHiddenFields values={commonFields} />
                <label className="ui-input-field">
                  <span>{ui.t("requiredChanges")}</span>
                  <textarea className="ui-input" name="reason" required rows={3} />
                </label>
                <Button type="submit" variant="secondary">{ui.t("requestChanges")}</Button>
              </form>
            </>
          ) : null}
        </div>
      </Card>

      <Card title={ui.t("issueList")}>
        <div className="reference-stack">
          {issues.length === 0 ? (
            <EmptyState title={ui.t("emptyReviewIssues")} />
          ) : (
            issues.map((issue) => (
              <div className="review-issue-item" key={issue.id}>
                <div>
                  <strong>{issue.label}</strong>
                  <span>{issue.message}</span>
                </div>
                <Badge tone={toneForSeverity(issue.severity)}>{issue.severity}</Badge>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card title={ui.t("semanticFidelitySummary")}>
        {workspace.semanticIssuesError ? <ErrorState message={workspace.semanticIssuesError} /> : null}
        <div className="reference-stack">
          {typeof latestTranslation?.metadata?.semanticScore === "number" ? (
            <ReferenceItem
              label={ui.t("semanticScore")}
              text={`${latestTranslation.metadata.semanticScore}%`}
            />
          ) : (
            <ReferenceItem label={ui.t("semanticScore")} text={ui.t("notCalculated")} />
          )}
          {workspace.semanticIssues.length === 0 ? (
            <EmptyState title={ui.t("emptySemantic")} />
          ) : (
            workspace.semanticIssues.map((issue) => (
              <ReferenceItem
                key={issue.id}
                label={`${issue.riskLevel} ${issue.type.replace(/_/g, " ")}`}
                text={issue.message}
              />
            ))
          )}
        </div>
      </Card>

      <Card title={ui.t("glossaryTerminology")}>
        {workspace.terminologyError ? <ErrorState message={workspace.terminologyError} /> : null}
        {workspace.terminology ? (
          <div className="reference-stack">
            <Badge tone={workspace.terminology.valid ? "success" : "danger"}>
              {workspace.terminology.valid ? ui.t("terminologyCompliant") : ui.t("terminologyReviewRequired")}
            </Badge>
            {workspace.terminology.violations.length === 0 ? (
              <EmptyState title={ui.t("emptyTerminologyViolations")} />
            ) : (
              workspace.terminology.violations.map((violation) => (
                <ReferenceItem
                  key={`${violation.termId}-${violation.type}`}
                  label={violation.type.replace(/_/g, " ")}
                  text={violation.message}
                />
              ))
            )}
            <EvidenceList entries={dictionaryEvidence} title={ui.t("dictionaryEvidence")} />
          </div>
        ) : (
          <EmptyState title={ui.t("emptyTerminology")} />
        )}
      </Card>

      <Card title={ui.t("lexicographicReferences")}>
        {workspace.lexicographicReferencesError ? (
          <ErrorState message={workspace.lexicographicReferencesError} />
        ) : null}
        <div className="reference-stack">
          {workspace.lexicographicReferences.length === 0 && lexicographicSupport.length === 0 ? (
            <EmptyState title={ui.t("emptyLexicographic")} />
          ) : null}
          {workspace.lexicographicReferences.map((entry) => (
            <ReferenceItem
              key={entry.id}
              label={entry.term}
              text={`${entry.sourceLanguage.toUpperCase()}${entry.targetLanguage ? ` -> ${entry.targetLanguage.toUpperCase()}` : ""}`}
            />
          ))}
          <EvidenceList entries={lexicographicSupport} title={ui.t("translationEvidence")} />
        </div>
      </Card>

      <Card title={ui.t("recommendationStatus")}>
        <div className="reference-stack">
          <ReferenceItem
            label={ui.t("recommendationStatus")}
            text={ui.t("noSavedRecommendation")}
          />
          <ReferenceItem
            label={ui.t("authority")}
            text={ui.t("recommendationAdvisory")}
          />
        </div>
      </Card>
    </aside>
  );
}

function WorkflowHiddenFields({
  values
}: {
  values: Record<string, string>;
}) {
  return (
    <>
      {Object.entries(values).map(([name, value]) => (
        <input key={name} name={name} type="hidden" value={value} />
      ))}
    </>
  );
}

function EvidenceList({
  entries,
  title
}: {
  entries: LexicographicReference[];
  title: string;
}) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="evidence-list">
      <p className="section-kicker">{title}</p>
      {entries.map((entry) => (
        <ReferenceItem
          key={`${entry.entryId}-${entry.sourceId}`}
          label={entry.term}
          text={(entry.translationEquivalents ?? []).join(", ") || entry.authority}
        />
      ))}
    </div>
  );
}

function ReferenceItem({ label, text }: { label: string; text: string }) {
  return (
    <div className="reference-item">
      <strong>{label}</strong>
      <span>{text}</span>
    </div>
  );
}

function buildReviewIssues(workspace: ReviewWorkspaceData): ReviewIssue[] {
  const terminologyIssues = (workspace.terminology?.violations ?? []).map((violation) =>
    issueFromTerminologyViolation(violation)
  );
  const semanticIssues = workspace.semanticIssues
    .filter((issue) => issue.status === "OPEN")
    .map((issue) => ({
      id: issue.id,
      label: issue.type.replace(/_/g, " "),
      message: issue.message,
      severity: issue.riskLevel
    }));

  return [...terminologyIssues, ...semanticIssues];
}

function issueFromTerminologyViolation(violation: TerminologyViolation): ReviewIssue {
  return {
    id: `${violation.termId}-${violation.type}`,
    label: violation.type.replace(/_/g, " "),
    message: violation.message,
    severity: violation.severity ?? "HIGH"
  };
}

function findLatestTranslation(
  segment: WorkspaceSegmentRecord,
  translations: WorkspaceTranslationRecord[]
): WorkspaceTranslationRecord | null {
  const latestById = segment.latestTranslationId
    ? translations.find((translation) => translation.id === segment.latestTranslationId)
    : undefined;

  if (latestById) {
    return latestById;
  }

  return (
    translations
      .filter((translation) => translation.segmentId === segment.id)
      .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())[0] ??
    null
  );
}

function toneForTranslationStatus(status: WorkspaceTranslationRecord["status"] | undefined): BadgeTone {
  if (status === "APPROVED") {
    return "success";
  }

  if (status === "VALIDATED" || status === "SUBMITTED") {
    return "info";
  }

  return "warning";
}

function toneForWorkflowStatus(status: ReviewWorkflowStatus | undefined): BadgeTone {
  if (status === "APPROVED" || status === "READY_FOR_EXPORT" || status === "EXPORTED") {
    return "success";
  }

  if (status === "BLOCKED") {
    return "danger";
  }

  if (status === "IN_REVIEW") {
    return "info";
  }

  return "warning";
}

function toneForSeverity(severity: ReviewIssue["severity"]): BadgeTone {
  if (severity === "CRITICAL" || severity === "HIGH") {
    return "danger";
  }

  if (severity === "MEDIUM") {
    return "warning";
  }

  return "info";
}

function statusLabel(status: WorkspaceTranslationRecord["status"] | undefined, ui: EditorialUiTranslator): string {
  if (status === "APPROVED") {
    return ui.t("statusApproved");
  }

  if (status === "VALIDATED" || status === "SUBMITTED") {
    return ui.t("statusReviewed");
  }

  return ui.t("statusDraft");
}

function correctionTypeLabel(issueType: string, ui: EditorialUiTranslator): string {
  const labels: Record<string, Parameters<EditorialUiTranslator["t"]>[0]> = {
    EDITORIAL_CORRECTION: "correctionEditorial",
    GRAMMAR_AGREEMENT: "correctionGrammar",
    ORTHOGRAPHY_DIACRITICS: "correctionOrthography",
    PUNCTUATION: "correctionPunctuation",
    STYLE_REPETITION: "correctionStyle",
    SYNTAX: "correctionSyntax",
    TERMINOLOGY: "correctionTerminology"
  };

  const key = labels[issueType];
  return key ? ui.t(key) : issueType.replace(/_/g, " ");
}

function reviewAgentLabel(
  agent: ReviewProposal["createdByAgent"],
  ui: EditorialUiTranslator
): string {
  return agent === "Review Agent" ? ui.t("reviewAgent") : ui.t("editorialDecisionSubagent");
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}...`;
}
