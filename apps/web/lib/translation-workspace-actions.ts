"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  advanceTranslationWorkflow,
  reviseWorkspaceSource,
  submitWorkspaceTranslation
} from "./translation-workspace-client";

export async function saveWorkspaceTranslationAction(formData: FormData): Promise<void> {
  const documentId = readRequiredString(formData, "documentId");
  const segmentId = readRequiredString(formData, "segmentId");
  const targetText = readRequiredString(formData, "targetText");
  const translatorName = readOptionalString(formData, "translatorName");
  const originalAuthorName = readOptionalString(formData, "originalAuthorName");
  const result = await submitWorkspaceTranslation({
    metadata: {
      originalAuthorName
    },
    segmentId,
    targetText,
    translatorName
  });
  const query = `documentId=${encodeURIComponent(documentId)}&segmentId=${encodeURIComponent(segmentId)}`;

  if (result.error || !result.data) {
    redirect(`/translation?${query}&error=${encodeURIComponent(result.error ?? "Translation could not be saved.")}`);
  }

  revalidatePath("/translation");
  redirect(`/translation?${query}`);
}

export async function reviseWorkspaceSourceAction(formData: FormData): Promise<void> {
  const documentId = readRequiredString(formData, "documentId");
  const segmentId = readRequiredString(formData, "segmentId");
  const result = await reviseWorkspaceSource(segmentId, {
    reason: readRequiredString(formData, "reason"),
    sourceText: readRequiredString(formData, "sourceText")
  });
  redirectTranslationResult(documentId, segmentId, result.error, "Source revision could not be saved.");
}

export async function advanceTranslationWorkflowAction(formData: FormData): Promise<void> {
  const documentId = readRequiredString(formData, "documentId");
  const segmentId = readRequiredString(formData, "segmentId");
  const result = await advanceTranslationWorkflow({
    documentId,
    projectId: readOptionalString(formData, "projectId")
  });
  redirectTranslationResult(documentId, segmentId, result.error, "Workflow could not advance.");
}

function redirectTranslationResult(
  documentId: string,
  segmentId: string,
  error: string | null,
  fallbackError: string
): never {
  const query = new URLSearchParams({ documentId, segmentId });
  if (error) {
    query.set("error", error || fallbackError);
  }
  revalidatePath("/translation");
  redirect(`/translation?${query.toString()}`);
}

function readRequiredString(formData: FormData, fieldName: string): string {
  const value = formData.get(fieldName);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function readOptionalString(formData: FormData, fieldName: string): string | undefined {
  const value = readRequiredString(formData, fieldName);

  return value.length > 0 ? value : undefined;
}
