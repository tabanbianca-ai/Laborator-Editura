import Link from "next/link";
import { createDocumentSegmentAction } from "../../lib/documents-actions";
import {
  getDocument,
  listDocumentSegments
} from "../../lib/projects-documents-api";
import { Badge, Button, Card, EmptyState, ErrorState, PageHeader } from "../ui";

export async function DocumentDetailPage({
  documentId,
  segmentError
}: {
  documentId: string;
  segmentError?: string;
}) {
  const [documentResult, segmentsResult] = await Promise.all([
    getDocument(documentId),
    listDocumentSegments(documentId)
  ]);

  if (!documentResult.data) {
    return <ErrorState message={documentResult.error ?? "Document not found."} />;
  }

  const document = documentResult.data;
  const segments = segmentsResult.data ?? [];
  const unsupported = Array.isArray(document.metadata?.unsupportedDocxElements)
    ? document.metadata.unsupportedDocxElements.filter((item): item is string => typeof item === "string")
    : [];

  return (
    <main className="page-stack">
      <PageHeader
        actions={<Link className="ui-button ui-button-secondary ui-button-md" href="/documents">Back to documents</Link>}
        eyebrow="Canonical document"
        title={document.title}
      />
      {segmentError ? <ErrorState message={segmentError} /> : null}
      {segmentsResult.error ? <ErrorState message={segmentsResult.error} /> : null}

      <section className="metric-grid">
        <Card><div className="metric-card"><span>Segments</span><strong>{segments.length}</strong><Badge tone="info">Canonical</Badge></div></Card>
        <Card><div className="metric-card"><span>Language pair</span><strong>{document.sourceLanguage.toUpperCase()} → {document.targetLanguage.toUpperCase()}</strong><Badge tone="neutral">Preserved</Badge></div></Card>
        <Card><div className="metric-card"><span>Source</span><strong>{document.documentType}</strong><Badge tone="success">Immutable original</Badge></div></Card>
      </section>

      {unsupported.length > 0 ? (
        <Card title="Unsupported DOCX elements">
          <ul className="stack-list">{unsupported.map((message) => <li key={message}>{message}</li>)}</ul>
        </Card>
      ) : null}

      <Card title="Add source segment">
        <form action={createDocumentSegmentAction} className="manuscript-form">
          <input name="documentId" type="hidden" value={document.id} />
          <input name="projectId" type="hidden" value={document.projectId} />
          <label className="ui-input-field">
            <span>Source text</span>
            <textarea className="ui-input manuscript-draft-textarea" name="sourceText" required rows={4} />
          </label>
          <div className="form-actions"><Button type="submit" variant="secondary">Add segment</Button></div>
        </form>
      </Card>

      <section className="content-panel">
        <div className="section-heading"><div><p className="section-kicker">Source structure</p><h2>Canonical segments</h2></div><Badge tone="info">{segments.length}</Badge></div>
        {segments.length === 0 ? <EmptyState title="No source segments" /> : (
          <div className="stack-list">
            {segments.map((segment) => (
              <article className="signal-row" key={segment.id}>
                <div><strong>{segment.order}. {String(segment.metadata?.blockType ?? "PARAGRAPH")}</strong><p>{segment.sourceText}</p></div>
                <div className="review-status-row"><Badge tone="neutral">{segment.status}</Badge><Link href={`/translation?documentId=${encodeURIComponent(document.id)}&segmentId=${encodeURIComponent(segment.id)}`}>Translate</Link></div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
