import type { EditorSaveStatus, EditorSegment } from "./editor-types";

interface TargetTranslationEditorProps {
  onTargetChange: (value: string) => void;
  saveError?: string | null;
  saveStatus: EditorSaveStatus;
  segment: EditorSegment;
  targetText: string;
}

export function TargetTranslationEditor({
  onTargetChange,
  saveError,
  saveStatus,
  segment,
  targetText
}: TargetTranslationEditorProps) {
  return (
    <section className="editor-panel target-panel" aria-label="Target translation">
      <div className="editor-panel-header">
        <p className="section-kicker">Target</p>
        <h2>{segment.targetLanguage.toUpperCase()} translation</h2>
      </div>
      <textarea
        aria-label="Target translation text"
        className="target-textarea"
        onChange={(event) => onTargetChange(event.target.value)}
        spellCheck={false}
        value={targetText}
      />
      <p className="translation-save-feedback" role={saveError ? "alert" : "status"}>
        {saveError ?? `Save status: ${saveStatus}`}
      </p>
    </section>
  );
}
