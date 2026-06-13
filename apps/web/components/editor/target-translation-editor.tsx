import type { EditorSegment } from "./editor-mock-data";

interface TargetTranslationEditorProps {
  segment: EditorSegment;
}

export function TargetTranslationEditor({ segment }: TargetTranslationEditorProps) {
  return (
    <section className="editor-panel target-panel" aria-label="Target translation">
      <div className="editor-panel-header">
        <p className="section-kicker">Target</p>
        <h2>Romanian translation</h2>
      </div>
      <textarea
        aria-label="Target translation text"
        className="target-textarea"
        defaultValue={segment.target}
        spellCheck={false}
      />
    </section>
  );
}
