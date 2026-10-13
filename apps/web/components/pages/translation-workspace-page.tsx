import Link from "next/link";
import { formatLanguageLocale } from "@laborator/shared";
import {
  advanceTranslationWorkflowAction,
  reviseWorkspaceSourceAction,
  saveWorkspaceTranslationAction
} from "../../lib/translation-workspace-actions";
import type {
  LexicographicReference,
  TranslationWorkspaceData,
  WorkspaceSegmentRecord,
  WorkspaceTranslationRecord
} from "../../lib/translation-workspace-client";
import { Badge, Button, Card, EmptyState, ErrorState, PageHeader } from "../ui";
import { createEditorialUiTranslator, type EditorialUiTranslator } from "../../lib/ui-i18n";
import { TranslationTargetEditor } from "../translation/translation-target-editor";

interface TranslationWorkspacePageProps {
  error?: string;
  platformLanguage?: string;
  workspace: TranslationWorkspaceData;
}

export function TranslationWorkspacePage({
  error,
  platformLanguage,
  workspace
}: TranslationWorkspacePageProps) {
  const ui = createEditorialUiTranslator(platformLanguage);
  const activeSegment = workspace.activeSegment;
  const latestTranslation = workspace.latestTranslation;

  return (
    <main className="page-stack">
      <PageHeader eyebrow={ui.t("translation")} title={ui.t("translationWorkspace")} />

      {error ? <ErrorState message={error} /> : null}
      {workspace.projectsError ? <ErrorState message={workspace.projectsError} /> : null}
      {workspace.documentsError ? <ErrorState message={workspace.documentsError} /> : null}
      {workspace.segmentsError ? <ErrorState message={workspace.segmentsError} /> : null}
      {workspace.translationsError ? <ErrorState message={workspace.translationsError} /> : null}

      <section className="translation-selector-grid" aria-label={ui.t("projectDocumentSelection")}>
        <Card title={ui.t("project")}>
          <p className="selector-value">
            {workspace.selectedProject?.name ?? ui.t("notSelected")}
          </p>
          <select className="ui-input ui-select" disabled name="project-selector">
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
                href={`/translation?documentId=${encodeURIComponent(document.id)}`}
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
        <EmptyState title={ui.t("emptySegments")} />
      ) : null}

      {activeSegment ? (
        <section className="translation-workspace-grid" aria-label={ui.t("translationWorkspace")}>
          <SegmentRail
            activeSegmentId={activeSegment.id}
            documentId={workspace.selectedDocument?.id ?? activeSegment.documentId}
            segments={workspace.segments}
            translations={workspace.translations}
            ui={ui}
          />

          <TranslationEditorPanel
            latestTranslation={latestTranslation}
            segment={activeSegment}
            semanticScore={latestTranslation?.metadata?.semanticScore}
            translations={workspace.translations.filter(
              (translation) => translation.segmentId === activeSegment.id
            )}
            workflow={workspace.workflow}
            domain={workspace.selectedProject?.domain}
            ui={ui}
          />

          <ReferencePanels
            latestTranslation={latestTranslation}
            workspace={workspace}
            ui={ui}
          />
        </section>
      ) : null}
    </main>
  );
}

