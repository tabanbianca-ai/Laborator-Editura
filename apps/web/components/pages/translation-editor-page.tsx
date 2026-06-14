"use client";

import { type ComponentProps, useState } from "react";

import {
  activeSegment,
  editorQaIssues,
  editorSemanticIssues,
  editorTerminologyMatches,
  editorSegments,
  editorSuggestions,
  editorTmSuggestions
} from "../editor/editor-mock-data";
import { EditorToolbar } from "../editor/editor-toolbar";
import { RightPanelContainer } from "../editor/right-panel-container";
import { SegmentList } from "../editor/segment-list";
import { SourceSegmentPanel } from "../editor/source-segment-panel";
import { TargetTranslationEditor } from "../editor/target-translation-editor";

type MobileEditorTab = "segments" | "translation" | "context";

const mobileTabs: Array<{ id: MobileEditorTab; label: string }> = [
  { id: "segments", label: "Segments" },
  { id: "translation", label: "Translation" },
  { id: "context", label: "Context" }
];

const editorWorkflowSignals = [
  {
    label: "Current status",
    status: "IN_REVIEW",
    tone: "warning"
  },
  {
    label: "Approval authority",
    status: "Reviewer required",
    tone: "info"
  },
  {
    label: "Blocked by QA",
    status: "Yes",
    tone: "danger"
  }
] satisfies ComponentProps<typeof RightPanelContainer>["workflowSignals"];

const editorExportReadiness = [
  {
    label: "JSON Master",
    status: "Ready",
    tone: "success"
  },
  {
    label: "PDF",
    status: "Blocked",
    tone: "warning"
  },
  {
    label: "DOCX",
    status: "Waiting approval",
    tone: "info"
  }
] satisfies ComponentProps<typeof RightPanelContainer>["exportReadiness"];

export function TranslationEditorPage() {
  const [activeTab, setActiveTab] = useState<MobileEditorTab>("translation");

  return (
    <div className="editor-page">
      <EditorToolbar saveStatus="Saved" workflowStatus={activeSegment.status} />

      <div className="editor-mobile-tabs" aria-label="Editor mobile sections">
        {mobileTabs.map((tab) => (
          <button
            aria-pressed={activeTab === tab.id}
            className={
              activeTab === tab.id ? "editor-tab editor-tab-active" : "editor-tab"
            }
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="editor-workbench">
        <div
          className={
            activeTab === "segments"
              ? "editor-column editor-column-visible"
              : "editor-column editor-column-segments"
          }
        >
          <SegmentList activeSegmentId={activeSegment.id} segments={editorSegments} />
        </div>

        <div
          className={
            activeTab === "translation"
              ? "editor-column editor-column-center editor-column-visible"
              : "editor-column editor-column-center"
          }
        >
          <SourceSegmentPanel segment={activeSegment} />
          <TargetTranslationEditor segment={activeSegment} />
        </div>

        <div
          className={
            activeTab === "context"
              ? "editor-column editor-column-visible"
              : "editor-column editor-column-context"
          }
        >
          <RightPanelContainer
            exportReadiness={editorExportReadiness}
            qaIssues={editorQaIssues}
            semanticIssues={editorSemanticIssues}
            suggestions={editorSuggestions}
            terminologyMatches={editorTerminologyMatches}
            tmSuggestions={editorTmSuggestions}
            workflowSignals={editorWorkflowSignals}
          />
        </div>
      </div>
    </div>
  );
}
