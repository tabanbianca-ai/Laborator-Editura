import type { EditorSegment } from "./editor-types";

interface SourceSegmentPanelProps {
  segment: EditorSegment;
}

export function SourceSegmentPanel({ segment }: SourceSegmentPanelProps) {
  return (
    <section className="editor-panel source-panel" aria-label="Source segment">
      <div className="editor-panel-header">
        <p className="section-kicker">Source</p>
        <h2>Segment {segment.number}</h2>
      </div>
      <p className="source-text">{segment.source}</p>
      <dl className="segment-metadata">
        <div>
          <dt>Source</dt>
          <dd>{segment.sourceLanguage.toUpperCase()}</dd>
        </div>
        <div>
          <dt>Target</dt>
          <dd>{segment.targetLanguage.toUpperCase()}</dd>
        </div>
        <div>
          <dt>Document</dt>
          <dd>{segment.documentId}</dd>
        </div>
      </dl>
    </section>
  );
}
