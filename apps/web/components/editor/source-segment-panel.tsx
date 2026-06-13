import type { EditorSegment } from "./editor-mock-data";

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
          <dd>ES</dd>
        </div>
        <div>
          <dt>Target</dt>
          <dd>RO</dd>
        </div>
        <div>
          <dt>Domain</dt>
          <dd>Spiritism</dd>
        </div>
      </dl>
    </section>
  );
}
