import Link from "next/link";
import { formatLanguageLocale } from "@laborator/shared";
import { saveWorkspaceTranslationAction } from "../../lib/translation-workspace-actions";
import type {
  LexicographicReference,
  TranslationWorkspaceData,
  WorkspaceSegmentRecord,
  WorkspaceTranslationRecord
} from "../../lib/translation-workspace-client";
import { Badge, Button, Card, EmptyState, ErrorState, PageHeader } from "../ui";

interface TranslationWorkspacePageProps {
  error?: string;
  workspace: TranslationWorkspaceData;
}

export function TranslationWorkspacePage({
  error,
  workspace
}: TranslationWorkspacePageProps) {
  const activeSegment = workspace.activeSegment;
  const latestTranslation = workspace.latestTranslation;

  return (
    <main className="page-stack">
      <PageHeader eyebrow="Translation" title="Translation workspace" />

      {error ? <ErrorState message={error} /> : null}
      {workspace.projectsError ? <ErrorState message={workspace.projectsError} /> : null}
      {workspace.documentsError ? <ErrorState message={workspace.documentsError} /> : null}
      {workspace.segmentsError ? <ErrorState message={workspace.segmentsError} /> : null}
      {workspace.translationsError ? <ErrorState message={workspace.translationsError} /> : null}

      <section className="translation-selector-grid" aria-label="Project and document selection">
        <Card title="Project">
          <p className="selector-value">
            {workspace.selectedProject?.name ?? "Not selected"}
          </p>
          <select className="ui-input ui-select" disabled name="project-selector">
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
        <EmptyState title="No document selected" />
      ) : null}

      {workspace.selectedDocument && !activeSegment ? (
        <EmptyState title="No segments available" />
      ) : null}

      {activeSegment ? (
        <section className="translation-workspace-grid" aria-label="Translation workspace">
          <SegmentRail
            activeSegmentId={activeSegment.id}
            documentId={workspace.selectedDocument?.id ?? activeSegment.documentId}
            segments={workspace.segments}
            translations={workspace.translations}
          />

          <TranslationEditorPanel
            latestTranslation={latestTranslation}
            segment={activeSegment}
            semanticScore={latestTranslation?.metadata?.semanticScore}
          />

          <ReferencePanels
            latestTranslation={latestTranslation}
            workspace={workspace}
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
  translations
}: {
  activeSegmentId: string;
  documentId: string;
  segments: WorkspaceSegmentRecord[];
  translations: WorkspaceTranslationRecord[];
}) {
  return (
    <aside className="translation-segment-rail" aria-label="Segments">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Segments</p>
          <h2>Source units</h2>
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
              <span>Segment {segment.order}</span>
              <strong>{truncate(segment.sourceText, 76)}</strong>
              <Badge tone={toneForTranslationStatus(translation?.status)}>{statusLabel(translation?.status)}</Badge>
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
  semanticScore
}: {
  latestTranslation: WorkspaceTranslationRecord | null;
  segment: WorkspaceSegmentRecord;
  semanticScore?: number;
}) {
  return (
    <section className="translation-editor-panel" aria-label="Translation editor">
      <Card title="Source text">
        <p className="source-text-block">{segment.sourceText}</p>
        <div className="translation-language-row">
          <Badge tone="neutral">{formatLanguage(segment.sourceLanguage, segment.sourceLocale)}</Badge>
          <span>{formatLanguage(segment.targetLanguage, segment.targetLocale)}</span>
          <Badge tone="info">v1.0</Badge>
        </div>
      </Card>

      <Card title="Target text">
        <form action={saveWorkspaceTranslationAction} className="translation-save-form">
          <input name="documentId" type="hidden" value={segment.documentId} />
          <input name="segmentId" type="hidden" value={segment.id} />
          <input
            name="originalAuthorName"
            type="hidden"
            value={latestTranslation?.originalAuthorName ?? ""}
          />
          <label className="ui-input-field">
            <span>Translation</span>
            <textarea
              className="ui-input translation-target-textarea"
              defaultValue={latestTranslation?.targetText ?? segment.latestTargetText ?? ""}
              name="targetText"
              rows={14}
            />
          </label>
          <label className="ui-input-field">
            <span>Translator name</span>
            <input
              className="ui-input"
              defaultValue={latestTranslation?.translatorName ?? ""}
              name="translatorName"
            />
          </label>
          <div className="translation-editor-footer">
            <AttributionBlock latestTranslation={latestTranslation} />
            <div className="translation-action-cluster">
              <Badge tone={toneForTranslationStatus(latestTranslation?.status)}>
                {statusLabel(latestTranslation?.status)}
              </Badge>
              {typeof semanticScore === "number" ? (
                <Badge tone={semanticScore >= 90 ? "success" : "warning"}>{semanticScore}% semantic</Badge>
              ) : null}
              <Button type="submit">Save translation</Button>
            </div>
          </div>
        </form>
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
        <dt>Target language</dt>
        <dd>{latestTranslation ? formatLanguage(latestTranslation.targetLanguage, latestTranslation.targetLocale) : "Pending"}</dd>
      </div>
      <div>
        <dt>Original author</dt>
        <dd>{latestTranslation?.originalAuthorName ?? "Preserved"}</dd>
      </div>
    </dl>
  );
}

