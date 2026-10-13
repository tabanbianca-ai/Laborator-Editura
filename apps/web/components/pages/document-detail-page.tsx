import Link from "next/link";
import { createDocumentSegmentAction } from "../../lib/documents-actions";
import {
  getDocument,
  listDocumentSegments
} from "../../lib/projects-documents-api";
import { Badge, Button, Card, EmptyState, ErrorState, PageHeader } from "../ui";
import { createEditorialUiTranslator } from "../../lib/ui-i18n";

export async function DocumentDetailPage({
  documentId,
  platformLanguage,
  segmentError
}: {
  documentId: string;
  platformLanguage?: string;
  segmentError?: string;
}) {
  const ui = createEditorialUiTranslator(platformLanguage);
  const [documentResult, segmentsResult] = await Promise.all([
    getDocument(documentId),
    listDocumentSegments(documentId)
  ]);

  if (!documentResult.data) {
    return <ErrorState message={documentResult.error ?? ui.t("documentNotFound")} />;
  }

  const document = documentResult.data;
  const segments = segmentsResult.data ?? [];
  const unsupported = Array.isArray(document.metadata?.unsupportedDocxElements)
    ? document.metadata.unsupportedDocxElements.filter((item): item is string => typeof item === "string")
    : [];

  return (
    <main className="page-stack">
      <PageHeader
        actions={<Link className="ui-button ui-button-secondary ui-button-md" href="/documents">{ui.t("backToDocuments")}</Link>}
        eyebrow={ui.t("canonicalDocument")}
        title={document.title}
      />
      {segmentError ? <ErrorState message={segmentError} /> : null}
      {segmentsResult.error ? <ErrorState message={segmentsResult.error} /> : null}

      <section className="metric-grid">
        <Card><div className="metric-card"><span>{ui.t("segments")}</span><strong>{segments.length}</strong><Badge tone="info">{ui.t("canonical")}</Badge></div></Card>
        <Card><div className="metric-card"><span>{ui.t("languagePair")}</span><strong>{document.sourceLanguage.toUpperCase()} → {document.targetLanguage.toUpperCase()}</strong><Badge tone="neutral">{ui.t("preserved")}</Badge></div></Card>
        <Card><div className="metric-card"><span>{ui.t("source")}</span><strong>{document.documentType}</strong><Badge tone="success">{ui.t("immutableOriginal")}</Badge></div></Card>
      </section>

      {unsupported.length > 0 ? (
        <Card title={ui.t("unsupportedDocx")}>
          <ul className="stack-list">{unsupported.map((message) => <li key={message}>{message}</li>)}</ul>
        </Card>
      ) : null}

      <Card title={ui.t("addSourceSegment")}>
        <form action={createDocumentSegmentAction} className="manuscript-form">
          <input name="documentId" type="hidden" value={document.id} />
          <input name="projectId" type="hidden" value={document.projectId} />
          <label className="ui-input-field">
            <span>{ui.t("sourceText")}</span>
            <textarea className="ui-input manuscript-draft-textarea" name="sourceText" required rows={4} />
          </label>
          <div className="form-actions"><Button type="submit" variant="secondary">{ui.t("addSegment")}</Button></div>
        </form>
      </Card>

      <section className="content-panel">
        <div className="section-heading"><div><p className="section-kicker">{ui.t("sourceStructure")}</p><h2>{ui.t("canonicalSegments")}</h2></div><Badge tone="info">{segments.length}</Badge></div>
        {segments.length === 0 ? <EmptyState title={ui.t("emptySourceSegments")} /> : (
          <div className="stack-list">
            {segments.map((segment) => (
              <article className="signal-row" key={segment.id}>
                <div><strong>{segment.order}. {String(segment.metadata?.blockType ?? "PARAGRAPH")}</strong><p>{segment.sourceText}</p></div>
                <div className="review-status-row"><Badge tone="neutral">{ui.status(segment.status)}</Badge><Link href={`/translation?documentId=${encodeURIComponent(document.id)}&segmentId=${encodeURIComponent(segment.id)}`}>{ui.t("translate")}</Link></div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
