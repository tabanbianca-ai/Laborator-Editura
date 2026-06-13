import type { EditorSegment } from "./editor-mock-data";
import { WorkflowStatusIndicator } from "./workflow-status-indicator";

interface SegmentListProps {
  activeSegmentId: string;
  segments: EditorSegment[];
}

export function SegmentList({ activeSegmentId, segments }: SegmentListProps) {
  return (
    <section className="editor-panel segment-list" aria-label="Segment list">
      <div className="editor-panel-header">
        <p className="section-kicker">Segments</p>
        <h2>{segments.length} segments</h2>
      </div>

      <div className="segment-list-items">
        {segments.map((segment) => {
          const isActive = segment.id === activeSegmentId;

          return (
            <article
              aria-current={isActive ? "step" : undefined}
              className={isActive ? "segment-item segment-item-active" : "segment-item"}
              key={segment.id}
            >
              <div className="segment-item-topline">
                <strong>{segment.number.toString().padStart(2, "0")}</strong>
                <WorkflowStatusIndicator status={segment.status} />
              </div>
              <p>{segment.source}</p>
              <div className="segment-score-row">
                <span>Fidelity {segment.fidelityScore}%</span>
                <span>Terminology {segment.terminologyScore}%</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