function ReferencePanels({
  latestTranslation,
  workspace
}: {
  latestTranslation: WorkspaceTranslationRecord | null;
  workspace: TranslationWorkspaceData;
}) {
  const lexicographicSupport = latestTranslation?.metadata?.lexicographicSupport ?? [];
  const dictionaryEvidence = workspace.terminology?.dictionaryEvidence ?? [];
  const tmProposals =
    workspace.translationMemoryProposals.length > 0
      ? workspace.translationMemoryProposals
      : latestTranslation?.metadata?.translationMemoryProposals ?? [];

  return (
    <aside className="translation-reference-panels" aria-label="Translation references">
      <Card title="Glossary / terminology">
        {workspace.terminologyError ? <ErrorState message={workspace.terminologyError} /> : null}
        {workspace.terminology ? (
          <div className="reference-stack">
            <Badge tone={workspace.terminology.valid ? "success" : "danger"}>
              {workspace.terminology.valid ? "No blocking terms" : "Terminology review"}
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
            {workspace.terminology.proposalExplanation ? (
              <ReferenceItem
                label={`Confidence ${Math.round(workspace.terminology.proposalExplanation.confidenceScore * 100)}%`}
                text={workspace.terminology.proposalExplanation.explanation}
              />
            ) : null}
            {workspace.terminology.glossaryPriority ? (
              <ReferenceItem
                label="Glossary priority"
                text={workspace.terminology.glossaryPriority.join(" > ")}
              />
            ) : null}
            {workspace.terminology.glossaryConflicts?.map((conflict) => (
              <ReferenceItem
                key={`${conflict.term}-${conflict.termIds.join("-")}`}
                label="Glossary conflict"
                text={conflict.message}
              />
            ))}
          </div>
        ) : (
          <EmptyState title="No terminology data" />
        )}
      </Card>

      <Card title="Translation Memory proposals">
        {workspace.translationMemoryProposalsError ? (
          <ErrorState message={workspace.translationMemoryProposalsError} />
        ) : null}
        <div className="reference-stack">
          {tmProposals.length === 0 ? (
            <EmptyState title="No TM proposals" />
          ) : (
            tmProposals.map((proposal) => (
              <ReferenceItem
                key={proposal.id}
                label={`${proposal.translationMemoryMatch.matchType} ${Math.round(proposal.confidenceScore * 100)}%`}
                text={`${proposal.proposedTargetText} - proposal only`}
              />
            ))
          )}
        </div>
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

      <Card title="Semantic fidelity">
        {workspace.semanticIssuesError ? <ErrorState message={workspace.semanticIssuesError} /> : null}
        <div className="reference-stack">
          {typeof latestTranslation?.metadata?.semanticScore === "number" ? (
            <ReferenceItem
              label="Semantic score"
              text={`${latestTranslation.metadata.semanticScore}%`}
            />
          ) : null}
          {latestTranslation?.semanticReportId ? (
            <ReferenceItem label="Report" text={latestTranslation.semanticReportId} />
          ) : null}
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

function statusLabel(status: WorkspaceTranslationRecord["status"] | undefined): string {
  if (status === "APPROVED") {
    return "approved";
  }

  if (status === "VALIDATED") {
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

function formatLanguage(language: string, locale?: string): string {
  return formatLanguageLocale(language, locale);
}
