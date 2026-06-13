import { Button } from "../ui";
import { SaveStatusIndicator } from "./save-status-indicator";
import { WorkflowStatusIndicator } from "./workflow-status-indicator";

interface EditorToolbarProps {
  saveStatus: "Saved" | "Saving" | "Unsaved";
  workflowStatus: string;
}

export function EditorToolbar({
  saveStatus,
  workflowStatus
}: EditorToolbarProps) {
  return (
    <section className="editor-toolbar" aria-label="Editor toolbar">
      <div className="editor-toolbar-actions">
        <Button disabled size="sm" variant="secondary">
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
