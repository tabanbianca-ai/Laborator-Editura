import type { ComponentProps } from "react";

import {
  listSegments,
  listTranslations,
  type SegmentRecord,
  type SegmentTranslationRecord
} from "../../lib/editor-api";
import type { EditorSegment } from "../editor/editor-types";
import { RightPanelContainer } from "../editor/right-panel-container";
import { TranslationEditorWorkbench } from "../editor/translation-editor-workbench";
import { EmptyState, ErrorState } from "../ui";

interface TranslationEditorPageProps {
  documentId?: string;
}

const editorWorkflowSignals = [
  {
    label: "Current status",
    status: "Loaded from document segments",
    tone: "info"
  },
  {
    label: "Approval authority",
    status: "Reviewer required",
    tone: "info"
  },
  {
    label: "Blocking checks",
    status: "Not connected in this phase",
    tone: "neutral"
  }
] satisfies ComponentProps<typeof RightPanelContainer>["workflowSignals"];

const editorExportReadiness = [
  {
    label: "JSON Master",
    status: "Not connected in this phase",
    tone: "neutral"
  },
  {
    label: "PDF",
    status: "Not connected in this phase",
    tone: "neutral"
  },
  {
    label: "DOCX",
    status: "Not connected in this phase",
    tone: "neutral"
  }
] satisfies ComponentProps<typeof RightPanelContainer>["exportReadiness"];

function mapSegmentStatus(status: SegmentRecord["status"]): string {
  switch (status) {
    case "APPROVED":
      return "Approved";
    case "IN_REVIEW":
      return "In Review";
    case "IN_TRANSLATION":
      return "In Translation";
    case "TRANSLATED":
      return "Translated";
    case "NEW":
    default:
      return "New";
  }
}

function findLatestTranslation(
  segment: SegmentRecord,
  translations: SegmentTranslationRecord[]
): SegmentTranslationRecord | undefined {
  const latestById = segment.latestTranslationId
    ? translations.find((translation) => translation.id === segment.latestTranslationId)
    : undefined;

  if (latestById) {
    return latestById;
  }

  return translations
    .filter((translation) => translation.segmentId === segment.id)
    .sort(
      (left, right) =>
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
    )[0];
}

function toEditorSegment(
  segment: SegmentRecord,
  translations: SegmentTranslationRecord[]
): EditorSegment {
  const latestTranslation = findLatestTranslation(segment, translations);

  return {
    documentId: segment.documentId,
    id: segment.id,
    latestTranslationId: latestTranslation?.id ?? segment.latestTranslationId,
    number: segment.order,
    projectId: segment.projectId,
    source: segment.sourceText,
    sourceLanguage: segment.sourceLanguage,
    status: mapSegmentStatus(segment.status),
    target: latestTranslation?.targetText ?? segment.latestTargetText ?? "",
    targetLanguage: segment.targetLanguage
  };
}

export async function TranslationEditorPage({
  documentId
}: TranslationEditorPageProps) {
  if (!documentId) {
    return (
      <section className="content-panel">
        <EmptyState
          description="Open the editor with a documentId query parameter to load document segments."
          title="No document selected"
        />
      </section>
    );
  }

  const [segmentsResult, translationsResult] = await Promise.all([
    listSegments(documentId),
    listTranslations(documentId)
  ]);
  const error = segmentsResult.error ?? translationsResult.error;

  if (error) {
    return (
      <section className="content-panel">
        <ErrorState message={`Editor data could not be loaded. ${error}`} />
      </section>
    );
  }

  const segments = segmentsResult.data ?? [];
  const translations = translationsResult.data ?? [];

  if (segments.length === 0) {
    return (
      <section className="content-panel">
        <EmptyState
          description="This document has no persisted segments yet."
          title="No segments available"
        />
      </section>
    );
  }

  const editorSegments = [...segments]
    .sort((left, right) => left.order - right.order)
    .map((segment) => toEditorSegment(segment, translations));

  return (
    <TranslationEditorWorkbench
      exportReadiness={editorExportReadiness}
      segments={editorSegments}
      workflowSignals={editorWorkflowSignals}
    />
  );
}
