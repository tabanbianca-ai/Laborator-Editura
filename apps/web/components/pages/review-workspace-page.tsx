import type { ComponentProps } from "react";
import Link from "next/link";
import { approveReviewAction } from "../../lib/review-workspace-actions";
import type {
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

type BadgeTone = ComponentProps<typeof Badge>["tone"];

interface ReviewWorkspacePageProps {
  error?: string;
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
  workspace
}: ReviewWorkspacePageProps) {
  const activeSegment = workspace.activeSegment;
  const latestTranslation = workspace.latestTranslation;
  const issues = buildReviewIssues(workspace);

  return (
    <main className="page-stack">
      <PageHeader eyebrow="Editorial review" title="Review & approval workspace" />

      {error ? <ErrorState message={error} /> : null}
      {workspace.projectsError ? <ErrorState message={workspace.projectsError} /> : null}
      {workspace.documentsError ? <ErrorState message={workspace.documentsError} /> : null}
      {workspace.segmentsError ? <ErrorState message={workspace.segmentsError} /> : null}
      {workspace.translationsError ? <ErrorState message={workspace.translationsError} /> : null}

      <section className="translation-selector-grid" aria-label="Review document selection">
        <Card title="Project">
          <p className="selector-value">
            {workspace.selectedProject?.name ?? "Not selected"}
          </p>
          <select className="ui-input ui-select" disabled name="review-project-selector">
            <option>
              {workspace.selectedProject?.name ?? "Project selector"}
            </option>
          </select>
        </Card>
        <Card title="Document">
          <p className="selector-value">
            {workspace.selectedDocument?.title ?? "Not selected"}
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
        <EmptyState title="No document selected" />
      ) : null}

      {workspace.selectedDocument && !activeSegment ? (
        <EmptyState title="No segments available for review" />
      ) : null}

      {activeSegment ? (
        <section className="translation-workspace-grid" aria-label="Editorial review workspace">
          <ReviewSegmentRail
            activeSegmentId={activeSegment.id}
            documentId={workspace.selectedDocument?.id ?? activeSegment.documentId}
            segments={workspace.segments}
            semanticIssues={workspace.semanticIssues}
            translations={workspace.translations}
          />

          <ReviewComparisonPanel
            latestTranslation={latestTranslation}
            segment={activeSegment}
            workflowStatus={workspace.workflow?.status}
          />

          <ReviewReferencePanels
            issues={issues}
            latestTranslation={latestTranslation}
            workspace={workspace}
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
  translations
}: {
  activeSegmentId: string;
  documentId: string;
  segments: WorkspaceSegmentRecord[];
  semanticIssues: SemanticIssue[];
  translations: WorkspaceTranslationRecord[];
}) {
  return (
    <aside className="translation-segment-rail" aria-label="Review segments">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Segments</p>
          <h2>Review queue</h2>
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
              <span>Segment {segment.order}</span>
              <strong>{truncate(segment.sourceText, 76)}</strong>
              <div className="review-segment-badges">
                <Badge tone={toneForTranslationStatus(translation?.status)}>
                  {statusLabel(translation?.status)}
                </Badge>
                {blockingIssues.length > 0 ? (
                  <Badge tone="danger">{blockingIssues.length} issue</Badge>
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
  segment,
  workflowStatus
}: {
  latestTranslation: WorkspaceTranslationRecord | null;
  segment: WorkspaceSegmentRecord;
  workflowStatus?: ReviewWorkflowStatus;
}) {
  return (
    <section className="translation-editor-panel" aria-label="Source and target comparison">
      <Card title="Source text">
        <p className="source-text-block">{segment.sourceText}</p>
        <div className="translation-language-row">
          <Badge tone="neutral">{segment.sourceLanguage.toUpperCase()}</Badge>
          <span>{segment.targetLanguage.toUpperCase()}</span>
        </div>
      </Card>

      <Card title="Translated text">
        {latestTranslation?.targetText ? (
          <p className="source-text-block">{latestTranslation.targetText}</p>
        ) : (
          <EmptyState title="No translation submitted" />
        )}
        <div className="review-status-row">
          <Badge tone={toneForTranslationStatus(latestTranslation?.status)}>
            {statusLabel(latestTranslation?.status)}
          </Badge>
          <Badge tone={toneForWorkflowStatus(workflowStatus)}>
            {workflowStatus ? workflowStatus.replace(/_/g, " ") : "workflow pending"}
          </Badge>
        </div>
      </Card>

      <Card title="Attribution and authority">
        <AttributionBlock latestTranslation={latestTranslation} />
        <p className="review-human-authority">
          Human Final Authority: AI recommendations and validation panels are advisory.
        </p>
      </Card>
    </section>
  );
}

function AttributionBlock({
  latestTranslation
}: {
  latestTranslation: WorkspaceTranslationRecord | null;
}) {
  return (
    <dl className="translation-attribution">
      <div>
        <dt>Translator ID</dt>
        <dd>{latestTranslation?.translatorId ?? latestTranslation?.createdBy ?? "Pending"}</dd>
      </div>
      <div>
        <dt>Translator</dt>
        <dd>{latestTranslation?.translatorName ?? "Not recorded"}</dd>
      </div>
      <div>
        <dt>Reviewer</dt>
        <dd>Recorded on human approval</dd>
      </div>
      <div>
        <dt>Original author</dt>
        <dd>{latestTranslation?.originalAuthorName ?? "Preserved"}</dd>
      </div>
    </dl>
  );
}

function ReviewReferencePanels({
  issues,
  latestTranslation,
  workspace
}: {
  issues: ReviewIssue[];
  latestTranslation: WorkspaceTranslationRecord | null;
  workspace: ReviewWorkspaceData;
}) {
  const lexicographicSupport = latestTranslation?.metadata?.lexicographicSupport ?? [];
  const dictionaryEvidence = workspace.terminology?.dictionaryEvidence ?? [];
  const canApprove = workspace.workflow?.status === "IN_REVIEW" && Boolean(workspace.selectedDocument);

  return (
    <aside className="translation-reference-panels" aria-label="Review validation panels">
      <Card title="Approval status">
        {workspace.workflowError ? <ErrorState message={workspace.workflowError} /> : null}
        <div className="reference-stack">
          <ReferenceItem
            label="Workflow"
            text={workspace.workflow?.status?.replace(/_/g, " ") ?? "No active workflow status"}
          />
          <ReferenceItem
            label="Reviewer attribution"
            text={workspace.workflow?.approvedBy ?? workspace.workflow?.updatedBy ?? "Recorded when approved"}
          />
          <form action={approveReviewAction} className="review-action-form">
            <input name="documentId" type="hidden" value={workspace.selectedDocument?.id ?? ""} />
            <input name="projectId" type="hidden" value={workspace.selectedProject?.id ?? ""} />
            <input name="segmentId" type="hidden" value={workspace.activeSegment?.id ?? ""} />
            <Button disabled={!canApprove} type="submit">Approve review</Button>
            <Button disabled type="button" variant="secondary">Request changes</Button>
          </form>
        </div>
      </Card>

      <Card title="Issue list">
        <div className="reference-stack">
          {issues.length === 0 ? (
            <EmptyState title="No open review issues" />
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

      <Card title="Semantic fidelity summary">
        {workspace.semanticIssuesError ? <ErrorState message={workspace.semanticIssuesError} /> : null}
        <div className="reference-stack">
          {typeof latestTranslation?.metadata?.semanticScore === "number" ? (
            <ReferenceItem
              label="Semantic score"
              text={`${latestTranslation.metadata.semanticScore}%`}
            />
          ) : (
            <ReferenceItem label="Semantic score" text="Not calculated" />
          )}
          {workspace.semanticIssues.length === 0 ? (
            <EmptyState title="No semantic issues" />
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

      <Card title="Terminology / glossary validation">
        {workspace.terminologyError ? <ErrorState message={workspace.terminologyError} /> : null}
        {workspace.terminology ? (
          <div className="reference-stack">
            <Badge tone={workspace.terminology.valid ? "success" : "danger"}>
              {workspace.terminology.valid ? "Terminology compliant" : "Terminology review required"}
            </Badge>
            {workspace.terminology.violations.length === 0 ? (
              <EmptyState title="No terminology violations" />
            ) : (
              workspace.terminology.violations.map((violation) => (
                <ReferenceItem
                  key={`${violation.termId}-${violation.type}`}
                  label={violation.type.replace(/_/g, " ")}
                  text={violation.message}
                />
              ))
            )}
            <EvidenceList entries={dictionaryEvidence} title="Dictionary evidence" />
          </div>
        ) : (
          <EmptyState title="No terminology data" />
        )}
      </Card>

      <Card title="Lexicographic references">
        {workspace.lexicographicReferencesError ? (
          <ErrorState message={workspace.lexicographicReferencesError} />
        ) : null}
        <div className="reference-stack">
          {workspace.lexicographicReferences.length === 0 && lexicographicSupport.length === 0 ? (
            <EmptyState title="No lexicographic references" />
          ) : null}
          {workspace.lexicographicReferences.map((entry) => (
            <ReferenceItem
              key={entry.id}
              label={entry.term}
              text={`${entry.sourceLanguage.toUpperCase()}${entry.targetLanguage ? ` -> ${entry.targetLanguage.toUpperCase()}` : ""}`}
            />
          ))}
          <EvidenceList entries={lexicographicSupport} title="Translation evidence" />
        </div>
      </Card>

      <Card title="Editorial decision recommendations">
        <div className="reference-stack">
          <ReferenceItem
            label="Recommendation status"
            text="No saved editorial recommendation selected."
          />
          <ReferenceItem
            label="Authority"
            text="Recommendations remain advisory until an authorized human approves them."
          />
        </div>
      </Card>
    </aside>
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

function statusLabel(status: WorkspaceTranslationRecord["status"] | undefined): string {
  if (status === "APPROVED") {
    return "approved";
  }

  if (status === "VALIDATED" || status === "SUBMITTED") {
    return "reviewed";
  }

  return "draft";
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}...`;
}
