import { Button } from "../ui";
import type { EditorSaveStatus } from "./editor-types";
import { SaveStatusIndicator } from "./save-status-indicator";
import { WorkflowStatusIndicator } from "./workflow-status-indicator";

interface EditorToolbarProps {
  onSave?: () => void;
  saveDisabled?: boolean;
  saveStatus: EditorSaveStatus;
  workflowStatus: string;
}

export function EditorToolbar({
  onSave,
  saveDisabled = true,
  saveStatus,
  workflowStatus
}: EditorToolbarProps) {
  return (
    <section className="editor-toolbar" aria-label="Editor toolbar">
      <div className="editor-toolbar-actions">
        <Button
          disabled={saveDisabled}
          onClick={onSave}
          size="sm"
          type="button"
          variant="secondary"
        >
          Save
        </Button>
        <Button disabled size="sm" variant="ghost">
          QA
        </Button>
        <Button disabled size="sm" variant="ghost">
          TM
        </Button>
      </div>

      <div className="editor-toolbar-status">
        <SaveStatusIndicator status={saveStatus} />
        <WorkflowStatusIndicator status={workflowStatus} />
      </div>
    </section>
  );
}
