"use client";

import { type ComponentProps, useEffect, useMemo, useState, useTransition } from "react";

import { saveEditorTranslation } from "../../lib/editor-actions";
import {
  editorQaIssues,
  editorSemanticIssues,
  editorTerminologyMatches,
  editorSuggestions,
  editorTmSuggestions
} from "./editor-mock-data";
import { EditorToolbar } from "./editor-toolbar";
import type { EditorSaveStatus, EditorSegment } from "./editor-types";
import { RightPanelContainer } from "./right-panel-container";
import { SegmentList } from "./segment-list";
import { SourceSegmentPanel } from "./source-segment-panel";
import { TargetTranslationEditor } from "./target-translation-editor";
import { EmptyState } from "../ui";

type RightPanelSignals = ComponentProps<
  typeof RightPanelContainer
>["workflowSignals"];
type ExportReadinessSignals = ComponentProps<
  typeof RightPanelContainer
>["exportReadiness"];

type MobileEditorTab = "context" | "segments" | "translation";

interface TranslationEditorWorkbenchProps {
  exportReadiness: ExportReadinessSignals;
  segments: EditorSegment[];
  workflowSignals: RightPanelSignals;
}

const mobileTabs: Array<{ id: MobileEditorTab; label: string }> = [
  { id: "segments", label: "Segments" },
  { id: "translation", label: "Translation" },
  { id: "context", label: "Context" }
];

function getInitialSaveStatus(segment: EditorSegment): EditorSaveStatus {
  return segment.target ? "Saved" : "Unsaved";
}

function mapSavedSegmentStatus(status: string | null): string {
  return status === "APPROVED" || status === "VALIDATED" ? "Approved" : "Translated";
}

export function TranslationEditorWorkbench({
  exportReadiness,
  segments: initialSegments,
  workflowSignals
}: TranslationEditorWorkbenchProps) {
  const [activeTab, setActiveTab] = useState<MobileEditorTab>("translation");
  const [segments, setSegments] = useState(initialSegments);
  const [activeSegmentId, setActiveSegmentId] = useState(initialSegments[0]?.id ?? "");
  const activeSegment = useMemo(
    () => segments.find((segment) => segment.id === activeSegmentId) ?? segments[0],
    [activeSegmentId, segments]
  );
  const [targetText, setTargetText] = useState(activeSegment?.target ?? "");
  const [saveStatus, setSaveStatus] = useState<EditorSaveStatus>(
    activeSegment ? getInitialSaveStatus(activeSegment) : "Unsaved"
  );
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!activeSegment) {
      return;
    }

    setTargetText(activeSegment.target);
    setSaveStatus(getInitialSaveStatus(activeSegment));
    setSaveError(null);
  }, [activeSegment]);

  if (!activeSegment) {
    return (
      <section className="content-panel">
        <EmptyState title="No active segment" />
      </section>
    );
  }

  const selectedSegment = activeSegment;
  const displayedSaveStatus = isPending ? "Saving" : saveStatus;
  const hasUnsavedChanges = targetText !== selectedSegment.target;
  const saveDisabled =
    displayedSaveStatus === "Saving" ||
    (!hasUnsavedChanges && displayedSaveStatus !== "Failed");

  function handleTargetChange(value: string) {
    setTargetText(value);
    setSaveError(null);
    setSaveStatus(
      value === selectedSegment.target ? getInitialSaveStatus(selectedSegment) : "Unsaved"
    );
  }

  function handleSave() {
    const nextTargetText = targetText;

    setSaveStatus("Saving");
    setSaveError(null);

    startTransition(() => {
      void saveEditorTranslation({
        segmentId: selectedSegment.id,
        targetText: nextTargetText
      }).then((result) => {
        if (result.error) {
          setSaveStatus("Failed");
          setSaveError(result.error);
          return;
        }

        setSegments((currentSegments) =>
          currentSegments.map((segment) =>
            segment.id === selectedSegment.id
              ? {
                  ...segment,
                  latestTranslationId:
                    result.translationId ?? segment.latestTranslationId,
                  status: mapSavedSegmentStatus(result.status),
                  target: result.targetText ?? nextTargetText
                }
              : segment
          )
        );
        setTargetText(result.targetText ?? nextTargetText);
        setSaveStatus("Saved");
      });
    });
  }

  return (
    <div className="editor-page">
      <EditorToolbar
        onSave={handleSave}
        saveDisabled={saveDisabled}
        saveStatus={displayedSaveStatus}
        workflowStatus={selectedSegment.status}
      />

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
          <SegmentList
            activeSegmentId={selectedSegment.id}
            onSegmentSelect={setActiveSegmentId}
            segments={segments}
          />
        </div>

        <div
          className={
            activeTab === "translation"
              ? "editor-column editor-column-center editor-column-visible"
              : "editor-column editor-column-center"
          }
        >
          <SourceSegmentPanel segment={selectedSegment} />
          <TargetTranslationEditor
            onTargetChange={handleTargetChange}
            saveError={saveError}
            saveStatus={displayedSaveStatus}
            segment={selectedSegment}
            targetText={targetText}
          />
        </div>

        <div
          className={
            activeTab === "context"
              ? "editor-column editor-column-visible"
              : "editor-column editor-column-context"
          }
        >
          <RightPanelContainer
            exportReadiness={exportReadiness}
            qaIssues={editorQaIssues}
            semanticIssues={editorSemanticIssues}
            suggestions={editorSuggestions}
            terminologyMatches={editorTerminologyMatches}
            tmSuggestions={editorTmSuggestions}
            workflowSignals={workflowSignals}
          />
        </div>
      </div>
    </div>
  );
}
