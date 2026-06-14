import type { EditorSegment } from "./editor-types";
import { WorkflowStatusIndicator } from "./workflow-status-indicator";

interface SegmentListProps {
  activeSegmentId: string;
  onSegmentSelect?: (segmentId: string) => void;
  segments: EditorSegment[];
}

export function SegmentList({
  activeSegmentId,
  onSegmentSelect,
  segments
}: SegmentListProps) {
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
            <button
              aria-current={isActive ? "step" : undefined}
              className={isActive ? "segment-item segment-item-active" : "segment-item"}
              key={segment.id}
              onClick={() => onSegmentSelect?.(segment.id)}
              type="button"
            >
              <div className="segment-item-topline">
                <strong>{segment.number.toString().padStart(2, "0")}</strong>
                <WorkflowStatusIndicator status={segment.status} />
              </div>
              <p>{segment.source}</p>
              <div className="segment-score-row">
                <span>Source {segment.sourceLanguage.toUpperCase()}</span>
                <span>Target {segment.targetLanguage.toUpperCase()}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