function SegmentRail({
  activeSegmentId,
  documentId,
  segments,
  translations,
  ui
}: {
  activeSegmentId: string;
  documentId: string;
  segments: WorkspaceSegmentRecord[];
  translations: WorkspaceTranslationRecord[];
  ui: EditorialUiTranslator;
}) {
  return (
    <aside className="translation-segment-rail" aria-label={ui.t("segments")}>
      <div className="section-heading">
        <div>
          <p className="section-kicker">{ui.t("segments")}</p>
          <h2>{ui.t("sourceUnits")}</h2>
        </div>
        <Badge tone="info">{segments.length}</Badge>
      </div>
      <div className="translation-segment-list">
        {segments.map((segment) => {
          const translation = findLatestTranslation(segment, translations);

          return (
            <Link
              className={
                segment.id === activeSegmentId
                  ? "translation-segment-card translation-segment-card-active"
                  : "translation-segment-card"
              }
              href={`/translation?documentId=${encodeURIComponent(documentId)}&segmentId=${encodeURIComponent(
                segment.id
              )}`}
              key={segment.id}
            >
              <span>{ui.t("segment")} {segment.order}</span>
              <strong>{truncate(segment.sourceText, 76)}</strong>
              <Badge tone={toneForTranslationStatus(translation?.status)}>{statusLabel(translation?.status, ui)}</Badge>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

function TranslationEditorPanel({
  latestTranslation,
  segment,
  semanticScore,
  translations,
  workflow,
  domain,
  ui
}: {
  latestTranslation: WorkspaceTranslationRecord | null;
  segment: WorkspaceSegmentRecord;
  semanticScore?: number;
  translations: WorkspaceTranslationRecord[];
  workflow: TranslationWorkspaceData["workflow"];
  domain?: string;
  ui: EditorialUiTranslator;
}) {
  return (
    <section className="translation-editor-panel" aria-label={ui.t("translationWorkspace")}>
      <Card title={ui.t("sourceText")}>
        <p className="source-text-block">{segment.sourceText}</p>
        <div className="translation-language-row">
          <Badge tone="neutral">{formatLanguage(segment.sourceLanguage, segment.sourceLocale)}</Badge>
          <span>{formatLanguage(segment.targetLanguage, segment.targetLocale)}</span>
          <Badge tone="info">v1.0</Badge>
        </div>
        <details>
          <summary>{ui.t("authorizedSourceRevision")}</summary>
          <form action={reviseWorkspaceSourceAction} className="translation-save-form">
            <input name="documentId" type="hidden" value={segment.documentId} />
            <input name="segmentId" type="hidden" value={segment.id} />
            <label className="ui-input-field">
              <span>{ui.t("sourceText")}</span>
              <textarea className="ui-input" defaultValue={segment.sourceText} name="sourceText" required rows={6} />
            </label>
            <label className="ui-input-field">
              <span>{ui.t("explanation")}</span>
              <input className="ui-input" name="reason" required />
            </label>
            <Button type="submit" variant="secondary">{ui.t("saveSourceRevision")}</Button>
          </form>
          <p className="review-human-authority">
            {ui.t("sourceRevisionHistory")}
          </p>
        </details>
      </Card>

      <Card title={ui.t("workflowHistory")}>
        <div className="review-status-row">
          <Badge tone={workflow?.status === "IN_REVIEW" ? "success" : "info"}>
            {workflow ? ui.status(workflow.status) : ui.t("workflowUnavailable")}
          </Badge>
          {workflow && ["IN_TRANSLATION", "IN_QA", "IN_SEMANTIC_REVIEW"].includes(workflow.status) ? (
            <form action={advanceTranslationWorkflowAction}>
              <input name="documentId" type="hidden" value={segment.documentId} />
              <input name="projectId" type="hidden" value={segment.projectId} />
              <input name="segmentId" type="hidden" value={segment.id} />
              <Button type="submit" variant="secondary">{ui.t("advanceWorkflow")}</Button>
            </form>
          ) : null}
        </div>
        <div className="reference-stack">
          {[...translations]
            .sort((left, right) =>
              Number(right.metadata?.translationVersion ?? 0) - Number(left.metadata?.translationVersion ?? 0)
            )
            .map((translation) => (
              <ReferenceItem
                key={translation.id}
                label={`${ui.t("version")} ${translation.metadata?.translationVersion ?? 1} - ${ui.status(translation.status)}`}
                text={translation.targetText}
              />
            ))}
        </div>
      </Card>

      <Card title={ui.t("targetText")}>
        <form action={saveWorkspaceTranslationAction} className="translation-save-form">
          <input name="documentId" type="hidden" value={segment.documentId} />
          <input name="segmentId" type="hidden" value={segment.id} />
          <input
            name="originalAuthorName"
            type="hidden"
            value={latestTranslation?.originalAuthorName ?? ""}
          />
          <TranslationTargetEditor
            aiLabels={{
              authorization: ui.t("aiAuthorization"),
              confidence: ui.t("confidence"),
              explanation: ui.t("explanation"),
              generate: ui.t("aiGenerate"),
              proposal: ui.t("aiProposal"),
              proposalOnly: ui.t("aiProposalOnly"),
              unavailable: ui.t("aiUnavailable"),
              useProposal: ui.t("aiUseProposal")
            }}
            domain={domain}
            initialTargetText={latestTranslation?.targetText ?? segment.latestTargetText ?? ""}
            segmentId={segment.id}
            targetTextLabel={ui.t("translation")}
          />
          <label className="ui-input-field">
            <span>{ui.t("translatorName")}</span>
            <input
              className="ui-input"
              defaultValue={latestTranslation?.translatorName ?? ""}
              name="translatorName"
            />
          </label>
          <div className="translation-editor-footer">
            <AttributionBlock latestTranslation={latestTranslation} ui={ui} />
            <div className="translation-action-cluster">
              <Badge tone={toneForTranslationStatus(latestTranslation?.status)}>
                {statusLabel(latestTranslation?.status, ui)}
              </Badge>
              {typeof semanticScore === "number" ? (
                <Badge tone={semanticScore >= 90 ? "success" : "warning"}>{semanticScore}% semantic</Badge>
              ) : null}
              <Button type="submit">{ui.t("saveTranslation")}</Button>
            </div>
          </div>
        </form>
      </Card>
    </section>
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
        <dt>{ui.t("targetLanguage")}</dt>
        <dd>{latestTranslation ? formatLanguage(latestTranslation.targetLanguage, latestTranslation.targetLocale) : ui.t("workflowPending")}</dd>
      </div>
      <div>
        <dt>{ui.t("originalAuthor")}</dt>
        <dd>{latestTranslation?.originalAuthorName ?? ui.t("preserved")}</dd>
      </div>
    </dl>
  );
}

function ReferencePanels({
  latestTranslation,
  workspace,
  ui
}: {
  latestTranslation: WorkspaceTranslationRecord | null;
  workspace: TranslationWorkspaceData;
  ui: EditorialUiTranslator;
}) {
  const lexicographicSupport = latestTranslation?.metadata?.lexicographicSupport ?? [];
  const dictionaryEvidence = workspace.terminology?.dictionaryEvidence ?? [];
  const tmProposals =
    workspace.translationMemoryProposals.length > 0
      ? workspace.translationMemoryProposals
      : latestTranslation?.metadata?.translationMemoryProposals ?? [];

  return (
    <aside className="translation-reference-panels" aria-label={ui.t("translationReferences")}>
      <Card title={ui.t("glossaryTerminology")}>
        {workspace.terminologyError ? <ErrorState message={workspace.terminologyError} /> : null}
        {workspace.terminology ? (
          <div className="reference-stack">
            <Badge tone={workspace.terminology.valid ? "success" : "danger"}>
              {workspace.terminology.valid ? ui.t("noBlockingTerms") : ui.t("terminologyReview")}
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
            {workspace.terminology.proposalExplanation ? (
              <ReferenceItem
                label={`${ui.t("confidence")} ${Math.round(workspace.terminology.proposalExplanation.confidenceScore * 100)}%`}
                text={workspace.terminology.proposalExplanation.explanation}
              />
            ) : null}
            {workspace.terminology.glossaryPriority ? (
              <ReferenceItem
                label={ui.t("glossaryPriority")}
                text={workspace.terminology.glossaryPriority.join(" > ")}
              />
            ) : null}
            {workspace.terminology.glossaryConflicts?.map((conflict) => (
              <ReferenceItem
                key={`${conflict.term}-${conflict.termIds.join("-")}`}
                label={ui.t("glossaryConflict")}
                text={conflict.message}
              />
            ))}
          </div>
        ) : (
          <EmptyState title={ui.t("emptyTerminology")} />
        )}
      </Card>

      <Card title={ui.t("translationMemoryProposals")}>
        {workspace.translationMemoryProposalsError ? (
          <ErrorState message={workspace.translationMemoryProposalsError} />
        ) : null}
        <div className="reference-stack">
          {tmProposals.length === 0 ? (
            <EmptyState title={ui.t("emptyTm")} />
          ) : (
            tmProposals.map((proposal) => (
              <ReferenceItem
                key={proposal.id}
                label={`${proposal.translationMemoryMatch.matchType} ${Math.round(proposal.confidenceScore * 100)}%`}
                text={`${proposal.proposedTargetText} - ${ui.t("aiProposalOnly")}`}
              />
            ))
          )}
        </div>
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

      <Card title={ui.t("semanticFidelity")}>
        {workspace.semanticIssuesError ? <ErrorState message={workspace.semanticIssuesError} /> : null}
        <div className="reference-stack">
          {typeof latestTranslation?.metadata?.semanticScore === "number" ? (
            <ReferenceItem
              label={ui.t("semanticScore")}
              text={`${latestTranslation.metadata.semanticScore}%`}
            />
          ) : null}
          {latestTranslation?.semanticReportId ? (
            <ReferenceItem label={ui.t("report")} text={latestTranslation.semanticReportId} />
          ) : null}
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

function toneForTranslationStatus(status: WorkspaceTranslationRecord["status"] | undefined) {
  if (status === "APPROVED") {
    return "success";
  }

  if (status === "VALIDATED") {
    return "info";
  }

  return "warning";
}

function statusLabel(status: WorkspaceTranslationRecord["status"] | undefined, ui: EditorialUiTranslator): string {
  if (status === "APPROVED") {
    return ui.t("statusApproved");
  }

  if (status === "VALIDATED") {
    return ui.t("statusReviewed");
  }

  return ui.t("statusDraft");
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1)}...`;
}

function formatLanguage(language: string, locale?: string): string {
  return formatLanguageLocale(language, locale);
}
